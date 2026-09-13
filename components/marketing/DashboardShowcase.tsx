"use client";

import { motion } from "framer-motion";

export function DashboardShowcase() {
  return (
    <section className="py-16 md:py-24 border-t-2 border-[#0B0906]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 md:mb-16 text-center">
          <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-widest text-[#252BFF] mb-3 block">
            Dashboard
          </span>
          <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight">
            SEE EVERYTHING AT A GLANCE.
          </h2>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="brutal-card p-6 md:p-8 max-w-4xl mx-auto"
        >
          {/* Dashboard Header */}
          <div className="mb-6 pb-4 border-b-2 border-[#D4D3C9]">
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-widest text-[#6B6860] mb-1">
              Dashboard
            </p>
            <div className="flex items-center gap-2">
              <span className="text-lg">🕌</span>
              <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl">
                Quadri Jama Masjid
              </h3>
              <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860]">
                • Deoria, Muzaffarpur
              </span>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            {[
              { label: "Total People", value: "850", bg: "bg-[#F5F4EA]" },
              {
                label: "Expected",
                value: "₹4,00,000",
                bg: "bg-[#F5F4EA]",
              },
              {
                label: "Collected",
                value: "₹3,42,500",
                bg: "bg-[#C8FF19]",
              },
              {
                label: "Pending",
                value: "₹57,500",
                bg: "bg-[#FF3864]/10",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className={`${metric.bg} border-2 border-[#0B0906] p-3 md:p-4`}
              >
                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] uppercase tracking-widest text-[#6B6860] mb-1">
                  {metric.label}
                </p>
                <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg md:text-2xl">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-widest text-[#6B6860]">
                September 2026 Collection
              </span>
              <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm">
                85%
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "85%" }}>
                <span className="text-[#0B0906]">85%</span>
              </div>
            </div>
          </div>

          {/* Status Counts */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#C8FF19] border-2 border-[#0B0906] p-3 text-center">
              <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl">
                690
              </p>
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] uppercase tracking-widest">
                Paid
              </p>
            </div>
            <div className="bg-[#FFD966] border-2 border-[#0B0906] p-3 text-center">
              <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl">
                40
              </p>
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] uppercase tracking-widest">
                Partial
              </p>
            </div>
            <div className="bg-[#FF3864]/10 border-2 border-[#0B0906] p-3 text-center">
              <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl">
                120
              </p>
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] uppercase tracking-widest">
                Pending
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
