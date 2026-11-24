import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SUPPORT_EMAIL } from "@/lib/mail";

const NAV = [
  { href: "/products", label: "Products" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/#studio", label: "Studio" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ actions }: { actions?: ReactNode }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_82%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-5">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight" aria-label="Licomanagement home">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-white p-1.5 shadow-sm">
            <Image
              src="/logo.png"
              alt="Licomanagement logo"
              width={40}
              height={29}
              className="h-auto w-full object-contain"
              priority
            />
          </span>
          <span className="text-[15px] leading-tight">
            Lico <span className="text-[var(--muted)]">Management</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[var(--foreground)]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {actions ?? (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--secondary)] hover:text-[var(--foreground)] sm:block"
              >
                Sign in
              </Link>
              <Link
                href="/contact"
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition hover:brightness-110"
              >
                Book a demo
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white p-1 ring-1 ring-[var(--border)]">
              <Image
                src="/logo.png"
                alt="Licomanagement logo"
                width={32}
                height={23}
                className="h-auto w-full object-contain"
              />
            </span>
            Lico Management
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            We build and run the software Nepali schools and businesses depend on every day — management, accounting, POS and operations.
          </p>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-semibold">Product</p>
          <ul className="space-y-2 text-[var(--muted)]">
            <li><Link className="hover:text-[var(--foreground)]" href="/products">Products</Link></li>
            <li><Link className="hover:text-[var(--foreground)]" href="/pricing">Pricing</Link></li>
            <li><Link className="hover:text-[var(--foreground)]" href="/#how">How it works</Link></li>
            <li><Link className="hover:text-[var(--foreground)]" href="/login">Sign in</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-semibold">Company</p>
          <ul className="space-y-2 text-[var(--muted)]">
            <li><Link className="hover:text-[var(--foreground)]" href="/about">About the studio</Link></li>
            <li><Link className="hover:text-[var(--foreground)]" href="/contact">Book a demo</Link></li>
            <li><a className="hover:text-[var(--foreground)]" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></li>
            <li><a className="hover:text-[var(--foreground)]" href="tel:+9779847435894">+977 9847435894</a></li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-semibold">Policies</p>
          <ul className="space-y-2 text-[var(--muted)]">
            <li><Link className="hover:text-[var(--foreground)]" href="/legal/terms">Terms of service</Link></li>
            <li><Link className="hover:text-[var(--foreground)]" href="/legal/privacy">Privacy policy</Link></li>
            <li><Link className="hover:text-[var(--foreground)]" href="/legal/refund">Refund policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)] px-5 py-5 text-center text-xs text-[var(--muted)]">
        © {new Date().getFullYear()} Lico Management · Built and supported in Nepal · Support: {SUPPORT_EMAIL}
      </div>
    </footer>
  );
}
