import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center px-5 py-16">
        <div className="reveal-up w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-8 shadow-sm">
          <Link href="/" className="mb-6 flex items-center gap-2.5" aria-label="Licomanagement home">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--border)] bg-white p-1.5">
              <Image
                src="/logo.png"
                alt="Licomanagement logo"
                width={44}
                height={32}
                className="h-auto w-full object-contain"
                priority
              />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Licomanagement</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">{title}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p>
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
