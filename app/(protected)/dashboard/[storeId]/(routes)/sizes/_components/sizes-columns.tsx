"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SizesCellAction } from "./sizes-cell-action";

export type SizesColumnProps = {
  sum: number | null;
  name: string;
  value: string;
};

export const columns: ColumnDef<SizesColumnProps>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "value",
    header: "Sigla",
  },
  {
    accessorKey: "sum",
    header: "Total",
  },
  {
    id: "actions",
    cell: ({ row }) => <SizesCellAction data={row.original} />,
  },
];
