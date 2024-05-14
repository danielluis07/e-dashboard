export type Notification = {
  id: string;
  message: string;
  reviewId?: string;
  orderId?: string;
  userId?: string;
  userName?: string;
  orderNumber?: number;
  productName?: string;
  createdAt: Date;
  type: "review" | "order" | "user";
};
