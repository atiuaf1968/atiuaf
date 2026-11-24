import { NextRequest, NextResponse } from 'next/server';
import { NEWS_ANNOUNCEMENTS } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featuredOnly = searchParams.get('featured') === 'true';

    let news = [...NEWS_ANNOUNCEMENTS];

    if (category && category !== 'All') {
      news = news.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }

    if (featuredOnly) {
      news = news.filter((item) => item.featured);
    }

    return NextResponse.json({
      success: true,
      count: news.length,
      news,
    });
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve news feed.' },
      { status: 500 }
    );
  }
}
