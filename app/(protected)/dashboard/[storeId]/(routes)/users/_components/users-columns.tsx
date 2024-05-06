"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UsersCellAction } from "./users-cell-action";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import placeholder from "@/public/placeholder-logo.jpg";

export type UsersColumnProps = {
  id: string | null;
  imageUrl: string | StaticImport;
  name: string | null;
  email: string | null;
  createdAt: string | null;
};

export const columns: ColumnDef<UsersColumnProps>[] = [
  {
    accessorKey: "imageUrl",
    header: "Imagem",
    cell: ({ row }) => (
      <div className="relative size-7 rounded-full overflow-hidden">
        <Image
          src={row.original.imageUrl ? row.original.imageUrl : placeholder}
          fill
          alt="usuário"
          className="object-cover"
          sizes="(max-width: 3840px) 28px"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
  },
  {
    id: "actions",
    cell: ({ row }) => <UsersCellAction data={row.original} />,
  },
];
