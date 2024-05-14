"use client";

import { cn } from "@/lib/utils";
import { StoreSwitcher } from "./store-switcher";
import { UserButton } from "@/components/auth/user-button";
import { MobileNavbar } from "./mobile-navbar";
import { Store } from "@prisma/client";
import { useEffect, useState } from "react";

interface NavbarBarProps {
  imageUrl?: string | null | undefined;
  stores: Store[];
}

export const Navbar = ({ imageUrl, stores }: NavbarBarProps) => {
  const [scrolledDown, setScrolledDown] = useState<boolean>(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 0) {
      // You can adjust this value based on your preference
      setScrolledDown(true);
    } else {
      setScrolledDown(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        scrolledDown && "bg-milky",
        "fixed top-0 left-0 right-0 z-20 flex items-center justify-between border-b px-1"
      )}>
      <div className="flex items-center gap-x-3">
        <UserButton imageUrl={imageUrl} />
        {/* <Notifications /> */}
        <StoreSwitcher items={stores} />
      </div>
      <MobileNavbar />
    </div>
  );
};
