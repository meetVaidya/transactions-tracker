"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ProcessingLatencyChartProps {
  data: Array<{
    hour: string;
    avg_latency: number;
  }>;
}

export function ProcessingLatencyChart({
  data = [
    { hour: "2024-01-01T00:00:00", avg_latency: 0.5 },
    { hour: "2024-01-01T01:00:00", avg_latency: 0.8 },
    { hour: "2024-01-01T02:00:00", avg_latency: 0.3 },
    { hour: "2024-01-01T03:00:00", avg_latency: 1.2 },
    { hour: "2024-01-01T04:00:00", avg_latency: 0.7 },
    { hour: "2024-01-01T05:00:00", avg_latency: 0.9 },
  ],
}: ProcessingLatencyChartProps) {
  const formattedData = data.map((item) => ({
    name: new Date(item.hour).toLocaleTimeString(),
    value: item.avg_latency ? parseFloat(item.avg_latency.toFixed(2)) : 0,
  }));

  return (
    <ChartContainer
      config={{
        value: {
          label: "Latency (s)",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}s`}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
