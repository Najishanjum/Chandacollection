"use client";

import React from "react";
import { useLanguage, type Language } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  const options: { code: Language; label: string; mobileLabel: string; sub: string }[] = [
    { code: "en", label: "EN", mobileLabel: "EN", sub: "English" },
    { code: "hinglish", label: "Hinglish", mobileLabel: "Hing", sub: "Roman Hindi" },
    { code: "hi", label: "हिन्दी", mobileLabel: "हिन्दी", sub: "Hindi" },
  ];

  return (
    <div className={`inline-flex items-center gap-0.5 sm:gap-1 bg-white border-2 border-[#0B0906] p-0.5 sm:p-1 shadow-[2px_2px_0px_0px_#0B0906] shrink-0 ${className}`}>
      <div className="hidden sm:flex items-center pl-1 pr-1 text-[#6B6860]">
        <Globe size={13} />
      </div>
      <div className="flex gap-0.5 sm:gap-1">
        {options.map((opt) => (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLanguage(opt.code)}
            title={opt.sub}
            className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-[family-name:var(--font-space-grotesk)] font-bold transition-colors ${
              language === opt.code
                ? "bg-[#0B0906] text-[#C8FF19]"
                : "text-[#0B0906] hover:bg-[#F5F4EA]"
            }`}
          >
            <span className="sm:hidden">{opt.mobileLabel}</span>
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
