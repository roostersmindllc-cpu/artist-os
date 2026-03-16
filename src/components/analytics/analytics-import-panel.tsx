"use client";

import { type ChangeEvent, useState, useTransition } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { importMetricSnapshotsAction } from "@/app/actions/analytics-actions";
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
import { Select } from "@/components/ui/select";
import {
  metricImportColumnLabels,
  metricImportColumnTargets,
  previewMetricCsvImport,
  type MetricImportColumnMapping
} from "@/services/analytics-import";

const emptyMapping: MetricImportColumnMapping = {
  source: "",
  metricName: "",
  metricValue: "",
  recordedAt: "",
  metadata: ""
};

type AnalyticsImportPanelProps = {
  template: string;
};

export function AnalyticsImportPanel({ template }: AnalyticsImportPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState("");
  const [mapping, setMapping] = useState<MetricImportColumnMapping>(emptyMapping);
  const [fileError, setFileError] = useState<string | null>(null);
  const preview = csvText ? previewMetricCsvImport(csvText, mapping) : null;

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const nextPreview = previewMetricCsvImport(text);

      setCsvText(text);
      setFileName(file.name);
      setMapping(nextPreview.mapping);
      setFileError(null);
    } catch {
      setFileError("The CSV file could not be read.");
    }
  };

  const handleImport = () => {
    if (!preview || preview.validRowCount === 0 || preview.invalidRowCount > 0) {
      return;
    }

    startTransition(async () => {
      const result = await importMetricSnapshotsAction({
        csvText,
        mapping
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      setCsvText("");
      setFileName("");
      setMapping(emptyMapping);
      setFileError(null);
      router.refresh();
    });
  };

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle>CSV import</CardTitle>
        <CardDescription>
          Upload a metric snapshot CSV, confirm the column mapping, preview normalized rows,
          and import only when validation is clean.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="analytics-csv-file">CSV file</Label>
          <Input
            id="analytics-csv-file"
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            disabled={isPending}
          />
          <FieldError message={fileError ?? undefined} />
          <p className="text-xs text-muted-foreground">
            {fileName ? `${fileName} loaded for preview.` : "Upload a CSV with headers."}
          </p>
        </div>

        {preview ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {metricImportColumnTargets.map((target) => (
                <div key={target} className="space-y-2">
                  <Label htmlFor={`analytics-mapping-${target}`}>
                    {metricImportColumnLabels[target]}
                  </Label>
                  <Select
                    id={`analytics-mapping-${target}`}
                    value={mapping[target]}
                    onChange={(event) =>
                      setMapping((current) => ({
                        ...current,
                        [target]: event.target.value
                      }))
                    }
                    disabled={isPending}
                  >
                    <option value="">
                      {target === "metadata" ? "Not mapped" : "Select a column"}
                    </option>
                    {preview.headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Total rows
                </p>
                <p className="mt-2 font-heading text-3xl font-semibold">
                  {preview.totalRows}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Valid rows
                </p>
                <p className="mt-2 font-heading text-3xl font-semibold text-emerald-500">
                  {preview.validRowCount}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Invalid rows
                </p>
                <p className="mt-2 font-heading text-3xl font-semibold text-amber-500">
                  {preview.invalidRowCount}
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-border/70 bg-background/35 p-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-4 text-primary" />
                <p className="font-medium">Preview</p>
              </div>
              {preview.previewRows.length > 0 ? (
                <div className="space-y-3">
                  {preview.previewRows.slice(0, 5).map((row) => (
                    <div
                      key={`${row.rowNumber}-${row.recordedAt}`}
                      className="rounded-xl border border-border/60 bg-background/70 p-3 text-sm"
                    >
                      <p className="font-medium">
                        Row {row.rowNumber}: {row.sourceLabel} {row.metricLabel.toLowerCase()}
                      </p>
                      <p className="text-muted-foreground">
                        {row.metricValue} on {row.recordedAt}
                      </p>
                      <p className="text-muted-foreground">Metadata: {row.metadataPreview}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No valid rows are available for preview yet.
                </p>
              )}
            </div>

            {preview.errors.length > 0 ? (
              <div className="space-y-3 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-4">
                <p className="font-medium text-amber-600">Import issues</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {preview.errors.slice(0, 6).map((error) => (
                    <li key={`${error.rowNumber}-${error.message}`}>
                      Row {error.rowNumber}: {error.message}
                    </li>
                  ))}
                </ul>
                {preview.errors.length > 6 ? (
                  <p className="text-sm text-muted-foreground">
                    {preview.errors.length - 6} more row errors are hidden. Fix the CSV and
                    upload it again.
                  </p>
                ) : null}
              </div>
            ) : null}

            <Button
              type="button"
              className="w-full"
              disabled={isPending || preview.validRowCount === 0 || preview.invalidRowCount > 0}
              onClick={handleImport}
            >
              <Upload className="size-4" />
              {isPending ? "Importing metrics..." : "Import validated metrics"}
            </Button>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/70 bg-background/35 p-5 text-sm leading-6 text-muted-foreground">
            Upload a CSV to unlock mapping, preview, and import.
          </div>
        )}

        <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            CSV template
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-background/70 p-3 text-xs leading-6 text-muted-foreground">
            {template}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
