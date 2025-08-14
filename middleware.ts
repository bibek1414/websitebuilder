// middleware.ts (place this in your project root, same level as your app folder)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'nepdora.com';
  
  // Check if we're on a subdomain
  if (hostname.includes('.') && hostname.endsWith(baseDomain) && !hostname.startsWith('www.')) {
    const subdomain = hostname.replace(`.${baseDomain}`, '');
    
    // Skip if it's the main domain or common subdomains
    if (subdomain === baseDomain || subdomain === 'api' || subdomain === 'admin' || subdomain === 'www') {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    
    // If accessing root of subdomain, redirect to site view with auth persistence
    if (url.pathname === '/' || url.pathname === '') {
      // Preserve authentication by passing token as query param temporarily
      const token = request.cookies.get('token')?.value;
      
      url.pathname = '/site-view';
      url.searchParams.set('subdomain', subdomain);
      
      if (token) {
        url.searchParams.set('preserve_auth', 'true');
      }
      
      return NextResponse.rewrite(url);
    }
    
    // For other paths on subdomain, still rewrite to preserve subdomain context
    if (!url.pathname.startsWith('/site-view')) {
      url.pathname = `/site-view${url.pathname}`;
      url.searchParams.set('subdomain', subdomain);
      
      const token = request.cookies.get('token')?.value;
      if (token) {
        url.searchParams.set('preserve_auth', 'true');
      }
      
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};