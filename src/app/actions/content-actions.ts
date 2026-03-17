"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import { captureServerAnalyticsEvent } from "@/lib/posthog-server";
import type { ContentFormValues } from "@/lib/validations/content";
import { getCampaignRoute } from "@/services/campaigns-helpers";
import { getContentRoute } from "@/services/content-helpers";
import {
  createContentItemForUser,
  deleteContentItemForUser,
  updateContentItemForUser
} from "@/services/content-service";
import { getReleaseRoute } from "@/services/releases-helpers";
import { getErrorMessage } from "@/services/service-utils";

function revalidateContentPaths(contentItemId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/content");
  revalidatePath(getContentRoute(contentItemId));
}

function revalidateLinkedPaths(campaignId: string | null, releaseId: string | null) {
  if (campaignId) {
    revalidatePath(getCampaignRoute(campaignId));
  }

  if (releaseId) {
    revalidatePath(getReleaseRoute(releaseId));
  }
}

export async function createContentItemAction(
  values: ContentFormValues
): Promise<ActionResult<{ contentItemId: string }>> {
  try {
    const user = await requireUser();
    const contentItem = await createContentItemForUser(user.id, values);
    revalidateContentPaths(contentItem.id);
    revalidateLinkedPaths(contentItem.campaignId, contentItem.releaseId);
    await captureServerAnalyticsEvent({
      distinctId: user.id,
      event: "content item created",
      properties: {
        contentItemId: contentItem.id,
        platform: values.platform,
        status: values.status
      }
    });

    return {
      success: true,
      message: "Content item created.",
      data: {
        contentItemId: contentItem.id
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

export async function updateContentItemAction(
  contentItemId: string,
  values: ContentFormValues
): Promise<ActionResult<{ contentItemId: string }>> {
  try {
    const user = await requireUser();
    const result = await updateContentItemForUser(user.id, contentItemId, values);
    revalidateContentPaths(contentItemId);
    revalidateLinkedPaths(result.previousCampaignId, result.previousReleaseId);
    revalidateLinkedPaths(result.nextCampaignId, result.nextReleaseId);

    return {
      success: true,
      message: "Content item updated.",
      data: {
        contentItemId
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

export async function deleteContentItemAction(
  contentItemId: string
): Promise<ActionResult<{ redirectTo: "/content" }>> {
  try {
    const user = await requireUser();
    const result = await deleteContentItemForUser(user.id, contentItemId);
    revalidatePath("/dashboard");
    revalidatePath("/content");
    revalidatePath(getContentRoute(contentItemId));
    revalidateLinkedPaths(result.campaignId, result.releaseId);

    return {
      success: true,
      message: "Content item deleted.",
      data: {
        redirectTo: "/content"
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}
