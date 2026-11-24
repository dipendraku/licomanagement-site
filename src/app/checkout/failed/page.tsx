import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";
import { SUPPORT_EMAIL } from "@/lib/mail";

export const metadata: Metadata = { title: "Payment not completed · EduCore SMS" };

export default async function FailedPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const params = await searchParams;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-5 py-20 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[var(--danger)]/10 text-3xl">⚠️</div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Payment didn&apos;t go through</h1>
        <p className="mt-3 text-[var(--muted)]">
          Nothing was charged. This is usually a cancelled wallet prompt, an expired card, or a timeout at the
          gateway — try again, or pay by bank transfer and we will activate your licence manually.
        </p>

        {params.ref && (
          <p className="mt-5 inline-block rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-sm">
            Reference: <strong>{params.ref}</strong>
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/checkout" className="rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] hover:brightness-110">
            Try again
          </Link>
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=Bank%20transfer%20for%20EduCore%20SMS`}
            className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold hover:border-[var(--primary)]"
          >
            Ask for bank details
          </a>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
