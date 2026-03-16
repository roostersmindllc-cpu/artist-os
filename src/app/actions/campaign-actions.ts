"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import type { CampaignFormValues } from "@/lib/validations/campaigns";
import { getCampaignRoute } from "@/services/campaigns-helpers";
import { getReleaseRoute } from "@/services/releases-helpers";
import {
  createCampaignForUser,
  deleteCampaignForUser,
  updateCampaignForUser
} from "@/services/campaigns-service";
import { getErrorMessage } from "@/services/service-utils";

function revalidateCampaignPaths(campaignId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/campaigns");
  revalidatePath("/campaigns/new");
  revalidatePath(getCampaignRoute(campaignId));
}

function revalidateLinkedReleasePath(releaseId: string | null) {
  if (!releaseId) {
    return;
  }

  revalidatePath(getReleaseRoute(releaseId));
}

export async function createCampaignAction(
  values: CampaignFormValues
): Promise<ActionResult<{ campaignId: string }>> {
  try {
    const user = await requireUser();
    const campaign = await createCampaignForUser(user.id, values);
    revalidateCampaignPaths(campaign.id);
    revalidateLinkedReleasePath(campaign.releaseId);

    return {
      success: true,
      message: "Campaign created.",
      data: {
        campaignId: campaign.id
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

export async function updateCampaignAction(
  campaignId: string,
  values: CampaignFormValues
): Promise<ActionResult<{ campaignId: string }>> {
  try {
    const user = await requireUser();
    const result = await updateCampaignForUser(user.id, campaignId, values);
    revalidateCampaignPaths(campaignId);
    revalidateLinkedReleasePath(result.previousReleaseId);
    revalidateLinkedReleasePath(result.nextReleaseId);

    return {
      success: true,
      message: "Campaign updated.",
      data: {
        campaignId
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

export async function deleteCampaignAction(
  campaignId: string
): Promise<ActionResult<{ redirectTo: "/campaigns" }>> {
  try {
    const user = await requireUser();
    const result = await deleteCampaignForUser(user.id, campaignId);
    revalidatePath("/dashboard");
    revalidatePath("/campaigns");
    revalidatePath("/campaigns/new");
    revalidatePath(getCampaignRoute(campaignId));
    revalidateLinkedReleasePath(result.releaseId);

    return {
      success: true,
      message: "Campaign deleted.",
      data: {
        redirectTo: "/campaigns"
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}
