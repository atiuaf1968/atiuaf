import { NextResponse } from 'next/server';
import { getSocialLinks } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const socialLinks = await getSocialLinks();
  return NextResponse.json({
    success: true,
    socialLinks,
  });
}
