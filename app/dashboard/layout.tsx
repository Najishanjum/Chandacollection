"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Coins,
  CreditCard,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { demoOrg, demoUser } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { AddPersonModal } from "@/components/dashboard/AddPersonModal";

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addPersonOpen, setAddPersonOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { href: "/dashboard", label: t.overview, icon: LayoutDashboard },
    { href: "/dashboard/people", label: t.people, icon: Users },
    { href: "/dashboard/chanda", label: t.chanda, icon: Coins },
    { href: "/dashboard/payments", label: t.payments, icon: CreditCard },
    { href: "/dashboard/receipts", label: t.receipts, icon: Receipt },
    { href: "/dashboard/reports", label: t.reports, icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F4EA]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r-2 border-[#0B0906] bg-white shrink-0 fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b-2 border-[#0B0906]">
          <Link
            href="/dashboard"
            className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl tracking-tight text-[#0B0906]"
          >
            {t.appName}
          </Link>
        </div>

        {/* Masjid Info */}
        <div className="px-5 py-3.5 border-b border-[#D4D3C9] bg-[#F5F4EA]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🕌</span>
            <div>
              <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm leading-tight text-[#0B0906]">
                {demoOrg.name}
              </p>
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] text-[#6B6860] uppercase tracking-wider">
                {demoOrg.city}
              </p>
            </div>
          </div>
        </div>

        {/* Language Switcher on Sidebar */}
        <div className="p-3 border-b border-[#D4D3C9]">
          <LanguageToggle className="w-full justify-between" />
        </div>

        {/* Quick Add Person Action Button */}
        <div className="px-3 pt-3">
          <button
            onClick={() => setAddPersonOpen(true)}
            className="w-full brutal-btn brutal-btn-primary py-2 text-xs justify-center"
          >
            <UserPlus size={14} />
            {t.addPerson}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "sidebar-link text-sm py-2.5",
                  isActive && "sidebar-link-active"
                )}
              >
                <item.icon size={18} />
                <span className="font-[family-name:var(--font-space-grotesk)] font-semibold">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile / Sign Out */}
        <div className="border-t-2 border-[#0B0906] px-5 py-3 bg-[#F5F4EA]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-[family-name:var(--font-space-grotesk)] font-semibold text-sm leading-tight text-[#0B0906]">
                {demoUser.name}
              </p>
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] text-[#6B6860] uppercase">
                {demoUser.role} (Secretary)
              </p>
            </div>
            <Link
              href="/"
              className="p-1.5 hover:bg-white transition-colors border border-transparent hover:border-[#0B0906]"
              title={t.logout}
            >
              <LogOut size={16} className="text-[#6B6860]" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b-2 border-[#0B0906] print:hidden">
        <div className="flex items-center justify-between h-14 px-3 sm:px-4 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 sm:p-1.5 hover:bg-[#F5F4EA] shrink-0"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm shrink-0">🕌</span>
              <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-xs sm:text-sm text-[#0B0906] truncate">
                {demoOrg.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <LanguageToggle />
            <button
              onClick={() => setAddPersonOpen(true)}
              className="w-7 h-7 sm:w-8 sm:h-8 bg-[#252BFF] text-white border-2 border-[#0B0906] shadow-[2px_2px_0px_0px_#0B0906] flex items-center justify-center shrink-0 hover:bg-[#1f24d4] transition-colors"
              title={t.addPerson}
            >
              <UserPlus size={14} className="sm:hidden" />
              <UserPlus size={16} className="hidden sm:block" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white border-r-2 border-[#0B0906] flex flex-col">
            <div className="h-14 flex items-center justify-between px-5 border-b-2 border-[#0B0906]">
              <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg tracking-tight">
                {t.appName}
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <div className="px-5 py-3 border-b border-[#D4D3C9] bg-[#F5F4EA]">
              <div className="flex items-center gap-2">
                <span className="text-lg">🕌</span>
                <div>
                  <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm">
                    {demoOrg.name}
                  </p>
                  <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] text-[#6B6860] uppercase">
                    {demoOrg.city}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 border-b border-[#D4D3C9]">
              <LanguageToggle className="w-full justify-between" />
            </div>

            <div className="p-3">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  setAddPersonOpen(true);
                }}
                className="w-full brutal-btn brutal-btn-primary py-2 text-xs justify-center"
              >
                <UserPlus size={14} />
                {t.addPerson}
              </button>
            </div>

            <nav className="flex-1 py-2 px-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "sidebar-link text-sm py-2.5",
                      isActive && "sidebar-link-active"
                    )}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t-2 border-[#0B0906] px-5 py-3 bg-[#F5F4EA]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-[family-name:var(--font-space-grotesk)] font-semibold text-sm">
                    {demoUser.name}
                  </p>
                  <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem] text-[#6B6860] uppercase">
                    {demoUser.role}
                  </p>
                </div>
                <Link href="/" className="p-1.5" title="Sign out">
                  <LogOut size={16} className="text-[#6B6860]" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t-2 border-[#0B0906] shadow-[0_-2px_6px_rgba(0,0,0,0.05)] print:hidden">
        <div className="grid grid-cols-6 h-14 w-full px-0.5 items-center">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-0.5 min-w-0 w-full overflow-hidden text-center transition-colors",
                  isActive ? "text-[#252BFF]" : "text-[#6B6860] hover:text-[#0B0906]"
                )}
              >
                <item.icon size={17} className="shrink-0" />
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[8px] sm:text-[9.5px] font-semibold uppercase tracking-tighter truncate max-w-full block text-center leading-tight mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom nav spacer */}
      <div className="lg:hidden h-14 print:hidden" />

      {/* Add Person Modal globally accessible from navigation */}
      <AddPersonModal
        isOpen={addPersonOpen}
        onClose={() => setAddPersonOpen(false)}
      />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}
