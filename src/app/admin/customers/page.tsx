import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = { title: "Customer Management", robots: noIndexRobots };

type CustomerStats = { orders: number; value: number; lastOrder: string | null };

function firstProduct<T>(products: T | T[] | null | undefined): T | null {
  if (!products) return null;
  return Array.isArray(products) ? (products[0] ?? null) : products;
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  const q = (params.q ?? "").trim().toLowerCase();

  const [{ data: profiles }, { data: orders }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id,email,full_name,role,created_at")
      .eq("role", "customer")
      .order("created_at", { ascending: false }),
    supabase.from("orders").select("user_id,status,created_at,products(price)").order("created_at", { ascending: false }),
  ]);

  const stats = new Map<string, CustomerStats>();
  for (const order of orders ?? []) {
    if (!order.user_id) continue;
    const current = stats.get(order.user_id) ?? { orders: 0, value: 0, lastOrder: null };
    current.orders += 1;
    if (order.status !== "cancelled") current.value += Number(firstProduct(order.products)?.price ?? 0);
    if (!current.lastOrder || order.created_at > current.lastOrder) current.lastOrder = order.created_at;
    stats.set(order.user_id, current);
  }

  const customers = (profiles ?? []).filter((profile) =>
    q ? `${profile.email} ${profile.full_name ?? ""}`.toLowerCase().includes(q) : true,
  );

  const withOrders = customers.filter((customer) => (stats.get(customer.id)?.orders ?? 0) > 0).length;
  const pipeline = customers.reduce((total, customer) => total + (stats.get(customer.id)?.value ?? 0), 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-sm">
          <p className="text-sm text-[var(--muted)]">Customers</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">{customers.length}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-sm">
          <p className="text-sm text-[var(--muted)]">With orders</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">{withOrders}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-sm">
          <p className="text-sm text-[var(--muted)]">Order value (non-cancelled)</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">{pipeline.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">Customer management</h2>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Every registered customer with their order history summary. Order details live under Orders &amp; Payments.
          </p>
        </div>
        <form action="/admin/customers" method="get" className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Search email or name"
            className="w-56 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
          />
          <button type="submit" className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-medium hover:border-[var(--primary)]">
            Search
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[var(--border)] text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Last order</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-[var(--muted)]">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const stat = stats.get(customer.id);
                return (
                  <tr key={customer.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--foreground)]">{customer.full_name || "—"}</p>
                      <p className="text-xs text-[var(--muted)]">{customer.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground)]">{stat?.orders ?? 0}</td>
                    <td className="px-4 py-3 text-[var(--foreground)]">{(stat?.value ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)]">
                      {stat?.lastOrder ? new Date(stat.lastOrder).toLocaleDateString() : "No orders"}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)]">{new Date(customer.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[var(--muted)]">
        Need to open a specific order?{" "}
        <Link href="/admin/orders" className="font-medium text-[var(--primary)] hover:underline">
          Go to Orders &amp; Payments
        </Link>
        .
      </p>
    </div>
  );
}
