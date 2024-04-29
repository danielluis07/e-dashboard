"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, OrdersColumnsProps } from "./orders-columns";
import { OrdersDataTable } from "./orders-table";

interface OrdersClientProps {
  data: OrdersColumnsProps[];
}

export const OrderClient: React.FC<OrdersClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Pedidos (${data.length})`}
        description="Gerencie os pedidos de sua loja"
      />
      <Separator />
      <OrdersDataTable searchKey="orderNumber" columns={columns} data={data} />
    </>
  );
};
