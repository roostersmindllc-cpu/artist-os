"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteFanAction } from "@/app/actions/fan-actions";
import { ConfirmActionButton } from "@/components/shared/confirm-action-button";

type DeleteFanButtonProps = {
  fanId: string;
  fanName: string;
};

export function DeleteFanButton({ fanId, fanName }: DeleteFanButtonProps) {
  const router = useRouter();

  return (
    <ConfirmActionButton
      label="Delete fan"
      pendingLabel="Deleting..."
      confirmTitle="Delete fan?"
      confirmMessage={`This will permanently remove ${fanName} from the CRM.`}
      icon={Trash2}
      onConfirm={() => deleteFanAction(fanId)}
      onSuccess={() => {
        router.push("/fans");
        router.refresh();
      }}
    />
  );
}
