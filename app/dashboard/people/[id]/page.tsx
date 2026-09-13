"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, MapPin, CreditCard, Receipt, Eye, Printer, MessageSquare } from "lucide-react";
import { useChandaStore, type FullReceiptData } from "@/lib/chanda-store";
import { useLanguage } from "@/lib/i18n";
import { formatIndianCurrency, getMonthName } from "@/lib/utils";
import { ReceiptModal } from "@/components/dashboard/ReceiptModal";
import type { PaymentStatus } from "@/lib/calculations";

export default function PersonProfilePage() {
  const params = useParams();
  const memberId = params.id as string;
  const { getMemberById, getPersonRecords, getPersonPayments, getFullReceiptById, org } = useChandaStore();
  const { t } = useLanguage();

  const [selectedReceipt, setSelectedReceipt] = useState<FullReceiptData | null>(null);

  const member = useMemo(() => getMemberById(memberId), [getMemberById, memberId]);
  const records = useMemo(() => getPersonRecords(memberId), [getPersonRecords, memberId]);
  const payments = useMemo(() => getPersonPayments(memberId), [getPersonPayments, memberId]);

  if (!member) {
    return (
      <div className="brutal-card p-8 text-center">
        <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg uppercase mb-2">
          Person Not Found
        </p>
        <Link href="/dashboard/people" className="brutal-btn brutal-btn-primary mt-4">
          <ArrowLeft size={16} />
          Back to People
        </Link>
      </div>
    );
  }

  const totalPaid = records.reduce((sum, r) => sum + r.paid_amount, 0);
  const totalExpected = records.reduce((sum, r) => sum + r.expected_amount, 0);
  const totalPending = Math.max(0, totalExpected - totalPaid);

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

  const openReceipt = (receiptNumber: string) => {
    const r = getFullReceiptById(receiptNumber);
    if (r) {
      setSelectedReceipt(r);
    } else {
      // Create receipt object if not already stored
      const pay = payments.find((p) => p.receipt_number === receiptNumber);
      if (pay) {
        const full: FullReceiptData = {
          receiptNumber: pay.receipt_number,
          paymentId: pay.id,
          donorName: member.name,
          donorPhone: member.phone,
          donorArea: member.area || "",
          donorCity: member.city,
          amount: pay.amount,
          paymentMethod: pay.payment_method,
          paymentDate: pay.payment_date,
          month: 9,
          year: 2026,
          monthlyPledge: member.monthly_amount,
          masjidName: org.name,
          masjidAddress: org.address || `${org.city}, ${org.state}`,
          recordedBy: "Najish Ahmed",
        };
        setSelectedReceipt(full);
      }
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Back Button */}
      <Link
        href="/dashboard/people"
        className="inline-flex items-center gap-2 text-[#6B6860] hover:text-[#0B0906] transition-colors font-[family-name:var(--font-space-grotesk)] font-semibold text-sm uppercase"
      >
        <ArrowLeft size={16} />
        Back to People
      </Link>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="brutal-card p-5 md:p-6 bg-white"
      >
        <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl sm:text-3xl mb-3">
          {member.name}
        </h1>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-[#6B6860]">
            <Phone size={14} />
            <span className="font-[family-name:var(--font-ibm-plex-mono)]">
              {member.phone}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#6B6860]">
            <MapPin size={14} />
            <span>
              {member.area ? `${member.area}, ` : ""}
              {member.city}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#D4D3C9]">
          <p className="brutal-label mb-1">{t.monthlyChanda}</p>
          <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-3xl">
            {formatIndianCurrency(member.monthly_amount)}
          </p>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="brutal-card p-4 bg-[#C8FF19]"
        >
          <p className="brutal-label mb-1">{t.collected}</p>
          <p className="metric-value text-lg md:text-2xl">
            {formatIndianCurrency(totalPaid)}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="brutal-card p-4 bg-white"
        >
          <p className="brutal-label mb-1">Expected</p>
          <p className="metric-value text-lg md:text-2xl">
            {formatIndianCurrency(totalExpected)}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="brutal-card p-4 bg-[#FF3864]/10"
        >
          <p className="brutal-label mb-1">{t.pendingAmount}</p>
          <p className="metric-value text-lg md:text-2xl text-[#FF3864]">
            {formatIndianCurrency(totalPending)}
          </p>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href="/dashboard/chanda"
          className="brutal-btn brutal-btn-primary flex-1 justify-center"
        >
          <CreditCard size={16} />
          {t.recordPayment}
        </Link>
        <Link
          href="/dashboard/receipts"
          className="brutal-btn brutal-btn-white flex-1 justify-center"
        >
          <Receipt size={16} />
          {t.viewReceipt}
        </Link>
      </div>

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl uppercase mb-4">
          2026 Payment History
        </h2>
        <div className="space-y-2">
          {records.map((record) => (
            <div
              key={record.id}
              className="brutal-card p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="font-[family-name:var(--font-space-grotesk)] font-semibold text-sm w-24">
                  {getMonthName(record.month)}
                </span>
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                  {record.paid_amount > 0
                    ? formatIndianCurrency(record.paid_amount)
                    : "—"}
                </span>
              </div>
              {getStatusBadge(record.status)}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Payments & Downloadable Receipts */}
      {payments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl uppercase mb-4">
            Recent Payments & Receipts
          </h2>
          <div className="space-y-2">
            {payments.slice(0, 10).map((payment) => (
              <div
                key={payment.id}
                className="brutal-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold text-[#252BFF]">
                    #{payment.receipt_number}
                  </p>
                  <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg">
                    {formatIndianCurrency(payment.amount)}
                  </p>
                  <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860]">
                    {payment.payment_date} • Mode: {payment.payment_method.toUpperCase()}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => openReceipt(payment.receipt_number)}
                    className="brutal-btn brutal-btn-white brutal-btn-sm inline-flex items-center gap-1.5"
                  >
                    <Eye size={14} />
                    <span>{t.viewReceipt}</span>
                  </button>
                  <button
                    onClick={() => openReceipt(payment.receipt_number)}
                    className="brutal-btn brutal-btn-primary brutal-btn-sm inline-flex items-center gap-1.5"
                  >
                    <Printer size={14} />
                    <span>{t.printReceipt}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
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
