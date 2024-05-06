"use server";

import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { revalidatePath } from "next/cache";

export const deleteProduct = async (params: {
  storeId: string;
  productId: string;
}) => {
  const myUser = await useCurrentUser();

  const myUserId = myUser?.id;

  if (!myUserId) {
    return {
      error: "Não autorizado!",
    };
  }

  if (!params.productId) {
    return { error: "É necessário o Id do produto" };
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
        productId: params.productId,
      },
      select: {
        id: true,
        productId: true,
      },
    });

    if (dependentOrderItems.length) {
      return {
        error:
          "Certifique-se de deletar os pedidos relacionados a esse produto!",
      };
    }

    await db.product.delete({
      where: {
        id: params.productId,
      },
    });
  } catch (error) {
    console.log(error);
    return { error: "Erro ao deletar o produto" };
  }

  revalidatePath(`/dashboard/${params.storeId}/products`);

  return { success: "Produto deletado!" };
};
