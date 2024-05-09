import { db } from "@/lib/db";
import { FormWrapper } from "@/components/creation-form";
import { CreateProductForm } from "../_components/create-product-form";

const NewProductPage = async ({ params }: { params: { storeId: string } }) => {
  const [categories, colors] = await Promise.all([
    db.category.findMany({
      where: {
        storeId: params.storeId,
      },
    }),
    db.color.findMany({
      where: {
        storeId: params.storeId,
      },
    }),
  ]);

  return (
    <div className="h-full xl:h-screen mt-14 xl:mt-0 xl:overflow-auto">
      <FormWrapper>
        <CreateProductForm categories={categories} colors={colors} />
      </FormWrapper>
    </div>
  );
};

export default NewProductPage;
