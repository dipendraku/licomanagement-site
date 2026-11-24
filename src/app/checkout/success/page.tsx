import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";
import { SUPPORT_EMAIL } from "@/lib/mail";

export const metadata: Metadata = { title: "Payment received · EduCore SMS" };

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ ref?: string; demo?: string }> }) {
  const params = await searchParams;
  const reference = params.ref ?? "";
  const demo = params.demo === "1";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-5 py-20 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[var(--secondary)] text-3xl">🎉</div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          {demo ? "Demo checkout complete" : "Payment received — welcome aboard"}
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          {demo
            ? "No gateway is configured yet, so nothing was charged. The flow, emails and records all ran end to end."
            : "Your receipt and invoice are on the way to your inbox. Our onboarding lead will call you today to schedule the data import."}
        </p>

        {reference && (
          <p className="mt-5 inline-block rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-sm">
            Reference: <strong>{reference}</strong>
          </p>
        )}

        <ul className="mx-auto mt-8 max-w-md space-y-2 text-left text-sm text-[var(--muted)]">
          <li>1 · Check your email for the receipt and the onboarding checklist.</li>
          <li>2 · Send your student/staff Excel export to {SUPPORT_EMAIL}.</li>
          <li>3 · We import, configure and train — usually within 3 working days.</li>
        </ul>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/login" className="rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] hover:brightness-110">
            Go to sign in
          </Link>
          <Link href="/contact?topic=support" className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold hover:border-[var(--primary)]">
            Talk to onboarding
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
