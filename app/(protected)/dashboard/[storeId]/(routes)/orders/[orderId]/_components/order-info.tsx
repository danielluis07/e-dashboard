"use client";

import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Product, Store } from "@prisma/client";
import { User } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import imagePlaceholder from "@/public/image-placeholder.jpg";
import { useForm } from "react-hook-form";
import { convertCentsToReal } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useTransition } from "react";
import { OrderSchema } from "@/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateOrder } from "@/actions/order/update-order";
import { IoIosAlert } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";

interface OrderItemProps {
  id: string;
  orderId: string;
  product: Product;
  productId: string;
  sizeName: string | null;
  sizeValue: string | null;
  imageUrl: string | null;
  size?: {
    id: string;
    name: string;
    productId: string;
    quantity: number;
    storeId: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;
  };
  sizeId: string;
}

interface OrderProps {
  id: string;
  number: number;
  storeId: string;
  userId: string;
  status: "PAID" | "WAITING_FOR_PAYMENT" | "CANCELED";
  logisticStatus: "WAITING_FOR_PAYMENT" | "PREPARING" | "SENT" | "DELIVERED";
  isRefunded: boolean | null;
  shippingDate: Date | null;
  shippingMethodId: string | null;
  phone: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  createdAt: Date;
  updatedAt: Date;
  trackId: string | null;
  paidAt: Date | null;
  user: User;
  orderItems: OrderItemProps[];
}

interface OrderInfoProps {
  initialData: OrderProps | null;
}

type OrderFormValues = z.infer<typeof OrderSchema>;

enum LogisticStatus {
  WaitingForPayment = "WAITING_FOR_PAYMENT",
  Preparing = "PREPARING",
  Sent = "SENT",
  Delivered = "DELIVERED",
}

export const OrderInfo = ({ initialData }: OrderInfoProps) => {
  const router = useRouter();
  const params = useParams<{ storeId: string; orderId: string }>();
  const [isPending, startTransition] = useTransition();

  const logisticStatuses = [
    { id: "WAITING_FOR_PAYMENT", name: "Aguardando confirmação de pagamento" },
    { id: "PREPARING", name: "Pedido em separação" },
    { id: "SENT", name: "Pedido enviado" },
    { id: "DELIVERED", name: "Pedido entregue" },
  ];

  const defaultValues = initialData?.trackId
    ? {
        logisticStatus: initialData.logisticStatus,
        trackId: initialData?.trackId,
      }
    : {
        logisticStatus: LogisticStatus.WaitingForPayment,
        trackId: null,
      };

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderSchema),
    defaultValues,
  });

  const handleClickProduct = (productId: string) => {
    router.push(`/dashboard/${params.storeId}/products/${productId}`);
  };

  const handleClickUser = (userId: string | undefined) => {
    router.push(`/dashboard/${params.storeId}/users/${userId}`);
  };

  const statusPagamento = (status: string | undefined) => {
    if (status === "PAID") {
      return "Pago";
    } else if (status === "WAITING_FOR_PAYMENT") {
      return "Aguardando Pagamento";
    } else if (status === "CANCELED") {
      return "Cancelado";
    }
  };

  const onInvalid = (errors: any) => console.error(errors);

  const onSubmit = (values: z.infer<typeof OrderSchema>) => {
    console.log(values);
    startTransition(() => {
      updateOrder(values, params).then((data) => {
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
      });
    });
  };

  return (
    <div className="pt-5 space-y-4 h-full">
      <p className="text-2xl font-bold">Pedido nº{initialData?.number}</p>
      <div className="flex flex-col xl:flex-row space-y-2 xl:space-y-0 xl:space-x-2 mt-4 pr-2">
        <Card className="w-full space-y-5 p-2">
          <div
            className="min-w-10 max-w-36"
            onClick={() => handleClickUser(initialData?.userId)}>
            <p className="font-bold">
              Usuário:{" "}
              <span className="underline hover:no-underline cursor-pointer truncate">
                {initialData?.user.name}
              </span>
            </p>
          </div>
          <p>
            <span className="font-bold">Email: </span>
            {initialData?.user.email}
          </p>
          <p>
            <span className="font-bold">Status: </span>
            {statusPagamento(initialData?.status)}
          </p>
          {initialData?.paidAt && initialData?.status === "PAID" && (
            <p className="font-bold">
              Pago em:{" "}
              <span className="font-normal">
                {format(initialData.paidAt, "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </p>
          )}
        </Card>
        <Card className="min-w-96 p-2">
          <h1 className="text-xl font-bold">Atualizar informações</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onInvalid)}
              className="mt-1 space-y-2">
              <FormField
                control={form.control}
                name="logisticStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Situação</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {logisticStatuses.map((item, index) => (
                          <SelectItem key={index} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trackId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Rastreio</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button className="w-5/6" disabled={isPending} type="submit">
                  Atualizar
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold">Produtos</div>
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
          {initialData?.orderItems.map((item, index) => (
            <Card key={index} className="flex space-x-2 p-2">
              <div className="relative w-[100px] h-[100px]">
                <Image
                  src={item.imageUrl ?? imagePlaceholder}
                  alt="produto"
                  fill
                  className="object-contain"
                  sizes="(max-width: 3840px) 100px"
                />
              </div>
              <div className="space-y-2">
                <div
                  className="text-lg font-bold underline hover:no-underline cursor-pointer min-w-10 max-w-36 truncate"
                  onClick={() => handleClickProduct(item.productId)}>
                  {item.product.name}
                </div>
                <p>
                  <span className="font-bold">Tamanho: </span>
                  {item.size?.value}
                </p>
                <p>
                  <span className="font-bold">Preço: </span>
                  {convertCentsToReal(item.product.price)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
