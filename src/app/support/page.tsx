import Link from "next/link";
import { FaEnvelope, FaPhoneAlt, FaTicketAlt, FaWhatsapp } from "react-icons/fa";
import { PageShell } from "@/components/site/page-shell";

export default function SupportPage() {
  return (
    <PageShell>
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(110deg,_#0b2f63_0%,_#104a9b_58%,_#2571d9_100%)] py-20 text-white">
          <div className="orb-a absolute -left-20 top-6 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="orb-b absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[var(--brand-orange)]/25 blur-3xl" />
          <div className="container-pad relative">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">Support</h1>
            <p className="mt-5 max-w-2xl text-lg text-blue-100">
              Reach our specialists by email or phone, submit a support ticket, or get general contact details for
              Licomanagement.
            </p>
          </div>
        </section>

        <section className="container-pad py-16">
          <div className="mb-10 grid gap-5 md:grid-cols-2">
            <a
              id="email"
              href="mailto:sales@licomanagement.com"
              className="card-lift reveal-up scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf2ff] text-[#1355b2]">
                <FaEnvelope className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">Email Support</p>
              <p className="mt-2 text-lg font-extrabold text-[var(--brand-blue)]">sales@licomanagement.com</p>
              <p className="mt-1 text-sm text-slate-600">Get plan details, onboarding help, and technical guidance.</p>
            </a>

            <a
              id="call"
              href="tel:+18559227243"
              className="card-lift reveal-up reveal-delay-1 scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf2ff] text-[#1355b2]">
                <FaPhoneAlt className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">Call</p>
              <p className="mt-2 text-lg font-extrabold text-[var(--brand-blue)]">+1-855-922-7243</p>
              <p className="mt-1 text-sm text-slate-600">Talk to support and sales experts, 24x7.</p>
            </a>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <section id="ticket" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf2ff] text-[#1355b2]">
                <FaTicketAlt className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Submit a Support Ticket</h2>
              <p className="mt-2 text-slate-600">Tell us what you need and a specialist will follow up.</p>
              <form className="mt-5 grid gap-4">
                <input
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
                  placeholder="Full Name"
                />
                <input
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
                  placeholder="Phone Number"
                />
                <input
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
                  placeholder="Business Email"
                />
                <select className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring">
                  <option>Interested Service</option>
                  <option>IT & Software Development</option>
                  <option>Smart Device</option>
                  <option>Smart Light Solution</option>
                  <option>Light Solution</option>
                  <option>Home Automation</option>
                  <option>Custome Security Setup</option>
                  <option>Saas For Business</option>
                </select>
                <textarea
                  className="min-h-28 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
                  placeholder="Tell us about your requirements"
                />
                <button
                  type="button"
                  className="rounded-full bg-[var(--brand-orange)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  Submit Ticket
                </button>
              </form>
            </section>

            <section id="contact" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Contact Us</h2>
              <p className="mt-4 text-slate-600">Email: sales@licomanagement.com</p>
              <p className="text-slate-600">Phone: +1-855-922-7243</p>
              <p className="mt-3 text-slate-600">Business Hours: 24x7 Technical Support</p>
              <p className="mt-3 text-slate-600">Office: Augusta, GA, United States</p>

              <a
                href="https://wa.me/18559227243"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#f5f8ff] p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1355b2] shadow-sm">
                  <FaWhatsapp className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-[var(--brand-blue)]">WhatsApp Instant Chat</span>
                  <span className="block text-xs text-slate-600">Quick pre-sales and technical questions.</span>
                </span>
              </a>

              <p className="mt-6 text-sm text-slate-600">
                Prefer a scheduled call? <Link href="/schedule-meeting" className="font-semibold text-[var(--brand-blue)] hover:underline">Book a meeting</Link> with our team.
              </p>
            </section>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
