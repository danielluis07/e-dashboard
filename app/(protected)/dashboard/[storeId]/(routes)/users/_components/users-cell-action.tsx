"use client";

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

import { UsersColumnProps } from "./users-columns";

interface UsersCellActionProps {
  data: UsersColumnProps;
}

export const UsersCellAction = ({ data }: UsersCellActionProps) => {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <IoIosMore className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() =>
              router.push(`/dashboard/${params.storeId}/users/${data.id}`)
            }>
            <CiEdit className="mr-2 size-5" /> Informações
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
