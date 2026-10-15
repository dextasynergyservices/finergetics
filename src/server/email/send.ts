import "server-only";
import { render } from "@react-email/render";
import { AdminInvitationEmail } from "@/components/emails/AdminInvitationEmail";
import { InquiryConfirmationEmail } from "@/components/emails/InquiryConfirmationEmail";
import { InquiryNotificationEmail } from "@/components/emails/InquiryNotificationEmail";
import { PasswordResetEmail } from "@/components/emails/PasswordResetEmail";
import { env } from "@/env";
import { sendTransactionalEmail } from "./client";

/**
 * Sends a branded invitation email to a newly invited administrator or editor
 */
export async function sendAdminInvitationEmail({
  name,
  email,
  role,
  token,
  invitedBy,
}: {
  name: string;
  email: string;
  role: string;
  token: string;
  invitedBy: string;
}) {
  const acceptUrl = `${env.NEXT_PUBLIC_SITE_URL}/admin/accept-invitation?token=${token}`;

  const html = await render(
    AdminInvitationEmail({
      name,
      invitedBy,
      role,
      acceptUrl,
    }),
  );

  return sendTransactionalEmail({
    to: { email, name },
    subject: "Invitation to join Finergetics Administration Portal",
    html,
  });
}

/**
 * Sends a branded password reset email with secure 2-hour link
 */
export async function sendPasswordResetEmail({
  name,
  email,
  token,
  requestedBy,
}: {
  name: string;
  email: string;
  token: string;
  requestedBy: string;
}) {
  const resetUrl = `${env.NEXT_PUBLIC_SITE_URL}/admin/reset-password?token=${token}`;

  const html = await render(
    PasswordResetEmail({
      name,
      requestedBy,
      resetUrl,
    }),
  );

  return sendTransactionalEmail({
    to: { email, name },
    subject: "Reset your Finergetics Administration password",
    html,
  });
}

export interface NewLeadEmailData {
  type: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  interest?: string | null;
  preferredTime?: string | null;
  message?: string | null;
}

/**
 * Sends both internal team notifications and client confirmation emails for new inquiries
 */
export async function sendLeadInquiryEmails(lead: NewLeadEmailData) {
  const typeDisplay =
    lead.type === "book_call"
      ? "Consultation Request"
      : "General Advisory Inquiry";

  // 1. Notify internal Finergetics advisory team
  const adminHtml = await render(
    InquiryNotificationEmail({
      inquiryType: typeDisplay,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      interest: lead.interest,
      preferredTime: lead.preferredTime,
      message: lead.message,
      dashboardUrl: `${env.NEXT_PUBLIC_SITE_URL}/admin/leads`,
    }),
  );

  const internalPromise = sendTransactionalEmail({
    to: {
      email: env.LEADS_NOTIFY_EMAIL,
      name: "Finergetics Leads Desk",
    },
    replyTo: {
      email: lead.email,
      name: lead.name,
    },
    subject: `[New Lead] ${typeDisplay} from ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
    html: adminHtml,
  });

  // 2. Send confirmation to prospective client
  const clientHtml = await render(
    InquiryConfirmationEmail({
      name: lead.name,
      interest: lead.interest || "Strategic Financial Advisory",
    }),
  );

  const clientPromise = sendTransactionalEmail({
    to: {
      email: lead.email,
      name: lead.name,
    },
    subject: "Thank you for contacting Finergetics Advisory Services",
    html: clientHtml,
  });

  const [internalResult, clientResult] = await Promise.allSettled([
    internalPromise,
    clientPromise,
  ]);

  return {
    internalSent:
      internalResult.status === "fulfilled" && internalResult.value.success,
    clientSent:
      clientResult.status === "fulfilled" && clientResult.value.success,
  };
}
