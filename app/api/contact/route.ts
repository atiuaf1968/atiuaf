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

    // Dispatch dual emails via Mailtrap SMTP:
    // 1. Send all submitted inquiry data to our contact email (admin)
    // 2. Send auto-reply confirmation back to the student/sender
    try {
      const { sendContactInquiryEmails } = await import('@/lib/mail');
      await sendContactInquiryEmails({
        name,
        email,
        subject,
        category,
        message,
        referenceId,
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
