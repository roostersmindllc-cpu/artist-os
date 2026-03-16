import { format, isValid, parse, startOfDay } from "date-fns";
import { z } from "zod";

import {
  metricNameLabels,
  metricNameValues,
  metricSourceLabels,
  metricSourceValues
} from "@/lib/domain-config";
import { stringToDate } from "@/lib/validations/shared";
import { getMetricDisplayLabel } from "@/services/analytics-helpers";

export type MetricSourceValue = (typeof metricSourceValues)[number];
export type MetricNameValue = (typeof metricNameValues)[number];

export const metricImportColumnTargets = [
  "source",
  "metricName",
  "metricValue",
  "recordedAt",
  "metadata"
] as const;

export type MetricImportColumnTarget = (typeof metricImportColumnTargets)[number];

export const metricImportColumnLabels: Record<MetricImportColumnTarget, string> = {
  source: "Source column",
  metricName: "Metric column",
  metricValue: "Value column",
  recordedAt: "Date column",
  metadata: "Metadata column"
};

export const metricImportMappingSchema = z.object({
  source: z.string().min(1, "Map a source column."),
  metricName: z.string().min(1, "Map a metric column."),
  metricValue: z.string().min(1, "Map a value column."),
  recordedAt: z.string().min(1, "Map a date column."),
  metadata: z.string().optional().default("")
});

export type MetricImportColumnMapping = z.infer<typeof metricImportMappingSchema>;

export const metricImportSubmissionSchema = z.object({
  csvText: z.string().trim().min(1, "Upload a CSV file before importing."),
  mapping: metricImportMappingSchema
});

export type MetricImportRow = {
  source: MetricSourceValue;
  metricName: MetricNameValue;
  metricValue: number;
  recordedAt: Date;
  metadata: Record<string, unknown> | null;
};

export type MetricImportPreviewRow = {
  rowNumber: number;
  source: MetricSourceValue;
  metricName: MetricNameValue;
  sourceLabel: string;
  metricLabel: string;
  metricValue: number;
  recordedAt: string;
  metadataPreview: string;
};

export type MetricImportPreviewError = {
  rowNumber: number;
  message: string;
};

export type MetricImportPreview = {
  headers: string[];
  mapping: MetricImportColumnMapping;
  validRows: MetricImportRow[];
  previewRows: MetricImportPreviewRow[];
  errors: MetricImportPreviewError[];
  totalRows: number;
  validRowCount: number;
  invalidRowCount: number;
};

export const analyticsCsvTemplateExample = [
  "source,metric_name,metric_value,recorded_at,metadata",
  'Spotify,Streams,12450,2026-03-01,"{""note"":""weekly snapshot""}"',
  "YouTube,Views,8420,2026-03-01,",
  "TikTok,Views,15300,2026-03-01,",
  "Instagram,Followers,2490,2026-03-01,",
  "Email,Email subscribers,1180,2026-03-01,"
].join("\n");

const sourceAliases: Record<MetricSourceValue, string[]> = {
  SPOTIFY: ["spotify"],
  APPLE_MUSIC: ["applemusic", "apple music"],
  YOUTUBE: ["youtube", "yt"],
  INSTAGRAM: ["instagram", "ig"],
  TIKTOK: ["tiktok", "tik tok"],
  MAILING_LIST: ["email", "mailing list", "newsletter", "email list", "mailchimp"],
  MANUAL: ["manual"]
};

const metricAliases: Record<MetricNameValue, string[]> = {
  STREAMS: ["streams", "stream", "plays", "play count", "views", "view", "video views"],
  FOLLOWERS: ["followers", "follower", "fans", "audience", "subscribers"],
  ENGAGEMENT_RATE: [
    "engagement rate",
    "engagement",
    "engagement %",
    "engagement percent"
  ],
  REVENUE_USD: ["revenue", "revenue usd", "usd revenue", "gross revenue"],
  PRE_SAVES: ["pre saves", "presaves", "pre-save", "pre saves count"],
  TICKET_SALES: ["ticket sales", "tickets sold", "tickets"],
  EMAIL_SUBSCRIBERS: [
    "email subscribers",
    "mailing list subscribers",
    "newsletter subscribers"
  ]
};

const metricImportDateFormats = [
  "yyyy-MM-dd",
  "MM/dd/yyyy",
  "M/d/yyyy",
  "MM/d/yyyy",
  "M/dd/yyyy",
  "MM/dd/yy",
  "M/d/yy",
  "MMM d, yyyy",
  "MMMM d, yyyy",
  "MMM d yyyy",
  "MMMM d yyyy"
] as const;

function normalizeToken(value: string) {
  return value.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

function normalizeHeaderToken(value: string) {
  return normalizeToken(value).replace(/\s+/g, "");
}

function parseCsvText(csvText: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let isQuoted = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const character = csvText[index];
    const nextCharacter = csvText[index + 1];

    if (character === '"') {
      if (isQuoted && nextCharacter === '"') {
        value += '"';
        index += 1;
      } else {
        isQuoted = !isQuoted;
      }

      continue;
    }

    if (character === "," && !isQuoted) {
      row.push(value);
      value = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !isQuoted) {
      if (character === "\r" && nextCharacter === "\n") {
        index += 1;
      }

      row.push(value);
      rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += character;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  return rows.filter((currentRow) => currentRow.some((cell) => cell.trim().length > 0));
}

function guessColumn(headers: string[], aliases: string[]) {
  const lookup = new Map(headers.map((header) => [normalizeHeaderToken(header), header]));

  for (const alias of aliases) {
    const header = lookup.get(normalizeHeaderToken(alias));

    if (header) {
      return header;
    }
  }

  return "";
}

function parseMetricSource(rawValue: string) {
  const normalizedValue = normalizeToken(rawValue);

  for (const source of metricSourceValues) {
    if (
      normalizedValue === normalizeToken(metricSourceLabels[source]) ||
      sourceAliases[source].includes(normalizedValue)
    ) {
      return source;
    }
  }

  return null;
}

function parseMetricName(rawValue: string, source: MetricSourceValue) {
  const normalizedValue = normalizeToken(rawValue);

  if (normalizedValue === "subscribers") {
    return source === "MAILING_LIST" ? "EMAIL_SUBSCRIBERS" : "FOLLOWERS";
  }

  for (const metricName of metricNameValues) {
    if (
      normalizedValue === normalizeToken(metricNameLabels[metricName]) ||
      metricAliases[metricName].includes(normalizedValue)
    ) {
      return metricName;
    }
  }

  return null;
}

function parseMetricValue(rawValue: string) {
  const normalizedValue = rawValue
    .trim()
    .replace(/,/g, "")
    .replace(/\$/g, "")
    .replace(/%/g, "");

  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function parseRecordedAt(rawValue: string) {
  const trimmedValue = rawValue.trim();

  if (!trimmedValue) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
    return stringToDate(trimmedValue);
  }

  for (const formatString of metricImportDateFormats) {
    const parsedDate = parse(trimmedValue, formatString, new Date());

    if (isValid(parsedDate)) {
      return startOfDay(parsedDate);
    }
  }

  const parsedDate = new Date(trimmedValue);

  if (isValid(parsedDate)) {
    return startOfDay(parsedDate);
  }

  return null;
}

function normalizeMetadataValue(rawValue: string) {
  const trimmedValue = rawValue.trim();

  if (!trimmedValue) {
    return null;
  }

  try {
    return JSON.parse(trimmedValue) as Record<string, unknown>;
  } catch {
    return {
      raw: trimmedValue
    };
  }
}

function readMappedValue(
  row: string[],
  headers: string[],
  headerName: string | undefined
) {
  if (!headerName) {
    return "";
  }

  const headerIndex = headers.indexOf(headerName);

  if (headerIndex < 0) {
    return "";
  }

  return row[headerIndex] ?? "";
}

function buildImportDuplicateKey(row: MetricImportRow) {
  return [row.source, row.metricName, format(row.recordedAt, "yyyy-MM-dd")].join("::");
}

export function guessMetricImportMapping(headers: string[]): MetricImportColumnMapping {
  return {
    source: guessColumn(headers, ["source", "platform", "channel"]),
    metricName: guessColumn(headers, ["metric name", "metric", "metric_name", "kpi"]),
    metricValue: guessColumn(headers, ["metric value", "value", "metric_value", "count", "total"]),
    recordedAt: guessColumn(headers, ["recorded at", "recorded_at", "date", "snapshot date"]),
    metadata: guessColumn(headers, ["metadata", "notes", "note", "context", "json"])
  };
}

export function previewMetricCsvImport(
  csvText: string,
  mapping?: Partial<MetricImportColumnMapping>
): MetricImportPreview {
  const rows = parseCsvText(csvText);
  const headers = rows[0]?.map((value) => value.trim()) ?? [];
  const resolvedMapping = metricImportMappingSchema.safeParse({
    ...guessMetricImportMapping(headers),
    ...mapping
  });

  if (!resolvedMapping.success) {
    return {
      headers,
      mapping: guessMetricImportMapping(headers),
      validRows: [],
      previewRows: [],
      errors: [
        {
          rowNumber: 1,
          message: resolvedMapping.error.issues[0]?.message ?? "Invalid CSV mapping."
        }
      ],
      totalRows: Math.max(rows.length - 1, 0),
      validRowCount: 0,
      invalidRowCount: Math.max(rows.length - 1, 0)
    };
  }

  const finalMapping = resolvedMapping.data;

  if (headers.length === 0) {
    return {
      headers,
      mapping: finalMapping,
      validRows: [],
      previewRows: [],
      errors: [
        {
          rowNumber: 1,
          message: "CSV must include a header row."
        }
      ],
      totalRows: 0,
      validRowCount: 0,
      invalidRowCount: 0
    };
  }

  const mappingErrors = metricImportColumnTargets
    .filter((target) => target !== "metadata")
    .flatMap((target) => {
      const selectedHeader = finalMapping[target];

      if (headers.includes(selectedHeader)) {
        return [];
      }

      return [
        {
          rowNumber: 1,
          message: `${metricImportColumnLabels[target]} does not match a CSV header.`
        }
      ];
    });

  if (mappingErrors.length > 0) {
    return {
      headers,
      mapping: finalMapping,
      validRows: [],
      previewRows: [],
      errors: mappingErrors,
      totalRows: Math.max(rows.length - 1, 0),
      validRowCount: 0,
      invalidRowCount: Math.max(rows.length - 1, 0)
    };
  }

  const errors: MetricImportPreviewError[] = [];
  const validRows: MetricImportRow[] = [];
  const previewRows: MetricImportPreviewRow[] = [];
  const seenKeys = new Set<string>();
  const dataRows = rows.slice(1);

  dataRows.forEach((row, rowIndex) => {
    const rowNumber = rowIndex + 2;
    const rawSource = readMappedValue(row, headers, finalMapping.source);
    const rawMetricName = readMappedValue(row, headers, finalMapping.metricName);
    const rawMetricValue = readMappedValue(row, headers, finalMapping.metricValue);
    const rawRecordedAt = readMappedValue(row, headers, finalMapping.recordedAt);
    const rawMetadata = readMappedValue(row, headers, finalMapping.metadata);
    const rowMessages: string[] = [];

    const source = parseMetricSource(rawSource);

    if (!source) {
      rowMessages.push(`Unknown source "${rawSource}".`);
    }

    const metricName = source ? parseMetricName(rawMetricName, source) : null;

    if (!metricName) {
      rowMessages.push(`Unknown metric "${rawMetricName}".`);
    }

    const metricValue = parseMetricValue(rawMetricValue);

    if (metricValue === null || metricValue < 0) {
      rowMessages.push(`Metric value "${rawMetricValue}" must be a non-negative number.`);
    }

    const recordedAt = parseRecordedAt(rawRecordedAt);

    if (!recordedAt) {
      rowMessages.push(`Recorded date "${rawRecordedAt}" is not valid.`);
    }

    if (rowMessages.length > 0 || !source || !metricName || metricValue === null || !recordedAt) {
      errors.push({
        rowNumber,
        message: rowMessages.join(" ")
      });
      return;
    }

    const normalizedRow: MetricImportRow = {
      source,
      metricName,
      metricValue,
      recordedAt,
      metadata: normalizeMetadataValue(rawMetadata)
    };

    const duplicateKey = buildImportDuplicateKey(normalizedRow);

    if (seenKeys.has(duplicateKey)) {
      errors.push({
        rowNumber,
        message: `Duplicate snapshot for ${metricSourceLabels[source]} ${getMetricDisplayLabel(
          source,
          metricName
        ).toLowerCase()} on ${format(recordedAt, "MMM d, yyyy")}.`
      });
      return;
    }

    seenKeys.add(duplicateKey);
    validRows.push(normalizedRow);
    previewRows.push({
      rowNumber,
      source,
      metricName,
      sourceLabel: metricSourceLabels[source],
      metricLabel: getMetricDisplayLabel(source, metricName),
      metricValue,
      recordedAt: format(recordedAt, "MMM d, yyyy"),
      metadataPreview: normalizedRow.metadata ? JSON.stringify(normalizedRow.metadata) : "None"
    });
  });

  return {
    headers,
    mapping: finalMapping,
    validRows,
    previewRows,
    errors,
    totalRows: dataRows.length,
    validRowCount: validRows.length,
    invalidRowCount: errors.length
  };
}
