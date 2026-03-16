"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteContentItemAction } from "@/app/actions/content-actions";
import { ConfirmActionButton } from "@/components/shared/confirm-action-button";

type DeleteContentButtonProps = {
  contentItemId: string;
  title: string;
};

export function DeleteContentButton({
  contentItemId,
  title
}: DeleteContentButtonProps) {
  const router = useRouter();

  return (
    <ConfirmActionButton
      label="Delete item"
      pendingLabel="Deleting..."
      confirmTitle="Delete content item?"
      confirmMessage={`This will permanently remove ${title} from the planner.`}
      icon={Trash2}
      onConfirm={() => deleteContentItemAction(contentItemId)}
      onSuccess={() => {
        router.push("/content");
        router.refresh();
      }}
    />
  );
}
