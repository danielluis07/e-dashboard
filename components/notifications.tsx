"use client";

import { useNotifications } from "@/hooks/use-notifications";
import { FaBell } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { IoIosClose } from "react-icons/io";
import { Menubar } from "./ui/menubar";
import {
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@radix-ui/react-menubar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const timeSince = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval + " ano" + (interval > 1 ? "s" : "");
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + (interval > 1 ? "meses" : "mês");
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + " dia" + (interval > 1 ? "s" : "");
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + " hora" + (interval > 1 ? "s" : "");
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + " minuto" + (interval > 1 ? "s" : "");
  }
  return seconds + " segundo" + (seconds > 1 ? "s" : "");
};

export const Notifications = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const notifications = useNotifications();
  const params = useParams<{ storeId: string }>();
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="relative group">
          <FaBell className="text-2xl text-fuchsia-500 group-hover:text-fuchsia-400 cursor-pointer" />
          <div
            className={cn(
              notifications.items.length < 1
                ? "hidden"
                : "absolute flex justify-center items-center top-0 right-0 text-[10px] rounded-full size-4 bg-red-500 group-hover:bg-red-400 text-milky"
            )}>
            {notifications.items.length}
          </div>
        </MenubarTrigger>
        <MenubarContent className="bg-milky rounded-sm h-56 w-[300px] overflow-auto shadow-md custom-scrollbar z-20">
          {notifications.items.length < 1 && (
            <div className="flex justify-center items-center h-full text-center font-bold text-gray-400 cursor-default">
              Nenhuma notificação
            </div>
          )}
          {notifications.items.map((item, index) => (
            <div key={index}>
              {item.type === "review" ? (
                <div
                  onClick={() =>
                    router.push(
                      `/dashboard/${params.storeId}/reviews/${item.reviewId}`
                    )
                  }
                  className="relative p-4 bg-slate-100 hover:bg-transparent cursor-pointer border">
                  <p>{item.message}</p>
                  <p className="text-xs text-gray-400">
                    há {timeSince(new Date(item.createdAt))}
                  </p>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      notifications.removeItem(item.id);
                    }}
                    className="absolute top-0 right-0 text-xl cursor-pointer">
                    <IoIosClose />
                  </div>
                </div>
              ) : item.type === "order" ? (
                <div
                  onClick={() =>
                    router.push(
                      `/dashboard/${params.storeId}/orders/${item.orderId}`
                    )
                  }
                  className="relative p-4 bg-slate-100 hover:bg-transparent cursor-pointer border">
                  <p>{item.message}</p>
                  <p className="text-sm text-gray-500 py-1">
                    Pedido nº: {item.orderNumber}
                  </p>
                  <p className="text-xs text-gray-400">
                    há {timeSince(new Date(item.createdAt))}
                  </p>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      notifications.removeItem(item.id);
                    }}
                    className="absolute top-0 right-0 text-xl cursor-pointer">
                    <IoIosClose />
                  </div>
                </div>
              ) : (
                item.type === "user" && (
                  <div
                    onClick={() =>
                      router.push(
                        `/dashboard/${params.storeId}/users/${item.userId}`
                      )
                    }
                    className="relative p-4 bg-slate-100 hover:bg-transparent cursor-pointer border">
                    <p>{item.message}</p>
                    <p className="text-xs text-gray-400">
                      há {timeSince(new Date(item.createdAt))}
                    </p>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        notifications.removeItem(item.id);
                      }}
                      className="absolute top-0 right-0 text-xl cursor-pointer">
                      <IoIosClose />
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
