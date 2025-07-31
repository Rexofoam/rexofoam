import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Redirect old character-details route to new SEO-friendly route
  if (pathname === '/character-details') {
    const ocid = searchParams.get('ocid');
    const name = searchParams.get('name');
    
    if (ocid) {
      const newUrl = new URL(`/character/${ocid}`, request.url);
      if (name) {
        newUrl.searchParams.set('name', name);
      }
      return NextResponse.redirect(newUrl, 301); // Permanent redirect
    }
    
    // If no OCID, redirect to character search
    return NextResponse.redirect(new URL('/character', request.url), 301);
  }

  // Rate limiting for API routes (basic implementation)
  if (pathname.startsWith('/api/')) {
    // You can implement rate limiting here
    // For now, just continue
  }

  // Security headers
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Cache headers for static assets
  if (pathname.startsWith('/_next/static/') || pathname.match(/\.(ico|png|jpg|jpeg|gif|webp|svg)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
