"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "../form-success";
import { register } from "@/actions/register";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState<string | boolean>(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Crie uma conta"
      backButtonLabel="Já possui uma conta?"
      backButtonHref="/auth/login"
      showSocial>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel
                    className={cn(
                      "ml-3 absolute transition-all text-slate-400",
                      field.value
                        ? "-top-2 text-sm bg-milky text-fuchsia-500 font-thin"
                        : "top-1/2 transform -translate-y-1/2 text-base"
                    )}>
                    Nome
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-fuchsia-500"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel
                    className={cn(
                      "ml-3 absolute transition-all text-slate-400",
                      field.value
                        ? "-top-2 text-sm bg-milky text-fuchsia-500 font-thin"
                        : "top-1/2 transform -translate-y-1/2 text-base"
                    )}>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-fuchsia-500"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel
                    className={cn(
                      "ml-3 absolute transition-all text-slate-400",
                      field.value
                        ? "-top-2 text-sm bg-milky text-fuchsia-500 font-thin"
                        : "top-1/2 transform -translate-y-1/2 text-base"
                    )}>
                    Senha
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-fuchsia-500"
                      type={cn(showPassword ? "text" : "password")}
                    />
                  </FormControl>
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className={cn(
                      showPassword && "hidden",
                      "absolute right-2 top-1"
                    )}>
                    <FaRegEye className="text-lg" />
                  </div>
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className={cn(
                      !showPassword && "hidden",
                      "absolute right-2 top-1"
                    )}>
                    <FaRegEyeSlash className="text-lg" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Criar conta
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
