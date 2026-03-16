"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateArtistProfileSettingsAction } from "@/app/actions/settings-actions";
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
import { Textarea } from "@/components/ui/textarea";
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

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle>Artist profile settings</CardTitle>
        <CardDescription>
          Keep the artist-facing identity, bio, and current 90-day goal aligned
          with the rest of the workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="artist-settings-name">Artist name</Label>
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
              <Label htmlFor="artist-settings-genre">Genre</Label>
              <Input id="artist-settings-genre" {...form.register("genre")} />
              <FieldHint>
                Keep this broad and audience-facing rather than overly granular.
              </FieldHint>
              <FieldError message={form.formState.errors.genre?.message} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="artist-settings-bio">Short bio</Label>
            <Textarea
              id="artist-settings-bio"
              rows={4}
              {...form.register("bio")}
            />
            <FieldHint>
              A concise artist summary helps keep the workspace grounded in the
              current era.
            </FieldHint>
            <FieldError message={form.formState.errors.bio?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="artist-settings-goal">
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
          <Button
            className="w-full md:w-auto"
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
