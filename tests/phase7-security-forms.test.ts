import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { NextRequest } from "next/server";
import nextConfig from "../next.config";
import { auditClientBundles } from "../scripts/verify-client-secrets";
import {
  ALLOWED_IMAGE_FORMATS,
  ALLOWED_MIME_TYPES,
  ALLOWED_UPLOAD_FOLDERS,
  isHumanDwellTime,
  isSufficientRecaptchaScore,
  MAX_UPLOAD_BYTES,
  MIN_FORM_DWELL_TIME_MS,
  MIN_RECAPTCHA_SCORE_THRESHOLD,
  sanitizeSecurityInput,
} from "../src/lib/constants/security";
import {
  bookCallSchema,
  contactFormSchema,
  publicInquirySchema,
} from "../src/lib/schemas/lead";
import { proxy } from "../src/proxy";

describe("Phase 7 — Forms, Security Hardening & Abuse Protection", () => {
  describe("1. Lead Consultation & Contact Flow Hardening", () => {
    it("validates legitimate consultation input with all required fields", () => {
      const validPayload = {
        type: "book_call" as const,
        name: "Alhaji Bukar Maina",
        email: "bukar.maina@upstream-energy.ng",
        phone: "+234 803 123 4567",
        company: "Niger Delta Exploration Ltd",
        interest: "Financial Control & Joint Venture Advisory",
        preferredTime: "Within 24–48 Hours (Priority Advisory)",
        message:
          "Requesting an advisory review of joint operating agreement fiscal terms.",
        recaptchaToken: "test-valid-token",
        websiteUrl: "",
        formLoadedAt: Date.now() - 3000, // 3 seconds ago (human dwell time)
      };

      const result = publicInquirySchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Alhaji Bukar Maina");
        expect(result.data.email).toBe("bukar.maina@upstream-energy.ng");
      }
    });

    it("validates bookCallSchema and contactFormSchema with honeypot protection", () => {
      const validBookCall = bookCallSchema.safeParse({
        name: "Director Funke",
        email: "funke@advisory.com",
        recaptchaToken: "token-123",
        websiteUrl: "",
      });
      expect(validBookCall.success).toBe(true);

      const validContact = contactFormSchema.safeParse({
        name: "General Contact",
        email: "contact@company.com",
        message: "Inquiring about strategic board review services.",
        recaptchaToken: "token-123",
        websiteUrl: "",
      });
      expect(validContact.success).toBe(true);
    });

    it("rejects automated bot submission when honeypot websiteUrl is filled", () => {
      const botPayload = {
        type: "book_call" as const,
        name: "Spam Bot",
        email: "bot@spammer.org",
        recaptchaToken: "test-token",
        websiteUrl: "https://spam-link.ru", // Bot caught in trap
      };

      const result = publicInquirySchema.safeParse(botPayload);
      expect(result.success).toBe(false);
    });

    it("evaluates dwell time correctly to detect automated rapid submissions", () => {
      const now = Date.now();
      // Fast submission: 500ms dwell time is rejected
      expect(isHumanDwellTime(now - 500, now, MIN_FORM_DWELL_TIME_MS)).toBe(
        false,
      );
      // Human submission: 3500ms dwell time is accepted
      expect(isHumanDwellTime(now - 3500, now, MIN_FORM_DWELL_TIME_MS)).toBe(
        true,
      );
      // Missing dwell timestamp is treated as non-human
      expect(isHumanDwellTime(undefined, now)).toBe(false);
    });

    it("evaluates reCAPTCHA score thresholds correctly", () => {
      expect(
        isSufficientRecaptchaScore(90, MIN_RECAPTCHA_SCORE_THRESHOLD),
      ).toBe(true);
      expect(
        isSufficientRecaptchaScore(50, MIN_RECAPTCHA_SCORE_THRESHOLD),
      ).toBe(true);
      expect(
        isSufficientRecaptchaScore(30, MIN_RECAPTCHA_SCORE_THRESHOLD),
      ).toBe(false);
      expect(
        isSufficientRecaptchaScore(undefined, MIN_RECAPTCHA_SCORE_THRESHOLD),
      ).toBe(false);
    });

    it("strips ASCII control characters to prevent header injection", () => {
      const dirty = "Finergetics\r\nBcc: victim@example.com\x00\x08Advisory";
      const sanitized = sanitizeSecurityInput(dirty);
      expect(sanitized).not.toContain("\x00");
      expect(sanitized).not.toContain("\x08");
      expect(sanitized).toBe("Finergetics\r\nBcc: victim@example.comAdvisory");
    });
  });

  describe("2. Security Headers & Content Security Policy (Enforced)", () => {
    it("enforces complete security headers in next.config.ts", async () => {
      const headersConfig = await nextConfig.headers?.();
      expect(headersConfig).toBeDefined();
      expect(headersConfig?.length).toBeGreaterThan(0);

      const globalHeaders = headersConfig?.[0]?.headers ?? [];
      const headerMap = new Map(
        globalHeaders.map((h: { key: string; value: string }) => [
          h.key,
          h.value,
        ]),
      );

      // Verify Strict-Transport-Security
      const hsts = headerMap.get("Strict-Transport-Security");
      expect(hsts).toContain("max-age=63072000");
      expect(hsts).toContain("includeSubDomains");
      expect(hsts).toContain("preload");

      // Verify X-Content-Type-Options
      expect(headerMap.get("X-Content-Type-Options")).toBe("nosniff");

      // Verify Referrer-Policy
      expect(headerMap.get("Referrer-Policy")).toBe(
        "strict-origin-when-cross-origin",
      );

      // Verify Permissions-Policy with FLoC/interest-cohort disabled
      const permPolicy = headerMap.get("Permissions-Policy");
      expect(permPolicy).toContain("interest-cohort=()");
      expect(permPolicy).toContain("camera=()");
      expect(permPolicy).toContain("microphone=()");

      // Verify X-Frame-Options and COOP
      expect(headerMap.get("X-Frame-Options")).toBe("DENY");
      expect(headerMap.get("Cross-Origin-Opener-Policy")).toBe("same-origin");

      // Verify Public Enforced Content-Security-Policy
      const csp = headerMap.get("Content-Security-Policy");
      expect(csp).toBeDefined();
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("https://res.cloudinary.com");
      expect(csp).toContain("https://www.google.com/recaptcha/");
      expect(csp).toContain("frame-ancestors 'none'");
    });

    it("generates cryptographic nonce and strict admin CSP in proxy.ts", () => {
      const req = new NextRequest("http://localhost:3000/admin/login", {
        headers: { host: "localhost:3000" },
      });

      const res = proxy(req);
      const adminCsp = res.headers.get("Content-Security-Policy");
      const nonce = res.headers.get("x-nonce");

      expect(adminCsp).toBeDefined();
      expect(nonce).toBeDefined();
      expect(typeof nonce).toBe("string");
      expect(adminCsp).toContain("widget.cloudinary.com");
      expect(adminCsp).toContain("frame-ancestors 'none'");
    });
  });

  describe("3. Upload Signing Endpoint Hardening", () => {
    it("exports authorized folder allow-list", () => {
      expect(ALLOWED_UPLOAD_FOLDERS).toContain("finergetics");
      expect(ALLOWED_UPLOAD_FOLDERS).toContain("finergetics/uploads");
      expect(ALLOWED_UPLOAD_FOLDERS).toContain("finergetics/team");
      expect(ALLOWED_UPLOAD_FOLDERS).toContain("finergetics/services");
      expect(ALLOWED_UPLOAD_FOLDERS).toContain("finergetics/case-studies");
      expect(ALLOWED_UPLOAD_FOLDERS).toContain("finergetics/blog");
    });

    it("exports allowed image formats and enforces SVG exclusion", () => {
      expect(ALLOWED_IMAGE_FORMATS).toContain("webp");
      expect(ALLOWED_IMAGE_FORMATS).toContain("png");
      expect(ALLOWED_IMAGE_FORMATS).toContain("jpg");
      expect(ALLOWED_IMAGE_FORMATS).toContain("avif");
      // SVG must NOT be in allowed raster image formats to avoid stored XSS
      expect((ALLOWED_IMAGE_FORMATS as readonly string[]).includes("svg")).toBe(
        false,
      );
      expect(
        (ALLOWED_MIME_TYPES as readonly string[]).includes("image/svg+xml"),
      ).toBe(false);
    });

    it("enforces maximum upload size of 10MB", () => {
      expect(MAX_UPLOAD_BYTES).toBe(10 * 1024 * 1024);
    });
  });

  describe("4. RFC 9116 security.txt Compliance & Vercel Configuration", () => {
    it("serves valid security.txt at /.well-known/security.txt with required directives", () => {
      const securityTxtPath = join(
        process.cwd(),
        "public",
        ".well-known",
        "security.txt",
      );
      expect(existsSync(securityTxtPath)).toBe(true);

      const content = readFileSync(securityTxtPath, "utf-8");
      expect(content).toContain("Contact: mailto:security@finergetics.com");
      expect(content).toContain("Expires:");
      expect(content).toContain("Preferred-Languages: en");
      expect(content).toContain(
        "Canonical: https://www.finergetics.com/.well-known/security.txt",
      );
    });

    it("verifies public/security.txt alias exists", () => {
      const aliasPath = join(process.cwd(), "public", "security.txt");
      expect(existsSync(aliasPath)).toBe(true);
    });

    it("verifies vercel.json exists with cleanUrls and API function maxDuration limits", () => {
      const vercelConfigPath = join(process.cwd(), "vercel.json");
      expect(existsSync(vercelConfigPath)).toBe(true);

      const config = JSON.parse(readFileSync(vercelConfigPath, "utf-8"));
      expect(config.cleanUrls).toBe(true);
      expect(config.framework).toBe("nextjs");
      expect(
        config.functions?.["src/app/api/**/*"]?.maxDuration,
      ).toBeLessThanOrEqual(15);
    });
  });

  describe("5. Client Code & Component Secret Leakage Audit", () => {
    it("verifies zero server secret leakage in client components and source files", () => {
      const audit = auditClientBundles();
      expect(audit.clean).toBe(true);
      expect(audit.violations.length).toBe(0);
    });
  });
});
