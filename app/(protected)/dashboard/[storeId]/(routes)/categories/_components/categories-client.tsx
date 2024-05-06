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
import { CategoriesDataTable } from "./categories-table";

interface CategoriesClientProps {
  data: CategoriesColumnsProps[];
}

export const CategoriesClient = ({ data }: CategoriesClientProps) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categorias (${data.length})`}
          description="Defina as categorias de sua loja"
        />
        <Button
          onClick={() =>
            router.push(`/dashboard/${params.storeId}/categories/new`)
          }>
          <CiCirclePlus className="mr-2 size-5" />
          Adicionar
        </Button>
      </div>
      <Separator />
      <CategoriesDataTable columns={columns} data={data} searchKey="name" />
      {/* <Heading title="API" description="API das Categorias" />
      <Separator /> */}
      {/* <ApiList entityIdName="categoryId" entityName="categories" /> */}
    </>
  );
};
