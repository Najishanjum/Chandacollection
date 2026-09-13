import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid-bg flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-[#0B0906] bg-[#F5F4EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link
            href="/"
            className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl tracking-tight"
          >
            CHANDA
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#D4D3C9] bg-[#F5F4EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-center">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860]">
            © {new Date().getFullYear()} CHANDA
          </p>
        </div>
      </footer>
    </div>
  );
}
