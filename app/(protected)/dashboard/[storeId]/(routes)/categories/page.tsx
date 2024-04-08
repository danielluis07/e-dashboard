import { db } from "@/lib/db";
import { CategoriesClient } from "./_components/categories-client";
import { CategoriesColumnsProps } from "./_components/categories-columns";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoriesColumnsProps[] = categories.map(
    (item) => ({
      id: item.id,
      name: item.name,
      /* billboardLabel: item.billboard?.label, */
      createdAt: format(item.createdAt, "dd/MM/yyyy", { locale: ptBR }),
    })
  );

  return (
    <div className="h-full md:h-screen md:overflow-auto p-3">
      <CategoriesClient data={formattedCategories} />
    </div>
  );
};

export default CategoriesPage;
