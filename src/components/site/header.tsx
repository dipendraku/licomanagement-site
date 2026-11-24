"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AuthMenu } from "@/components/auth/auth-menu";
import { CartButton } from "@/components/cart/cart-button";
import { mainNav } from "@/lib/site-data";

function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: Array<{ label: string; href: string }>;
}) {
  return (
    <div className="group relative after:absolute after:left-0 after:top-full after:h-3 after:w-64 after:content-['']">
      <button className="flex items-center gap-1.5 text-[14px] font-bold uppercase tracking-[0.05em] text-slate-800 transition hover:text-[var(--brand-blue)]">
        {label}
        <span aria-hidden className="transition-transform duration-200 group-hover:rotate-180">▾</span>
      </button>
      <div className="pointer-events-none absolute left-0 top-full z-30 mt-3 w-64 translate-y-2 rounded-2xl border border-slate-200 bg-white p-3 opacity-0 shadow-xl transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[var(--brand-blue)]"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-[0_4px_18px_rgba(2,24,56,0.05)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2.5 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-11 w-11 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <Image src="/logo.png" alt="Licomanagement logo" width={44} height={44} className="h-11 w-11 object-contain" priority />
          </div>
          <div>
            <p className="text-[15px] font-extrabold leading-4 text-slate-900">Licomanagement</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Technology Friend</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {mainNav.map((item) => {
            if (item.children) {
              return (
                <NavDropdown key={item.label} label={item.label} items={item.children} />
              );
            }
            return (
              <Link
                key={item.label}
                href={item.href || "/"}
                className="text-[14px] font-bold uppercase tracking-[0.05em] text-slate-800 transition hover:text-[var(--brand-blue)]"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <CartButton />
          <Link
            href="/support#ticket"
            className="rounded-full bg-[var(--brand-blue)] px-5 py-2 text-xs font-bold uppercase tracking-[0.04em] text-white transition hover:bg-[var(--brand-blue-strong)]"
          >
            Request Quote
          </Link>
          <AuthMenu />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <CartButton />
          <button
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            type="button"
          >
            Menu
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl space-y-2 px-4 py-4">
            {mainNav.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200 p-3">
                <p className="pb-2 text-sm font-bold text-slate-900">{item.label}</p>
                {item.children ? (
                  <div className="grid gap-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link href={item.href || "/"} className="text-sm text-slate-700">
                    Open page
                  </Link>
                )}
              </div>
            ))}

            <div className="flex gap-2 rounded-xl border border-slate-200 p-3">
              <Link
                href="/login"
                className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.04em] text-slate-700"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="flex-1 rounded-full bg-[var(--brand-blue)] px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.04em] text-white"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
