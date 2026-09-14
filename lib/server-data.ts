import fs from "fs";
import path from "path";
import {
  demoMembers,
  demoChandaRecords,
  demoPayments,
  demoReceipts,
} from "@/lib/demo-data";
import type { Member, ChandaRecord, Payment, Receipt } from "@/types/database";

export interface GalleryPhotoItem {
  id: string;
  src: string;
  title: string;
  uploader: string;
  category: string;
  tag: string;
  tagColor: string;
  location: string;
  date: string;
  created_at: string;
}

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Initial gallery items
const INITIAL_GALLERY: GalleryPhotoItem[] = [
  {
    id: "item-1",
    src: "/images/gallery/quadri-masjid-minarets-sunset.png",
    title: "Twin Minarets at Golden Hour",
    uploader: "Quadri Jama Masjid Committee",
    category: "minarets",
    tag: "Architecture • Minarets",
    tagColor: "bg-[#FF3864] text-white",
    location: "Deoria Baradih, Muzaffarpur",
    date: "September 2026",
    created_at: new Date("2026-09-01T10:00:00Z").toISOString(),
  },
  {
    id: "item-2",
    src: "/images/gallery/quadri-masjid-facade-day.png",
    title: "Masjid Construction & Expansion",
    uploader: "Quadri Jama Masjid Committee",
    category: "construction",
    tag: "Chanda in Action • Tameer",
    tagColor: "bg-[#252BFF] text-white",
    location: "Deoria Baradih, Muzaffarpur",
    date: "Ongoing 2026",
    created_at: new Date("2026-09-05T12:00:00Z").toISOString(),
  },
  {
    id: "item-3",
    src: "/images/gallery/quadri-masjid-sunset-glow.png",
    title: "Dome & Minarets Twilight Panorama",
    uploader: "Quadri Jama Masjid Committee",
    category: "skyline",
    tag: "Spiritual Skyline",
    tagColor: "bg-[#0B0906] text-[#C8FF19]",
    location: "Deoria Baradih, Muzaffarpur",
    date: "September 2026",
    created_at: new Date("2026-09-10T18:00:00Z").toISOString(),
  },
];

// --- GALLERY STORAGE ---
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");

export function getStoredGallery(): GalleryPhotoItem[] {
  ensureDataDir();
  try {
    if (!fs.existsSync(GALLERY_FILE)) {
      fs.writeFileSync(GALLERY_FILE, JSON.stringify(INITIAL_GALLERY, null, 2));
      return INITIAL_GALLERY;
    }
    const raw = fs.readFileSync(GALLERY_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading gallery file:", err);
    return INITIAL_GALLERY;
  }
}

export function saveGalleryPhoto(photo: GalleryPhotoItem): GalleryPhotoItem[] {
  ensureDataDir();
  const current = getStoredGallery();
  const updated = [photo, ...current];
  try {
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(updated, null, 2));
  } catch (err) {
    console.error("Error saving gallery photo:", err);
  }
  return updated;
}

// --- MEMBERS STORAGE ---
const MEMBERS_FILE = path.join(DATA_DIR, "members.json");
const RECORDS_FILE = path.join(DATA_DIR, "records.json");
const PAYMENTS_FILE = path.join(DATA_DIR, "payments.json");
const RECEIPTS_FILE = path.join(DATA_DIR, "receipts.json");

export function getStoredMembers(): {
  members: Member[];
  chandaRecords: ChandaRecord[];
} {
  ensureDataDir();
  let members = demoMembers;
  let chandaRecords = demoChandaRecords;

  try {
    if (fs.existsSync(MEMBERS_FILE)) {
      const raw = fs.readFileSync(MEMBERS_FILE, "utf-8");
      members = JSON.parse(raw);
    } else {
      fs.writeFileSync(MEMBERS_FILE, JSON.stringify(demoMembers, null, 2));
    }

    if (fs.existsSync(RECORDS_FILE)) {
      const raw = fs.readFileSync(RECORDS_FILE, "utf-8");
      chandaRecords = JSON.parse(raw);
    } else {
      fs.writeFileSync(RECORDS_FILE, JSON.stringify(demoChandaRecords, null, 2));
    }
  } catch (err) {
    console.error("Error reading members/records file:", err);
  }

  return { members, chandaRecords };
}

export function saveNewMember(
  newMember: Member,
  newRecords: ChandaRecord[]
): { members: Member[]; chandaRecords: ChandaRecord[] } {
  ensureDataDir();
  const { members, chandaRecords } = getStoredMembers();
  const updatedMembers = [newMember, ...members];
  const updatedRecords = [...newRecords, ...chandaRecords];

  try {
    fs.writeFileSync(MEMBERS_FILE, JSON.stringify(updatedMembers, null, 2));
    fs.writeFileSync(RECORDS_FILE, JSON.stringify(updatedRecords, null, 2));
  } catch (err) {
    console.error("Error writing new member/records:", err);
  }

  return { members: updatedMembers, chandaRecords: updatedRecords };
}

// --- PAYMENTS & RECEIPTS STORAGE ---
export function getStoredPayments(): { payments: Payment[]; receipts: Receipt[] } {
  ensureDataDir();
  let payments = demoPayments;
  let receipts = demoReceipts;

  try {
    if (fs.existsSync(PAYMENTS_FILE)) {
      const raw = fs.readFileSync(PAYMENTS_FILE, "utf-8");
      payments = JSON.parse(raw);
    } else {
      fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(demoPayments, null, 2));
    }

    if (fs.existsSync(RECEIPTS_FILE)) {
      const raw = fs.readFileSync(RECEIPTS_FILE, "utf-8");
      receipts = JSON.parse(raw);
    } else {
      fs.writeFileSync(RECEIPTS_FILE, JSON.stringify(demoReceipts, null, 2));
    }
  } catch (err) {
    console.error("Error reading payments/receipts file:", err);
  }

  return { payments, receipts };
}

export function saveNewPayment(
  newPayment: Payment,
  newReceipt: Receipt,
  updatedRecord?: ChandaRecord
): { payments: Payment[]; receipts: Receipt[] } {
  ensureDataDir();
  const { payments, receipts } = getStoredPayments();
  const updatedPayments = [newPayment, ...payments];
  const updatedReceipts = [newReceipt, ...receipts];

  try {
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(updatedPayments, null, 2));
    fs.writeFileSync(RECEIPTS_FILE, JSON.stringify(updatedReceipts, null, 2));

    if (updatedRecord) {
      const { chandaRecords } = getStoredMembers();
      const updatedRecords = chandaRecords.map((r) =>
        r.id === updatedRecord.id ? updatedRecord : r
      );
      fs.writeFileSync(RECORDS_FILE, JSON.stringify(updatedRecords, null, 2));
    }
  } catch (err) {
    console.error("Error saving payment/receipt:", err);
  }

  return { payments: updatedPayments, receipts: updatedReceipts };
}
