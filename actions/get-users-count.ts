"use server";

import { db } from "@/lib/db";

export const getUsersCount = async (storeId: string) => {
  const usersCount = await db.user.count({
    where: {
      stores: {
        some: {
          storeId,
        },
      },
    },
  });

  return usersCount;
};
