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

type AnalyticsChartProps = {
  data: Array<{
    label: string;
    streams: number;
    followers: number;
    engagementRate: number;
  }>;
};

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
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
          />
          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-card)",
              color: "var(--color-card-foreground)"
            }}
          />
          <Line
            type="monotone"
            dataKey="streams"
            stroke="var(--color-chart-1)"
            strokeWidth={3}
            dot={{ fill: "var(--color-chart-1)", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="followers"
            stroke="var(--color-chart-2)"
            strokeWidth={3}
            dot={{ fill: "var(--color-chart-2)", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

