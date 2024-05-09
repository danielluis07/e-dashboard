import { db } from "@/lib/db";

const getSalesData = async () => {
  const data = await db.order.aggregate({
    _sum: {},
  });
};
