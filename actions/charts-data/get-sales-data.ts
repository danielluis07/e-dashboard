import { db } from "@/lib/db";
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
  ).map((day) => {
    return {
      date: formatRevalidate(),
      totalSales: 0,
    };
  });

  return {
    chartData: null,
    amount: (data._sum.totalPrice || 0) / 100,
    numberOfSales: data._count,
  };
};
