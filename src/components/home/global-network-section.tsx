import Link from "next/link";
import { InteractiveGlobe } from "@/components/ui/interactive-globe";

export function GlobalNetworkSection() {
  return (
    <section className="container-pad mt-12">
      <div className="relative overflow-hidden rounded-3xl border border-[#dbe6ff] bg-white shadow-[0_14px_40px_rgba(11,45,99,0.12)]">
        <div className="pointer-events-none absolute -right-10 -top-14 h-72 w-72 rounded-full bg-blue-500/8 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-72 w-72 rounded-full bg-cyan-400/8 blur-3xl" />

        <div className="grid min-h-[520px] gap-2 md:grid-cols-[1.08fr_0.92fr]">
          <div className="relative z-10 flex flex-col justify-center p-8 md:p-12">
            <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Smart Global Network
            </p>

            <h3 className="text-3xl font-black leading-[1.15] tracking-[-0.02em] text-[#0c336b] md:text-4xl">
              Connected Platform for Home Automation, Software Solutions, and SaaS Growth
            </h3>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              Explore our interactive globe to visualize how Licomanagement supports digital businesses with connected software delivery,
              automation systems, and scalable SaaS infrastructure across regions.
            </p>

            <div className="mt-8 flex flex-wrap gap-6">
              <div>
                <p className="text-2xl font-extrabold text-[#0c336b]">150+</p>
                <p className="text-xs font-semibold uppercase tracking-[0.07em] text-slate-500">Network Nodes</p>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-extrabold text-[#0c336b]">99.99%</p>
                <p className="text-xs font-semibold uppercase tracking-[0.07em] text-slate-500">Service Uptime</p>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-extrabold text-[#0c336b]">&lt;50ms</p>
                <p className="text-xs font-semibold uppercase tracking-[0.07em] text-slate-500">Avg Latency</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/it-software-development"
                className="rounded-full bg-[var(--brand-blue)] px-6 py-3 text-center text-sm font-bold uppercase tracking-[0.04em] text-white transition hover:bg-[var(--brand-blue-strong)]"
              >
                Explore Solutions
              </Link>
              <Link
                href="/support#contact"
                className="rounded-full border border-[var(--brand-blue)] px-6 py-3 text-center text-sm font-bold uppercase tracking-[0.04em] text-[var(--brand-blue)] transition hover:bg-[var(--brand-blue)] hover:text-white"
              >
                Talk to Expert
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center p-4 md:p-0">
            <InteractiveGlobe
              size={430}
              className="max-h-[430px] max-w-[430px]"
              autoRotateSpeed={0.0018}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
