"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import { useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { CardWrapper } from "./card-wrapper";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState<string | boolean>(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Esse email já está em uso com outro provedor!"
      : "";
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Algo deu Errado!"));
    });
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return false;
  }

  return (
    <CardWrapper
      headerLabel="Bem vindo novamente!"
      backButtonLabel="Não possui uma conta?"
      backButtonHref="/auth/register"
      showSocial={false}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de autenticação</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-fuchsia-500"
                          disabled={isPending}
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
                            : "top-5 transform -translate-y-1/2 text-base"
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
                        <FaRegEye
                          className={cn(
                            isPending && "text-gray-400",
                            "text-lg"
                          )}
                        />
                      </div>
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className={cn(
                          !showPassword && "hidden",
                          "absolute right-2 top-1"
                        )}>
                        <FaRegEyeSlash
                          className={cn(
                            isPending && "text-gray-400",
                            "text-lg"
                          )}
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal">
                        <Link href="/auth/reset">Esqueceu a senha?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormSuccess message={success} />
          <FormError message={error || urlError} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {showTwoFactor ? "Confirmar" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
