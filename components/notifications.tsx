"use client";

import { FaBell } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { IoIosAlert, IoIosClose } from "react-icons/io";
import { Menubar } from "./ui/menubar";
import axios from "axios";
import {
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@radix-ui/react-menubar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { deleteNotification } from "@/actions/notifications/delete-notification";
import { toast } from "sonner";
import { Notification } from "@prisma/client";
import { Clock } from "./clock";

interface NotificationProps {
  notifications: Notification[];
  isLoading: boolean;
}

export const Notifications = ({
  notifications,
  isLoading,
}: NotificationProps) => {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [seen, setSeen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const prevLenghtRef = useRef(notifications.length);

  let notificationsIds: string[];

  useEffect(() => {
    if (notifications.length > prevLenghtRef.current) {
      setSeen(false);
    }
    prevLenghtRef.current = notifications.length;
  }, [notifications]);

  if (notifications) {
    notificationsIds = notifications.map((item) => item.id);
  }

  const deleteNotification = async (notificationId: string) => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/${params.storeId}/notifications/${notificationId}`
    );
  };

  const viewNotification = async (data: {
    viewed: boolean;
    notificationsIds: string[];
  }) => {
    await axios.put(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/${params.storeId}/notifications`,
      { viewed: data.viewed, notificationsIds: data.notificationsIds }
    );
  };

  const notificationDelete = useMutation({
    mutationFn: deleteNotification,
    onMutate: (id: string) => {
      setDeletingId(id);
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  const notificationViewed = useMutation({
    mutationFn: viewNotification,
    onMutate: () => {
      setSeen(true);
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  const onOpen = () => {
    notificationViewed.mutate({
      viewed: true,
      notificationsIds,
    });
  };

  const onDelete = (notificationId: string) => {
    notificationDelete.mutate(notificationId);
  };

  const notificationsCount = notifications.filter(
    (item) => item.viewed === false
  ).length;

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger
          onClick={() => {
            setSeen(true);
            if (notificationsCount > 0) {
              onOpen();
            }
          }}
          className="relative group">
          <FaBell className="text-2xl text-fuchsia-500 group-hover:text-fuchsia-400 cursor-pointer" />
          {isLoading ||
            (!seen && (
              <div
                className={cn(
                  notificationsCount < 1
                    ? "hidden"
                    : "absolute flex justify-center items-center top-0 right-0 text-[10px] rounded-full size-4 bg-red-500 group-hover:bg-red-400 text-milky"
                )}>
                {notificationsCount}
              </div>
            ))}
        </MenubarTrigger>
        <MenubarContent className="bg-milky rounded-sm h-56 w-[300px] overflow-auto shadow-md custom-scrollbar z-20">
          {notificationViewed.isPending ? (
            <div className="flex items-center justify-center h-full">
              <ClipLoader color="#d946ef" />
            </div>
          ) : (
            <>
              {!notifications ||
                (notifications?.length < 1 && (
                  <div className="flex justify-center items-center h-full text-center font-bold text-gray-400 cursor-default">
                    Nenhuma notificação
                  </div>
                ))}
            </>
          )}
          {notifications?.map((item, index) => (
            <div key={index}>
              {notificationDelete.isPending && deletingId === item.id ? (
                <div className="flex justify-center py-3">
                  <ClipLoader color="#d946ef" />
                </div>
              ) : (
                <div>
                  {item.type === "NEW_REVIEW" ? (
                    <div
                      onClick={() =>
                        router.push(
                          `/dashboard/${params.storeId}/reviews/${item.reviewId}`
                        )
                      }
                      className="relative p-4 bg-slate-100 hover:bg-transparent cursor-pointer border">
                      <p>{item.message}</p>
                      <p className="text-xs text-gray-400">
                        há {<Clock date={new Date(item.createdAt)} />}
                      </p>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="absolute top-0 right-0 text-xl cursor-pointer">
                        <IoIosClose />
                      </div>
                    </div>
                  ) : item.type === "NEW_ORDER" ? (
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
                        há {<Clock date={new Date(item.createdAt)} />}
                      </p>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="absolute top-0 right-0 text-xl cursor-pointer">
                        <IoIosClose />
                      </div>
                    </div>
                  ) : item.type === "NEW_USER" ? (
                    <div
                      onClick={() =>
                        router.push(
                          `/dashboard/${params.storeId}/users/${item.userId}`
                        )
                      }
                      className="relative p-4 bg-slate-100 hover:bg-transparent cursor-pointer border">
                      <p>{item.message}</p>
                      <p className="text-xs text-gray-400">
                        há {<Clock date={new Date(item.createdAt)} />}
                      </p>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="absolute top-0 right-0 text-xl cursor-pointer">
                        <IoIosClose />
                      </div>
                    </div>
                  ) : (
                    item.type === "ORDER_PURCHASED" && (
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
                          há {<Clock date={new Date(item.createdAt)} />}
                        </p>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id);
                          }}
                          className="absolute top-0 right-0 text-xl cursor-pointer">
                          <IoIosClose />
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
