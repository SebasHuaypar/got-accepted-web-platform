/**
 * Utility functions — shared across the application.
 */

/**
 * Returns true if the given ISO deadline string is in the past.
 */
export function isExpired(deadline: string): boolean {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  // Compare at day granularity — strip time portion
  today.setHours(0, 0, 0, 0);
  return deadlineDate < today;
}

/**
 * Formats an ISO date string (e.g. "2026-10-12") to a human-readable string
 * like "October 12, 2026".
 */
export function formatDeadline(deadline: string): string {
  const date = new Date(deadline + "T00:00:00"); // Force local time, not UTC
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Simple class name merger — joins defined, non-empty class strings.
 * Lightweight alternative to clsx for this project's needs.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
