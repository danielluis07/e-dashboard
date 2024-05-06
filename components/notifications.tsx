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

export const Notifications = () => {
  const notifications = useNotifications();
  const params = useParams<{ storeId: string }>();
  const router = useRouter();

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
            <div
              key={index}
              onClick={() =>
                router.push(
                  `/dashboard/${params.storeId}/reviews/${item.reviewId}`
                )
              }
              className="relative p-4 bg-slate-100 hover:bg-transparent text-center cursor-pointer">
              {item.message}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  notifications.removeItem(item.id);
                }}
                className="absolute top-0 right-0 text-xl cursor-pointer">
                <IoIosClose />
              </div>
            </div>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
