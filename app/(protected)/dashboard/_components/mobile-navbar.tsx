"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IoMenu } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { FaImage } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { RiPencilRulerFill } from "react-icons/ri";
import { IoIosColorPalette } from "react-icons/io";
import { FaTshirt } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { MdOutlineSettings } from "react-icons/md";
import { LogoutButton } from "@/components/auth/logout-button";
import { CiLogout } from "react-icons/ci";
import { FaHouse } from "react-icons/fa6";
import { useState } from "react";
import { ExitModal } from "@/modals/exit-modal";
import { logout } from "@/actions/logout";
import { toast } from "sonner";

export const MobileNavbar = () => {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const isConfigActive = pathname === `/${params.storeId}/settings`;
  const isUsersActive = pathname === `/dashboard/${params.storeId}/users`;
  const isOrdersActive = pathname === `/dashboard/${params.storeId}/orders`;

  const onClick = () => {
    startTransition(() => {
      logout().catch((error) => {
        console.log(error);
        toast.error("Ocorreu um erro ao tentar sair");
      });
    });
  };

  const routes = [
    {
      href: `/dashboard/${params.storeId}/billboards`,
      label: "Banners",
      active: pathname === `/dashboard/${params.storeId}/billboards`,
      icon: <FaImage />,
    },
    {
      href: `/dashboard/${params.storeId}/categories`,
      label: "Categorias",
      active: pathname === `/dashboard/${params.storeId}/categories`,
      icon: <BiSolidCategory />,
    },
    {
      href: `/dashboard/${params.storeId}/sizes`,
      label: "Tamanhos",
      active: pathname === `/dashboard/${params.storeId}/sizes`,
      icon: <RiPencilRulerFill />,
    },
    {
      href: `/dashboard/${params.storeId}/colors`,
      label: "Cores",
      active: pathname === `/dashboard/${params.storeId}/colors`,
      icon: <IoIosColorPalette />,
    },
    {
      href: `/dashboard/${params.storeId}/products`,
      label: "Produtos",
      active: pathname === `/dashboard/${params.storeId}/products`,
      icon: <FaTshirt />,
    },
  ];

  const handleLinkClick = () => {
    setSheetOpen(false);
  };

  return (
    <div>
      <ExitModal exited={isPending} />
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger onClick={() => setSheetOpen(true)}>
          <IoMenu className="text-4xl" />
        </SheetTrigger>
        <SheetContent className="overflow-auto w-64">
          <div className="flex h-[600px] flex-col justify-evenly">
            <div>
              <Link href={`/dashboard/${params.storeId}`}>
                <div
                  onClick={handleLinkClick}
                  className="flex items-center justify-between font-medium text-muted-foreground transition-colors hover:text-fuchsia-500">
                  <p>Início</p>
                  <div>
                    <FaHouse />
                  </div>
                </div>
              </Link>
            </div>
            <nav className="flex flex-col gap-y-4">
              {routes.map((route) => (
                <Link key={route.href} href={route.href}>
                  <div
                    onClick={handleLinkClick}
                    key={route.href}
                    className={cn(
                      "flex items-center justify-between border-b border-slate-300 py-2 font-medium transition-colors hover:text-fuchsia-500",
                      route.active
                        ? "text-fuchsia-500 dark:text-white"
                        : "text-muted-foreground"
                    )}>
                    <p>{route.label}</p>
                    <div className="text-lg">{route.icon}</div>
                  </div>
                </Link>
              ))}
            </nav>
            <div className="space-y-5">
              <div>
                <Link href={`/dashboard/${params.storeId}/users`}>
                  <div
                    onClick={handleLinkClick}
                    className={cn(
                      isUsersActive
                        ? "text-fuchsia-500"
                        : "text-muted-foreground",
                      "flex items-center justify-between font-medium transition-colors hover:text-fuchsia-500"
                    )}>
                    <p>Usuários</p>
                    <FaUser />
                  </div>
                </Link>
              </div>

              <div>
                <Link href={`/dashboard/${params.storeId}/orders`}>
                  <div
                    onClick={handleLinkClick}
                    className={cn(
                      isOrdersActive
                        ? "text-fuchsia-500"
                        : "text-muted-foreground",
                      "flex items-center justify-between font-medium transition-colors hover:text-fuchsia-500"
                    )}>
                    <p>Pedidos</p>
                    <FiPackage />
                  </div>
                </Link>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <Link href={`/dashboard/${params.storeId}/settings`}>
                  <div
                    onClick={handleLinkClick}
                    className={cn(
                      isConfigActive
                        ? "text-fuchsia-500"
                        : "text-muted-foreground",
                      "flex items-center justify-between font-medium transition-colors hover:text-fuchsia-500"
                    )}>
                    <p>Configurações</p>
                    <MdOutlineSettings className="text-xl" />
                  </div>
                </Link>
              </div>
              <div>
                <div
                  onClick={onClick}
                  className="flex items-center justify-between text-muted-foreground font-medium cursor-pointer transition-colors hover:text-fuchsia-500 hover:bg-fuchsia-100">
                  <p>Sair</p>
                  <CiLogout className="text-xl" />
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
