"use client";

import { Card } from "@/components/ui/card";
import { Order, Product, Size } from "@prisma/client";
import { User } from "@prisma/client";
import { convertCentsToReal } from "@/lib/utils";
import { OrderItem } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface OrderItemProps {
  id: string;
  orderId: string;
  product: Product;
  productId: string;
  size?: {
    id: string;
    name: string;
    productId: string;
    quantity: number;
    storeId: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;
  };
  sizeId: string;
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
  const router = useRouter();
  const params = useParams<{ storeId: string; orderId: string }>();

  const handleClick = (productId: string) => {
    router.push(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${params.storeId}/products/${productId}`
    );
  };

  return (
    <div className="pt-5 space-y-4">
      <div>
        <p className="text-2xl font-bold">Pedido nº{order?.number}</p>
        <Card className="mt-4 p-2">
          <p>Usuário: {order?.user.name}</p>
          <p>Email: {order?.user.email}</p>
          <p>Pago: {order?.isPaid ? "Sim" : "Não"}</p>
        </Card>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold">Produtos</div>
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
          {order?.orderItems.map((item, index) => (
            <Card key={index} className="p-2">
              <div
                className="text-lg font-bold underline hover:no-underline cursor-pointer truncate"
                onClick={() => handleClick(item.productId)}>
                {item.product.name}
              </div>
              <p>Tamanho: {item.size?.value}</p>
              <p>Preço: {convertCentsToReal(item.product.price)}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
