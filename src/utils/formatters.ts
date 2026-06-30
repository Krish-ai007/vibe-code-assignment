/**
 * Formats a raw count into a compact human-readable string, e.g. 1234567 -> "1.2M".
 * This is the single source of truth for count formatting — previously this logic
 * was duplicated (and slightly inconsistent) across ProfileCard, ProfileDetailPage
 * and formatters.ts.
 */
export function formatCount(count: number | undefined): string {
  if (count === undefined || Number.isNaN(count)) return "—";
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + "M";
  if (count >= 1_000) return (count / 1_000).toFixed(1) + "K";
  return count.toLocaleString();
}

/** @deprecated use formatCount */
export const formatFollowers = formatCount;

/**
 * Formats an engagement rate that is stored as a fraction (e.g. 0.0125 -> "1.25%").
 * Bug fix: the original ProfileDetailPage multiplied by 10,000 in one place and
 * formatters.ts multiplied by 100 in another, producing two different displayed
 * values for the exact same field. This is now the only implementation.
 */
export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined || Number.isNaN(rate)) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}
