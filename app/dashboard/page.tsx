"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Clock,
  BarChart3,
  TrendingUp,
  UserPlus,
  Receipt,
} from "lucide-react";
import { useChandaStore } from "@/lib/chanda-store";
import { useLanguage } from "@/lib/i18n";
import { formatIndianCurrency, getMonthName } from "@/lib/utils";
import { AddPersonModal } from "@/components/dashboard/AddPersonModal";
import { demoUser } from "@/lib/demo-data";

export default function DashboardPage() {
  const { getDashboardMetrics, org } = useChandaStore();
  const { t } = useLanguage();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const month = 9;
  const year = 2026;
  const metrics = getDashboardMetrics(month, year);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-widest text-[#6B6860] mb-1">
          Assalamu Alaikum
        </p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl sm:text-3xl">
          {demoUser.name}
        </h1>
        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860] mt-1">
          🕌 {org.name} • {org.city}
        </p>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          {
            label: t.totalPeople,
            value: metrics.totalPeople.toLocaleString("en-IN"),
            icon: Users,
            bg: "bg-white",
          },
          {
            label: t.expectedThisMonth,
            value: formatIndianCurrency(metrics.expectedThisMonth),
            icon: TrendingUp,
            bg: "bg-white",
          },
          {
            label: t.collected,
            value: formatIndianCurrency(metrics.collectedThisMonth),
            icon: TrendingUp,
            bg: "bg-[#C8FF19]",
          },
          {
            label: t.pendingAmount,
            value: formatIndianCurrency(metrics.pendingThisMonth),
            icon: Clock,
            bg: "bg-[#FF3864]/10",
          },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className={`brutal-card p-4 md:p-5 ${metric.bg}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon size={14} className="text-[#6B6860]" />
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] uppercase tracking-widest text-[#6B6860]">
                {metric.label}
              </p>
            </div>
            <p className="metric-value text-xl md:text-2xl lg:text-3xl">
              {metric.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Collection Progress */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="brutal-card p-5 md:p-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg uppercase">
            {getMonthName(month)} {year} Collection
          </h2>
          <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl">
            {metrics.collectionRate}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar mb-4">
          <div
            className="progress-fill"
            style={{ width: `${metrics.collectionRate}%` }}
          >
            {metrics.collectionRate > 15 && (
              <span className="text-[#0B0906]">{metrics.collectionRate}%</span>
            )}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#C8FF19] border-2 border-[#0B0906] p-3 text-center">
            <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl md:text-2xl">
              {metrics.paidCount}
            </p>
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] uppercase tracking-widest font-semibold">
              {t.filterPaid}
            </p>
          </div>
          <div className="bg-[#FFD966] border-2 border-[#0B0906] p-3 text-center">
            <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl md:text-2xl">
              {metrics.partialCount}
            </p>
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] uppercase tracking-widest font-semibold">
              {t.filterPartial}
            </p>
          </div>
          <div className="bg-[#FF3864]/10 border-2 border-[#0B0906] p-3 text-center">
            <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl md:text-2xl">
              {metrics.pendingCount}
            </p>
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] uppercase tracking-widest font-semibold text-[#FF3864]">
              {t.filterPending}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg uppercase mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="brutal-btn brutal-btn-white w-full text-center justify-center"
          >
            <UserPlus size={16} />
            {t.addPerson}
          </button>
          <Link
            href="/dashboard/chanda"
            className="brutal-btn brutal-btn-primary w-full text-center justify-center"
          >
            <Plus size={16} />
            {t.recordPayment}
          </Link>
          <Link
            href="/dashboard/receipts"
            className="brutal-btn brutal-btn-white w-full text-center justify-center"
          >
            <Receipt size={16} />
            {t.receipts}
          </Link>
          <Link
            href="/dashboard/reports"
            className="brutal-btn brutal-btn-white w-full text-center justify-center"
          >
            <BarChart3 size={16} />
            {t.reports}
          </Link>
        </div>
      </motion.div>

      {/* Record Chanda — Big CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Link
          href="/dashboard/chanda"
          className="brutal-btn brutal-btn-primary brutal-btn-lg w-full text-center justify-center text-lg"
        >
          <Plus size={20} />
          {t.recordPayment}
        </Link>
      </motion.div>

      {/* Add Person Modal */}
      <AddPersonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
