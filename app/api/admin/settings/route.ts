import { NextRequest, NextResponse } from 'next/server';
import { getSocialLinks, updateSocialLinks, setAdminPassword, SocialLinks } from '@/lib/db';

function isAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get('ati_admin_token');
  return cookie?.value === 'admin_authenticated_session_1968';
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const socialLinks = await getSocialLinks();
  return NextResponse.json({
    success: true,
    socialLinks,
  });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { socialLinks, newAdminPassword, adminEmail } = body;

    let updatedSocials: SocialLinks | null = null;
    let passwordUpdated = false;

    // 1. Update Social Media Links
    if (socialLinks && typeof socialLinks === 'object') {
      updatedSocials = await updateSocialLinks(socialLinks);
    }

    // 2. Update Admin Password
    if (newAdminPassword && typeof newAdminPassword === 'string' && newAdminPassword.trim().length >= 4) {
      const targetEmail = (adminEmail || 'admin@atiuaf.com').toString().trim().toLowerCase();
      passwordUpdated = await setAdminPassword(targetEmail, newAdminPassword.trim());
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully in database.',
      socialLinks: updatedSocials,
      passwordUpdated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update settings.' },
      { status: 500 }
    );
  }
}
