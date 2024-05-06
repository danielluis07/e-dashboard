"use client";

import { ColumnDef } from "@tanstack/react-table";
import { OrdersCellAction } from "./orders-cell-action";
import { Checkbox } from "@/components/ui/checkbox";

export type OrdersColumnsProps = {
  id: string;
  storeId: string;
  phone: string | null;
  status: string;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrdersColumnsProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "orderNumber",
    header: "Número",
  },
  {
    accessorKey: "user",
    header: "Usuário",
  },
  {
    accessorKey: "totalPrice",
    header: "Preço Total",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => <OrdersCellAction data={row.original} />,
  },
];
