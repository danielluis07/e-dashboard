"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ColorSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const updateColor = async (
  values: z.infer<typeof ColorSchema>,
  params: {
    storeId: string;
    colorId: string;
  }
) => {
  const myUser = await useCurrentUser();

  const myUserId = myUser?.id;

  if (!myUserId) {
    return {
      error: "Não autorizado!",
    };
  }

  const validatedFields = ColorSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { name, value } = validatedFields.data;

  if (!name) {
    return { error: "É necessário informar um nome" };
  }

  if (!value) {
    return { error: "Cor não encontrada" };
  }

  if (!params.storeId) {
    return { error: "Loja não encontrada" };
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

    await db.color.update({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });
  } catch (error) {
    return { error: "Erro ao atualizar a cor" };
  }

  revalidatePath(`/dashboard/${params.storeId}/colors`);

  return { success: "Cor atualizada!" };
};
