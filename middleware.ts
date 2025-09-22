import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Ignore Next internals and API routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) return;

  // If path already ends with a slash or is the root, do nothing
  if (pathname === '/' || pathname.endsWith('/')) return;

  // If the pathname looks like a file (has an extension), do nothing
  if (pathname.match(/\.[a-zA-Z0-9]+$/)) return;

  const url = req.nextUrl.clone();
  url.pathname = `${pathname}/`;
  if (search) url.search = search;

  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: '/((?!_next\/|api\/|.*\\..*$).*)',
};
