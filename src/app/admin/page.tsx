import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  contacted: "bg-blue-100 text-blue-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-slate-200 text-slate-700",
};

function firstProduct<T>(products: T | T[] | null | undefined): T | null {
  if (!products) return null;
  return Array.isArray(products) ? (products[0] ?? null) : products;
}

const quickActions = [
  { label: "Add a product", href: "/admin/products/new", hint: "Catalogue" },
  { label: "Update pricing", href: "/admin/pricing", hint: "Offers" },
  { label: "Review orders", href: "/admin/orders", hint: "Payments" },
  { label: "Customers", href: "/admin/customers", hint: "People" },
  { label: "Send a notice", href: "/admin/notifications", hint: "Marketing" },
  { label: "Integrations", href: "/admin/settings", hint: "System" },
];

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  const isSuperAdmin = profile?.role === "super_admin";

  const [products, activeProducts, pendingOrders, customers, recentOrders] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
    supabase
      .from("orders")
      .select("id, type, status, full_name, email, created_at, products(name)")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  let unreadNotifications = 0;
  if (isSuperAdmin) {
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("role_target", "admin")
      .eq("is_read", false);
    unreadNotifications = count ?? 0;
  }

  const stats = [
    { label: "Products", value: products.count ?? 0, detail: `${activeProducts.count ?? 0} live`, href: "/admin/products" },
    { label: "Pending orders", value: pendingOrders.count ?? 0, detail: "awaiting follow-up", href: "/admin/orders" },
    { label: "Customers", value: customers.count ?? 0, detail: "registered accounts", href: "/admin/customers" },
    ...(isSuperAdmin
      ? [{ label: "Unread notices", value: unreadNotifications, detail: "admin inbox", href: "/admin/notifications" }]
      : []),
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="card-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-sm transition hover:border-[var(--primary)]"
          >
            <p className="text-sm font-medium text-[var(--muted)]">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{stat.value}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{stat.detail}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent orders</h2>
              <p className="text-xs text-[var(--muted)]">Latest requests and direct buys</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              View all
            </Link>
          </div>

          {(recentOrders.data ?? []).length === 0 ? (
            <p className="px-5 py-6 text-sm text-[var(--muted)]">No orders or requests yet.</p>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {(recentOrders.data ?? []).map((order) => (
                <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--foreground)]">
                      {firstProduct(order.products)?.name ?? "Product"} · {order.full_name}
                    </p>
                    <p className="truncate text-xs text-[var(--muted)]">
                      {order.email} · {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[order.status] ?? "bg-slate-100 text-slate-700"}`}
                  >
                    {order.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Quick actions</h2>
          <p className="text-xs text-[var(--muted)]">Jump straight to the common tasks</p>
          <div className="mt-4 grid gap-2">
            {(isSuperAdmin ? quickActions : quickActions.filter((action) => !action.href.includes("pricing") && !action.href.includes("notifications") && !action.href.includes("settings"))).map(
              (action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3 text-sm transition hover:border-[var(--primary)] hover:bg-[var(--secondary)]"
                >
                  <span className="font-medium text-[var(--foreground)]">{action.label}</span>
                  <span className="text-xs uppercase tracking-wide text-[var(--muted)]">{action.hint}</span>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
