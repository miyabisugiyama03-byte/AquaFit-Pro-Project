import { SessionsPerWeek } from '../generated/prisma/enums';

export function calculateBlockWeeks(startDate: Date, endDate: Date): number {
  const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  const diff = endDate.getTime() - startDate.getTime();

  return Math.max(1, Math.ceil(diff / millisecondsPerWeek));
}

export function calculateBlockPriceCents(
  startDate: Date,
  endDate: Date,
  sessionsPerWeek: SessionsPerWeek,
): number {
  const weeks = calculateBlockWeeks(startDate, endDate);

  if (sessionsPerWeek === SessionsPerWeek.TWO) {
    return weeks * 2 * 1300;
  }

  return weeks * 1500;
}

export function formatBlockPrice(
  startDate: Date,
  endDate: Date,
  sessionsPerWeek: SessionsPerWeek,
): string {
  const cents = calculateBlockPriceCents(startDate, endDate, sessionsPerWeek);
  return `€${(cents / 100).toFixed(2)}`;
}
