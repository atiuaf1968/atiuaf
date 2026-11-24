import nodemailer from 'nodemailer';
import type { SentMessageInfo } from 'nodemailer';
import { MAILTRAP_CONFIG, OFFICIAL_MOTTO } from './data';

export interface MailAttachment {
  filename: string;
  content?: Buffer | string;
  path?: string;
  contentType?: string;
}

export interface SendMailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  attachments?: MailAttachment[];
}

export interface SendMailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Creates a Nodemailer SMTP transporter configured for Mailtrap.
 * Using Mailtrap SMTP: live.smtp.mailtrap.io on port 587 (STARTTLS).
 */
export function createMailTransport() {
  const { host, port, auth } = MAILTRAP_CONFIG;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
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

/**
 * Core sendMail function wrapping nodemailer.sendMail with Promise resolution.
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
          attachments: options.attachments,
        },
        (error, info) => {
          if (error) {
            console.error('[Mailtrap Error]', error);
            return reject(error);
          }
          console.log('Message sent: %s to %s', info.messageId, to);
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
 * Sends both the admin notification email and the submitter's auto-reply confirmation for contact queries.
 */
export async function sendContactInquiryEmails(data: {
  name: string;
  email: string;
  subject: string;
  category?: string;
  message: string;
  referenceId: string;
}) {
  const adminEmail = process.env.CONTACT_RECEIVER_EMAIL || MAILTRAP_CONFIG.defaults.to;
  const categoryText = data.category || 'General Inquiry';

  // 1. Send all inquiry details to Chapter Admin / Secretariat
  const adminPromise = sendMail({
    to: adminEmail,
    replyTo: `${data.name} <${data.email}>`,
    subject: `[New Inquiry] ${data.subject} — ${data.name} (${categoryText})`,
    text: `New contact inquiry received at ATI UAF:\n\nReference ID: ${data.referenceId}\nSender: ${data.name} (${data.email})\nCategory: ${categoryText}\nSubject: ${data.subject}\n\nMessage:\n${data.message}\n\nSubmitted on: ${new Date().toLocaleString()}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; color: #171717;">
        <div style="border-bottom: 2px solid #087A43; padding-bottom: 12px; margin-bottom: 18px;">
          <h2 style="margin: 0; color: #087A43; font-size: 20px;">New Contact Inquiry — ATI UAF</h2>
          <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">Reference ID: <strong>${data.referenceId}</strong></p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 18px;">
          <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 8px 0; font-weight: bold; width: 120px; color: #4b5563;">Sender:</td><td><strong>${data.name}</strong> &lt;${data.email}&gt;</td></tr>
          <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Category:</td><td>${categoryText}</td></tr>
          <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Subject:</td><td>${data.subject}</td></tr>
        </table>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <p style="margin: 0 0 6px; font-weight: bold; font-size: 13px; color: #374151;">Inquiry Message:</p>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #1f2937;">${data.message}</p>
        </div>
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">Hit Reply in your email client to respond directly to ${data.name} (${data.email}).</p>
      </div>
    `,
  });

  // 2. Send automated confirmation back to the student / inquirer
  const autoReplyPromise = sendMail({
    to: `${data.name} <${data.email}>`,
    replyTo: adminEmail,
    subject: `Your message is received [${data.referenceId}] — Anjuman Talaba-e-Islam (ATI UAF)`,
    text: `Assalam-o-Alaikum ${data.name},\n\nThank you for reaching out to Anjuman Talaba-e-Islam (ATI) - University of Agriculture Faisalabad Chapter.\n\nYour message regarding "${data.subject}" has been successfully received (Reference: ${data.referenceId}).\n\nOur team will review your inquiry and we will contact you soon.\n\nSummary of your message:\n${data.message}\n\nJazakAllah Khair,\nAnjuman Talaba-e-Islam (ATI) UAF Chapter\nJinnah Hall, UAF, Faisalabad\nPhone: +92 317 2011968 / 0314 8015678\nEmail: atiuaf1968@gmail.com\nWebsite: https://atiuaf.com`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; color: #171717;">
        <div style="border-bottom: 2px solid #087A43; padding-bottom: 14px; margin-bottom: 18px;">
          <h2 style="margin: 0 0 4px 0; color: #087A43; font-size: 20px;">Anjuman Talaba-e-Islam (ATI)</h2>
          <p style="margin: 0; color: #4b5563; font-size: 14px;">University of Agriculture, Faisalabad (UAF Chapter)</p>
        </div>
        <p style="font-size: 15px; margin: 0 0 14px 0;"><strong>Assalam-o-Alaikum ${data.name},</strong></p>
        <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0 0 14px 0;">
          Thank you for reaching out to Anjuman Talaba-e-Islam (ATI) UAF. <strong>Your message has been received</strong> and registered under tracking reference:
        </p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 18px; text-align: center;">
          <span style="font-size: 12px; color: #166534; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Tracking Reference ID</span><br />
          <strong style="font-size: 18px; color: #15803d; letter-spacing: 1px;">${data.referenceId}</strong>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; margin-bottom: 20px; font-size: 13px; color: #4b5563;">
          <p style="margin: 0 0 6px 0;"><strong>Subject:</strong> ${data.subject}</p>
          <p style="margin: 0 0 6px 0;"><strong>Category:</strong> ${categoryText}</p>
          <p style="margin: 0; white-space: pre-wrap;"><strong>Your Message:</strong><br />"${data.message}"</p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0 0 18px 0;">
          Our student welfare and chapter secretariat team will review your message, and <strong>we will contact you soon</strong>.
        </p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 13px; font-style: italic; color: #087A43; margin: 0 0 14px 0;">
          "${OFFICIAL_MOTTO}"
        </p>
        <div style="font-size: 12px; color: #6b7280; line-height: 1.5;">
          <strong>Central Secretariat — UAF Chapter</strong><br />
          Jinnah Hall, University of Agriculture, Jail Road, Faisalabad<br />
          Phone: +92 317 2011968 / 0314 8015678 | Email: atiuaf1968@gmail.com
        </div>
      </div>
    `,
  });

  const [adminResult, autoReplyResult] = await Promise.all([adminPromise, autoReplyPromise]);
  return { adminResult, autoReplyResult };
}

/**
 * Sends both the admin notification email (with attached resume) and the applicant's auto-reply confirmation.
 */
export async function sendCareerApplicationEmails(data: {
  fullName: string;
  email: string;
  phone: string;
  education: string;
  position: string;
  opportunityType: string;
  linkedIn?: string;
  introduction: string;
  applicationId: string;
  resumeName?: string;
  resumeBuffer?: Buffer;
  resumeType?: string;
}) {
  const adminEmail = process.env.CONTACT_RECEIVER_EMAIL || MAILTRAP_CONFIG.defaults.to;

  const attachments: MailAttachment[] = [];
  if (data.resumeBuffer && data.resumeName) {
    attachments.push({
      filename: data.resumeName,
      content: data.resumeBuffer,
      contentType: data.resumeType || 'application/pdf',
    });
  }

  // 1. Send filled application details to Chapter Secretariat
  const adminPromise = sendMail({
    to: adminEmail,
    replyTo: `${data.fullName} <${data.email}>`,
    subject: `[New Application] ${data.position} — ${data.fullName} (${data.opportunityType})`,
    text: `New student application received at ATI UAF:\n\nApplication ID: ${data.applicationId}\nPosition: ${data.position}\nType: ${data.opportunityType}\nApplicant: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nDegree/Education: ${data.education}\nLinkedIn: ${data.linkedIn || 'N/A'}\nResume: ${data.resumeName || 'None'}\n\nIntroduction/SOP:\n${data.introduction}\n\nSubmitted on: ${new Date().toLocaleString()}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; color: #171717;">
        <div style="border-bottom: 2px solid #087A43; padding-bottom: 12px; margin-bottom: 18px;">
          <h2 style="margin: 0; color: #087A43; font-size: 20px;">New Application Received — ATI UAF</h2>
          <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">Application ID: <strong>${data.applicationId}</strong></p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 18px;">
          <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 7px 0; font-weight: bold; width: 130px; color: #4b5563;">Position:</td><td><strong style="color: #087A43;">${data.position}</strong> (${data.opportunityType})</td></tr>
          <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 7px 0; font-weight: bold; color: #4b5563;">Candidate:</td><td><strong>${data.fullName}</strong></td></tr>
          <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 7px 0; font-weight: bold; color: #4b5563;">Email:</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 7px 0; font-weight: bold; color: #4b5563;">Phone / WhatsApp:</td><td>${data.phone}</td></tr>
          <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 7px 0; font-weight: bold; color: #4b5563;">Degree / Faculty:</td><td>${data.education}</td></tr>
          ${data.linkedIn ? `<tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 7px 0; font-weight: bold; color: #4b5563;">LinkedIn:</td><td><a href="${data.linkedIn}" target="_blank">${data.linkedIn}</a></td></tr>` : ''}
          <tr><td style="padding: 7px 0; font-weight: bold; color: #4b5563;">Resume:</td><td>${data.resumeName ? data.resumeName + ' (Attached to email)' : 'None attached'}</td></tr>
        </table>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 18px;">
          <p style="margin: 0 0 6px; font-weight: bold; font-size: 13px; color: #374151;">Statement of Interest & Experience:</p>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #1f2937;">${data.introduction}</p>
        </div>
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">Hit Reply in your email client to contact ${data.fullName} directly.</p>
      </div>
    `,
    attachments: attachments.length > 0 ? attachments : undefined,
  });

  // 2. Send automated confirmation back to the applicant
  const autoReplyPromise = sendMail({
    to: `${data.fullName} <${data.email}>`,
    replyTo: adminEmail,
    subject: `Application Received: ${data.position} [${data.applicationId}] — ATI UAF`,
    text: `Assalam-o-Alaikum ${data.fullName},\n\nThank you for applying for the position of "${data.position}" (${data.opportunityType}) at Anjuman Talaba-e-Islam (ATI) - University of Agriculture, Faisalabad Chapter.\n\nYour application has been successfully received (Application ID: ${data.applicationId}).\n\nOur Executive Body and HR desk will review your qualifications, and we will contact you soon regarding next steps.\n\nJazakAllah Khair,\nAnjuman Talaba-e-Islam (ATI) UAF Chapter\nJinnah Hall, UAF, Faisalabad\nPhone: +92 317 2011968 / 0314 8015678\nEmail: atiuaf1968@gmail.com\nWebsite: https://atiuaf.com`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; color: #171717;">
        <div style="border-bottom: 2px solid #087A43; padding-bottom: 14px; margin-bottom: 18px;">
          <h2 style="margin: 0 0 4px 0; color: #087A43; font-size: 20px;">Anjuman Talaba-e-Islam (ATI)</h2>
          <p style="margin: 0; color: #4b5563; font-size: 14px;">University of Agriculture, Faisalabad Chapter</p>
        </div>
        <p style="font-size: 15px; margin: 0 0 14px 0;"><strong>Assalam-o-Alaikum ${data.fullName},</strong></p>
        <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0 0 14px 0;">
          Thank you for applying to join the team of <strong>Anjuman Talaba-e-Islam (ATI) UAF</strong>. Your application has been successfully logged into our student registry:
        </p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 18px; text-align: center;">
          <span style="font-size: 12px; color: #166534; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Your Application ID</span><br />
          <strong style="font-size: 18px; color: #15803d; letter-spacing: 1px;">${data.applicationId}</strong>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; margin-bottom: 20px; font-size: 13px; color: #4b5563;">
          <p style="margin: 0 0 6px 0;"><strong>Position Applied:</strong> ${data.position} (${data.opportunityType})</p>
          <p style="margin: 0 0 6px 0;"><strong>Degree / Education:</strong> ${data.education}</p>
          <p style="margin: 0;"><strong>Contact Phone:</strong> ${data.phone}</p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0 0 18px 0;">
          Our Executive Body and Chapter Selection Committee will review your submission and <strong>we will contact you soon</strong> regarding next steps and orientation.
        </p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 13px; font-style: italic; color: #087A43; margin: 0 0 14px 0;">
          "${OFFICIAL_MOTTO}"
        </p>
        <div style="font-size: 12px; color: #6b7280; line-height: 1.5;">
          <strong>Central Secretariat — UAF Chapter</strong><br />
          Jinnah Hall, University of Agriculture, Jail Road, Faisalabad<br />
          Phone: +92 317 2011968 / 0314 8015678 | Email: atiuaf1968@gmail.com
        </div>
      </div>
    `,
  });

  const [adminResult, autoReplyResult] = await Promise.all([adminPromise, autoReplyPromise]);
  return { adminResult, autoReplyResult };
}

/**
 * Quick test email helper directly corresponding to the initial Mailtrap sample.
 */
export async function sendTestEmail(recipient?: string): Promise<SendMailResult> {
  return sendMail({
    from: MAILTRAP_CONFIG.defaults.from,
    to: recipient || MAILTRAP_CONFIG.defaults.to,
    subject: 'Hello from Mailtrap - ATI UAF',
    text: 'This is a test e-mail message.',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff; color: #171717;">
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
