import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";
import { ContactForm } from "@/components/marketing/contact-form";
import { SUPPORT_EMAIL } from "@/lib/mail";

export const metadata: Metadata = {
  title: "Book a demo · EduCore SMS",
  description: "See EduCore SMS configured with your own classes, sections and fee heads.",
};

const TOPICS = [
  { id: "demo", label: "Book a demo" },
  { id: "pricing", label: "Pricing question" },
  { id: "care", label: "Care plan" },
  { id: "campus", label: "Colleges & groups" },
  { id: "nidhi", label: "NidhiSuite" },
  { id: "erp", label: "ManufactureERP" },
  { id: "lico-pos", label: "Lico POS" },
  { id: "election", label: "BoothTrack" },
  { id: "custom", label: "Custom build" },
  { id: "support", label: "Existing customer" },
];

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const params = await searchParams;
  const topic = TOPICS.some((item) => item.id === params.topic) ? params.topic! : "demo";

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">Talk to us</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Fifteen minutes, your own data.</h1>
          <p className="mt-4 text-[var(--muted)]">
            Tell us the size of your school and what the office struggles with today. We reply within one business
            day with two or three demo slots — and we configure the sandbox around your classes and fee heads
            before the call.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            {[
              ["Demo in Nepali or English", "Your choice — we switch mid-call if the accountant prefers Nepali."],
              ["No pressure pricing", "A fixed quote after the call, valid for 30 days."],
              ["Data import included", "Send an Excel export of students and we import it in the sandbox."],
            ].map(([title, body]) => (
              <li key={title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-[var(--muted)]">{body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
            <p className="font-semibold">Prefer email or phone?</p>
            <p className="mt-1 text-[var(--muted)]">
              <a className="text-[var(--primary)] hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
              {" · "}
              <a className="text-[var(--primary)] hover:underline" href="tel:+9779847435894">+977 9847435894</a>
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">Sunday–Friday, 9:00–18:00 NPT</p>
          </div>
        </div>

        <ContactForm topic={topic} topics={TOPICS} />
      </section>

      <SiteFooter />
    </div>
  );
}
