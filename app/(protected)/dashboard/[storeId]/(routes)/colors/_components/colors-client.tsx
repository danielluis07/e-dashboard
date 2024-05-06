"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ApiList } from "@/components/ui/api-list";
import { Separator } from "@/components/ui/separator";
import { columns, ColorColumnProps } from "./colors-columns";
import { CiCirclePlus } from "react-icons/ci";
import { ColorsDataTable } from "./colors-table";

interface ColorsClientProps {
  data: ColorColumnProps[];
}

export const ColorsClient = ({ data }: ColorsClientProps) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Cores (${data.length})`}
          description="Defina as cores de sua loja"
        />
        <Button
          onClick={() =>
            router.push(`/dashboard/${params.storeId}/colors/new`)
          }>
          <CiCirclePlus className="mr-2 size-5" /> Adicionar
        </Button>
      </div>
      <Separator />
      <ColorsDataTable searchKey="name" columns={columns} data={data} />
      {/* <Heading title="API" description="API das Cores" />
      <Separator /> */}
      {/* <ApiList entityName="colors" entityIdName="colorId" /> */}
    </>
  );
};
