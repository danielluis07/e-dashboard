"use client";

import { BillboardColumn, columns } from "./billboard-columns";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CiCirclePlus, CiTrash } from "react-icons/ci";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { AlertModal } from "@/components/modals/alert-modal";
import { useState, useTransition } from "react";
import { deleteBillboards } from "@/actions/billboard/delete-billboards";
import { toast } from "sonner";
import { IoIosAlert } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";

interface BillboardClientProps {
  data: BillboardColumn[];
}

export const BillboardClient = ({ data }: BillboardClientProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  const onDelete = () => {
    startTransition(() => {
      deleteBillboards(params).then((data) => {
        if (data.error) {
          toast(data.error, {
            icon: <IoIosAlert className="text-red-600" />,
          });
        }

        if (data.success) {
          toast(data.success, {
            icon: <FaCheckCircle className="text-lime-500" />,
          });
          setOpen(false);
        }
      });
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={`Banners (${data.length})`}
          description="Defina os Banners de sua loja"
        />
        <div className="flex flex-col md:flex-row gap-x-4 gap-y-2">
          <Button
            variant="destructive"
            onClick={() => setOpen(true)}
            disabled={data.length < 1}>
            <CiTrash className="mr-2 size-4" />
            Deletar Todos
          </Button>
          <Button
            onClick={() =>
              router.push(`/dashboard/${params.storeId}/billboards/new`)
            }>
            <CiCirclePlus className="mr-2 size-5" />
            Adicionar
          </Button>
        </div>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      {/* <Heading title="API" description="API dos Banners" />
      <Separator /> */}
      {/* <ApiList entityIdName="billboardId" entityName="billboards" /> */}
    </>
  );
};
