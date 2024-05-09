import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { eachDayOfInterval, interval } from "date-fns";

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

  const dayArray = eachDayOfInterval(
    interval(
      createdAfter || chartData[0].createdAt,
      createdBefore || new Date()
    )
  ).map((date) => {
    return {
      date: formatDate(date),
      totalSales: 0,
    };
  });

  return {
    chartData: chartData.reduce((data, order) => {
      const formattedDate = formatDate(order.createdAt);
      const entry = dayArray.find((day) => day.date === formattedDate);
      if (entry == null) return data;
      entry.totalSales += order.totalPrice / 100;
      return data;
    }, dayArray),
    amount: (data._sum.totalPrice || 0) / 100,
    numberOfSales: data._count,
  };
};
