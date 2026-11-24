import { NextResponse } from 'next/server';
import { getActivitiesAsync } from '@/lib/activities';

export const dynamic = 'force-dynamic';

export async function GET() {
  const activities = await getActivitiesAsync();
  return NextResponse.json({
    success: true,
    activities,
  });
}
