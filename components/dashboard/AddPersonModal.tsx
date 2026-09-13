"use client";

import React, { useState } from "react";
import { X, UserPlus, Phone, MapPin, IndianRupee, Calendar } from "lucide-react";
import { useChandaStore } from "@/lib/chanda-store";
import { useLanguage } from "@/lib/i18n";
import { toast } from "sonner";
import type { Member } from "@/types/database";

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (member: Member) => void;
}

const COMMON_AREAS = [
  "Deoria Baradih",
  "Deoria",
  "Baradih",
  "Quadri Chowk",
  "Muzaffarpur",
  "Gohalpur",
  "Civil Lines",
];

const PRESET_AMOUNTS = [200, 300, 500, 1000, 1500, 2000, 5000];

export function AddPersonModal({ isOpen, onClose, onSuccess }: AddPersonModalProps) {
  const { addMember } = useChandaStore();
  const { t, language } = useLanguage();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Muzaffarpur");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState<number>(500);
  const [startMonth, setStartMonth] = useState<number>(new Date().getMonth() + 1);
  const [startYear, setStartYear] = useState<number>(2026);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = language === "hinglish" ? "Naam likhna zaroori hai" : "Name is required";
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      errs.phone = language === "hinglish" ? "10 digit ka valid mobile number dalein" : "Enter a valid 10-digit mobile number";
    }
    if (!monthlyAmount || monthlyAmount <= 0) {
      errs.monthlyAmount = language === "hinglish" ? "Chanda amount dalein" : "Enter a valid monthly amount";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      const created = addMember({
        name: name.trim(),
        phone: cleanPhone,
        city: city.trim() || "Muzaffarpur",
        area: area.trim() || undefined,
        address: address.trim() || undefined,
        monthly_amount: monthlyAmount,
        start_month: startMonth,
        start_year: startYear,
      });

      toast.success(
        language === "hinglish"
          ? `${created.name} ko kamyabi se jod diya gaya!`
          : language === "hi"
          ? `${created.name} को सफलतापूर्वक जोड़ दिया गया!`
          : `${created.name} added successfully!`
      );

      if (onSuccess) onSuccess(created);
      onClose();
      // Reset form
      setName("");
      setPhone("");
      setArea("");
      setAddress("");
      setMonthlyAmount(500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add person. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B0906]/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border-2 border-[#0B0906] shadow-[8px_8px_0px_0px_#0B0906] my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0B0906] text-white">
          <div className="flex items-center gap-2">
            <UserPlus size={20} className="text-[#C8FF19]" />
            <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg uppercase tracking-tight text-white">
              {t.addPerson}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#C8FF19] transition-colors p-1"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-xs uppercase mb-1 text-[#0B0906]">
              {t.fullName} <span className="text-[#FF3864]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={
                language === "hinglish"
                  ? "Jaise: Md Najish"
                  : language === "hi"
                  ? "जैसे: Md Najish"
                  : "e.g. Md Najish"
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`brutal-input ${errors.name ? "border-[#FF3864]" : ""}`}
            />
            {errors.name && (
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#FF3864] mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-xs uppercase mb-1 text-[#0B0906]">
              {t.mobileNumber} <span className="text-[#FF3864]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#6B6860]">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                required
                placeholder="7631296157"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                className={`brutal-input pl-12 ${errors.phone ? "border-[#FF3864]" : ""}`}
              />
            </div>
            {errors.phone && (
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#FF3864] mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Area / Mohalla & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-xs uppercase mb-1 text-[#0B0906]">
                {t.cityArea}
              </label>
              <input
                type="text"
                list="area-suggestions"
                placeholder="e.g. Deoria Baradih"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="brutal-input"
              />
              <datalist id="area-suggestions">
                {COMMON_AREAS.map((a) => (
                  <option key={a} value={a} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-xs uppercase mb-1 text-[#0B0906]">
                City / Shehar
              </label>
              <input
                type="text"
                placeholder="Muzaffarpur"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="brutal-input"
              />
            </div>
          </div>

          {/* Optional Address */}
          <div>
            <label className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-xs uppercase mb-1 text-[#0B0906]">
              {t.addressOptional}
            </label>
            <input
              type="text"
              placeholder="e.g. House No 1, Quadri Masjid, Deoria"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="brutal-input text-sm"
            />
          </div>

          {/* Monthly Amount */}
          <div>
            <label className="block font-[family-name:var(--font-space-grotesk)] font-semibold text-xs uppercase mb-1 text-[#0B0906]">
              {t.monthlyAmount} <span className="text-[#FF3864]">*</span>
            </label>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setMonthlyAmount(amt)}
                  className={`px-2.5 py-1 text-xs font-[family-name:var(--font-ibm-plex-mono)] font-bold border border-[#0B0906] transition-colors ${
                    monthlyAmount === amt
                      ? "bg-[#C8FF19] text-[#0B0906] shadow-[2px_2px_0px_0px_#0B0906]"
                      : "bg-[#F5F4EA] text-[#0B0906] hover:bg-white"
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-[family-name:var(--font-ibm-plex-mono)] font-bold text-sm text-[#0B0906]">
                ₹
              </span>
              <input
                type="number"
                min={50}
                step={50}
                required
                value={monthlyAmount || ""}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="brutal-input pl-8 font-[family-name:var(--font-space-grotesk)] font-bold text-lg"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4D3C9] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="brutal-btn brutal-btn-white"
              disabled={isSubmitting}
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="brutal-btn brutal-btn-primary"
              disabled={isSubmitting}
            >
              <UserPlus size={16} />
              {isSubmitting ? t.submitting : t.savePerson}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
