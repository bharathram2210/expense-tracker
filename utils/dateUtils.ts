
import {
  startOfDay,
  endOfDay,
  subDays,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths
} from 'date-fns';

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return isWithinInterval(date, { start: startOfDay(today), end: endOfDay(today) });
};

export const isYesterday = (date: Date): boolean => {
  const yesterday = subDays(new Date(), 1);
  return isWithinInterval(date, { start: startOfDay(yesterday), end: endOfDay(yesterday) });
};

export const isThisWeek = (date: Date): boolean => {
  const today = new Date();
  return isWithinInterval(date, { start: startOfWeek(today), end: endOfWeek(today) });
};

export const isLastWeek = (date: Date): boolean => {
  const today = new Date();
  const startOfLastWeek = startOfWeek(subWeeks(today, 1));
  const endOfLastWeek = endOfWeek(subWeeks(today, 1));
  return isWithinInterval(date, { start: startOfLastWeek, end: endOfLastWeek });
};

export const isThisMonth = (date: Date): boolean => {
  const today = new Date();
  return isWithinInterval(date, { start: startOfMonth(today), end: endOfMonth(today) });
};

export const isLastMonth = (date: Date): boolean => {
  const today = new Date();
  const startOfLastMonth = startOfMonth(subMonths(today, 1));
  const endOfLastMonth = endOfMonth(subMonths(today, 1));
  return isWithinInterval(date, { start: startOfLastMonth, end: endOfLastMonth });
};
