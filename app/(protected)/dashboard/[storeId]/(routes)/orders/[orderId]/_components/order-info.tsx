"use client";

import { Card } from "@/components/ui/card";
import { Order, Product, Size } from "@prisma/client";
import { User } from "@prisma/client";
import { OrderItem } from "@prisma/client";
import Image from "next/image";

interface OrderItemProps {
  id: string;
  orderId: string;
  product: Product;
  productId: string;
  size?: Size[];
  sizeIds: string;
}

interface OrderProps {
  id: string;
  number: number;
  storeId: string;
  userId: string;
  isPaid: boolean;
  shippingMethodId: string | null;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  orderItems: OrderItemProps[];
}

interface OrderInfoProps {
  order: OrderProps | null;
}

export const OrderInfo = ({ order }: OrderInfoProps) => {
  console.log(order);
  return (
    <div>
      <div>
        <p className="text-2xl font-bold">Pedido nº{order?.number}</p>
        <p>Usuário: {order?.user.name}</p>
        <p>Pago: {order?.isPaid ? "Sim" : "Não"}</p>
      </div>
      <div>
        <div>Produtos</div>
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
          {order?.orderItems.map((item, index) => (
            <Card key={index}>
              <div className="text-lg font-bold underline truncate">
                {item.product.name}
              </div>
              <p>Tamanho: {}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
