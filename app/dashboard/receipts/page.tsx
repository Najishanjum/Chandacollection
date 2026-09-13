"use client";

import React, { useState, useMemo } from "react";
import { Search, Receipt, Printer, MessageSquare, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useChandaStore, type FullReceiptData } from "@/lib/chanda-store";
import { useLanguage } from "@/lib/i18n";
import { formatIndianCurrency, getMonthName } from "@/lib/utils";
import { ReceiptModal } from "@/components/dashboard/ReceiptModal";

const ITEMS_PER_PAGE = 15;

export default function ReceiptsPage() {
  const { getFullReceipts } = useChandaStore();
  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedReceipt, setSelectedReceipt] = useState<FullReceiptData | null>(null);

  const allReceipts = useMemo(() => getFullReceipts(), [getFullReceipts]);

  const filtered = useMemo(() => {
    let result = allReceipts;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.donorName.toLowerCase().includes(q) ||
          r.receiptNumber.toLowerCase().includes(q) ||
          r.donorPhone.includes(q) ||
          (r.donorArea && r.donorArea.toLowerCase().includes(q))
      );
    }

    if (methodFilter !== "all") {
      result = result.filter((r) => r.paymentMethod === methodFilter);
    }

    return result;
  }, [allReceipts, search, methodFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalCollected = useMemo(
    () => allReceipts.reduce((sum, r) => sum + r.amount, 0),
    [allReceipts]
  );

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl sm:text-3xl uppercase tracking-tight">
            {t.receipts}
          </h1>
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860] mt-1">
            {allReceipts.length} receipts generated • Total: {formatIndianCurrency(totalCollected)}
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="brutal-card p-4 bg-white">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.6875rem] uppercase text-[#6B6860]">
            Total Receipts
          </p>
          <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl mt-1">
            {allReceipts.length}
          </p>
        </div>
        <div className="brutal-card p-4 bg-[#C8FF19]">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.6875rem] uppercase text-[#0B0906]">
            Total Receipt Amount
          </p>
          <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl mt-1">
            {formatIndianCurrency(totalCollected)}
          </p>
        </div>
        <div className="brutal-card p-4 bg-white">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.6875rem] uppercase text-[#6B6860]">
            Digital Verification
          </p>
          <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-base text-[#00875A] mt-1 flex items-center gap-1.5">
            <span>✓ 100% Authentic</span>
          </p>
        </div>
      </div>

      {/* Search & Filter */}
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
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="brutal-input pl-10"
          />
        </div>
        <div className="flex gap-2">
          {["all", "cash", "upi", "bank"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMethodFilter(m);
                setPage(1);
              }}
              className={`brutal-btn brutal-btn-sm ${
                methodFilter === m ? "brutal-btn-primary" : "brutal-btn-white"
              }`}
            >
              {m === "all" ? t.filterAll : m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table Desktop */}
      <div className="hidden md:block">
        <table className="brutal-table">
          <thead>
            <tr>
              <th>{t.receiptNo}</th>
              <th>{t.donorName}</th>
              <th>{t.date}</th>
              <th>{t.forMonth}</th>
              <th>{t.amountReceived}</th>
              <th>{t.paymentMode}</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((receipt) => (
              <tr key={receipt.receiptNumber}>
                <td className="font-[family-name:var(--font-ibm-plex-mono)] font-bold text-sm">
                  {receipt.receiptNumber}
                </td>
                <td>
                  <p className="font-[family-name:var(--font-space-grotesk)] font-semibold">
                    {receipt.donorName}
                  </p>
                  <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860]">
                    {receipt.donorPhone}
                  </p>
                </td>
                <td className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#6B6860]">
                  {receipt.paymentDate}
                </td>
                <td className="text-sm">
                  {getMonthName(receipt.month)} {receipt.year}
                </td>
                <td className="font-[family-name:var(--font-space-grotesk)] font-bold">
                  {formatIndianCurrency(receipt.amount)}
                </td>
                <td>
                  <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase bg-[#F5F4EA] border border-[#D4D3C9] px-2 py-0.5">
                    {receipt.paymentMethod}
                  </span>
                </td>
                <td className="text-right">
                  <button
                    onClick={() => setSelectedReceipt(receipt)}
                    className="brutal-btn brutal-btn-white brutal-btn-sm inline-flex items-center gap-1.5"
                    title={t.downloadReceipt}
                  >
                    <Eye size={14} />
                    <span>{t.viewReceipt}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginated.map((receipt) => (
          <div key={receipt.receiptNumber} className="brutal-card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-base">
                  {receipt.donorName}
                </p>
                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860]">
                  #{receipt.receiptNumber} • {receipt.paymentDate}
                </p>
              </div>
              <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg">
                {formatIndianCurrency(receipt.amount)}
              </p>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#D4D3C9]">
              <div className="flex items-center gap-2">
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase bg-[#F5F4EA] border border-[#D4D3C9] px-2 py-0.5">
                  {receipt.paymentMethod}
                </span>
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860]">
                  {getMonthName(receipt.month)}
                </span>
              </div>
              <button
                onClick={() => setSelectedReceipt(receipt)}
                className="brutal-btn brutal-btn-primary brutal-btn-sm"
              >
                <Receipt size={14} />
                {t.viewReceipt}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="brutal-card p-8 text-center">
          <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg uppercase mb-2">
            No receipts found
          </p>
          <p className="text-[#6B6860] text-sm">
            {search ? "Try searching with a different name or number." : "No receipts recorded yet."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860]">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="brutal-btn brutal-btn-white brutal-btn-sm"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-sm flex items-center px-2">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="brutal-btn brutal-btn-white brutal-btn-sm"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
