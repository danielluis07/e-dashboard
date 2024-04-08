import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    const isNew = searchParams.get("isNew");

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isNew: isNew ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        reviews: true,
        category: true,
        color: true,
        sizes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    for (const product of products) {
      const sumOfQuantities = product.sizes.reduce(
        (sum, size) => sum + size.quantity,
        0
      );
      await db.product.update({
        where: { id: product.id },
        data: { stock: sumOfQuantities },
      });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
