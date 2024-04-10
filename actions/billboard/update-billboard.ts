"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CreateBillboardSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const updateBillboard = async (
  values: z.infer<typeof CreateBillboardSchema>,
  params: {
    storeId: string;
    billboardId: string;
  }
) => {
  const myUser = await useCurrentUser();

  const myUserId = myUser?.id;

  if (!myUserId) {
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

    await db.billboard.update({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
        description,
      },
    });
  } catch (error) {
    return { error: "Erro ao atualizar o banner" };
  }

  revalidatePath(`/dashboard/${params.storeId}/billboards`);

  return { success: "Banner atualizado!" };
};
