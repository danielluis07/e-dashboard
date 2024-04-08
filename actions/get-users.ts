import { db } from "@/lib/db";

export const getUsers = async (storeId: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const usersData = await usersFetch();

  for (const userData of usersData) {
    await db.user.create({
      data: {
        id: userData.id,
        stores: {},
      },
    });
  }

  async function usersFetch() {
    try {
      const res = await fetch(`${baseUrl}/api/users/${storeId}`, {
        cache: "no-cache",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch users with storeId: ${storeId}`);
      }

      return res.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
};
