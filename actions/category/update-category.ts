"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CategorySchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const updateCategory = async (
  values: z.infer<typeof CategorySchema>,
  params: {
    storeId: string;
    categoryId: string;
  }
) => {
  const myUser = await useCurrentUser();

  const myUserId = myUser?.id;

  if (!myUserId) {
    return {
      error: "Não autorizado!",
    };
  }

  const validatedFields = CategorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { name, billboardId, imageUrl, value } = validatedFields.data;

  if (!name) {
    return { error: "É necessário informar um nome" };
  }

  if (!billboardId) {
    return { error: "É necessário informar o Id do banner" };
  }

  if (!value) {
    return { error: "É necessário informar um valor" };
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

    await db.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        imageUrl,
        value,
        billboardId,
      },
    });
  } catch (error) {
    return { error: "Erro ao atualizar a categoria" };
  }

  revalidatePath(`/dashboard/${params.storeId}/categories`);

  return { success: "Categoria atualizada!" };
};
