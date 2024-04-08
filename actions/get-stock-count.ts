"use server";

import { db } from "@/lib/db";

export const getStockCount = async (storeId: string) => {
  const totalStock = await db.product.aggregate({
    where: {
      storeId,
    },
    _sum: {
      stock: true,
    },
  });

  const {
    _sum: { stock },
  } = totalStock;

  return stock;
};
