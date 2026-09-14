"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
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
  getMemberByPhone: (phone: string) => Member | undefined;
  getPersonRecords: (memberId: string) => ChandaRecord[];
  getPersonPayments: (memberId: string) => Payment[];
  getPaymentsWithDetails: () => PaymentWithDetails[];
  getFullReceipts: () => FullReceiptData[];
  getFullReceiptById: (receiptNumber: string) => FullReceiptData | undefined;
  getDashboardMetrics: (month?: number, year?: number) => DashboardMetrics;
  getMonthlyOverview: (month?: number, year?: number) => MonthlyOverview;
  getAnnualReport: (year?: number) => AnnualReport;
  org: typeof demoOrg;
  isSyncing: boolean;
  refreshData: () => Promise<void>;
}

const ChandaStoreContext = createContext<ChandaStoreContextType | null>(null);

const STORAGE_MEMBERS_KEY = "chanda_all_members_v2";
const STORAGE_RECORDS_KEY = "chanda_all_records_v2";
const STORAGE_PAYMENTS_KEY = "chanda_all_payments_v2";
const STORAGE_RECEIPTS_KEY = "chanda_all_receipts_v2";

export function ChandaProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>(initialDemoMembers);
  const [chandaRecords, setChandaRecords] = useState<ChandaRecord[]>(initialDemoRecords);
  const [payments, setPayments] = useState<Payment[]>(initialDemoPayments);
  const [receipts, setReceipts] = useState<Receipt[]>(initialDemoReceipts);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load cached from LocalStorage on mount for instant rendering
  useEffect(() => {
    try {
      const storedMembers = localStorage.getItem(STORAGE_MEMBERS_KEY);
      const storedRecords = localStorage.getItem(STORAGE_RECORDS_KEY);
      const storedPayments = localStorage.getItem(STORAGE_PAYMENTS_KEY);
      const storedReceipts = localStorage.getItem(STORAGE_RECEIPTS_KEY);

      if (storedMembers) setMembers(JSON.parse(storedMembers));
      if (storedRecords) setChandaRecords(JSON.parse(storedRecords));
      if (storedPayments) setPayments(JSON.parse(storedPayments));
      if (storedReceipts) setReceipts(JSON.parse(storedReceipts));
    } catch (e) {
      console.error("Error loading chanda local storage", e);
    }
  }, []);

  // Sync to local storage for offline fallback
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MEMBERS_KEY, JSON.stringify(members));
      localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(chandaRecords));
      localStorage.setItem(STORAGE_PAYMENTS_KEY, JSON.stringify(payments));
      localStorage.setItem(STORAGE_RECEIPTS_KEY, JSON.stringify(receipts));
    } catch (e) {
      console.warn("Error updating local storage cache", e);
    }
  }, [members, chandaRecords, payments, receipts]);

  // Server sync function
  const refreshData = useCallback(async () => {
    try {
      setIsSyncing(true);

      // Fetch members and records
      const [membersRes, paymentsRes] = await Promise.allSettled([
        fetch("/api/members", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/payments", { cache: "no-store" }).then((r) => r.json()),
      ]);

      if (membersRes.status === "fulfilled" && membersRes.value?.success) {
        const sMembers: Member[] = membersRes.value.members || [];
        const sRecords: ChandaRecord[] = membersRes.value.chandaRecords || [];
        if (sMembers.length > 0) {
          setMembers(sMembers);
        }
        if (sRecords.length > 0) {
          setChandaRecords(sRecords);
        }
      }

      if (paymentsRes.status === "fulfilled" && paymentsRes.value?.success) {
        const sPayments: Payment[] = paymentsRes.value.payments || [];
        const sReceipts: Receipt[] = paymentsRes.value.receipts || [];
        if (sPayments.length > 0) {
          setPayments(sPayments);
        }
        if (sReceipts.length > 0) {
          setReceipts(sReceipts);
        }
      }
    } catch (err) {
      console.error("Error refreshing chanda store from server:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Periodic polling & focus listener to ensure cross-device/cross-browser real-time sync
  useEffect(() => {
    // Initial fetch from server
    refreshData();

    // Poll server every 6 seconds so other devices' additions appear automatically
    const interval = setInterval(() => {
      refreshData();
    }, 6000);

    // Sync on tab focus / visibility change
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshData();
      }
    };
    window.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", refreshData);

    return () => {
      clearInterval(interval);
      window.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", refreshData);
    };
  }, [refreshData]);

  // Add new Member (Optimistic local update + Server POST)
  const addMember = (input: NewMemberInput): Member => {
    const newId = `member-${Date.now()}`;
    const startMonth = input.start_month || 1;
    const startYear = input.start_year || 2026;
    const cleanPhone = input.phone.trim().replace(/[^0-9]/g, "");

    const newMember: Member = {
      id: newId,
      organization_id: "org-001",
      name: input.name.trim(),
      phone: cleanPhone,
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

    // Optimistic state update
    setMembers((prev) => [newMember, ...prev.filter((m) => m.id !== newId)]);
    setChandaRecords((prev) => [...newRecordsForMember, ...prev]);

    // Async POST to server so all other browsers/devices receive it
    fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newMember.name,
        phone: newMember.phone,
        city: newMember.city,
        area: newMember.area,
        monthly_amount: newMember.monthly_amount,
        start_month: newMember.start_month,
        start_year: newMember.start_year,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Trigger a quick re-sync
          refreshData();
        }
      })
      .catch((err) => {
        console.error("Failed to sync member to server:", err);
      });

    return newMember;
  };

  // Record Payment (Optimistic local update + Server POST)
  const recordPayment = (input: NewPaymentInput) => {
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

      setChandaRecords((prev) => {
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

    setPayments((prev) => [newPayment, ...prev]);
    setReceipts((prev) => [newReceipt, ...prev]);

    // Send to server
    fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        member_id: input.member_id,
        amount: input.amount,
        payment_method: input.payment_method,
        month: input.month,
        year: input.year,
        payment_date: todayStr,
      }),
    })
      .then((res) => res.json())
      .then(() => refreshData())
      .catch((err) => console.error("Failed to sync payment to server:", err));

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

  const getMemberByPhone = (phone: string) => {
    const clean = phone.replace(/[^0-9]/g, "");
    return members.find((m) => m.phone.replace(/[^0-9]/g, "").includes(clean) || clean.includes(m.phone.replace(/[^0-9]/g, "")));
  };

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
        name: "Community Member",
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
        getMemberByPhone,
        getPersonRecords,
        getPersonPayments,
        getPaymentsWithDetails,
        getFullReceipts,
        getFullReceiptById,
        getDashboardMetrics,
        getMonthlyOverview,
        getAnnualReport,
        org: demoOrg,
        isSyncing,
        refreshData,
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
