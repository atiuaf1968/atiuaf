import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host') || '';

  // Skip static assets, API routes, and file extensions
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/images') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isAdminSubdomain =
    hostname.startsWith('admin.') ||
    hostname.includes('admin.atiuaf.com');

  // If user requested redirect to admin.atiuaf.com when visiting atiuaf.com/admin
  const isMainDomainAdmin =
    !isAdminSubdomain &&
    url.pathname.startsWith('/admin') &&
    (hostname.includes('atiuaf.com') && !hostname.includes('localhost'));

  if (isMainDomainAdmin) {
    const adminUrl = new URL(url.pathname, 'https://admin.atiuaf.com');
    adminUrl.search = url.search;
    return NextResponse.redirect(adminUrl, 307);
  }

  // Clone headers to pass custom admin flag to Server Components / RootLayout
  const requestHeaders = new Headers(req.headers);

  if (isAdminSubdomain || url.pathname.startsWith('/admin')) {
    requestHeaders.set('x-is-admin', 'true');
    requestHeaders.set('x-url-pathname', url.pathname);
  }

  // If visitor is on admin.atiuaf.com, rewrite root to /admin
  if (isAdminSubdomain) {
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
    }

    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
