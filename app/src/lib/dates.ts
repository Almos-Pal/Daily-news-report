const STALE_AFTER_MS = 8 * 24 * 60 * 60 * 1000;

export function formatWeekRange(weekStart: string, weekEnd: string): string {
  const start = new Date(`${weekStart}T00:00:00`);
  const end = new Date(`${weekEnd}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return `${weekStart} – ${weekEnd}`;
  }
  const monthDay = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  });
  const year = end.getFullYear();
  return `${monthDay.format(start)} – ${monthDay.format(end)} ${year}`;
}

export function isStale(fetchedAt: number, now = Date.now()): boolean {
  return now - fetchedAt > STALE_AFTER_MS;
}
