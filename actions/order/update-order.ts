"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { revalidatePath } from "next/cache";
import { OrderSchema } from "@/schemas";

export const updateOrder = async (
  values: z.infer<typeof OrderSchema>,
  params: {
    storeId: string;
    orderId: string;
  }
) => {
  const myUser = await useCurrentUser();

  const userId = myUser?.id;

  if (!userId) {
    return {
      error: "Não autorizado!",
    };
  }

  const validatedFields = OrderSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { logisticStatus, trackId } = validatedFields.data;

  if (!logisticStatus) {
    return { error: "É necessário informar a situação do pedido" };
  }

  try {
    await db.order.update({
      where: {
        id: params.orderId,
        storeId: params.storeId,
      },
      data: {
        logisticStatus,
        trackId,
      },
    });
  } catch (error) {
    return { error: "Erro ao atualizar o pedido" };
  }

  revalidatePath(`/dashboard/${params.storeId}/orders`);

  return { success: "Pedido atualizado!" };
};
