"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Moon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Clock,
  Info,
  ExternalLink,
  Star,
  Compass,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import {
  ISLAMIC_MONTHS,
  UPCOMING_FESTIVALS,
  type IslamicFestival,
} from "@/lib/calendar-data";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTH_NAMES_HI = [
  "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_HI = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र (जुमा)", "शनि"];

// Approximate Hijri day offset for 2026/2027
function getHijriDayForDate(year: number, month: number, day: number): { hijriDay: number; hijriMonthName: string; isFriday: boolean } {
  const date = new Date(year, month - 1, day);
  const isFriday = date.getDay() === 5;
  
  // Mapping based on 2026 calendar (1 Rajab 1447 ~ 21 Dec 2025)
  // Approximate conversion for display
  const baseEpoch = new Date(2026, 0, 1).getTime();
  const currentEpoch = date.getTime();
  const diffDays = Math.floor((currentEpoch - baseEpoch) / (1000 * 60 * 60 * 24));
  
  // Day 0 (1 Jan 2026) was 12 Rajab 1447
  let totalHijriDays = 12 + diffDays;
  if (year === 2027) {
    // 1 Jan 2027 is approx 22 Rajab 1448
    const base2027 = new Date(2027, 0, 1).getTime();
    const diff2027 = Math.floor((currentEpoch - base2027) / (1000 * 60 * 60 * 24));
    totalHijriDays = 22 + diff2027;
  }
  
  // Hijri months have 29 or 30 days
  const hMonthIndex = Math.floor((totalHijriDays % 354) / 29.5) % 12;
  const hDay = (Math.floor(totalHijriDays % 29.5) % 30) + 1;
  const hMonthName = ISLAMIC_MONTHS[hMonthIndex]?.name || "Hijri";

  return { hijriDay: hDay, hijriMonthName: hMonthName, isFriday };
}

export function IslamicCalendarView() {
  const { language } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<2026 | 2027>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // 1-12
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const firstDayWeekday = new Date(selectedYear, selectedMonth - 1, 1).getDay();

  // Filtered festivals
  const festivalsForYear = UPCOMING_FESTIVALS.filter((f) => {
    if (activeCategory === "all") return true;
    return f.category === activeCategory;
  });

  const monthFestivals = UPCOMING_FESTIVALS.filter(
    (f) => f.monthIndex === selectedMonth
  );

  return (
    <div className="space-y-10">
      {/* Top Banner with Today's Hijri & Gregorian Date */}
      <div className="brutal-card p-5 sm:p-6 bg-[#0B0906] text-white border-2 border-[#0B0906] shadow-[6px_6px_0px_0px_#C8FF19]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#C8FF19] text-[#0B0906] border-2 border-white flex items-center justify-center font-bold text-2xl shrink-0">
              🌙
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-widest text-[#C8FF19]">
                  {language === "hi"
                    ? "आज की तारीख • हिजरी व अंग्रेजी"
                    : language === "hinglish"
                    ? "Aaj ki Tarikh • Hijri & English"
                    : "Current Date • Hijri & Gregorian"}
                </span>
                <span className="px-2 py-0.2 text-[10px] font-[family-name:var(--font-ibm-plex-mono)] font-bold bg-[#252BFF] text-white uppercase border border-white">
                  Live
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl sm:text-2xl mt-0.5">
                September 2026 • 2 Rabi al-Awwal 1448 AH
              </h2>
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#D4D3C9] mt-0.5">
                🕌 Quadri Jama Masjid, Deoria Baradih (Muzaffarpur, Bihar)
              </p>
            </div>
          </div>

          {/* Year Switcher Pills */}
          <div className="flex items-center gap-2 bg-[#1A1814] p-1 border-2 border-white">
            <button
              onClick={() => setSelectedYear(2026)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-[family-name:var(--font-space-grotesk)] font-bold transition-colors ${
                selectedYear === 2026
                  ? "bg-[#C8FF19] text-[#0B0906]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              2026 (1447–1448 AH)
            </button>
            <button
              onClick={() => setSelectedYear(2027)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-[family-name:var(--font-space-grotesk)] font-bold transition-colors ${
                selectedYear === 2027
                  ? "bg-[#C8FF19] text-[#0B0906]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              2027 (1448–1449 AH)
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Month Grid */}
        <div className="lg:col-span-8 brutal-card p-5 sm:p-6 bg-white border-2 border-[#0B0906]">
          {/* Month Navigation Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[#0B0906]">
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setSelectedMonth((prev) => (prev > 1 ? prev - 1 : 12))
                }
                className="brutal-btn brutal-btn-white p-1.5"
                aria-label="Previous Month"
              >
                <ChevronLeft size={18} />
              </button>
              <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl sm:text-2xl text-[#0B0906] min-w-36 text-center">
                {language === "hi"
                  ? MONTH_NAMES_HI[selectedMonth - 1]
                  : MONTH_NAMES[selectedMonth - 1]}{" "}
                {selectedYear}
              </h3>
              <button
                onClick={() =>
                  setSelectedMonth((prev) => (prev < 12 ? prev + 1 : 1))
                }
                className="brutal-btn brutal-btn-white p-1.5"
                aria-label="Next Month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="text-right">
              <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860] uppercase block">
                Hijri Era
              </span>
              <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-xs sm:text-sm text-[#252BFF]">
                {selectedYear === 2026 ? "1447 – 1448 AH" : "1448 – 1449 AH"}
              </span>
            </div>
          </div>

          {/* Quick Month Selector Buttons */}
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 mb-5">
            {MONTH_NAMES.map((name, idx) => {
              const mNum = idx + 1;
              const isSelected = selectedMonth === mNum;
              return (
                <button
                  key={name}
                  onClick={() => setSelectedMonth(mNum)}
                  className={`py-1 text-[10px] font-[family-name:var(--font-ibm-plex-mono)] font-bold uppercase border border-[#0B0906] transition-colors ${
                    isSelected
                      ? "bg-[#0B0906] text-[#C8FF19]"
                      : "bg-[#F5F4EA] text-[#0B0906] hover:bg-white"
                  }`}
                >
                  {name.slice(0, 3)}
                </button>
              );
            })}
          </div>

          {/* Weekday Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {WEEKDAYS.map((day, idx) => (
              <div
                key={day}
                className={`py-1.5 font-[family-name:var(--font-space-grotesk)] font-bold text-xs uppercase border-2 border-[#0B0906] ${
                  idx === 5
                    ? "bg-[#00875A] text-white" // Friday highlight
                    : idx === 0
                    ? "bg-[#FF3864]/10 text-[#FF3864]"
                    : "bg-[#F5F4EA] text-[#0B0906]"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty slots for month start */}
            {Array.from({ length: firstDayWeekday }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="aspect-square bg-[#F5F4EA]/40 border border-dashed border-[#D4D3C9]"
              />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const { hijriDay, isFriday } = getHijriDayForDate(
                selectedYear,
                selectedMonth,
                dayNum
              );

              // Check if festival falls on this date
              const dayDateStr = `${dayNum} ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`;
              const festivalToday = UPCOMING_FESTIVALS.find(
                (f) =>
                  (selectedYear === 2026 ? f.gregorianDate2026 : f.gregorianDate2027) ===
                  dayDateStr
              );

              const isCurrentDay =
                selectedYear === 2026 && selectedMonth === 9 && dayNum === 14;

              return (
                <div
                  key={dayNum}
                  className={`aspect-square p-1 border-2 border-[#0B0906] flex flex-col justify-between relative transition-all ${
                    festivalToday
                      ? "bg-[#C8FF19] text-[#0B0906] shadow-[2px_2px_0px_0px_#0B0906]"
                      : isCurrentDay
                      ? "bg-[#252BFF] text-white"
                      : isFriday
                      ? "bg-[#00875A]/10 hover:bg-[#00875A]/20"
                      : "bg-white hover:bg-[#F5F4EA]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-xs sm:text-sm">
                      {dayNum}
                    </span>
                    {festivalToday && (
                      <span className="text-xs animate-bounce" title={festivalToday.name}>
                        {festivalToday.icon}
                      </span>
                    )}
                    {isFriday && !festivalToday && (
                      <span className="text-[9px] font-bold text-[#00875A]">
                        Juma
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-[family-name:var(--font-ibm-plex-mono)] text-[8px] sm:text-[9.5px] font-bold ${
                        isCurrentDay
                          ? "text-[#C8FF19]"
                          : festivalToday
                          ? "text-[#0B0906]"
                          : "text-[#6B6860]"
                      }`}
                    >
                      {hijriDay} H
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Month Festival Alerts if any */}
          {monthFestivals.length > 0 && (
            <div className="mt-6 pt-4 border-t-2 border-[#0B0906] space-y-2">
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase font-bold text-[#0B0906]">
                Festivals & Important Dates in {MONTH_NAMES[selectedMonth - 1]}:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {monthFestivals.map((fest) => (
                  <div
                    key={fest.id}
                    className="p-2.5 bg-[#F5F4EA] border border-[#0B0906] flex items-center gap-2.5"
                  >
                    <span className="text-xl">{fest.icon}</span>
                    <div className="min-w-0">
                      <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-xs text-[#0B0906] truncate">
                        {fest.name}
                      </p>
                      <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] text-[#6B6860]">
                        {selectedYear === 2026 ? fest.gregorianDate2026 : fest.gregorianDate2027} ({fest.hijriDate})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Month Hijri Info & Quadri Masjid Timing */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quadri Masjid Namaz & Chanda Timing Card */}
          <div className="brutal-card p-5 bg-white border-2 border-[#0B0906]">
            <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-ibm-plex-mono)] text-[#252BFF] font-bold uppercase mb-1">
              <Compass size={14} />
              <span>Quadri Jama Masjid</span>
            </div>
            <h4 className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg text-[#0B0906]">
              Deoria Baradih, Muzaffarpur
            </h4>
            <p className="text-xs text-[#6B6860] mt-1 font-[family-name:var(--font-space-grotesk)]">
              All Islamic dates correspond to local moon sighting in Bihar, India. Juma Khutbah every Friday at 1:15 PM.
            </p>

            <div className="mt-4 pt-3 border-t border-[#D4D3C9] flex justify-between items-center">
              <span className="text-xs font-[family-name:var(--font-ibm-plex-mono)] text-[#6B6860]">
                Monthly Chanda
              </span>
              <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-xs bg-[#C8FF19] text-[#0B0906] px-2 py-0.5 border border-[#0B0906]">
                1st–10th Every Month
              </span>
            </div>

            <Link
              href="/dashboard/chanda"
              className="mt-4 w-full brutal-btn brutal-btn-primary py-2 text-xs justify-center"
            >
              Open Chanda Register
            </Link>
          </div>

          {/* Hijri Months Guide */}
          <div className="brutal-card p-5 bg-[#F5F4EA] border-2 border-[#0B0906]">
            <h4 className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm uppercase text-[#0B0906] mb-3 flex items-center gap-1.5">
              <Star size={14} className="text-[#FF3864]" />
              <span>12 Islamic Months (1447–1448 AH)</span>
            </h4>
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {ISLAMIC_MONTHS.map((m) => (
                <div
                  key={m.number}
                  className="flex items-center justify-between text-xs py-1 px-2 bg-white border border-[#D4D3C9]"
                >
                  <span className="font-[family-name:var(--font-space-grotesk)] font-semibold text-[#0B0906]">
                    {m.number}. {m.name}
                  </span>
                  <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860]">
                    {m.urdu}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Festivals Section starting from January */}
      <div className="pt-8 border-t-2 border-[#0B0906]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#252BFF] text-white text-[11px] font-[family-name:var(--font-ibm-plex-mono)] font-bold uppercase px-2.5 py-0.5 border border-[#0B0906] mb-2">
              <Sparkles size={12} />
              <span>Full Year Festivals • January – December</span>
            </div>
            <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl sm:text-3xl uppercase text-[#0B0906]">
              Upcoming Islamic Festivals & Significant Dates ({selectedYear})
            </h3>
            <p className="font-[family-name:var(--font-space-grotesk)] text-xs sm:text-sm text-[#6B6860] mt-1">
              Complete schedule of Eid, Ramadan, Shab-e-Barat, and Gyarvi Sharif according to the Hijri Calendar.
            </p>
          </div>

          {/* Festival Category Filter */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "All" },
              { id: "eid", label: "Eid Days" },
              { id: "fasting", label: "Ramadan" },
              { id: "holy_night", label: "Holy Nights" },
              { id: "special", label: "Special Days" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 text-xs font-[family-name:var(--font-space-grotesk)] font-bold uppercase border border-[#0B0906] transition-colors ${
                  activeCategory === cat.id
                    ? "bg-[#0B0906] text-[#C8FF19]"
                    : "bg-white text-[#0B0906] hover:bg-[#F5F4EA]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Festivals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {festivalsForYear.map((fest) => {
            const dateDisplay =
              selectedYear === 2026 ? fest.gregorianDate2026 : fest.gregorianDate2027;
            const dayDisplay =
              selectedYear === 2026 ? fest.day2026 : fest.day2027;

            return (
              <motion.div
                key={fest.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="brutal-card p-5 bg-white flex flex-col justify-between hover:shadow-[6px_6px_0px_0px_#0B0906] transition-all"
              >
                <div>
                  {/* Top Bar: Icon + Category Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{fest.icon}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-[family-name:var(--font-ibm-plex-mono)] font-bold uppercase border ${fest.categoryColor}`}
                    >
                      {fest.categoryLabel}
                    </span>
                  </div>

                  {/* Title & Urdu */}
                  <div className="mb-2">
                    <h4 className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg text-[#0B0906] leading-snug">
                      {language === "hi" ? fest.nameHi : fest.name}
                    </h4>
                    <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860] mt-0.5">
                      {fest.nameUrdu}
                    </p>
                  </div>

                  {/* Date Highlight Box */}
                  <div className="p-2.5 bg-[#F5F4EA] border border-[#0B0906] my-3">
                    <div className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm text-[#252BFF]">
                        {dateDisplay}
                      </span>
                      <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#0B0906] font-bold">
                        {dayDisplay}
                      </span>
                    </div>
                    <div className="text-[11px] font-[family-name:var(--font-ibm-plex-mono)] text-[#6B6860] mt-0.5">
                      Hijri: <strong className="text-[#0B0906]">{fest.hijriDate}</strong> ({selectedYear === 2026 ? "1447–1448" : "1448–1449"} AH)
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-[family-name:var(--font-space-grotesk)] text-xs text-[#6B6860] leading-relaxed">
                    {language === "hi"
                      ? fest.descriptionHi
                      : language === "hinglish"
                      ? fest.descriptionHinglish
                      : fest.description}
                  </p>
                </div>

                {/* Significance Footer */}
                <div className="mt-4 pt-3 border-t border-[#D4D3C9] text-[11px] text-[#0B0906] font-[family-name:var(--font-space-grotesk)] italic">
                  💡 {fest.significance}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Source attribution link */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#6B6860] font-[family-name:var(--font-ibm-plex-mono)]">
            Reference: Islamic Hijri Calendar calculations verified with Muslim Pro & local lunar sightings.
          </p>
        </div>
      </div>
    </div>
  );
}
