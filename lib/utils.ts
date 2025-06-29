import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a two-letter initial string based on the provided username.
 *
 * - If the username contains one or more spaces, take the first character of
 *   the first word and the first character of the second word.
 * - Otherwise, take the first two characters of the username.
 *
 * All returned letters are uppercase. If the username is shorter than two
 * characters, return whatever is available (uppercased).
 *
 * @param username - The Google username string (e.g. "john.doe", "john doe", "alice").
 * @returns A string of up to two uppercase letters, e.g. "JD", "AL", "J".
 */
export function getUsernameInitials(username: string): string {
  // Trim leading/trailing whitespace
  const trimmed = username.trim();

  if (trimmed.length === 0) {
    return "";
  }

  // Split on one or more whitespace characters
  const parts = trimmed.split(/\s+/);

  if (parts.length >= 2) {
    // Take first letter of first two words
    const firstInitial = parts[0].charAt(0);
    const secondInitial = parts[1].charAt(0);

    return (firstInitial + secondInitial).toUpperCase();
  }

  // If no spaces (or only one word), take the first two characters
  const firstTwo = trimmed.slice(0, 2);

  return firstTwo.toUpperCase();
}

/**
 * Formats a Unix timestamp (ms) into "HH:mm · dd/MM/yy",
 * e.g. "14:35 · 29/06/25"
 */
export const formatTimestamp = (timestamp: number): string =>
  format(timestamp, "HH:mm · dd/MM/yy");
