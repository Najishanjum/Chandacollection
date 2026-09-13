import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number in Indian currency format (₹4,00,000)
 */
export function formatIndianCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

/**
 * Format a number in Indian numbering format (4,00,000)
 */
export function formatIndianNumber(amount: number): string {
  return new Intl.NumberFormat("en-IN").format(amount);
}

/**
 * Generate a receipt number with prefix and zero-padded counter
 * Example: NM-000124
 */
export function generateReceiptNumber(
  prefix: string,
  counter: number
): string {
  return `${prefix}-${String(counter).padStart(6, "0")}`;
}

/**
 * Create a slug from a string
 * Example: "Noor Masjid" → "noor-masjid"
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Mask a phone number for privacy
 * Example: 9876543210 → 98XXXXXX10
 */
export function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  return phone.slice(0, 2) + "X".repeat(phone.length - 4) + phone.slice(-2);
}

/**
 * Get month name from month number (1-indexed)
 */
export function getMonthName(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month - 1] || "";
}

/**
 * Get short month name
 */
export function getMonthShortName(month: number): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[month - 1] || "";
}
