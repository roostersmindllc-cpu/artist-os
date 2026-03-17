"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { createMetricSnapshotAction } from "@/app/actions/analytics-actions";
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
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  metricNameValues,
  metricSourceLabels,
  metricSourceValues
} from "@/lib/domain-config";
import {
  analyticsFormSchema,
  type AnalyticsFormValues
} from "@/lib/validations/analytics";
import { getMetricDisplayLabel } from "@/services/analytics-helpers";
import type {
  MetricNameValue,
  MetricSourceValue
} from "@/services/analytics-import";

const baseDefaultValues: AnalyticsFormValues = {
  recordedAt: "",
  source: "SPOTIFY",
  metricName: "STREAMS",
  metricValue: 0,
  metadata: ""
};

type AnalyticsFormProps = {
  defaultSource?: MetricSourceValue;
  defaultMetricName?: MetricNameValue;
  variant?: "card" | "plain";
  onSuccess?: () => void;
};

export function AnalyticsForm({
  defaultSource = "SPOTIFY",
  defaultMetricName = "STREAMS",
  variant = "card",
  onSuccess
}: AnalyticsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const initialValues = {
    ...baseDefaultValues,
    source: defaultSource,
    metricName: defaultMetricName
  } satisfies AnalyticsFormValues;
  const form = useForm<AnalyticsFormValues>({
    resolver: zodResolver(analyticsFormSchema),
    defaultValues: initialValues
  });
  const watchedSource = useWatch({
    control: form.control,
    name: "source"
  });

  useEffect(() => {
    form.reset({
      ...baseDefaultValues,
      source: defaultSource,
      metricName: defaultMetricName
    });
  }, [defaultMetricName, defaultSource, form]);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await createMetricSnapshotAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      form.reset(initialValues);
      onSuccess?.();
      router.refresh();
    });
  });

  const formContent = (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="metric-recorded-at">Recorded date</Label>
          <Input
            id="metric-recorded-at"
            type="date"
            {...form.register("recordedAt")}
          />
          <FieldHint>
            Use the date the platform snapshot was actually recorded.
          </FieldHint>
          <FieldError message={form.formState.errors.recordedAt?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="metric-source">Source</Label>
          <Select id="metric-source" {...form.register("source")}>
            {metricSourceValues.map((value) => (
              <option key={value} value={value}>
                {metricSourceLabels[value]}
              </option>
            ))}
          </Select>
          <FieldHint>
            Pick the platform or source where this metric was observed.
          </FieldHint>
          <FieldError message={form.formState.errors.source?.message} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="metric-name">Metric name</Label>
          <Select id="metric-name" {...form.register("metricName")}>
            {metricNameValues.map((value) => (
              <option key={value} value={value}>
                {getMetricDisplayLabel(watchedSource, value)}
              </option>
            ))}
          </Select>
          <FieldHint>
            The metric label adapts so common platform rows stay readable.
          </FieldHint>
          <FieldError message={form.formState.errors.metricName?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="metric-value">Metric value</Label>
          <Input
            id="metric-value"
            type="number"
            min={0}
            step="0.1"
            {...form.register("metricValue", { valueAsNumber: true })}
          />
          <FieldHint>
            Use the raw platform number with no commas or symbols.
          </FieldHint>
          <FieldError message={form.formState.errors.metricValue?.message} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="metric-metadata">Metadata (JSON optional)</Label>
        <Textarea
          id="metric-metadata"
          rows={4}
          placeholder='{"note":"weekly check-in"}'
          {...form.register("metadata")}
        />
        <FieldHint>
          Optional JSON for import notes, source details, or operator context.
        </FieldHint>
        <FieldError message={form.formState.errors.metadata?.message} />
      </div>
      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? "Saving metric..." : "Add metric snapshot"}
      </Button>
    </form>
  );

  if (variant === "plain") {
    return <div className="p-5 sm:p-6">{formContent}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add metric snapshot</CardTitle>
        <CardDescription>
          Record one metric row at a time so imports and manual entry share the same structure.
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
