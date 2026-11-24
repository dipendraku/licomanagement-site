import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";

const navItems = [
  { label: "Overview", href: "/account" },
  { label: "My Orders", href: "/account/orders" },
  { label: "Notifications", href: "/account/notifications" },
  { label: "Profile", href: "/account/profile" },
];

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/account");
  }

  return (
    <DashboardShell title="My Dashboard" navItems={navItems}>
      {children}
    </DashboardShell>
  );
}
