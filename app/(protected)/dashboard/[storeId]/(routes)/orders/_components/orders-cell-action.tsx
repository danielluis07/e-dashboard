"use client";

import { useState, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrdersColumnsProps } from "./orders-columns";
import { Button } from "@/components/ui/button";
import { IoCopyOutline } from "react-icons/io5";
import { CiEdit, CiTrash } from "react-icons/ci";
import { IoIosMore } from "react-icons/io";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { AiOutlineFileSearch } from "react-icons/ai";
import { deleteOrder } from "@/actions/order/delete-order";

interface OrdersCellActionProps {
  data: OrdersColumnsProps;
}

export const OrdersCellAction = ({ data }: OrdersCellActionProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams<{ storeId: string }>();
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Id copiada!");
  };

  const onDelete = () => {
    startTransition(() => {
      deleteOrder(params.storeId, data.id).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }

        if (data.success) {
          toast.success(data.success);
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
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <CiTrash className="mr-2 size-5" />
            Deletar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/${params.storeId}/orders/${data.id}`)
            }>
            <AiOutlineFileSearch className="mr-2 size-5" />
            Ver detalhes
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
