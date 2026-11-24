export interface Plan {
  id: string;
  name: string;
  tagline: string;
  priceNpr: number;
  priceUsd: number;
  period: string;
  students: string;
  featured?: boolean;
  features: string[];
  cta: string;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Small schools finding their feet",
    priceNpr: 45000,
    priceUsd: 349,
    period: "one-time setup",
    students: "up to 300 students",
    features: [
      "Admissions, students & guardians",
      "Attendance (class + subject)",
      "Exams, marks & report cards",
      "Fees, invoices & receipts",
      "SMS + email notifications",
      "1 admin, 10 teacher logins",
      "Free setup & data import",
    ],
    cta: "Start with Starter",
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Most schools pick this",
    priceNpr: 85000,
    priceUsd: 649,
    period: "one-time setup",
    students: "up to 1,200 students",
    featured: true,
    features: [
      "Everything in Starter",
      "Library, transport & hostel",
      "Payroll & staff attendance",
      "Parent portal + mobile view",
      "eSewa / Khalti / bank fee collection",
      "CDC-based evaluation & GPA",
      "Unlimited staff logins",
      "Priority support (2 business hours)",
    ],
    cta: "Choose Growth",
  },
  {
    id: "campus",
    name: "Campus",
    tagline: "Colleges & multi-branch groups",
    priceNpr: 150000,
    priceUsd: 1190,
    period: "one-time setup",
    students: "unlimited students",
    features: [
      "Everything in Growth",
      "Multi-branch / multi-programme",
      "Regional hierarchy (province → ward)",
      "Custom report designer",
      "API access + data export",
      "Dedicated onboarding (2 days)",
      "Named support contact",
      "99.9% uptime deployment",
    ],
    cta: "Talk to sales",
  },
];

export const SUPPORT_ADDON = {
  name: "Care plan",
  priceNpr: 2500,
  priceUsd: 19,
  period: "per month",
  points: ["Updates & backups", "Uptime monitoring", "1 hour of changes", "Same-day replies"],
};

export interface Feature {
  title: string;
  body: string;
  icon: string;
}

export const FEATURES: Feature[] = [
  { title: "Admissions that don't leak", body: "Digital enquiry forms, document uploads and a single approval queue — no more paper registers.", icon: "🎓" },
  { title: "Attendance in seconds", body: "Class and subject-wise attendance with teacher-friendly mobile screens and instant parent SMS.", icon: "✅" },
  { title: "Exams, marks & report cards", body: "CDC-based evaluation, GPA calculation, printable report cards and consolidated analysis.", icon: "📊" },
  { title: "Fees without chasing", body: "Invoices, partial payments, fines, receipts — collected through eSewa, Khalti, bank or cash.", icon: "💳" },
  { title: "Parents in the loop", body: "Parent portal with results, fees, attendance and notices — no group-chat confusion.", icon: "👪" },
  { title: "Staff & payroll", body: "Teacher timetables, leave, salary sheets and staff attendance in the same system.", icon: "🧑‍🏫" },
  { title: "Library & transport", body: "Issue/return tracking, bus routes, stops and student mapping per vehicle.", icon: "🚌" },
  { title: "Your data, your server", body: "Runs on your domain with your database. Export everything, any time — no lock-in.", icon: "🔐" },
];

export const STEPS = [
  { title: "15-minute demo", body: "We walk through your own classes, sections and fee heads — not a generic slideshow." },
  { title: "Setup & import", body: "Students, staff, subjects and opening fee balances are imported by us. Free for every plan." },
  { title: "Staff training", body: "Two live sessions for the office and teachers, plus short videos in Nepali and English." },
  { title: "Go live", body: "We stay with you for the first fee cycle and first exam. Then it's yours." },
];

export const TESTIMONIALS = [
  {
    quote: "Fee collection used to take our office four days after every exam. Now receipts go out the same day and parents get the SMS immediately.",
    name: "Administrator",
    org: "Secondary school · Butwal",
  },
  {
    quote: "Report cards generate themselves. Teachers stopped carrying registers and the principal can see attendance for every section before assembly.",
    name: "Vice Principal",
    org: "College · Chitwan",
  },
  {
    quote: "We moved from Excel in a weekend. The team imported three years of students and opening balances for us.",
    name: "Accountant",
    org: "School group · Pokhara",
  },
];

export const FAQS = [
  { q: "Do we have to pay per student every year?", a: "No. Plans are one-time setup with an optional low-cost care plan for updates, backups and support. You are never billed per student." },
  { q: "Where is the data stored?", a: "On infrastructure you control — your own domain and database, or our managed deployment in your name. You can export everything at any time." },
  { q: "How long does setup take?", a: "Most schools go live in 3–5 working days. Imports, configuration and training are included in every plan." },
  { q: "Can we collect fees online?", a: "Yes — eSewa, Khalti, bank transfer or cash. Receipts are generated automatically and reconciled per student." },
  { q: "What about support after launch?", a: "Email support to support@gmail.com is included for the first year. The care plan adds same-day replies, monitoring and one hour of changes each month." },
  { q: "Can we try it first?", a: "Yes. Book a demo and we will configure a sandbox with your own classes and sections so your team can test it before deciding." },
];

export const TRUST_POINTS = [
  "Live in 3–5 days",
  "Free data import",
  "Training in Nepali & English",
  "No per-student fees",
];
