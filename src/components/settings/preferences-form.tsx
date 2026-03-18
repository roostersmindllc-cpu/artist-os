"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updatePreferencesAction } from "@/app/actions/settings-actions";
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
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { metricSourceLabels, metricSourceValues } from "@/lib/domain-config";
import {
  contentCalendarViewValues,
  preferencesFormSchema,
  type PreferencesFormValues,
  weekStartsOnValues
} from "@/lib/validations/settings";

const contentCalendarViewLabels = {
  MONTH: "Month view",
  WEEK: "Week view",
  LIST: "List view"
} as const;

const weekStartsOnLabels = {
  MONDAY: "Monday",
  SUNDAY: "Sunday"
} as const;

type PreferencesFormProps = {
  initialValues: PreferencesFormValues;
};

export function PreferencesForm({ initialValues }: PreferencesFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: initialValues
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await updatePreferencesAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  });

  return (
    <Card className="rounded-[2rem] border-2 border-black/12 bg-card shadow-[0_18px_36px_rgba(0,0,0,0.08)]">
      <CardHeader className="border-b border-black/12 bg-black text-white">
        <CardTitle className="text-4xl text-white">Preferences</CardTitle>
        <CardDescription className="text-white/68">
          Save lightweight workspace preferences without introducing a new
          database migration for the MVP.
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,242,236,0.94))]">
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label
              htmlFor="settings-default-analytics-source"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
            >
              Default analytics source
            </Label>
            <Select
              id="settings-default-analytics-source"
              {...form.register("defaultAnalyticsSource")}
            >
              {metricSourceValues.map((value) => (
                <option key={value} value={value}>
                  {metricSourceLabels[value]}
                </option>
              ))}
            </Select>
            <FieldHint>
              The analytics page will default to this source when possible.
            </FieldHint>
            <FieldError
              message={form.formState.errors.defaultAnalyticsSource?.message}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="settings-default-content-view"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
              >
                Default content view
              </Label>
              <Select
                id="settings-default-content-view"
                {...form.register("defaultContentView")}
              >
                {contentCalendarViewValues.map((value) => (
                  <option key={value} value={value}>
                    {contentCalendarViewLabels[value]}
                  </option>
                ))}
              </Select>
              <FieldHint>
                Set the planning view you want to land in first.
              </FieldHint>
              <FieldError
                message={form.formState.errors.defaultContentView?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-week-starts-on" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Week starts on
              </Label>
              <Select
                id="settings-week-starts-on"
                {...form.register("weekStartsOn")}
              >
                {weekStartsOnValues.map((value) => (
                  <option key={value} value={value}>
                    {weekStartsOnLabels[value]}
                  </option>
                ))}
              </Select>
              <FieldHint>
                Controls the calendar rhythm across planning views.
              </FieldHint>
              <FieldError
                message={form.formState.errors.weekStartsOn?.message}
              />
            </div>
          </div>
          <Button
            className="h-14 w-full rounded-full bg-[linear-gradient(180deg,#b360ff,#9a42de)] text-white hover:opacity-95 md:w-auto md:px-6"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Saving preferences..." : "Save preferences"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
