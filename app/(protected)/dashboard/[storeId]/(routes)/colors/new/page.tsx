import { FormWrapper } from "@/components/creation-form";
import { CreateColorForm } from "../_components/create-color-form";

const NewColorPage = () => {
  return (
    <div className="h-full mt-14 xl:mt-0 xl:flex items-center justify-center">
      <FormWrapper>
        <CreateColorForm />
      </FormWrapper>
    </div>
  );
};

export default NewColorPage;
