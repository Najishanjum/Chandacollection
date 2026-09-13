"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import type {
  Member,
  ChandaRecord,
  Payment,
  Receipt,
  MemberWithStatus,
  PaymentWithDetails,
  DashboardMetrics,
  MonthlyOverview,
  AnnualReport,
  ChandaRecordWithMember,
} from "@/types/database";
import type { PaymentStatus, PaymentMethod } from "@/lib/calculations";
import {
  demoMembers as initialDemoMembers,
  demoChandaRecords as initialDemoRecords,
  demoPayments as initialDemoPayments,
  demoReceipts as initialDemoReceipts,
  demoOrg,
  demoUser,
} from "@/lib/demo-data";
import { getPaymentStatus, getCollectionRate } from "@/lib/calculations";

export interface FullReceiptData {
  receiptNumber: string;
  paymentId: string;
  donorName: string;
  donorPhone: string;
  donorArea: string;
  donorCity: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  month: number;
  year: number;
  monthlyPledge: number;
  masjidName: string;
  masjidAddress: string;
  recordedBy: string;
}

interface NewMemberInput {
  name: string;
  phone: string;
  city?: string;
  area?: string;
  address?: string;
  monthly_amount: number;
  start_month?: number;
  start_year?: number;
}

interface NewPaymentInput {
  member_id: string;
  amount: number;
  payment_method: PaymentMethod;
  month: number;
  year: number;
  payment_date?: string;
}

interface ChandaStoreContextType {
  members: Member[];
  chandaRecords: ChandaRecord[];
  payments: Payment[];
  receipts: Receipt[];
  addMember: (input: NewMemberInput) => Member;
  recordPayment: (input: NewPaymentInput) => { payment: Payment; receipt: Receipt };
  getMembersWithStatus: (month?: number, year?: number) => MemberWithStatus[];
  getMemberById: (id: string) => Member | undefined;
  getPersonRecords: (memberId: string) => ChandaRecord[];
  getPersonPayments: (memberId: string) => Payment[];
  getPaymentsWithDetails: () => PaymentWithDetails[];
  getFullReceipts: () => FullReceiptData[];
  getFullReceiptById: (receiptNumber: string) => FullReceiptData | undefined;
  getDashboardMetrics: (month?: number, year?: number) => DashboardMetrics;
  getMonthlyOverview: (month?: number, year?: number) => MonthlyOverview;
  getAnnualReport: (year?: number) => AnnualReport;
  org: typeof demoOrg;
}

const ChandaStoreContext = createContext<ChandaStoreContextType | null>(null);

const STORAGE_MEMBERS_KEY = "chanda_custom_members_v1";
const STORAGE_RECORDS_KEY = "chanda_custom_records_v1";
const STORAGE_PAYMENTS_KEY = "chanda_custom_payments_v1";
const STORAGE_RECEIPTS_KEY = "chanda_custom_receipts_v1";

export function ChandaProvider({ children }: { children: React.ReactNode }) {
  const [customMembers, setCustomMembers] = useState<Member[]>([]);
  const [customRecords, setCustomRecords] = useState<ChandaRecord[]>([]);
  const [customPayments, setCustomPayments] = useState<Payment[]>([]);
  const [customReceipts, setCustomReceipts] = useState<Receipt[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedMembers = localStorage.getItem(STORAGE_MEMBERS_KEY);
      const storedRecords = localStorage.getItem(STORAGE_RECORDS_KEY);
      const storedPayments = localStorage.getItem(STORAGE_PAYMENTS_KEY);
      const storedReceipts = localStorage.getItem(STORAGE_RECEIPTS_KEY);

      if (storedMembers) setCustomMembers(JSON.parse(storedMembers));
      if (storedRecords) setCustomRecords(JSON.parse(storedRecords));
      if (storedPayments) setCustomPayments(JSON.parse(storedPayments));
      if (storedReceipts) setCustomReceipts(JSON.parse(storedReceipts));
    } catch (e) {
      console.error("Error loading chanda local storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage whenever custom data changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_MEMBERS_KEY, JSON.stringify(customMembers));
      localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(customRecords));
      localStorage.setItem(STORAGE_PAYMENTS_KEY, JSON.stringify(customPayments));
      localStorage.setItem(STORAGE_RECEIPTS_KEY, JSON.stringify(customReceipts));
    } catch (e) {
      console.error("Error saving chanda local storage", e);
    }
  }, [customMembers, customRecords, customPayments, customReceipts, isLoaded]);

  // Combined lists
  const members = useMemo(() => [...customMembers, ...initialDemoMembers], [customMembers]);
  const chandaRecords = useMemo(() => [...customRecords, ...initialDemoRecords], [customRecords]);
  const payments = useMemo(() => [...customPayments, ...initialDemoPayments], [customPayments]);
  const receipts = useMemo(() => [...customReceipts, ...initialDemoReceipts], [customReceipts]);

  // Add new Member
  const addMember = (input: NewMemberInput): Member => {
    const newId = `member-${Date.now()}`;
    const startMonth = input.start_month || 1;
    const startYear = input.start_year || 2026;

    const newMember: Member = {
      id: newId,
      organization_id: "org-001",
      name: input.name.trim(),
      phone: input.phone.trim(),
      city: input.city?.trim() || "Muzaffarpur",
      area: input.area?.trim() || null,
      monthly_amount: Number(input.monthly_amount),
      start_month: startMonth,
      start_year: startYear,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Generate records for all 12 months of 2026
    const newRecordsForMember: ChandaRecord[] = [];
    for (let m = 1; m <= 12; m++) {
      newRecordsForMember.push({
        id: `rec-${newId}-${m}`,
        organization_id: "org-001",
        member_id: newId,
        month: m,
        year: startYear,
        expected_amount: Number(input.monthly_amount),
        paid_amount: 0,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    setCustomMembers((prev) => [newMember, ...prev]);
    setCustomRecords((prev) => [...newRecordsForMember, ...prev]);

    return newMember;
  };

  // Record Payment
  const recordPayment = (input: NewPaymentInput) => {
    const member = members.find((m) => m.id === input.member_id);
    const existingRec = chandaRecords.find(
      (r) => r.member_id === input.member_id && r.month === input.month && r.year === input.year
    );

    const paymentId = `pay-${Date.now()}`;
    const receiptNum = `QJM-${String(payments.length + 1).padStart(6, "0")}`;
    const todayStr = input.payment_date || new Date().toISOString().split("T")[0];

    const newPayment: Payment = {
      id: paymentId,
      organization_id: "org-001",
      member_id: input.member_id,
      chanda_record_id: existingRec ? existingRec.id : `rec-${input.member_id}-${input.month}`,
      amount: Number(input.amount),
      payment_method: input.payment_method,
      payment_date: todayStr,
      receipt_number: receiptNum,
      recorded_by: demoUser.id,
      status: "success",
      cancellation_reason: null,
      cancelled_by: null,
      cancelled_at: null,
      created_at: new Date().toISOString(),
    };

    const newReceipt: Receipt = {
      id: `receipt-${paymentId}`,
      organization_id: "org-001",
      payment_id: paymentId,
      receipt_number: receiptNum,
      pdf_url: null,
      created_at: new Date().toISOString(),
    };

    // Update or create chanda record
    if (existingRec) {
      const updatedPaid = existingRec.paid_amount + Number(input.amount);
      const newStatus = getPaymentStatus(existingRec.expected_amount, updatedPaid);

      setCustomRecords((prev) => {
        const filtered = prev.filter((r) => r.id !== existingRec.id);
        return [
          {
            ...existingRec,
            paid_amount: updatedPaid,
            status: newStatus,
            updated_at: new Date().toISOString(),
          },
          ...filtered,
        ];
      });
    }

    setCustomPayments((prev) => [newPayment, ...prev]);
    setCustomReceipts((prev) => [newReceipt, ...prev]);

    return { payment: newPayment, receipt: newReceipt };
  };

  // Helper queries
  const getMembersWithStatus = (month: number = 9, year: number = 2026): MemberWithStatus[] => {
    return members.map((member) => {
      const monthRecord = chandaRecords.find(
        (r) => r.member_id === member.id && r.month === month && r.year === year
      );

      const allRecords = chandaRecords.filter(
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
  };

  const getMemberById = (id: string) => members.find((m) => m.id === id);

  const getPersonRecords = (memberId: string) => {
    return chandaRecords
      .filter((r) => r.member_id === memberId)
      .sort((a, b) => a.month - b.month);
  };

  const getPersonPayments = (memberId: string) => {
    return payments
      .filter((p) => p.member_id === memberId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const getPaymentsWithDetails = (): PaymentWithDetails[] => {
    return payments.map((p) => {
      const member = members.find((m) => m.id === p.member_id) || {
        name: "Unknown Member",
        phone: "—",
      };
      const record = chandaRecords.find((r) => r.id === p.chanda_record_id);

      return {
        ...p,
        member_name: member.name,
        member_phone: member.phone,
        month: record?.month || 9,
        year: record?.year || 2026,
        recorded_by_name: demoUser.name,
      };
    });
  };

  const getFullReceipts = (): FullReceiptData[] => {
    return payments.map((p) => {
      const member = members.find((m) => m.id === p.member_id);
      const record = chandaRecords.find((r) => r.id === p.chanda_record_id);

      return {
        receiptNumber: p.receipt_number,
        paymentId: p.id,
        donorName: member?.name || "Member",
        donorPhone: member?.phone || "",
        donorArea: member?.area || "",
        donorCity: member?.city || demoOrg.city,
        amount: p.amount,
        paymentMethod: p.payment_method,
        paymentDate: p.payment_date,
        month: record?.month || 9,
        year: record?.year || 2026,
        monthlyPledge: member?.monthly_amount || p.amount,
        masjidName: demoOrg.name,
        masjidAddress: demoOrg.address || `${demoOrg.city}, ${demoOrg.state}`,
        recordedBy: demoUser.name,
      };
    });
  };

  const getFullReceiptById = (receiptNumber: string): FullReceiptData | undefined => {
    return getFullReceipts().find(
      (r) => r.receiptNumber.toLowerCase() === receiptNumber.toLowerCase()
    );
  };

  const getDashboardMetrics = (month: number = 9, year: number = 2026): DashboardMetrics => {
    const monthRecords = chandaRecords.filter(
      (r) => r.month === month && r.year === year
    );

    const totalPeople = members.filter((m) => m.status === "active").length;
    const expectedThisMonth = monthRecords.reduce((sum, r) => sum + r.expected_amount, 0);
    const collectedThisMonth = monthRecords.reduce((sum, r) => sum + r.paid_amount, 0);
    const pendingThisMonth = Math.max(0, expectedThisMonth - collectedThisMonth);
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
  };

  const getMonthlyOverview = (month: number = 9, year: number = 2026): MonthlyOverview => {
    const records = chandaRecords.filter(
      (r) => r.month === month && r.year === year
    );

    const totalExpected = records.reduce((sum, r) => sum + r.expected_amount, 0);
    const totalCollected = records.reduce((sum, r) => sum + r.paid_amount, 0);
    const totalPending = Math.max(0, totalExpected - totalCollected);

    const recordsWithMember: ChandaRecordWithMember[] = records.map((r) => ({
      ...r,
      member: members.find((m) => m.id === r.member_id) || initialDemoMembers[0],
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
  };

  const getAnnualReport = (year: number = 2026): AnnualReport => {
    const yearRecords = chandaRecords.filter((r) => r.year === year);
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
  };

  return (
    <ChandaStoreContext.Provider
      value={{
        members,
        chandaRecords,
        payments,
        receipts,
        addMember,
        recordPayment,
        getMembersWithStatus,
        getMemberById,
        getPersonRecords,
        getPersonPayments,
        getPaymentsWithDetails,
        getFullReceipts,
        getFullReceiptById,
        getDashboardMetrics,
        getMonthlyOverview,
        getAnnualReport,
        org: demoOrg,
      }}
    >
      {children}
    </ChandaStoreContext.Provider>
  );
}

export function useChandaStore() {
  const context = useContext(ChandaStoreContext);
  if (!context) {
    throw new Error("useChandaStore must be used within a ChandaProvider");
  }
  return context;
}
