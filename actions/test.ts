"use server";

import { db } from "@/lib/db";

export const orderPaidTest = async () => {
  const orderId = "109df604-e964-4266-b9dc-51980111537a";

  try {
    const order = await db.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
      },
      include: {
        orderItems: {
          include: {
            product: true,
            size: true,
          },
        },
      },
    });

    if (!order) throw new Error("Order not found");

    // Update inventory for each order item
    for (const item of order.orderItems) {
      await db.size.update({
        where: { id: item.sizeId },
        data: { quantity: { decrement: 1 } },
      });

      // Update the ProductSize for specific product and size combination
      const productSize = await db.productSize.findUnique({
        where: {
          productId_sizeId: {
            productId: item.productId,
            sizeId: item.sizeId,
          },
        },
      });

      if (productSize && productSize.quantity > 0) {
        await db.productSize.update({
          where: {
            productId_sizeId: {
              productId: item.productId,
              sizeId: item.sizeId,
            },
          },
          data: {
            quantity: { decrement: 1 },
          },
        });
      }

      // Update product stock and sales count
      await db.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: 1 },
          salesCount: { increment: 1 },
        },
      });
    }
    console.log("deu boa");
  } catch (error: any) {
    console.error(`Failed to process order completion: ${error}`);
  }
};
