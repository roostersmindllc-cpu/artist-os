import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (matchesRoutePrefix(request.nextUrl.pathname, protectedPrefixes) && !token) {
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
