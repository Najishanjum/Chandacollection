"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Printer,
  Search,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import * as XLSX from "xlsx";
import { useChandaStore } from "@/lib/chanda-store";
import { useLanguage } from "@/lib/i18n";
import { formatIndianCurrency, getMonthName } from "@/lib/utils";
import { getNextMonthYear, getPreviousMonthYear } from "@/lib/calculations";
import type { PaymentStatus } from "@/lib/calculations";

export default function ReportsPage() {
  const { getMonthlyOverview, getAnnualReport, payments } = useChandaStore();
  const { t, language } = useLanguage();

  const [month, setMonth] = useState<number>(9);
  const [year, setYear] = useState<number>(2026);
  const [search, setSearch] = useState("");

  const monthlyOverview = useMemo(
    () => getMonthlyOverview(month, year),
    [getMonthlyOverview, month, year]
  );

  const annualReport = useMemo(
    () => getAnnualReport(year),
    [getAnnualReport, year]
  );

  // Month navigation
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

  // Monthly trend chart data
  const chartData = useMemo(() => {
    return annualReport.monthlyData.map((d) => ({
      name: getMonthName(d.month).slice(0, 3),
      Expected: d.expected,
      Collected: d.collected,
      Pending: d.pending,
    }));
  }, [annualReport]);

  // Filtered member records for current month
  const filteredRecords = useMemo(() => {
    if (!search) return monthlyOverview.records;
    const q = search.toLowerCase();
    return monthlyOverview.records.filter(
      (r) =>
        r.member.name.toLowerCase().includes(q) ||
        r.member.phone.includes(q) ||
        (r.member.area && r.member.area.toLowerCase().includes(q))
    );
  }, [monthlyOverview.records, search]);

  // Payment methods breakdown for this month
  const methodStats = useMemo(() => {
    const monthPayments = payments.filter((p) => {
      const parts = p.payment_date.split("-");
      return Number(parts[1]) === month && Number(parts[0]) === year;
    });

    const cash = monthPayments
      .filter((p) => p.payment_method === "cash")
      .reduce((sum, p) => sum + p.amount, 0);
    const upi = monthPayments
      .filter((p) => p.payment_method === "upi")
      .reduce((sum, p) => sum + p.amount, 0);
    const bank = monthPayments
      .filter((p) => p.payment_method === "bank")
      .reduce((sum, p) => sum + p.amount, 0);

    return { cash, upi, bank, total: cash + upi + bank };
  }, [payments, month, year]);

  // Export to Excel
  const handleExportExcel = () => {
    const rows = monthlyOverview.records.map((r, i) => ({
      "S.No": i + 1,
      "Donor Name": r.member.name,
      "Mobile Number": r.member.phone,
      "Area / Mohalla": r.member.area || r.member.city,
      "Monthly Pledge (₹)": r.expected_amount,
      "Amount Paid (₹)": r.paid_amount,
      "Remaining / Baki (₹)": Math.max(0, r.expected_amount - r.paid_amount),
      "Status": r.status.toUpperCase(),
      "Month": `${getMonthName(month)} ${year}`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Chanda_${getMonthName(month)}`);

    XLSX.writeFile(workbook, `Masjid_Chanda_Report_${getMonthName(month)}_${year}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

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

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl sm:text-3xl uppercase tracking-tight">
            {t.reports}
          </h1>
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860] mt-1">
            {getMonthName(month)} {year} Financial & Collection Analytics
          </p>
        </div>

        {/* Month Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <div className="flex items-center bg-white border-2 border-[#0B0906] p-0.5 shadow-[2px_2px_0px_0px_#0B0906]">
            <button
              onClick={goToPrevMonth}
              className="p-1.5 hover:bg-[#F5F4EA] transition-colors"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-xs uppercase px-3 min-w-28 text-center">
              {getMonthName(month)} {year}
            </span>
            <button
              onClick={goToNextMonth}
              className="p-1.5 hover:bg-[#F5F4EA] transition-colors"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={handleExportExcel}
            className="brutal-btn brutal-btn-primary py-2 px-3 text-xs"
          >
            <FileSpreadsheet size={14} />
            {t.exportExcel}
          </button>

          <button
            onClick={handlePrint}
            className="brutal-btn brutal-btn-white py-2 px-3 text-xs"
          >
            <Printer size={14} />
            Print
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="brutal-card p-4 md:p-5 bg-white">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.6875rem] uppercase text-[#6B6860] tracking-wider">
            {t.expectedThisMonth}
          </p>
          <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl md:text-3xl mt-1">
            {formatIndianCurrency(monthlyOverview.totalExpected)}
          </p>
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] text-[#6B6860] mt-1">
            {monthlyOverview.records.length} members pledged
          </p>
        </div>

        <div className="brutal-card p-4 md:p-5 bg-[#C8FF19]">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.6875rem] uppercase text-[#0B0906] tracking-wider font-semibold">
            {t.collected}
          </p>
          <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl md:text-3xl mt-1 text-[#0B0906]">
            {formatIndianCurrency(monthlyOverview.totalCollected)}
          </p>
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] text-[#0B0906]/80 mt-1 font-semibold">
            {monthlyOverview.paidCount} fully paid ({monthlyOverview.collectionRate}%)
          </p>
        </div>

        <div className="brutal-card p-4 md:p-5 bg-[#FF3864]/10">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.6875rem] uppercase text-[#FF3864] tracking-wider font-semibold">
            {t.pendingAmount}
          </p>
          <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl md:text-3xl mt-1 text-[#FF3864]">
            {formatIndianCurrency(monthlyOverview.totalPending)}
          </p>
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] text-[#6B6860] mt-1">
            {monthlyOverview.pendingCount} pending, {monthlyOverview.partialCount} partial
          </p>
        </div>

        <div className="brutal-card p-4 md:p-5 bg-white">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.6875rem] uppercase text-[#6B6860] tracking-wider">
            {t.collectionRate}
          </p>
          <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl md:text-3xl mt-1 text-[#00875A]">
            {monthlyOverview.collectionRate}%
          </p>
          {/* Progress Bar */}
          <div className="w-full bg-[#E5E4D8] h-2 mt-2 rounded-full overflow-hidden">
            <div
              className="bg-[#00875A] h-full transition-all"
              style={{ width: `${Math.min(100, monthlyOverview.collectionRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2026 Collection Trend Graph */}
      <div className="brutal-card p-5 md:p-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg uppercase tracking-tight">
              {t.collectionTrend} ({year})
            </h2>
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860]">
              Monthly Expected vs Collected comparisons
            </p>
          </div>
          <div className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860]">
            Year Total: <span className="font-bold text-[#0B0906]">{formatIndianCurrency(annualReport.totalCollected)}</span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E4D8" />
              <XAxis dataKey="name" stroke="#6B6860" fontSize={11} />
              <YAxis stroke="#6B6860" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip
                formatter={(val) => [formatIndianCurrency(Number(val) || 0), ""]}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "2px solid #0B0906",
                  boxShadow: "3px 3px 0px 0px #0B0906",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              />
              <Legend />
              <Bar dataKey="Expected" fill="#D4D3C9" />
              <Bar dataKey="Collected" fill="#0B0906" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Modes & Status Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment Modes */}
        <div className="brutal-card p-5 bg-white">
          <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-base uppercase mb-3">
            {t.paymentMethods} ({getMonthName(month)})
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#F5F4EA] border border-[#D4D3C9]">
              <span className="font-[family-name:var(--font-space-grotesk)] font-semibold text-sm">
                💵 CASH
              </span>
              <span className="font-[family-name:var(--font-ibm-plex-mono)] font-bold text-base">
                {formatIndianCurrency(methodStats.cash)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F5F4EA] border border-[#D4D3C9]">
              <span className="font-[family-name:var(--font-space-grotesk)] font-semibold text-sm">
                📱 UPI / QR CODE
              </span>
              <span className="font-[family-name:var(--font-ibm-plex-mono)] font-bold text-base">
                {formatIndianCurrency(methodStats.upi)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F5F4EA] border border-[#D4D3C9]">
              <span className="font-[family-name:var(--font-space-grotesk)] font-semibold text-sm">
                🏦 BANK TRANSFER / NEFT
              </span>
              <span className="font-[family-name:var(--font-ibm-plex-mono)] font-bold text-base">
                {formatIndianCurrency(methodStats.bank)}
              </span>
            </div>
          </div>
        </div>

        {/* Member Status Breakdown */}
        <div className="brutal-card p-5 bg-white">
          <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-base uppercase mb-3">
            {t.statusBreakdown}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#E3FCEF] border border-[#00875A]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#00875A]" />
                <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm text-[#00875A]">
                  {t.filterPaid}
                </span>
              </div>
              <span className="font-[family-name:var(--font-ibm-plex-mono)] font-bold text-base text-[#00875A]">
                {monthlyOverview.paidCount} members
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FFF0B3] border border-[#FFAB00]">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#FFAB00]" />
                <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm text-[#B76E00]">
                  {t.filterPartial}
                </span>
              </div>
              <span className="font-[family-name:var(--font-ibm-plex-mono)] font-bold text-base text-[#B76E00]">
                {monthlyOverview.partialCount} members
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FFEBE6] border border-[#FF3864]">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-[#FF3864]" />
                <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm text-[#FF3864]">
                  {t.filterPending}
                </span>
              </div>
              <span className="font-[family-name:var(--font-ibm-plex-mono)] font-bold text-base text-[#FF3864]">
                {monthlyOverview.pendingCount} members
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Member-wise Detailed Breakdown Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl uppercase tracking-tight">
            Member Collection Details ({getMonthName(month)})
          </h2>
          <div className="relative sm:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6860]"
            />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="brutal-input pl-9 text-xs py-1.5"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="brutal-table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Mobile</th>
                <th>Area</th>
                <th>Pledged</th>
                <th>Paid</th>
                <th>Balance (Baki)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.slice(0, 30).map((record) => (
                <tr key={record.id}>
                  <td className="font-[family-name:var(--font-space-grotesk)] font-semibold">
                    {record.member.name}
                  </td>
                  <td className="font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                    {record.member.phone}
                  </td>
                  <td className="text-sm text-[#6B6860]">
                    {record.member.area || record.member.city}
                  </td>
                  <td className="font-[family-name:var(--font-space-grotesk)] font-semibold">
                    {formatIndianCurrency(record.expected_amount)}
                  </td>
                  <td className="font-[family-name:var(--font-ibm-plex-mono)] text-sm font-bold">
                    {record.paid_amount > 0 ? formatIndianCurrency(record.paid_amount) : "—"}
                  </td>
                  <td className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#FF3864] font-semibold">
                    {record.expected_amount > record.paid_amount
                      ? formatIndianCurrency(record.expected_amount - record.paid_amount)
                      : "✓ NIL"}
                  </td>
                  <td>{getStatusBadge(record.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
