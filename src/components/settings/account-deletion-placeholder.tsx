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
    <Card className="border-destructive/30 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-5" />
          Account deletion
        </CardTitle>
        <CardDescription>
          This flow is intentionally disabled until a secure backend deletion workflow,
          export path, and session invalidation process are in place.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="account-deletion-confirmation">
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
        <Button className="w-full md:w-auto" variant="destructive" disabled>
          Delete account
        </Button>
      </CardContent>
    </Card>
  );
}
