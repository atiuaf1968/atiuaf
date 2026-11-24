import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber, getSubscribersAsync } from '@/lib/activities';
import { sendSubscriberWelcomeEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || '').toString().trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a properly formatted email address.' },
        { status: 400 }
      );
    }

    const { isNew } = await addSubscriber(email);

    // If new subscriber, dispatch welcome confirmation email via Mailtrap SMTP
    if (isNew) {
      try {
        await sendSubscriberWelcomeEmail(email);
      } catch (err) {
        console.warn('Welcome email error (non-fatal):', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: isNew
        ? 'Thank you for subscribing! You will receive an email whenever a new activity is published.'
        : 'You are already subscribed to ATI UAF activity updates.',
    });
  } catch (error: any) {
    console.error('Subscription API Error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while subscribing. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const subscribers = await getSubscribersAsync();
  return NextResponse.json({
    success: true,
    count: subscribers.filter((s) => s.active).length,
  });
}
