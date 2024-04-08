"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CreateStoreSchema } from "@/schemas";

export const createStore = async (
  values: z.infer<typeof CreateStoreSchema>
) => {
  const validatedFields = CreateStoreSchema.safeParse(values);

  const myUser = await useCurrentUser();

  if (!myUser) {
    return { error: "Sem usuário!" };
  }

  if (!validatedFields.success) {
    return { error: "Algo deu errado!" };
  }

  const { name } = validatedFields.data;

  const myUserId = myUser?.id as string;

  try {
    const createdStore = await db.store.create({
      data: {
        name,
        myUserId,
      },
    });

    return { storeId: createdStore.id };
  } catch (error) {
    return { error: "Erro ao criar a loja" };
  }
};
