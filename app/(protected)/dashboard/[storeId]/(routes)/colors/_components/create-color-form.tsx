"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { CiTrash } from "react-icons/ci";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Color } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { ColorSchema } from "@/schemas";
import { createColor } from "@/actions/color/create-color";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosAlert } from "react-icons/io";

type ColorFormValues = z.infer<typeof ColorSchema>;

interface CreateColorFormProps {
  initialData?: Color | null;
}

export const CreateColorForm = ({ initialData }: CreateColorFormProps) => {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(ColorSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ColorSchema>) => {
    startTransition(() => {
      createColor(values, params).then((data) => {
        if (data.error) {
          toast(data.error, {
            icon: <IoIosAlert className="text-red-600" />,
          });
        }

        if (data.success) {
          toast(data.success, {
            icon: <FaCheckCircle className="text-lime-500" />,
          });
          router.push(`/dashboard/${params.storeId}/colors`);
        }
      });
    });
  };

  return (
    <>
      <div className="flex items-center justify-between pt-10">
        <Heading title="Criar cor" />
      </div>
      <Separator className="my-5" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Nome da cor"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={isPending}
                        placeholder="Exemplo: #000"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
    </>
  );
};
