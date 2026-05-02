/**
 * Timezone-safe date formatting.
 *
 * `new Date(isoString).toLocaleDateString(...)` uses the *runtime* timezone,
 * which differs between server (UTC) and client (e.g. Africa/Nairobi UTC+3).
 * That causes React hydration mismatches (server renders "15 Mar", client "16 Mar").
 *
 * These helpers always parse the ISO string as UTC and format deterministically,
 * so server and client produce identical output.
 */

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Parse an ISO string and extract the UTC components safely. */
function utcParts(iso: string) {
  const d = new Date(iso);
  // getTimezoneOffset is negative for zones ahead of UTC (e.g. -180 for Nairobi)
  // We shift the date *back* by that offset to get true UTC values
  const offset = d.getTimezoneOffset() * 60_000;
  const utc = new Date(d.getTime() + offset);
  return {
    day: utc.getUTCDate(),
    month: utc.getUTCMonth(),
    year: utc.getUTCFullYear(),
  };
}

/**
 * "15 Mar 2025" — compact deadline format.
 * Uses UTC so server/client always agree.
 */
export function formatDateUTC(iso: string): string {
  const { day, month, year } = utcParts(iso);
  return `${day} ${MONTHS_SHORT[month]} ${year}`;
}

/**
 * "15 Mar" — short form for table cells.
 */
export function formatDateShortUTC(iso: string): string {
  const { day, month } = utcParts(iso);
  return `${day} ${MONTHS_SHORT[month]}`;
}

/**
 * "15 March 2025" — long form for job detail pages.
 */
export function formatDateLongUTC(iso: string): string {
  const { day, month, year } = utcParts(iso);
  return `${day} ${MONTHS_LONG[month]} ${year}`;
}
