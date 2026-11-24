import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { updateUserRole } from "@/lib/dashboard-actions";
import { createClient } from "@/lib/supabase/server";
import { noIndexRobots } from "@/lib/seo";
import { profileRoles } from "@/lib/types";

export const metadata: Metadata = { title: "Users & Roles", robots: noIndexRobots };

const roleTone: Record<string, string> = {
  customer: "bg-slate-100 text-slate-700",
  employee: "bg-blue-100 text-blue-800",
  super_admin: "bg-emerald-100 text-emerald-800",
};

const roleLabel: Record<string, string> = {
  customer: "Customer",
  employee: "Staff",
  super_admin: "Super admin",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; saved?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  if (me?.role !== "super_admin") redirect("/admin");

  const params = await searchParams;
  const q = (params.q ?? "").trim().toLowerCase();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,created_at")
    .order("created_at", { ascending: false });

  const rows = (profiles ?? []).filter((profile) =>
    q ? `${profile.email} ${profile.full_name ?? ""}`.toLowerCase().includes(q) : true,
  );

  return (
    <div className="space-y-5">
      {params.saved ? (
        <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Role updated.</p>
      ) : null}
      {params.error === "self" ? (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          You cannot change your own role. Ask another super admin.
        </p>
      ) : null}
      {params.error === "role" || params.error === "save" ? (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          That change could not be saved. Check that migration 004 has been applied.
        </p>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">Users &amp; roles</h2>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            {rows.length} account{rows.length === 1 ? "" : "s"}. Customers order, staff manage the catalogue, super admins
            also handle payments, notifications and integrations.
          </p>
        </div>
        <form action="/admin/users" method="get" className="flex gap-2">
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
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-[var(--border)] text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Change role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-[var(--muted)]">
                  No accounts match that search.
                </td>
              </tr>
            ) : (
              rows.map((profile) => {
                const isSelf = profile.id === user!.id;
                return (
                  <tr key={profile.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--foreground)]">
                        {profile.full_name || "—"}
                        {isSelf ? <span className="ml-1 text-xs text-[var(--muted)]">(you)</span> : null}
                      </p>
                      <p className="text-xs text-[var(--muted)]">{profile.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${roleTone[profile.role] ?? "bg-slate-100 text-slate-700"}`}>
                        {roleLabel[profile.role] ?? profile.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)]">{new Date(profile.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {isSelf ? (
                        <span className="text-xs text-[var(--muted)]">Locked</span>
                      ) : (
                        <form action={updateUserRole} className="flex items-center gap-2">
                          <input type="hidden" name="userId" value={profile.id} />
                          <select
                            name="role"
                            defaultValue={profile.role}
                            aria-label={`Role for ${profile.email}`}
                            className="rounded-lg border border-[var(--border)] bg-white px-2 py-1.5 text-xs font-medium"
                          >
                            {profileRoles.map((role) => (
                              <option key={role} value={role}>
                                {roleLabel[role]}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-foreground)] transition hover:brightness-110"
                          >
                            Save
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
