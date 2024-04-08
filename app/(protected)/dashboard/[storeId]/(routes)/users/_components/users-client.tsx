"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { UsersColumnProps, columns } from "./users-columns";

interface UsersClientProps {
  data: UsersColumnProps[];
}

export const UsersClient = ({ data }: UsersClientProps) => {
  return (
    <>
      <Heading
        title={`Usuários (${data.length})`}
        description="Os usuários de sua loja"
      />
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
