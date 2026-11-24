"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp } from "@/lib/auth-actions";
import { GoogleButton } from "@/components/auth/google-button";

export function RegisterForm() {
  const [state, action, pending] = useActionState(signUp, undefined);

  return (
    <>
      <div className="mt-8">
        <GoogleButton redirectTo="/account" />
      </div>

      <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.06em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        or
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form action={action} className="grid gap-4">
        {state?.error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
        ) : null}

        <div>
          <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">
            Password
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

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-[var(--brand-orange)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
        >
          {pending ? "Creating account…" : "Create Account"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[var(--brand-blue)] hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </>
  );
}
