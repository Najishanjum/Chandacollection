"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  Hammer,
  Eye,
  Heart,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  titleHi: string;
  titleHinglish: string;
  subtitle: string;
  subtitleHi: string;
  subtitleHinglish: string;
  category: string;
  tag: string;
  tagColor: string;
  location: string;
  date: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "item-1",
    src: "/images/gallery/quadri-masjid-minarets-sunset.png",
    title: "Twin Minarets at Golden Hour",
    titleHi: "दो मीनार का नूरानी मंज़र (सूर्यास्त)",
    titleHinglish: "Do Minar ka Noorani Manzar (Sunset)",
    subtitle: "Majestic twin minarets of Quadri Jama Masjid reaching towards the sunset sky in Deoria Baradih.",
    subtitleHi: "देवरिया बाराडीह में सूर्यास्त के समय कुआदरी जामा मस्जिद की शान से खड़ी दो मीनारें।",
    subtitleHinglish: "Deoria Baradih mein shaam ke waqt Quadri Jama Masjid ki shandar do minarein.",
    category: "minarets",
    tag: "Architecture • Minarets",
    tagColor: "bg-[#FF3864] text-white",
    location: "Deoria Baradih, Muzaffarpur",
    date: "September 2026",
  },
  {
    id: "item-2",
    src: "/images/gallery/quadri-masjid-facade-day.png",
    title: "Masjid Construction & Expansion",
    titleHi: "मस्जिद तामीर व विस्तार कार्य",
    titleHinglish: "Masjid Tameer-o-Taraqqi Kaam",
    subtitle: "Active construction work on the main prayer hall, ceiling casting, and iconic striped dome funded by community chanda.",
    subtitleHi: "अवामी चंदे से मुख्य नमाज़ हॉल, छत ढलाई और गुंबद का निर्माण कार्य तेज़ी से जारी है।",
    subtitleHinglish: "Awaam ke chande se main namaz hall, chhat aur gumbad ka tameerati kaam jaari hai.",
    category: "construction",
    tag: "Chanda in Action • Tameer",
    tagColor: "bg-[#252BFF] text-white",
    location: "Deoria Baradih, Muzaffarpur",
    date: "Ongoing 2026",
  },
  {
    id: "item-3",
    src: "/images/gallery/quadri-masjid-sunset-glow.png",
    title: "Dome & Minarets Twilight Panorama",
    titleHi: "गुंबद और मीनार का संध्याकालीन दृश्य",
    titleHinglish: "Gumbad aur Minar Shaam ka Manzar",
    subtitle: "A breathtaking twilight capture with vibrant evening clouds embracing the dome and minarets.",
    subtitleHi: "गुंबद और मीनारों के पीछे ढलते सूरज और बादलों की मनमोहक छटा।",
    subtitleHinglish: "Gumbad aur minar ke peeche dhalta sooraj aur aasmaan ka khoobsurat rang.",
    category: "skyline",
    tag: "Spiritual Skyline",
    tagColor: "bg-[#0B0906] text-[#C8FF19]",
    location: "Deoria Baradih, Muzaffarpur",
    date: "September 2026",
  },
];

import { toast } from "sonner";
import {
  Upload,
  Camera,
  Image as ImageIcon,
} from "lucide-react";

export function MasjidGallery() {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [customItems, setCustomItems] = useState<GalleryItem[]>([]);

  // Form states for upload
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadUploader, setUploadUploader] = useState("");
  const [uploadCategory, setUploadCategory] = useState("construction");
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load custom uploads from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("quadri_masjid_custom_photos");
      if (saved) {
        setCustomItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const allItems = [...customItems, ...GALLERY_ITEMS];

  const filteredItems =
    activeFilter === "all"
      ? allItems
      : allItems.filter((item) => item.category === activeFilter);

  const handlePrev = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev! > 0 ? prev! - 1 : filteredItems.length - 1
    );
  };

  const handleNext = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev! < filteredItems.length - 1 ? prev! + 1 : 0
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadPreview) {
      toast.error("Please select a photo to upload.");
      return;
    }
    if (!uploadTitle.trim()) {
      toast.error("Please enter a title or description for the photo.");
      return;
    }

    setIsUploading(true);

    try {
      const newItem: GalleryItem = {
        id: `custom-${Date.now()}`,
        src: uploadPreview,
        title: uploadTitle.trim(),
        titleHi: uploadTitle.trim(),
        titleHinglish: uploadTitle.trim(),
        subtitle: uploadUploader.trim()
          ? `Uploaded by ${uploadUploader.trim()} • Quadri Jama Masjid Community`
          : "Shared by Quadri Jama Masjid community member.",
        subtitleHi: uploadUploader.trim()
          ? `${uploadUploader.trim()} द्वारा अपलोड की गई • कुआदरी जामा मस्जिद`
          : "कुआदरी जामा मस्जिद अवाम द्वारा शेयर की गई तस्वीर।",
        subtitleHinglish: uploadUploader.trim()
          ? `${uploadUploader.trim()} ne upload kiya • Quadri Jama Masjid`
          : "Quadri Jama Masjid community ki taraf se share ki gayi tasveer.",
        category: uploadCategory,
        tag: `Community Upload • ${uploadUploader.trim() || "Member"}`,
        tagColor: "bg-[#252BFF] text-white",
        location: "Deoria Baradih, Muzaffarpur",
        date: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      };

      const updated = [newItem, ...customItems];
      setCustomItems(updated);

      try {
        localStorage.setItem("quadri_masjid_custom_photos", JSON.stringify(updated));
      } catch (storageErr) {
        console.warn("Storage full, kept in current session", storageErr);
      }

      toast.success(
        language === "hi"
          ? "जज़ाकल्लाह! आपकी तस्वीर सफलतापूर्वक अपलोड हो गई है।"
          : language === "hinglish"
          ? "JazakAllah Khair! Aapki photo kamyabi se upload ho gayi!"
          : "JazakAllah Khair! Photo uploaded successfully."
      );

      // Reset
      setUploadPreview(null);
      setUploadTitle("");
      setUploadUploader("");
      setUploadModalOpen(false);
      setIsUploading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload photo. Please try again.");
      setIsUploading(false);
    }
  };

  const getLocalizedTitle = (item: GalleryItem) => {
    if (language === "hi") return item.titleHi;
    if (language === "hinglish") return item.titleHinglish;
    return item.title;
  };

  const getLocalizedSubtitle = (item: GalleryItem) => {
    if (language === "hi") return item.subtitleHi;
    if (language === "hinglish") return item.subtitleHinglish;
    return item.subtitle;
  };

  return (
    <section id="gallery" className="py-16 md:py-24 bg-[#F5F4EA] border-b-2 border-[#0B0906]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#C8FF19] text-[#0B0906] border-2 border-[#0B0906] px-3 py-1 font-[family-name:var(--font-ibm-plex-mono)] font-bold text-xs uppercase tracking-widest mb-3 shadow-[2px_2px_0px_0px_#0B0906]">
              <Sparkles size={14} />
              <span>
                {language === "hi"
                  ? "मस्जिद गैलरी व ताज़ा तस्वीरें"
                  : language === "hinglish"
                  ? "Masjid Gallery & Tameerati Tasveerein"
                  : "Authentic Masjid Gallery"}
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#0B0906]">
              Quadri Jama Masjid
            </h2>
            <div className="flex items-center gap-2 mt-2 text-[#6B6860] font-[family-name:var(--font-space-grotesk)] font-medium text-sm sm:text-base">
              <MapPin size={16} className="text-[#FF3864]" />
              <span>Deoria Baradih, Muzaffarpur, Bihar</span>
              <span className="text-xs bg-white border border-[#0B0906] px-2 py-0.5 font-[family-name:var(--font-ibm-plex-mono)] font-semibold">
                PIN: 843120
              </span>
            </div>
          </div>

          {/* Action & Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="brutal-btn bg-[#252BFF] text-white py-1.5 px-3 text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#0B0906] hover:bg-[#1a20d4] font-bold"
            >
              <Upload size={14} />
              <span>
                {language === "hi"
                  ? "फोटो अपलोड करें"
                  : language === "hinglish"
                  ? "Photo Upload Karein"
                  : "Upload Masjid Photo"}
              </span>
            </button>

            {[
              {
                key: "all",
                label: language === "hi" ? "सभी तस्वीरें" : language === "hinglish" ? "Sabhi Photos" : "All Photos",
              },
              {
                key: "minarets",
                label: language === "hi" ? "मीनारें" : language === "hinglish" ? "Minarein" : "Minarets",
              },
              {
                key: "construction",
                label: language === "hi" ? "तामीर का काम" : language === "hinglish" ? "Tameerati Kaam" : "Construction",
              },
              {
                key: "skyline",
                label: language === "hi" ? "शाम का मंज़र" : language === "hinglish" ? "Shaam ka Manzar" : "Twilight Glow",
              },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-3 py-1.5 text-xs font-[family-name:var(--font-space-grotesk)] font-bold uppercase transition-all border-2 border-[#0B0906] ${
                  activeFilter === f.key
                    ? "bg-[#0B0906] text-[#C8FF19] shadow-[2px_2px_0px_0px_#0B0906]"
                    : "bg-white text-[#0B0906] hover:bg-[#F5F4EA]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Hero Card (Large Feature) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7 brutal-card p-4 sm:p-5 bg-white flex flex-col justify-between group hover:shadow-[8px_8px_0px_0px_#0B0906] transition-all"
          >
            <div
              className="relative aspect-[4/3] w-full overflow-hidden border-2 border-[#0B0906] bg-[#0B0906] cursor-pointer"
              onClick={() => setSelectedImageIndex(0)}
            >
              <Image
                src={GALLERY_ITEMS[0].src}
                alt={GALLERY_ITEMS[0].title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Badges on image */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <span className={`px-2.5 py-1 text-xs font-[family-name:var(--font-ibm-plex-mono)] font-bold uppercase border border-[#0B0906] ${GALLERY_ITEMS[0].tagColor}`}>
                  {GALLERY_ITEMS[0].tag}
                </span>
                <span className="px-2 py-1 text-[11px] font-[family-name:var(--font-ibm-plex-mono)] font-bold bg-[#C8FF19] text-[#0B0906] border border-[#0B0906] uppercase">
                  Featured
                </span>
              </div>

              <div className="absolute bottom-3 right-3 bg-white text-[#0B0906] border-2 border-[#0B0906] p-2 shadow-[2px_2px_0px_0px_#0B0906] group-hover:bg-[#C8FF19] transition-colors">
                <Maximize2 size={16} />
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between text-xs text-[#6B6860] font-[family-name:var(--font-ibm-plex-mono)] mb-1">
                <span className="flex items-center gap-1 font-semibold text-[#0B0906]">
                  <MapPin size={13} className="text-[#FF3864]" />
                  {GALLERY_ITEMS[0].location}
                </span>
                <span>{GALLERY_ITEMS[0].date}</span>
              </div>
              <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl sm:text-2xl text-[#0B0906] mt-1">
                {getLocalizedTitle(GALLERY_ITEMS[0])}
              </h3>
              <p className="font-[family-name:var(--font-space-grotesk)] text-sm text-[#6B6860] mt-1.5 leading-relaxed">
                {getLocalizedSubtitle(GALLERY_ITEMS[0])}
              </p>
            </div>
          </motion.div>

          {/* Right Side 2-Stacked Cards */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Card 2: Construction Work */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="brutal-card p-4 bg-white flex flex-col justify-between group hover:shadow-[6px_6px_0px_0px_#0B0906] transition-all flex-1"
            >
              <div
                className="relative aspect-[16/9] w-full overflow-hidden border-2 border-[#0B0906] bg-[#0B0906] cursor-pointer"
                onClick={() => setSelectedImageIndex(1)}
              >
                <Image
                  src={GALLERY_ITEMS[1].src}
                  alt={GALLERY_ITEMS[1].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

                <div className="absolute top-2.5 left-2.5">
                  <span className={`px-2 py-0.5 text-[10px] font-[family-name:var(--font-ibm-plex-mono)] font-bold uppercase border border-[#0B0906] ${GALLERY_ITEMS[1].tagColor}`}>
                    {GALLERY_ITEMS[1].tag}
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-2.5 bg-white text-[#0B0906] border-2 border-[#0B0906] p-1.5 shadow-[2px_2px_0px_0px_#0B0906] group-hover:bg-[#252BFF] group-hover:text-white transition-colors">
                  <Maximize2 size={14} />
                </div>
              </div>

              <div className="pt-3">
                <div className="flex items-center justify-between text-[11px] text-[#6B6860] font-[family-name:var(--font-ibm-plex-mono)] mb-0.5">
                  <span className="flex items-center gap-1 font-semibold text-[#0B0906]">
                    <Hammer size={12} className="text-[#252BFF]" />
                    Tameerati Kaam
                  </span>
                  <span>{GALLERY_ITEMS[1].date}</span>
                </div>
                <h4 className="font-[family-name:var(--font-space-grotesk)] font-bold text-base sm:text-lg text-[#0B0906]">
                  {getLocalizedTitle(GALLERY_ITEMS[1])}
                </h4>
                <p className="font-[family-name:var(--font-space-grotesk)] text-xs text-[#6B6860] mt-1 line-clamp-2">
                  {getLocalizedSubtitle(GALLERY_ITEMS[1])}
                </p>
              </div>
            </motion.div>

            {/* Card 3: Twilight Panorama */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="brutal-card p-4 bg-white flex flex-col justify-between group hover:shadow-[6px_6px_0px_0px_#0B0906] transition-all flex-1"
            >
              <div
                className="relative aspect-[16/9] w-full overflow-hidden border-2 border-[#0B0906] bg-[#0B0906] cursor-pointer"
                onClick={() => setSelectedImageIndex(2)}
              >
                <Image
                  src={GALLERY_ITEMS[2].src}
                  alt={GALLERY_ITEMS[2].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

                <div className="absolute top-2.5 left-2.5">
                  <span className={`px-2 py-0.5 text-[10px] font-[family-name:var(--font-ibm-plex-mono)] font-bold uppercase border border-[#0B0906] ${GALLERY_ITEMS[2].tagColor}`}>
                    {GALLERY_ITEMS[2].tag}
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-2.5 bg-white text-[#0B0906] border-2 border-[#0B0906] p-1.5 shadow-[2px_2px_0px_0px_#0B0906] group-hover:bg-[#C8FF19] transition-colors">
                  <Maximize2 size={14} />
                </div>
              </div>

              <div className="pt-3">
                <div className="flex items-center justify-between text-[11px] text-[#6B6860] font-[family-name:var(--font-ibm-plex-mono)] mb-0.5">
                  <span className="flex items-center gap-1 font-semibold text-[#0B0906]">
                    <Eye size={12} className="text-[#00875A]" />
                    Skyline View
                  </span>
                  <span>{GALLERY_ITEMS[2].date}</span>
                </div>
                <h4 className="font-[family-name:var(--font-space-grotesk)] font-bold text-base sm:text-lg text-[#0B0906]">
                  {getLocalizedTitle(GALLERY_ITEMS[2])}
                </h4>
                <p className="font-[family-name:var(--font-space-grotesk)] text-xs text-[#6B6860] mt-1 line-clamp-2">
                  {getLocalizedSubtitle(GALLERY_ITEMS[2])}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Community Uploaded Photos Grid (if any) */}
        {customItems.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-[#0B0906]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase font-bold text-[#252BFF]">
                  Awaam ki Taraf Se
                </span>
                <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl uppercase text-[#0B0906]">
                  Community Uploaded Photos ({customItems.length})
                </h3>
              </div>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="brutal-btn brutal-btn-primary text-xs py-1.5 px-3"
              >
                + Add Another
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {customItems.map((cItem, cIdx) => (
                <div
                  key={cItem.id}
                  className="brutal-card p-4 bg-white hover:shadow-[6px_6px_0px_0px_#0B0906] transition-all cursor-pointer group"
                  onClick={() => setSelectedImageIndex(cIdx)}
                >
                  <div className="relative aspect-[16/10] w-full border-2 border-[#0B0906] bg-black overflow-hidden mb-3">
                    <Image
                      src={cItem.src}
                      alt={cItem.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 text-[10px] font-[family-name:var(--font-ibm-plex-mono)] font-bold uppercase bg-[#252BFF] text-white border border-[#0B0906]">
                        Community
                      </span>
                    </div>
                  </div>
                  <h4 className="font-[family-name:var(--font-space-grotesk)] font-bold text-base text-[#0B0906] truncate">
                    {cItem.title}
                  </h4>
                  <p className="font-[family-name:var(--font-space-grotesk)] text-xs text-[#6B6860] mt-1 line-clamp-2">
                    {cItem.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Community Trust Callout Banner */}
        <div className="mt-10 p-6 sm:p-8 bg-[#0B0906] text-white border-2 border-[#0B0906] shadow-[6px_6px_0px_0px_#C8FF19] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[#C8FF19] font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase font-bold tracking-wider mb-1.5">
              <Heart size={14} className="fill-[#C8FF19]" />
              <span>Aapka Chanda, Masjid ki Shaan</span>
            </div>
            <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl sm:text-3xl tracking-tight">
              {language === "hi"
                ? "कुआदरी मस्जिद देवरिया के निर्माण में आपका सहयोग"
                : language === "hinglish"
                ? "Quadri Masjid Deoria ki Tameer mein Aapka Chanda"
                : "Supporting Quadri Masjid Deoria's Construction"}
            </h3>
            <p className="text-[#D4D3C9] text-xs sm:text-sm mt-2 font-[family-name:var(--font-space-grotesk)]">
              {language === "hi"
                ? "प्रत्येक सदस्य का चंदा पारदर्शी तरीके से डिजिटल रसीद और मासिक रजिस्टर में दर्ज किया जाता है। देवरिया बाराडीह मस्जिद से जुड़े रहें।"
                : language === "hinglish"
                ? "Har member ka chanda saaf-suthre tareeqe se digital rashid aur hisab mein darj hota hai. Deoria Baradih masjid ke saath judiye."
                : "Every donation is accounted for with instant digital receipts, WhatsApp confirmation, and a transparent monthly ledger."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/dashboard/chanda"
              className="brutal-btn bg-[#C8FF19] text-[#0B0906] border-2 border-white hover:bg-white text-xs sm:text-sm py-2.5 px-4 font-bold flex-1 md:flex-initial justify-center"
            >
              {language === "hi" ? "चंदा रजिस्टर देखें" : language === "hinglish" ? "Chanda Hisab Dekhein" : "View Chanda Ledger"}
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/dashboard"
              className="brutal-btn bg-[#252BFF] text-white border-2 border-white hover:bg-[#1a20d4] text-xs sm:text-sm py-2.5 px-4 font-bold flex-1 md:flex-initial justify-center"
            >
              {language === "hi" ? "डैशबोर्ड खोलें" : language === "hinglish" ? "Dashboard Kholein" : "Open Dashboard"}
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0B0906]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setSelectedImageIndex(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-white border-2 border-[#0B0906] shadow-[8px_8px_0px_0px_#C8FF19] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0B0906] text-white border-b-2 border-[#0B0906]">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🕌</span>
                  <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm text-[#C8FF19] truncate">
                    Quadri Jama Masjid • {filteredItems[selectedImageIndex]?.location}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedImageIndex(null)}
                  className="p-1 hover:bg-[#252BFF] text-white transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Image Preview Container */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black flex items-center justify-center overflow-hidden">
                <Image
                  src={filteredItems[selectedImageIndex]?.src || ""}
                  alt={filteredItems[selectedImageIndex]?.title || "Masjid Photo"}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />

                {/* Left/Right Nav Buttons */}
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-[#C8FF19] text-[#0B0906] border-2 border-[#0B0906] p-2 transition-colors shadow-[2px_2px_0px_0px_#0B0906]"
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-[#C8FF19] text-[#0B0906] border-2 border-[#0B0906] p-2 transition-colors shadow-[2px_2px_0px_0px_#0B0906]"
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Modal Footer Caption */}
              <div className="p-4 sm:p-5 bg-white border-t-2 border-[#0B0906]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-[family-name:var(--font-ibm-plex-mono)] font-bold uppercase border border-[#0B0906] ${filteredItems[selectedImageIndex]?.tagColor}`}>
                        {filteredItems[selectedImageIndex]?.tag}
                      </span>
                      <span className="text-xs text-[#6B6860] font-[family-name:var(--font-ibm-plex-mono)]">
                        {selectedImageIndex + 1} / {filteredItems.length}
                      </span>
                    </div>
                    <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg sm:text-xl text-[#0B0906] mt-1">
                      {filteredItems[selectedImageIndex] ? getLocalizedTitle(filteredItems[selectedImageIndex]) : ""}
                    </h3>
                  </div>
                  <div className="text-xs text-[#6B6860] font-[family-name:var(--font-ibm-plex-mono)]">
                    {filteredItems[selectedImageIndex]?.date}
                  </div>
                </div>
                <p className="font-[family-name:var(--font-space-grotesk)] text-xs sm:text-sm text-[#6B6860] mt-2">
                  {filteredItems[selectedImageIndex] ? getLocalizedSubtitle(filteredItems[selectedImageIndex]) : ""}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Upload Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0B0906]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setUploadModalOpen(false)}
          >
            <div
              className="relative max-w-lg w-full bg-white border-2 border-[#0B0906] shadow-[8px_8px_0px_0px_#0B0906] my-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#0B0906] text-white border-b-2 border-[#0B0906]">
                <div className="flex items-center gap-2">
                  <span className="text-base">📸</span>
                  <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm sm:text-base text-[#C8FF19] uppercase tracking-wide">
                    {language === "hi"
                      ? "मस्जिद की तस्वीर अपलोड करें"
                      : language === "hinglish"
                      ? "Masjid ki Photo Upload Karein"
                      : "Upload Masjid Photo"}
                  </h3>
                </div>
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="text-white hover:text-[#C8FF19] transition-colors p-1"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleUploadSubmit} className="p-5 sm:p-6 space-y-4">
                {/* File Dropzone & Live Preview */}
                <div>
                  <label className="block font-[family-name:var(--font-space-grotesk)] font-bold text-xs uppercase mb-1.5 text-[#0B0906]">
                    Select Photo <span className="text-[#FF3864]">*</span>
                  </label>

                  {uploadPreview ? (
                    <div className="relative aspect-[16/9] w-full border-2 border-[#0B0906] bg-black overflow-hidden group">
                      <Image
                        src={uploadPreview}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setUploadPreview(null)}
                        className="absolute top-2 right-2 bg-[#FF3864] text-white border border-[#0B0906] p-1.5 text-xs font-bold shadow-[2px_2px_0px_0px_#0B0906]"
                        title="Remove photo"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full aspect-[16/9] border-2 border-dashed border-[#0B0906] bg-[#F5F4EA] hover:bg-white cursor-pointer transition-colors p-4 text-center">
                      <Camera size={32} className="text-[#6B6860] mb-2" />
                      <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm text-[#0B0906]">
                        Click or Drag to Upload Photo
                      </span>
                      <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860] mt-1">
                        PNG, JPG, WEBP up to 5MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </label>
                  )}
                </div>

                {/* Photo Title */}
                <div>
                  <label className="block font-[family-name:var(--font-space-grotesk)] font-bold text-xs uppercase mb-1 text-[#0B0906]">
                    Photo Caption / Title <span className="text-[#FF3864]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Juma Namaz Gathering / Minar Construction"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="brutal-input"
                  />
                </div>

                {/* Uploader Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-[family-name:var(--font-space-grotesk)] font-bold text-xs uppercase mb-1 text-[#0B0906]">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Md Najish"
                      value={uploadUploader}
                      onChange={(e) => setUploadUploader(e.target.value)}
                      className="brutal-input"
                    />
                  </div>

                  <div>
                    <label className="block font-[family-name:var(--font-space-grotesk)] font-bold text-xs uppercase mb-1 text-[#0B0906]">
                      Category
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="brutal-input"
                    >
                      <option value="construction">Tameer / Construction</option>
                      <option value="minarets">Minarets / Architecture</option>
                      <option value="skyline">Skyline / Evening Glow</option>
                      <option value="prayer">Prayer / Namaz</option>
                      <option value="events">Events & Gathering</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D4D3C9] flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="brutal-btn brutal-btn-white flex-1 justify-center py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="brutal-btn brutal-btn-primary flex-1 justify-center py-2 text-xs"
                  >
                    <Upload size={14} />
                    {isUploading ? "Uploading..." : "Save to Gallery"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
