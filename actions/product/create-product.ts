"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ProductSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const createProduct = async (
  values: z.infer<typeof ProductSchema>,
  params: { storeId: string }
) => {
  const myUser = await useCurrentUser();

  const myUserId = myUser?.id;

  if (!myUserId) {
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
    isArchived,
    isNew,
  } = validatedFields.data;

  if (!name) {
    return { error: "É necessário informar um nome" };
  }

  if (!priceInCents) {
    return { error: "É necessário informar um preço em centavos" };
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

  if (colorId === "") {
    return { error: "É necessário informar uma cor" };
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

  const existingProduct = await db.product.findMany({
    where: {
      name,
    },
  });

  if (existingProduct.length > 0) {
    return { error: "Já existe um produto com esse nome!" };
  }

  let arr = [];

  const totalQuantity: number = sizes.reduce(
    (sum, size) => sum + size.quantity,
    0
  );

  try {
    const product = await db.product.create({
      data: {
        name,
        description,
        price: priceInCents,
        isFeatured,
        isArchived,
        isNew,
        categoryId,
        colorId: colorId !== "none" ? colorId : null,
        storeId: params.storeId,
        stock: totalQuantity,
        sizes: {
          create: sizes.map(
            (size: { name: string; quantity: number; value: string }) => ({
              name: size.name.replace(/\s/g, ""),
              quantity: size.quantity,
              value: size.value.replace(/\s/g, ""),
              storeId: params.storeId,
            })
          ),
        },
        images: {
          createMany: {
            data: images.map((image: { url: string }) => image),
          },
        },
      },
      include: {
        sizes: true,
      },
    });

    const searchProducts = await db.product.findMany({
      where: {
        id: product.id,
      },
      include: {
        sizes: true,
      },
    });

    const productsWithSummedSizes = searchProducts.map((product) => {
      const totalQuantity = product.sizes.reduce(
        (sum, size) => sum + size.quantity,
        0
      );

      return totalQuantity;
    });

    arr.push(productsWithSummedSizes);
  } catch (error) {
    console.log(error);
    return { error: "Erro ao criar o produto" };
  }

  revalidatePath(`/dashboard/${params.storeId}/products`);

  return { success: "Produto criado!" };
};
