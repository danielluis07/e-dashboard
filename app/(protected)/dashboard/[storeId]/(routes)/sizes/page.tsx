import { format } from "date-fns";

import { db } from "@/lib/db";
import ptBR from "date-fns/locale/pt-BR";
import { SizesColumnProps } from "./_components/sizes-columns";
import { SizesClient } from "./_components/sizes-client";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const groupedSizes = await db.size.groupBy({
    by: ["name", "value"],
    _sum: {
      quantity: true,
    },
  });

  const formattedSizes: SizesColumnProps[] = groupedSizes.map((item) => ({
    sum: item._sum.quantity,
    name: item.name,
    value: item.value,
  }));

  return (
    <div className="h-full xl:overflow-auto p-3 pt-16 xl:pt-0">
      <SizesClient data={formattedSizes} />
    </div>
  );
};

export default SizesPage;
