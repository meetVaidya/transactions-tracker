"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface TopRegionsChartProps {
  data: Array<{
    merchant_state: string;
    count: number;
    total_amount: number;
  }>;
}

export function TopRegionsChart({ data }: TopRegionsChartProps) {
  const formattedData = data.map((item) => ({
    name: item.merchant_state,
    value: item.count,
    amount: parseFloat(item.total_amount.toFixed(2)),
  }));

  return (
    <ChartContainer
      config={{
        value: {
          label: "Transactions",
          color: "hsl(var(--chart-4))",
        },
        amount: {
          label: "Total Amount",
          color: "hsl(var(--chart-5))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData}>
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
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="value"
            fill="var(--color-value)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="amount"
            fill="var(--color-amount)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
