export type ProductStatus = "live" | "beta" | "custom";

export interface Product {
  slug: string;
  name: string;
  kicker: string;
  summary: string;
  status: ProductStatus;
  icon: string;
  /** Storefront artwork in /public/products */
  image: string;
  bestFor: string;
  highlights: string[];
  modules: string[];
  delivery: string;
  priceNote: string;
  cta: { label: string; href: string };
  meta: string;
}

export const PRODUCTS: Product[] = [
  {
    slug: "educore-sms",
    name: "EduCore SMS",
    kicker: "School & college management",
    summary:
      "Admissions to report cards in one portal for the office, teachers, students and guardians. Fee collection through eSewa, Khalti, bank or cash.",
    status: "live",
    icon: "🎓",
    image: "/products/educore-sms.svg",
    bestFor: "Schools and colleges with 200–3,000 students",
    highlights: [
      "Admissions, students, guardians and documents",
      "Attendance (class + subject) with parent SMS",
      "CDC-based evaluation, GPA and printable report cards",
      "Fees, invoices, fines, receipts and reconciliation",
      "Library, transport, hostel and payroll",
      "Parent portal in Nepali and English",
    ],
    modules: ["Admissions", "Attendance", "Exams", "Fees", "Payroll", "Library", "Transport", "Parent app"],
    delivery: "Live in 3–5 days · data import and training included",
    priceNote: "From NPR 45,000 one-time",
    cta: { label: "Explore EduCore SMS", href: "/catalog/educore-sms" },
    meta: "Live in 3–5 days · no per-student fees",
  },
  {
    slug: "accounting-crm",
    name: "LedgerPro",
    kicker: "Accounting, invoicing & POS",
    summary:
      "Double-entry accounting with multi-organisation support, POS terminals, VAT-ready reports and party ledgers — built for trading and service businesses.",
    status: "live",
    icon: "🧾",
    image: "/products/accounting-crm.svg",
    bestFor: "Retail, wholesale and service businesses with 1–50 staff",
    highlights: [
      "Multi-organisation from a single login",
      "Sales, purchase, credit/debit notes",
      "POS with barcode and multiple registers",
      "Party ledger, aging and statements",
      "VAT return pack and fiscal-year close",
      "Role-based access with an audit trail",
    ],
    modules: ["Invoices", "POS", "Inventory", "Ledgers", "VAT", "Reports", "Users"],
    delivery: "One-time deployment on your server or ours",
    priceNote: "From NPR 45,000 · hosted option NPR 2,500/mo",
    cta: { label: "See LedgerPro", href: "/catalog/accounting-crm" },
    meta: "Multi-organisation · VAT-ready",
  },
  {
    slug: "nidhi-mfms",
    name: "NidhiSuite",
    kicker: "Micro-finance & Nidhi companies",
    summary:
      "Member management, savings, loans, interest schedules, collections and statutory reports for Nidhi and micro-finance institutions.",
    status: "live",
    icon: "🏦",
    image: "/products/nidhi-mfms.svg",
    bestFor: "Nidhi companies and micro-finance cooperatives",
    highlights: [
      "Member KYC and share accounting",
      "Savings, recurring and fixed deposits",
      "Loan origination, EMI schedules, overdue tracking",
      "Field collection app with offline sync",
      "Interest and penal-charge engines",
      "Board-ready MIS and statutory reports",
    ],
    modules: ["Members", "Deposits", "Loans", "Collections", "Interest", "MIS"],
    delivery: "4–6 week implementation with parallel run support",
    priceNote: "Project pricing from NPR 1,50,000",
    cta: { label: "Discuss NidhiSuite", href: "/contact?topic=nidhi" },
    meta: "Compliance-ready reporting",
  },
  {
    slug: "erp-suite",
    name: "ManufactureERP",
    kicker: "Manufacturing & inventory ERP",
    summary:
      "Bills of materials, production orders, stock valuation, purchase cycles and financials for factories and distributors.",
    status: "beta",
    icon: "⚙️",
    image: "/products/erp-suite.svg",
    bestFor: "Small factories and distributors moving off Excel",
    highlights: [
      "Item master with variants and units",
      "BOM and production orders",
      "Stock valuation (FIFO / weighted average)",
      "Purchase requisition to GRN",
      "Costing per batch and job",
      "Role-based approvals",
    ],
    modules: ["Items", "BOM", "Production", "Purchase", "Stock", "Costing"],
    delivery: "Pilot with two clients per quarter",
    priceNote: "Pilot pricing on request",
    cta: { label: "Join the pilot", href: "/contact?topic=erp" },
    meta: "Limited pilot slots",
  },
  {
    slug: "lico-pos",
    name: "Lico POS",
    kicker: "WordPress point of sale",
    summary:
      "A WooCommerce-native POS that runs on the site you already have — offline-capable billing, barcode scanning and stock sync.",
    status: "live",
    icon: "🛒",
    image: "/products/lico-pos.svg",
    bestFor: "WooCommerce shops adding a physical counter",
    highlights: [
      "Barcode scanning and quick keys",
      "Cash, card, QR and split payments",
      "Offline billing that syncs later",
      "Stock and price sync with WooCommerce",
      "Daily Z-report and cashier shifts",
      "Install on any standard WordPress host",
    ],
    modules: ["Billing", "Barcode", "Offline", "Stock", "Reports", "Shifts"],
    delivery: "Instant download · 20-minute install",
    priceNote: "USD 29 regular licence",
    cta: { label: "Get Lico POS", href: "/contact?topic=lico-pos" },
    meta: "WordPress plugin · instant delivery",
  },
  {
    slug: "election-survey",
    name: "BoothTrack",
    kicker: "Election survey & booth management",
    summary:
      "Voter surveys, booth-level data, caste and preference analytics with PDF/Excel reporting for campaign teams.",
    status: "custom",
    icon: "🗳️",
    image: "/products/election-survey.svg",
    bestFor: "Consultants and campaign teams running field surveys",
    highlights: [
      "Offline-capable survey forms",
      "Booth, ward and block hierarchy",
      "Duplicate-entry detection",
      "Preference and caste analytics",
      "Role-scoped access for field staff",
      "Exportable PDF briefs per constituency",
    ],
    modules: ["Surveys", "Booths", "Analytics", "Reports", "Users"],
    delivery: "Configured per campaign",
    priceNote: "Campaign-based pricing",
    cta: { label: "Request a briefing", href: "/contact?topic=election" },
    meta: "Field-tested deployment",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export const STUDIO_STATS = [
  { value: "6+", label: "products in production" },
  { value: "60+", label: "institutions & businesses served" },
  { value: "3–5 days", label: "typical go-live" },
  { value: "Nepal", label: "built, hosted and supported" },
];

