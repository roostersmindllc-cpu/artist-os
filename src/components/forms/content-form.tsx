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
};

export function ContentForm({
  mode = "create",
  contentItemId,
  initialValues = defaultValues,
  options
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
        router.push(getContentRoute(result.data.contentItemId));
        return;
      }

      router.refresh();
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "Edit content item" : "Add content item"}
        </CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "Update publishing details, linked campaign context, and asset metadata without leaving the content workspace."
            : "Capture platform, format, timing, and linked context for each marketing asset in the planner."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="content-title">Title</Label>
            <Input
              id="content-title"
              placeholder="Studio teaser reel"
              {...form.register("title")}
            />
            <FieldHint>
              Use a short planning title that reads clearly in calendar cards
              and list views.
            </FieldHint>
            <FieldError message={form.formState.errors.title?.message} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="content-platform">Platform</Label>
              <Select id="content-platform" {...form.register("platform")}>
                {contentPlatformValues.map((value) => (
                  <option key={value} value={value}>
                    {contentPlatformLabels[value]}
                  </option>
                ))}
              </Select>
              <FieldHint>
                Choose the distribution channel so the planner reflects the real
                publishing mix.
              </FieldHint>
              <FieldError message={form.formState.errors.platform?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-format">Format</Label>
              <Select id="content-format" {...form.register("format")}>
                {contentFormatValues.map((value) => (
                  <option key={value} value={value}>
                    {contentFormatLabels[value]}
                  </option>
                ))}
              </Select>
              <FieldHint>
                Format helps the calendar read like production work instead of
                generic tasks.
              </FieldHint>
              <FieldError message={form.formState.errors.format?.message} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="content-due-date">Due date</Label>
              <Input
                id="content-due-date"
                type="date"
                {...form.register("dueDate")}
              />
              <FieldHint>
                The date the asset should be ready or scheduled by.
              </FieldHint>
              <FieldError message={form.formState.errors.dueDate?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-published-at">Published date</Label>
              <Input
                id="content-published-at"
                type="date"
                {...form.register("publishedAt")}
              />
              <FieldHint>Optional until the content actually ships.</FieldHint>
              <FieldError
                message={form.formState.errors.publishedAt?.message}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="content-status">Status</Label>
              <Select id="content-status" {...form.register("status")}>
                {contentStatusValues.map((value) => (
                  <option key={value} value={value}>
                    {contentStatusLabels[value]}
                  </option>
                ))}
              </Select>
              <FieldHint>
                Draft and review states help separate planning from live
                publishing.
              </FieldHint>
              <FieldError message={form.formState.errors.status?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-asset-url">Asset URL</Label>
              <Input
                id="content-asset-url"
                placeholder="https://assets.example.com/studio-teaser.mp4"
                {...form.register("assetUrl")}
              />
              <FieldHint>
                Paste a hosted asset link when one exists so reviews stay easy
                to access.
              </FieldHint>
              <FieldError message={form.formState.errors.assetUrl?.message} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="content-campaign">Linked campaign</Label>
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
              <Label htmlFor="content-release">Linked release</Label>
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
                Link a release when the content directly supports that launch
                cycle.
              </FieldHint>
              <FieldError message={form.formState.errors.releaseId?.message} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content-caption">Caption</Label>
            <Textarea
              id="content-caption"
              rows={4}
              {...form.register("caption")}
            />
            <FieldHint>
              Keep a working caption or creative note here so context travels
              with the item.
            </FieldHint>
            <FieldError message={form.formState.errors.caption?.message} />
          </div>
          <FormCallout
            title="Asset link placeholder"
            description="Use a hosted asset URL for the MVP. File uploads are intentionally not wired yet."
            icon={ImagePlus}
          />
          <Button className="w-full" type="submit" disabled={isPending}>
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
      </CardContent>
    </Card>
  );
}
