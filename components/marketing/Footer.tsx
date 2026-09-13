import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0B0906] text-white border-t-2 border-[#0B0906]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl mb-3">
              CHANDA
            </h3>
            <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
              Simple, modern, mobile-first digital Chanda management for Masjids
              in India. Every payment. Clearly recorded.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-widest text-gray-500 mb-4">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h4 className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-widest text-gray-500 mb-4">
              Get Started
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-gray-500">
            © {new Date().getFullYear()} CHANDA. All rights reserved.
          </p>
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-gray-600">
            Built for Masjids in India 🕌
          </p>
        </div>
      </div>
    </footer>
  );
}
