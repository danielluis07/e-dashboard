import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
});

export const formatDate = (date: Date) => {
  return DATE_FORMATTER.format(date);
};

const CURRENCY_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const formatCurrency = (amount: number) => {
  return CURRENCY_FORMATTER.format(amount);
};

export const convertCentsToReal = (cents: number) => {
  if (cents < 0) {
    throw new Error("Amount in cents should not be negative");
  }
  const reais = cents / 100;
  return CURRENCY_FORMATTER.format(reais);
};
