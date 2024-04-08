"use server";

import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { revalidatePath } from "next/cache";

export const deleteColor = async (params: {
  storeId: string;
  colorId: string;
}) => {
  const myUser = await useCurrentUser();

  const myUserId = myUser?.id;

  if (!myUserId) {
    return {
      error: "Não autorizado!",
    };
  }

  if (!params.colorId) {
    return { error: "É necessário o Id da cor" };
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

    await db.color.delete({
      where: {
        id: params.colorId,
      },
    });
  } catch (error) {
    return { error: "Erro ao deletar a cor" };
  }

  revalidatePath(`/dashboard/${params.storeId}/colors`);

  return { success: "Cor deletada!" };
};
