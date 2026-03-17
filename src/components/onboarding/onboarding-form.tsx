"use client";

import { useState } from "react";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarClock,
  Disc3,
  LayoutDashboard,
  RadioTower,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

import { completeOnboardingAction } from "@/app/actions/onboarding-actions";
import { FormCallout } from "@/components/shared/form-callout";
import { FieldError } from "@/components/shared/field-error";
import { FieldHint } from "@/components/shared/field-hint";
import { SelectableChipGroup } from "@/components/shared/selectable-chip-group";
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
  onboardingPlatformLabels,
  onboardingPlatformValues,
  socialPlatformLabels,
  socialPlatformValues
} from "@/lib/domain-config";
import { isValidDateInput, stringToDate } from "@/lib/validations/shared";
import {
  onboardingFormSchema,
  type OnboardingFormValues
} from "@/lib/validations/onboarding";
import { buildOnboardingWorkspacePlan } from "@/services/onboarding-helpers";

type OnboardingFormProps = {
  defaultArtistName?: string;
};

const audienceSizePresets = ["500", "2500", "10000", "50000"] as const;

function formatSelectedLabels(values: string[], labels: Record<string, string>) {
  if (values.length === 0) {
    return "Not selected yet";
  }

  return values.map((value) => labels[value] ?? value).join(", ");
}

function buildPreview(values: OnboardingFormValues) {
  if (!isValidDateInput(values.nextReleaseDate)) {
    return null;
  }

  return buildOnboardingWorkspacePlan({
    artistName: values.artistName || "Your artist",
    socialPlatforms: values.socialPlatforms,
    nextReleaseDate: stringToDate(values.nextReleaseDate),
    audienceSize: Number(values.audienceSize || 0),
    platformsUsed: values.platformsUsed
  });
}

export function OnboardingForm({ defaultArtistName = "" }: OnboardingFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      artistName: defaultArtistName,
      socialPlatforms: [],
      nextReleaseDate: "",
      audienceSize: "",
      platformsUsed: []
    }
  });

  const artistName = useWatch({
    control: form.control,
    name: "artistName"
  });
  const socialPlatforms =
    useWatch({
      control: form.control,
      name: "socialPlatforms"
    }) ?? [];
  const nextReleaseDate = useWatch({
    control: form.control,
    name: "nextReleaseDate"
  });
  const audienceSize = useWatch({
    control: form.control,
    name: "audienceSize"
  });
  const platformsUsed =
    useWatch({
      control: form.control,
      name: "platformsUsed"
    }) ?? [];
  const preview = buildPreview({
    artistName: artistName ?? "",
    socialPlatforms,
    nextReleaseDate: nextReleaseDate ?? "",
    audienceSize: audienceSize ?? "",
    platformsUsed
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setFormError(null);

    const result = await completeOnboardingAction(values);

    if (!result.success) {
      setFormError(result.error);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_380px]">
      <Card className="w-full border-border/70 bg-card/85 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl">Set up your artist workspace</CardTitle>
            <CardDescription>
              Give Artist OS five key signals and it will build your first release,
              campaign, content week, and tasks before you ever see the dashboard.
            </CardDescription>
          </div>
          <FormCallout
            title="No blank workspace"
            description="Submitting onboarding now seeds the system so your first dashboard visit already answers what to do today."
            icon={Sparkles}
          />
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="artistName">Artist name</Label>
              <Input id="artistName" autoComplete="organization" {...form.register("artistName")} />
              <FieldError message={form.formState.errors.artistName?.message} />
            </div>

            <div className="space-y-2">
              <Label>Social platforms</Label>
              <SelectableChipGroup
                ariaLabel="Social platforms"
                options={socialPlatformValues.map((value) => ({
                  value,
                  label: socialPlatformLabels[value]
                }))}
                selectedValues={socialPlatforms}
                onToggle={(value) => {
                  const nextValues = socialPlatforms.includes(value)
                    ? socialPlatforms.filter((currentValue) => currentValue !== value)
                    : [...socialPlatforms, value];

                  form.setValue("socialPlatforms", nextValues, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true
                  });
                }}
              />
              <FieldHint>
                These channels drive the first week of seeded content.
              </FieldHint>
              <FieldError message={form.formState.errors.socialPlatforms?.message} />
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
              <div className="space-y-2">
                <Label htmlFor="nextReleaseDate">Next release date</Label>
                <Input
                  id="nextReleaseDate"
                  type="date"
                  {...form.register("nextReleaseDate")}
                />
                <FieldHint>
                  We&apos;ll create a placeholder release you can rename later.
                </FieldHint>
                <FieldError message={form.formState.errors.nextReleaseDate?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audienceSize">Audience size</Label>
                <Input
                  id="audienceSize"
                  inputMode="numeric"
                  placeholder="5000"
                  {...form.register("audienceSize")}
                />
                <div className="flex flex-wrap gap-2">
                  {audienceSizePresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() =>
                        form.setValue("audienceSize", preset, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true
                        })
                      }
                      className="rounded-full border border-border/70 bg-background/55 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60"
                    >
                      {Number(preset).toLocaleString()}
                    </button>
                  ))}
                </div>
                <FieldError message={form.formState.errors.audienceSize?.message} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Platforms used</Label>
              <SelectableChipGroup
                ariaLabel="Platforms used"
                options={onboardingPlatformValues.map((value) => ({
                  value,
                  label: onboardingPlatformLabels[value]
                }))}
                selectedValues={platformsUsed}
                onToggle={(value) => {
                  const nextValues = platformsUsed.includes(value)
                    ? platformsUsed.filter((currentValue) => currentValue !== value)
                    : [...platformsUsed, value];

                  form.setValue("platformsUsed", nextValues, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true
                  });
                }}
              />
              <FieldHint>
                We use this to shape your starter campaign notes and your first analytics task.
              </FieldHint>
              <FieldError message={form.formState.errors.platformsUsed?.message} />
            </div>

            <FieldError message={formError ?? undefined} />
            <Button className="w-full md:w-auto" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Building workspace..." : "Create my workspace"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/88 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="size-4 text-primary" />
            What You&apos;ll Land In
          </CardTitle>
          <CardDescription>
            A seeded workspace built from your answers, not an empty shell.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Social platforms
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">
              {formatSelectedLabels(socialPlatforms, socialPlatformLabels)}
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Platforms used
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">
              {formatSelectedLabels(platformsUsed, onboardingPlatformLabels)}
            </p>
          </div>

          {preview ? (
            <>
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                    <Disc3 className="size-4" />
                  </span>
                  <div>
                    <p className="font-medium">{preview.release.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Placeholder release on {format(preview.release.releaseDate, "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                    <RadioTower className="size-4" />
                  </span>
                  <div>
                    <p className="font-medium">{preview.campaign.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Active starter campaign sized for about {preview.profile.audienceSize.toLocaleString()} fans.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                    <CalendarClock className="size-4" />
                  </span>
                  <div>
                    <p className="font-medium">First week of content</p>
                    <p className="text-sm text-muted-foreground">
                      {preview.contentItems.length} draft items across{" "}
                      {formatSelectedLabels(preview.profile.socialPlatforms, socialPlatformLabels)}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Seeded tasks
                </p>
                <div className="mt-3 space-y-2">
                  {preview.tasks.map((task) => (
                    <div
                      key={task.title}
                      className="rounded-xl border border-border/60 bg-background/70 p-3 text-sm text-muted-foreground"
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/70 bg-background/35 p-5 text-sm leading-6 text-muted-foreground">
              Pick your platforms, audience size, and release date to preview the seeded workspace.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
