"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { UsersColumnProps, columns } from "./users-columns";
import { UsersDataTable } from "./users-table";

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
      <UsersDataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
