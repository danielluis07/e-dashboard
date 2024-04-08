"use client";

import { useState } from "react";
import { MainNav } from "@/app/(protected)/dashboard/_components/main-nav";
import { StoreSwitcher } from "@/app/(protected)/dashboard/_components/store-switcher";
import { UserButton } from "./auth/user-button";
import { Store } from "@prisma/client";
import { cn } from "@/lib/utils";
import { LuArrowLeftFromLine } from "react-icons/lu";
import { LuArrowRightFromLine } from "react-icons/lu";

interface SideBarProps {
  name: string | null | undefined;
  imageUrl?: string | null | undefined;
  stores: Store[];
}

export const Sidebar = ({ name, stores, imageUrl }: SideBarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        "md-max:hidden min-h-full bg-milky shadow-lg",
        isOpen ? "w-[90px]" : "w-72"
      )}>
      <div className="p-5 flex flex-col h-full">
        <div
          className={cn(
            "flex mb-3",
            isOpen ? "flex-col" : "flex-row justify-between items-center"
          )}>
          <div className="flex items-center gap-x-2">
            <UserButton isOpen={isOpen} imageUrl={imageUrl} />
            <div className={cn(isOpen ? "hidden w-min" : "w-1/2")}>
              Bem vindo, {name?.split(" ")[0]}
            </div>
          </div>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="text-xl hover:text-fuchsia-500 cursor-pointer">
            <LuArrowLeftFromLine className={cn(isOpen && "hidden")} />
            <div className={cn("w-min mx-auto mt-2", !isOpen && "hidden")}>
              <LuArrowRightFromLine />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className={cn(isOpen && "mt-5")}>
            <StoreSwitcher items={stores} isOpen={isOpen} />
          </div>
        </div>
        <div className="mt-8 flex-grow">
          <MainNav isOpen={isOpen} />
        </div>
      </div>
    </div>
  );
};
