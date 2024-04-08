"use server";

import { useCurrentUser } from "@/hooks/use-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteCategories = async (params: { storeId: string }) => {
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

    await db.category.deleteMany({
      where: {
        storeId: params.storeId,
      },
    });
  } catch (error) {
    console.log(error);
    return { error: "Erro ao deletar as categorias" };
  }

  revalidatePath(`/dashboard/${params.storeId}/categories`);

  return { success: "Categorias deletadas!" };
};
