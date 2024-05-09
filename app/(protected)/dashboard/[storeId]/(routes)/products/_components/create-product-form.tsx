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
  SelectGroup,
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
import { NumericFormat } from "react-number-format";

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

  const onInvalid = (errors: any) => console.error(errors);

  /*   const checkSizes = (sizes) => {
    const cleanedSizes = sizes.filter(size => 
      size.name.trim() !== '' && size.value.trim() !== '' && size.quantity > 0
    );
  
    return cleanedSizes.length > 0 ? cleanedSizes : null;
  } */

  const onSubmit = (values: z.infer<typeof ProductSchema>) => {
    const priceInCents = Math.round(
      Number(values.price.replace(/[^0-9,-]+/g, "").replace(",", ".")) * 100
    );
    startTransition(() => {
      createProduct({ ...values, priceInCents: priceInCents }, params).then(
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

  return (
    <div className="mt-8">
      <Heading title="Criar produto" />
      <Separator className="mt-1" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem className="pt-3">
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
            <div className="flex flex-col py-1 space-y-5 max-h-28 overflow-auto">
              {fields.map((size, index) => (
                <div
                  key={size.id}
                  className="flex flex-row items-center space-x-5">
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
                      <FormItem className="xl:w-16">
                        <FormControl>
                          <Input
                            onKeyDown={handleKeyDown}
                            className="w-[70px]"
                            type="text"
                            placeholder="Ex: G"
                            {...field}
                          />
                        </FormControl>
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
                            className="w-[70px]"
                            type="number"
                            min={0}
                            {...field}
                          />
                        </FormControl>
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
            Criar
          </Button>
        </form>
      </Form>
    </div>
  );
};
