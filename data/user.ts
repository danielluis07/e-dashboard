import { db } from "@/lib/db";

export const getUserByEmail = async (email: string | undefined) => {
  try {
    const user = await db.myUser.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string | undefined) => {
  try {
    const user = await db.myUser.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};
