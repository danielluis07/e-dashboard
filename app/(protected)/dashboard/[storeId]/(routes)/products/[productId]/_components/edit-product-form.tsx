"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { FaMinus } from "react-icons/fa6";
import { CiTrash } from "react-icons/ci";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { convertCentsToReal } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ProductSchema } from "@/schemas";
import { updateProduct } from "@/actions/product/update-product";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosAlert } from "react-icons/io";
import { deleteProduct } from "@/actions/product/delete-product";
import { NumericFormat } from "react-number-format";
import { SelectGroup } from "@radix-ui/react-select";

type ProductFormValues = z.infer<typeof ProductSchema>;

interface EditProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
        sizes: Size[];
      })
    | null;
  categories: Category[];
  colors: Color[];
}

export const EditProductForm = ({
  initialData,
  categories,
  colors,
}: EditProductFormProps) => {
  const params = useParams<{ storeId: string; productId: string }>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === " ") {
      // or event.code === "Space"
      event.preventDefault();
    }
  };

  const defaultValues = initialData
    ? {
        ...initialData,
        price: convertCentsToReal(initialData.price),
      }
    : {
        name: "",
        description: "",
        images: [],
        price: "",
        categoryId: "",
        stock: 0,
        sizes: [
          {
            name: "",
            value: "",
            quantity: 0,
          },
        ],
        colorId: "",
        isFeatured: false,
        isArchived: false,
        isNew: false,
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues,
  });

  const control = form.control;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizes",
  });

  const handleAddSize = () => {
    append({ name: "", value: "", quantity: 0 });
  };

  const handleRemoveSize = (index: number) => {
    if (fields.length === 1) {
      return;
    }
    remove(index);
  };

  const onSubmit = (values: z.infer<typeof ProductSchema>) => {
    const priceInCents = Math.round(
      Number(values.price.replace(/[^0-9,-]+/g, "").replace(",", ".")) * 100
    );
    startTransition(() => {
      updateProduct({ ...values, priceInCents: priceInCents }, params).then(
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
            router.push(`/dashboard/${params.storeId}/products`);
          }
        }
      );
    });
  };

  const onDelete = () => {
    startTransition(() => {
      deleteProduct(params).then((data) => {
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
        router.push(`/dashboard/${params.storeId}/products`);
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
      <div>
        <div className="flex items-center justify-between">
          <Heading title="Editar produto" />
          <Button
            disabled={isPending}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}>
            <CiTrash className="size-5 z-10" />
          </Button>
        </div>
        <Separator className="mt-1" />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagens</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map((image) => image.url)}
                      disabled={isPending}
                      onChange={(url) =>
                        field.onChange([...field.value, { url }])
                      }
                      onRemove={(url) =>
                        field.onChange([
                          ...field.value.filter(
                            (current) => current.url !== url
                          ),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid xl:grid xl:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Nome do produto"
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
                      <Textarea
                        disabled={isPending}
                        placeholder="Descrição do produto (máximo 500 caracteres)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                defaultValue=""
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <NumericFormat
                        {...field}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix={"R$ "}
                        customInput={Input}
                        type="text"
                        placeholder="Ex: 39,99"
                        onValueChange={(values) => {
                          const { value } = values;
                          field.onChange(value);
                        }}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        allowNegative={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Selecione uma categoria"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col space-y-5 max-h-36 overflow-auto">
                {fields.map((size, index) => (
                  <div key={size.id} className="flex flex-row space-x-3">
                    <FormField
                      control={form.control}
                      name={`sizes.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              onKeyDown={handleKeyDown}
                              className="w-[100px]"
                              type="text"
                              placeholder="Ex: Grande"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`sizes.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              onKeyDown={handleKeyDown}
                              className="w-[70px]"
                              type="text"
                              placeholder="Ex: G"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`sizes.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="w-[70px]"
                              type="number"
                              min={0}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      onClick={() => handleRemoveSize(index)}
                      disabled={fields.length <= 1 || isPending}>
                      <FaMinus />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={handleAddSize}
                  disabled={fields.length >= 5 || isPending}
                  className="w-5/6 mx-auto">
                  Adicionar Tamanho
                </Button>
              </div>
              <FormField
                control={form.control}
                name="colorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value ?? "none"}
                      defaultValue={field.value ?? "none"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value ?? "none"}
                            placeholder="Selecione uma cor"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="none">Sem Cor</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          {colors.map((color) => (
                            <SelectItem key={color.id} value={color.id}>
                              {color.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Destaque</FormLabel>
                      <FormDescription>
                        Esse produto vai aparecer na página principal
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isArchived"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Arquivado</FormLabel>
                      <FormDescription>
                        Esse produto não vai aparecer na loja
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isNew"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>É novo</FormLabel>
                      <FormDescription>
                        Esse produto vai aparecer na lista de produtos novos da
                        loja
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isPending} className="ml-auto" type="submit">
              Salvar mudanças
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
