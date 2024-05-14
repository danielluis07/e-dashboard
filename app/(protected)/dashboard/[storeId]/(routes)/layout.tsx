import { db } from "@/lib/db";
import { Navbar } from "../../_components/navbar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { BackForward } from "../../_components/back-forward";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { storeId: string };
}): Promise<Metadata> {
  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return {
    title: `${store?.name} | Dashboard`,
  };
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const myUser = await useCurrentUser();

  const myUserId = myUser?.id;

  if (!myUserId) {
    redirect("/sign-in");
  }

  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
      myUserId,
    },
  });

  if (!store) {
    redirect("/");
  }

  const stores = await db.store.findMany({
    where: {
      myUserId,
    },
  });

  const user = await db.myUser.findUnique({
    where: {
      id: myUserId,
    },
  });

  if (!stores || !user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-full">
      <Sidebar name={myUser?.name} stores={stores} imageUrl={user.image} />
      <div className="flex-1 md:ml-3">
        <div className="xl:hidden">
          <Navbar stores={stores} imageUrl={user.image} />
        </div>
        {children}
      </div>
    </div>
  );
}
