"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CreateBillboardSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const createBillboard = async (
  values: z.infer<typeof CreateBillboardSchema>,
  params: { storeId: string }
) => {
  const myUser = await useCurrentUser();

  const userId = myUser?.id;

  if (!userId) {
    return {
      error: "Não autorizado!",
    };
  }

  const validatedFields = CreateBillboardSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { label, imageUrl, description } = validatedFields.data;

  if (!label) {
    return { error: "É necessário informar um título" };
  }

  if (!imageUrl) {
    return { error: "Imagem não informada" };
  }

  const billboard = await db.billboard.findMany({
    where: {
      label,
    },
  });

  if (billboard.length > 0) {
    return { error: "Já existe um banner com esse nome!" };
  }

  try {
    await db.billboard.create({
      data: {
        label,
        imageUrl,
        description,
        storeId: params.storeId,
      },
    });
  } catch (error) {
    return { error: "Erro ao criar o banner" };
  }

  revalidatePath(`/dashboard/${params.storeId}/billboards`);

  return { success: "Banner criado!" };
};
