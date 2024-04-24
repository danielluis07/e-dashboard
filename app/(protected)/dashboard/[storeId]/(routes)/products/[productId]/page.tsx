import { db } from "@/lib/db";
import { EditProductForm } from "./_components/edit-product-form";
import { FormWrapper } from "@/components/creation-form";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await db.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
      sizes: true,
    },
  });

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
    <div className="h-full xl:h-screen mt-14 xl:mt-0 xl:overflow-auto">
      <FormWrapper>
        <EditProductForm
          categories={categories}
          colors={colors}
          initialData={product}
        />
      </FormWrapper>
    </div>
  );
};

export default ProductPage;
