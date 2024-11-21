"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OverviewProps {
  data: Array<{
    month: string;
    total: number;
  }>;
}

export function Overview({ data }: OverviewProps) {
  const formattedData = data.map((item) => ({
    name: new Date(item.month).toLocaleString("default", { month: "short" }),
    total: parseFloat(item.total.toString()),
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
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
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
