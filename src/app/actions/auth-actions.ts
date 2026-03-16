"use server";

import type { ActionResult } from "@/lib/action-result";
import type { SignUpFormValues } from "@/lib/validations/auth";
import { createUserAccount } from "@/services/auth-service";
import { getErrorMessage } from "@/services/service-utils";

export async function signUpAction(values: SignUpFormValues): Promise<ActionResult> {
  try {
    await createUserAccount(values);

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
