"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarRange, LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  createCampaignAction,
  updateCampaignAction
} from "@/app/actions/campaign-actions";
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
  campaignStatusValues,
  releaseStatusLabels,
  releaseTypeLabels
} from "@/lib/domain-config";
import {
  campaignFormSchema,
  type CampaignFormValues
} from "@/lib/validations/campaigns";
import { getCampaignRoute } from "@/services/campaigns-helpers";
import type { CampaignReleaseOptionDto } from "@/services/campaigns-types";

const defaultValues: CampaignFormValues = {
  releaseId: "",
  name: "",
  objective: "",
  budget: "",
  startDate: "",
  endDate: "",
  status: "DRAFT",
  notes: ""
};

type CampaignFormProps = {
  mode?: "create" | "edit";
  campaignId?: string;
  initialValues?: CampaignFormValues;
  releaseOptions: CampaignReleaseOptionDto[];
};

export function CampaignForm({
  mode = "create",
  campaignId,
  initialValues = defaultValues,
  releaseOptions
}: CampaignFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: initialValues
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result =
        mode === "edit" && campaignId
          ? await updateCampaignAction(campaignId, values)
          : await createCampaignAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);

      if (mode === "create" && result.data?.campaignId) {
        form.reset(defaultValues);
        router.push(getCampaignRoute(result.data.campaignId));
        return;
      }

      router.refresh();
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "Edit campaign" : "Add campaign"}
        </CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "Update budget, timing, notes, and release linkage without leaving the campaign workspace."
            : "Track campaign windows, budget, and status while keeping the release link optional for MVP flexibility."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="campaign-name">Name</Label>
            <Input
              id="campaign-name"
              placeholder="Neon Skyline Pre-Save Push"
              {...form.register("name")}
            />
            <FieldHint>
              Use a clear internal working name so it stays recognizable in
              filters and links.
            </FieldHint>
            <FieldError message={form.formState.errors.name?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaign-objective">Objective</Label>
            <Input
              id="campaign-objective"
              placeholder="Drive pre-saves before release day"
              {...form.register("objective")}
            />
            <FieldHint>
              Keep this outcome-focused so the campaign has a single operational
              purpose.
            </FieldHint>
            <FieldError message={form.formState.errors.objective?.message} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="campaign-budget">Budget (USD)</Label>
              <Input
                id="campaign-budget"
                type="number"
                min={0}
                step={1}
                {...form.register("budget")}
              />
              <FieldHint>
                Optional for organic campaigns, but helpful for pacing and recap
                reporting.
              </FieldHint>
              <FieldError message={form.formState.errors.budget?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-start">Start date</Label>
              <Input
                id="campaign-start"
                type="date"
                {...form.register("startDate")}
              />
              <FieldHint>The campaign timeline starts here.</FieldHint>
              <FieldError message={form.formState.errors.startDate?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-end">End date</Label>
              <Input
                id="campaign-end"
                type="date"
                {...form.register("endDate")}
              />
              <FieldHint>
                Leave blank for open-ended work, or set a close date for the
                push.
              </FieldHint>
              <FieldError message={form.formState.errors.endDate?.message} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="campaign-status">Status</Label>
              <Select id="campaign-status" {...form.register("status")}>
                {campaignStatusValues.map((value) => (
                  <option key={value} value={value}>
                    {campaignStatusLabels[value]}
                  </option>
                ))}
              </Select>
              <FieldHint>
                Statuses help separate active launch work from backlog and
                completed campaigns.
              </FieldHint>
              <FieldError message={form.formState.errors.status?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-release">Linked release</Label>
              <Select id="campaign-release" {...form.register("releaseId")}>
                <option value="">No linked release</option>
                {releaseOptions.map((release) => (
                  <option key={release.id} value={release.id}>
                    {release.title} - {releaseTypeLabels[release.type]} -{" "}
                    {releaseStatusLabels[release.status]}
                  </option>
                ))}
              </Select>
              <FieldHint>
                Optional now, but link it when the campaign directly supports a
                release cycle.
              </FieldHint>
              <FieldError message={form.formState.errors.releaseId?.message} />
            </div>
          </div>
          {releaseOptions.length === 0 ? (
            <FormCallout
              title="No releases available yet"
              description="You can save the campaign now and link it to a release later once one exists in the catalog."
              icon={CalendarRange}
            />
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="campaign-notes">Notes</Label>
            <Textarea
              id="campaign-notes"
              rows={5}
              {...form.register("notes")}
            />
            <FieldHint>
              Capture channel plans, creative angles, or operator context that
              should not get lost.
            </FieldHint>
            <FieldError message={form.formState.errors.notes?.message} />
          </div>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : mode === "edit" ? (
              <Save className="size-4" />
            ) : null}
            {isPending
              ? mode === "edit"
                ? "Saving changes..."
                : "Saving campaign..."
              : mode === "edit"
                ? "Save changes"
                : "Create campaign"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
