"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { toast } from "sonner";
import { FaCheckCircle } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { ImageUpload } from "@/components/image-upload";
import { CreateBillboardSchema, UploadImage } from "@/schemas";
import { createBillboard } from "@/actions/billboard/create-billboard";
import { IoIosAlert } from "react-icons/io";

type BillboardFormValues = z.infer<typeof CreateBillboardSchema>;

export const CreateBillboardForm = () => {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(CreateBillboardSchema),
    defaultValues: {
      label: "",
      imageUrl: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CreateBillboardSchema>) => {
    startTransition(() => {
      createBillboard(values, params).then((data) => {
        if (data.error) {
          toast(data.error, {
            icon: <IoIosAlert className="text-red-600" />,
          });
        }

        if (data.success) {
          toast(data.success, {
            icon: <FaCheckCircle className="text-lime-500" />,
          });
          router.push(`/dashboard/${params.storeId}/billboards`);
        }
      });
    });
  };

  return (
    <div className="pt-10">
      <div>
        <div className="flex items-center justify-between">
          <Heading title="Criar banner" />
        </div>
        <Separator />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full py-8">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem de fundo</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={isPending}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Nome do banner"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Insira uma breve descrição"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isPending} className="ml-auto" type="submit">
              Criar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
