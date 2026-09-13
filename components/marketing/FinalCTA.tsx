"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-16 md:py-24 border-t-2 border-[#0B0906] bg-[#0B0906] text-white grid-bg relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-[#252BFF] opacity-20 transform rotate-12 translate-x-16 -translate-y-8" />
      <div className="absolute bottom-0 left-0 w-24 h-24 md:w-48 md:h-48 bg-[#C8FF19] opacity-15 transform -rotate-12 -translate-x-8 translate-y-8" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6 leading-[0.95]">
            EVERY PAYMENT.
            <br />
            <span className="text-[#C8FF19]">ONE CLEAR RECORD.</span>
          </h2>

          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Bring your Masjid&apos;s Chanda records into one simple, secure place.
          </p>

          <Link
            href="/signup"
            className="brutal-btn brutal-btn-lime brutal-btn-lg inline-flex"
          >
            Create Your Masjid
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
