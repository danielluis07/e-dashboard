"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ReviewSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const reply = async (
  values: z.infer<typeof ReviewSchema>,
  params: { storeId: string; reviewId: string }
) => {
  const myUser = await useCurrentUser();

  const userId = myUser?.id;

  if (!userId) {
    return {
      error: "Não autorizado!",
    };
  }

  const validatedFields = ReviewSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { reply } = validatedFields.data;

  if (!reply) {
    return { error: "É necessário inserir uma resposta" };
  }

  try {
    await db.review.update({
      where: {
        id: params.reviewId,
        storeId: params.storeId,
      },
      data: {
        hasReply: true,
        reply,
      },
    });
  } catch (error) {
    return { error: "Erro ao criar ao responder" };
  }

  revalidatePath(`/dashboard/${params.storeId}/reviews`);

  return { success: "Comentário/pergunta respondido(a)!" };
};
