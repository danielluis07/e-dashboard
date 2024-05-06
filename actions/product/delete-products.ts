"use server";

import { useCurrentUser } from "@/hooks/use-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteProducts = async (
  params: { storeId: string },
  productsIds: string[]
) => {
  const myUser = await useCurrentUser();

  const myUserId = myUser?.id;

  if (!myUserId) {
    return {
      error: "Não autorizado!",
    };
  }

  if (!productsIds || !productsIds.length) {
    return { error: "Nenhuma Id fornecida!" };
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

    const dependentOrderItems = await db.orderItem.findMany({
      where: {
        productId: { in: productsIds },
      },
      select: {
        id: true,
        productId: true,
      },
    });

    if (dependentOrderItems.length) {
      return {
        error:
          "Certifique-se de deletar os pedidos relacionados a esse(s) produto(s)!",
      };
    }

    await db.product.deleteMany({
      where: {
        id: {
          in: productsIds,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return { error: "Erro ao deletar os produtos" };
  }

  revalidatePath(`/dashboard/${params.storeId}/products`);

  return { success: "Produto(s) deletado(s)!" };
};
