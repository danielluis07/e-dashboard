import { isValid, startOfDay, subDays } from "date-fns";
import { formatDate } from "./utils";

export const RANGE_OPTIONS = {
  last_7_days: {
    label: "Últimos 7 dias",
    startDate: startOfDay(subDays(new Date(), 6)),
    endDate: null,
  },
  last_30_days: {
    label: "Últimos 30 dias",
    startDate: startOfDay(subDays(new Date(), 29)),
    endDate: null,
  },
  last_90_days: {
    label: "Últimos 90 dias",
    startDate: startOfDay(subDays(new Date(), 89)),
    endDate: null,
  },
  last_180_days: {
    label: "Últimos 180 dias",
    startDate: startOfDay(subDays(new Date(), 179)),
    endDate: null,
  },
  last_365_days: {
    label: "Últimos 365 dias",
    startDate: startOfDay(subDays(new Date(), 364)),
    endDate: null,
  },
  all_time: {
    label: "Desde o início",
    startDate: null,
    endDate: null,
  },
};

export const getRangeOption = (range?: string, from?: string, to?: string) => {
  if (range == null) {
    const startDate = new Date(from || "");
    const endDate = new Date(to || "");
    if (!isValid(startDate) || !isValid(endDate)) return;

    return {
      label: `${formatDate(startDate)} - ${formatDate(endDate)}`,
      startDate,
      endDate,
    };
  }
  return RANGE_OPTIONS[range as keyof typeof RANGE_OPTIONS];
};
