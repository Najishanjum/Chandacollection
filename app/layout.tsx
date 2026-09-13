import type { Metadata } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "CHANDA — Every Chanda. Clearly Recorded.",
    template: "%s | CHANDA",
  },
  description:
    "Simple, modern, mobile-first digital Chanda management for Masjids in India. Track monthly payments, generate receipts, and build transparency.",
  keywords: [
    "chanda",
    "masjid",
    "mosque",
    "donation tracking",
    "payment management",
    "receipts",
    "Islamic finance",
    "community management",
  ],
  authors: [{ name: "CHANDA" }],
  openGraph: {
    title: "CHANDA — Every Chanda. Clearly Recorded.",
    description:
      "Simple, modern, mobile-first digital Chanda management for Masjids in India.",
    type: "website",
    locale: "en_IN",
    siteName: "CHANDA",
  },
  twitter: {
    card: "summary_large_image",
    title: "CHANDA — Every Chanda. Clearly Recorded.",
    description:
      "Simple, modern, mobile-first digital Chanda management for Masjids in India.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { LanguageProvider } from "@/lib/i18n";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-screen">
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "white",
              border: "2px solid #0B0906",
              borderRadius: "0",
              boxShadow: "4px 4px 0 #0B0906",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
