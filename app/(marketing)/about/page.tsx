import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about CHANDA — why we built a simple Chanda management platform for Masjids in India.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="grid-bg py-16 md:py-24 border-b-2 border-[#0B0906]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-widest text-[#252BFF] mb-3 block">
            About
          </span>
          <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6">
            ONE SIMPLE MISSION.
          </h1>
          <p className="text-lg text-[#6B6860] max-w-xl">
            Help every Masjid in India keep clear, transparent Chanda records.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl uppercase mb-4">
              The Problem
            </h2>
            <p className="text-[#6B6860] leading-relaxed mb-4">
              Thousands of Masjids across India collect monthly Chanda from their
              community members. Most of them still track everything in paper
              registers, Excel sheets, or WhatsApp messages.
            </p>
            <p className="text-[#6B6860] leading-relaxed">
              This makes it hard to know who has paid, who hasn&apos;t, and how much
              has been collected. It creates confusion, delays, and sometimes
              even distrust within the community.
            </p>
          </div>

          <div className="brutal-card p-6 md:p-8 bg-[#C8FF19]">
            <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl uppercase mb-4">
              The Solution
            </h2>
            <p className="leading-relaxed mb-4">
              CHANDA is a simple, modern tool that does one thing extremely well —
              it helps Masjid secretaries manage monthly Chanda collections
              digitally.
            </p>
            <p className="leading-relaxed">
              Add people. Record payments. Generate receipts. Track what&apos;s
              pending. That&apos;s it. No complex accounting, no unnecessary features.
            </p>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl uppercase mb-4">
              Our Values
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Simplicity",
                  desc: "A secretary should understand the system in 5 minutes.",
                },
                {
                  title: "Transparency",
                  desc: "Clear records build community trust.",
                },
                {
                  title: "Privacy",
                  desc: "Individual financial information stays private.",
                },
                {
                  title: "Trust",
                  desc: "No silent deletions. Every change is logged.",
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="brutal-card p-5"
                >
                  <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase mb-2">
                    {value.title}
                  </h3>
                  <p className="text-[#6B6860] text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl uppercase mb-4">
              Built for India
            </h2>
            <p className="text-[#6B6860] leading-relaxed">
              CHANDA is designed specifically for Masjids in India. Indian currency
              formatting (₹), Hindi-friendly interface planning, mobile-first
              design for on-the-go use, and UPI as a first-class payment method.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
