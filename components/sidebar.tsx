"use client";

import { useEffect, useState } from "react";
import { MainNav } from "@/app/(protected)/dashboard/_components/main-nav";
import { StoreSwitcher } from "@/app/(protected)/dashboard/_components/store-switcher";
import { UserButton } from "./auth/user-button";
import { Store } from "@prisma/client";
import { cn } from "@/lib/utils";
import { LuArrowLeftFromLine } from "react-icons/lu";
import { LuArrowRightFromLine } from "react-icons/lu";
import { pusherClient } from "@/lib/pusher";
import { useParams } from "next/navigation";
import { useNotifications } from "@/hooks/use-notifications";
import { Notification } from "@/hooks/use-notifications";
import { toast } from "sonner";
import { MdOutlineRateReview } from "react-icons/md";
import { Notifications } from "./notifications";

interface SideBarProps {
  name: string | null | undefined;
  imageUrl?: string | null | undefined;
  stores: Store[];
}

export const Sidebar = ({ name, stores, imageUrl }: SideBarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const params = useParams<{ storeId: string }>();
  const notifications = useNotifications();

  useEffect(() => {
    pusherClient.subscribe(params.storeId);

    const review = (data: Notification) => {
      notifications.addItem(data);
      toast.success(data.message, {
        icon: <MdOutlineRateReview className="text-sky-500" />,
      });
    };

    pusherClient.bind("reviews:new", review);

    return () => {
      pusherClient.unsubscribe(params.storeId);
      pusherClient.unbind("reviews:new");
    };
  }, [notifications]);

  return (
    <div
      className={cn(
        "md-max:hidden relative min-h-full bg-milky shadow-lg",
        isOpen ? "w-[90px]" : "w-72"
      )}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-[30px] top-2 text-xl hover:text-fuchsia-500 cursor-pointer">
        <LuArrowLeftFromLine className={cn(isOpen && "hidden")} />
        <div className={cn("w-min mx-auto", !isOpen && "hidden")}>
          <LuArrowRightFromLine />
        </div>
      </div>
      <div className="p-5 pt-10 flex flex-col h-full">
        <div
          className={cn(
            "flex mb-3",
            isOpen ? "flex-col" : "flex-row justify-between items-center"
          )}>
          <div className="flex items-center gap-x-2">
            <UserButton isOpen={isOpen} imageUrl={imageUrl} />
            <div className={cn(isOpen ? "hidden w-min" : "w-1/2")}>
              Bem vindo, {name?.split(" ")[0]}
            </div>
          </div>
          <div className="flex justify-center p-2 pt-3">
            <Notifications />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className={cn(isOpen && "mt-5")}>
            <StoreSwitcher items={stores} isOpen={isOpen} />
          </div>
        </div>
        <div className="mt-8 flex-grow">
          <MainNav isOpen={isOpen} />
        </div>
      </div>
    </div>
  );
};
