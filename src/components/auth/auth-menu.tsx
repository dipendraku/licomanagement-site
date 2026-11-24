"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/auth-actions";
import { staffRoles, type ProfileRole } from "@/lib/types";

export function AuthMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<ProfileRole | null>(null);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile(userId: string, userEmail: string | null) {
      setEmail(userEmail);
      const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
      setRole(data?.role ?? null);
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        loadProfile(data.user.id, data.user.email ?? null);
      }
      setReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email ?? null);
      } else {
        setEmail(null);
        setRole(null);
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const isStaff = role ? staffRoles.includes(role) : false;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!ready) {
    return <span className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300"><FaUserCircle className="h-6 w-6" /></span>;
  }

  if (!email) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold uppercase tracking-[0.04em] text-slate-700 transition hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="rounded-full bg-[var(--brand-blue)] px-4 py-2 text-xs font-bold uppercase tracking-[0.04em] text-white transition hover:bg-[var(--brand-blue-strong)]"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--brand-blue)] transition hover:bg-slate-100"
        aria-label="Account menu"
      >
        <FaUserCircle className="h-7 w-7" />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-30 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <p className="truncate px-3 py-1 text-xs font-semibold text-slate-500">{email}</p>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[var(--brand-blue)]"
          >
            My Dashboard
          </Link>
          {isStaff ? (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[var(--brand-blue)]"
            >
              {role === "super_admin" ? "Admin Dashboard" : "Staff Dashboard"}
            </Link>
          ) : null}
          <form action={signOut}>
            <button
              type="submit"
              className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Sign Out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
