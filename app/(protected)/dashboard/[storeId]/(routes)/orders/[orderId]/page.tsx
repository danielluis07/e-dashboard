import { FormWrapper } from "@/components/creation-form";
import { db } from "@/lib/db";
import { OrderInfo } from "./_components/order-info";

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

  return (
    <div className="flex items-center justify-center h-full">
      <FormWrapper>
        <OrderInfo order={order} />
      </FormWrapper>
    </div>
  );
};

export default OrderPage;
