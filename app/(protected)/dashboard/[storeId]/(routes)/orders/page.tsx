import { format } from "date-fns";
import { db } from "@/lib/db";
import { formatter } from "@/lib/utils";
import { convertCentsToReal } from "@/lib/utils";
import ptBR from "date-fns/locale/pt-BR";
import { OrdersColumnsProps } from "./_components/orders-columns";
import { OrderClient } from "./_components/orders-client";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await db.order.findMany({
    where: {
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
    orderBy: {
      createdAt: "desc",
    },
  });

  const statusPagamento = (status: string | undefined) => {
    if (status === "PAID") {
      return "Pago";
    } else if (status === "WAITING_FOR_PAYMENT") {
      return "Aguardando Pagamento";
    } else {
      return "Cancelado";
    }
  };

  const formattedOrder: OrdersColumnsProps[] = orders.map((item) => ({
    id: item.id,
    storeId: item.storeId,
    orderNumber: item.number,
    user: item.user.name,
    userEmail: item.user.email,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: convertCentsToReal(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    status: statusPagamento(item.status),
    createdAt: format(item.createdAt, "dd/MM/yyyy", { locale: ptBR }),
  }));

  return (
    <div className="h-full xl:overflow-auto p-3 pt-16 xl:pt-0">
      <OrderClient data={formattedOrder} />
    </div>
  );
};

export default OrdersPage;
