import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Notification } from "@/hooks/use-notifications";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature");

  let event: Stripe.Event;

  if (!signature) {
    return new NextResponse("Stripe signature missing in the headers", {
      status: 400,
    });
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Process the checkout session completion
    try {
      const order = await db.order.update({
        where: { id: session.metadata?.orderId },
        data: {
          status: "PAID",
          paidAt: new Date(),
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

      await pusherServer.trigger(order.storeId, "orders:confirmed", {
        id: Math.random().toString(),
        message: "Pagamento confirmado!",
        orderId: order.id,
        orderNumber: order.number,
        createdAt: new Date(),
        type: "order",
      } as Notification);
    } catch (error: any) {
      console.error(`Failed to process order completion: ${error}`);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
