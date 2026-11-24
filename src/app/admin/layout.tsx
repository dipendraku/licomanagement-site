import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";
import { staffRoles } from "@/lib/types";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !staffRoles.includes(profile.role)) {
    redirect("/account");
  }

  const isSuperAdmin = profile.role === "super_admin";

  const navItems = [
    { label: "Overview", href: "/admin" },
    { label: "Product Management", href: "/admin/products" },
    { label: "Payment Management", href: "/admin/orders" },
    ...(isSuperAdmin ? [{ label: "Notification Management", href: "/admin/notifications" }] : []),
  ];

  return (
    <DashboardShell title={isSuperAdmin ? "Admin Dashboard" : "Staff Dashboard"} navItems={navItems}>
      {children}
    </DashboardShell>
  );
}
