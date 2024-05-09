import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { useCurrentUser } from "@/hooks/use-current-user";
import { pusherServer } from "@/lib/pusher";
import { Notification } from "@/hooks/use-notifications";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const myUser = await useCurrentUser();
    const myUserId = myUser?.id as string;

    const body = await req.json();

    const { id, name, storeId, email, password } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("This store id is required", { status: 400 });
    }

    const storeByMyUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        myUserId,
      },
    });

    if (!storeByMyUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const user = await db.user.create({
      data: {
        id,
        name,
        email,
        password,
      },
    });

    const storeUser = await db.storeUser.create({
      data: {
        userId: user.id,
        storeId,
      },
    });

    await pusherServer.trigger(params.storeId, "users:new", {
      id: Math.random().toString(),
      message: "Um novo usuário se cadastrou!",
      userId: user.id,
      userName: user.name,
      createdAt: new Date(),
      type: "user",
    } as Notification);

    return NextResponse.json(storeUser);
  } catch (error) {
    console.log("[REGISTER_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
