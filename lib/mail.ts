import nodemailer from 'nodemailer';
import type { SentMessageInfo } from 'nodemailer';
import { MAILTRAP_CONFIG } from './data';

/**
 * Creates a Nodemailer SMTP transporter configured for Mailtrap.
 * Using Mailtrap SMTP: live.smtp.mailtrap.io on port 587 (STARTTLS).
 */
export function createMailTransport() {
  const { host, port, auth } = MAILTRAP_CONFIG;
  return nodemailer.createTransport({
    host,
    port,
    auth: {
      user: auth.user,
      pass: auth.pass,
    },
  });
}

// Cached transporter instance across serverless invocations
let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;

export function getMailTransport() {
  if (!cachedTransporter) {
    cachedTransporter = createMailTransport();
  }
  return cachedTransporter;
}

export interface SendMailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export interface SendMailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Core sendMail function wrapping nodemailer.sendMail with Promise resolution.
 * Logs output and returns a structured result.
 */
export async function sendMail(options: SendMailOptions): Promise<SendMailResult> {
  const from = options.from || MAILTRAP_CONFIG.defaults.from;
  const to = options.to;

  if (!MAILTRAP_CONFIG.auth.pass) {
    const errorMsg =
      'Mailtrap SMTP password/token is not configured. Set MAILTRAP_SMTP_PASS in .env.local.';
    console.warn(`[Mailtrap Warning] ${errorMsg}`);
    return { success: false, error: errorMsg };
  }

  const transport = getMailTransport();

  try {
    const info: SentMessageInfo = await new Promise((resolve, reject) => {
      transport.sendMail(
        {
          from,
          to,
          subject: options.subject,
          text: options.text,
          html: options.html,
          replyTo: options.replyTo,
        },
        (error, info) => {
          if (error) {
            console.error('[Mailtrap Error]', error);
            return reject(error);
          }
          console.log('Message sent: %s', info.messageId);
          resolve(info);
        }
      );
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to send email via Mailtrap SMTP.',
    };
  }
}

/**
 * Quick test email helper directly corresponding to the initial Mailtrap sample.
 * Sends test email to specified recipient or default test recipient.
 * Check sent logs at: https://mailtrap.io/sending/email_logs
 */
export async function sendTestEmail(recipient?: string): Promise<SendMailResult> {
  return sendMail({
    from: MAILTRAP_CONFIG.defaults.from,
    to: recipient || MAILTRAP_CONFIG.defaults.to,
    subject: 'Hello from Mailtrap',
    text: 'This is a test e-mail message.',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff; color: #171717;">
        <div style="border-bottom: 2px solid #087A43; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #087A43; margin: 0 0 6px 0; font-size: 20px;">Hello from Mailtrap!</h2>
          <p style="margin: 0; color: #4b5563; font-size: 14px;">Anjuman Talaba-e-Islam (ATI) — UAF Chapter</p>
        </div>
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">This is a test e-mail message confirming your Mailtrap SMTP live sending configuration.</p>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 20px; font-size: 13px; color: #374151;">
          <p style="margin: 0 0 8px 0;"><strong>Host:</strong> <code>live.smtp.mailtrap.io:587</code></p>
          <p style="margin: 0 0 8px 0;"><strong>Sender:</strong> <code>${MAILTRAP_CONFIG.defaults.from}</code></p>
          <p style="margin: 0;"><strong>Recipient:</strong> <code>${recipient || MAILTRAP_CONFIG.defaults.to}</code></p>
        </div>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; margin: 0;">
          Inspect and monitor email delivery status in your Mailtrap dashboard:
          <br />
          <a href="https://mailtrap.io/sending/email_logs" style="color: #087A43; text-decoration: underline; font-weight: 600;">
            https://mailtrap.io/sending/email_logs
          </a>
        </p>
      </div>
    `,
  });
}
