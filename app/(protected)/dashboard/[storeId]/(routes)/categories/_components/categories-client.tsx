"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useState, useTransition } from "react";
import { CiCirclePlus, CiTrash } from "react-icons/ci";
import { useParams, useRouter } from "next/navigation";
import { CategoriesColumnsProps, columns } from "./categories-columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { deleteCategories } from "@/actions/category/delete-categories";
import { toast } from "sonner";
import { IoIosAlert } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { AlertModal } from "@/components/modals/alert-modal";

interface CategoriesClientProps {
  data: CategoriesColumnsProps[];
}

export const CategoriesClient = ({ data }: CategoriesClientProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  const onDelete = () => {
    startTransition(() => {
      deleteCategories(params).then((data) => {
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
          title={`Categorias (${data.length})`}
          description="Defina as categorias de sua loja"
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
              router.push(`/dashboard/${params.storeId}/categories/new`)
            }>
            <CiCirclePlus className="mr-2 size-5" />
            Adicionar
          </Button>
        </div>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API das Categorias" />
      <Separator />
      <ApiList entityIdName="categoryId" entityName="categories" />
    </>
  );
};
