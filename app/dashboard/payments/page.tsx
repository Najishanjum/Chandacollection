"use client";

import { useState, useMemo } from "react";
import { Search, Receipt, Eye, Printer } from "lucide-react";
import { useChandaStore, type FullReceiptData } from "@/lib/chanda-store";
import { useLanguage } from "@/lib/i18n";
import { formatIndianCurrency, getMonthName } from "@/lib/utils";
import { ReceiptModal } from "@/components/dashboard/ReceiptModal";

export default function PaymentsPage() {
  const { getPaymentsWithDetails, getFullReceiptById } = useChandaStore();
  const { t } = useLanguage();

  const allPayments = useMemo(() => getPaymentsWithDetails(), [getPaymentsWithDetails]);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [selectedReceipt, setSelectedReceipt] = useState<FullReceiptData | null>(null);

  const filtered = useMemo(() => {
    let result = allPayments;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.member_name.toLowerCase().includes(q) ||
          p.receipt_number.toLowerCase().includes(q) ||
          p.member_phone.includes(q)
      );
    }

    if (methodFilter !== "all") {
      result = result.filter((p) => p.payment_method === methodFilter);
    }

    return result;
  }, [allPayments, search, methodFilter]);

  const openReceipt = (receiptNumber: string) => {
    const r = getFullReceiptById(receiptNumber);
    if (r) setSelectedReceipt(r);
  };

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl sm:text-3xl uppercase tracking-tight">
          {t.payments}
        </h1>
        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860] mt-1">
          {allPayments.length} payments recorded
        </p>
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
            placeholder="Search by name, phone or receipt #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="brutal-input pl-10"
          />
        </div>
        <div className="flex gap-2">
          {["all", "cash", "upi", "bank"].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`brutal-btn brutal-btn-sm ${
                methodFilter === m ? "brutal-btn-primary" : "brutal-btn-white"
              }`}
            >
              {m === "all" ? t.filterAll : m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
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
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((payment) => (
              <tr key={payment.id}>
                <td className="font-[family-name:var(--font-ibm-plex-mono)] text-sm font-semibold">
                  {payment.receipt_number}
                </td>
                <td>
                  <p className="font-[family-name:var(--font-space-grotesk)] font-semibold">
                    {payment.member_name}
                  </p>
                  <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860]">
                    {payment.member_phone}
                  </p>
                </td>
                <td className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#6B6860]">
                  {payment.payment_date}
                </td>
                <td className="text-sm">
                  {getMonthName(payment.month)} {payment.year}
                </td>
                <td className="font-[family-name:var(--font-space-grotesk)] font-bold">
                  {formatIndianCurrency(payment.amount)}
                </td>
                <td>
                  <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase bg-[#F5F4EA] border border-[#D4D3C9] px-2 py-0.5">
                    {payment.payment_method}
                  </span>
                </td>
                <td className="text-right">
                  <button
                    onClick={() => openReceipt(payment.receipt_number)}
                    className="brutal-btn brutal-btn-white brutal-btn-sm inline-flex items-center gap-1"
                    title={t.downloadReceipt}
                  >
                    <Eye size={13} />
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
        {filtered.map((payment) => (
          <div key={payment.id} className="brutal-card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-[family-name:var(--font-space-grotesk)] font-bold">
                  {payment.member_name}
                </p>
                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860]">
                  #{payment.receipt_number} • {payment.member_phone}
                </p>
              </div>
              <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg">
                {formatIndianCurrency(payment.amount)}
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#D4D3C9]">
              <div className="flex items-center gap-2">
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase bg-[#F5F4EA] border border-[#D4D3C9] px-2 py-0.5">
                  {payment.payment_method}
                </span>
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860]">
                  {payment.payment_date}
                </span>
              </div>
              <button
                onClick={() => openReceipt(payment.receipt_number)}
                className="brutal-btn brutal-btn-primary brutal-btn-sm"
              >
                <Receipt size={14} />
                {t.viewReceipt}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="brutal-card p-8 text-center">
          <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg uppercase mb-2">
            No payments found
          </p>
          <p className="text-[#6B6860] text-sm">
            {search
              ? "Try a different search term."
              : "No payments have been recorded yet."}
          </p>
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
