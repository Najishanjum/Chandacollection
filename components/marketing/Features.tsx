"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck,
  History,
  Receipt,
  AlertCircle,
  BarChart3,
  FileSpreadsheet,
} from "lucide-react";

const features = [
  {
    number: "01",
    title: "CHANDA TRACKING",
    description:
      "Track monthly expected and received Chanda. See who has paid, who is partial, and who is still pending.",
    icon: CalendarCheck,
    accent: "bg-[#252BFF]",
    accentText: "text-white",
  },
  {
    number: "02",
    title: "PAYMENT HISTORY",
    description:
      "See every payment made by a person. Monthly view, annual view, complete transparency.",
    icon: History,
    accent: "bg-[#C8FF19]",
    accentText: "text-[#0B0906]",
  },
  {
    number: "03",
    title: "DIGITAL RECEIPTS",
    description:
      "Automatically generate receipts for every payment. Download PDF or share on WhatsApp.",
    icon: Receipt,
    accent: "bg-[#0B0906]",
    accentText: "text-white",
  },
  {
    number: "04",
    title: "PENDING CHANDA",
    description:
      "Know exactly who has pending Chanda this month. Total pending amount at a glance.",
    icon: AlertCircle,
    accent: "bg-[#FF3864]",
    accentText: "text-white",
  },
  {
    number: "05",
    title: "SIMPLE REPORTS",
    description:
      "Understand monthly and yearly collections. No complex accounting — just clear numbers.",
    icon: BarChart3,
    accent: "bg-[#252BFF]",
    accentText: "text-white",
  },
  {
    number: "06",
    title: "EXCEL IMPORT",
    description:
      "Already have a list? Upload your existing Excel file and import all members in seconds.",
    icon: FileSpreadsheet,
    accent: "bg-[#C8FF19]",
    accentText: "text-[#0B0906]",
  },
];

export function Features() {
  return (
    <section className="py-16 md:py-24 border-t-2 border-[#0B0906] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-widest text-[#252BFF] mb-3 block">
            Features
          </span>
          <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight max-w-2xl">
            EVERYTHING A MASJID SECRETARY NEEDS.
          </h2>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="brutal-card brutal-card-hover p-6 md:p-8 group cursor-default"
            >
              {/* Feature Number & Icon */}
              <div className="flex items-start justify-between mb-6">
                <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-4xl text-[#D4D3C9]">
                  {feature.number}
                </span>
                <div
                  className={`w-10 h-10 ${feature.accent} border-2 border-[#0B0906] flex items-center justify-center`}
                >
                  <feature.icon
                    size={20}
                    className={feature.accentText}
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg uppercase mb-2 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-[#6B6860] text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
