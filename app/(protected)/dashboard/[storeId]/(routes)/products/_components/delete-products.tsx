"use client";

import { Button } from "@/components/ui/button";
import { CiTrash } from "react-icons/ci";
import { useState, useTransition } from "react";
import { AlertModal } from "@/components/modals/alert-modal";
import { deleteProducts } from "@/actions/product/delete-products";
import { toast } from "sonner";
import { IoIosAlert } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { useParams } from "next/navigation";

export interface DeleteProductsButtonProps {
  productsIds: string[];
}

export const DeleteProductsButton = ({
  productsIds,
}: DeleteProductsButtonProps) => {
  const params = useParams<{ storeId: string }>();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);

  const onDelete = () => {
    startTransition(() => {
      deleteProducts(params, productsIds).then((data) => {
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
      <Button
        disabled={isPending}
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}>
        <CiTrash className="size-5 z-10" />
      </Button>
    </>
  );
};
