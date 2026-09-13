import type { Metadata } from "next";
import { Features as FeaturesSection } from "@/components/marketing/Features";
import { FinalCTA } from "@/components/marketing/FinalCTA";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Discover all the features CHANDA offers for Masjid Chanda management — tracking, receipts, reports, and more.",
};

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="grid-bg py-16 md:py-24 border-b-2 border-[#0B0906]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-widest text-[#252BFF] mb-3 block">
            Features
          </span>
          <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6">
            BUILT FOR MASJID
            <br />
            SECRETARIES.
          </h1>
          <p className="text-lg text-[#6B6860] max-w-xl">
            No complex accounting. No unnecessary modules. Just the tools you
            need to manage Chanda clearly.
          </p>
        </div>
      </section>

      <FeaturesSection />
      <FinalCTA />
    </>
  );
}
