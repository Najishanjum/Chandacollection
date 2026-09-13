"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hinglish" | "hi";

export interface Translations {
  // Brand & Nav
  appName: string;
  appTagline: string;
  overview: string;
  people: string;
  chanda: string;
  payments: string;
  receipts: string;
  reports: string;
  settings: string;
  logout: string;

  // Actions
  addPerson: string;
  recordPayment: string;
  downloadReceipt: string;
  viewReceipt: string;
  shareWhatsApp: string;
  printReceipt: string;
  exportExcel: string;
  searchPlaceholder: string;
  filterAll: string;
  filterPaid: string;
  filterPartial: string;
  filterPending: string;

  // Statuses
  paid: string;
  partial: string;
  pending: string;
  cancelled: string;
  toPay: string;

  // Metrics
  totalPeople: string;
  expectedThisMonth: string;
  collected: string;
  pendingAmount: string;
  collectionRate: string;
  monthlyChanda: string;
  thisMonth: string;
  allMembers: string;

  // Form Fields
  fullName: string;
  mobileNumber: string;
  cityArea: string;
  addressOptional: string;
  monthlyAmount: string;
  startMonth: string;
  cancel: string;
  savePerson: string;
  submitting: string;

  // Receipts
  receiptTitle: string;
  receiptNo: string;
  date: string;
  donorName: string;
  paymentMode: string;
  amountInWords: string;
  amountReceived: string;
  receivedWithThanks: string;
  authorizedSignature: string;
  forMonth: string;

  // Reports
  monthlyReport: string;
  annualOverview: string;
  collectionTrend: string;
  paymentMethods: string;
  totalCollectedYear: string;
  statusBreakdown: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appName: "CHANDA",
    appTagline: "Every Chanda. Clearly Recorded.",
    overview: "Overview",
    people: "People",
    chanda: "Chanda",
    payments: "Payments",
    receipts: "Receipts",
    reports: "Reports",
    settings: "Settings",
    logout: "Log Out",

    addPerson: "Add Person",
    recordPayment: "Record Payment",
    downloadReceipt: "Download Receipt",
    viewReceipt: "View Receipt",
    shareWhatsApp: "Share on WhatsApp",
    printReceipt: "Print / Save PDF",
    exportExcel: "Export to Excel",
    searchPlaceholder: "Search name, mobile or area...",
    filterAll: "All",
    filterPaid: "Paid",
    filterPartial: "Partial",
    filterPending: "Pending",

    paid: "Paid",
    partial: "Partial",
    pending: "Pending",
    cancelled: "Cancelled",
    toPay: "To Pay",

    totalPeople: "Total People",
    expectedThisMonth: "Expected This Month",
    collected: "Collected",
    pendingAmount: "Pending",
    collectionRate: "Collection Rate",
    monthlyChanda: "Monthly Chanda",
    thisMonth: "This Month",
    allMembers: "members",

    fullName: "Full Name",
    mobileNumber: "Mobile Number",
    cityArea: "Area / Mohalla",
    addressOptional: "Address (Optional)",
    monthlyAmount: "Monthly Chanda (₹)",
    startMonth: "Start Month",
    cancel: "Cancel",
    savePerson: "Save Person",
    submitting: "Saving...",

    receiptTitle: "CHANDA RECEIPT",
    receiptNo: "Receipt No.",
    date: "Date",
    donorName: "Donor / Member Name",
    paymentMode: "Payment Mode",
    amountInWords: "Amount in Words",
    amountReceived: "Amount Received",
    receivedWithThanks: "Received with thanks from",
    authorizedSignature: "Secretary / Mutawalli Signature",
    forMonth: "For Month",

    monthlyReport: "Monthly Report",
    annualOverview: "Annual Overview",
    collectionTrend: "Collection Trend",
    paymentMethods: "Payment Modes",
    totalCollectedYear: "Total Collected This Year",
    statusBreakdown: "Payment Status Breakdown",
  },

  hinglish: {
    appName: "Masjid ka Chanda",
    appTagline: "Har Chanda ka Saaf Hisab",
    overview: "Khulasa (Overview)",
    people: "Members / Log",
    chanda: "Chanda Hisab",
    payments: "Aamadani (Payments)",
    receipts: "Rashid (Receipts)",
    reports: "Hisab Kitab (Reports)",
    settings: "Settings",
    logout: "Bahar Niklein",

    addPerson: "Naya Member Jodein",
    recordPayment: "Chanda Jama Karein",
    downloadReceipt: "Rashid Download Karein",
    viewReceipt: "Rashid Dekhein",
    shareWhatsApp: "WhatsApp par Bhejein",
    printReceipt: "Print / PDF Nikalein",
    exportExcel: "Excel File Download Karein",
    searchPlaceholder: "Naam, mobile ya mohalla khojein...",
    filterAll: "Sabhi Log",
    filterPaid: "Diya gya",
    filterPartial: "Aadha diya",
    filterPending: "Baki hai",

    paid: "Diya gya",
    partial: "Aadha jama",
    pending: "Baki hai (Dena hai)",
    cancelled: "Radd hua",
    toPay: "Dena hai",

    totalPeople: "Kul Members",
    expectedThisMonth: "Is Mahine Aana Tha",
    collected: "Kul Jama Hua",
    pendingAmount: "Kul Baki Hai",
    collectionRate: "Vasooli Percentage",
    monthlyChanda: "Mahina ka Chanda",
    thisMonth: "Is Mahine",
    allMembers: "members hain",

    fullName: "Pura Naam",
    mobileNumber: "Mobile Number",
    cityArea: "Mohalla / Area",
    addressOptional: "Pura Pata (Zaroori nahi)",
    monthlyAmount: "Mahina ka Chanda (₹)",
    startMonth: "Shuruat ka Mahina",
    cancel: "Wapas",
    savePerson: "Member Jodein",
    submitting: "Save ho raha hai...",

    receiptTitle: "MASJID CHANDA RASHID",
    receiptNo: "Rashid Number",
    date: "Tarikh",
    donorName: "Member / Madadgar ka Naam",
    paymentMode: "Chanda ka Tariqa",
    amountInWords: "Lafzon mein Raqam",
    amountReceived: "Raqam Mil Gayi",
    receivedWithThanks: "Shukriya ke saath wasool paye",
    authorizedSignature: "Secretary / Mutawalli Dastakhat",
    forMonth: "Kis Mahine ka",

    monthlyReport: "Mahine ka Hisab",
    annualOverview: "Saalana Report",
    collectionTrend: "Chanda Aamadani Graph",
    paymentMethods: "Kismein Chanda Aaya",
    totalCollectedYear: "Is Saal Kul Jama",
    statusBreakdown: "Payment Status Hisab",
  },

  hi: {
    appName: "मस्जिद का चंदा",
    appTagline: "हर चंदे का साफ और पारदर्शी हिसाब",
    overview: "अवलोकन (Overview)",
    people: "सदस्य (People)",
    chanda: "चंदा रजिस्टर",
    payments: "भुगतान (Payments)",
    receipts: "रसीदें (Receipts)",
    reports: "रिपोर्ट्स (Reports)",
    settings: "सेटिंग्स",
    logout: "लॉग आउट",

    addPerson: "नया सदस्य जोड़ें",
    recordPayment: "चंदा दर्ज करें",
    downloadReceipt: "रसीद डाउनलोड करें",
    viewReceipt: "रसीद देखें",
    shareWhatsApp: "व्हाट्सएप पर भेजें",
    printReceipt: "प्रिंट / PDF रसीद",
    exportExcel: "एक्सेल में डाउनलोड करें",
    searchPlaceholder: "नाम, मोबाइल या मोहल्ला खोजें...",
    filterAll: "सभी",
    filterPaid: "जमा हुआ",
    filterPartial: "आंशिक जमा",
    filterPending: "बाकी है",

    paid: "जमा हुआ",
    partial: "आंशिक",
    pending: "बाकी है",
    cancelled: "रद्द",
    toPay: "देना है",

    totalPeople: "कुल सदस्य",
    expectedThisMonth: "इस माह अपेक्षित",
    collected: "कुल जमा",
    pendingAmount: "कुल बाकी",
    collectionRate: "संग्रह दर",
    monthlyChanda: "मासिक चंदा",
    thisMonth: "इस माह",
    allMembers: "सदस्य",

    fullName: "पूरा नाम",
    mobileNumber: "मोबाइल नंबर",
    cityArea: "मोहल्ला / क्षेत्र",
    addressOptional: "पता (वैकल्पिक)",
    monthlyAmount: "मासिक चंदा राशि (₹)",
    startMonth: "आरंभ माह",
    cancel: "रद्द करें",
    savePerson: "सदस्य सुरक्षित करें",
    submitting: "सुरक्षित हो रहा है...",

    receiptTitle: "मस्जिद चंदा रसीद",
    receiptNo: "रसीद क्र.",
    date: "दिनांक",
    donorName: "दानदाता / सदस्य का नाम",
    paymentMode: "भुगतान विधि",
    amountInWords: "शब्दों में राशि",
    amountReceived: "प्राप्त राशि",
    receivedWithThanks: "सधन्यवाद प्राप्त किया",
    authorizedSignature: "सचिव / मुतवल्ली हस्ताक्षर व मुहर",
    forMonth: "माह हेतु",

    monthlyReport: "मासिक रिपोर्ट",
    annualOverview: "वार्षिक विवरण",
    collectionTrend: "संग्रह रुझान",
    paymentMethods: "भुगतान माध्यम",
    totalCollectedYear: "इस वर्ष कुल जमा",
    statusBreakdown: "भुगतान स्थिति विवरण",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("chanda_language") as Language;
      if (saved && ["en", "hinglish", "hi"].includes(saved)) {
        setLanguageState(saved);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("chanda_language", lang);
    } catch {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
