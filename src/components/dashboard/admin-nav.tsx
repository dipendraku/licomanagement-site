"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_GROUPS, type AdminNavItem } from "@/lib/admin-nav";

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
      {ADMIN_NAV_GROUPS.map((group) => {
        const groupItems = items.filter((item) => item.group === group);
        if (groupItems.length === 0) return null;

        return (
          <div key={group} className="flex gap-2 lg:flex-col lg:gap-1">
            <p className="hidden px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)] lg:block">
              {group}
            </p>
            {groupItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-xl border px-4 py-2.5 text-sm transition lg:whitespace-normal ${
                    active
                      ? "border-[var(--primary)] bg-[var(--secondary)] font-semibold text-[var(--primary)]"
                      : "border-[var(--border)] bg-[var(--surface-strong)] font-medium text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
