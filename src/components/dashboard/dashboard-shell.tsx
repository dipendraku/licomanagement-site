import Link from "next/link";
import type { ReactNode } from "react";
import { PageShell } from "@/components/site/page-shell";

export function DashboardShell({
  title,
  navItems,
  children,
}: {
  title: string;
  navItems: Array<{ label: string; href: string }>;
  children: ReactNode;
}) {
  return (
    <PageShell>
      <main className="container-pad py-12">
        <h1 className="section-title font-extrabold text-[#0c336b]">{title}</h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)] lg:whitespace-normal"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="min-w-0">{children}</div>
        </div>
      </main>
    </PageShell>
  );
}
