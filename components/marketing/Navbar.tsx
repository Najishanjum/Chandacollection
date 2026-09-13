"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
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
            className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl tracking-tight flex items-center gap-1.5"
          >
            <span>🕌</span>
            <span>{t.appName}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/how-it-works"
              className="font-[family-name:var(--font-space-grotesk)] font-semibold text-sm uppercase tracking-wider text-[#6B6860] hover:text-[#0B0906] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/features"
              className="font-[family-name:var(--font-space-grotesk)] font-semibold text-sm uppercase tracking-wider text-[#6B6860] hover:text-[#0B0906] transition-colors"
            >
              Features
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            <Link
              href="/dashboard"
              className="font-[family-name:var(--font-space-grotesk)] font-semibold text-sm uppercase tracking-wider text-[#6B6860] hover:text-[#0B0906] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/signup"
              className="brutal-btn brutal-btn-primary text-sm py-2 px-3"
            >
              Get Started
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
                href="/how-it-works"
                onClick={() => setMobileOpen(false)}
                className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-lg uppercase"
              >
                How It Works
              </Link>
              <Link
                href="/features"
                onClick={() => setMobileOpen(false)}
                className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-lg uppercase"
              >
                Features
              </Link>
              <div className="pt-4 border-t-2 border-[#D4D3C9] space-y-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-lg uppercase text-[#6B6860]"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="brutal-btn brutal-btn-primary w-full text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
