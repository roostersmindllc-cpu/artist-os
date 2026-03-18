"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { updateArtistProfileSettingsAction } from "@/app/actions/settings-actions";
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
import { Textarea } from "@/components/ui/textarea";
import {
  onboardingPlatformLabels,
  onboardingPlatformValues,
  socialPlatformLabels,
  socialPlatformValues
} from "@/lib/domain-config";
import {
  artistProfileSettingsFormSchema,
  type ArtistProfileSettingsFormValues
} from "@/lib/validations/settings";

type ArtistProfileSettingsFormProps = {
  initialValues: ArtistProfileSettingsFormValues;
};

export function ArtistProfileSettingsForm({
  initialValues
}: ArtistProfileSettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ArtistProfileSettingsFormValues>({
    resolver: zodResolver(artistProfileSettingsFormSchema),
    defaultValues: initialValues
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await updateArtistProfileSettingsAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  });

  const socialPlatforms =
    useWatch({
      control: form.control,
      name: "socialPlatforms"
    }) ?? [];
  const platformsUsed =
    useWatch({
      control: form.control,
      name: "platformsUsed"
    }) ?? [];

  return (
    <Card className="rounded-[2rem] border-2 border-black/12 bg-card shadow-[0_18px_36px_rgba(0,0,0,0.08)]">
      <CardHeader className="border-b border-black/12 bg-black text-white">
        <CardTitle className="text-4xl text-white">Artist profile settings</CardTitle>
        <CardDescription className="text-white/68">
          Keep the artist identity, bio, goals, audience size, and channel mix
          aligned with the seeded workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,242,236,0.94))]">
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="space-y-2">
              <Label htmlFor="artist-settings-name" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Artist name
              </Label>
              <Input
                id="artist-settings-name"
                {...form.register("artistName")}
              />
              <FieldHint>
                This name powers the dashboard welcome state and workspace
                identity.
              </FieldHint>
              <FieldError message={form.formState.errors.artistName?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist-settings-audience-size" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Audience size
              </Label>
              <Input
                id="artist-settings-audience-size"
                inputMode="numeric"
                placeholder="5000"
                {...form.register("audienceSize")}
              />
              <FieldHint>
                Rough total audience size helps the seeded campaign speak at the right scale.
              </FieldHint>
              <FieldError message={form.formState.errors.audienceSize?.message} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="artist-settings-genre" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Genre
              </Label>
              <Input id="artist-settings-genre" {...form.register("genre")} />
              <FieldHint>
                Keep this broad and audience-facing rather than overly granular.
              </FieldHint>
              <FieldError message={form.formState.errors.genre?.message} />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="artist-settings-goal"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
              >
                Primary goal for the next 90 days
              </Label>
              <Textarea
                id="artist-settings-goal"
                rows={3}
                {...form.register("primaryGoal")}
              />
              <FieldHint>
                Use one concrete 90-day goal so planning decisions stay aligned.
              </FieldHint>
              <FieldError message={form.formState.errors.primaryGoal?.message} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="artist-settings-bio" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Short bio
            </Label>
            <Textarea
              id="artist-settings-bio"
              rows={4}
              {...form.register("bio")}
            />
            <FieldHint>
              A concise artist summary helps keep the workspace grounded in the current era.
            </FieldHint>
            <FieldError message={form.formState.errors.bio?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
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
              These platforms shape the first-week content plan and future quick actions.
            </FieldHint>
            <FieldError message={form.formState.errors.socialPlatforms?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
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
              Pick the platforms you actively use so the workspace automation matches reality.
            </FieldHint>
            <FieldError message={form.formState.errors.platformsUsed?.message} />
          </div>
          <Button
            className="h-14 w-full rounded-full bg-[linear-gradient(180deg,#b360ff,#9a42de)] text-white hover:opacity-95 md:w-auto md:px-6"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Saving artist profile..." : "Save artist profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
