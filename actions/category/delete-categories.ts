"use server";

import { useCurrentUser } from "@/hooks/use-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteCategories = async (
  params: { storeId: string },
  categoriesIds: string[]
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

    const dependentProducts = await db.product.findMany({
      where: {
        categoryId: {
          in: categoriesIds,
        },
      },
    });

    if (dependentProducts.length) {
      return {
        error:
          "Certifique-se de deletar os produtos relacionados a essa(s) categoria(s)!",
      };
    }

    await db.category.deleteMany({
      where: {
        id: {
          in: categoriesIds,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return { error: "Erro ao deletar as categorias" };
  }

  revalidatePath(`/dashboard/${params.storeId}/categories`);

  return { success: "Categorias deletadas!" };
};
