"use server";

import { db } from "@/lib/db";

export const orderPaidTest = async () => {
  const orderId = "32c61c12-e70f-41f6-8f56-d8a8e5c2af6b";

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                sizes: true,
              },
            },
          },
        },
      },
    });

    if (!order) throw new Error("Order not found");

    console.log(order, "order");
    console.log(order.orderItems, "orderitems");

    // Loop through each order item
    for (const orderItem of order.orderItems) {
      const sizeId = orderItem.sizeIds; // Assuming sizeIds is an array of size IDs
      const productId = orderItem.productId;

      // Find the corresponding size
      const size = await db.size.findUnique({ where: { id: sizeId } });
      if (!size) throw new Error(`Size with ID ${sizeId} not found`);

      // Stock validation
      if (size.quantity < 1) {
        throw new Error(`Insufficient stock for size ID ${sizeId}`);
      }

      // Decrement the size stock
      const updatedSize = await db.size.update({
        where: { id: sizeId },
        data: { quantity: { decrement: 1 } },
      });

      if (updatedSize.quantity < 1) {
        await db.size.delete({
          where: { id: sizeId },
        });
      }

      // Find and update the corresponding ProductSize
      const productSize = await db.productSize.findUnique({
        where: {
          productId_sizeId: {
            productId,
            sizeId,
          },
        },
      });

      if (productSize && productSize.quantity > 0) {
        await db.productSize.update({
          where: {
            productId_sizeId: {
              productId,
              sizeId,
            },
          },
          data: {
            quantity: { decrement: 1 },
          },
        });
      }

      const sizes = await db.size.findMany({
        where: { productId },
      });

      const totalStock = sizes.reduce((sum, size) => sum + size.quantity, 0);
      const isArchived = totalStock <= 0;

      await db.product.update({
        where: {
          id: productId,
        },
        data: {
          stock: totalStock,
          isArchived,
        },
      });
    }
  } catch (error) {
    throw error;
  }
};
