"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt as ReceiptIcon,
  Download,
  Share2,
  QrCode,
  ShieldCheck,
  User,
  MapPin,
  Calendar,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useChandaStore, type FullReceiptData } from "@/lib/chanda-store";
import { useLanguage } from "@/lib/i18n";
import { formatIndianCurrency, getMonthName } from "@/lib/utils";
import { ReceiptModal } from "@/components/dashboard/ReceiptModal";
import { LanguageToggle } from "@/components/LanguageToggle";
import { toast } from "sonner";

function MemberPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    members,
    getMemberByPhone,
    getPersonRecords,
    getPersonPayments,
    getFullReceipts,
    org,
  } = useChandaStore();
  const { language } = useLanguage();

  const [inputPhone, setInputPhone] = useState("");
  const [activePhone, setActivePhone] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<FullReceiptData | null>(null);

  // Initialize phone from URL searchParams or localStorage
  useEffect(() => {
    const urlPhone = searchParams.get("phone");
    if (urlPhone) {
      const clean = urlPhone.replace(/[^0-9]/g, "");
      setActivePhone(clean);
      localStorage.setItem("chanda_active_member_phone", clean);
    } else {
      const saved = localStorage.getItem("chanda_active_member_phone");
      if (saved) {
        setActivePhone(saved);
      }
    }
  }, [searchParams]);

  const member = useMemo(() => {
    if (!activePhone) return null;
    return getMemberByPhone(activePhone);
  }, [activePhone, getMemberByPhone, members]);

  const records = useMemo(() => {
    if (!member) return [];
    return getPersonRecords(member.id);
  }, [member, getPersonRecords]);

  const memberPayments = useMemo(() => {
    if (!member) return [];
    return getPersonPayments(member.id);
  }, [member, getPersonPayments]);

  const allFullReceipts = useMemo(() => getFullReceipts(), [getFullReceipts]);

  const memberReceipts = useMemo(() => {
    if (!member) return [];
    return allFullReceipts.filter(
      (r) =>
        r.donorPhone.replace(/[^0-9]/g, "") === member.phone.replace(/[^0-9]/g, "") ||
        memberPayments.some((p) => p.receipt_number.toLowerCase() === r.receiptNumber.toLowerCase())
    );
  }, [member, allFullReceipts, memberPayments]);

  const totalPaid = records.reduce((sum, r) => sum + r.paid_amount, 0);
  const totalExpected = records.reduce((sum, r) => sum + r.expected_amount, 0);
  const totalPending = Math.max(0, totalExpected - totalPaid);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputPhone.trim().replace(/[^0-9]/g, "");
    if (clean.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    const found = getMemberByPhone(clean);
    if (!found) {
      toast.error(`No member found registered with mobile number +91 ${clean}.`);
      return;
    }

    setActivePhone(clean);
    localStorage.setItem("chanda_active_member_phone", clean);
    router.replace(`/member/portal?phone=${clean}`);
    toast.success(`Welcome back, ${found.name}!`);
  };

  const handleLogout = () => {
    setActivePhone(null);
    localStorage.removeItem("chanda_active_member_phone");
    router.replace("/member/portal");
    toast.info("Logged out from member portal.");
  };

  // If no member is active or not found, show the mobile number entry screen
  if (!activePhone || !member) {
    return (
      <div className="min-h-screen bg-[#F5F4EA] flex flex-col justify-between">
        {/* Navigation */}
        <header className="border-b-2 border-[#0B0906] bg-white px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link
            href="/"
            className="font-[family-name:var(--font-space-grotesk)] font-bold text-base sm:text-lg flex items-center gap-2"
          >
            <span>🕌</span>
            <span>Quadri Jama Masjid</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link
              href="/login?tab=secretary"
              className="text-xs font-[family-name:var(--font-space-grotesk)] font-semibold text-[#252BFF] hover:underline"
            >
              Secretary Login →
            </Link>
          </div>
        </header>

        {/* Login Card */}
        <main className="max-w-md w-full mx-auto px-4 py-12">
          <div className="brutal-card p-6 sm:p-8 bg-white">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#C8FF19] border-2 border-[#0B0906] shadow-[3px_3px_0px_0px_#0B0906] rounded-none flex items-center justify-center mx-auto mb-3">
                <Phone size={26} className="text-[#0B0906]" />
              </div>
              <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl uppercase tracking-tight text-[#0B0906]">
                Member Portal
              </h1>
              <p className="text-xs font-[family-name:var(--font-ibm-plex-mono)] text-[#6B6860] mt-1">
                Enter your mobile number to view your Chanda passbook & receipts
              </p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block font-[family-name:var(--font-space-grotesk)] font-bold text-xs uppercase mb-1 text-[#0B0906]">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-[family-name:var(--font-ibm-plex-mono)] font-bold text-sm text-[#6B6860]">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="7631296157"
                    value={inputPhone}
                    onChange={(e) => setInputPhone(e.target.value.replace(/[^0-9]/g, ""))}
                    className="brutal-input pl-12 font-[family-name:var(--font-space-grotesk)] font-bold text-lg"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                className="brutal-btn brutal-btn-primary w-full justify-center py-3 text-sm font-bold shadow-[4px_4px_0px_0px_#0B0906]"
              >
                View My Chanda Passbook →
              </button>
            </form>

            {/* Quick Demo Test Numbers */}
            <div className="mt-8 pt-5 border-t border-[#D4D3C9]">
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] font-bold text-[#6B6860] uppercase mb-2">
                Quick Test with Sample Members:
              </p>
              <div className="space-y-1.5">
                {[
                  { name: "Md Najish", phone: "7631296157" },
                  { name: "Md Imran", phone: "9876543210" },
                  { name: "Tarique Anwar", phone: "9876543211" },
                ].map((sample) => (
                  <button
                    key={sample.phone}
                    type="button"
                    onClick={() => {
                      setInputPhone(sample.phone);
                      setActivePhone(sample.phone);
                      localStorage.setItem("chanda_active_member_phone", sample.phone);
                      router.replace(`/member/portal?phone=${sample.phone}`);
                      toast.success(`Loaded sample member: ${sample.name}`);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs bg-[#F5F4EA] hover:bg-[#C8FF19] border border-[#0B0906] flex items-center justify-between transition-colors font-[family-name:var(--font-space-grotesk)] font-semibold"
                  >
                    <span>{sample.name}</span>
                    <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[#6B6860]">
                      {sample.phone}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="text-center py-4 border-t border-[#D4D3C9] text-xs text-[#6B6860] font-[family-name:var(--font-ibm-plex-mono)]">
          Quadri Jama Masjid • Deoria Baradih, Muzaffarpur
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F4EA]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-[#0B0906] px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 hover:bg-[#F5F4EA] border border-transparent hover:border-[#0B0906] transition-colors"
            title="Back to Home"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm sm:text-base text-[#0B0906] flex items-center gap-1.5">
              <span>🕌</span>
              <span>{org.name}</span>
            </span>
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] sm:text-xs text-[#6B6860] block">
              Member Chanda Passbook & Receipts
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            onClick={handleLogout}
            className="brutal-btn brutal-btn-white py-1 px-2.5 text-xs flex items-center gap-1"
            title="Change Member"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Switch</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Member Profile Banner */}
        <div className="brutal-card p-5 sm:p-6 bg-white border-2 border-[#0B0906] shadow-[6px_6px_0px_0px_#0B0906]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#C8FF19] text-[#0B0906] border border-[#0B0906] px-2.5 py-0.5 font-[family-name:var(--font-ibm-plex-mono)] font-bold text-xs uppercase mb-2">
                <ShieldCheck size={13} />
                Verified Registered Donor
              </div>
              <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl sm:text-3xl text-[#0B0906] uppercase">
                {member.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs sm:text-sm text-[#6B6860] font-[family-name:var(--font-space-grotesk)]">
                <span className="flex items-center gap-1 font-semibold text-[#0B0906]">
                  <Phone size={14} className="text-[#252BFF]" />
                  +91 {member.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-[#FF3864]" />
                  {member.area || member.city || "Deoria Baradih"}
                </span>
                <span>•</span>
                <span className="font-[family-name:var(--font-ibm-plex-mono)] font-bold text-[#0B0906]">
                  Pledge: {formatIndianCurrency(member.monthly_amount)}/month
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/#gallery"
                className="brutal-btn bg-[#F5F4EA] hover:bg-white text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <span>📸</span>
                <span>Masjid Gallery</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Financial Summary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="brutal-card p-4 bg-white border-2 border-[#0B0906]">
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase text-[#6B6860] font-bold">
              Total Chanda Paid (2026)
            </p>
            <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl sm:text-3xl text-[#00875A] mt-1">
              {formatIndianCurrency(totalPaid)}
            </p>
            <p className="text-[11px] font-[family-name:var(--font-ibm-plex-mono)] text-[#6B6860] mt-1">
              Recorded in official register
            </p>
          </div>

          <div className="brutal-card p-4 bg-white border-2 border-[#0B0906]">
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase text-[#6B6860] font-bold">
              Total Pending Due (2026)
            </p>
            <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl sm:text-3xl text-[#FF3864] mt-1">
              {formatIndianCurrency(totalPending)}
            </p>
            <p className="text-[11px] font-[family-name:var(--font-ibm-plex-mono)] text-[#6B6860] mt-1">
              Remaining commitment
            </p>
          </div>

          <div className="brutal-card p-4 bg-white border-2 border-[#0B0906]">
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase text-[#6B6860] font-bold">
              Current Month (September)
            </p>
            <div className="mt-2 flex items-center gap-2">
              {records.find((r) => r.month === 9)?.status === "paid" ? (
                <span className="badge badge-paid text-sm py-1 px-2.5">
                  ✓ Paid (जमा है)
                </span>
              ) : (
                <span className="badge badge-pending text-sm py-1 px-2.5">
                  ○ Due / Pending (बाकी है)
                </span>
              )}
            </div>
            <p className="text-[11px] font-[family-name:var(--font-ibm-plex-mono)] text-[#6B6860] mt-2">
              Monthly pledge: {formatIndianCurrency(member.monthly_amount)}
            </p>
          </div>
        </div>

        {/* 12-Month Annual Passbook Grid */}
        <div className="brutal-card p-5 sm:p-6 bg-white border-2 border-[#0B0906]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg sm:text-xl uppercase text-[#0B0906]">
                Annual Chanda Passbook (2026)
              </h2>
              <p className="text-xs text-[#6B6860] font-[family-name:var(--font-ibm-plex-mono)]">
                Month-by-month contribution record for Quadri Jama Masjid
              </p>
            </div>
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold bg-[#C8FF19] px-2 py-0.5 border border-[#0B0906]">
              12 Months Ledger
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 12 }, (_, i) => {
              const m = i + 1;
              const rec = records.find((r) => r.month === m);
              const isPaid = rec?.status === "paid";
              const isPartial = rec?.status === "partial";
              const paidAmt = rec?.paid_amount || 0;

              return (
                <div
                  key={m}
                  className={`p-3 border-2 border-[#0B0906] flex flex-col justify-between min-h-[96px] ${
                    isPaid
                      ? "bg-[#E6F4EA]"
                      : isPartial
                      ? "bg-[#FEF0D5]"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-xs uppercase">
                      {getMonthName(m)}
                    </span>
                    {isPaid ? (
                      <CheckCircle2 size={15} className="text-[#00875A]" />
                    ) : isPartial ? (
                      <Clock size={15} className="text-[#B8860B]" />
                    ) : (
                      <AlertCircle size={15} className="text-[#6B6860]" />
                    )}
                  </div>

                  <div className="mt-2">
                    <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm">
                      {isPaid || paidAmt > 0
                        ? formatIndianCurrency(paidAmt)
                        : formatIndianCurrency(member.monthly_amount)}
                    </p>
                    <span
                      className={`inline-block text-[10px] font-[family-name:var(--font-ibm-plex-mono)] uppercase font-bold mt-1 ${
                        isPaid
                          ? "text-[#00875A]"
                          : isPartial
                          ? "text-[#B8860B]"
                          : "text-[#FF3864]"
                      }`}
                    >
                      {isPaid ? "Paid ✓" : isPartial ? "Partial ◐" : "Pending ○"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Member Receipts List */}
        <div className="brutal-card p-5 sm:p-6 bg-white border-2 border-[#0B0906]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ReceiptIcon size={20} className="text-[#252BFF]" />
              <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg sm:text-xl uppercase text-[#0B0906]">
                My Official Receipts ({memberReceipts.length})
              </h2>
            </div>
          </div>

          {memberReceipts.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-[#D4D3C9] bg-[#F5F4EA]">
              <p className="text-sm font-[family-name:var(--font-space-grotesk)] font-semibold text-[#6B6860]">
                No payment receipts found yet for this mobile number.
              </p>
              <p className="text-xs text-[#6B6860] mt-1">
                Once the Secretary records your monthly Chanda, your official receipt will appear here instantly.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {memberReceipts.map((rcpt) => (
                <div
                  key={rcpt.receiptNumber}
                  className="p-3.5 border-2 border-[#0B0906] bg-[#F5F4EA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-[family-name:var(--font-ibm-plex-mono)] font-bold text-xs bg-[#0B0906] text-[#C8FF19] px-2 py-0.5">
                        {rcpt.receiptNumber}
                      </span>
                      <span className="text-xs font-[family-name:var(--font-ibm-plex-mono)] text-[#6B6860]">
                        {rcpt.paymentDate}
                      </span>
                      <span className="text-xs uppercase font-bold text-[#00875A]">
                        • {rcpt.paymentMethod}
                      </span>
                    </div>
                    <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-base mt-1 text-[#0B0906]">
                      {getMonthName(rcpt.month)} {rcpt.year} Chanda — {formatIndianCurrency(rcpt.amount)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedReceipt(rcpt)}
                      className="brutal-btn brutal-btn-white text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <Download size={13} />
                      <span>View & Print</span>
                    </button>
                    <button
                      onClick={() => {
                        const monthName = getMonthName(rcpt.month);
                        const msg = `*MASJID CHANDA RECEIPT / रसीद*\n------------------------------\n*Masjid:* ${rcpt.masjidName}\n*Receipt No:* ${rcpt.receiptNumber}\n*Date:* ${rcpt.paymentDate}\n*Donor:* ${rcpt.donorName}\n*Month:* ${monthName} ${rcpt.year}\n*Amount Paid:* ${formatIndianCurrency(rcpt.amount)}\n------------------------------\n_JazakAllah Khair for supporting Quadri Jama Masjid!_`;
                        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
                        window.open(url, "_blank");
                      }}
                      className="brutal-btn bg-[#25D366] text-white hover:bg-[#1EBE5D] text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <Share2 size={13} />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* UPI Contribution Guidance Card */}
        <div className="p-6 bg-[#0B0906] text-white border-2 border-[#0B0906] shadow-[6px_6px_0px_0px_#C8FF19] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-[#C8FF19] font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase mb-1">
              <QrCode size={16} />
              <span>Easy Online Payment</span>
            </div>
            <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl sm:text-2xl">
              Pay Your Monthly Chanda Online
            </h3>
            <p className="text-xs sm:text-sm text-[#D4D3C9] mt-1.5 leading-relaxed">
              You can send your monthly contribution via UPI to the official Quadri Jama Masjid account or hand it over in cash to the Secretary during Jum&apos;ah prayers.
            </p>
          </div>
          <div className="shrink-0 text-center bg-white p-3 border-2 border-[#0B0906] text-[#0B0906]">
            <p className="font-[family-name:var(--font-ibm-plex-mono)] font-bold text-xs uppercase mb-1">
              Secretary Contact
            </p>
            <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-base text-[#252BFF]">
              +91 7631296157
            </p>
            <p className="text-[10px] text-[#6B6860] font-[family-name:var(--font-ibm-plex-mono)]">
              Noorain Alam (Secretary)
            </p>
          </div>
        </div>
      </main>

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

export default function MemberPortalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Member Portal...</div>}>
      <MemberPortalContent />
    </Suspense>
  );
}
