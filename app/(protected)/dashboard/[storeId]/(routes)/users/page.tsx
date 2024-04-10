import { format } from "date-fns";

import { db } from "@/lib/db";
import { formatter } from "@/lib/utils";
import ptBR from "date-fns/locale/pt-BR";
import { UsersColumnProps } from "./_components/users-columns";
import { UsersClient } from "./_components/users-client";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

const UsersPage = async ({ params }: { params: { storeId: string } }) => {
  const users = await db.storeUser.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedUsers: UsersColumnProps[] = users.map((item) => ({
    id: item.user.id,
    imageUrl: item.user.imageUrl as string | StaticImport,
    name: item.user.name,
    email: item.user.email,
    createdAt: format(item.createdAt, "dd/MM/yyyy", { locale: ptBR }),
  }));

  return (
    <div className="h-full xl:overflow-auto p-3 pt-16 xl:pt-0">
      <div className="mt-8">
        <UsersClient data={formattedUsers} />
      </div>
    </div>
  );
};

export default UsersPage;
