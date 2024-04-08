"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CiTrash } from "react-icons/ci";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { SingleOrderProps } from "../page";

interface OrderFormProps {
  order: SingleOrderProps;
}

export const OrderForm = ({ order }: OrderFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const payment = () => {
    if (order.isPaid == false) {
      return "Não efetuado";
    } else {
      return "Efetuado";
    }
  };

  const onDelete = async () => {};

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={`Pedido nº ${order?.id}`}
          description="Detalhes do pedido"
        />
        {order && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}>
            <CiTrash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <div>
        <p>
          Produto: <span>{order.productName}</span>
          <p>
            Cliente:{" "}
            <span>
              {order.userFirstName} {order.userLastName}
            </span>
          </p>
        </p>
        <p>
          Email: <span>{order.userEmail}</span>
        </p>
        <p>
          Telefone: <span>{order.phone}</span>
        </p>
        <p>
          Status do Pagamento: <span>{payment()}</span>
        </p>
        <p>
          Tamanho {order.sizeName} / {order.sizeValue}
        </p>
        <p>
          Valor: <span>{order.totalPrice}</span>
        </p>
        <p>
          Endereço: <span>{order.address}</span>
        </p>
        <p>Forma de envio: {order.shippingMethodId}</p>
      </div>
    </>
  );
};
