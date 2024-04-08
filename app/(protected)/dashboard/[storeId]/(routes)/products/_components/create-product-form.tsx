"use client";

import * as z from "zod";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
import { FaMinus } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/image-upload";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { ProductSchema } from "@/schemas";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosAlert } from "react-icons/io";
import { createProduct } from "@/actions/product/create-product";

type ProductFormValues = z.infer<typeof ProductSchema>;

interface CreateProductFormProps {
  initialData?:
    | (Product & {
        images: Image[];
        sizes: Size[];
      })
    | null;
  categories: Category[];
  colors: Color[];
}

export const CreateProductForm = ({
  categories,
  colors,
}: CreateProductFormProps) => {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === " ") {
      // or event.code === "Space"
      event.preventDefault();
    }
  };

  const unformatPrice = (value: string) => {
    // Convert from '00,00' format to an integer in centavos
    const unformatted = parseInt(value.replace(",", ""), 10);
    return unformatted;
  };

  const defaultValues = {
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

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const formattedValue = value
      .replace(/\D/g, "") // Remove all non-numeric characters
      .replace(/(\d)(\d{2})$/, "$1,$2"); // Add comma before the last 2 digits
    form.setValue("price", formattedValue);
  };

  const onInvalid = (errors: any) => console.error(errors);

  const onSubmit = (values: z.infer<typeof ProductSchema>) => {
    startTransition(() => {
      createProduct(
        { ...values, priceInCents: unformatPrice(values.price) },
        params
      ).then((data) => {
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
      });
    });
  };

  return (
    <div className="h-full mt-8">
      <div className="flex items-center justify-between">
        <Heading title="Criar produto" description="Adicionar novo produto" />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem className="pt-10">
                <FormLabel>Escolha uma imagem</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={isPending}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={isPending}
                      placeholder="Ex: 39,99"
                      {...field}
                      min={1}
                      onChange={handlePriceChange}
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
            <div className="flex flex-col space-y-5">
              {fields.map((size, index) => (
                <div
                  key={size.id}
                  className="flex flex-row space-x-1 xl:justify-between">
                  <FormField
                    control={form.control}
                    name={`sizes.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="xl:w-24">
                        <FormControl>
                          <Input
                            onKeyDown={handleKeyDown}
                            className="w-full"
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
                      <FormItem className="xl:w-16">
                        <FormControl>
                          <Input
                            onKeyDown={handleKeyDown}
                            className="w-full"
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
                      <FormItem className="xl:w-14">
                        <FormControl>
                          <Input
                            className="w-full"
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
                    disabled={fields.length <= 1}>
                    <FaMinus />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={handleAddSize}
                disabled={fields.length >= 5}>
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
                    value={field.value}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Selecione uma cor"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.name}
                        </SelectItem>
                      ))}
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
            Criar
          </Button>
        </form>
      </Form>
    </div>
  );
};
