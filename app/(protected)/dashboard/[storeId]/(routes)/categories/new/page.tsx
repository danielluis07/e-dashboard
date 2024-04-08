import { FormWrapper } from "@/components/creation-form";
import { CreateCategoryForm } from "../_components/create-category-form";
import { db } from "@/lib/db";

const NewCategoryPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  return (
    <div className="h-full mt-10 xl:mt-0 xl:flex items-center justify-center">
      <FormWrapper>
        <CreateCategoryForm billboards={billboards} />
      </FormWrapper>
    </div>
  );
};

export default NewCategoryPage;
