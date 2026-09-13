"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Account created! Welcome to CHANDA.");
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
            Create Account
          </h1>
          <p className="text-[#6B6860] text-sm">
            Set up your Masjid on CHANDA in under a minute.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="signup-name" className="brutal-label block mb-2">
              Your Name
            </label>
            <input
              id="signup-name"
              type="text"
              required
              className="brutal-input"
              placeholder="Md Najish"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="brutal-label block mb-2">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              required
              className="brutal-input"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="brutal-label block mb-2">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              required
              minLength={6}
              className="brutal-input"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <div className="pt-4 border-t-2 border-[#D4D3C9]">
            <p className="brutal-label mb-4">Masjid Details</p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="signup-masjid"
                  className="brutal-label block mb-2"
                >
                  Masjid Name
                </label>
                <input
                  id="signup-masjid"
                  type="text"
                  required
                  className="brutal-input"
                  placeholder="Quadri Jama Masjid"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-city"
                  className="brutal-label block mb-2"
                >
                  City
                </label>
                <input
                  id="signup-city"
                  type="text"
                  required
                  className="brutal-input"
                  placeholder="Muzaffarpur"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="brutal-btn brutal-btn-primary w-full"
          >
            {isLoading ? "Creating Account..." : "Get Started"}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#6B6860]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#252BFF] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
