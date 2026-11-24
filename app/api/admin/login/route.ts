import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const normalizedEmail = (email || '').toString().trim().toLowerCase();
    const providedPass = (password || '').toString().trim();

    const isValid = await verifyAdminCredentials(normalizedEmail, providedPass);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials. Please check your email and password.' },
        { status: 401 }
      );
    }

    // Set secure HTTP-only admin session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful. Welcome to ATI UAF Admin Panel.',
      user: { email: normalizedEmail },
    });

    response.cookies.set('ati_admin_token', 'admin_authenticated_session_1968', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Login failed.' },
      { status: 500 }
    );
  }
}
