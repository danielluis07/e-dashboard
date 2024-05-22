import { db } from "@/lib/db";
import { SizesColumnProps } from "./_components/sizes-columns";
import { SizesClient } from "./_components/sizes-client";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const groupedSizes = await db.size.groupBy({
    by: ["name", "value"],
    _sum: {
      quantity: true,
    },
    where: {
      storeId: params.storeId,
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
