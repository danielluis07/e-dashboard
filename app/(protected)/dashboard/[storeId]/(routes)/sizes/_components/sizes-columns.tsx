"use client";

import { ColumnDef } from "@tanstack/react-table";

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
];
