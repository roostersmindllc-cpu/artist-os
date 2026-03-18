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
import type { DashboardHeroChart } from "@/services/dashboard-helpers";

type DashboardHeroMetricChartProps = {
  chart: DashboardHeroChart;
};

export function DashboardHeroMetricChart({
  chart
}: DashboardHeroMetricChartProps) {
  return (
    <div className="h-[220px] w-full sm:h-[280px] lg:h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chart.points} margin={{ left: 8, right: 8, top: 18, bottom: 8 }}>
          <CartesianGrid stroke="rgba(15,23,42,0.12)" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgba(17,24,39,0.58)", fontSize: 12, fontWeight: 600 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgba(17,24,39,0.58)", fontSize: 12, fontWeight: 600 }}
            tickFormatter={(value) =>
              formatMetricValue(chart.metricName, Number(value))
            }
          />
          <Tooltip
            formatter={(value) =>
              formatMetricValue(chart.metricName, Number(value))
            }
            contentStyle={{
              borderRadius: "18px",
              borderColor: "rgba(15,23,42,0.12)",
              backgroundColor: "rgba(255,255,255,0.98)",
              color: "#111827",
              boxShadow: "0 12px 26px rgba(0,0,0,0.08)"
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#12d5ef"
            strokeWidth={4}
            dot={{ fill: "#111111", r: 4, strokeWidth: 0 }}
            activeDot={{ fill: "#b360ff", r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
