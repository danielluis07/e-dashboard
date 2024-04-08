"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

// se estivermos na página 'root', o modal não fechará enquanto não criarmos uma nova loja

export default function RootPage() {
  // const storeModal = useStoreModal(); não funcionará com useEffect
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  // se o modal estiver fechado, abra-o
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
}
