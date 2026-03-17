"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import type { ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import { captureServerAnalyticsEvent } from "@/lib/posthog-server";
import { getClientIp } from "@/lib/request-context";
import { enforceRateLimit } from "@/lib/rate-limit";
import { serverEnv } from "@/lib/server-env";
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
    await captureServerAnalyticsEvent({
      distinctId: user.id,
      event: "metric snapshot created",
      properties: {
        source: values.source,
        metricName: values.metricName
      }
    });

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
    const requestHeaders = await headers();
    await enforceRateLimit({
      scope: "analytics.csv-import",
      maxHits: serverEnv.ANALYTICS_IMPORT_RATE_LIMIT_MAX,
      windowMs: serverEnv.ANALYTICS_IMPORT_RATE_LIMIT_WINDOW_MS,
      identifiers: [user.id, getClientIp(requestHeaders)]
    });
    const result = await importMetricSnapshotsForUser(user.id, input);
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    await captureServerAnalyticsEvent({
      distinctId: user.id,
      event: "analytics csv imported",
      properties: {
        importedCount: result.importedCount
      }
    });

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
