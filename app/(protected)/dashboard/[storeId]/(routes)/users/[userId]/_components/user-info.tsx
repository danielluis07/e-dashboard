"use client";

import { Order, Product } from "@prisma/client";
import Image from "next/image";
import placeholder from "@/public/placeholder-logo.jpg";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { cn } from "@/lib/utils";
import { FaAngleDown } from "react-icons/fa";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface UserProps {
  id: string;
  username: string | null;
  email: string | null;
  name: string | null;
  password: string | null;
  imageUrl: string | null;
  imageName: string | null;
  orders: Order[];
  reviews: Array<{
    id: string;
    storeId: string;
    text: string;
    rating: number;
    hasReply: boolean;
    product: Product;
    reply: string | null;
    replyAt: Date | null;
    userId: string;
    isArchived: boolean;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  isTwoFactorEnabled: boolean;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserInfoProps {
  user: UserProps | null;
}

export const UserInfo = ({ user }: UserInfoProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  const handleOrderClick = (orderId: string) => {
    router.push(`/dashboard/${params.storeId}/orders/${orderId}`);
  };

  const handleReviewClick = (reviewId: string) => {
    router.push(`/dashboard/${params.storeId}/reviews/${reviewId}`);
  };

  const createdAt = user?.createdAt as number | Date;
  return (
    <div className="pt-8">
      <div className="flex items-center gap-x-5">
        <div className="relative size-28 rounded-full overflow-hidden">
          <Image src={user?.imageUrl ?? placeholder} fill alt="usuario" />
        </div>
        <div className="space-y-4">
          <p>
            <span className="font-bold">Nome: </span>
            {user?.name}
          </p>
          <p>
            <span className="font-bold">Email: </span>
            {user?.email}
          </p>
        </div>
      </div>
      <div className="mt-5">
        <p>
          <span className="font-bold">Cadastro em: </span>
          {format(createdAt, "dd/MM/yyyy", { locale: ptBR })}
        </p>
      </div>
      <div className="relative w-full">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center p-3 mt-10 shadow-md h-14 rounded-md text-xl font-bold bg-slate-50/70 hover:bg-fuchsia-200 cursor-pointer">
          Pedidos
        </div>
        <FaAngleDown
          className={cn(
            isOpen ? "-rotate-180" : "rotate-0",
            "absolute right-1 top-1/2 transform -translate-y-1/2 size-8 cursor-pointer xl:group-hover:-rotate-180 transition-all duration-300"
          )}
        />
        <div
          className={cn(
            isOpen ? "h-72" : "h-0",
            "absolute w-full top-14 z-10 overflow-auto bg-white shadow-md transition-all"
          )}>
          <div className="space-y-2">
            {user?.orders.map((item, index) => (
              <div
                key={index}
                onClick={() => handleOrderClick(item.id)}
                className="p-3 hover:bg-fuchsia-50 cursor-pointer">
                Pedido nº: {item.number}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative w-full">
        <div
          onClick={() => setIsClicked(!isClicked)}
          className="flex items-center p-3 mt-10 shadow-md h-14 rounded-md text-xl font-bold bg-slate-50/70 hover:bg-fuchsia-200 cursor-pointer">
          Avaliações
        </div>
        <FaAngleDown
          className={cn(
            isClicked ? "-rotate-180" : "rotate-0",
            "absolute right-1 top-1/2 transform -translate-y-1/2 size-8 cursor-pointer xl:group-hover:-rotate-180 transition-all duration-300"
          )}
        />
        <div
          className={cn(
            isClicked ? "h-72" : "h-0",
            "absolute w-full top-14 overflow-auto bg-white shadow-md transition-all"
          )}>
          <div className="space-y-2">
            {user?.reviews.map((item, index) => (
              <div
                key={index}
                onClick={() => handleReviewClick(item.id)}
                className="p-3 hover:bg-fuchsia-50 cursor-pointer">
                Produto: {item.product.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
