import { db } from "@/lib/db";

export const getAccountByUserId = async (myUserId: string) => {
  try {
    const account = await db.account.findFirst({
      where: { myUserId },
    });

    return account;
  } catch {
    return null;
  }
};
