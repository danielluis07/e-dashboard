import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BillboardColumn } from "./billboard-columns";
import { Button } from "@/components/ui/button";
import { IoCopyOutline } from "react-icons/io5";
import { CiEdit, CiTrash } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { IoIosAlert } from "react-icons/io";
import { AlertModal } from "@/components/modals/alert-modal";
import { useTransition } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { deleteBillboard } from "@/actions/billboard/delete-billboard";

interface CellActionProps {
  data: BillboardColumn;
}

const CellAction = ({ data }: CellActionProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams<{ storeId: string; billboardId: string }>();
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Id copiada!");
  };

  const billboardData = {
    storeId: params.storeId as string,
    billboardId: data.id as string,
  };

  const onDelete = () => {
    startTransition(() => {
      deleteBillboard(billboardData).then((data) => {
        if (data.error) {
          toast(data.error, {
            icon: <IoIosAlert className="text-red-600" />,
          });
        }

        if (data.success) {
          toast("Banner deletado", {
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
            <IoCopyOutline className="mr-2 h-4 w-4" />
            Copiar Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/${params.storeId}/billboards/${data.id}`)
            }>
            <CiEdit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <CiTrash className="mr-2 h-4 w-4" />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
