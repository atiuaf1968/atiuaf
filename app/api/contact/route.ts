import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sendMail } from '@/lib/mail';
import { MAILTRAP_CONFIG } from '@/lib/data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, category, message } = body;

    // Server-side validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Please complete all required fields.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const referenceId = `SP-MSG-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`;
    const submission = {
      referenceId,
      name,
      email,
      subject,
      category: category || 'General Inquiry',
      message,
      createdAt: new Date().toISOString(),
      status: 'Received',
    };

    // Persistent storage simulation (serverless compatible & database-ready)
    const storageDir = path.join(process.cwd(), '.data');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const logFile = path.join(storageDir, 'contact_submissions.json');
    let existingLogs = [];
    if (fs.existsSync(logFile)) {
      try {
        existingLogs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
      } catch {
        existingLogs = [];
      }
    }
    existingLogs.push(submission);
    fs.writeFileSync(logFile, JSON.stringify(existingLogs, null, 2));

    console.log(`[Contact Submission] Reference ${referenceId} from ${name} (${email})`);

    // Dispatch email notification via Mailtrap SMTP
    try {
      const recipient = process.env.CONTACT_RECEIVER_EMAIL || MAILTRAP_CONFIG.defaults.to;
      await sendMail({
        to: recipient,
        replyTo: `${name} <${email}>`,
        subject: `[ATI UAF Contact Form] ${subject} (${category || 'General'})`,
        text: `New contact submission received from ${name} (${email}):\n\nReference ID: ${referenceId}\nCategory: ${category || 'General'}\nSubject: ${subject}\n\nMessage:\n${message}\n\nSubmitted At: ${submission.createdAt}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
            <div style="border-left: 4px solid #087A43; padding-left: 12px; margin-bottom: 20px;">
              <h2 style="margin: 0; color: #087A43; font-size: 20px;">New Contact Submission — ATI UAF</h2>
              <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">Reference ID: <strong>${referenceId}</strong></p>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
              <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 8px 0; font-weight: bold; width: 120px; color: #4b5563;">Sender:</td><td style="color: #111827;">${name} &lt;${email}&gt;</td></tr>
              <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Category:</td><td style="color: #111827;">${category || 'General Inquiry'}</td></tr>
              <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Subject:</td><td style="color: #111827;">${subject}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Received:</td><td style="color: #111827;">${submission.createdAt}</td></tr>
            </table>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <p style="margin: 0 0 6px; font-weight: 600; font-size: 13px; color: #374151;">Message Body:</p>
              <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #1f2937; line-height: 1.6;">${message}</p>
            </div>
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">Sent automatically via Mailtrap SMTP. Check logs at https://mailtrap.io/sending/email_logs</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.warn('Mail notification failed to dispatch:', mailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been received by the Central Secretariat. A representative will contact you shortly.',
      referenceId,
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while sending your message. Please try again.' },
      { status: 500 }
    );
  }
}
