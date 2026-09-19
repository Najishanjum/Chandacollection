# 🕌 CHANDA (चंदा / مسجد کا چندہ)

> **Every Chanda. Clearly Recorded.**  
> A simple, fast, and mobile-first Chanda management system designed specifically for Masjids and community committees in India.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Problem & Vision

Most Masjids in India manage monthly Chanda (contributions) using paper registers, WhatsApp notes, or mental calculations. This leads to:
* ❌ Lost payment records and forgotten dues
* ❌ Lack of transparency with donors
* ❌ Time-consuming receipt generation
* ❌ Difficulty generating annual/monthly committee reports


**CHANDA** is built to do one thing exceptionally well:  
**Add People → Record Chanda → Track Payments → Generate Receipts → See Reports → Build Transparency.**
This is for uadri jama asjid deoria 
It is deliberately simple, intuitive, and works seamlessly on mobile phones for Masjid Secretaries and Mutawallis.

---

## ✨ Key Features

### 1. 👥 Member / People Management
* **Add Person**: Add members with Full Name, 10-digit Phone Number, Area/Mohalla (with quick locality suggestions), optional address, and monthly pledge amount (quick chips: ₹200, ₹300, ₹500, ₹1000, ₹2000, ₹5000).
* **Automatic Registry**: Automatically generates monthly Chanda records for the entire year upon member creation.
* **Persistent Storage**: Instant client-side state with `localStorage` persistence, plus full backend compatibility.
* **Member Profiles**: Detailed view of each member's monthly breakdown, total paid, total pending, and past payment receipts.

### 2. 💰 Monthly Chanda Registry
* **Quick Status Tracking**: Real-time badges for **Paid (✓ Diya gya)**, **Partial (◐ Aadha jama)**, and **Pending (○ Baki hai / Dena hai)**.
* **Month-by-Month Navigation**: Jump between any month of the year to review collections and balances.
* **Quick Payment Recording**: Log payments with cash, UPI, or bank transfer in seconds.

### 3. 🧾 Official Receipts with WhatsApp & Print/PDF
* **Authentic Masjid Receipt**: Complete with Masjid name, address, receipt number (e.g. `NM-000042`), donor name, phone, area, and contribution month.
* **Amount in Words**: Converts numeric amounts to words in English (*"Five Hundred Rupees Only"*) and Hindi (*"पाँच सौ रुपये मात्र"*).
* **Direct WhatsApp Share**: One-click button that generates a pre-formatted receipt message and opens WhatsApp Web or mobile app directly.
* **Print / Save as PDF**: Clean, print-optimized voucher layout for paper receipts.

### 4. 📊 Financial Reports & Analytics (`/dashboard/reports`)
* **Monthly Financial KPIs**: Expected This Month, Total Collected, Pending Amount, and Collection Rate %.
* **Interactive 12-Month Trends**: Bar chart (powered by Recharts) comparing Expected vs Collected across all 12 months.
* **Payment Mode Breakdown**: Distribution of Cash, UPI/QR, and Bank Transfer collections.
* **Member Collection Registry Table**: Detailed per-member financial ledger with search and filters.
* **Export to Excel (.xlsx)**: Export full collection data directly into Microsoft Excel spreadsheets with SheetJS (`xlsx`).
* **Print Report**: Quick committee-ready financial report printouts.

### 5. 🌐 Trilingual Localization (English, Hinglish / Roman Hindi, and Hindi)
An instant language toggle available in the header and sidebar supporting:
* **English (`EN`)**: Standard English UI.
* **Hinglish / Roman Hindi (`Hinglish`)**: Hindi written in English script as used in everyday communication:
  * *App Name*: **Masjid ka Chanda**
  * *Add Person*: **Naya Member Jodein**
  * *Paid*: **Diya gya**
  * *Pending*: **Baki hai (Dena hai)**
  * *Partial*: **Aadha jama**
  * *Receipts*: **Rashid (Download Karein)**
  * *Reports*: **Hisab Kitab (Reports)**
  * *Monthly Chanda*: **Mahina ka Chanda**
* **हिन्दी (`HI`)**: Full Devanagari Hindi support (*"मस्जिद का चंदा"*, *"नया सदस्य जोड़ें"*, *"जमा हुआ"*, *"बाकी है"*, *"रसीद"*).

### 6. 🔐 Dual-Role Authentication & Member Portal
* **Secretary Login**: Secure access to the full dashboard and management tools.
* **Member Login**: Members can log in securely using just their 10-digit mobile number.
* **Personalized Dashboard**: Members can view their own 12-month Chanda passbook, download past receipts, and track their contributions.

### 7. ☁️ Real-Time Server Synchronization & Gallery
* **Universal Photo Gallery**: Any uploaded image of the Masjid is synced and visible to all users across all devices.
* **Cross-Device Sync**: Data is persisted on a server-side JSON store (via custom API routes), ensuring that members and secretaries always see up-to-date information across different browsers and devices in real-time.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **UI & Language** | [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with Neo-Brutalist design tokens |
| **Icons & Motion** | [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Spreadsheets** | [XLSX (SheetJS)](https://sheetjs.com/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |
| **Database Ready** | [Supabase SSR](https://supabase.com/) client & server integrations |

---

## 📁 Project Structure

```
chanda/
├── app/
│   ├── (auth)/             # Login & Signup flows (Member & Secretary tabs)
│   ├── (marketing)/        # Landing page, Features, How It Works, About, Contact
│   ├── api/                # REST API endpoints (gallery, members, payments)
│   ├── dashboard/          # Secretary Dashboard
│   │   ├── chanda/         # Monthly Chanda registry & quick payment
│   │   ├── payments/       # Full payment ledger & receipt actions
│   │   ├── people/         # Member list & Add Person modal
│   │   │   └── [id]/       # Member profile & payment history
│   │   ├── receipts/       # Receipts browser & printable vouchers
│   │   ├── reports/        # Analytics, Recharts graphs, Excel exports
│   │   ├── layout.tsx      # Responsive dashboard navigation & sidebar
│   │   └── page.tsx        # Executive dashboard overview
│   ├── member/             # Member personalized dashboard and passbook
│   ├── globals.css         # Neo-brutalist theme styles & CSS variables
│   └── layout.tsx          # Root layout with fonts, Toaster & LanguageProvider
├── components/
│   ├── dashboard/
│   │   ├── AddPersonModal.tsx        # Add member modal with validation
│   │   ├── ReceiptModal.tsx          # Official receipt modal with print & WhatsApp
│   │   └── RecordPaymentModal.tsx    # Chanda collection modal
│   ├── marketing/                    # Hero, Features, Showcase, Navbar, Footer
│   └── LanguageToggle.tsx            # Global EN / Hinglish / HI switcher
├── lib/
│   ├── calculations.ts     # Status, collection rate, and balance logic
│   ├── chanda-store.tsx    # Unified reactive store with server polling sync
│   ├── demo-data.ts        # Pre-loaded sample data for testing
│   ├── i18n.tsx            # Localization dictionary & React context
│   ├── number-to-words.ts  # Indian currency number-to-words (English & Hindi)
│   ├── server-data.ts      # Server-side filesystem database persistence layer
│   ├── supabase/           # Supabase client, server, and middleware helpers
│   └── utils.ts            # Currency formatter, date helpers, cn utility
└── types/
    └── database.ts         # TypeScript data contracts & database models
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Najishanjum/Chandacollection.git
cd Chandacollection
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.local.example .env.local
```
*(The application works with local persistence out of the box without requiring Supabase credentials)*.

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Key Links & Pages

* **Home & Marketing**: `http://localhost:3000`
* **Dashboard Overview**: `http://localhost:3000/dashboard`
* **Members / People**: `http://localhost:3000/dashboard/people`
* **Chanda Registry**: `http://localhost:3000/dashboard/chanda`
* **Receipts & Downloads**: `http://localhost:3000/dashboard/receipts`
* **Financial Reports**: `http://localhost:3000/dashboard/reports`

---


Najish anjum
## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
