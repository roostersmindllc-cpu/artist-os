"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import type { TaskFormValues } from "@/lib/validations/tasks";
import { createTaskForUser } from "@/services/tasks-service";
import { getErrorMessage } from "@/services/service-utils";

export async function createTaskAction(values: TaskFormValues): Promise<ActionResult> {
  try {
    const user = await requireUser();
    await createTaskForUser(user.id, values);
    revalidatePath("/dashboard");
    revalidatePath("/tasks");

    return {
      success: true,
      message: "Task created."
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

