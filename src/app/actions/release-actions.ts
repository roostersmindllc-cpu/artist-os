"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import { captureServerAnalyticsEvent } from "@/lib/posthog-server";
import type { ReleaseFormValues } from "@/lib/validations/releases";
import type { TrackFormValues } from "@/lib/validations/tracks";
import {
  createReleaseForUser,
  createTrackForRelease,
  deleteReleaseForUser,
  deleteTrackForRelease,
  updateReleaseForUser,
  updateTrackForRelease
} from "@/services/releases-service";
import { getReleaseRoute } from "@/services/releases-helpers";
import { getErrorMessage } from "@/services/service-utils";

function revalidateReleasePaths(releaseId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/releases");
  revalidatePath("/campaigns");
  revalidatePath("/campaigns/new");
  revalidatePath("/content");
  revalidatePath("/tasks");
  revalidatePath(getReleaseRoute(releaseId));
}

export async function createReleaseAction(
  values: ReleaseFormValues
): Promise<
  ActionResult<{
    releaseId: string;
    automationSummary: Awaited<ReturnType<typeof createReleaseForUser>>["automationSummary"];
  }>
> {
  try {
    const user = await requireUser();
    const release = await createReleaseForUser(user.id, values);
    revalidateReleasePaths(release.id);
    await captureServerAnalyticsEvent({
      distinctId: user.id,
      event: "release created",
      properties: {
        releaseId: release.id,
        hasReleaseDate: Boolean(values.releaseDate),
        automationCampaignCount: release.automationSummary.campaignCount,
        automationContentItemCount: release.automationSummary.contentItemCount,
        automationTaskCount: release.automationSummary.taskCount
      }
    });

    return {
      success: true,
      message: `Release created. Generated ${release.automationSummary.campaignCount} campaign, ${release.automationSummary.contentItemCount} content items, and ${release.automationSummary.taskCount} tasks${
        release.automationSummary.usesProvisionalDate
          ? " using a provisional 21-day runway because no release date was set."
          : "."
      }`,
      data: {
        releaseId: release.id,
        automationSummary: release.automationSummary
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

export async function updateReleaseAction(
  releaseId: string,
  values: ReleaseFormValues
): Promise<ActionResult<{ releaseId: string }>> {
  try {
    const user = await requireUser();
    await updateReleaseForUser(user.id, releaseId, values);
    revalidateReleasePaths(releaseId);

    return {
      success: true,
      message: "Release updated.",
      data: {
        releaseId
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

export async function deleteReleaseAction(
  releaseId: string
): Promise<ActionResult<{ redirectTo: "/releases" }>> {
  try {
    const user = await requireUser();
    await deleteReleaseForUser(user.id, releaseId);
    revalidatePath("/dashboard");
    revalidatePath("/releases");
    revalidatePath(getReleaseRoute(releaseId));

    return {
      success: true,
      message: "Release deleted.",
      data: {
        redirectTo: "/releases"
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

export async function createTrackAction(
  releaseId: string,
  values: TrackFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    await createTrackForRelease(user.id, releaseId, values);
    revalidateReleasePaths(releaseId);
    revalidatePath("/releases");

    return {
      success: true,
      message: "Track added."
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

export async function updateTrackAction(
  releaseId: string,
  trackId: string,
  values: TrackFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    await updateTrackForRelease(user.id, releaseId, trackId, values);
    revalidateReleasePaths(releaseId);
    revalidatePath("/releases");

    return {
      success: true,
      message: "Track updated."
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

export async function deleteTrackAction(
  releaseId: string,
  trackId: string
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    await deleteTrackForRelease(user.id, releaseId, trackId);
    revalidateReleasePaths(releaseId);
    revalidatePath("/releases");

    return {
      success: true,
      message: "Track removed."
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}
