"use client";

import { FaUser } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/auth/logout-button";
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
        className="size-full object-cover"
      />
    </div>
  );
};
