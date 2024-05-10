import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { eachDayOfInterval, interval, startOfDay } from "date-fns";
import { getChartDateArray } from "./get-chart-date-array";

export const getUserData = async (
  storeId: string,
  createdAfter: Date | null,
  createdBefore: Date | null
) => {
  const createdAtQuery: Prisma.UserWhereInput["createdAt"] = {};
  if (createdAfter) createdAtQuery.gte = createdAfter;
  if (createdBefore) createdAtQuery.lte = createdBefore;

  const [userCount, orderData, chartData] = await Promise.all([
    db.storeUser.count({
      where: {
        storeId: storeId,
        user: {
          createdAt: createdAtQuery,
        },
      },
    }),
    db.order.aggregate({
      _sum: { totalPrice: true },
      where: {
        storeId,
      },
    }),
    db.user.findMany({
      where: {
        stores: {
          some: {
            storeId,
          },
        },
        createdAt: createdAtQuery,
      },
      select: { createdAt: true },
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
      totalUsers: 0,
    };
  });

  return {
    chartData: chartData.reduce((data, user) => {
      const formattedDate = format(user.createdAt);
      const entry = dayArray.find((day) => day.date === formattedDate);
      if (entry == null) return data;
      entry.totalUsers += 1;
      return data;
    }, dayArray),
    userCount,
    averageValuePerUser:
      userCount === 0 ? 0 : (orderData._sum.totalPrice || 0) / userCount / 100,
  };
};
