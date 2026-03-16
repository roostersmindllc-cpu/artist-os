"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteCampaignAction } from "@/app/actions/campaign-actions";
import { ConfirmActionButton } from "@/components/shared/confirm-action-button";

type DeleteCampaignButtonProps = {
  campaignId: string;
  campaignName: string;
};

export function DeleteCampaignButton({
  campaignId,
  campaignName
}: DeleteCampaignButtonProps) {
  const router = useRouter();

  return (
    <ConfirmActionButton
      label="Delete campaign"
      pendingLabel="Deleting..."
      confirmTitle="Delete campaign?"
      confirmMessage={`This will permanently remove ${campaignName}. Linked content items will remain, but the campaign link will be cleared.`}
      icon={Trash2}
      onConfirm={() => deleteCampaignAction(campaignId)}
      onSuccess={() => {
        router.push("/campaigns");
        router.refresh();
      }}
    />
  );
}
