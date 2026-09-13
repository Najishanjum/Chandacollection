"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export function Hero() {
  return (
    <section className="grid-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight mb-6">
              MANAGE YOUR{" "}
              <span className="inline-block bg-[#C8FF19] px-3 py-1 border-2 border-[#0B0906] -rotate-1">
                CHANDA.
              </span>
              <br />
              NOT THE
              <br />
              PAPERWORK.
            </h1>

            <p className="text-lg md:text-xl text-[#6B6860] max-w-lg mb-8 leading-relaxed">
              Simple digital Chanda management for Masjids — from monthly
              payments to receipts and member history.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/signup"
                className="brutal-btn brutal-btn-primary brutal-btn-lg"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/how-it-works"
                className="brutal-btn brutal-btn-white brutal-btn-lg"
              >
                How It Works
              </Link>
            </div>

            <div className="flex flex-wrap gap-4">
              {["Monthly Tracking", "Digital Receipts", "Payment History"].map(
                (feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1.5 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[#6B6860]"
                  >
                    <Check size={14} className="text-[#252BFF]" />
                    {feature}
                  </span>
                )
              )}
            </div>
          </motion.div>

          {/* Right — Receipt Visual */}
          <motion.div
            initial={{ opacity: 0, rotate: 2, y: 20 }}
            animate={{ opacity: 1, rotate: 1.5, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="receipt-paper p-6 sm:p-8 max-w-sm mx-auto lg:ml-auto transform rotate-1 hover:rotate-0 transition-transform duration-300">
              {/* Receipt Header */}
              <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-[#D4D3C9]">
                <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg uppercase tracking-wide">
                  Quadri Jama Masjid
                </p>
                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860] uppercase tracking-widest mt-1">
                  Deoria, Muzaffarpur
                </p>
              </div>

              {/* Receipt Title */}
              <div className="mb-6">
                <span className="inline-block bg-[#252BFF] text-white font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] uppercase tracking-widest px-2 py-0.5">
                  Chanda Receipt
                </span>
              </div>

              {/* Receipt Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-start">
                  <span className="brutal-label">Name</span>
                  <span className="font-[family-name:var(--font-space-grotesk)] font-semibold text-sm text-right">
                    Noorain Alam
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="brutal-label">For</span>
                  <span className="font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                    September 2026
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="brutal-label">Amount</span>
                  <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl">
                    ₹1,000
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="brutal-label">Payment</span>
                  <span className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase">
                    UPI
                  </span>
                </div>
              </div>

              {/* Receipt Number & Status */}
              <div className="pt-4 border-t-2 border-dashed border-[#D4D3C9] flex justify-between items-center">
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860]">
                  #QJM-000124
                </span>
                <span className="badge badge-paid text-[0.625rem]">
                  ✓ Paid
                </span>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#C8FF19] border-2 border-[#0B0906] -z-10" />
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#252BFF] border-2 border-[#0B0906] -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
