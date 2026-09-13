"use client";

import React, { useRef } from "react";
import { X, Printer, Share2, Download, CheckCircle, MessageSquare } from "lucide-react";
import type { FullReceiptData } from "@/lib/chanda-store";
import { formatIndianCurrency, getMonthName } from "@/lib/utils";
import { numberToWordsIndian, numberToWordsHindi } from "@/lib/number-to-words";
import { useLanguage } from "@/lib/i18n";

interface ReceiptModalProps {
  receipt: FullReceiptData | null;
  onClose: () => void;
}

export function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  const { language, t } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);

  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const shareOnWhatsApp = () => {
    const monthName = getMonthName(receipt.month);
    const amountStr = formatIndianCurrency(receipt.amount);
    const message = `*MASJID CHANDA RECEIPT / रसीद*
------------------------------
*Masjid:* ${receipt.masjidName}, ${receipt.donorCity}
*Receipt No:* ${receipt.receiptNumber}
*Date:* ${receipt.paymentDate}
*Donor/Member:* ${receipt.donorName}
*Phone:* ${receipt.donorPhone}
*Month:* ${monthName} ${receipt.year}
*Amount Paid:* ${amountStr}
*Payment Mode:* ${receipt.paymentMethod.toUpperCase()}
*Status:* Received with Thanks (सधन्यवाद प्राप्त)
------------------------------
_JazakAllah Khair for your continuous contribution!_`;

    const phoneClean = receipt.donorPhone.replace(/[^0-9]/g, "");
    const waUrl = phoneClean.length === 10
      ? `https://api.whatsapp.com/send?phone=91${phoneClean}&text=${encodeURIComponent(message)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    window.open(waUrl, "_blank");
  };

  const amountInWords = language === "hi"
    ? numberToWordsHindi(receipt.amount)
    : numberToWordsIndian(receipt.amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B0906]/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white border-2 border-[#0B0906] shadow-[8px_8px_0px_0px_#0B0906] my-6">
        {/* Top Control Bar (Hidden during Print) */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0B0906] text-white print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-base">📜</span>
            <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm uppercase tracking-wide text-[#C8FF19]">
              {t.receiptTitle} • #{receipt.receiptNumber}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#C8FF19] transition-colors p-1"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Receipt Container */}
        <div ref={printRef} className="p-6 sm:p-8 bg-white print:p-0 print:border-none">
          {/* Receipt Watermark & Header */}
          <div className="border-b-2 border-dashed border-[#0B0906] pb-4 mb-5 text-center relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F5F4EA] border-2 border-[#0B0906] mb-2 shadow-[2px_2px_0px_0px_#0B0906]">
              <span className="text-2xl">🕌</span>
            </div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl uppercase tracking-tight text-[#0B0906]">
              {receipt.masjidName}
            </h2>
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860] mt-0.5">
              {receipt.masjidAddress}
            </p>
            <div className="inline-block mt-3 px-3 py-1 bg-[#F5F4EA] border border-[#0B0906] font-[family-name:var(--font-space-grotesk)] font-bold text-xs uppercase tracking-wider">
              {t.receiptTitle}
            </div>
          </div>

          {/* Receipt Meta (No, Date, Status) */}
          <div className="grid grid-cols-2 gap-3 mb-5 p-3 bg-[#F5F4EA] border border-[#D4D3C9]">
            <div>
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.6875rem] text-[#6B6860] uppercase">
                {t.receiptNo}
              </p>
              <p className="font-[family-name:var(--font-ibm-plex-mono)] font-bold text-sm text-[#0B0906]">
                {receipt.receiptNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.6875rem] text-[#6B6860] uppercase">
                {t.date}
              </p>
              <p className="font-[family-name:var(--font-ibm-plex-mono)] font-bold text-sm text-[#0B0906]">
                {receipt.paymentDate}
              </p>
            </div>
          </div>

          {/* Member Details */}
          <div className="space-y-3 mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-[#E5E4D8] pb-2">
              <span className="font-[family-name:var(--font-space-grotesk)] text-xs text-[#6B6860] uppercase font-semibold">
                {t.donorName}:
              </span>
              <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-base text-[#0B0906]">
                {receipt.donorName}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-[#E5E4D8] pb-2">
              <span className="font-[family-name:var(--font-space-grotesk)] text-xs text-[#6B6860] uppercase font-semibold">
                {t.mobileNumber} / {t.cityArea}:
              </span>
              <span className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#0B0906]">
                {receipt.donorPhone} {receipt.donorArea ? `• ${receipt.donorArea}` : ""}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-[#E5E4D8] pb-2">
              <span className="font-[family-name:var(--font-space-grotesk)] text-xs text-[#6B6860] uppercase font-semibold">
                {t.forMonth}:
              </span>
              <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm text-[#0B0906]">
                {getMonthName(receipt.month)} {receipt.year}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-[#E5E4D8] pb-2">
              <span className="font-[family-name:var(--font-space-grotesk)] text-xs text-[#6B6860] uppercase font-semibold">
                {t.paymentMode}:
              </span>
              <span className="font-[family-name:var(--font-ibm-plex-mono)] font-bold text-xs uppercase px-2 py-0.5 bg-[#F5F4EA] border border-[#0B0906]">
                {receipt.paymentMethod}
              </span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="p-4 bg-[#C8FF19]/15 border-2 border-[#0B0906] mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase font-bold text-[#0B0906]">
                {t.amountReceived}
              </p>
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860] italic mt-0.5">
                {amountInWords}
              </p>
            </div>
            <p className="font-[family-name:var(--font-space-grotesk)] font-black text-2xl sm:text-3xl text-[#0B0906]">
              {formatIndianCurrency(receipt.amount)}
            </p>
          </div>

          {/* Verification & Signature Stamp */}
          <div className="flex items-end justify-between pt-4 border-t-2 border-dashed border-[#0B0906] mt-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#00875A] font-bold">
                <CheckCircle size={14} />
                <span>VERIFIED & RECORDED</span>
              </div>
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] text-[#6B6860]">
                Recorded by: {receipt.recordedBy}
              </p>
            </div>

            <div className="text-center">
              <div className="h-10 flex items-center justify-center">
                <span className="font-[family-name:var(--font-space-grotesk)] italic text-sm font-serif text-[#0B0906]">
                  {receipt.recordedBy || "Noorain Alam"}
                </span>
              </div>
              <div className="w-40 border-t border-[#0B0906] pt-1">
                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.5625rem] text-[#6B6860] uppercase leading-tight font-semibold">
                  {t.authorizedSignature}
                </p>
                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.5rem] text-[#6B6860] leading-tight mt-0.5">
                  Noorain Alam (Deoria Baradih Masjid)
                </p>
              </div>
            </div>
          </div>

          {/* Dua Note */}
          <p className="text-center font-[family-name:var(--font-space-grotesk)] text-[0.6875rem] text-[#6B6860] mt-5 pt-3 border-t border-[#E5E4D8]">
            &ldquo;And whatever you spend in good, Allah knows it well.&rdquo; • (Quran 2:273)
          </p>
        </div>

        {/* Action Buttons Bar (Hidden during Print) */}
        <div className="flex flex-wrap gap-2.5 p-4 bg-[#F5F4EA] border-t-2 border-[#0B0906] print:hidden">
          <button
            onClick={handlePrint}
            className="brutal-btn brutal-btn-primary flex-1 justify-center py-2.5"
          >
            <Printer size={16} />
            {t.printReceipt}
          </button>
          <button
            onClick={shareOnWhatsApp}
            className="brutal-btn bg-[#25D366] text-white border-2 border-[#0B0906] hover:bg-[#1ebd5a] flex-1 justify-center py-2.5"
          >
            <MessageSquare size={16} />
            {t.shareWhatsApp}
          </button>
          <button
            onClick={onClose}
            className="brutal-btn brutal-btn-white py-2.5 px-4"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
