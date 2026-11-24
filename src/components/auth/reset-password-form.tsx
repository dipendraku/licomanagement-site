"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setPending(false);
      setError("Passwords do not match.");
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    setPending(false);
    if (updateError) {
      setError(
        updateError.message === "Auth session missing!"
          ? "This reset link has expired or was already used. Request a new one."
          : updateError.message
      );
      return;
    }

    router.push("/account");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <div>
        <label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">
          New Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
          placeholder="At least 6 characters"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
          placeholder="Re-enter new password"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-[var(--brand-orange)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
      >
        {pending ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}
