"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { completeOnboardingAction } from "@/app/actions/onboarding-actions";
import { FieldError } from "@/components/shared/field-error";
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
  onboardingFormSchema,
  type OnboardingFormValues
} from "@/lib/validations/onboarding";

type OnboardingFormProps = {
  defaultArtistName?: string;
};

export function OnboardingForm({ defaultArtistName = "" }: OnboardingFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      artistName: defaultArtistName,
      genre: "",
      bio: "",
      primaryGoal: ""
    }
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
    <Card className="w-full border-border/70 bg-card/85 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="space-y-1">
          <CardTitle className="text-2xl">Set up your artist workspace</CardTitle>
          <CardDescription>
            Add the basics once so Artist OS can personalize your dashboard and future records.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="artistName">Artist name</Label>
              <Input id="artistName" autoComplete="organization" {...form.register("artistName")} />
              <FieldError message={form.formState.errors.artistName?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input id="genre" {...form.register("genre")} />
              <FieldError message={form.formState.errors.genre?.message} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Short bio</Label>
            <Textarea
              id="bio"
              rows={4}
              placeholder="A concise artist summary for your workspace."
              {...form.register("bio")}
            />
            <FieldError message={form.formState.errors.bio?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primaryGoal">Primary goal for the next 90 days</Label>
            <Textarea
              id="primaryGoal"
              rows={3}
              placeholder="Example: Launch my next single and grow direct fan signups."
              {...form.register("primaryGoal")}
            />
            <FieldError message={form.formState.errors.primaryGoal?.message} />
          </div>
          <FieldError message={formError ?? undefined} />
          <Button className="w-full md:w-auto" type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving setup..." : "Complete onboarding"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
