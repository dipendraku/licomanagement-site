import nodemailer, { type Transporter } from "nodemailer";

/**
 * Transactional email for the marketing site (demo requests, orders, receipts).
 *
 * Priority:
 *  1. Gmail SMTP (GMAIL_USER + GMAIL_APP_PASSWORD)  -> default sender SUPPORT_EMAIL (support@gmail.com)
 *  2. Resend  (RESEND_API_KEY)                       -> REST call, no SMTP
 *  3. Brevo   (BREVO_API_KEY)                        -> REST call, no SMTP
 *
 * With nothing configured the message is logged and reported as "skipped" so local
 * development and previews never fail because of mail.
 */

export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL?.trim() || "support@gmail.com";
export const SUPPORT_NAME = process.env.SUPPORT_NAME?.trim() || "EduCore SMS Support";
export const SALES_EMAIL = process.env.SALES_EMAIL?.trim() || SUPPORT_EMAIL;

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export type MailResult = { ok: true; via: string } | { ok: false; via: string; error: string };

let transporter: Transporter | null = null;

function gmailTransport(): Transporter | null {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }
  return transporter;
}

function fromAddress(): string {
  const user = process.env.GMAIL_USER?.trim();
  if (user) return `"${SUPPORT_NAME}" <${user}>`;
  if (process.env.RESEND_FROM_EMAIL) return `${SUPPORT_NAME} <${process.env.RESEND_FROM_EMAIL}>`;
  if (process.env.BREVO_FROM_EMAIL) return `${SUPPORT_NAME} <${process.env.BREVO_FROM_EMAIL}>`;
  return `${SUPPORT_NAME} <${SUPPORT_EMAIL}>`;
}

export async function sendMail(message: MailMessage): Promise<MailResult> {
  const html = message.html ?? `<pre style="font:14px/1.6 ui-monospace,Menlo,monospace;white-space:pre-wrap">${escapeHtml(message.text)}</pre>`;

  const smtp = gmailTransport();
  if (smtp) {
    try {
      await smtp.sendMail({
        from: fromAddress(),
        to: message.to,
        subject: message.subject,
        text: message.text,
        html,
        replyTo: message.replyTo,
      });
      return { ok: true, via: "gmail-smtp" };
    } catch (error) {
      return { ok: false, via: "gmail-smtp", error: error instanceof Error ? error.message : String(error) };
    }
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${resendKey}`, "content-type": "application/json" },
        body: JSON.stringify({ from: fromAddress(), to: [message.to], subject: message.subject, text: message.text, html }),
      });
      if (!response.ok) throw new Error(`resend ${response.status}: ${await response.text()}`);
      return { ok: true, via: "resend" };
    } catch (error) {
      return { ok: false, via: "resend", error: error instanceof Error ? error.message : String(error) };
    }
  }

  const brevoKey = process.env.BREVO_API_KEY?.trim();
  if (brevoKey) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": brevoKey, "content-type": "application/json" },
        body: JSON.stringify({
          sender: { email: process.env.BREVO_FROM_EMAIL || SUPPORT_EMAIL, name: SUPPORT_NAME },
          to: [{ email: message.to }],
          subject: message.subject,
          textContent: message.text,
          htmlContent: html,
        }),
      });
      if (!response.ok) throw new Error(`brevo ${response.status}: ${await response.text()}`);
      return { ok: true, via: "brevo" };
    } catch (error) {
      return { ok: false, via: "brevo", error: error instanceof Error ? error.message : String(error) };
    }
  }

  console.info(`[mail:skipped] to=${message.to} subject=${message.subject}`);
  return { ok: false, via: "none", error: "no mail provider configured" };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Small branded wrapper so every message looks like it came from the product. */
export function brandedEmail(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f6f4eb;padding:24px;font:15px/1.6 'Segoe UI',system-ui,sans-serif;color:#102313">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e3e7df">
    <tr><td style="background:linear-gradient(135deg,#1d6b42,#2f8f5b);padding:20px 24px;color:#eff8f0;font-weight:700;font-size:16px">EduCore SMS</td></tr>
    <tr><td style="padding:24px">
      <h1 style="margin:0 0 12px;font-size:19px;color:#102313">${escapeHtml(title)}</h1>
      ${bodyHtml}
    </td></tr>
    <tr><td style="padding:16px 24px;background:#f8faf7;color:#597062;font-size:12px">
      Need help? Reply to this email or write to <a href="mailto:${SUPPORT_EMAIL}" style="color:#1d6b42">${SUPPORT_EMAIL}</a>.
    </td></tr>
  </table>
</body></html>`;
}
