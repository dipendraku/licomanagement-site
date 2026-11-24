import type { ReactNode } from "react";
import { PageShell } from "@/components/site/page-shell";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <PageShell>
      <main className="container-pad flex min-h-[70vh] items-center justify-center py-16">
        <div className="reveal-up w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
          {children}
        </div>
      </main>
    </PageShell>
  );
}
