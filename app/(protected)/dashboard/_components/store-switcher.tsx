"use client";

import { Store } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaCheck, FaChevronDown, FaPlusCircle, FaStore } from "react-icons/fa";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
  isOpen?: boolean;
}

export const StoreSwitcher = ({ items = [], isOpen }: StoreSwitcherProps) => {
  const [open, setOpen] = useState(false);
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  );

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/dashboard/${store.value}`);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Selecione uma loja"
          className={cn(
            "justify-between hover:text-fuchsia-500 group",
            isOpen ? "w-min" : "w-[200px]"
          )}>
          <FaStore className="mr-2 size-4 group-hover:text-fuchsia-500" />
          <div className={cn(isOpen && "hidden")}>{currentStore?.label}</div>
          <FaChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Procurar loja..." />
            <CommandEmpty>Nenhuma loja encontrada</CommandEmpty>
            <CommandGroup heading="Lojas">
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm hover:text-fuchsia-500 group cursor-pointer">
                  <FaStore className="mr-2 size-4 group-hover:text-fuchsia-500" />
                  <p className="group-hover:text-fuchsia-500">{store.label}</p>
                  <FaCheck
                    className={cn(
                      "ml-auto size-4 group-hover:text-fuchsia-500",
                      currentStore?.value === store.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup className="group">
              <CommandItem
                className="group-hover:text-fuchsia-500 cursor-pointer"
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}>
                <FaPlusCircle className="mr-2 size-5 group-hover:text-fuchsia-500 cursor-pointer" />
                Criar Loja
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
