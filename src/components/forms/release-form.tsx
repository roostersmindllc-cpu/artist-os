"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, LoaderCircle, Save, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  createReleaseAction,
  updateReleaseAction
} from "@/app/actions/release-actions";
import { FieldError } from "@/components/shared/field-error";
import { FieldHint } from "@/components/shared/field-hint";
import { FormCallout } from "@/components/shared/form-callout";
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
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  releaseStatusLabels,
  releaseStatusValues,
  releaseTypeLabels,
  releaseTypeValues
} from "@/lib/domain-config";
import {
  releaseFormSchema,
  type ReleaseFormValues
} from "@/lib/validations/releases";
import { getReleaseRoute } from "@/services/releases-helpers";

const defaultValues: ReleaseFormValues = {
  title: "",
  type: "SINGLE",
  status: "IDEA",
  releaseDate: "",
  distributor: "",
  coverArtUrl: "",
  description: ""
};

type ReleaseFormProps = {
  mode?: "create" | "edit";
  releaseId?: string;
  initialValues?: ReleaseFormValues;
  variant?: "card" | "plain";
  redirectOnCreate?: boolean;
  onSuccess?: (result: { releaseId: string }) => void;
};

export function ReleaseForm({
  mode = "create",
  releaseId,
  initialValues = defaultValues,
  variant = "card",
  redirectOnCreate = true,
  onSuccess
}: ReleaseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ReleaseFormValues>({
    resolver: zodResolver(releaseFormSchema),
    defaultValues: initialValues
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result =
        mode === "edit" && releaseId
          ? await updateReleaseAction(releaseId, values)
          : await createReleaseAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);

      if (mode === "create" && result.data?.releaseId) {
        form.reset(defaultValues);
        onSuccess?.({ releaseId: result.data.releaseId });

        if (redirectOnCreate) {
          router.push(getReleaseRoute(result.data.releaseId));
          return;
        }

        router.refresh();
        return;
      }

      if (mode === "edit" && releaseId) {
        onSuccess?.({ releaseId });
      }

      router.refresh();
    });
  });

  const formContent = (
    <form className="space-y-4" onSubmit={onSubmit}>
      {mode === "create" ? (
        <FormCallout
          title="Starter automation included"
          description="Creating a release now generates a linked rollout campaign, a three-item content schedule, and starter tasks for playlists, fan email, and TikTok planning."
          icon={Sparkles}
        />
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="release-title">Title</Label>
        <Input
          id="release-title"
          placeholder="Neon Skyline"
          {...form.register("title")}
        />
        <FieldHint>
          Use the audience-facing release title exactly as it should appear.
        </FieldHint>
        <FieldError message={form.formState.errors.title?.message} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="release-type">Release type</Label>
          <Select id="release-type" {...form.register("type")}>
            {releaseTypeValues.map((value) => (
              <option key={value} value={value}>
                {releaseTypeLabels[value]}
              </option>
            ))}
          </Select>
          <FieldHint>
            Choose the catalog format so downstream planning stays accurate.
          </FieldHint>
          <FieldError message={form.formState.errors.type?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="release-status">Status</Label>
          <Select id="release-status" {...form.register("status")}>
            {releaseStatusValues.map((value) => (
              <option key={value} value={value}>
                {releaseStatusLabels[value]}
              </option>
            ))}
          </Select>
          <FieldHint>
            Keep the status current so launch views and filters stay trustworthy.
          </FieldHint>
          <FieldError message={form.formState.errors.status?.message} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="release-date">Target release date</Label>
        <Input
          id="release-date"
          type="date"
          {...form.register("releaseDate")}
        />
        <FieldHint>
          Optional for early ideas, but add it as soon as the release window is real.
        </FieldHint>
        <FieldError message={form.formState.errors.releaseDate?.message} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="release-distributor">Distributor</Label>
        <Input
          id="release-distributor"
          placeholder="DistroKid"
          {...form.register("distributor")}
        />
        <FieldHint>
          Useful for delivery tracking and release operations handoff.
        </FieldHint>
        <FieldError message={form.formState.errors.distributor?.message} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="release-cover-art">Cover art URL</Label>
        <Input
          id="release-cover-art"
          placeholder="https://images.example.com/neon-skyline.jpg"
          {...form.register("coverArtUrl")}
        />
        <FieldHint>
          Paste a hosted image URL for the MVP cover preview and catalog record.
        </FieldHint>
        <FieldError message={form.formState.errors.coverArtUrl?.message} />
        <FormCallout
          title="Cover upload placeholder"
          description="Use a hosted image URL for MVP workflows. File uploads are intentionally not wired yet."
          icon={ImagePlus}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="release-description">Description</Label>
        <Textarea
          id="release-description"
          rows={4}
          {...form.register("description")}
        />
        <FieldHint>
          Capture the story, positioning, or rollout notes the team should keep nearby.
        </FieldHint>
        <FieldError message={form.formState.errors.description?.message} />
      </div>
      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : mode === "edit" ? (
          <Save className="size-4" />
        ) : null}
        {isPending
          ? mode === "edit"
            ? "Saving changes..."
            : "Saving release..."
          : mode === "edit"
            ? "Save changes"
            : "Create release"}
      </Button>
    </form>
  );

  if (variant === "plain") {
    return <div className="p-5 sm:p-6">{formContent}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "edit" ? "Edit release" : "Add release"}</CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "Update release metadata, timing, and positioning without leaving the detail page."
            : "Create a release record with enough metadata to support planning, delivery, and future campaign linking."}
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
