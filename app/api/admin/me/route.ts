import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('ati_admin_token')?.value;

  if (token === 'admin_authenticated_session_1968') {
    return NextResponse.json({
      authenticated: true,
      user: {
        email: process.env.ADMIN_EMAIL || 'admin@atiuaf.com',
        role: 'Central Administrator',
      },
    });
  }

  return NextResponse.json({
    authenticated: false,
  });
}
