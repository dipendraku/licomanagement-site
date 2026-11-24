"use client";

import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";

export function GoogleButton({ redirectTo }: { redirectTo: string }) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });
    if (error) {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:opacity-60"
    >
      <FaGoogle className="h-4 w-4 text-[#EA4335]" />
      {pending ? "Redirecting…" : "Continue with Google"}
    </button>
  );
}
