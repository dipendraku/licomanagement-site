"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "@/lib/auth-actions";
import { GoogleButton } from "@/components/auth/google-button";

export function LoginForm({ redirectTo, justRegistered }: { redirectTo: string; justRegistered: boolean }) {
  const [state, action, pending] = useActionState(signIn, undefined);

  return (
    <>
      <div className="mt-8">
        <GoogleButton redirectTo={redirectTo} />
      </div>

      <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.06em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        or
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form action={action} className="grid gap-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        {justRegistered ? (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Account created. Check your email to confirm, then sign in below.
          </p>
        ) : null}

        {state?.error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
        ) : null}

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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-semibold text-[var(--brand-blue)] hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-[var(--brand-orange)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign In"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Don&rsquo;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[var(--brand-blue)] hover:underline">
            Register
          </Link>
        </p>
      </form>
    </>
  );
}
