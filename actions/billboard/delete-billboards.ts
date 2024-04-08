"use server";

import { useCurrentUser } from "@/hooks/use-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteBillboards = async (params: { storeId: string }) => {
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

    await db.billboard.deleteMany({
      where: {
        storeId: params.storeId,
      },
    });
  } catch (error) {
    console.log(error);
    return { error: "Erro ao deletar os banners" };
  }

  revalidatePath(`/dashboard/${params.storeId}/billboards`);

  return { success: "Banners deletados!" };
};
