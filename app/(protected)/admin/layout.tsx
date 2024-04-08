import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const myUser = await auth();

  const myUserId = myUser?.user.id;

  if (!myUserId) {
    redirect("/");
  }

  const store = await db.store.findFirst({
    where: {
      myUserId,
    },
  });

  if (store) {
    redirect(`/dashboard/${store.id}`);
  }

  return <>{children}</>;
};

export default AdminLayout;
