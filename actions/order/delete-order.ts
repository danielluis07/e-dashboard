"use server";

import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { revalidatePath } from "next/cache";

export const deleteOrder = async (storeId: string, orderId: string) => {
  const myUser = await useCurrentUser();

  const myUserId = myUser?.id;

  if (!myUserId) {
    return {
      error: "Não autorizado!",
    };
  }

  if (!orderId) {
    return { error: "É necessário o Id da cor" };
  }

  try {
    const storeByUserId = await db.store.findFirst({
      where: {
        id: storeId,
        myUserId,
      },
    });

    if (!storeByUserId) {
      return { error: "Não autorizado!" };
    }

    await db.order.delete({
      where: {
        id: orderId,
      },
    });
  } catch (error) {
    return { error: "Erro ao deletar o pedido" };
  }

  revalidatePath(`/dashboard/${storeId}/orders`);

  return { success: "Pedido deletado!" };
};
