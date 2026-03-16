"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteTrackAction } from "@/app/actions/release-actions";
import { ConfirmActionButton } from "@/components/shared/confirm-action-button";

type DeleteTrackButtonProps = {
  releaseId: string;
  trackId: string;
  trackTitle: string;
};

export function DeleteTrackButton({
  releaseId,
  trackId,
  trackTitle
}: DeleteTrackButtonProps) {
  const router = useRouter();

  return (
    <ConfirmActionButton
      label="Remove"
      pendingLabel="Removing..."
      confirmTitle="Remove track?"
      confirmMessage={`This will remove ${trackTitle} from the release.`}
      icon={Trash2}
      onConfirm={() => deleteTrackAction(releaseId, trackId)}
      onSuccess={() => {
        router.refresh();
      }}
    />
  );
}
