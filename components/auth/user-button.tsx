"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import placeholder from "@/public/placeholder-logo.jpg";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface UserButtonProps {
  isOpen?: boolean;
  imageUrl: string | null | undefined;
}

export const UserButton = ({ isOpen, imageUrl }: UserButtonProps) => {
  const image = imageUrl as string | StaticImport;
  return (
    <div
      className={cn(
        isOpen && "mx-auto",
        "relative size-8 rounded-full overflow-hidden"
      )}>
      <Image
        src={image ? image : placeholder}
        alt="usuario"
        fill
        priority
        className="object-cover"
        sizes="(max-width: 3840px) 32px"
      />
    </div>
  );
};
