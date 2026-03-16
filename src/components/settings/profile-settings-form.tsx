"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateAccountSettingsAction } from "@/app/actions/settings-actions";
import { FieldError } from "@/components/shared/field-error";
import { FieldHint } from "@/components/shared/field-hint";
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
import {
  accountSettingsFormSchema,
  type AccountSettingsFormValues
} from "@/lib/validations/settings";

type ProfileSettingsFormProps = {
  initialValues: AccountSettingsFormValues;
};

export function ProfileSettingsForm({
  initialValues
}: ProfileSettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<AccountSettingsFormValues>({
    resolver: zodResolver(accountSettingsFormSchema),
    defaultValues: initialValues
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await updateAccountSettingsAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  });

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle>Profile settings</CardTitle>
        <CardDescription>
          Update the core account details used across authentication and the app
          shell.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="settings-name">Name</Label>
            <Input
              id="settings-name"
              autoComplete="name"
              {...form.register("name")}
            />
            <FieldHint>
              This name appears in the app shell and account context.
            </FieldHint>
            <FieldError message={form.formState.errors.name?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-email">Email</Label>
            <Input
              id="settings-email"
              type="email"
              autoComplete="email"
              {...form.register("email")}
            />
            <FieldHint>
              Use the email address you want tied to sign-in and account
              recovery.
            </FieldHint>
            <FieldError message={form.formState.errors.email?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-image">Avatar image URL</Label>
            <Input
              id="settings-image"
              placeholder="https://example.com/avatar.jpg"
              {...form.register("image")}
            />
            <FieldHint>
              Optional hosted image URL for the account avatar.
            </FieldHint>
            <FieldError message={form.formState.errors.image?.message} />
          </div>
          <Button
            className="w-full md:w-auto"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Saving profile..." : "Save profile settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
