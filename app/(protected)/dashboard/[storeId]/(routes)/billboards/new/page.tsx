import { FormWrapper } from "@/components/creation-form";
import { CreateBillboardForm } from "../_components/create-billboard-form";

const NewBillboardPage = () => {
  return (
    <div className="h-full xl:flex items-center justify-center">
      <FormWrapper>
        <CreateBillboardForm />
      </FormWrapper>
    </div>
  );
};

export default NewBillboardPage;
