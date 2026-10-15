import { describe, expect, it } from "bun:test";
import { render } from "@react-email/render";
import { AdminInvitationEmail } from "../src/components/emails/AdminInvitationEmail";
import { InquiryConfirmationEmail } from "../src/components/emails/InquiryConfirmationEmail";
import { InquiryNotificationEmail } from "../src/components/emails/InquiryNotificationEmail";
import { publicInquirySchema } from "../src/lib/schemas/lead";

describe("React Email Rendering", () => {
  it("renders AdminInvitationEmail to HTML with token link and role", async () => {
    const html = await render(
      AdminInvitationEmail({
        name: "Adebayo Adeleke",
        invitedBy: "Managing Director",
        role: "admin",
        acceptUrl:
          "https://finergetics.com/admin/accept-invitation?token=xyz123abc",
      }),
    );

    expect(html).toContain("Finergetics");
    expect(html).toContain("Adebayo Adeleke");
    expect(html).toContain("Managing Director");
    expect(html).toContain("Administrator");
    expect(html).toContain(
      "https://finergetics.com/admin/accept-invitation?token=xyz123abc",
    );
    expect(html).toContain("Accept Invitation &amp; Set Password");
    expect(html).toContain("48 hours");
  });

  it("renders InquiryNotificationEmail to HTML for internal advisory team", async () => {
    const html = await render(
      InquiryNotificationEmail({
        inquiryType: "Consultation Request",
        name: "Chukwudi Okafor",
        email: "c.okafor@energyassets.ng",
        phone: "+234 803 111 2233",
        company: "Deepwater Exploration JV",
        interest: "E & P Fiscal Regime & Petroleum Profit Tax",
        preferredTime: "Within 24–48 Hours",
        message:
          "We need an independent audit of our joint venture cost allocations under the PIA.",
        dashboardUrl: "https://finergetics.com/admin/leads",
      }),
    );

    expect(html).toContain("FINERGETICS");
    expect(html).toContain("Consultation Request");
    expect(html).toContain("Chukwudi Okafor");
    expect(html).toContain("c.okafor@energyassets.ng");
    expect(html).toContain("Deepwater Exploration JV");
    expect(html).toContain("View Inquiries in Admin Portal");
  });

  it("renders InquiryConfirmationEmail to HTML for client acknowledgement", async () => {
    const html = await render(
      InquiryConfirmationEmail({
        name: "Folake Davies",
        interest: "Commercial Economics & Asset Valuation",
      }),
    );

    expect(html).toContain("FINERGETICS");
    expect(html).toContain("Folake Davies");
    expect(html).toContain("Commercial Economics &amp; Asset Valuation");
    expect(html).toContain("What happens next?");
    expect(html).toContain("info@finergetics.com");
  });

  it("renders PasswordResetEmail to HTML with secure link and expiry notice", async () => {
    const { PasswordResetEmail } = await import(
      "../src/components/emails/PasswordResetEmail"
    );
    const html = await render(
      PasswordResetEmail({
        name: "Babajide Williams",
        requestedBy: "Managing Director",
        resetUrl:
          "https://finergetics.com/admin/reset-password?token=secret123",
      }),
    );

    expect(html).toContain("FINERGETICS");
    expect(html).toContain("Babajide Williams");
    expect(html).toContain("Managing Director");
    expect(html).toContain("Reset My Password");
    expect(html).toContain("2 hours");
    expect(html).toContain(
      "https://finergetics.com/admin/reset-password?token=secret123",
    );
  });
});

describe("Public Lead Inquiries Schema & Honeypot", () => {
  it("validates legitimate consultation input", () => {
    const valid = {
      type: "book_call" as const,
      name: "Tariq Al-Mansoor",
      email: "tariq@investments.com",
      phone: "+234 802 345 6789",
      company: "West African Energy Capital",
      interest: "Financial Control & Joint Venture Advisory",
      preferredTime: "Upcoming Week",
      message: "Exploring advisory scope for deepwater asset acquisition.",
      recaptchaToken: "valid-token-sample",
    };

    const res = publicInquirySchema.safeParse(valid);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.websiteUrl).toBe("");
    }
  });

  it("rejects submission if honeypot trap is filled by spambots", () => {
    const bot = {
      type: "book_call" as const,
      name: "Spam Bot",
      email: "bot@spammer.org",
      websiteUrl: "https://spam-poker-casino.com", // Honeypot filled
      recaptchaToken: "sample-token",
    };

    const res = publicInquirySchema.safeParse(bot);
    expect(res.success).toBe(false);
  });

  it("rejects invalid email address", () => {
    const invalid = {
      name: "Folake",
      email: "not-an-email",
      recaptchaToken: "token-123",
    };

    const res = publicInquirySchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });
});
