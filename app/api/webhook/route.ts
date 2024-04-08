import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");

  if (event.type === "checkout.session.completed") {
    const order = await db.order.findUnique({
      where: { id: session?.metadata?.orderId },
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

    if (!order) {
      throw new Error(
        `Could not find order with id:${session?.metadata?.orderId} `
      );
    }

    try {
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
            salesCount: { increment: 1 },
            isArchived,
          },
        });
      }

      await db.order.update({
        where: {
          id: order?.id,
        },
        data: {
          isPaid: true,
          address: addressString,
          phone: session?.customer_details?.phone || "",
        },
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
    } catch (error) {
      throw new Error(`Failed to update product and order: ${error}`);
    }
  }

  return new NextResponse(null, { status: 200 });
}
