"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/lib/i18n";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 bg-[#F5F4EA] border-b-2 border-[#0B0906]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg sm:text-xl tracking-tight flex items-center gap-1.5"
          >
            <span>🕌</span>
            <span>{t.appName}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/#gallery"
              className="font-[family-name:var(--font-space-grotesk)] font-semibold text-xs uppercase tracking-wider text-[#6B6860] hover:text-[#0B0906] transition-colors flex items-center gap-1"
            >
              <span>Masjid Gallery</span>
              <span className="w-2 h-2 rounded-full bg-[#C8FF19] border border-[#0B0906]" />
            </Link>
            <Link
              href="/calendar"
              className="font-[family-name:var(--font-space-grotesk)] font-semibold text-xs uppercase tracking-wider text-[#6B6860] hover:text-[#0B0906] transition-colors flex items-center gap-1"
            >
              <span>Calendar</span>
              <span className="text-xs">🌙</span>
            </Link>
            <Link
              href="/how-it-works"
              className="font-[family-name:var(--font-space-grotesk)] font-semibold text-xs uppercase tracking-wider text-[#6B6860] hover:text-[#0B0906] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/features"
              className="font-[family-name:var(--font-space-grotesk)] font-semibold text-xs uppercase tracking-wider text-[#6B6860] hover:text-[#0B0906] transition-colors"
            >
              Features
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <LanguageToggle />
            <Link
              href="/login?tab=member"
              className="brutal-btn bg-[#C8FF19] text-[#0B0906] hover:bg-white text-xs py-1.5 px-3 flex items-center gap-1 font-bold"
            >
              <Phone size={13} />
              <span>Member Portal</span>
            </Link>
            <Link
              href="/login?tab=secretary"
              className="brutal-btn bg-[#252BFF] text-white hover:bg-[#1a20d4] text-xs py-1.5 px-3 flex items-center gap-1 font-bold"
            >
              <Shield size={13} />
              <span>Secretary Login</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="brutal-btn brutal-btn-ghost p-2"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t-2 border-[#0B0906] overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 bg-[#F5F4EA]">
              <Link
                href="/login?tab=member"
                onClick={() => setMobileOpen(false)}
                className="brutal-btn bg-[#C8FF19] text-[#0B0906] w-full justify-center py-2.5 text-sm font-bold flex items-center gap-1.5"
              >
                <Phone size={15} />
                <span>📱 Member Login (Mobile Number)</span>
              </Link>
              <Link
                href="/login?tab=secretary"
                onClick={() => setMobileOpen(false)}
                className="brutal-btn bg-[#252BFF] text-white w-full justify-center py-2.5 text-sm font-bold flex items-center gap-1.5"
              >
                <Shield size={15} />
                <span>🔐 Secretary Sign In (Email & Password)</span>
              </Link>

              <div className="pt-2 space-y-2 border-t border-[#D4D3C9]">
                <Link
                  href="/#gallery"
                  onClick={() => setMobileOpen(false)}
                  className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-base uppercase text-[#252BFF]"
                >
                  🕌 Masjid Gallery (Live Photos)
                </Link>
                <Link
                  href="/calendar"
                  onClick={() => setMobileOpen(false)}
                  className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-base uppercase text-[#00875A]"
                >
                  🌙 Islamic Calendar
                </Link>
                <Link
                  href="/how-it-works"
                  onClick={() => setMobileOpen(false)}
                  className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-base uppercase"
                >
                  How It Works
                </Link>
                <Link
                  href="/features"
                  onClick={() => setMobileOpen(false)}
                  className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-base uppercase"
                >
                  Features
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-base uppercase text-[#6B6860]"
                >
                  Dashboard Overview
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
