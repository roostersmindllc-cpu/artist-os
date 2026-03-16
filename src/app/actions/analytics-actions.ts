"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import type { AnalyticsFormValues } from "@/lib/validations/analytics";
import type { MetricImportColumnMapping } from "@/services/analytics-import";
import {
  createMetricSnapshotForUser,
  importMetricSnapshotsForUser
} from "@/services/analytics-service";
import { getErrorMessage } from "@/services/service-utils";

export async function createMetricSnapshotAction(
  values: AnalyticsFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    await createMetricSnapshotForUser(user.id, values);
    revalidatePath("/dashboard");
    revalidatePath("/analytics");

    return {
      success: true,
      message: "Metric snapshot saved."
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

export async function importMetricSnapshotsAction(input: {
  csvText: string;
  mapping: MetricImportColumnMapping;
}): Promise<ActionResult<{ importedCount: number }>> {
  try {
    const user = await requireUser();
    const result = await importMetricSnapshotsForUser(user.id, input);
    revalidatePath("/dashboard");
    revalidatePath("/analytics");

    return {
      success: true,
      message: `${result.importedCount} metric snapshot${
        result.importedCount === 1 ? "" : "s"
      } imported.`,
      data: {
        importedCount: result.importedCount
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}
