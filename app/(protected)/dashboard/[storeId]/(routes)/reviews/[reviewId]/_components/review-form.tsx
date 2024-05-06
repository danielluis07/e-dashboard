"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CiTrash } from "react-icons/ci";
import { Review } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
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
import { AlertModal } from "@/components/modals/alert-modal";
import { ReviewSchema } from "@/schemas";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosAlert } from "react-icons/io";
import { deleteProduct } from "@/actions/product/delete-product";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import placeholder from "@/public/placeholder-logo.jpg";
import { ReviewStar } from "../../_components/review-star";
import { Rating } from "react-simple-star-rating";
import { reply } from "@/actions/review/reply-review";
import { Heading } from "@/components/ui/heading";

type ReviewFormValues = z.infer<typeof ReviewSchema>;

interface ReviewFormProps {
  name: string | null | undefined;
  text: string | undefined;
  initialData: Review | null;
  imageUrl: string | StaticImport;
  rating: number | undefined;
}

export const ReviewForm = ({
  initialData,
  imageUrl,
  name,
  rating,
  text,
}: ReviewFormProps) => {
  const params = useParams<{ storeId: string; reviewId: string }>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: initialData || {
      reply: "",
    },
  });

  const onInvalid = (errors: any) => console.error(errors);

  const onSubmit = (values: z.infer<typeof ReviewSchema>) => {
    startTransition(() => {
      reply(values, params).then((data) => {
        if (data.error) {
          toast(data.error, {
            icon: <IoIosAlert className="text-red-600" />,
          });
        }

        if (data.success) {
          toast(data.success, {
            icon: <FaCheckCircle className="text-lime-500" />,
          });
          router.push(`/dashboard/${params.storeId}/reviews`);
        }
      });
    });
  };

  return (
    <div className="pt-3">
      <Heading title="Avaliação" description="Responda a essa avaliação" />
      <Separator className="my-3" />
      <div className="mt-8 space-y-4 my-8 bg-gray-100 p-2 rounded-sm">
        <div className="flex items-center gap-x-3">
          <div className="relative size-10 rounded-full overflow-hidden">
            <Image
              src={imageUrl ? imageUrl : placeholder}
              fill
              alt="usuario"
              className="size-full object-cover"
              sizes="(max-width: 3840px) 40px"
            />
          </div>
          <div>{name}</div>
        </div>
        <div>{text}</div>
        <div>
          <Rating readonly size={20} initialValue={rating} allowFraction />
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="reply"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Escreva uma resposta..."
                    className="h-56"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} className="ml-auto" type="submit">
            Enviar
          </Button>
        </form>
      </Form>
    </div>
  );
};
