import { db } from "@/lib/db";
import { BillboardClient } from "./_components/client";
import { BillboardColumn } from "./_components/billboard-columns";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "dd/MM/yyyy", { locale: ptBR }),
  }));

  return (
    <div className="h-full md:h-screen md:overflow-auto p-3">
      <BillboardClient data={formattedBillboards} />
    </div>
  );
};

export default BillboardsPage;
