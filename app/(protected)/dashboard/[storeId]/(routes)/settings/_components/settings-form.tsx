"use client";

import * as z from "zod";
import { Heading } from "@/components/ui/heading";
import { CiTrash } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { AlertModal } from "@/components/modals/alert-modal";
import { SettingsSchema } from "@/schemas";
import { ImageUpload } from "@/components/image-upload";
import { updateSettings } from "@/actions/settings";
import { IoIosAlert } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { UpdatePasswordForm } from "./update-password-form";
import { Switch } from "@/components/ui/switch";

export type SettingsData = {
  storeName: string | undefined;
  imageUrl: string | undefined;
  isTwoFactorEnabled: boolean | undefined;
  myUserName: string | undefined;
  email: string | undefined;
};

interface SettingsFormProps {
  initialData: SettingsData;
}

type SettingsFormValues = z.infer<typeof SettingsSchema>;

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const [isUnchanged, setIsUnchanged] = useState(true);
  const params = useParams<{ storeId: string }>();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: initialData,
  });

  const currentData = form.watch();

  useEffect(() => {
    // Function to compare initialData and currentData
    const checkIfDataIsUnchanged = () => {
      return JSON.stringify(initialData) === JSON.stringify(currentData);
    };

    setIsUnchanged(checkIfDataIsUnchanged());
  }, [currentData, initialData]);

  const onInvalid = (errors: any) => console.error(errors);

  const onSubmit = (values: SettingsFormValues) => {
    startTransition(() => {
      updateSettings(values, params).then((data) => {
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

  const onDelete = async () => {};

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      <div className="flex items-center justify-between py-5">
        <Heading
          title="Configurações"
          description="Gerencie suas preferências"
        />
        <Button
          disabled={isPending}
          variant="destructive"
          size="icon"
          onClick={() => setOpen(true)}>
          <CiTrash className="size-5" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
          <div className="space-y-4 mb-5">
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nome da Loja</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
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
            <FormField
              control={form.control}
              name="myUserName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Seu Nome</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Seu email</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-x-3 space-y-0 py-5">
                  <FormLabel>Identificação por dois fatores</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isPending || isUnchanged}
            className="ml-auto"
            type="submit">
            Salvar alterações
          </Button>
        </form>
      </Form>
      <div className="py-8">
        <Separator />
      </div>
      <div className="py-8">
        <Heading
          title="Senha"
          description="Use esse espaço para alterar sua senha"
        />
      </div>
      <UpdatePasswordForm />
    </>
  );
};
