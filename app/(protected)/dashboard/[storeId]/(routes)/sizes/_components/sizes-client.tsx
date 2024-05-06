"use client";

import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";
import { SizesColumnProps, columns } from "./sizes-columns";
import { orderPaidTest } from "@/actions/test";
import { Button } from "@/components/ui/button";
import { SizesDataTable } from "./sizes-table";

interface SizesClientProps {
  data: SizesColumnProps[];
}

export const SizesClient = ({ data }: SizesClientProps) => {
  const onClick = () => {
    orderPaidTest();
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Tamanhos (${data.length})`}
          description="Os tamanhos criados na página de produtos aparecerão aqui"
        />
        <Button onClick={onClick}>teste</Button>
      </div>
      <Separator />
      <SizesDataTable searchKey="name" columns={columns} data={data} />
      {/* <Heading title="API" description="API dos Tamanhos" />
      <Separator /> */}
      {/* <ApiList entityName="sizes" entityIdName="sizeId" /> */}
    </>
  );
};
