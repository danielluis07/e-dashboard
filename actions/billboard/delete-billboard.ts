"use server";

import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { revalidatePath } from "next/cache";

export const deleteBillboard = async (params: {
  storeId: string;
  billboardId: string;
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

    await db.billboard.delete({
      where: {
        id: params.billboardId,
      },
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return {
          error:
            "Certifique-se de deletar todos as categorias que utilizam esse banner primeiro",
        };
      }
    }
    return { error: "Algo deu errado!" };
  }

  revalidatePath(`/dashboard/${params.storeId}/billboards`);

  return { success: "Banner deletado!" };
};
