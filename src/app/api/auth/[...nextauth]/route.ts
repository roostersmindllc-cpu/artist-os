import * as Sentry from "@sentry/nextjs";
import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export const GET = Sentry.wrapRouteHandlerWithSentry(handler, {
  method: "GET",
  parameterizedRoute: "/api/auth/[...nextauth]"
});
export const POST = Sentry.wrapRouteHandlerWithSentry(handler, {
  method: "POST",
  parameterizedRoute: "/api/auth/[...nextauth]"
});
