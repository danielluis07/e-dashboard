"use client";

import { convertCentsToReal, formatCurrency } from "@/lib/utils";
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
  const error = console.error;
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <LineChart data={data} width={500} height={200}>
        <CartesianGrid />
        <XAxis dataKey="date" name="Date" />
        <YAxis tickFormatter={(tick) => tick} />
        <Tooltip formatter={(value) => formatCurrency(value as number)} />
        <Line dot={false} dataKey="totalSales" name="Renda" type="monotone" />
      </LineChart>
    </ResponsiveContainer>
  );
};
