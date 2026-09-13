import type { Metadata } from "next";
import { HowItWorks as HowItWorksSection } from "@/components/marketing/HowItWorks";
import { FinalCTA } from "@/components/marketing/FinalCTA";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how CHANDA helps Masjid secretaries manage monthly Chanda in three simple steps.",
};

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="grid-bg py-16 md:py-24 border-b-2 border-[#0B0906]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-widest text-[#252BFF] mb-3 block">
            How It Works
          </span>
          <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6">
            SIMPLE BY DESIGN.
          </h1>
          <p className="text-lg text-[#6B6860] max-w-xl">
            A Masjid secretary should understand the system within 5 minutes.
            Here&apos;s the entire workflow.
          </p>
        </div>
      </section>

      <HowItWorksSection />

      {/* Detailed Flow */}
      <section className="py-16 md:py-24 border-t-2 border-[#0B0906] bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl sm:text-3xl mb-12 uppercase">
            The Secretary&apos;s Workflow
          </h2>

          <div className="space-y-0">
            {[
              { step: "Login", desc: "Open CHANDA and sign in" },
              { step: "Dashboard", desc: "See this month's collection at a glance" },
              { step: "Record Chanda", desc: "Click the big blue button" },
              { step: "Search Person", desc: "Find by name or mobile number" },
              { step: "Enter Amount", desc: "Amount auto-fills, just confirm" },
              { step: "Select Method", desc: "Cash, UPI, or Bank" },
              { step: "Done", desc: "Payment saved. Receipt generated." },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-4 md:gap-6">
                {/* Line */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-[#0B0906] text-white border-2 border-[#0B0906] flex items-center justify-center font-[family-name:var(--font-space-grotesk)] font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  {i < 6 && (
                    <div className="w-0.5 h-12 bg-[#D4D3C9]" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8">
                  <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg uppercase">
                    {item.step}
                  </h3>
                  <p className="text-[#6B6860] text-sm mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#6B6860] mt-8 border-2 border-[#D4D3C9] bg-[#F5F4EA] p-4">
            Maximum 5–6 clicks from login to receipt. That&apos;s our design
            principle.
          </p>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
