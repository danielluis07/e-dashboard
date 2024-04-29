import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

interface ProductCheckoutInfo {
  productId: string;
  sizeId: string;
  sizeName: string;
  sizeValue: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  // Assuming the body now contains products with sizeIds
  const { products, userId } = await req.json();

  if (!userId) {
    return new NextResponse("UserId is required", { status: 400 });
  }

  if (!products || products.length === 0) {
    return new NextResponse("Product information is required", { status: 400 });
  }

  if (
    products.some(
      (product: ProductCheckoutInfo) => !product.productId || !product.sizeId
    )
  ) {
    return new NextResponse("Each product must have a productId and sizeId", {
      status: 400,
    });
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return new NextResponse("User not found", { status: 400 });
  }

  // Query for products based on provided IDs
  const productIds = products.map(
    (product: ProductCheckoutInfo) => product.productId
  );
  const productDetails = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  if (productDetails.length !== products.length) {
    return new NextResponse("One or more products not found in database", {
      status: 404,
    });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
    productDetails.map((product) => ({
      quantity: 1,
      price_data: {
        currency: "BRL",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price,
      },
    }));

  // Create the order with order items including product and size
  const order = await db.order.create({
    data: {
      storeId: params.storeId,
      userId: userId,
      orderItems: {
        create: products.map((product: ProductCheckoutInfo) => ({
          productId: product.productId,
          sizeId: product.sizeId, // Ensuring each order item has the correct size
        })),
      },
    },
    include: {
      orderItems: true,
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.NEXT_PUBLIC_API_URL}/cart/success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/cart/canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json({ url: session.url }, { headers: corsHeaders });
}
