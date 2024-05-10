import { formatDate } from "@/lib/utils";
import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfWeek,
  interval,
  max,
  min,
  startOfWeek,
} from "date-fns";

export const getChartDateArray = (
  startDate: Date,
  endDate: Date = new Date()
) => {
  const days = differenceInDays(endDate, startDate);
  if (days < 30) {
    return {
      array: eachDayOfInterval(interval(startDate, endDate)),
      format: formatDate,
    };
  }

  const weeks = differenceInWeeks(endDate, startDate);
  if (weeks < 30) {
    return {
      array: eachWeekOfInterval(interval(startDate, endDate)),
      format: (date: Date) => {
        const start = max([startOfWeek(date), startDate]);
        const end = min([endOfWeek(date), endDate]);

        return `${formatDate(start)} - ${formatDate(end)}`;
      },
    };
  }

  const months = differenceInMonths(endDate, startDate);
  if (months < 30) {
    return {
      array: eachMonthOfInterval(interval(startDate, endDate)),
      format: new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
      }).format,
    };
  }

  return {
    array: eachMonthOfInterval(interval(startDate, endDate)),
    format: new Intl.DateTimeFormat("pt-BR", { year: "numeric" }).format,
  };
};
