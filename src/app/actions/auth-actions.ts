"use server";

import { headers } from "next/headers";

import type { ActionResult } from "@/lib/action-result";
import { getClientIp } from "@/lib/request-context";
import { enforceRateLimit } from "@/lib/rate-limit";
import { serverEnv } from "@/lib/server-env";
import type { SignUpFormValues } from "@/lib/validations/auth";
import { captureServerAnalyticsEvent } from "@/lib/posthog-server";
import { createUserAccount } from "@/services/auth-service";
import { getErrorMessage } from "@/services/service-utils";

export async function signUpAction(values: SignUpFormValues): Promise<ActionResult> {
  try {
    const requestHeaders = await headers();

    await enforceRateLimit({
      scope: "auth.sign-up",
      maxHits: serverEnv.AUTH_SIGN_UP_RATE_LIMIT_MAX,
      windowMs: serverEnv.AUTH_SIGN_UP_RATE_LIMIT_WINDOW_MS,
      identifiers: [getClientIp(requestHeaders), values.email]
    });

    const user = await createUserAccount(values);
    await captureServerAnalyticsEvent({
      distinctId: user.id,
      event: "account created",
      properties: {
        source: "sign_up"
      }
    });

    return {
      success: true,
      message: "Account created."
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}
