"use server";

import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { revalidatePath } from "next/cache";

export const deleteStore = async (params: { storeId: string }) => {
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

    await db.store.delete({
      where: {
        id: params.storeId,
      },
    });
  } catch (error) {
    console.log(error);
    return { error: "Erro ao deletar a loja" };
  }

  const stores = await db.store.findMany({
    where: {
      myUserId,
    },
  });

  revalidatePath(`/dashboard/${stores[0].id}`);

  return { success: "Loja deletada!" };
};
