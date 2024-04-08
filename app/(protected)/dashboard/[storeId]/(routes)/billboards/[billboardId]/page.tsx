import { db } from "@/lib/db";
import { EditBillboardForm } from "./_components/edit-billboard-form";
import { FormWrapper } from "@/components/creation-form";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const billboard = await db.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });
  return (
    <div className="h-full xl:flex items-center justify-center">
      <FormWrapper>
        <EditBillboardForm initialData={billboard} />
      </FormWrapper>
    </div>
  );
};

export default BillboardPage;
