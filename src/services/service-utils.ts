import * as Sentry from "@sentry/nextjs";
import { ZodError } from "zod";

import { UserFacingError } from "@/lib/errors";

export function getErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Validation failed.";
  }

  if (error instanceof UserFacingError) {
    return error.message;
  }

  if (error instanceof Error) {
    Sentry.captureException(error);
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
