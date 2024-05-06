"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CategoriesCellAction } from "./categories-cell-action";
import { Checkbox } from "@/components/ui/checkbox";

export type CategoriesColumnsProps = {
  id: string;
  name: string;
  billboardLabel?: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoriesColumnsProps>[] = [
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
    accessorKey: "name",
    header: "Nome",
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
