import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SettingsForm } from "./_components/settings-form";
import { FormWrapper } from "@/components/creation-form";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const myUser = await auth();

  const myUserId = myUser?.user.id;

  if (!myUserId) {
    redirect("/login");
  }

  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
      myUserId,
    },
  });

  if (!store) {
    redirect("/");
  }

  const myUserInfo = await db.myUser.findUnique({
    where: {
      id: myUserId,
    },
  });

  if (!myUserInfo) {
    redirect("/");
  }

  const settingsData = {
    storeName: store.name as string | undefined,
    imageUrl: myUserInfo.image as string | undefined,
    isTwoFactorEnabled: myUserInfo.isTwoFactorEnabled as boolean | undefined,
    myUserName: myUserInfo.name as string | undefined,
    email: myUserInfo.email as string | undefined,
  };

  return (
    <div className="h-full xl:h-screen xl:overflow-auto p-3 pt-16 xl:pt-0">
      <FormWrapper>
        <SettingsForm initialData={settingsData} />
      </FormWrapper>
    </div>
  );
};

export default SettingsPage;
