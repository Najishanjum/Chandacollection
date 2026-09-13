"use client";

import { motion } from "framer-motion";
import { Users, CreditCard, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "ADD PEOPLE",
    description:
      "Keep your Masjid's Chanda members organized. Name, mobile number, area and monthly Chanda amount — that's all you need.",
    icon: Users,
  },
  {
    number: "02",
    title: "RECORD CHANDA",
    description:
      "Record monthly payments in seconds. Search a person, enter the amount, select the payment method — done.",
    icon: CreditCard,
  },
  {
    number: "03",
    title: "TRACK EVERYTHING",
    description:
      "See payments, pending amounts, receipts and history. Know exactly what came in and what's still pending.",
    icon: BarChart3,
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 border-t-2 border-[#0B0906]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-widest text-[#252BFF] mb-3 block">
            How It Works
          </span>
          <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight">
            THREE SIMPLE STEPS.
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="brutal-card p-6 md:p-8"
            >
              {/* Number */}
              <div className="font-[family-name:var(--font-space-grotesk)] font-bold text-6xl md:text-7xl text-[#D4D3C9] mb-4 leading-none">
                {step.number}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 bg-[#C8FF19] border-2 border-[#0B0906] flex items-center justify-center mb-4">
                <step.icon size={24} strokeWidth={2.5} />
              </div>

              {/* Content */}
              <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl uppercase mb-3">
                {step.title}
              </h3>
              <p className="text-[#6B6860] text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
