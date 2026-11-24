import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
