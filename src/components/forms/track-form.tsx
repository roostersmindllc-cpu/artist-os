"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  createTrackAction,
  updateTrackAction
} from "@/app/actions/release-actions";
import { FieldError } from "@/components/shared/field-error";
import { FieldHint } from "@/components/shared/field-hint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { trackStatusLabels, trackStatusValues } from "@/lib/domain-config";
import {
  buildTrackFormValues,
  trackFormSchema,
  type TrackFormValues
} from "@/lib/validations/tracks";

const defaultValues: TrackFormValues = {
  title: "",
  durationSeconds: "",
  isrc: "",
  versionName: "",
  status: "DRAFT"
};

type TrackFormProps = {
  releaseId: string;
  track?: {
    id: string;
    title: string;
    durationSeconds: number | null;
    isrc: string | null;
    versionName: string | null;
    status: TrackFormValues["status"];
  };
  onCancel?: () => void;
  onSaved?: () => void;
};

export function TrackForm({
  releaseId,
  track,
  onCancel,
  onSaved
}: TrackFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const mode = track ? "edit" : "create";
  const form = useForm<TrackFormValues>({
    resolver: zodResolver(trackFormSchema),
    defaultValues: track ? buildTrackFormValues(track) : defaultValues
  });

  useEffect(() => {
    form.reset(track ? buildTrackFormValues(track) : defaultValues);
  }, [form, track]);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result =
        mode === "edit" && track
          ? await updateTrackAction(releaseId, track.id, values)
          : await createTrackAction(releaseId, values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      router.refresh();
      onSaved?.();

      if (mode === "create") {
        form.reset(defaultValues);
      }
    });
  });

  return (
    <form
      className="border-border/70 bg-background/50 space-y-4 rounded-2xl border p-4"
      onSubmit={onSubmit}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_160px_180px]">
        <div className="space-y-2">
          <Label
            htmlFor={track ? `track-title-${track.id}` : "track-title-new"}
          >
            Track title
          </Label>
          <Input
            id={track ? `track-title-${track.id}` : "track-title-new"}
            placeholder="Streetlight Static"
            {...form.register("title")}
          />
          <FieldHint>
            Match the official track title so delivery metadata stays clean.
          </FieldHint>
          <FieldError message={form.formState.errors.title?.message} />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor={
              track ? `track-duration-${track.id}` : "track-duration-new"
            }
          >
            Duration (sec)
          </Label>
          <Input
            id={track ? `track-duration-${track.id}` : "track-duration-new"}
            type="number"
            min={1}
            step={1}
            {...form.register("durationSeconds")}
          />
          <FieldHint>
            Optional, but useful for delivery checks and catalog accuracy.
          </FieldHint>
          <FieldError
            message={form.formState.errors.durationSeconds?.message}
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor={track ? `track-status-${track.id}` : "track-status-new"}
          >
            Status
          </Label>
          <Select
            id={track ? `track-status-${track.id}` : "track-status-new"}
            {...form.register("status")}
          >
            {trackStatusValues.map((value) => (
              <option key={value} value={value}>
                {trackStatusLabels[value]}
              </option>
            ))}
          </Select>
          <FieldHint>
            Use track status to reflect where the audio sits in the release
            pipeline.
          </FieldHint>
          <FieldError message={form.formState.errors.status?.message} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor={track ? `track-version-${track.id}` : "track-version-new"}
          >
            Version name
          </Label>
          <Input
            id={track ? `track-version-${track.id}` : "track-version-new"}
            placeholder="Original mix, Radio edit, Acoustic"
            {...form.register("versionName")}
          />
          <FieldHint>
            Version labels help distinguish alternate mixes and edits.
          </FieldHint>
          <FieldError message={form.formState.errors.versionName?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={track ? `track-isrc-${track.id}` : "track-isrc-new"}>
            ISRC
          </Label>
          <Input
            id={track ? `track-isrc-${track.id}` : "track-isrc-new"}
            placeholder="USRC17607839"
            {...form.register("isrc")}
          />
          <FieldHint>
            Add the ISRC once assigned so downstream distribution details stay
            attached.
          </FieldHint>
          <FieldError message={form.formState.errors.isrc?.message} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : mode === "edit" ? (
            <Save className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}
          {isPending
            ? mode === "edit"
              ? "Saving..."
              : "Adding..."
            : mode === "edit"
              ? "Save track"
              : "Add track"}
        </Button>
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
