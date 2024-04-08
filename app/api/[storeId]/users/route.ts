/* import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const URL = "https://api.clerk.com/v1/users";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const res = await fetch(URL, {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY_FRONTEND}`,
      },
    });

    const data = await res.json();
    const arr = [];

    for (const user of data) {
      const myUser = await db.user.upsert({
        where: { id: user.id },
        update: {
          email: user.email_addresses
            .map((item: any) => item.email_address)
            .join(" "),
        },

        create: {
          id: user.id,
          email: user.email_addresses
            .map((item: any) => item.email_address)
            .join(" "),
          firstName: user.first_name,
          lastName: user.last_name,
          storeId: params.storeId,
        },
      });

      arr.push(myUser);
    }
    return NextResponse.json(arr);
  } catch (error) {
    console.log("[USERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
 */
