"use client";

import { MainNav } from "./main-nav";
import { StoreSwitcher } from "./store-switcher";
import { db } from "@/lib/db";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserButton } from "@/components/auth/user-button";
import { IoMenu } from "react-icons/io5";
import { MobileNavbar } from "./mobile-navbar";
import { Store } from "@prisma/client";

interface NavbarBarProps {
  name: string | null | undefined;
  imageUrl?: string | null | undefined;
  stores: Store[];
}

export const Navbar = ({ name, imageUrl, stores }: NavbarBarProps) => {
  return (
    <div className="flex h-16 items-center justify-between px-4 border-b">
      <div className="flex items-center gap-x-3">
        <UserButton imageUrl={imageUrl} />
        <StoreSwitcher items={stores} />
      </div>
      <div>
        <MobileNavbar />
      </div>
    </div>
  );
};
