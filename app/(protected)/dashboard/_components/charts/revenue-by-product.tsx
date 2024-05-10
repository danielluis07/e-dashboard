"use client";

import { formatCurrency } from "@/lib/utils";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface RevenueByProductChartProps {
  data: Array<{
    name: string;
    revenue: number;
  }>;
}

export const RevenueByProductChart = ({ data }: RevenueByProductChartProps) => {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <PieChart data={data} width={500} height={200}>
        <Tooltip formatter={(value) => formatCurrency(value as number)} />
        <Pie
          data={data}
          label={(item) => item.name}
          dataKey="revenue"
          nameKey="name"
          type="monotone"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
