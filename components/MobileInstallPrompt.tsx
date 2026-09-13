"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, Sparkles, Share2, PlusSquare, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function MobileInstallPrompt() {
  const { language } = useLanguage();
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Check if dismissed previously
    const dismissed = localStorage.getItem("quadri_masjid_app_install_dismissed");
    if (dismissed) return;

    // Detect mobile device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile =
      /iphone|ipad|ipod|android|blackberry|windows phone/i.test(userAgent) ||
      window.innerWidth < 768;

    if (!isMobile) return;

    // Check if running already as standalone PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // Detect iOS
    const iosDevice = /iphone|ipad|ipod/i.test(userAgent);
    setIsIOS(iosDevice);

    // Listen for beforeinstallprompt event (Android / Chromium)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show popup after 2 seconds on first mobile visit
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setShowPrompt(false);
        localStorage.setItem("quadri_masjid_app_install_dismissed", "true");
      }
      setDeferredPrompt(null);
    } else {
      // Show manual instructions (e.g. For iOS or general mobile browsers)
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("quadri_masjid_app_install_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="relative w-full max-w-md bg-white border-2 border-[#0B0906] shadow-[8px_8px_0px_0px_#C8FF19] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0B0906] text-white">
            <div className="flex items-center gap-2">
              <span className="text-lg">🕌</span>
              <div>
                <h4 className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm text-[#C8FF19] uppercase tracking-wide">
                  Quadri Jama Masjid App
                </h4>
                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[#D4D3C9]">
                  Deoria Baradih, Muzaffarpur
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white hover:text-[#C8FF19] transition-colors p-1"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#C8FF19] text-[#0B0906] border-2 border-[#0B0906] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#0B0906]">
                <Smartphone size={24} />
              </div>
              <div>
                <h5 className="font-[family-name:var(--font-space-grotesk)] font-bold text-base text-[#0B0906]">
                  {language === "hi"
                    ? "फ़ोन में ऐप इंस्टॉल करें"
                    : language === "hinglish"
                    ? "Mobile mein App Download / Install Karein"
                    : "Install App on Your Phone"}
                </h5>
                <p className="font-[family-name:var(--font-space-grotesk)] text-xs text-[#6B6860] mt-0.5">
                  {language === "hi"
                    ? "चंदा रसीद, हिसाब-किताब और इस्लामिक कैलेंडर 2026-2027 कभी भी एक क्लिक में देखें।"
                    : language === "hinglish"
                    ? "Chanda hisab, digital rashid aur Islamic calendar ek click mein apne phone screen par payein."
                    : "Access Chanda records, instant receipts, and Islamic calendar right from your home screen."}
                </p>
              </div>
            </div>

            {/* Benefits Chips */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-[family-name:var(--font-space-grotesk)]">
              <div className="flex items-center gap-1.5 p-1.5 bg-[#F5F4EA] border border-[#0B0906]">
                <span className="text-[#00875A] font-bold">✓</span>
                <span className="text-[#0B0906] font-semibold">Fast & Lightweight</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 bg-[#F5F4EA] border border-[#0B0906]">
                <span className="text-[#00875A] font-bold">✓</span>
                <span className="text-[#0B0906] font-semibold">Offline Access</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 bg-[#F5F4EA] border border-[#0B0906]">
                <span className="text-[#00875A] font-bold">✓</span>
                <span className="text-[#0B0906] font-semibold">WhatsApp Receipts</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 bg-[#F5F4EA] border border-[#0B0906]">
                <span className="text-[#00875A] font-bold">✓</span>
                <span className="text-[#0B0906] font-semibold">Hijri Calendar 1448</span>
              </div>
            </div>

            {/* Step-by-step instructions if needed */}
            {showInstructions && (
              <div className="p-3 bg-[#C8FF19]/20 border-2 border-[#0B0906] mt-2 space-y-1.5 text-xs font-[family-name:var(--font-space-grotesk)]">
                <p className="font-bold text-[#0B0906]">
                  {isIOS ? "How to install on iPhone/iPad:" : "How to install on Android/Chrome:"}
                </p>
                {isIOS ? (
                  <ol className="list-decimal list-inside space-y-1 text-[#0B0906]">
                    <li>
                      Tap the <strong>Share</strong> button ( <Share2 size={12} className="inline" /> ) at the bottom of Safari.
                    </li>
                    <li>
                      Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong> ( <PlusSquare size={12} className="inline" /> ).
                    </li>
                    <li>Tap <strong>&ldquo;Add&rdquo;</strong> in the top right corner.</li>
                  </ol>
                ) : (
                  <ol className="list-decimal list-inside space-y-1 text-[#0B0906]">
                    <li>Tap the three dots ( <strong>⋮</strong> ) in Chrome menu.</li>
                    <li>Tap <strong>&ldquo;Add to Home screen&rdquo;</strong> or <strong>&ldquo;Install app&rdquo;</strong>.</li>
                    <li>Confirm and it will appear on your phone screen.</li>
                  </ol>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="brutal-btn brutal-btn-primary flex-1 justify-center py-2.5 text-xs font-bold"
              >
                <Download size={15} />
                <span>
                  {language === "hi"
                    ? "अभी डाउनलोड / इंस्टॉल करें"
                    : language === "hinglish"
                    ? "Download / Install Karein"
                    : "Download / Install App"}
                </span>
              </button>
              <button
                onClick={handleDismiss}
                className="brutal-btn brutal-btn-white py-2.5 px-3 text-xs"
              >
                {language === "hi" ? "बाद में" : language === "hinglish" ? "Baad Mein" : "Maybe Later"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
