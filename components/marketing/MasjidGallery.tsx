"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Upload,
  Camera,
  UserCheck,
  User,
  Globe,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { toast } from "sonner";

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  titleHi?: string;
  titleHinglish?: string;
  subtitle?: string;
  subtitleHi?: string;
  subtitleHinglish?: string;
  uploader: string;
  category: string;
  tag: string;
  tagColor: string;
  location: string;
  date: string;
  created_at?: string;
}

const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "item-1",
    src: "/images/gallery/quadri-masjid-minarets-sunset.png",
    title: "Twin Minarets at Golden Hour",
    titleHi: "दो मीनार का नूरानी मंज़र (सूर्यास्त)",
    titleHinglish: "Do Minar ka Noorani Manzar (Sunset)",
    subtitle: "Majestic twin minarets of Quadri Jama Masjid reaching towards the sunset sky in Deoria Baradih.",
    subtitleHi: "देवरिया बाराडीह में सूर्यास्त के समय कुआदरी जामा मस्जिद की शान से खड़ी दो मीनारें।",
    subtitleHinglish: "Deoria Baradih mein shaam ke waqt Quadri Jama Masjid ki shandar do minarein.",
    uploader: "Quadri Jama Masjid Committee",
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
    uploader: "Quadri Jama Masjid Committee",
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
    uploader: "Quadri Jama Masjid Committee",
    category: "skyline",
    tag: "Spiritual Skyline",
    tagColor: "bg-[#0B0906] text-[#C8FF19]",
    location: "Deoria Baradih, Muzaffarpur",
    date: "September 2026",
  },
];

export function MasjidGallery() {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);

  // Form states for upload
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadUploader, setUploadUploader] = useState("");
  const [uploadCategory, setUploadCategory] = useState("construction");
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch photos from server
  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery", { cache: "no-store" });
      const data = await res.json();
      if (data?.success && Array.isArray(data.photos) && data.photos.length > 0) {
        setItems(data.photos);
      }
    } catch (err) {
      console.warn("Could not fetch photos from server:", err);
    }
  }, []);

  // On mount and polling
  useEffect(() => {
    fetchPhotos();

    // Poll every 6 seconds so photos uploaded from other devices appear in real time
    const interval = setInterval(fetchPhotos, 6000);

    const onFocus = () => fetchPhotos();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchPhotos]);

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.category === activeFilter);

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

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadPreview) {
      toast.error("Please select a photo to upload.");
      return;
    }
    if (!uploadTitle.trim()) {
      toast.error("Please enter a title or caption for the photo.");
      return;
    }
    if (!uploadUploader.trim()) {
      toast.error("Please enter your name so everyone knows who uploaded it.");
      return;
    }

    setIsUploading(true);

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          src: uploadPreview,
          title: uploadTitle.trim(),
          uploader: uploadUploader.trim(),
          category: uploadCategory,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload photo");
      }

      // Update state with newly saved photos
      if (Array.isArray(data.photos)) {
        setItems(data.photos);
      } else if (data.photo) {
        setItems((prev) => [data.photo, ...prev]);
      }

      toast.success(
        language === "hi"
          ? `जज़ाकल्लाह! आपकी तस्वीर (${uploadUploader.trim()} द्वारा) सभी डिवाइसेज़ पर लाइव हो गई है।`
          : language === "hinglish"
          ? `JazakAllah Khair! Photo uploaded by ${uploadUploader.trim()} ab sabhi browser aur mobile par dikhegi!`
          : `Photo uploaded by ${uploadUploader.trim()} is now visible across all devices & browsers!`
      );

      // Reset
      setUploadPreview(null);
      setUploadTitle("");
      setUploadUploader("");
      setUploadModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload photo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getLocalizedTitle = (item: GalleryItem) => {
    if (language === "hi" && item.titleHi) return item.titleHi;
    if (language === "hinglish" && item.titleHinglish) return item.titleHinglish;
    return item.title;
  };

  const getLocalizedSubtitle = (item: GalleryItem) => {
    if (language === "hi" && item.subtitleHi) return item.subtitleHi;
    if (language === "hinglish" && item.subtitleHinglish) return item.subtitleHinglish;
    return item.subtitle || `Uploaded by ${item.uploader} • Quadri Jama Masjid Community`;
  };

  // Separate custom community uploads from default items if needed
  const communityUploads = items.filter(
    (i) => i.id.startsWith("photo-") || i.id.startsWith("custom-")
  );

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
                  ? "सार्वजनिक मस्जिद गैलरी • हर डिवाइस पर लाइव"
                  : language === "hinglish"
                  ? "Universal Masjid Gallery • Live on Every Device"
                  : "Authentic Masjid Gallery • Live on All Devices"}
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#0B0906]">
              Quadri Jama Masjid
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-[#6B6860] font-[family-name:var(--font-space-grotesk)] font-medium text-sm sm:text-base">
              <span className="flex items-center gap-1">
                <MapPin size={16} className="text-[#FF3864]" />
                Deoria Baradih, Muzaffarpur, Bihar
              </span>
              <span className="text-xs bg-white border border-[#0B0906] px-2 py-0.5 font-[family-name:var(--font-ibm-plex-mono)] font-semibold">
                PIN: 843120
              </span>
              <span className="text-xs bg-[#252BFF] text-white border border-[#0B0906] px-2 py-0.5 font-[family-name:var(--font-ibm-plex-mono)] font-semibold flex items-center gap-1">
                <Globe size={11} />
                Visible to Everyone
              </span>
            </div>
          </div>

          {/* Action & Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="brutal-btn bg-[#252BFF] text-white py-2 px-3.5 text-xs sm:text-sm flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#0B0906] hover:bg-[#1a20d4] font-bold"
            >
              <Upload size={15} />
              <span>
                {language === "hi"
                  ? "मस्जिद फोटो अपलोड करें (+नाम)"
                  : language === "hinglish"
                  ? "Upload Photo (+Apna Naam)"
                  : "Upload Masjid Photo (+Name)"}
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
          {/* Main Hero Card */}
          {filteredItems[0] && (
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
                  src={filteredItems[0].src}
                  alt={filteredItems[0].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Badges on image */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className={`px-2.5 py-1 text-xs font-[family-name:var(--font-ibm-plex-mono)] font-bold uppercase border border-[#0B0906] ${filteredItems[0].tagColor || "bg-[#252BFF] text-white"}`}>
                    {filteredItems[0].tag}
                  </span>
                  <span className="px-2 py-1 text-[11px] font-[family-name:var(--font-ibm-plex-mono)] font-bold bg-[#C8FF19] text-[#0B0906] border border-[#0B0906] uppercase flex items-center gap-1">
                    <UserCheck size={12} />
                    Uploaded by: {filteredItems[0].uploader}
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
                    {filteredItems[0].location}
                  </span>
                  <span className="bg-[#F5F4EA] px-2 py-0.5 border border-[#D4D3C9] font-bold text-[#0B0906]">
                    Uploaded by: {filteredItems[0].uploader}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl sm:text-2xl text-[#0B0906] mt-1">
                  {getLocalizedTitle(filteredItems[0])}
                </h3>
                <p className="font-[family-name:var(--font-space-grotesk)] text-sm text-[#6B6860] mt-1.5 leading-relaxed">
                  {getLocalizedSubtitle(filteredItems[0])}
                </p>
              </div>
            </motion.div>
          )}

          {/* Right Side 2-Stacked Cards */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {filteredItems.slice(1, 3).map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx + 1) * 0.1 }}
                className="brutal-card p-4 bg-white flex flex-col justify-between group hover:shadow-[6px_6px_0px_0px_#0B0906] transition-all flex-1"
              >
                <div
                  className="relative aspect-[16/9] w-full overflow-hidden border-2 border-[#0B0906] bg-[#0B0906] cursor-pointer"
                  onClick={() => setSelectedImageIndex(idx + 1)}
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75" />

                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                    <span className={`px-2 py-0.5 text-[10px] font-[family-name:var(--font-ibm-plex-mono)] font-bold uppercase border border-[#0B0906] ${item.tagColor || "bg-[#0B0906] text-white"}`}>
                      {item.tag}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-[family-name:var(--font-ibm-plex-mono)] font-bold bg-[#C8FF19] text-[#0B0906] border border-[#0B0906]">
                      By: {item.uploader}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-white text-[#0B0906] border-2 border-[#0B0906] p-1.5 shadow-[2px_2px_0px_0px_#0B0906] group-hover:bg-[#252BFF] group-hover:text-white transition-colors">
                    <Maximize2 size={14} />
                  </div>
                </div>

                <div className="pt-3">
                  <div className="flex items-center justify-between text-[11px] text-[#6B6860] font-[family-name:var(--font-ibm-plex-mono)] mb-0.5">
                    <span className="flex items-center gap-1 font-semibold text-[#0B0906]">
                      <User size={12} className="text-[#252BFF]" />
                      Uploaded by: {item.uploader}
                    </span>
                    <span>{item.date}</span>
                  </div>
                  <h4 className="font-[family-name:var(--font-space-grotesk)] font-bold text-base sm:text-lg text-[#0B0906]">
                    {getLocalizedTitle(item)}
                  </h4>
                  <p className="font-[family-name:var(--font-space-grotesk)] text-xs text-[#6B6860] mt-1 line-clamp-2">
                    {getLocalizedSubtitle(item)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Remaining & Community Uploaded Photos Grid */}
        {filteredItems.length > 3 && (
          <div className="mt-12 pt-8 border-t-2 border-[#0B0906]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <div>
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase font-bold text-[#252BFF] flex items-center gap-1.5">
                  <Globe size={14} />
                  Awaam & Committee Uploads (Live on All Devices)
                </span>
                <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl uppercase text-[#0B0906]">
                  All Masjid Photos ({filteredItems.length})
                </h3>
              </div>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="brutal-btn brutal-btn-primary text-xs py-2 px-3 self-start sm:self-auto"
              >
                + Upload New Photo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredItems.slice(3).map((item, idx) => {
                const globalIdx = idx + 3;
                return (
                  <div
                    key={item.id}
                    className="brutal-card p-3.5 bg-white hover:shadow-[6px_6px_0px_0px_#0B0906] transition-all cursor-pointer group flex flex-col justify-between"
                    onClick={() => setSelectedImageIndex(globalIdx)}
                  >
                    <div>
                      <div className="relative aspect-[16/10] w-full border-2 border-[#0B0906] bg-black overflow-hidden mb-2.5">
                        <Image
                          src={item.src}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                          <span className="px-2 py-0.5 text-[9px] font-[family-name:var(--font-ibm-plex-mono)] font-bold uppercase bg-[#C8FF19] text-[#0B0906] border border-[#0B0906]">
                            By {item.uploader}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm text-[#0B0906] line-clamp-1">
                        {getLocalizedTitle(item)}
                      </h4>
                    </div>
                    <div className="pt-2 mt-2 border-t border-[#D4D3C9] flex items-center justify-between text-[11px] font-[family-name:var(--font-ibm-plex-mono)] text-[#6B6860]">
                      <span className="text-[#252BFF] font-semibold truncate max-w-[120px]">
                        👤 {item.uploader}
                      </span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Community Trust Callout Banner */}
        <div className="mt-12 p-6 sm:p-8 bg-[#0B0906] text-white border-2 border-[#0B0906] shadow-[6px_6px_0px_0px_#C8FF19] flex flex-col md:flex-row items-center justify-between gap-6">
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
                ? "प्रत्येक सदस्य का चंदा पारदर्शी तरीके से डिजिटल रसीद और मासिक रजिस्टर में दर्ज किया जाता है। सदस्य मोबाइल नंबर से लॉगिन करके अपना हिसाब देख सकते हैं।"
                : language === "hinglish"
                ? "Har member apna mobile number daal kar seedhe apna chanda hisab aur rashid dekh sakte hain. Secretary email-password se poora panel sambhalte hain."
                : "Members can enter their mobile number to view their chanda passbook, while the Secretary can manage everything with email and password."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/login?tab=member"
              className="brutal-btn bg-[#C8FF19] text-[#0B0906] border-2 border-white hover:bg-white text-xs sm:text-sm py-2.5 px-4 font-bold flex-1 md:flex-initial justify-center"
            >
              📱 Member Mobile Login
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/login?tab=secretary"
              className="brutal-btn bg-[#252BFF] text-white border-2 border-white hover:bg-[#1a20d4] text-xs sm:text-sm py-2.5 px-4 font-bold flex-1 md:flex-initial justify-center"
            >
              🔐 Secretary Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && filteredItems[selectedImageIndex] && (
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

              {/* Modal Footer Caption with Prominent Uploader Badge */}
              <div className="p-4 sm:p-5 bg-white border-t-2 border-[#0B0906]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-[family-name:var(--font-ibm-plex-mono)] font-bold uppercase border border-[#0B0906] ${filteredItems[selectedImageIndex]?.tagColor || "bg-[#252BFF] text-white"}`}>
                        {filteredItems[selectedImageIndex]?.tag}
                      </span>
                      {/* PROMINENT UPLOADER NAME BADGE */}
                      <span className="px-2.5 py-0.5 text-xs font-[family-name:var(--font-space-grotesk)] font-bold bg-[#C8FF19] text-[#0B0906] border border-[#0B0906] flex items-center gap-1 shadow-[2px_2px_0px_0px_#0B0906]">
                        <UserCheck size={13} />
                        Uploaded by: {filteredItems[selectedImageIndex]?.uploader}
                      </span>
                      <span className="text-xs text-[#6B6860] font-[family-name:var(--font-ibm-plex-mono)]">
                        {selectedImageIndex + 1} / {filteredItems.length}
                      </span>
                    </div>
                    <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg sm:text-xl text-[#0B0906] mt-2">
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

              {/* Informational Banner */}
              <div className="px-5 py-2.5 bg-[#C8FF19]/25 border-b border-[#0B0906] text-xs font-[family-name:var(--font-ibm-plex-mono)] text-[#0B0906] flex items-center gap-2">
                <Globe size={14} className="text-[#252BFF] shrink-0" />
                <span>
                  Photo will be immediately visible to <strong>everyone on every device and browser</strong> with your name credited!
                </span>
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

                {/* Photo Caption / Title */}
                <div>
                  <label className="block font-[family-name:var(--font-space-grotesk)] font-bold text-xs uppercase mb-1 text-[#0B0906]">
                    Photo Caption / Title <span className="text-[#FF3864]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Twin Minarets Sunset / Main Hall Construction"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="brutal-input"
                  />
                </div>

                {/* UPLOADER NAME - MANDATORY & PROMINENT */}
                <div>
                  <label className="block font-[family-name:var(--font-space-grotesk)] font-bold text-xs uppercase mb-1 text-[#0B0906]">
                    Your Name (Uploaded by) <span className="text-[#FF3864]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Md Najish / Tarique Anwar / Member Name"
                      value={uploadUploader}
                      onChange={(e) => setUploadUploader(e.target.value)}
                      className="brutal-input font-[family-name:var(--font-space-grotesk)] font-semibold"
                    />
                  </div>
                  <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] text-[#252BFF] mt-1">
                    ✓ This name will be displayed as &quot;Uploaded by: {uploadUploader || '[Your Name]'}&quot; on all devices and browsers.
                  </p>
                </div>

                {/* Category */}
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
                    {isUploading ? "Uploading..." : "Save to Public Gallery"}
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
