"use client";

import { useTransition } from "react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import type { ActionResult } from "@/lib/action-result";
import { Button, type ButtonProps } from "@/components/ui/button";

type ConfirmActionButtonProps = {
  label: string;
  pendingLabel?: string;
  confirmTitle: string;
  confirmMessage: string;
  onConfirm: () => Promise<ActionResult<unknown>>;
  onSuccess?: () => void;
  icon?: LucideIcon;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
};

export function ConfirmActionButton({
  label,
  pendingLabel,
  confirmTitle,
  confirmMessage,
  onConfirm,
  onSuccess,
  icon: Icon,
  variant = "destructive",
  size = "sm",
  className
}: ConfirmActionButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const confirmed = window.confirm(`${confirmTitle}\n\n${confirmMessage}`);

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result = await onConfirm();

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      onSuccess?.();
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={isPending}
    >
      {Icon ? <Icon className="size-4" /> : null}
      {isPending ? pendingLabel ?? label : label}
    </Button>
  );
}
