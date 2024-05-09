"use client";

import { convertCentsToReal, formatCurrency } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface UsersByDayChartProps {
  data: Array<{
    date: string;
    totalUsers: number;
  }>;
}

export const UsersByDayChart = ({ data }: UsersByDayChartProps) => {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <BarChart data={data} width={500} height={200}>
        <CartesianGrid />
        <XAxis dataKey="date" name="Date" />
        <YAxis tickFormatter={(tick) => tick} />
        <Tooltip formatter={(value) => value} />
        <Bar dataKey="totalUsers" name="Usuários" type="monotone" />
      </BarChart>
    </ResponsiveContainer>
  );
};
