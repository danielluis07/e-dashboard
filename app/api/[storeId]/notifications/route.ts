import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const notifications = await db.notification.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(notifications, { headers: corsHeaders });
  } catch (error) {
    console.log("[NOTIFICATIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();

    const { viewed, notificationsIds } = body;

    if (!viewed) {
      return new NextResponse("No viewed value found", { status: 400 });
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

    const notifications = await db.notification.updateMany({
      where: {
        id: {
          in: notificationsIds,
        },
      },
      data: {
        viewed: viewed,
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.log("[NOTIFICATIONS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
