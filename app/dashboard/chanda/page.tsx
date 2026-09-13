"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";
import { useChandaStore, type FullReceiptData } from "@/lib/chanda-store";
import { useLanguage } from "@/lib/i18n";
import { formatIndianCurrency, getMonthName } from "@/lib/utils";
import { getNextMonthYear, getPreviousMonthYear } from "@/lib/calculations";
import { RecordPaymentModal } from "@/components/dashboard/RecordPaymentModal";
import { ReceiptModal } from "@/components/dashboard/ReceiptModal";
import type { PaymentStatus } from "@/lib/calculations";

export default function ChandaPage() {
  const { getMonthlyOverview, getFullReceiptById } = useChandaStore();
  const { t } = useLanguage();

  const [month, setMonth] = useState(9);
  const [year, setYear] = useState(2026);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | PaymentStatus>("all");
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<FullReceiptData | null>(null);

  const overview = useMemo(
    () => getMonthlyOverview(month, year),
    [getMonthlyOverview, month, year]
  );

  const filteredRecords = useMemo(() => {
    let result = overview.records;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.member.name.toLowerCase().includes(q) ||
          r.member.phone.includes(q)
      );
    }

    if (filter !== "all") {
      result = result.filter((r) => r.status === filter);
    }

    return result;
  }, [overview.records, search, filter]);

  function goToPrevMonth() {
    const prev = getPreviousMonthYear(month, year);
    setMonth(prev.month);
    setYear(prev.year);
  }

  function goToNextMonth() {
    const next = getNextMonthYear(month, year);
    setMonth(next.month);
    setYear(next.year);
  }

  function getStatusBadge(status: PaymentStatus) {
    const styles: Record<PaymentStatus, string> = {
      paid: "badge badge-paid",
      partial: "badge badge-partial",
      pending: "badge badge-pending",
      cancelled: "badge badge-cancelled",
    };
    let label = t.pending;
    if (status === "paid") label = `✓ ${t.paid}`;
    else if (status === "partial") label = `◐ ${t.partial}`;
    else if (status === "pending") label = `○ ${t.pending}`;

    return <span className={styles[status]}>{label}</span>;
  }

  const handlePaymentSuccess = (receiptNumber: string) => {
    const full = getFullReceiptById(receiptNumber);
    if (full) {
      setActiveReceipt(full);
    }
  };

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl sm:text-3xl uppercase tracking-tight">
            {t.chanda}
          </h1>
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860] mt-1">
            {overview.records.length} members in registry
          </p>
        </div>
        <button
          onClick={() => setIsRecordModalOpen(true)}
          className="brutal-btn brutal-btn-primary self-start sm:self-auto"
        >
          <Plus size={16} />
          {t.recordPayment}
        </button>
      </div>

      {/* Month Selector */}
      <div className="brutal-card p-4 flex items-center justify-between bg-white">
        <button
          onClick={goToPrevMonth}
          className="brutal-btn brutal-btn-ghost brutal-btn-sm"
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">
            {getMonthName(getPreviousMonthYear(month, year).month)}
          </span>
        </button>
        <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg sm:text-xl uppercase">
          {getMonthName(month)} {year}
        </h2>
        <button
          onClick={goToNextMonth}
          className="brutal-btn brutal-btn-ghost brutal-btn-sm"
        >
          <span className="hidden sm:inline">
            {getMonthName(getNextMonthYear(month, year).month)}
          </span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="brutal-card p-4 bg-white">
          <p className="brutal-label mb-1">{t.expectedThisMonth}</p>
          <p className="metric-value text-lg md:text-2xl">
            {formatIndianCurrency(overview.totalExpected)}
          </p>
        </div>
        <div className="brutal-card p-4 bg-[#C8FF19]">
          <p className="brutal-label mb-1 text-[#0B0906]">{t.collected}</p>
          <p className="metric-value text-lg md:text-2xl text-[#0B0906]">
            {formatIndianCurrency(overview.totalCollected)}
          </p>
        </div>
        <div className="brutal-card p-4 bg-[#FF3864]/10">
          <p className="brutal-label mb-1 text-[#FF3864]">{t.pendingAmount}</p>
          <p className="metric-value text-lg md:text-2xl text-[#FF3864]">
            {formatIndianCurrency(overview.totalPending)}
          </p>
        </div>
        <div className="brutal-card p-4 bg-white">
          <p className="brutal-label mb-1">{t.collectionRate}</p>
          <p className="metric-value text-lg md:text-2xl text-[#00875A]">
            {overview.collectionRate}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${overview.collectionRate}%` }}
        >
          {overview.collectionRate > 15 && (
            <span className="text-[#0B0906]">{overview.collectionRate}%</span>
          )}
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#C8FF19] border-2 border-[#0B0906] p-3 text-center">
          <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl">
            {overview.paidCount}
          </p>
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] uppercase tracking-widest font-semibold">
            {t.filterPaid}
          </p>
        </div>
        <div className="bg-[#FFD966] border-2 border-[#0B0906] p-3 text-center">
          <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl">
            {overview.partialCount}
          </p>
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] uppercase tracking-widest font-semibold">
            {t.filterPartial}
          </p>
        </div>
        <div className="bg-[#FF3864]/10 border-2 border-[#0B0906] p-3 text-center">
          <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl text-[#FF3864]">
            {overview.pendingCount}
          </p>
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] uppercase tracking-widest font-semibold text-[#FF3864]">
            {t.filterPending}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6860]"
          />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="brutal-input pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "paid", "partial", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`brutal-btn brutal-btn-sm ${
                filter === f ? "brutal-btn-primary" : "brutal-btn-white"
              }`}
            >
              {f === "all" ? t.filterAll : f === "paid" ? t.filterPaid : f === "partial" ? t.filterPartial : t.filterPending}
            </button>
          ))}
        </div>
      </div>

      {/* Member List */}
      <div className="space-y-2">
        {filteredRecords.map((record) => (
          <Link
            key={record.id}
            href={`/dashboard/people/${record.member_id}`}
            className="brutal-card brutal-card-hover p-4 flex items-center justify-between block bg-white"
          >
            <div>
              <p className="font-[family-name:var(--font-space-grotesk)] font-semibold text-base">
                {record.member.name}
              </p>
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860] mt-0.5">
                Expected: {formatIndianCurrency(record.expected_amount)}
                {record.paid_amount > 0 &&
                  ` • Paid: ${formatIndianCurrency(record.paid_amount)}`}
              </p>
            </div>
            {getStatusBadge(record.status)}
          </Link>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="brutal-card p-8 text-center bg-white">
          <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg uppercase mb-2">
            No records found
          </p>
          <p className="text-[#6B6860] text-sm">
            {search ? "Try a different search term." : "No Chanda records for this month."}
          </p>
        </div>
      )}

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* Receipt Modal */}
      {activeReceipt && (
        <ReceiptModal
          receipt={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}
    </div>
  );
}
