"use client";

import { deleteStore } from "@/actions/store/delete-store";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosAlert } from "react-icons/io";
import { toast } from "sonner";

interface DeleteStoreButtonProps {
  stores: Store[];
}

export const DeleteStoreButton = ({ stores }: DeleteStoreButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const params = useParams<{ storeId: string }>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onDelete = () => {
    startTransition(() => {
      deleteStore(params).then((data) => {
        if (data.error) {
          toast(data.error, {
            icon: <IoIosAlert className="text-red-600" />,
          });
        }

        if (data.success) {
          toast(data.success, {
            icon: <FaCheckCircle className="text-lime-500" />,
          });
        }
        router.push(`/dashboard/${stores[0].id}`);
      });
    });
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      <Button
        className="w-72"
        variant="destructive"
        size="icon"
        onClick={() => setIsOpen(true)}>
        Deletar essa loja
      </Button>
    </>
  );
};
