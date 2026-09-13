"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import type { Metadata } from "next";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Demo mode: accept any credentials
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="brutal-card p-6 sm:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl sm:text-3xl uppercase mb-2">
            Sign In
          </h1>
          <p className="text-[#6B6860] text-sm">
            Welcome back. Sign in to manage your Masjid&apos;s Chanda.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="brutal-label block mb-2">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="brutal-input"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="brutal-label block mb-2">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="brutal-input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="brutal-btn brutal-btn-primary w-full"
          >
            {isLoading ? "Signing in..." : "Sign In"}
            <LogIn size={16} />
          </button>
        </form>

        {/* Demo notice */}
        <div className="mt-6 p-3 bg-[#C8FF19] border-2 border-[#0B0906]">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs">
            <strong>Demo Mode:</strong> Enter any email and password to explore
            the dashboard with sample data.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#6B6860]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#252BFF] hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
