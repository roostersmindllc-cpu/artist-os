"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  createContentItemAction,
  updateContentItemAction
} from "@/app/actions/content-actions";
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
  campaignStatusLabels,
  contentFormatLabels,
  contentFormatValues,
  contentPlatformLabels,
  contentPlatformValues,
  contentStatusLabels,
  contentStatusValues,
  releaseStatusLabels,
  releaseTypeLabels
} from "@/lib/domain-config";
import {
  contentFormSchema,
  type ContentFormValues
} from "@/lib/validations/content";
import { getContentRoute } from "@/services/content-helpers";
import type { ContentPlannerOptionsDto } from "@/services/content-types";

const defaultValues: ContentFormValues = {
  campaignId: "",
  releaseId: "",
  platform: "INSTAGRAM",
  format: "SHORT_VIDEO",
  title: "",
  caption: "",
  dueDate: "",
  publishedAt: "",
  status: "DRAFT",
  assetUrl: ""
};

type ContentFormProps = {
  mode?: "create" | "edit";
  contentItemId?: string;
  initialValues?: ContentFormValues;
  options: ContentPlannerOptionsDto;
  variant?: "card" | "plain";
  redirectOnCreate?: boolean;
  onSuccess?: (result: { contentItemId: string }) => void;
};

export function ContentForm({
  mode = "create",
  contentItemId,
  initialValues = defaultValues,
  options,
  variant = "card",
  redirectOnCreate = true,
  onSuccess
}: ContentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: initialValues
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result =
        mode === "edit" && contentItemId
          ? await updateContentItemAction(contentItemId, values)
          : await createContentItemAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);

      if (mode === "create" && result.data?.contentItemId) {
        form.reset(defaultValues);
        onSuccess?.({ contentItemId: result.data.contentItemId });

        if (redirectOnCreate) {
          router.push(getContentRoute(result.data.contentItemId));
          return;
        }

        router.refresh();
        return;
      }

      if (mode === "edit" && contentItemId) {
        onSuccess?.({ contentItemId });
      }

      router.refresh();
    });
  });

  const formContent = (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="content-title" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Title
        </Label>
        <Input
          id="content-title"
          placeholder="Studio teaser reel"
          {...form.register("title")}
        />
        <FieldHint>
          Use a short planning title that reads clearly in calendar cards and list views.
        </FieldHint>
        <FieldError message={form.formState.errors.title?.message} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="content-platform" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Platform
          </Label>
          <Select id="content-platform" {...form.register("platform")}>
            {contentPlatformValues.map((value) => (
              <option key={value} value={value}>
                {contentPlatformLabels[value]}
              </option>
            ))}
          </Select>
          <FieldHint>
            Choose the distribution channel so the planner reflects the real publishing mix.
          </FieldHint>
          <FieldError message={form.formState.errors.platform?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content-format" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Format
          </Label>
          <Select id="content-format" {...form.register("format")}>
            {contentFormatValues.map((value) => (
              <option key={value} value={value}>
                {contentFormatLabels[value]}
              </option>
            ))}
          </Select>
          <FieldHint>
            Format helps the calendar read like production work instead of generic tasks.
          </FieldHint>
          <FieldError message={form.formState.errors.format?.message} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="content-due-date" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Due date
          </Label>
          <Input
            id="content-due-date"
            type="date"
            {...form.register("dueDate")}
          />
          <FieldHint>The date the asset should be ready or scheduled by.</FieldHint>
          <FieldError message={form.formState.errors.dueDate?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content-published-at" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Published date
          </Label>
          <Input
            id="content-published-at"
            type="date"
            {...form.register("publishedAt")}
          />
          <FieldHint>Optional until the content actually ships.</FieldHint>
          <FieldError message={form.formState.errors.publishedAt?.message} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="content-status" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Status
          </Label>
          <Select id="content-status" {...form.register("status")}>
            {contentStatusValues.map((value) => (
              <option key={value} value={value}>
                {contentStatusLabels[value]}
              </option>
            ))}
          </Select>
          <FieldHint>
            Draft and review states help separate planning from live publishing.
          </FieldHint>
          <FieldError message={form.formState.errors.status?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content-asset-url" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Asset URL
          </Label>
          <Input
            id="content-asset-url"
            placeholder="https://assets.example.com/studio-teaser.mp4"
            {...form.register("assetUrl")}
          />
          <FieldHint>
            Paste a hosted asset link when one exists so reviews stay easy to access.
          </FieldHint>
          <FieldError message={form.formState.errors.assetUrl?.message} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="content-campaign" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Linked campaign
          </Label>
          <Select id="content-campaign" {...form.register("campaignId")}>
            <option value="">No linked campaign</option>
            {options.campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name} - {campaignStatusLabels[campaign.status]}
              </option>
            ))}
          </Select>
          <FieldHint>
            Optional, but helpful for seeing which campaign owns the work.
          </FieldHint>
          <FieldError message={form.formState.errors.campaignId?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content-release" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Linked release
          </Label>
          <Select id="content-release" {...form.register("releaseId")}>
            <option value="">No linked release</option>
            {options.releases.map((release) => (
              <option key={release.id} value={release.id}>
                {release.title} - {releaseTypeLabels[release.type]} -{" "}
                {releaseStatusLabels[release.status]}
              </option>
            ))}
          </Select>
          <FieldHint>
            Link a release when the content directly supports that launch cycle.
          </FieldHint>
          <FieldError message={form.formState.errors.releaseId?.message} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="content-caption" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Caption
        </Label>
        <Textarea
          id="content-caption"
          rows={4}
          {...form.register("caption")}
        />
        <FieldHint>
          Keep a working caption or creative note here so context travels with the item.
        </FieldHint>
        <FieldError message={form.formState.errors.caption?.message} />
      </div>
      <FormCallout
        title="Asset link placeholder"
        description="Use a hosted asset URL for the MVP. File uploads are intentionally not wired yet."
        icon={ImagePlus}
      />
      <Button
        className="h-14 w-full rounded-full bg-[linear-gradient(180deg,#b360ff,#9a42de)] text-white hover:opacity-95"
        type="submit"
        disabled={isPending}
      >
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : mode === "edit" ? (
          <Save className="size-4" />
        ) : null}
        {isPending
          ? mode === "edit"
            ? "Saving changes..."
            : "Saving content..."
          : mode === "edit"
            ? "Save changes"
            : "Create content item"}
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
          {mode === "edit" ? "Edit content item" : "Add content item"}
        </CardTitle>
        <CardDescription className="text-white/68">
          {mode === "edit"
            ? "Update publishing details, linked campaign context, and asset metadata without leaving the content workspace."
            : "Capture platform, format, timing, and linked context for each marketing asset in the planner."}
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,242,236,0.94))]">
        {formContent}
      </CardContent>
    </Card>
  );
}
