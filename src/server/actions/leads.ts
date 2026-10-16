"use server";

import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { env } from "@/env";
import {
  MIN_FORM_DWELL_TIME_MS,
  sanitizeSecurityInput,
} from "@/lib/constants/security";
import {
  leadUpdateSchema,
  type PublicInquiryInput,
  publicInquirySchema,
} from "@/lib/schemas/lead";
import { recordAuditLog } from "@/server/audit/audit";
import { requireAdmin } from "@/server/auth/guard";
import { db } from "@/server/db/client";
import { leads } from "@/server/db/schema";
import { sendLeadInquiryEmails } from "@/server/email/send";
import { checkRateLimit } from "@/server/security/ratelimit";

export type { PublicInquiryInput };

export async function verifyRecaptcha(
  token: string,
  expectedAction = "book_call",
): Promise<{ success: boolean; score?: number }> {
  // Allow dev/test tokens in development or test suites
  if (
    (process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "test") &&
    (token === "dev-bypass" ||
      token === "test-token" ||
      token === "test-valid-token" ||
      token.length < 10)
  ) {
    return { success: true, score: 90 };
  }

  if (
    (process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "test") &&
    (token === "test-invalid-token" || token === "test-low-score-token")
  ) {
    return { success: false, score: 30 };
  }

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const data = await res.json();
    if (!data.success) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[reCAPTCHA] Dev fallback triggered:",
          data["error-codes"],
        );
        return { success: true, score: 85 };
      }
      return { success: false };
    }

    // Verify action match
    if (data.action && data.action !== expectedAction) {
      console.warn(
        `[reCAPTCHA] Action mismatch: expected ${expectedAction}, received ${data.action}`,
      );
      return {
        success: false,
        score:
          typeof data.score === "number" ? Math.round(data.score * 100) : 0,
      };
    }

    const rawScore = typeof data.score === "number" ? data.score : 0.9;
    // Score threshold check >= 0.5 per §4.3
    if (rawScore < 0.5) {
      return { success: false, score: Math.round(rawScore * 100) };
    }

    const score = Math.round(rawScore * 100);
    return { success: true, score };
  } catch (err) {
    console.error("[reCAPTCHA] Verification error:", err);
    if (process.env.NODE_ENV === "development") {
      return { success: true, score: 85 };
    }
    return { success: false };
  }
}

/**
 * Public action for visitors to submit consultation requests or contact inquiries.
 * Integrates rate limiting, honeypot spam protection, dwell-time analysis, reCAPTCHA v3,
 * Neon DB persistence, and branded React Email notifications via Brevo.
 */
export async function submitLeadInquiryAction(rawInput: unknown) {
  // 1. Honeypot check: spambots fill hidden websiteUrl
  if (
    typeof rawInput === "object" &&
    rawInput !== null &&
    "websiteUrl" in rawInput &&
    (rawInput as { websiteUrl: unknown }).websiteUrl
  ) {
    return {
      success: true,
      message: "Thank you for contacting Finergetics Advisory Services.",
    };
  }

  // 1b. Dwell time check: reject automated bot scripts submitting faster than humanly possible (<1.5s)
  if (
    typeof rawInput === "object" &&
    rawInput !== null &&
    "formLoadedAt" in rawInput
  ) {
    const loadedAt = Number(
      (rawInput as { formLoadedAt: unknown }).formLoadedAt,
    );
    if (loadedAt && Date.now() - loadedAt < MIN_FORM_DWELL_TIME_MS) {
      // Silently swallow bot submission without leaking detection
      return {
        success: true,
        message: "Thank you for contacting Finergetics Advisory Services.",
      };
    }
  }

  // 2. Rate limit verification (5 requests per hour per IP)
  const rateLimitResult = await checkRateLimit("book_call");
  if (!rateLimitResult.allowed) {
    return {
      success: false,
      error:
        "Too many consultation requests from your connection. Please wait an hour or contact us directly at info@finergetics.com.",
    };
  }

  // 3. Schema validation
  const validated = publicInquirySchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error:
        "Please check your submission: " +
        validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  // 3b. Dual Rate limit: verify per-email limit to prevent targeted inbox flooding
  const emailRateLimit = await checkRateLimit(
    "book_call",
    `email:${validated.data.email.toLowerCase()}`,
  );
  if (!emailRateLimit.allowed) {
    return {
      success: false,
      error:
        "Too many consultation requests for this email address. Please wait an hour or contact us directly at info@finergetics.com.",
    };
  }

  // 4. reCAPTCHA verification
  const recaptcha = await verifyRecaptcha(
    validated.data.recaptchaToken,
    validated.data.type || "book_call",
  );
  if (!recaptcha.success) {
    return {
      success: false,
      error:
        "Security validation could not be completed. Please refresh and try again.",
    };
  }

  // 5. Client IP hash for privacy
  const h = await headers();
  const clientIp =
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "127.0.0.1";
  const ipHash = createHash("sha256")
    .update(`${env.RATE_LIMIT_SALT}:${clientIp}`)
    .digest("hex")
    .substring(0, 32);

  // 6. Neon DB insertion with sanitized text
  const [newLead] = await db
    .insert(leads)
    .values({
      type: validated.data.type,
      name: sanitizeSecurityInput(validated.data.name),
      email: validated.data.email.toLowerCase().trim(),
      phone: validated.data.phone
        ? sanitizeSecurityInput(validated.data.phone)
        : null,
      company: validated.data.company
        ? sanitizeSecurityInput(validated.data.company)
        : null,
      interest: validated.data.interest || null,
      preferredTime: validated.data.preferredTime || null,
      message: validated.data.message
        ? sanitizeSecurityInput(validated.data.message)
        : null,
      recaptchaScore: recaptcha.score ?? 90,
      ipHash,
      status: "new",
    })
    .returning();

  // 7. Dispatch branded React Emails (internal alert + client acknowledgement)
  try {
    await sendLeadInquiryEmails({
      type: newLead.type,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      company: newLead.company,
      interest: newLead.interest,
      preferredTime: newLead.preferredTime,
      message: newLead.message,
    });
  } catch (emailErr) {
    console.error("[Lead Inquiries] Email dispatch warning:", emailErr);
    // Even if transactional email dispatch encountered a network timeout,
    // the lead is securely saved in DB so we still return success to the visitor
  }

  return {
    success: true,
    message:
      "Thank you for reaching out to Finergetics Advisory Services. Our partners have received your request and will follow up promptly.",
    leadId: newLead.id,
  };
}

export async function updateLeadStatusAction(rawInput: unknown) {
  const { user } = await requireAdmin();

  const validated = leadUpdateSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error:
        "Validation failed: " +
        validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  const [lead] = await db
    .update(leads)
    .set({
      status: validated.data.status,
      notes: validated.data.notes,
      updatedAt: new Date(),
    })
    .where(eq(leads.id, validated.data.id))
    .returning();

  await recordAuditLog({
    userId: user.id,
    action: "lead.update_status",
    entity: "leads",
    entityId: validated.data.id,
    summary: { status: validated.data.status },
  });

  return { success: true, lead };
}

export async function deleteLeadAction(id: string) {
  const { user } = await requireAdmin();

  const [deleted] = await db.delete(leads).where(eq(leads.id, id)).returning();

  if (deleted) {
    await recordAuditLog({
      userId: user.id,
      action: "lead.delete",
      entity: "leads",
      entityId: id,
      summary: { email: deleted.email },
    });
  }

  return { success: true };
}
