import { format, differenceInCalendarDays, isPast } from 'date-fns';
export function daysUntil(date) {
  return differenceInCalendarDays(date, new Date());
}
export function formatDate(date) {
  if (!date) return '—';
  return format(new Date(date), 'dd MMM yyyy');
}
export function formatShortDate(date) {
  if (!date) return '—';
  return format(new Date(date), 'dd/MM/yyyy');
}
export function formatDateTime(date) {
  if (!date) return '—';
  return format(new Date(date), 'dd MMM yyyy, hh:mm a');
}
export function isOverdue(date) {
  if (!date) return false;
  return isPast(new Date(date));
}
export function weddingCountdown(weddingDate) {
  const days = daysUntil(weddingDate);
  if (days > 0) return { days, label: `${days} days to go` };
  if (days === 0) return { days: 0, label: 'Today is the big day! 🎊' };
  return { days: Math.abs(days), label: `${Math.abs(days)} days since the wedding` };
}
