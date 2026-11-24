import Link from "next/link";
import type { ReactNode } from "react";
import { AuthMenu } from "@/components/auth/auth-menu";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";

export function DashboardShell({
  title,
  subtitle,
  navItems,
  sidebar,
  children,
}: {
  title: string;
  subtitle?: string;
  navItems?: Array<{ label: string; href: string }>;
  sidebar?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <SiteHeader actions={<AuthMenu />} />

      <main className="mx-auto w-full max-w-6xl px-5 py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">{subtitle}</p> : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          {sidebar ?? (
            <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
              {(navItems ?? []).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition hover:border-[var(--primary)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] lg:whitespace-normal"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="min-w-0">{children}</div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
