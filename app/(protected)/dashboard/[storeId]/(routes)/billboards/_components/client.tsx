"use client";

import { BillboardColumn, columns } from "./billboard-columns";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CiCirclePlus, CiTrash } from "react-icons/ci";
import { useParams, useRouter } from "next/navigation";
import { ApiList } from "@/components/ui/api-list";
import { AlertModal } from "@/components/modals/alert-modal";
import { useState, useTransition } from "react";
import { deleteBillboards } from "@/actions/billboard/delete-billboards";
import { toast } from "sonner";
import { IoIosAlert } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { BillboardDataTable } from "./billboard-table";

interface BillboardClientProps {
  data: BillboardColumn[];
}

export const BillboardClient = ({ data }: BillboardClientProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Banners (${data.length})`}
          description="Defina os Banners de sua loja"
        />
        <Button
          onClick={() =>
            router.push(`/dashboard/${params.storeId}/billboards/new`)
          }>
          <CiCirclePlus className="mr-2 size-5" />
          Adicionar
        </Button>
      </div>
      <Separator />
      <BillboardDataTable columns={columns} data={data} searchKey="label" />
      {/* <Heading title="API" description="API dos Banners" />
      <Separator /> */}
      {/* <ApiList entityIdName="billboardId" entityName="billboards" /> */}
    </>
  );
};
