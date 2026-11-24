import nodemailer from 'nodemailer';
import type { SentMessageInfo } from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { MAILTRAP_CONFIG, OFFICIAL_MOTTO, SITE_METADATA } from './data';

export interface MailAttachment {
  filename: string;
  content?: Buffer | string;
  path?: string;
  contentType?: string;
  cid?: string;
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
 * Path to default brand logo in public folder.
 */
export function getBrandLogoPath(): string | null {
  const logoPath = path.join(process.cwd(), 'public/images/student-power-logo.png');
  return fs.existsSync(logoPath) ? logoPath : null;
}

/**
 * Options for the branded email template.
 */
export interface BrandedEmailTemplateProps {
  badge?: {
    text: string;
    bgColor?: string;
    textColor?: string;
  };
  recipientGreeting?: string;
  heading: string;
  subheading?: string;
  paragraphs?: string[];
  referenceId?: string;
  details?: Array<{ label: string; value: string }>;
  callout?: {
    title: string;
    content: string;
  };
  note?: string;
}

/**
 * Generates responsive, modern, branded HTML for ATI UAF emails with official logo embedded.
 */
export function renderBrandedEmailTemplate(props: BrandedEmailTemplateProps): string {
  const {
    badge,
    recipientGreeting,
    heading,
    subheading,
    paragraphs = [],
    referenceId,
    details = [],
    callout,
    note,
  } = props;

  const badgeHtml = badge
    ? `<span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background-color: ${badge.bgColor || '#dcfce7'}; color: ${badge.textColor || '#15803d'}; margin-bottom: 12px;">${badge.text}</span>`
    : '';

  const greetingHtml = recipientGreeting
    ? `<p style="font-size: 16px; font-weight: 700; color: #171717; margin: 0 0 14px 0;">${recipientGreeting}</p>`
    : '';

  const paragraphsHtml = paragraphs
    .map(
      (p) =>
        `<p style="font-size: 14px; line-height: 1.65; color: #374151; margin: 0 0 14px 0;">${p}</p>`
    )
    .join('');

  const referenceHtml = referenceId
    ? `
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 18px; margin: 18px 0; text-align: center;">
        <span style="font-size: 11px; color: #166534; text-transform: uppercase; font-weight: 700; letter-spacing: 0.8px;">Registration Tracking ID</span>
        <div style="font-size: 20px; font-weight: 800; color: #15803d; letter-spacing: 1px; margin-top: 4px;">${referenceId}</div>
      </div>
    `
    : '';

  const detailsHtml =
    details.length > 0
      ? `
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 18px 0; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <tbody>
            ${details
              .map(
                (row, idx) => `
                  <tr style="border-bottom: ${idx === details.length - 1 ? 'none' : '1px solid #f3f4f6'}; background-color: ${idx % 2 === 0 ? '#ffffff' : '#fafafa'};">
                    <td style="padding: 10px 14px; font-weight: 700; color: #4b5563; width: 140px; vertical-align: top;">${row.label}:</td>
                    <td style="padding: 10px 14px; color: #111827; word-break: break-word;">${row.value}</td>
                  </tr>
                `
              )
              .join('')}
          </tbody>
        </table>
      `
      : '';

  const calloutHtml = callout
    ? `
      <div style="background-color: #f9fafb; border-left: 4px solid #087A43; border-top: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; border-radius: 0 8px 8px 0; padding: 16px; margin: 18px 0;">
        <div style="font-size: 13px; font-weight: 700; color: #087A43; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">${callout.title}</div>
        <div style="font-size: 14px; line-height: 1.6; color: #1f2937; white-space: pre-wrap;">${callout.content}</div>
      </div>
    `
    : '';

  const noteHtml = note
    ? `<p style="font-size: 13px; color: #6b7280; line-height: 1.5; margin: 16px 0 0 0;">${note}</p>`
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${heading}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
          
          <!-- Top Accent Ribbon (ATI Brand Green & Red) -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #087A43 0%, #087A43 75%, #C62828 75%, #C62828 100%);"></td>
          </tr>

          <!-- Header with Logo -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #f3f4f6;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <!-- Official Logo (Embedded via CID) -->
                  <td width="64" valign="middle" style="padding-right: 16px;">
                    <img src="cid:atilogocid" alt="ATI UAF Official Logo" width="60" height="60" style="display: block; width: 60px; height: 60px; border-radius: 50%; object-fit: contain; background-color: #f9fafb; border: 1px solid #e5e7eb;" />
                  </td>
                  <!-- Organization Branding -->
                  <td valign="middle">
                    <div style="font-size: 18px; font-weight: 800; color: #087A43; line-height: 1.2; letter-spacing: 0.5px;">
                      ANJUMAN TALABA-E-ISLAM
                    </div>
                    <div style="font-size: 12px; font-weight: 600; color: #4b5563; margin-top: 2px;">
                      University of Agriculture, Faisalabad (UAF Chapter)
                    </div>
                    <div style="font-size: 10px; font-weight: 700; color: #C62828; text-transform: uppercase; letter-spacing: 0.6px; margin-top: 3px;">
                      Non-Political Student Association • Est. 1968
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 28px 32px;">
              ${badgeHtml}
              <h1 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 6px 0; line-height: 1.3;">
                ${heading}
              </h1>
              ${subheading ? `<p style="font-size: 14px; color: #6b7280; margin: 0 0 18px 0;">${subheading}</p>` : '<div style="height: 12px;"></div>'}
              ${greetingHtml}
              ${paragraphsHtml}
              ${referenceHtml}
              ${detailsHtml}
              ${calloutHtml}
              ${noteHtml}
            </td>
          </tr>

          <!-- Prophetic Love Motto Banner -->
          <tr>
            <td style="background-color: #f0fdf4; padding: 18px 32px; border-top: 1px solid #dcfce7; border-bottom: 1px solid #dcfce7;">
              <p style="font-size: 12px; font-style: italic; color: #166534; margin: 0; line-height: 1.5; text-align: center;">
                "${OFFICIAL_MOTTO}"
              </p>
            </td>
          </tr>

          <!-- Footer Information -->
          <tr>
            <td style="background-color: #fafafa; padding: 24px 32px; text-align: center;">
              <div style="font-size: 12px; font-weight: 700; color: #1f2937; margin-bottom: 4px;">
                Central Secretariat — ATI UAF Chapter
              </div>
              <div style="font-size: 11px; color: #6b7280; line-height: 1.6;">
                Jinnah Hall, University of Agriculture, Jail Road, Faisalabad, Pakistan<br />
                Helpline: +92 317 2011968 / 0314 8015678 • Email: atiuaf1968@gmail.com<br />
                Official Portal: <a href="https://atiuaf.com" style="color: #087A43; text-decoration: underline;">https://atiuaf.com</a>
              </div>
              <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #9ca3af;">
                Automated Transactional Message • Delivery logs monitored via <a href="https://mailtrap.io/sending/email_logs" style="color: #9ca3af; text-decoration: underline;">Mailtrap</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Core sendMail function wrapping nodemailer.sendMail with Promise resolution.
 * Automatically attaches the brand logo with cid:atilogocid if present.
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

  // Combine user attachments with inline brand logo CID attachment
  const attachments: MailAttachment[] = options.attachments ? [...options.attachments] : [];
  const logoPath = getBrandLogoPath();
  const hasLogoAttachment = attachments.some((att) => att.cid === 'atilogocid');

  if (logoPath && !hasLogoAttachment) {
    attachments.push({
      filename: 'ati-uaf-logo.png',
      path: logoPath,
      cid: 'atilogocid',
      contentType: 'image/png',
    });
  }

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
          attachments,
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
  const adminHtml = renderBrandedEmailTemplate({
    badge: {
      text: 'New Campus Inquiry',
      bgColor: '#fee2e2',
      textColor: '#b91c1c',
    },
    heading: 'New Contact Submission Received',
    subheading: `Tracking Reference: ${data.referenceId}`,
    recipientGreeting: 'Dear Central Secretariat & Executive Body,',
    paragraphs: [
      `A new message has been submitted through the official portal contact desk by <strong>${data.name}</strong>.`,
    ],
    referenceId: data.referenceId,
    details: [
      { label: 'Sender Name', value: data.name },
      { label: 'Sender Email', value: `<a href="mailto:${data.email}">${data.email}</a>` },
      { label: 'Category', value: categoryText },
      { label: 'Subject', value: data.subject },
      { label: 'Submitted At', value: new Date().toLocaleString() },
    ],
    callout: {
      title: 'Inquiry Message Body',
      content: data.message,
    },
    note: `Click "Reply" in your email client to directly email ${data.name} (${data.email}).`,
  });

  const adminPromise = sendMail({
    to: adminEmail,
    replyTo: `${data.name} <${data.email}>`,
    subject: `[New Inquiry] ${data.subject} — ${data.name} (${categoryText})`,
    text: `New contact inquiry received at ATI UAF:\n\nReference ID: ${data.referenceId}\nSender: ${data.name} (${data.email})\nCategory: ${categoryText}\nSubject: ${data.subject}\n\nMessage:\n${data.message}\n\nSubmitted on: ${new Date().toLocaleString()}`,
    html: adminHtml,
  });

  // 2. Send automated confirmation back to the student / inquirer
  const userHtml = renderBrandedEmailTemplate({
    badge: {
      text: 'Message Received',
      bgColor: '#dcfce7',
      textColor: '#15803d',
    },
    heading: 'We Have Received Your Message',
    subheading: 'Anjuman Talaba-e-Islam — UAF Chapter',
    recipientGreeting: `Assalam-o-Alaikum ${data.name},`,
    paragraphs: [
      `Thank you for contacting Anjuman Talaba-e-Islam (ATI) at the University of Agriculture, Faisalabad.`,
      `<strong>Your message has been received</strong> by our chapter secretariat and logged under the reference tracking ID below.`,
    ],
    referenceId: data.referenceId,
    details: [
      { label: 'Subject', value: data.subject },
      { label: 'Inquiry Category', value: categoryText },
      { label: 'Status', value: 'Queued for Student Welfare Review' },
    ],
    callout: {
      title: 'Summary of Your Inquiry',
      content: data.message,
    },
    note: `Our campus secretariat and student welfare representatives will review your inquiry, and <strong>we will contact you soon</strong>.`,
  });

  const autoReplyPromise = sendMail({
    to: `${data.name} <${data.email}>`,
    replyTo: adminEmail,
    subject: `Your message is received [${data.referenceId}] — Anjuman Talaba-e-Islam (ATI UAF)`,
    text: `Assalam-o-Alaikum ${data.name},\n\nThank you for reaching out to Anjuman Talaba-e-Islam (ATI) - University of Agriculture Faisalabad Chapter.\n\nYour message regarding "${data.subject}" has been successfully received (Reference: ${data.referenceId}).\n\nOur team will review your inquiry and we will contact you soon.\n\nSummary of your message:\n${data.message}\n\nJazakAllah Khair,\nAnjuman Talaba-e-Islam (ATI) UAF Chapter\nJinnah Hall, UAF, Faisalabad\nPhone: +92 317 2011968 / 0314 8015678\nEmail: atiuaf1968@gmail.com\nWebsite: https://atiuaf.com`,
    html: userHtml,
  });

  const [adminResult, autoReplyResult] = await Promise.all([adminPromise, autoReplyPromise]);
  return { adminResult, autoReplyResult };
}

/**
 * Sends both the admin notification email and the applicant's auto-reply confirmation for Voluntary Membership.
 */
export async function sendCareerApplicationEmails(data: {
  fullName: string;
  email: string;
  phone: string;
  cnic?: string;
  hostel?: string;
  degree?: string;
  semester?: string;
  address?: string;
  education?: string;
  position?: string;
  opportunityType?: string;
  applicationId: string;
}) {
  const adminEmail = process.env.CONTACT_RECEIVER_EMAIL || MAILTRAP_CONFIG.defaults.to;
  const degreeText = data.degree || data.education || 'UAF Student';
  const hostelText = data.hostel || 'Hostel / Day Scholar';
  const semesterText = data.semester || 'N/A';
  const cnicText = data.cnic || 'N/A';
  const addressText = data.address || 'N/A';

  // 1. Send full voluntary registration details to Chapter Secretariat
  const adminHtml = renderBrandedEmailTemplate({
    badge: {
      text: 'New Volunteer Member',
      bgColor: '#fee2e2',
      textColor: '#b91c1c',
    },
    heading: 'New Voluntary Member Registered',
    subheading: `${data.fullName} • ${degreeText} (${hostelText})`,
    recipientGreeting: 'Dear Central Secretariat & Executive Body,',
    paragraphs: [
      `A new student has voluntarily joined <strong>Anjuman Talaba-e-Islam (ATI) UAF Chapter</strong>.`,
    ],
    referenceId: data.applicationId,
    details: [
      { label: 'Full Name', value: `<strong>${data.fullName}</strong>` },
      { label: 'Email Address', value: `<a href="mailto:${data.email}">${data.email}</a>` },
      { label: 'WhatsApp / Phone', value: `<strong>${data.phone}</strong>` },
      { label: 'CNIC / B-Form', value: cnicText },
      { label: 'Hostel / Residence', value: hostelText },
      { label: 'Degree Program', value: degreeText },
      { label: 'Current Semester', value: semesterText },
      { label: 'Address', value: addressText },
      { label: 'Registration Date', value: new Date().toLocaleString() },
    ],
    note: `Click "Reply" to contact ${data.fullName} directly. Connect them with their respective hostel / faculty incharge.`,
  });

  const adminPromise = sendMail({
    to: adminEmail,
    replyTo: `${data.fullName} <${data.email}>`,
    subject: `[New Volunteer Registration] ${data.fullName} — ${degreeText} (${hostelText})`,
    text: `New voluntary member registration received at ATI UAF:\n\nRegistration ID: ${data.applicationId}\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nCNIC: ${cnicText}\nHostel/Residence: ${hostelText}\nDegree: ${degreeText}\nSemester: ${semesterText}\nAddress: ${addressText}\n\nSubmitted on: ${new Date().toLocaleString()}`,
    html: adminHtml,
  });

  // 2. Send automated confirmation back to the student
  const userHtml = renderBrandedEmailTemplate({
    badge: {
      text: 'Welcome to ATI UAF',
      bgColor: '#dcfce7',
      textColor: '#15803d',
    },
    heading: 'Welcome to Anjuman Talaba-e-Islam',
    subheading: 'University of Agriculture, Faisalabad (UAF Chapter)',
    recipientGreeting: `Assalam-o-Alaikum ${data.fullName},`,
    paragraphs: [
      `Thank you for voluntarily joining <strong>Anjuman Talaba-e-Islam (ATI)</strong> at the University of Agriculture, Faisalabad.`,
      `Your voluntary membership registration has been received and logged under your official registration ID:`,
    ],
    referenceId: data.applicationId,
    details: [
      { label: 'Member Name', value: data.fullName },
      { label: 'CNIC / B-Form', value: cnicText },
      { label: 'Hostel / Residence', value: hostelText },
      { label: 'Degree Program', value: degreeText },
      { label: 'Semester', value: semesterText },
      { label: 'Registration Status', value: '<strong style="color: #15803d;">Active Volunteer Member</strong>' },
    ],
    callout: {
      title: 'Next Steps & Chapter Orientation',
      content:
        'Our Chapter Executive Cabinet and your respective hostel hall representatives will contact you soon regarding your membership card, upcoming halaqas, and student rights activities.',
    },
    note: 'If you have any questions, visit our campus desk at Jinnah Hall or reach out to atiuaf1968@gmail.com.',
  });

  const autoReplyPromise = sendMail({
    to: `${data.fullName} <${data.email}>`,
    replyTo: adminEmail,
    subject: `Welcome to Anjuman Talaba-e-Islam [${data.applicationId}] — ATI UAF`,
    text: `Assalam-o-Alaikum ${data.fullName},\n\nThank you for voluntarily joining Anjuman Talaba-e-Islam (ATI) - University of Agriculture, Faisalabad Chapter.\n\nYour membership registration has been received (Registration ID: ${data.applicationId}).\n\nOur Executive Cabinet and hostel representatives will contact you soon regarding your member registration card, upcoming halaqas, and student rights activities.\n\nJazakAllah Khair,\nAnjuman Talaba-e-Islam (ATI) UAF Chapter\nJinnah Hall, UAF, Faisalabad\nPhone: +92 317 2011968 / 0314 8015678\nEmail: atiuaf1968@gmail.com\nWebsite: https://atiuaf.com`,
    html: userHtml,
  });

  const [adminResult, autoReplyResult] = await Promise.all([adminPromise, autoReplyPromise]);
  return { adminResult, autoReplyResult };
}

/**
 * Quick test email helper with logo template.
 */
export async function sendTestEmail(recipient?: string): Promise<SendMailResult> {
  const targetRecipient = recipient || MAILTRAP_CONFIG.defaults.to;
  const testHtml = renderBrandedEmailTemplate({
    badge: {
      text: 'SMTP Verification',
      bgColor: '#dcfce7',
      textColor: '#15803d',
    },
    heading: 'Mailtrap Live SMTP Active',
    subheading: 'Official Email Notification Engine — ATI UAF',
    recipientGreeting: 'Assalam-o-Alaikum & Welcome,',
    paragraphs: [
      'This is a live test email confirming that your <strong>Mailtrap SMTP</strong> integration is fully functional.',
      'Emails are styled with the official ATI UAF brand identity, header logo, and responsive layout across desktop and mobile devices.',
    ],
    details: [
      { label: 'Host', value: '<code>live.smtp.mailtrap.io:587</code>' },
      { label: 'Sender', value: `<code>${MAILTRAP_CONFIG.defaults.from}</code>` },
      { label: 'Recipient', value: `<code>${targetRecipient}</code>` },
      { label: 'Status', value: '<strong style="color: #15803d;">Authenticated & Delivered</strong>' },
    ],
    callout: {
      title: 'Mailtrap Live Dashboard',
      content:
        'You can inspect deliverability metrics, spam score, SPF/DKIM validation, and raw MIME headers in your Mailtrap console at https://mailtrap.io/sending/email_logs.',
    },
  });

  return sendMail({
    from: MAILTRAP_CONFIG.defaults.from,
    to: targetRecipient,
    subject: 'Hello from Mailtrap — ATI UAF Official',
    text: 'This is a test e-mail message confirming your Mailtrap SMTP live sending configuration with brand logo.',
    html: testHtml,
  });
}
