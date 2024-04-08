import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (myUserId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { myUserId },
    });

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};
