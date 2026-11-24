import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  const isSuperAdmin = profile?.role === "super_admin";

  const { count: productCount } = await supabase.from("products").select("id", { count: "exact", head: true });
  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const stats = [
    { label: "Products", value: productCount ?? 0, href: "/admin/products" },
    { label: "Pending Orders", value: pendingOrders ?? 0, href: "/admin/orders" },
  ];

  if (isSuperAdmin) {
    const { count: unreadNotifications } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("role_target", "admin")
      .eq("is_read", false);

    stats.push({ label: "Unread Notifications", value: unreadNotifications ?? 0, href: "/admin/notifications" });
  }

  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {stats.map((stat) => (
        <Link key={stat.label} href={stat.href} className="card-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-3xl font-black text-[#0c336b]">{stat.value}</p>
          <p className="mt-2 text-sm font-semibold text-slate-600">{stat.label}</p>
        </Link>
      ))}
    </div>
  );
}
