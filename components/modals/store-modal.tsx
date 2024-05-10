"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useStoreModal } from "@/hooks/use-store-modal";
import Modal from "../ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, useTransition } from "react";
import { CreateStoreSchema } from "@/schemas";
import { createStore } from "@/actions/store/create-store";

const StoreModal = () => {
  const storeModal = useStoreModal();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof CreateStoreSchema>>({
    resolver: zodResolver(CreateStoreSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateStoreSchema>) => {
    startTransition(() => {
      createStore(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          window.location.assign(`/dashboard/${data.storeId}`);
        })
        .catch(() => setError("Algo deu errado!"));
    });
  };

  return (
    <Modal
      title="Criar Loja"
      description="Adicione uma loja para administrar"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}>
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="E-Commerce"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={isPending}
                  variant="outline"
                  onClick={storeModal.onClose}>
                  Cancel
                </Button>
                <Button disabled={isPending} type="submit">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default StoreModal;
