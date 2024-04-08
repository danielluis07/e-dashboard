"use client";

import { ReviewColumnProps } from "./reviews-columns";
import { useTransition } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { CiEdit, CiTrash } from "react-icons/ci";
import { IoIosAlert, IoIosMore } from "react-icons/io";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReviewsCellActionProps {
  data: ReviewColumnProps;
}

export const ReviewsCellAction = ({ data }: ReviewsCellActionProps) => {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const onDelete = () => {};

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Id copiada!");
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
            <IoCopyOutline className="mr-2 size-5" /> Copiar Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/${params.storeId}/reviews/${data.id}`)
            }>
            <CiEdit className="mr-2 size-5" />{" "}
            {data.hasReply === "Sim" ? "Editar" : "Responder"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <CiTrash className="mr-2 size-5" /> Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
