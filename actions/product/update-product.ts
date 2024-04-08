"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ProductSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const updateProduct = async (
  values: z.infer<typeof ProductSchema>,
  params: {
    storeId: string;
    productId: string;
  }
) => {
  const myUser = await useCurrentUser();

  const userId = myUser?.id;

  if (!userId) {
    return {
      error: "Não autorizado!",
    };
  }

  const validatedFields = ProductSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const {
    name,
    description,
    price,
    priceInCents,
    categoryId,
    colorId,
    sizes,
    images,
    isFeatured,
    isArchived: isArchivedFromCheckbox,
    isNew,
  } = validatedFields.data;

  if (!name) {
    return { error: "É necessário informar um nome" };
  }

  if (!description) {
    return { error: "É necessário informar uma descrição" };
  }

  if (!images || !images.length) {
    return { error: "Imagens não encontradas" };
  }

  if (!price) {
    return { error: "É necessário informar uma descrição" };
  }

  if (!sizes || !sizes.length) {
    return { error: "É necessário informar os tamanhos" };
  }

  if (!categoryId) {
    return { error: "É necessário informar uma categoria" };
  }

  if (!colorId) {
    return { error: "É necessário informar uma cor" };
  }

  if (!params.storeId) {
    return { error: "Loja não encontrada" };
  }

  let totalQuantity = 0;
  sizes.forEach((size: any) => {
    totalQuantity += size.quantity;
  });

  const isArchived = totalQuantity <= 0 ? true : isArchivedFromCheckbox;

  try {
    await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        description,
        price: priceInCents,
        categoryId,
        colorId,
        sizes: {
          deleteMany: {},
        },
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
        isNew,
        stock: totalQuantity,
      },
      include: {
        sizes: true,
      },
    });

    await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        isArchived,
        stock: totalQuantity,
        sizes: {
          create: sizes.map(
            (size: { name: string; quantity: number; value: string }) => ({
              name: size.name,
              quantity: size.quantity,
              value: size.value,
              storeId: params.storeId,
            })
          ),
        },
      },
    });
  } catch (error) {
    return { error: "Erro ao atualizar o produto" };
  }

  revalidatePath(`/dashboard/${params.storeId}/products`);

  return { success: "Produto atualizado!" };
};
