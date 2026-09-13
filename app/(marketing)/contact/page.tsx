"use client";

import type { Metadata } from "next";
import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    (e.target as HTMLFormElement).reset();
    setIsSubmitting(false);
  }

  return (
    <>
      {/* Hero */}
      <section className="grid-bg py-16 md:py-24 border-b-2 border-[#0B0906]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-widest text-[#252BFF] mb-3 block">
            Contact
          </span>
          <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6">
            GET IN TOUCH.
          </h1>
          <p className="text-lg text-[#6B6860] max-w-xl">
            Have a question? Want to bring CHANDA to your Masjid? We&apos;d love to
            hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 md:py-24">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="contact-name"
                className="brutal-label block mb-2"
              >
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                className="brutal-input"
                placeholder="Mohammad Ahmed"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="brutal-label block mb-2"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                className="brutal-input"
                placeholder="ahmed@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="contact-masjid"
                className="brutal-label block mb-2"
              >
                Masjid Name (Optional)
              </label>
              <input
                id="contact-masjid"
                type="text"
                className="brutal-input"
                placeholder="Noor Masjid"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="brutal-label block mb-2"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                className="brutal-input resize-none"
                placeholder="How can we help?"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="brutal-btn brutal-btn-primary w-full"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <Send size={16} />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
