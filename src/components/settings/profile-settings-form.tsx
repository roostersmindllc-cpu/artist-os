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
    <Card className="rounded-[2rem] border-2 border-black/12 bg-card shadow-[0_18px_36px_rgba(0,0,0,0.08)]">
      <CardHeader className="border-b border-black/12 bg-black text-white">
        <CardTitle className="text-4xl text-white">Profile settings</CardTitle>
        <CardDescription className="text-white/68">
          Update the core account details used across authentication and the app
          shell.
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,242,236,0.94))]">
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="settings-name" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Name
            </Label>
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
            <Label htmlFor="settings-email" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Email
            </Label>
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
            <Label htmlFor="settings-image" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Avatar image URL
            </Label>
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
            className="h-14 w-full rounded-full bg-[linear-gradient(180deg,#b360ff,#9a42de)] text-white hover:opacity-95 md:w-auto md:px-6"
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
