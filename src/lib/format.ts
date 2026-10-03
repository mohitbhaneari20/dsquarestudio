const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

/** '2026-09-28' → '28 Sept 2026' */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00`));
}

/** 3 → '03' */
export function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** '2026-10-02' → '02.10.26' */
export function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y?.slice(2)}`;
}
