import type { Metadata } from "next";
import Link from "next/link";
import { IslamicCalendarView } from "@/components/marketing/IslamicCalendarView";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Islamic Calendar 2026–2027 • Hijri Calendar 1447–1448 | Quadri Jama Masjid",
  description:
    "Complete Islamic Hijri Calendar for 2026 and 2027 with Ramadan dates, Eid-ul-Fitr, Eid-ul-Adha, Shab-e-Barat, and upcoming festivals from January. Quadri Jama Masjid Deoria.",
};

export default function CalendarPage() {
  return (
    <div className="py-10 md:py-16 bg-[#F5F4EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase font-[family-name:var(--font-space-grotesk)] font-bold text-[#6B6860] hover:text-[#0B0906] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Calendar View */}
        <IslamicCalendarView />
      </div>
    </div>
  );
}
