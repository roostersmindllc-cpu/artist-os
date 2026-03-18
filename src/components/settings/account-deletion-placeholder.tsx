"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AccountDeletionPlaceholderProps = {
  confirmationLabel: string;
  reason: string;
};

export function AccountDeletionPlaceholder({
  confirmationLabel,
  reason
}: AccountDeletionPlaceholderProps) {
  const [confirmationValue, setConfirmationValue] = useState("");

  return (
    <Card className="rounded-[2rem] border-2 border-destructive/35 bg-card shadow-[0_18px_36px_rgba(0,0,0,0.08)]">
      <CardHeader className="border-b border-destructive/18 bg-black text-white">
        <CardTitle className="flex items-center gap-2 text-3xl text-destructive">
          <AlertTriangle className="size-5" />
          Account deletion
        </CardTitle>
        <CardDescription className="text-white/68">
          This flow is intentionally disabled until a secure backend deletion workflow,
          export path, and session invalidation process are in place.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,242,236,0.94))]">
        <div className="space-y-2">
          <Label
            htmlFor="account-deletion-confirmation"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            Type <span className="font-semibold">{confirmationLabel}</span> to confirm
          </Label>
          <Input
            id="account-deletion-confirmation"
            value={confirmationValue}
            onChange={(event) => setConfirmationValue(event.target.value)}
            placeholder={confirmationLabel}
          />
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{reason}</p>
        <Button className="h-14 w-full rounded-full md:w-auto md:px-6" variant="destructive" disabled>
          Delete account
        </Button>
      </CardContent>
    </Card>
  );
}
