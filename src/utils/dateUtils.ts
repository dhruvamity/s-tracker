/**
 * Date and Time utilities with Indian Standard Time (IST - UTC+5:30) accuracy
 */

export function getISTDate(timestamp?: number | Date): Date {
  const d = timestamp instanceof Date ? timestamp : new Date(timestamp ?? Date.now());
  // Adjust for UTC+5:30 offset in minutes (330 minutes)
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc + 330 * 60000);
}

export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function formatTimeAMPM(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'pm' : 'am';
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  const displayMin = m ? `:${String(m).padStart(2, '0')}` : '';
  return `${displayHour}${displayMin}${period}`;
}

export function formatTimeRange(start: string, end: string): string {
  return `${formatTimeAMPM(start)} – ${formatTimeAMPM(end)}`;
}

export function formatFriendlyDate(d: Date, options?: Intl.DateTimeFormatOptions): string {
  return d.toLocaleDateString('en-GB', options || {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}
