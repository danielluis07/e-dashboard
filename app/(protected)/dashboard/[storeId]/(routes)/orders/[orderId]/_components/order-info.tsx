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
  status: "PAID" | "WAITING_FOR_PAYMENT" | "CANCELED" | undefined;
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
  const router = useRouter();
  const params = useParams<{ storeId: string; orderId: string }>();

  const handleClickProduct = (productId: string) => {
    router.push(`/dashboard/${params.storeId}/products/${productId}`);
  };

  const handleClickUser = (userId: string | undefined) => {
    router.push(`/dashboard/${params.storeId}/users/${userId}`);
  };

  const statusPagamento = (status: string | undefined) => {
    if (status === "PAID") {
      return "Pago";
    } else if (status === "WAITING_FOR_PAYMENT") {
      return "Aguardando Pagamento";
    } else {
      return "Cancelado";
    }
  };

  return (
    <div className="pt-5 space-y-4 h-full">
      <div>
        <p className="text-2xl font-bold">Pedido nº{order?.number}</p>
        <Card className="mt-4 p-2 space-y-5">
          <div
            className="min-w-10 max-w-36"
            onClick={() => handleClickUser(order?.userId)}>
            <p className="font-bold">
              Usuário:{" "}
              <span className="underline hover:no-underline cursor-pointer truncate">
                {order?.user.name}
              </span>
            </p>
          </div>
          <p>
            <span className="font-bold">Email: </span>
            {order?.user.email}
          </p>
          <p>
            <span className="font-bold">Status: </span>
            {statusPagamento(order?.status)}
          </p>
        </Card>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold">Produtos</div>
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
          {order?.orderItems.map((item, index) => (
            <Card key={index} className="p-2">
              <div
                className="text-lg font-bold underline hover:no-underline cursor-pointer min-w-10 max-w-36 truncate"
                onClick={() => handleClickProduct(item.productId)}>
                {item.product.name}
              </div>
              <div className="mt-3 space-y-3">
                <p>
                  <span className="font-bold">Tamanho: </span>
                  {item.size?.value}
                </p>
                <p>
                  <span className="font-bold">Preço: </span>
                  {convertCentsToReal(item.product.price)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
