"use server";

import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { revalidatePath } from "next/cache";

export const deleteCategory = async (params: {
  storeId: string;
  categoryId: string;
}) => {
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

    await db.category.delete({
      where: {
        id: params.categoryId,
      },
    });
  } catch (error) {
    console.log(error);
    return { error: "Erro ao deletar a categoria" };
  }

  revalidatePath(`/dashboard/${params.storeId}/categories`);

  return { success: "Categoria deletada!" };
};
