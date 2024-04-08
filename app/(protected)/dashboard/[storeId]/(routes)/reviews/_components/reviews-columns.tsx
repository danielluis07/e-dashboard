import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ReviewsCellAction } from "./reviews-cell-action";

export type ReviewColumnProps = {
  id: string;
  rating: number;
  hasReply: string;
  user: string | null;
  product: string;
  isArchived: string;
  createdAt: string;
};

export const columns: ColumnDef<ReviewColumnProps>[] = [
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
    accessorKey: "createdAt",
    header: "Data",
  },
  {
    accessorKey: "user",
    header: "Usuário",
  },
  {
    accessorKey: "rating",
    header: "Nota",
  },
  {
    accessorKey: "hasReply",
    header: "Respondido",
  },
  {
    accessorKey: "isArchived",
    header: "Arquivado",
  },
  {
    id: "actions",
    cell: ({ row }) => <ReviewsCellAction data={row.original} />,
  },
];
