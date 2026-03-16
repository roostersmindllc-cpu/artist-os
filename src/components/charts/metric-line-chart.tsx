"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { formatMetricValue } from "@/lib/utils";
import type { MetricNameValue } from "@/services/analytics-import";

type MetricLineChartProps = {
  data: Array<{
    label: string;
    value: number;
  }>;
  metricName: MetricNameValue;
};

export function MetricLineChart({ data, metricName }: MetricLineChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            tickFormatter={(value) => formatMetricValue(metricName, Number(value))}
          />
          <Tooltip
            formatter={(value) => formatMetricValue(metricName, Number(value))}
            contentStyle={{
              borderRadius: "16px",
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-card)",
              color: "var(--color-card-foreground)"
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-chart-1)"
            strokeWidth={3}
            dot={{ fill: "var(--color-chart-1)", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
