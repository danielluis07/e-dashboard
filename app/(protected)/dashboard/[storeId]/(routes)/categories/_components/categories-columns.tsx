"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CategoriesCellAction } from "./categories-cell-action";

export type CategoriesColumnsProps = {
  id: string;
  name: string;
  billboardLabel?: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoriesColumnsProps>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  /*   {
    accessorKey: "billboard",
    header: "Banner",
    cell: ({ row }) => row.original.billboardLabel,
  }, */
  {
    accessorKey: "createdAt",
    header: "Data",
  },
  {
    id: "actions",
    cell: ({ row }) => <CategoriesCellAction data={row.original} />,
  },
];
