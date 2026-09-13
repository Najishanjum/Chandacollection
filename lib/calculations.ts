/**
 * Chanda business logic calculation functions
 */

export type PaymentStatus = "paid" | "partial" | "pending" | "cancelled";

export type PaymentMethod = "cash" | "upi" | "bank";

export type UserRole = "admin" | "secretary" | "viewer";

/**
 * Calculate payment status based on expected and paid amounts
 */
export function getPaymentStatus(
  expectedAmount: number,
  paidAmount: number
): PaymentStatus {
  if (paidAmount >= expectedAmount) return "paid";
  if (paidAmount > 0) return "partial";
  return "pending";
}

/**
 * Calculate remaining amount (never below zero)
 */
export function getRemainingAmount(
  expectedAmount: number,
  paidAmount: number
): number {
  return Math.max(0, expectedAmount - paidAmount);
}

/**
 * Calculate overpayment amount
 */
export function getOverpayment(
  expectedAmount: number,
  paidAmount: number
): number {
  return Math.max(0, paidAmount - expectedAmount);
}

/**
 * Calculate collection rate percentage
 */
export function getCollectionRate(
  expectedTotal: number,
  collectedTotal: number
): number {
  if (expectedTotal === 0) return 0;
  return Math.round((collectedTotal / expectedTotal) * 100);
}

/**
 * Calculate status counts from an array of statuses
 */
export function getStatusCounts(statuses: PaymentStatus[]): {
  paid: number;
  partial: number;
  pending: number;
  cancelled: number;
} {
  return statuses.reduce(
    (acc, status) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { paid: 0, partial: 0, pending: 0, cancelled: 0 }
  );
}

/**
 * Get the current month (1-indexed) and year
 */
export function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

/**
 * Get previous month and year
 */
export function getPreviousMonthYear(
  month: number,
  year: number
): { month: number; year: number } {
  if (month === 1) {
    return { month: 12, year: year - 1 };
  }
  return { month: month - 1, year };
}

/**
 * Get next month and year
 */
export function getNextMonthYear(
  month: number,
  year: number
): { month: number; year: number } {
  if (month === 12) {
    return { month: 1, year: year + 1 };
  }
  return { month: month + 1, year };
}

/**
 * Check if a role has permission for an action
 */
export function hasPermission(
  role: UserRole,
  action:
    | "view"
    | "create"
    | "edit"
    | "delete"
    | "manage_users"
    | "view_audit"
    | "export"
    | "import"
): boolean {
  const permissions: Record<UserRole, string[]> = {
    admin: [
      "view",
      "create",
      "edit",
      "delete",
      "manage_users",
      "view_audit",
      "export",
      "import",
    ],
    secretary: ["view", "create", "edit", "export", "import"],
    viewer: ["view"],
  };
  return permissions[role]?.includes(action) ?? false;
}
