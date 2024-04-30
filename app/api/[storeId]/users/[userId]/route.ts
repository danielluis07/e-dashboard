import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    if (!params.userId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const user = await db.user.findUnique({
      where: {
        id: params.userId,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();

    const {
      username,
      imageUrl,
      imageName,
      userId,
      isTwoFactorEnabled,
      email,
      address1,
      address2,
      city,
      country,
      postalCode,
      state,
    } = body;

    if (!isTwoFactorEnabled) {
      return new NextResponse("No info about two factor authentication", {
        status: 400,
      });
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

    const user = await db.user.update({
      where: { id: userId },
      data: {
        username,
        imageUrl,
        imageName,
        email,
        isTwoFactorEnabled,
        address1,
        address2,
        city,
        country,
        postalCode,
        state,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();

    const { userId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const user = await db.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
