"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CategorySchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const createCategory = async (
  values: z.infer<typeof CategorySchema>,
  params: { storeId: string }
) => {
  const myUser = await useCurrentUser();

  const userId = myUser?.id;

  if (!userId) {
    return {
      error: "Não autorizado!",
    };
  }

  const validatedFields = CategorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { name, billboardId, imageUrl } = validatedFields.data;

  let billboard = !billboardId ? null : billboardId;

  if (!name) {
    return { error: "É necessário informar um nome" };
  }

  const categories = await db.category.findMany({
    where: {
      name,
    },
  });

  if (categories.length > 0) {
    return { error: "Já existe uma catgoria com esse nome!" };
  }

  try {
    await db.category.create({
      data: {
        name,
        billboardId: billboard,
        imageUrl,
        storeId: params.storeId,
      },
    });
  } catch (error) {
    return { error: "Erro ao criar a categoria" };
  }

  revalidatePath(`/dashboard/${params.storeId}/categories`);

  return { success: "Categoria criada!" };
};
