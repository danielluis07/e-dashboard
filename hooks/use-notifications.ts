import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Notification = {
  id: string;
  message: string;
  reviewId?: string;
  orderId?: string;
  orderNumber?: number;
  productName?: string;
  createdAt: Date;
  type: "review" | "order";
};

interface NotificationsStore {
  items: Notification[];
  addItem: (data: Notification) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

export const useNotifications = create(
  persist<NotificationsStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Notification) => {
        set({ items: [...get().items, data] });
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
