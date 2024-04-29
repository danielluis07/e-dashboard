import { db } from "@/lib/db";
import { UserInfo } from "./_components/user-info";
import { FormWrapper } from "@/components/creation-form";

const UserPage = async ({ params }: { params: { userId: string } }) => {
  const user = await db.user.findUnique({
    where: {
      id: params.userId,
    },
    include: {
      orders: true,
      reviews: {
        include: {
          product: true,
        },
      },
    },
  });
  return (
    <div className="h-full xl:h-screen mt-14 xl:mt-0 xl:overflow-auto">
      <FormWrapper className="h-full">
        <UserInfo user={user} />
      </FormWrapper>
    </div>
  );
};

export default UserPage;
