import { db } from "@/lib/db";
import { OrderInfo } from "./_components/order-info";

const OrderPage = async ({
  params,
}: {
  params: { storeId: string; orderId: string };
}) => {
  const order = await db.order.findUnique({
    where: {
      id: params.orderId,
      storeId: params.storeId,
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

  return (
    <div className="h-full xl:h-screen mt-14 xl:mt-0 xl:overflow-auto">
      <OrderInfo initialData={order} />
    </div>
  );
};

export default OrderPage;
