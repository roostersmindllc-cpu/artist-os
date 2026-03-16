"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import type { FanFormValues } from "@/lib/validations/fans";
import { getFanRoute } from "@/services/fans-helpers";
import {
  createFanForUser,
  deleteFanForUser,
  updateFanForUser
} from "@/services/fans-service";
import { getErrorMessage } from "@/services/service-utils";

function revalidateFanPaths(fanId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/fans");
  revalidatePath("/fans/new");
  revalidatePath(getFanRoute(fanId));
}

export async function createFanAction(
  values: FanFormValues
): Promise<ActionResult<{ fanId: string }>> {
  try {
    const user = await requireUser();
    const fan = await createFanForUser(user.id, values);
    revalidateFanPaths(fan.id);

    return {
      success: true,
      message: "Fan added.",
      data: {
        fanId: fan.id
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

export async function updateFanAction(
  fanId: string,
  values: FanFormValues
): Promise<ActionResult<{ fanId: string }>> {
  try {
    const user = await requireUser();
    await updateFanForUser(user.id, fanId, values);
    revalidateFanPaths(fanId);

    return {
      success: true,
      message: "Fan updated.",
      data: {
        fanId
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

export async function deleteFanAction(
  fanId: string
): Promise<ActionResult<{ redirectTo: "/fans" }>> {
  try {
    const user = await requireUser();
    await deleteFanForUser(user.id, fanId);
    revalidatePath("/dashboard");
    revalidatePath("/fans");
    revalidatePath("/fans/new");
    revalidatePath(getFanRoute(fanId));

    return {
      success: true,
      message: "Fan deleted.",
      data: {
        redirectTo: "/fans"
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}
