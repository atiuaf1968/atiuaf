import { NextRequest, NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/mail';
import { MAILTRAP_CONFIG } from '@/lib/data';

/**
 * GET /api/email/test
 * Quick endpoint to test Mailtrap SMTP sending and verify credentials.
 * Optional query parameter: ?to=user@example.com
 * Sent logs can be verified at: https://mailtrap.io/sending/email_logs
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const to = searchParams.get('to') || undefined;

  const result = await sendTestEmail(to);

  return NextResponse.json({
    ...result,
    config: {
      host: MAILTRAP_CONFIG.host,
      port: MAILTRAP_CONFIG.port,
      user: MAILTRAP_CONFIG.auth.user,
      isTokenConfigured: Boolean(MAILTRAP_CONFIG.auth.pass),
      from: MAILTRAP_CONFIG.defaults.from,
      to: to || MAILTRAP_CONFIG.defaults.to,
    },
    logsUrl: 'https://mailtrap.io/sending/email_logs',
    instruction: !MAILTRAP_CONFIG.auth.pass
      ? 'MAILTRAP_SMTP_PASS is not set in .env.local. Add your Mailtrap API token to enable live delivery.'
      : 'Email dispatched. Verify delivery logs at https://mailtrap.io/sending/email_logs',
  });
}

/**
 * POST /api/email/test
 * Body: { to?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const to = body?.to;
    const result = await sendTestEmail(to);

    return NextResponse.json({
      ...result,
      logsUrl: 'https://mailtrap.io/sending/email_logs',
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Error occurred during email test.',
        logsUrl: 'https://mailtrap.io/sending/email_logs',
      },
      { status: 500 }
    );
  }
}
