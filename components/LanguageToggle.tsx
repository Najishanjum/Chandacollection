"use client";

import React from "react";
import { useLanguage, type Language } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  const options: { code: Language; label: string; sub: string }[] = [
    { code: "en", label: "EN", sub: "English" },
    { code: "hinglish", label: "Hinglish", sub: "Roman Hindi" },
    { code: "hi", label: "हिन्दी", sub: "Hindi" },
  ];

  return (
    <div className={`inline-flex items-center gap-1 bg-white border-2 border-[#0B0906] p-1 shadow-[2px_2px_0px_0px_#0B0906] ${className}`}>
      <div className="flex items-center pl-1 pr-1.5 text-[#6B6860]">
        <Globe size={14} />
      </div>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLanguage(opt.code)}
            title={opt.sub}
            className={`px-2 py-1 text-xs font-[family-name:var(--font-space-grotesk)] font-bold transition-colors ${
              language === opt.code
                ? "bg-[#0B0906] text-[#C8FF19]"
                : "text-[#0B0906] hover:bg-[#F5F4EA]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
