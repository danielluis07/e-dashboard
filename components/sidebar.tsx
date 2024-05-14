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
import { Notification } from "@/types";
import { toast } from "sonner";
import { MdOutlineRateReview } from "react-icons/md";
import { Notifications } from "./notifications";
import { FiPackage } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

interface SideBarProps {
  name: string | null | undefined;
  imageUrl?: string | null | undefined;
  stores: Store[];
}

export const Sidebar = ({ name, stores, imageUrl }: SideBarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const params = useParams<{ storeId: string }>();
  const URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/${params.storeId}/notifications`;
  const {
    data: notifications = [],
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["notifications", params.storeId],
    queryFn: async () => {
      const res = await fetch(URL, { cache: "no-cache" });
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    pusherClient.subscribe(params.storeId);

    const newUser = (data: Notification) => {
      toast.success(data.message, {
        icon: <FaUser className="text-sky-500" />,
      });
      refetch();
    };

    const newReview = (data: Notification) => {
      toast.success(data.message, {
        icon: <MdOutlineRateReview className="text-slate-500" />,
      });
      refetch();
    };

    const newOrder = (data: Notification) => {
      toast.success(data.message, {
        icon: <FiPackage className="text-yellow-500" />,
      });
      refetch();
    };

    const confirmedOrder = (data: Notification) => {
      toast.success(data.message, {
        icon: <FiPackage className="text-green-500" />,
      });
      refetch();
    };

    pusherClient.bind("users:new", newUser);
    pusherClient.bind("reviews:new", newReview);
    pusherClient.bind("orders:new", newOrder);
    pusherClient.bind("orders:confirmed", confirmedOrder);

    return () => {
      pusherClient.unsubscribe(params.storeId);
      pusherClient.unbind("users:new");
      pusherClient.unbind("reviews:new");
      pusherClient.unbind("orders:new");
      pusherClient.unbind("orders:confirmed");
    };
  }, [params.storeId]);

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
            <Notifications
              notifications={notifications}
              isLoading={isLoading}
            />
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
