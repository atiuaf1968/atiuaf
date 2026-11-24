import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const education = formData.get('education') as string;
    const position = formData.get('position') as string;
    const opportunityType = formData.get('opportunityType') as string;
    const linkedIn = (formData.get('linkedIn') as string) || '';
    const introduction = formData.get('introduction') as string;
    const resumeFile = formData.get('resume') as File | null;

    // Field Validations
    if (!fullName || !email || !phone || !education || !position || !introduction) {
      return NextResponse.json(
        { success: false, error: 'All primary application fields are mandatory.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address provided.' },
        { status: 400 }
      );
    }

    let resumeMeta = null;
    if (resumeFile && resumeFile.size > 0) {
      // Validate file size (max 5MB)
      const maxSizeBytes = 5 * 1024 * 1024;
      if (resumeFile.size > maxSizeBytes) {
        return NextResponse.json(
          { success: false, error: 'Resume file size must not exceed 5MB.' },
          { status: 400 }
        );
      }

      // Validate file extension
      const validExtensions = ['.pdf', '.doc', '.docx'];
      const fileExt = path.extname(resumeFile.name).toLowerCase();
      if (!validExtensions.includes(fileExt)) {
        return NextResponse.json(
          { success: false, error: 'Please upload a PDF or DOC/DOCX document.' },
          { status: 400 }
        );
      }

      resumeMeta = {
        name: resumeFile.name,
        size: resumeFile.size,
        type: resumeFile.type,
      };

      // Save resume locally in persistent .data folder
      try {
        const uploadDir = path.join(process.cwd(), '.data', 'resumes');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const buffer = Buffer.from(await resumeFile.arrayBuffer());
        const safeFileName = `${Date.now()}-${resumeFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        fs.writeFileSync(path.join(uploadDir, safeFileName), buffer);
      } catch (err) {
        console.warn('Could not write physical resume file (expected in read-only serverless environment):', err);
      }
    }

    const applicationId = `SP-APP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`;

    const applicationRecord = {
      applicationId,
      fullName,
      email,
      phone,
      education,
      position,
      opportunityType: opportunityType || 'General Opportunity',
      linkedIn,
      introduction,
      resume: resumeMeta,
      status: 'Pending Review',
      submittedAt: new Date().toISOString(),
    };

    // Save record to persistent store
    const storageDir = path.join(process.cwd(), '.data');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    const logFile = path.join(storageDir, 'career_applications.json');
    let existingApps = [];
    if (fs.existsSync(logFile)) {
      try {
        existingApps = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
      } catch {
        existingApps = [];
      }
    }
    existingApps.push(applicationRecord);
    fs.writeFileSync(logFile, JSON.stringify(existingApps, null, 2));

    console.log(`[Career Application] ID: ${applicationId} for ${position} by ${fullName}`);

    // Dispatch email notification via Mailtrap SMTP
    try {
      const { sendMail } = await import('@/lib/mail');
      const { MAILTRAP_CONFIG } = await import('@/lib/data');
      const recipient = process.env.CONTACT_RECEIVER_EMAIL || MAILTRAP_CONFIG.defaults.to;
      await sendMail({
        to: recipient,
        replyTo: `${fullName} <${email}>`,
        subject: `[ATI UAF Application] ${position} - ${fullName}`,
        text: `New application received for position: ${position}\n\nApplicant: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nEducation: ${education}\nOpportunity Type: ${opportunityType}\nLinkedIn: ${linkedIn || 'N/A'}\nIntroduction: ${introduction}\nApplication ID: ${applicationId}`,
      });
    } catch (mailError) {
      console.warn('Career application email dispatch warning:', mailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Your application has been successfully submitted to Student Power Human Resources.',
      applicationId,
    });
  } catch (error) {
    console.error('Careers Application API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process application. Please check your network and try again.' },
      { status: 500 }
    );
  }
}
