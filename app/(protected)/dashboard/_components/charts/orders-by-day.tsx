"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface OrdersByDayChartProps {
  data: Array<{
    date: string;
    totalSales: number;
  }>;
}

export const OrdersByDayChart = ({ data }: OrdersByDayChartProps) => {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <LineChart data={data} width={500} height={200}>
        <CartesianGrid />
        <XAxis dataKey="date" name="Date" />
        <YAxis dataKey="" />
        <Tooltip />
        <Line dot={false} dataKey="value" type="monotone" />
      </LineChart>
    </ResponsiveContainer>
  );
};
