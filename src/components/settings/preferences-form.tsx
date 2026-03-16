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
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Save lightweight workspace preferences without introducing a new
          database migration for the MVP.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="settings-default-analytics-source">
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
              <Label htmlFor="settings-default-content-view">
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
              <Label htmlFor="settings-week-starts-on">Week starts on</Label>
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
            className="w-full md:w-auto"
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
