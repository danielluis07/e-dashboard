"use client";

import * as z from "zod";
import { Category, Billboard } from "@prisma/client";
import { CiTrash } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { toast } from "sonner";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategorySchema } from "@/schemas";
import { createCategory } from "@/actions/category/create-category";
import { IoIosAlert } from "react-icons/io";
import { ImageUpload } from "@/components/image-upload";

interface CreateCategoryFormProps {
  initialData?: CategoryFormValues | null;
  billboards: Billboard[];
  imageUrl?: string | undefined;
}

type CategoryFormValues = z.infer<typeof CategorySchema>;

export const CreateCategoryForm = ({
  initialData,
}: CreateCategoryFormProps) => {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
      imageUrl: "",
    },
  });

  const onInvalid = (errors: any) => console.error(errors);

  const onSubmit = async (values: z.infer<typeof CategorySchema>) => {
    const additionalValue = values.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f\s\d\\\/]/g, "")
      .toLowerCase();
    startTransition(() => {
      createCategory({ ...values, value: additionalValue }, params).then(
        (data) => {
          if (data.error) {
            toast(data.error, {
              icon: <IoIosAlert className="text-red-600" />,
            });
          }

          if (data.success) {
            toast(data.success, {
              icon: <FaCheckCircle className="text-lime-500" />,
            });
            router.push(`/dashboard/${params.storeId}/categories`);
          }
        }
      );
    });
  };

  const onDelete = async () => {};

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      <div className="flex items-center justify-between py-10">
        <Heading title="Criar categoria" />
        {initialData && (
          <Button
            disabled={isPending}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}>
            <CiTrash className="size-5" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-8 w-full">
          <div className="grid grid-cols-1 gap-8 mt-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Nome da categoria"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            {/*             <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Selecione uma banner"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
          <Button disabled={isPending} className="ml-auto" type="submit">
            Criar
          </Button>
        </form>
      </Form>
    </>
  );
};
