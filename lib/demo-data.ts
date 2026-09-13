/**
 * Demo data for CHANDA application
 * Used when Supabase is not connected
 */

import type {
  Organization,
  Member,
  ChandaRecord,
  Payment,
  Receipt,
  User,
  DashboardMetrics,
  MemberWithStatus,
  PaymentWithDetails,
  MonthlyOverview,
  AnnualReport,
  ChandaRecordWithMember,
} from "@/types/database";
import { getPaymentStatus, getRemainingAmount, getCollectionRate } from "@/lib/calculations";
import { getMonthName } from "@/lib/utils";

// ============================================
// ORGANIZATION
// ============================================

export const demoOrg: Organization = {
  id: "org-001",
  name: "Quadri Jama Masjid",
  slug: "quadri-jama-masjid-deoria-muzaffarpur",
  city: "Deoria, Muzaffarpur",
  state: "Bihar",
  address: "Deoria Baradih, Muzaffarpur",
  logo_url: null,
  receipt_prefix: "QJM",
  receipt_counter: 124,
  footer_message: "Thank you for your contribution.",
  is_public: true,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-09-01T00:00:00Z",
};

// ============================================
// USER
// ============================================

export const demoUser: User = {
  id: "user-001",
  organization_id: "org-001",
  auth_user_id: "auth-001",
  name: "Noorain Alam",
  phone: "7631296157",
  email: "noorain@quadrimasjid.org",
  role: "admin",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-09-01T00:00:00Z",
};

// ============================================
// MEMBERS (50 sample members)
// ============================================

const firstNames = [
  "Mohammad", "Ahmed", "Abdul", "Salman", "Arif", "Imran", "Farhan",
  "Irfan", "Nadeem", "Rashid", "Zaheer", "Kamran", "Faisal", "Aamir",
  "Tariq", "Waseem", "Shakeel", "Noman", "Rehan", "Sajid", "Mansoor",
  "Rizwan", "Javed", "Bilal", "Hassan",
];

const lastNames = [
  "Khan", "Ali", "Ahmed", "Hussain", "Sheikh", "Siddiqui", "Ansari",
  "Qureshi", "Patel", "Malik", "Rizvi", "Hashmi", "Abbasi", "Farooqui",
  "Usmani", "Naqvi", "Zaidi", "Baig", "Mirza", "Jafri", "Hasan",
  "Akhtar", "Rahman", "Aziz", "Raza",
];

const areas = [
  "Deoria Baradih", "Deoria", "Baradih", "Quadri Chowk",
  "Civil Lines", "Shakti Nagar", "Vijay Nagar", "Muzaffarpur",
];

const amounts = [200, 300, 500, 500, 500, 500, 500, 750, 1000, 1000, 1500, 2000, 2500, 5000];

function generateMembers(count: number): Member[] {
  const members: Member[] = [];
  // First prominent member: Md Najish
  members.push({
    id: "member-001",
    organization_id: "org-001",
    name: "Md Najish",
    phone: "7631296157",
    city: "Muzaffarpur",
    area: "Deoria Baradih",
    monthly_amount: 1000,
    start_month: 1,
    start_year: 2026,
    status: "active",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  });

  for (let i = 1; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    members.push({
      id: `member-${String(i + 1).padStart(3, "0")}`,
      organization_id: "org-001",
      name: `${firstName} ${lastName}`,
      phone: `9${String(800000000 + i * 1111).padStart(9, "0")}`,
      city: "Muzaffarpur",
      area: areas[i % areas.length],
      monthly_amount: amounts[i % amounts.length],
      start_month: 1,
      start_year: 2026,
      status: "active",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-09-01T00:00:00Z",
    });
  }
  return members;
}

export const demoMembers: Member[] = generateMembers(50);

// ============================================
// CHANDA RECORDS (Jan–Sep 2026)
// ============================================

function generateChandaRecords(): ChandaRecord[] {
  const records: ChandaRecord[] = [];
  const currentMonth = 9; // September

  for (const member of demoMembers) {
    for (let month = 1; month <= currentMonth; month++) {
      // Simulate realistic payment patterns
      let paidAmount = 0;
      const rand = Math.random();

      if (month < currentMonth) {
        // Past months: most are paid
        if (rand < 0.82) {
          paidAmount = member.monthly_amount;
        } else if (rand < 0.92) {
          paidAmount = Math.round(member.monthly_amount * 0.5);
        } else {
          paidAmount = 0;
        }
      } else {
        // Current month (September)
        if (rand < 0.67) {
          paidAmount = member.monthly_amount;
        } else if (rand < 0.81) {
          paidAmount = Math.round(member.monthly_amount * 0.6);
        } else {
          paidAmount = 0;
        }
      }

      const status = getPaymentStatus(member.monthly_amount, paidAmount);
      records.push({
        id: `cr-${member.id}-${month}-2026`,
        organization_id: "org-001",
        member_id: member.id,
        month,
        year: 2026,
        expected_amount: member.monthly_amount,
        paid_amount: paidAmount,
        status,
        created_at: `2026-${String(month).padStart(2, "0")}-01T00:00:00Z`,
        updated_at: `2026-${String(month).padStart(2, "0")}-15T00:00:00Z`,
      });
    }
  }

  return records;
}

export const demoChandaRecords: ChandaRecord[] = generateChandaRecords();

// ============================================
// PAYMENTS
// ============================================

function generatePayments(): Payment[] {
  const payments: Payment[] = [];
  const methods: Array<"cash" | "upi" | "bank"> = ["cash", "upi", "bank"];
  let counter = 1;

  for (const record of demoChandaRecords) {
    if (record.paid_amount > 0) {
      payments.push({
        id: `pay-${String(counter).padStart(6, "0")}`,
        organization_id: "org-001",
        member_id: record.member_id,
        chanda_record_id: record.id,
        amount: record.paid_amount,
        payment_method: methods[counter % 3],
        payment_date: `2026-${String(record.month).padStart(2, "0")}-${String(5 + (counter % 20)).padStart(2, "0")}`,
        receipt_number: `QJM-${String(counter).padStart(6, "0")}`,
        recorded_by: "user-001",
        status: "success",
        cancellation_reason: null,
        cancelled_by: null,
        cancelled_at: null,
        created_at: `2026-${String(record.month).padStart(2, "0")}-${String(5 + (counter % 20)).padStart(2, "0")}T10:00:00Z`,
      });
      counter++;
    }
  }

  return payments;
}

export const demoPayments: Payment[] = generatePayments();

// ============================================
// RECEIPTS
// ============================================

export const demoReceipts: Receipt[] = demoPayments.map((p) => ({
  id: `receipt-${p.id}`,
  organization_id: "org-001",
  payment_id: p.id,
  receipt_number: p.receipt_number,
  pdf_url: null,
  created_at: p.created_at,
}));

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getDemoMetrics(month: number = 9, year: number = 2026): DashboardMetrics {
  const monthRecords = demoChandaRecords.filter(
    (r) => r.month === month && r.year === year
  );

  const totalPeople = demoMembers.filter((m) => m.status === "active").length;
  const expectedThisMonth = monthRecords.reduce((sum, r) => sum + r.expected_amount, 0);
  const collectedThisMonth = monthRecords.reduce((sum, r) => sum + r.paid_amount, 0);
  const pendingThisMonth = expectedThisMonth - collectedThisMonth;
  const collectionRate = getCollectionRate(expectedThisMonth, collectedThisMonth);

  const paidCount = monthRecords.filter((r) => r.status === "paid").length;
  const partialCount = monthRecords.filter((r) => r.status === "partial").length;
  const pendingCount = monthRecords.filter((r) => r.status === "pending").length;

  return {
    totalPeople,
    expectedThisMonth,
    collectedThisMonth,
    pendingThisMonth,
    collectionRate,
    paidCount,
    partialCount,
    pendingCount,
  };
}

export function getDemoMembersWithStatus(
  month: number = 9,
  year: number = 2026
): MemberWithStatus[] {
  return demoMembers.map((member) => {
    const monthRecord = demoChandaRecords.find(
      (r) => r.member_id === member.id && r.month === month && r.year === year
    );

    const allRecords = demoChandaRecords.filter(
      (r) => r.member_id === member.id && r.year === year
    );

    const totalPaid = allRecords.reduce((sum, r) => sum + r.paid_amount, 0);
    const totalExpected = allRecords.reduce((sum, r) => sum + r.expected_amount, 0);

    return {
      ...member,
      current_month_status: monthRecord?.status ?? "pending",
      current_month_paid: monthRecord?.paid_amount ?? 0,
      total_paid: totalPaid,
      total_pending: Math.max(0, totalExpected - totalPaid),
    };
  });
}

export function getDemoMonthlyOverview(
  month: number = 9,
  year: number = 2026
): MonthlyOverview {
  const records = demoChandaRecords.filter(
    (r) => r.month === month && r.year === year
  );

  const totalExpected = records.reduce((sum, r) => sum + r.expected_amount, 0);
  const totalCollected = records.reduce((sum, r) => sum + r.paid_amount, 0);
  const totalPending = Math.max(0, totalExpected - totalCollected);

  const recordsWithMember: ChandaRecordWithMember[] = records.map((r) => ({
    ...r,
    member: demoMembers.find((m) => m.id === r.member_id)!,
  }));

  return {
    month,
    year,
    totalExpected,
    totalCollected,
    totalPending,
    collectionRate: getCollectionRate(totalExpected, totalCollected),
    paidCount: records.filter((r) => r.status === "paid").length,
    partialCount: records.filter((r) => r.status === "partial").length,
    pendingCount: records.filter((r) => r.status === "pending").length,
    records: recordsWithMember,
  };
}

export function getDemoAnnualReport(year: number = 2026): AnnualReport {
  const yearRecords = demoChandaRecords.filter((r) => r.year === year);
  const totalExpected = yearRecords.reduce((sum, r) => sum + r.expected_amount, 0);
  const totalCollected = yearRecords.reduce((sum, r) => sum + r.paid_amount, 0);

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const monthRecords = yearRecords.filter((r) => r.month === m);
    const expected = monthRecords.reduce((sum, r) => sum + r.expected_amount, 0);
    const collected = monthRecords.reduce((sum, r) => sum + r.paid_amount, 0);

    return {
      month: m,
      expected,
      collected,
      pending: Math.max(0, expected - collected),
      paidCount: monthRecords.filter((r) => r.status === "paid").length,
      partialCount: monthRecords.filter((r) => r.status === "partial").length,
      pendingCount: monthRecords.filter((r) => r.status === "pending").length,
    };
  });

  return {
    year,
    totalExpected,
    totalCollected,
    totalPending: Math.max(0, totalExpected - totalCollected),
    monthlyData,
  };
}

export function getDemoPaymentsWithDetails(): PaymentWithDetails[] {
  return demoPayments.slice(0, 50).map((payment) => {
    const member = demoMembers.find((m) => m.id === payment.member_id)!;
    const record = demoChandaRecords.find((r) => r.id === payment.chanda_record_id)!;

    return {
      ...payment,
      member_name: member.name,
      member_phone: member.phone,
      month: record.month,
      year: record.year,
      recorded_by_name: demoUser.name,
    };
  });
}

export function getDemoPersonRecords(memberId: string): ChandaRecord[] {
  return demoChandaRecords
    .filter((r) => r.member_id === memberId)
    .sort((a, b) => a.month - b.month);
}

export function getDemoPersonPayments(memberId: string): Payment[] {
  return demoPayments
    .filter((p) => p.member_id === memberId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
