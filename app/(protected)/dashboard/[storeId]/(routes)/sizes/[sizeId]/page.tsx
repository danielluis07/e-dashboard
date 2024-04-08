import { db } from "@/lib/db";
import { SizeForm } from "./_components/size-form";

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  const size = await db.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });

  return (
    <div className="flex-col">
      <SizeForm initialData={size} />
    </div>
  );
};

export default SizePage;
