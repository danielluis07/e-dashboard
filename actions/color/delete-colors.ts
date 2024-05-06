"use server";

import { useCurrentUser } from "@/hooks/use-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteColors = async (
  params: { storeId: string },
  colorsIds: string[]
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

    await db.color.deleteMany({
      where: {
        id: {
          in: colorsIds,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return { error: "Erro ao deletar a(s) core(s)" };
  }

  revalidatePath(`/dashboard/${params.storeId}/colors`);

  return { success: "Cores deletadas!" };
};
