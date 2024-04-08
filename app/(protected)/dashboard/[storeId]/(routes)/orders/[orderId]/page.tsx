import { db } from "@/lib/db";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import ptBR from "date-fns/locale/pt-BR";
import { OrderForm } from "./_components/order-form";

export type SingleOrderProps = {
  id: string | undefined;
  userId: string | undefined;
  userFirstName: string | undefined;
  userLastName: string | undefined;
  userEmail: string | undefined;
  shippingMethodId: string | null | undefined;
  productName: string | undefined;
  phone: string | undefined;
  address: string | undefined;
  totalPrice: string;
  sizeName: string | undefined;
  sizeValue: string | undefined;
  isPaid: boolean | undefined;
  createdAt: string;
};

const OrderPage = async ({ params }: { params: { orderId: string } }) => {
  const order = await db.order.findUnique({
    where: {
      id: params.orderId,
    },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
          size: true,
        },
      },
    },
  });

  const orderSize = order?.orderItems.map((item) => item.sizeIds).join();

  const size = await db.size.findFirst({
    where: {
      id: orderSize,
    },
  });

  const formattedOrder: SingleOrderProps = {
    id: order?.id,
    userId: order?.userId,
    userFirstName: order?.user.firstName,
    userLastName: order?.user.lastName,
    userEmail: order?.user.email,
    shippingMethodId: order?.shippingMethodId,
    phone: order?.phone,
    address: order?.address,
    productName: order?.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: formatter.format(
      order!.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    sizeName: size?.name,
    sizeValue: size?.value,
    isPaid: order?.isPaid,
    createdAt: format(order!.createdAt, "dd/MM/yyyy", { locale: ptBR }),
  };

  return (
    <div className="flex-col">
      <OrderForm order={formattedOrder} />
    </div>
  );
};

export default OrderPage;
