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
const setupLaneCards = [
  {
    title: "Organize",
    description: "Set the artist profile, release runway, and core channels."
  },
  {
    title: "Track",
    description: "Use audience size and platforms to shape the starter analytics workflow."
  },
  {
    title: "Launch",
    description: "Seed the first campaign, content week, and tasks before the dashboard opens."
  }
] as const;

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
      <Card className="w-full rounded-[2rem] border-2 border-black/12 bg-card shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
        <CardHeader className="space-y-4 border-b border-black/10 bg-[linear-gradient(180deg,rgba(28,216,242,0.08),rgba(255,255,255,0))] px-6 py-6">
          <div className="space-y-1">
            <CardTitle className="font-heading text-5xl font-semibold leading-none">
              Profile setup
            </CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7 text-muted-foreground">
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
        <CardContent className="space-y-8 px-6 py-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
                Choose your format
              </p>
              <h3 className="mt-2 font-heading text-3xl font-semibold">How Artist.OS will set the board</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {setupLaneCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[1.6rem] border border-black/12 bg-[linear-gradient(180deg,rgba(190,89,255,0.86),rgba(162,73,224,0.96))] p-4 text-white"
                >
                  <p className="font-heading text-3xl font-semibold">{card.title}</p>
                  <p className="mt-3 text-sm leading-6 text-white/82">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="artistName" className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Artist name
              </Label>
              <Input
                id="artistName"
                autoComplete="organization"
                className="h-12 rounded-2xl border-black/12 bg-white shadow-none"
                {...form.register("artistName")}
              />
              <FieldError message={form.formState.errors.artistName?.message} />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Social platforms
              </Label>
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
                <Label htmlFor="nextReleaseDate" className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Next release date
                </Label>
                <Input
                  id="nextReleaseDate"
                  type="date"
                  className="h-12 rounded-2xl border-black/12 bg-white shadow-none"
                  {...form.register("nextReleaseDate")}
                />
                <FieldHint>
                  We&apos;ll create a placeholder release you can rename later.
                </FieldHint>
                <FieldError message={form.formState.errors.nextReleaseDate?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audienceSize" className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Audience size
                </Label>
                <Input
                  id="audienceSize"
                  inputMode="numeric"
                  placeholder="5000"
                  className="h-12 rounded-2xl border-black/12 bg-white shadow-none"
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
              <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Platforms used
              </Label>
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
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                className="h-14 min-w-[12rem] rounded-full bg-[linear-gradient(180deg,#b360ff,#9a42de)] px-8 text-base font-semibold text-white shadow-none"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Building workspace..." : "Create profile"}
              </Button>
              <Button
                variant="outline"
                className="h-14 min-w-[10rem] rounded-full border-black/14 bg-white px-8 text-base shadow-none"
                type="button"
                onClick={() => router.back()}
              >
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-2 border-black/12 bg-card shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
        <CardHeader className="border-b border-black/10 bg-black text-white">
          <CardTitle className="flex items-center gap-2 font-heading text-4xl font-semibold">
            <LayoutDashboard className="size-4 text-primary" />
            What You&apos;ll Land In
          </CardTitle>
          <CardDescription className="text-white/72">
            A seeded workspace built from your answers, not an empty shell.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-5 py-5">
          <div className="rounded-[1.6rem] border border-black/12 bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
              Social platforms
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">
              {formatSelectedLabels(socialPlatforms, socialPlatformLabels)}
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-black/12 bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
              Platforms used
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">
              {formatSelectedLabels(platformsUsed, onboardingPlatformLabels)}
            </p>
          </div>

          {preview ? (
            <>
              <div className="rounded-[1.6rem] border border-black/12 bg-background p-4">
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

              <div className="rounded-[1.6rem] border border-black/12 bg-background p-4">
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

              <div className="rounded-[1.6rem] border border-black/12 bg-background p-4">
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

              <div className="rounded-[1.6rem] border border-black/12 bg-background p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
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
            <div className="rounded-[1.6rem] border border-dashed border-black/16 bg-background p-5 text-sm leading-6 text-muted-foreground">
              Pick your platforms, audience size, and release date to preview the seeded workspace.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
