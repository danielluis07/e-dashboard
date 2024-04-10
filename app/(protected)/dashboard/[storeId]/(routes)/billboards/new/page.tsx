import { FormWrapper } from "@/components/creation-form";
import { CreateBillboardForm } from "../_components/create-billboard-form";

const NewBillboardPage = () => {
  return (
    <div className="h-full xl:flex items-center justify-center mt-14 xl:mt-0">
      <FormWrapper>
        <CreateBillboardForm />
      </FormWrapper>
    </div>
  );
};

export default NewBillboardPage;
