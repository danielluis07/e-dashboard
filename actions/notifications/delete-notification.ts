"use server";

import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { revalidatePath } from "next/cache";

export const deleteNotification = async (
  params: {
    storeId: string;
  },
  notificationId: string
) => {
  const myUser = await useCurrentUser();

  const myUserId = myUser?.id;

  if (!myUserId) {
    return {
      error: "Não autorizado!",
    };
  }

  try {
    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        myUserId,
      },
    });

    if (!storeByUserId) {
      return { error: "Não autorizado!" };
    }

    await db.notification.delete({
      where: {
        storeId: params.storeId,
        id: notificationId,
      },
    });
  } catch (error) {
    console.log(error);
    return { error: "Algo deu errado!" };
  }

  revalidatePath(`/dashboard/${params.storeId}`);
};
