import { db } from "@/lib/db";

import { EditColorForm } from "./_components/edit-color-form";
import { FormWrapper } from "@/components/creation-form";

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  const color = await db.color.findUnique({
    where: {
      id: params.colorId,
    },
  });

  return (
    <div className="flex mt-20 items-center justify-center">
      <FormWrapper>
        <EditColorForm initialData={color} />
      </FormWrapper>
    </div>
  );
};

export default ColorPage;
