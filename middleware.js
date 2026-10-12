import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Protected routes: product details + profile pages.
export function middleware(request) {
  const session = getSessionCookie(request);
  if (!session) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    url.searchParams.set("reason", "protected");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/product/:path*", "/profile/:path*"] };
