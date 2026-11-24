import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/dashboard/admin-nav";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { adminNavFor } from "@/lib/admin-nav";
import { createClient } from "@/lib/supabase/server";
import { staffRoles, type ProfileRole } from "@/lib/types";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = { robots: noIndexRobots };

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

  const role = profile.role as ProfileRole;
  const isSuperAdmin = role === "super_admin";

  return (
    <DashboardShell
      title={isSuperAdmin ? "Admin Dashboard" : "Staff Dashboard"}
      subtitle={
        isSuperAdmin
          ? "Catalogue, orders, customers, notifications and integrations in one place."
          : "Manage the catalogue and follow customer orders."
      }
      sidebar={<AdminNav items={adminNavFor(role)} />}
    >
      {children}
    </DashboardShell>
  );
}
