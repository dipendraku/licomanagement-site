export interface LegalSection {
  id: string;
  heading: string;
  body: string[];
  bullets?: string[];
}

export interface LegalDoc {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  updated: string;
  sections: LegalSection[];
}

const SUPPORT = "support@gmail.com";

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  terms: {
    slug: "terms",
    title: "Terms of service",
    kicker: "Legal",
    summary:
      "The agreement between your institution and Lico Management for the EduCore SMS licence, onboarding and care plan.",
    updated: "23 November 2026",
    sections: [
      {
        id: "licence",
        heading: "1. The licence",
        body: [
          "A purchase grants your institution a perpetual, non-exclusive right to use the software for its own students, staff and guardians.",
          "One licence covers one campus. Colleges with multiple branches, or groups running several institutions, need the Campus plan or a separate licence per campus.",
        ],
      },
      {
        id: "included",
        heading: "2. What is included",
        body: ["Every plan includes the items below. They are not billed separately and are not optional add-ons hidden behind a paywall."],
        bullets: [
          "Deployment on your domain with your own database",
          "Import of students, staff, subjects and opening fee balances",
          "Two live training sessions (office and teachers) in Nepali or English",
          "Email support for the first twelve months",
          "Data export on request, in Excel or SQL",
        ],
      },
      {
        id: "obligations",
        heading: "3. Your responsibilities",
        body: [
          "You nominate one point of contact who can approve configuration changes and receive support replies.",
          "You keep the credentials for your deployment secure and tell us promptly if an account may be compromised.",
          "You ensure the data you give us (students, guardians, fee records) may lawfully be processed by your institution.",
        ],
      },
      {
        id: "support",
        heading: "4. Support and availability",
        body: [
          "Support runs Sunday to Friday, 09:00–18:00 Nepal time, by email to " + SUPPORT + " and by phone for urgent outages.",
          "For managed deployments we target 99.9% monthly uptime. Planned maintenance is announced at least 24 hours ahead and scheduled outside fee-collection and exam weeks wherever possible.",
        ],
      },
      {
        id: "care-plan",
        heading: "5. Care plan",
        body: [
          "The care plan is optional and billed monthly. It covers updates, backups, uptime monitoring and one hour of changes per month.",
          "Cancel any month; the software continues to work, but you return to best-effort support and take over backups yourself.",
        ],
      },
      {
        id: "liability",
        heading: "6. Liability",
        body: [
          "We do not exclude liability for fraud, death or personal injury caused by negligence.",
          "For everything else, our total liability for any claim is limited to the fees you paid in the twelve months before the claim.",
          "We are not responsible for indirect losses such as lost profit or lost goodwill.",
        ],
      },
      {
        id: "law",
        heading: "7. Governing law",
        body: [
          "These terms are governed by the laws of Nepal, and the courts of Rupandehi (Butwal) have exclusive jurisdiction.",
          "If any clause is found unenforceable, the rest of the agreement stays in force.",
        ],
      },
    ],
  },

  privacy: {
    slug: "privacy",
    title: "Privacy policy",
    kicker: "Legal",
    summary:
      "What this website collects, why, how long we keep it, and what you can ask us to do with it.",
    updated: "23 November 2026",
    sections: [
      {
        id: "website-data",
        heading: "1. What this website collects",
        body: ["We only collect what is needed to answer you and to run a paid order."],
        bullets: [
          "Details you type in the demo or checkout form: name, school, role, email, phone, student count, message",
          "The plan you selected, currency and the gateway reference for a purchase",
          "Standard server logs: timestamp, IP address, browser type, page requested",
        ],
      },
      {
        id: "cookies",
        heading: "2. Cookies and storage",
        body: [
          "The marketing pages use only essential cookies for session continuity and theme choice. There are no advertising or cross-site tracking cookies.",
          "Inside the product, a session cookie keeps you signed in; it is http-only and expires when you sign out.",
        ],
      },
      {
        id: "payments",
        heading: "3. Payments",
        body: [
          "Payment details are entered on the gateway's own page — eSewa, Khalti or Stripe. Card and wallet credentials never reach our servers.",
          "We receive only the transaction reference, status and amount, which we store against the order and the invoice.",
        ],
      },
      {
        id: "institution-data",
        heading: "4. Data inside the product",
        body: [
          "Student, staff and fee data belongs to your institution and lives in your deployment (your Supabase project or your server).",
          "We access it only with your written permission — for example during a migration or a support request you raised — and access is logged.",
        ],
      },
      {
        id: "retention",
        heading: "5. How long we keep it",
        body: ["Enquiries are kept for two years from the last contact. Invoices and payment records are kept for seven years, as required by tax law. Logs are rotated after 90 days."],
      },
      {
        id: "rights",
        heading: "6. Your rights",
        body: [
          "Write to " + SUPPORT + " to request a copy of your enquiry data, ask for a correction, or have it deleted. We reply within 30 days.",
          "Deletion cannot remove records we must keep for tax or legal reasons, but we will tell you exactly what is retained and why.",
        ],
      },
      {
        id: "sharing",
        heading: "7. Sharing",
        body: [
          "We never sell personal data. We share it only with the processors needed to deliver the service: the payment gateway, our email provider, and our hosting provider.",
          "If a lawful authority requests data, we will ask for a valid legal basis and, where permitted, notify you.",
        ],
      },
      {
        id: "contact",
        heading: "8. Contact",
        body: ["Privacy questions and requests: " + SUPPORT + ". Postal address available on request for formal notices."],
      },
    ],
  },

  refund: {
    slug: "refund",
    title: "Payment & refund policy",
    kicker: "Legal",
    summary:
      "How payment works, what the price includes, and exactly when you can get your money back.",
    updated: "23 November 2026",
    sections: [
      {
        id: "price",
        heading: "1. The price you pay",
        body: [
          "The price shown on the pricing page and on your checkout summary is the final amount. Setup, data import, training and payment-gateway processing fees are included.",
          "We do not add taxes, service charges or per-transaction fees at the payment step.",
        ],
      },
      {
        id: "methods",
        heading: "2. Payment methods",
        body: ["Nepal: eSewa, Khalti, bank transfer or cash at our office. International: card via Stripe."],
        bullets: [
          "Online payments confirm automatically and a receipt is emailed within minutes",
          "Bank transfers are activated manually within one working day of the funds landing",
          "Cash payments receive a numbered receipt from our office",
        ],
      },
      {
        id: "invoice",
        heading: "3. Invoice and receipts",
        body: [
          "Every payment produces an invoice with your institution's name, the plan, the amount and the reference number.",
          "If you need a VAT invoice or a specific purchase-order format for your accounts department, tell us before paying and we will issue it in that format.",
        ],
      },
      {
        id: "refunds",
        heading: "4. Refunds",
        body: ["Refunds are measured against how much of the onboarding work has already been delivered."],
        bullets: [
          "Before setup starts: full refund within 7 days, no questions asked",
          "After setup or training: refund minus the delivered setup work, requested within 14 days",
          "Care plan: cancel any month; no future charges, current month not pro-rated",
          "Gateway fees charged to us (usually 2–3%) are not refundable",
        ],
      },
      {
        id: "cancel",
        heading: "5. Cancelling the care plan",
        body: [
          "Email us before the renewal date and the plan stops at the end of the current month. There is no cancellation fee and no minimum term.",
          "Cancelling the care plan never disables the software you have already licensed.",
        ],
      },
      {
        id: "failed",
        heading: "6. Failed or duplicated payments",
        body: [
          "If a wallet times out but the money leaves your account, the gateway usually reverses it within 3–5 working days. Send us the reference and we will chase it and, where needed, either complete your order or refund.",
          "Duplicate charges are refunded in full once identified — normally the same working day.",
        ],
      },
      {
        id: "how",
        heading: "7. How to request a refund",
        body: [
          "Email " + SUPPORT + " with the invoice or reference number, the amount and the reason. We acknowledge within one business day.",
          "Approved refunds are returned by the original payment method within five working days.",
        ],
      },
    ],
  },
};

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return LEGAL_DOCS[slug];
}

export const LEGAL_LINKS = Object.values(LEGAL_DOCS).map((doc) => ({ slug: doc.slug, title: doc.title }));
