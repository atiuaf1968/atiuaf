import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sendMail } from '@/lib/mail';
import { MAILTRAP_CONFIG } from '@/lib/data';
import { saveContactSubmission } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, category, message } = body;

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
      id: referenceId,
      name: name.trim(),
      email: email.trim(),
      phone: (phone || '').toString().trim(),
      subject: subject.trim(),
      category: (category || 'General Inquiry').trim(),
      message: message.trim(),
      status: 'Received',
      notes: '',
    };

    // 1. Save directly into PostgreSQL database
    try {
      await saveContactSubmission(submission);
      console.log(`[Contact Submission] Saved ${referenceId} to PostgreSQL database.`);
    } catch (dbErr) {
      console.error('Failed to save contact submission to PostgreSQL:', dbErr);
    }

    // 2. Local fallback sync
    try {
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
      existingLogs.push({ ...submission, createdAt: new Date().toISOString() });
      fs.writeFileSync(logFile, JSON.stringify(existingLogs, null, 2));
    } catch (fsErr) {
      console.error('Failed to sync contact submission locally:', fsErr);
    }

    // 3. Dispatch dual emails via Mailtrap SMTP:
    try {
      const { sendContactInquiryEmails } = await import('@/lib/mail');
      await sendContactInquiryEmails({
        name: submission.name,
        email: submission.email,
        subject: submission.subject,
        message: submission.message,
        referenceId,
      });
    } catch (mailError) {
      console.warn('Mail notification failed to dispatch:', mailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received by the ATI UAF Secretariat. We will contact you soon.',
      referenceId,
    });
  } catch (error: any) {
    console.error('Contact Form Processing Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit your message. Please try again or reach us via WhatsApp.' },
      { status: 500 }
    );
  }
}
