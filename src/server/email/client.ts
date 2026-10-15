import "server-only";
import { env } from "@/env";

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface SendEmailOptions {
  to: EmailRecipient | EmailRecipient[];
  subject: string;
  html: string;
  replyTo?: EmailRecipient;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Sends a transactional email using the Brevo (Sendinblue) API v3
 */
export async function sendTransactionalEmail(
  options: SendEmailOptions,
): Promise<SendEmailResult> {
  const recipients = Array.isArray(options.to) ? options.to : [options.to];

  const payload: {
    sender: { name: string; email: string };
    to: { email: string; name?: string }[];
    subject: string;
    htmlContent: string;
    replyTo?: { email: string; name?: string };
  } = {
    sender: {
      name: env.BREVO_SENDER_NAME,
      email: env.BREVO_SENDER_EMAIL,
    },
    to: recipients.map((r) => ({
      email: r.email,
      name: r.name || r.email.split("@")[0],
    })),
    subject: options.subject,
    htmlContent: options.html,
  };

  if (options.replyTo) {
    payload.replyTo = {
      email: options.replyTo.email,
      name: options.replyTo.name,
    };
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message =
        errorData.message || `Brevo API error with HTTP ${res.status}`;
      console.error("[Email Error] Failed to send email via Brevo:", message);
      return { success: false, error: message };
    }

    const data = (await res.json().catch(() => ({}))) as { messageId?: string };
    return { success: true, messageId: data.messageId };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Network error dispatching email";
    console.error("[Email Error] Exception sending email:", message);
    return { success: false, error: message };
  }
}
