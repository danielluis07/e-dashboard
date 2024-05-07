import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || undefined;

  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const orders = await db.order.findMany({
      where: {
        storeId: params.storeId,
        userId,
      },
      include: {
        user: true,
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

    return NextResponse.json(orders);
  } catch (error) {
    console.log("[ORDERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
