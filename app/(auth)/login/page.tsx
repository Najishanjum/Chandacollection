"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Phone, Shield, ArrowRight, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useChandaStore } from "@/lib/chanda-store";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getMemberByPhone, members } = useChandaStore();

  const [activeTab, setActiveTab] = useState<"member" | "secretary">("member");

  // Member form state
  const [memberPhone, setMemberPhone] = useState("");
  const [isMemberLoading, setIsMemberLoading] = useState(false);

  // Secretary form state
  const [secretaryEmail, setSecretaryEmail] = useState("secretary@quadrimasjid.com");
  const [secretaryPassword, setSecretaryPassword] = useState("admin123");
  const [isSecretaryLoading, setIsSecretaryLoading] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "secretary") {
      setActiveTab("secretary");
    } else if (tab === "member") {
      setActiveTab("member");
    }
  }, [searchParams]);

  // Handle Member Mobile Login
  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = memberPhone.replace(/[^0-9]/g, "");

    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsMemberLoading(true);

    setTimeout(() => {
      const found = getMemberByPhone(cleanPhone);
      if (found) {
        toast.success(`Welcome back, ${found.name}!`);
        localStorage.setItem("chanda_active_member_phone", cleanPhone);
        router.push(`/member/portal?phone=${cleanPhone}`);
      } else {
        toast.error(`Mobile number ${cleanPhone} not found in registered members.`);
      }
      setIsMemberLoading(false);
    }, 400);
  };

  // Handle Secretary Email & Password Login
  const handleSecretarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSecretaryLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Welcome back, Secretary!");
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSecretaryLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="brutal-card p-5 sm:p-7 bg-white">
        {/* Header */}
        <div className="mb-6 text-center">
          <span className="text-3xl">🕌</span>
          <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl sm:text-3xl uppercase mt-2 mb-1">
            Quadri Jama Masjid
          </h1>
          <p className="text-[#6B6860] text-xs font-[family-name:var(--font-ibm-plex-mono)]">
            Deoria Baradih, Muzaffarpur • Digital Chanda Portal
          </p>
        </div>

        {/* Dual Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-[#F5F4EA] border-2 border-[#0B0906]">
          <button
            type="button"
            onClick={() => setActiveTab("member")}
            className={`py-2 px-2 text-xs sm:text-sm font-[family-name:var(--font-space-grotesk)] font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "member"
                ? "bg-[#0B0906] text-[#C8FF19] shadow-[2px_2px_0px_0px_#0B0906]"
                : "text-[#6B6860] hover:text-[#0B0906]"
            }`}
          >
            <Phone size={14} />
            <span>Member Login</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("secretary")}
            className={`py-2 px-2 text-xs sm:text-sm font-[family-name:var(--font-space-grotesk)] font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "secretary"
                ? "bg-[#0B0906] text-[#C8FF19] shadow-[2px_2px_0px_0px_#0B0906]"
                : "text-[#6B6860] hover:text-[#0B0906]"
            }`}
          >
            <Shield size={14} />
            <span>Secretary Sign In</span>
          </button>
        </div>

        {/* TAB 1: MEMBER MOBILE LOGIN */}
        {activeTab === "member" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-3 bg-[#C8FF19]/30 border-2 border-[#0B0906]">
              <p className="font-[family-name:var(--font-space-grotesk)] text-xs text-[#0B0906] leading-relaxed">
                <strong>Member Quick Access:</strong> Just enter your 10-digit mobile number to view your full Chanda passbook and receipts. No password needed!
              </p>
            </div>

            <form onSubmit={handleMemberSubmit} className="space-y-4">
              <div>
                <label className="block font-[family-name:var(--font-space-grotesk)] font-bold text-xs uppercase mb-1.5 text-[#0B0906]">
                  Enter Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-[family-name:var(--font-ibm-plex-mono)] font-bold text-sm text-[#6B6860]">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="7631296157"
                    value={memberPhone}
                    onChange={(e) => setMemberPhone(e.target.value.replace(/[^0-9]/g, ""))}
                    className="brutal-input pl-12 font-[family-name:var(--font-space-grotesk)] font-bold text-lg"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isMemberLoading}
                className="brutal-btn brutal-btn-primary w-full justify-center py-2.5 text-sm font-bold shadow-[3px_3px_0px_0px_#0B0906]"
              >
                {isMemberLoading ? "Finding Member..." : "View My Chanda Passbook"}
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Quick Demo Test Numbers */}
            <div className="pt-4 border-t border-[#D4D3C9]">
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] font-bold text-[#6B6860] uppercase mb-1.5">
                Sample Members (Click to Quick Test):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: "Md Najish", phone: "7631296157" },
                  { name: "Md Imran", phone: "9876543210" },
                  { name: "Tarique Anwar", phone: "9876543211" },
                ].map((sample) => (
                  <button
                    key={sample.phone}
                    type="button"
                    onClick={() => {
                      setMemberPhone(sample.phone);
                      localStorage.setItem("chanda_active_member_phone", sample.phone);
                      router.push(`/member/portal?phone=${sample.phone}`);
                      toast.success(`Logged in as ${sample.name}`);
                    }}
                    className="px-2 py-1 bg-[#F5F4EA] hover:bg-[#C8FF19] border border-[#0B0906] text-[11px] font-[family-name:var(--font-space-grotesk)] font-semibold transition-colors"
                  >
                    {sample.name} ({sample.phone})
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SECRETARY EMAIL & PASSWORD LOGIN */}
        {activeTab === "secretary" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-3 bg-[#252BFF]/10 border-2 border-[#0B0906]">
              <p className="font-[family-name:var(--font-space-grotesk)] text-xs text-[#0B0906] leading-relaxed">
                <strong>Secretary Administration:</strong> Sign in with your official email and password to view and manage all members, collections, receipts, and financial reports.
              </p>
            </div>

            <form onSubmit={handleSecretarySubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="brutal-label block mb-1.5">
                  Secretary Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={secretaryEmail}
                  onChange={(e) => setSecretaryEmail(e.target.value)}
                  className="brutal-input text-sm"
                  placeholder="secretary@quadrimasjid.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="brutal-label block mb-1.5">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={secretaryPassword}
                  onChange={(e) => setSecretaryPassword(e.target.value)}
                  className="brutal-input text-sm"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={isSecretaryLoading}
                className="brutal-btn bg-[#252BFF] text-white hover:bg-[#1a20d4] w-full justify-center py-2.5 text-sm font-bold shadow-[3px_3px_0px_0px_#0B0906]"
              >
                {isSecretaryLoading ? "Signing in..." : "Open Full Dashboard"}
                <LogIn size={16} />
              </button>
            </form>

            <div className="p-2.5 bg-[#F5F4EA] border border-[#0B0906] text-center">
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] text-[#6B6860]">
                Demo Secretary: <strong>secretary@quadrimasjid.com</strong> / <strong>admin123</strong>
              </p>
            </div>
          </div>
        )}

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-[#D4D3C9] text-center">
          <Link
            href="/"
            className="font-[family-name:var(--font-space-grotesk)] text-xs text-[#6B6860] hover:text-[#0B0906] transition-colors"
          >
            ← Back to Quadri Masjid Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
