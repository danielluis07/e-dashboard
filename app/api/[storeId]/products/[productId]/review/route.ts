import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { storeId: string; productId: string };
  }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const reviews = await db.review.findMany({
      where: {
        storeId: params.storeId,
        productId: params.productId,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.log("[REVIEW_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
