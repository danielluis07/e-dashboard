import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();

    const { text, rating, productId, userId } = body;

    if (!text) {
      return new NextResponse("Text is required", { status: 400 });
    }

    if (rating == null) {
      return new NextResponse("Rating is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NextResponse("Product not found");
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NextResponse("User not found");
    }

    const review = await db.review.create({
      data: {
        text,
        rating,
        storeId: params.storeId,
        user: { connect: { id: userId } },
        product: { connect: { id: productId } },
      },
    });

    const reviews = await db.review.findMany({
      where: { productId },
    });

    const averageRating =
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        averageRating,
        totalReviews: reviews.length,
      },
    });

    await pusherServer.trigger(params.storeId, "reviews:new", {
      id: Math.random().toString(),
      message: "Você recebeu uma nova avaliação!",
      reviewId: review.id,
    });

    return NextResponse.json(review, { headers: corsHeaders });
  } catch (error) {
    console.log("[REVIEWS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId") || undefined;
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const reviews = await db.review.findMany({
      where: {
        storeId: params.storeId,
        productId,
      },
      include: {
        user: true,
        product: true,
      },
    });

    return NextResponse.json(reviews, { headers: corsHeaders });
  } catch (error) {
    console.log("[REVIEWS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
