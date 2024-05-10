import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { eachDayOfInterval, interval, startOfDay } from "date-fns";
import { getChartDateArray } from "./get-chart-date-array";

export const getSalesData = async (
  createdAfter: Date | null,
  createdBefore: Date | null
) => {
  const createdAtQuery: Prisma.OrderWhereInput["createdAt"] = {};
  if (createdAfter) createdAtQuery.gte = createdAfter;
  if (createdBefore) createdAtQuery.lte = createdBefore;

  const [data, chartData] = await Promise.all([
    db.order.aggregate({
      _sum: { totalPrice: true },
      _count: true,
    }),

    db.order.findMany({
      select: { createdAt: true, totalPrice: true },
      where: { createdAt: createdAtQuery },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const { array, format } = getChartDateArray(
    createdAfter || startOfDay(chartData[0].createdAt),
    createdBefore || new Date()
  );

  const dayArray = array.map((date) => {
    return {
      date: format(date),
      totalSales: 0,
    };
  });

  return {
    chartData: chartData.reduce((data, order) => {
      const formattedDate = format(order.createdAt);
      const entry = dayArray.find((day) => day.date === formattedDate);
      if (entry == null) return data;
      entry.totalSales += order.totalPrice / 100;
      return data;
    }, dayArray),
    amount: (data._sum.totalPrice || 0) / 100,
    numberOfSales: data._count,
  };
};
