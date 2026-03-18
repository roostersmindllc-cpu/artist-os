"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { createFanAction, updateFanAction } from "@/app/actions/fan-actions";
import { FieldError } from "@/components/shared/field-error";
import { FieldHint } from "@/components/shared/field-hint";
import { TagInput } from "@/components/shared/tag-input";
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
import { Textarea } from "@/components/ui/textarea";
import { fanFormSchema, type FanFormValues } from "@/lib/validations/fans";
import { getFanRoute } from "@/services/fans-helpers";

const defaultValues: FanFormValues = {
  name: "",
  email: "",
  handle: "",
  city: "",
  tags: [],
  engagementScore: 0,
  notes: ""
};

type FanFormProps = {
  mode?: "create" | "edit";
  fanId?: string;
  initialValues?: FanFormValues;
  variant?: "card" | "plain";
  redirectOnCreate?: boolean;
  onSuccess?: (result: { fanId: string }) => void;
};

export function FanForm({
  mode = "create",
  fanId,
  initialValues = defaultValues,
  variant = "card",
  redirectOnCreate = true,
  onSuccess
}: FanFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<FanFormValues>({
    resolver: zodResolver(fanFormSchema),
    defaultValues: initialValues
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result =
        mode === "edit" && fanId
          ? await updateFanAction(fanId, values)
          : await createFanAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);

      if (mode === "create" && result.data?.fanId) {
        form.reset(defaultValues);
        onSuccess?.({ fanId: result.data.fanId });

        if (redirectOnCreate) {
          router.push(getFanRoute(result.data.fanId));
          return;
        }

        router.refresh();
        return;
      }

      if (mode === "edit" && fanId) {
        onSuccess?.({ fanId });
      }

      router.refresh();
    });
  });

  const formContent = (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="fan-name" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Name
        </Label>
        <Input
          id="fan-name"
          placeholder="Maya Ellis"
          {...form.register("name")}
        />
        <FieldHint>
          Use the name you would search for first when following up later.
        </FieldHint>
        <FieldError message={form.formState.errors.name?.message} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fan-email" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Email
          </Label>
          <Input id="fan-email" type="email" {...form.register("email")} />
          <FieldHint>
            Optional, but helpful for future segmentation and direct outreach.
          </FieldHint>
          <FieldError message={form.formState.errors.email?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fan-handle" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Handle
          </Label>
          <Input
            id="fan-handle"
            placeholder="@artistfriend"
            {...form.register("handle")}
          />
          <FieldHint>
            Social handles make relationships easier to recognize at a glance.
          </FieldHint>
          <FieldError message={form.formState.errors.handle?.message} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fan-city" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            City
          </Label>
          <Input id="fan-city" {...form.register("city")} />
          <FieldHint>
            City becomes useful quickly for local outreach and market planning.
          </FieldHint>
          <FieldError message={form.formState.errors.city?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fan-engagement" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Engagement score
          </Label>
          <Input
            id="fan-engagement"
            type="number"
            min={0}
            max={100}
            {...form.register("engagementScore", { valueAsNumber: true })}
          />
          <FieldHint>
            Score the relationship from 0 to 100 based on responsiveness and value.
          </FieldHint>
          <FieldError message={form.formState.errors.engagementScore?.message} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fan-tags" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Tags
        </Label>
        <Controller
          control={form.control}
          name="tags"
          render={({ field }) => (
            <TagInput
              value={field.value}
              onChange={field.onChange}
              placeholder="superfan, merch buyer, local press"
              disabled={isPending}
            />
          )}
        />
        <FieldHint>
          Press Enter or comma to add tags. Paste comma-separated tags to add several at once.
        </FieldHint>
        <FieldError
          message={form.formState.errors.tags?.message as string | undefined}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fan-notes" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Notes
        </Label>
        <Textarea id="fan-notes" rows={5} {...form.register("notes")} />
        <FieldHint>
          Capture context that makes the next interaction more personal and useful.
        </FieldHint>
        <FieldError message={form.formState.errors.notes?.message} />
      </div>
      <Button
        className="h-14 w-full rounded-full bg-[linear-gradient(180deg,#b360ff,#9a42de)] text-white hover:opacity-95"
        type="submit"
        disabled={isPending}
      >
        {mode === "edit" ? (
          <Save className="size-4" />
        ) : (
          <UserRoundPlus className="size-4" />
        )}
        {isPending
          ? mode === "edit"
            ? "Saving changes..."
            : "Saving fan..."
          : mode === "edit"
            ? "Save changes"
            : "Add fan"}
      </Button>
    </form>
  );

  if (variant === "plain") {
    return <div className="p-5 sm:p-6">{formContent}</div>;
  }

  return (
    <Card className="rounded-[2rem] border-2 border-black/12 bg-card shadow-[0_18px_36px_rgba(0,0,0,0.08)]">
      <CardHeader className="border-b border-black/12 bg-black text-white">
        <CardTitle className="text-4xl text-white">
          {mode === "edit" ? "Edit fan" : "Add fan"}
        </CardTitle>
        <CardDescription className="text-white/68">
          {mode === "edit"
            ? "Keep the relationship record current with better tags, engagement scoring, and context notes."
            : "Store a lightweight relationship record with clean tags, searchable contact info, and an engagement score."}
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,242,236,0.94))]">
        {formContent}
      </CardContent>
    </Card>
  );
}
