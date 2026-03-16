"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteReleaseAction } from "@/app/actions/release-actions";
import { ConfirmActionButton } from "@/components/shared/confirm-action-button";

type DeleteReleaseButtonProps = {
  releaseId: string;
  releaseTitle: string;
};

export function DeleteReleaseButton({
  releaseId,
  releaseTitle
}: DeleteReleaseButtonProps) {
  const router = useRouter();

  return (
    <ConfirmActionButton
      label="Delete release"
      pendingLabel="Deleting..."
      confirmTitle="Delete release?"
      confirmMessage={`This will permanently remove ${releaseTitle} and its linked tracks.`}
      icon={Trash2}
      onConfirm={() => deleteReleaseAction(releaseId)}
      onSuccess={() => {
        router.push("/releases");
        router.refresh();
      }}
    />
  );
}
