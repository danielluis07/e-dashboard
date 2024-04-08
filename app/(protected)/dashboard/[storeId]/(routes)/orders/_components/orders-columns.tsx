"use client";

import { ColumnDef } from "@tanstack/react-table";
import { OrdersCellAction } from "./orders-cell-action";

export type OrdersColumnsProps = {
  id: string;
  storeId: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrdersColumnsProps>[] = [
  {
    accessorKey: "user",
    header: "Usuário",
  },
  {
    accessorKey: "phone",
    header: "Telefone",
  },
  {
    accessorKey: "address",
    header: "Endereço",
  },
  {
    accessorKey: "totalPrice",
    header: "Preço Total",
  },
  {
    accessorKey: "isPaid",
    header: "Pago",
  },
  {
    id: "actions",
    cell: ({ row }) => <OrdersCellAction data={row.original} />,
  },
];
