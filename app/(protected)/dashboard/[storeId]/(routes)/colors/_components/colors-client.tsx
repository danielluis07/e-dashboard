"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { ApiList } from "@/components/ui/api-list";
import { IoIosAlert, IoIosMore } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import { columns, ColorColumnProps } from "./colors-columns";
import { CiCirclePlus, CiTrash } from "react-icons/ci";
import { deleteColors } from "@/actions/color/delete-colors";
import { toast } from "sonner";
import { FaCheckCircle } from "react-icons/fa";
import { useState, useTransition } from "react";
import { AlertModal } from "@/components/modals/alert-modal";

interface ColorsClientProps {
  data: ColorColumnProps[];
}

export const ColorsClient = ({ data }: ColorsClientProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  const onDelete = () => {
    startTransition(() => {
      deleteColors(params).then((data) => {
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
          title={`Cores (${data.length})`}
          description="Defina as cores de sua loja"
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
              router.push(`/dashboard/${params.storeId}/colors/new`)
            }>
            <CiCirclePlus className="mr-2 size-5" /> Adicionar
          </Button>
        </div>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      {/* <Heading title="API" description="API das Cores" />
      <Separator /> */}
      {/* <ApiList entityName="colors" entityIdName="colorId" /> */}
    </>
  );
};
