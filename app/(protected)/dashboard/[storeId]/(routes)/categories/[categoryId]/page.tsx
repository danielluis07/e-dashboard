import { db } from "@/lib/db";
import { EditCategoryForm } from "./_components/edit-category-form";
import { FormWrapper } from "@/components/creation-form";

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const [category, billboards] = await Promise.all([
    db.category.findUnique({
      where: {
        id: params.categoryId,
      },
    }),
    db.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    }),
  ]);

  return (
    <div className="flex mt-20 items-center justify-center">
      <FormWrapper>
        <EditCategoryForm billboards={billboards} initialData={category} />
      </FormWrapper>
    </div>
  );
};

export default CategoryPage;
