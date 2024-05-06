"use client";

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
import { CiLogout } from "react-icons/ci";
import { FaHouse } from "react-icons/fa6";
import { BiSolidMessageDetail } from "react-icons/bi";
import { logout } from "@/actions/logout";
import { toast } from "sonner";
import { ExitModal } from "@/modals/exit-modal";

interface MainNavProps {
  isOpen: boolean;
}

export const MainNav = ({ isOpen }: MainNavProps) => {
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const isConfigActive = pathname === `/${params.storeId}/settings`;

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
    {
      href: `/dashboard/${params.storeId}/reviews`,
      label: "Avaliações",
      active: pathname === `/dashboard/${params.storeId}/reviews`,
      icon: <BiSolidMessageDetail />,
    },
    {
      href: `/dashboard/${params.storeId}/users`,
      label: "Usuários",
      active: pathname === `/dashboard/${params.storeId}/users`,
      icon: <FaUser />,
    },
    {
      href: `/dashboard/${params.storeId}/orders`,
      label: "Pedidos",
      active: pathname === `/dashboard/${params.storeId}/orders`,
      icon: <FiPackage />,
    },
  ];

  return (
    <div>
      <ExitModal exited={isPending} />
      <div className="flex flex-col justify-between h-full">
        <div>
          <Link href={`/dashboard/${params.storeId}`}>
            <div className="flex items-center justify-between pb-7 pr-3 font-medium text-muted-foreground transition-colors hover:text-fuchsia-500">
              <div className={cn(isOpen && "hidden")}>Início</div>
              <div
                className={cn(
                  isOpen &&
                    "flex p-3 rounded-full bg-gray-200 hover:bg-gray-100"
                )}>
                <FaHouse className="text-xl" />
              </div>
            </div>
          </Link>
        </div>
        <div className="flex flex-col gap-y-4 h-[250px] sl:h-full custom-scrollbar overflow-auto">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}>
              <div
                key={route.href}
                className={cn(
                  "flex items-center justify-between py-2 pr-2 rounded-sm border-b border-slate-300 font-medium transition-colors hover:text-fuchsia-500 hover:bg-fuchsia-100",
                  route.active
                    ? "bg-fuchsia-100 border-b-0 text-fuchsia-500"
                    : "text-muted-foreground",
                  isOpen &&
                    "w-min mx-auto text-xl p-3 rounded-full bg-gray-200 hover:bg-gray-100"
                )}>
                <p className={cn(isOpen && "hidden")}>{route.label}</p>
                <div className="text-lg">{route.icon}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-14">
          <div>
            <Link href={`/dashboard/${params.storeId}/settings`}>
              <div
                className={cn(
                  isConfigActive
                    ? "text-fuchsia-500 bg-fuchsia-100"
                    : "text-muted-foreground",
                  "flex items-center justify-between py-2 pr-2 rounded-sm font-medium transition-colors hover:text-fuchsia-500 hover:bg-fuchsia-100"
                )}>
                <p className={cn(isOpen && "hidden")}>Configurações</p>
                <div
                  className={cn(
                    isOpen &&
                      "w-min mx-auto text-xl rounded-full bg-gray-200 hover:bg-gray-100"
                  )}>
                  <MdOutlineSettings className="text-xl" />
                </div>
              </div>
            </Link>
          </div>
          <div
            onClick={onClick}
            className="flex items-center justify-between py-2 pr-2 cursor-pointer text-muted-foreground font-medium transition-colors hover:text-fuchsia-500 hover:bg-fuchsia-100">
            <p className={cn(isOpen && "hidden")}>Sair</p>
            <div
              className={cn(
                isOpen &&
                  "w-min mx-auto text-xl rounded-full bg-gray-200 hover:bg-gray-100"
              )}>
              <CiLogout className="text-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
