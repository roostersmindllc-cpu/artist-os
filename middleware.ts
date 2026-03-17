import { type NextRequest, NextResponse } from "next/server";

import { hasAuthSessionCookie } from "@/lib/auth-session-cookie";

const protectedPrefixes = [
  "/dashboard",
  "/releases",
  "/campaigns",
  "/content",
  "/fans",
  "/tasks",
  "/analytics",
  "/settings",
  "/onboarding"
];

function matchesRoutePrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function middleware(request: NextRequest) {
  const hasSessionCookie = hasAuthSessionCookie(
    request.cookies.getAll().map(({ name }) => name)
  );

  if (matchesRoutePrefix(request.nextUrl.pathname, protectedPrefixes) && !hasSessionCookie) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set(
      "callbackUrl",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    );

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/releases/:path*",
    "/campaigns/:path*",
    "/content/:path*",
    "/fans/:path*",
    "/tasks/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/onboarding/:path*"
  ]
};
