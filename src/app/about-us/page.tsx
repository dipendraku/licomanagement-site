import Link from "next/link";
import { FaBullseye, FaEye, FaHandshake, FaHeadset, FaLock, FaChartLine } from "react-icons/fa";
import { PageShell } from "@/components/site/page-shell";
import { trustStats } from "@/lib/site-data";

const values = [
  {
    icon: FaLock,
    title: "Security-First",
    desc: "Hardened cloud environments and custom software built with compliance and data protection at the core.",
  },
  {
    icon: FaHeadset,
    title: "Responsive Support",
    desc: "Expert onboarding and 24x7 assistance so every transition is predictable and low-risk.",
  },
  {
    icon: FaChartLine,
    title: "Scalable Technology",
    desc: "From accounting hosting to custom software and smart automation, built to grow with your business.",
  },
  {
    icon: FaHandshake,
    title: "Long-Term Partnership",
    desc: "Transparent pricing and measurable value, with a relationship that continues after go-live.",
  },
];

export default function AboutUsPage() {
  return (
    <PageShell>
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(117deg,_#082957_0%,_#114a97_48%,_#2f7bec_100%)] pb-24 pt-20 text-white">
          <div className="orb-a absolute -left-24 top-16 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="orb-b absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[var(--brand-orange)]/30 blur-3xl" />

          <div className="container-pad relative">
            <div className="reveal-up max-w-3xl">
              <p className="mb-5 inline-block rounded-full bg-white/15 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-100">
                About Licomanagement
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.06] tracking-[-0.02em] md:text-6xl">
                Technology Friend for Accounting Firms and Growing Businesses
              </h1>
              <p className="mt-6 max-w-2xl text-[18px] leading-[1.65] text-blue-100">
                We are a cloud hosting and technology partner — helping accounting and finance teams modernize
                infrastructure, while building custom software, smart devices, and automation solutions for
                businesses ready to grow.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/support#contact"
                  className="rounded-full bg-[var(--brand-orange)] px-7 py-3 text-center text-sm font-bold uppercase tracking-[0.03em] text-white transition hover:brightness-95"
                >
                  Talk to Our Team
                </Link>
                <Link
                  href="/it-software-development"
                  className="rounded-full border border-white/70 px-7 py-3 text-center text-sm font-bold uppercase tracking-[0.03em] text-white transition hover:bg-white hover:text-[var(--brand-blue)]"
                >
                  Explore Our Services
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container-pad relative z-10 -mt-11">
          <div className="reveal-up reveal-delay-1 grid gap-5 rounded-3xl border border-[#dbe6ff] bg-white p-8 shadow-[0_14px_40px_rgba(11,45,99,0.12)] sm:grid-cols-2 lg:grid-cols-4 lg:p-10">
            {trustStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-black text-[#0c336b] md:text-4xl">{stat.value}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-pad mt-20 grid gap-8 lg:grid-cols-2">
          <div className="reveal-up rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf2ff] text-[#1355b2]">
              <FaBullseye className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0b2f63]">Our Mission</h2>
            <p className="mt-3 text-slate-600">
              Help firms modernize workflows without sacrificing compliance or performance — designing managed cloud
              environments optimized for QuickBooks, Sage, and tax software ecosystems, and custom software for the
              operations that run alongside them.
            </p>
          </div>
          <div className="reveal-up reveal-delay-1 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf2ff] text-[#1355b2]">
              <FaEye className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0b2f63]">Our Vision</h2>
            <p className="mt-3 text-slate-600">
              Simplify secure cloud operations and technology adoption for businesses worldwide, so every client can
              scale infrastructure, software, and automation with confidence.
            </p>
          </div>
        </section>

        <section className="container-pad mt-20">
          <div className="reveal-up mx-auto max-w-3xl text-center">
            <h2 className="section-title font-extrabold text-[#0c336b]">Why Businesses Choose Us</h2>
            <p className="section-copy mt-5 text-slate-600">
              The same principles guide every engagement, whether we&rsquo;re hosting accounting workflows or building
              custom software.
            </p>
          </div>

          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              const delays = ["reveal-delay-1", "reveal-delay-2", "reveal-delay-3", "reveal-delay-4"];
              return (
                <article
                  key={value.title}
                  className={`card-lift reveal-up ${delays[index % delays.length]} rounded-2xl border border-slate-200 bg-white p-6 shadow-sm`}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf2ff] text-[#1355b2]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#0b2f63]">{value.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{value.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-18 bg-white py-16">
          <div className="container-pad">
            <div className="reveal-up rounded-3xl border border-[#c8dbff] bg-[linear-gradient(135deg,_#0f3f85_0%,_#0a2e63_100%)] p-8 text-center text-white shadow-[0_16px_36px_rgba(8,28,66,0.2)] lg:p-12">
              <h3 className="text-3xl font-extrabold leading-tight">Ready to Work With Us?</h3>
              <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-7 text-blue-100">
                Whether it&rsquo;s cloud hosting, custom software, or smart automation, our team is ready to help you
                plan the next step.
              </p>
              <Link
                href="/support#contact"
                className="mt-7 inline-flex rounded-full bg-[var(--brand-orange)] px-7 py-3 text-sm font-bold uppercase tracking-[0.04em] text-white transition hover:brightness-95"
              >
                Talk to Our Team
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
