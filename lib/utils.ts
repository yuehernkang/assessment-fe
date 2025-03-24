import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(date: Date | string) {
  const targetDate = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
  if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  if (diffInSeconds < 2592000) return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  if (diffInSeconds < 31536000) return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
}

export const getRelativeTimeString = (timestamp: number) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const now = Math.floor(Date.now() / 1000)
  const diff = timestamp - now

  if (Math.abs(diff) < 60) return rtf.format(Math.floor(diff), 'seconds')
  if (Math.abs(diff) < 3600) return rtf.format(Math.floor(diff / 60), 'minutes')
  if (Math.abs(diff) < 86400) return rtf.format(Math.floor(diff / 3600), 'hours')
  if (Math.abs(diff) < 2592000) return rtf.format(Math.floor(diff / 86400), 'days')
  if (Math.abs(diff) < 31536000) return rtf.format(Math.floor(diff / 2592000), 'months')
  return rtf.format(Math.floor(diff / 31536000), 'years')
}