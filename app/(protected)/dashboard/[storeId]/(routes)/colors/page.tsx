import { format } from "date-fns";
import { db } from "@/lib/db";
import ptBR from "date-fns/locale/pt-BR";
import { ColorColumnProps } from "./_components/colors-columns";
import { ColorsClient } from "./_components/colors-client";

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const colors = await db.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorColumnProps[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "dd/MM/yyyy", { locale: ptBR }),
  }));

  return (
    <div className="h-full xl:overflow-auto p-3 pt-16 xl:pt-0">
      <ColorsClient data={formattedColors} />
    </div>
  );
};

export default ColorsPage;
