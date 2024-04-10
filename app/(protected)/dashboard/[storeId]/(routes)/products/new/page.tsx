import { db } from "@/lib/db";
import { FormWrapper } from "@/components/creation-form";
import { CreateProductForm } from "../_components/create-product-form";

const NewProductPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const colors = await db.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  return (
    <div className="h-full xl:flex items-center justify-center mt-14 xl:mt-0">
      <FormWrapper>
        <CreateProductForm categories={categories} colors={colors} />
      </FormWrapper>
    </div>
  );
};

export default NewProductPage;
