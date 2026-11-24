"use client";

import { useState, type FormEvent } from "react";

interface Props {
  topic?: string;
  topics?: { id: string; label: string }[];
}

const FIELDS = [
  { id: "name", label: "Your name", placeholder: "Ramesh Adhikari", type: "text", required: true, autoComplete: "name" },
  { id: "school", label: "School / college", placeholder: "Shree Janata Secondary School", type: "text", required: true },
  { id: "role", label: "Your role", placeholder: "Principal, accountant, IT…", type: "text", required: false },
  { id: "email", label: "Email", placeholder: "you@school.edu.np", type: "email", required: true, autoComplete: "email" },
  { id: "phone", label: "Phone / WhatsApp", placeholder: "+977 98…", type: "tel", required: false, autoComplete: "tel" },
] as const;

const STUDENT_BANDS = ["Under 300", "300 – 800", "800 – 1,500", "1,500 – 3,000", "3,000+"];

export function ContactForm({ topic = "demo", topics = [{ id: "demo", label: "Book a demo" }] }: Props) {
  const [selectedTopic, setSelectedTopic] = useState(topic);
  const [students, setStudents] = useState(STUDENT_BANDS[1]!);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");

    const form = new FormData(event.currentTarget);
    const payload: Record<string, string> = {
      topic: selectedTopic,
      students,
      message,
    };
    for (const field of FIELDS) payload[field.id] = String(form.get(field.id) ?? "");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !json.ok) throw new Error(json.error || "Could not send the request.");
      setStatus("sent");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not send the request.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-[var(--primary)]/40 bg-[var(--surface-strong)] p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--secondary)] text-2xl">✅</div>
        <h2 className="mt-4 text-xl font-semibold">Request received</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
          A confirmation is on its way to your inbox. We reply within one business day — usually within a couple of
          hours during school days.
        </p>
        <a href="/" className="mt-6 inline-block rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold hover:border-[var(--primary)]">
          Back to home
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-6 sm:p-8">
      {topics.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {topics.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedTopic(item.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                selectedTopic === item.id
                  ? "border-[var(--primary)] bg-[var(--secondary)] text-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)]/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <label key={field.id} className={field.id === "school" ? "sm:col-span-2" : ""}>
            <span className="mb-1.5 block text-sm font-medium">
              {field.label} {field.required && <span className="text-[var(--danger)]">*</span>}
            </span>
            <input
              name={field.id}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder}
              autoComplete={"autoComplete" in field ? field.autoComplete : undefined}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--primary)]"
            />
          </label>
        ))}

        <label>
          <span className="mb-1.5 block text-sm font-medium">Students</span>
          <select
            value={students}
            onChange={(event) => setStudents(event.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--primary)]"
          >
            {STUDENT_BANDS.map((band) => (
              <option key={band} value={band}>
                {band}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium">What would you like to see in the demo?</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="Fee heads, exam pattern, number of branches, what breaks today…"
          className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--primary)]"
        />
      </label>

      {status === "error" && (
        <p className="mt-4 rounded-lg border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition hover:brightness-110 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Request the demo"}
      </button>
      <p className="mt-3 text-center text-xs text-[var(--muted)]">
        We only use these details to reply. No marketing lists, ever.
      </p>
    </form>
  );
}
