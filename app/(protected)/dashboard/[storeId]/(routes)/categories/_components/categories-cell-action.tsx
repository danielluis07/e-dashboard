"use client";

import { useState } from "react";
import { CategoriesColumnsProps } from "./categories-columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IoCopyOutline } from "react-icons/io5";
import { CiEdit, CiTrash } from "react-icons/ci";
import { IoIosAlert, IoIosMore } from "react-icons/io";
import { AlertModal } from "@/components/modals/alert-modal";
import { useTransition } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { deleteCategory } from "@/actions/category/delete-category";
import { FaCheckCircle } from "react-icons/fa";

interface CategoriesCellActionProps {
  data: CategoriesColumnsProps;
}

export const CategoriesCellAction = ({ data }: CategoriesCellActionProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Id copiada!");
  };

  const categoryData = {
    storeId: params.storeId as string,
    categoryId: data.id as string,
  };

  const onDelete = () => {
    startTransition(() => {
      deleteCategory(categoryData).then((data) => {
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <IoIosMore className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <IoCopyOutline className="mr-2 size-5" />
            Copiar Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/${params.storeId}/categories/${data.id}`)
            }>
            <CiEdit className="mr-2 size-5" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <CiTrash className="mr-2 size-5" />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
