import { updateProfile } from "@/lib/dashboard-actions";
import { createClient } from "@/lib/supabase/server";

export default async function AccountProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();

  return (
    <form action={updateProfile} className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">Email</label>
        <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">{user?.email}</p>
      </div>

      <div className="mt-4">
        <label htmlFor="full_name" className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">
          Full Name
        </label>
        <input
          id="full_name"
          name="full_name"
          defaultValue={profile?.full_name ?? ""}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
        />
      </div>

      <button
        type="submit"
        className="mt-5 rounded-full bg-[var(--brand-orange)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95"
      >
        Save Changes
      </button>
    </form>
  );
}
