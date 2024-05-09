"use client";

import { cn } from "@/lib/utils";
import { StoreSwitcher } from "./store-switcher";
import { UserButton } from "@/components/auth/user-button";
import { MobileNavbar } from "./mobile-navbar";
import { Store } from "@prisma/client";
import { useEffect, useState } from "react";
import { Notification } from "@/hooks/use-notifications";
import { useNotifications } from "@/hooks/use-notifications";
import { useParams } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { toast } from "sonner";
import { MdOutlineRateReview } from "react-icons/md";
import { Notifications } from "@/components/notifications";
import { FiPackage } from "react-icons/fi";

interface NavbarBarProps {
  imageUrl?: string | null | undefined;
  stores: Store[];
}

export const Navbar = ({ imageUrl, stores }: NavbarBarProps) => {
  const [scrolledDown, setScrolledDown] = useState<boolean>(false);
  const params = useParams<{ storeId: string }>();
  const notifications = useNotifications();

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 0) {
      // You can adjust this value based on your preference
      setScrolledDown(true);
    } else {
      setScrolledDown(false);
    }
  };

  /* useEffect(() => {
    pusherClient.subscribe(params.storeId);

    const newReview = (data: Notification) => {
      notifications.addItem(data);
      toast.success(data.message, {
        icon: <MdOutlineRateReview className="text-sky-500" />,
      });
    };

    const newOrder = (data: Notification) => {
      notifications.addItem(data);
      toast.success(data.message, {
        icon: <FiPackage className="text-yellow-500" />,
      });
    };

    const confirmedOrder = (data: Notification) => {
      notifications.addItem(data);
      toast.success(data.message, {
        icon: <FiPackage className="text-green-500" />,
      });
    };

    pusherClient.bind("reviews:new", newReview);
    pusherClient.bind("orders:new", newOrder);
    pusherClient.bind("orders:confirmed", confirmedOrder);

    return () => {
      pusherClient.unsubscribe(params.storeId);
      pusherClient.unbind("reviews:new");
      pusherClient.unbind("orders:new");
      pusherClient.unbind("orders:confirmed");
    };
  }, [params.storeId, notifications]); */

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        scrolledDown && "bg-milky",
        "fixed top-0 left-0 right-0 z-20 flex items-center justify-between border-b px-1"
      )}>
      <div className="flex items-center gap-x-3">
        <UserButton imageUrl={imageUrl} />
        {/* <Notifications /> */}
        <StoreSwitcher items={stores} />
      </div>
      <MobileNavbar />
    </div>
  );
};
