import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const convertCentsToReal = (cents: number) => {
  if (cents < 0) {
    throw new Error("Amount in cents should not be negative");
  }
  const reais = cents / 100;
  return formatter.format(reais);
};
