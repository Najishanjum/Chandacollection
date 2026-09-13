"use client";

import React, { useState, useMemo } from "react";
import { X, CreditCard, Check, IndianRupee } from "lucide-react";
import { useChandaStore } from "@/lib/chanda-store";
import { useLanguage } from "@/lib/i18n";
import { toast } from "sonner";
import type { PaymentMethod } from "@/lib/calculations";
import { formatIndianCurrency, getMonthName } from "@/lib/utils";

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMemberId?: string;
  onSuccess?: (receiptNumber: string) => void;
}

export function RecordPaymentModal({
  isOpen,
  onClose,
  defaultMemberId,
  onSuccess,
}: RecordPaymentModalProps) {
  const { members, recordPayment } = useChandaStore();
  const { t, language } = useLanguage();

  const [selectedMemberId, setSelectedMemberId] = useState<string>(defaultMemberId || (members[0]?.id || ""));
  const [amount, setAmount] = useState<number>(500);
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [month, setMonth] = useState<number>(9);
  const [year, setYear] = useState<number>(2026);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedMember = useMemo(
    () => members.find((m) => m.id === selectedMemberId),
    [members, selectedMemberId]
  );

  // When member changes, autofill their monthly pledged amount
  const handleMemberChange = (id: string) => {
    setSelectedMemberId(id);
    const m = members.find((mem) => mem.id === id);
    if (m) setAmount(m.monthly_amount);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !amount || amount <= 0) {
      toast.error("Please select a member and enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    try {
      const { payment, receipt } = recordPayment({
        member_id: selectedMemberId,
        amount: Number(amount),
        payment_method: method,
        month,
        year,
      });

      toast.success(
        language === "hinglish"
          ? `Chanda jama ho gaya! Rashid No: ${receipt.receipt_number}`
          : `Payment recorded! Receipt No: ${receipt.receipt_number}`
      );

      if (onSuccess) onSuccess(receipt.receipt_number);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B0906]/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border-2 border-[#0B0906] shadow-[8px_8px_0px_0px_#0B0906] my-6">
        <div className="flex items-center justify-between px-5 py-4 bg-[#0B0906] text-white">
          <div className="flex items-center gap-2">
            <CreditCard size={20} className="text-[#C8FF19]" />
            <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg uppercase tracking-tight text-white">
              {t.recordPayment}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#C8FF19] transition-colors p-1"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Member Selection */}
          <div>
            <label className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-xs uppercase mb-1 text-[#0B0906]">
              {t.donorName}
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => handleMemberChange(e.target.value)}
              className="brutal-input"
              required
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.phone}) — {formatIndianCurrency(m.monthly_amount)}/mo
                </option>
              ))}
            </select>
          </div>

          {/* Month & Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-xs uppercase mb-1 text-[#0B0906]">
                {t.forMonth}
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="brutal-input"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {getMonthName(m)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-xs uppercase mb-1 text-[#0B0906]">
                Year / Saal
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="brutal-input"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
            </div>
          </div>

          {/* Amount Paid */}
          <div>
            <label className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-xs uppercase mb-1 text-[#0B0906]">
              {t.amountReceived} (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#0B0906]">
                ₹
              </span>
              <input
                type="number"
                min={10}
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="brutal-input pl-8 font-[family-name:var(--font-space-grotesk)] font-bold text-lg"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-xs uppercase mb-1.5 text-[#0B0906]">
              {t.paymentMode}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["cash", "upi", "bank"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`py-2 px-3 border-2 border-[#0B0906] font-[family-name:var(--font-space-grotesk)] font-bold text-xs uppercase transition-colors ${
                    method === m
                      ? "bg-[#C8FF19] text-[#0B0906] shadow-[2px_2px_0px_0px_#0B0906]"
                      : "bg-[#F5F4EA] text-[#0B0906] hover:bg-white"
                  }`}
                >
                  {m === "cash" ? "💵 Cash" : m === "upi" ? "📱 UPI" : "🏦 Bank"}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4D3C9] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="brutal-btn brutal-btn-white"
              disabled={isSubmitting}
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="brutal-btn brutal-btn-primary"
              disabled={isSubmitting}
            >
              <Check size={16} />
              {isSubmitting ? t.submitting : t.recordPayment}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
