import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host') || '';

  // Check if subdomain is admin (e.g. admin.atiuaf.com or admin.localhost:3000)
  const isAdminSubdomain =
    hostname.startsWith('admin.') ||
    hostname.includes('admin.atiuaf.com');

  // Skip static assets and internal next paths
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/images') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // If visitor is on admin.atiuaf.com, rewrite root to /admin
  if (isAdminSubdomain) {
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }
    // If not already under /admin, prefix with /admin
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
