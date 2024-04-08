"use client";

import { CiCirclePlus } from "react-icons/ci";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";
import { SizesColumnProps, columns } from "./sizes-columns";
// import { orderPaidTest } from "@/actions/test";

interface SizesClientProps {
  data: SizesColumnProps[];
}

export const SizesClient = ({ data }: SizesClientProps) => {
  const params = useParams();
  const router = useRouter();

  /*   const onClick = () => {
    orderPaidTest();
  }; */

  return (
    <>
      <div className="flex items-center justify-between">
        {/* <Button onClick={onClick}>TESTE</Button> */}
        <Heading
          title={`Tamanhos (${data.length})`}
          description="Os tamanhos criados na página de produtos aparecerão aqui"
        />
        {/* <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <CiCirclePlus className="mr-2 size-5" /> Adicionar
        </Button> */}
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API dos Tamanhos" />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
};
