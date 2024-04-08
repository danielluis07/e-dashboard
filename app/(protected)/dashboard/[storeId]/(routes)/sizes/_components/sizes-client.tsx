"use client";

import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";
import { SizesColumnProps, columns } from "./sizes-columns";

interface SizesClientProps {
  data: SizesColumnProps[];
}

export const SizesClient = ({ data }: SizesClientProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Tamanhos (${data.length})`}
          description="Os tamanhos criados na página de produtos aparecerão aqui"
        />
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API dos Tamanhos" />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
};
