"use client";

import { motion } from "framer-motion";

export function VideoShowcase() {
  return (
    <section className="py-16 md:py-24 border-t-2 border-[#0B0906]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-widest text-[#252BFF] mb-3 block">
            Complete Transparency
          </span>
          <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4">
            SEE HOW WE MANAGE.
          </h2>
          <p className="text-[#6B6860] text-sm md:text-base">
            Watch how our platform works to keep every Chanda record transparent, simple, and organized for your Masjid.
          </p>
        </div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="brutal-card p-2 md:p-4 max-w-5xl mx-auto bg-white"
        >
          <div className="border-2 border-[#0B0906] bg-black overflow-hidden relative aspect-video">
            <video
              className="w-full h-full object-contain"
              controls
              preload="metadata"
            >
              <source src="/transparency-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
