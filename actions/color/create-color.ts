"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ColorSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const createColor = async (
  values: z.infer<typeof ColorSchema>,
  params: { storeId: string }
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

  const storeByUserId = await db.store.findFirst({
    where: {
      id: params.storeId,
      myUserId,
    },
  });

  if (!storeByUserId) {
    return { error: "Não autorizado" };
  }

  const existingColorName = await db.color.findMany({
    where: {
      name,
    },
  });

  const existingColorHex = await db.color.findMany({
    where: {
      value,
    },
  });

  if (existingColorName.length > 0 && existingColorHex.length > 0) {
    return { error: "Essa cor já foi criada!" };
  }

  if (existingColorName.length > 0) {
    return { error: "Já existe uma cor com esse nome!" };
  }

  if (existingColorHex.length > 0) {
    return { error: "Já existe uma cor com esse valor!" };
  }

  try {
    await db.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });
  } catch (error) {
    return { error: "Erro ao criar a cor" };
  }

  revalidatePath(`/dashboard/${params.storeId}/color`);

  return { success: "Cor criada!" };
};
