import Image from "next/image";
import Link from "next/link";
import type { IconType } from "react-icons";
import { PageShell } from "@/components/site/page-shell";

const revealDelays = ["reveal-delay-1", "reveal-delay-2", "reveal-delay-3", "reveal-delay-4"];

export type ServiceHighlight = {
  icon: IconType;
  title: string;
  desc: string;
  href: string;
};

export type ProcessStep = {
  icon: IconType;
  title: string;
  desc: string;
};

export type ServicePageTemplateProps = {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: { src: string; alt: string };
  ctaPrimary: { href: string; label: string };
  ctaSecondary: { href: string; label: string };
  highlightsEyebrow: string;
  highlightsTitle: string;
  highlightsDescription: string;
  highlights: ServiceHighlight[];
  processTitle: string;
  processDescription: string;
  processSteps: ProcessStep[];
  architectureTitle: string;
  architectureDescription: string;
  architectureTags: string[];
  ctaPanelTitle: string;
  ctaPanelDescription: string;
  ctaPanel: { href: string; label: string };
};

export function ServicePageTemplate({
  eyebrow,
  title,
  description,
  heroImage,
  ctaPrimary,
  ctaSecondary,
  highlightsEyebrow,
  highlightsTitle,
  highlightsDescription,
  highlights,
  processTitle,
  processDescription,
  processSteps,
  architectureTitle,
  architectureDescription,
  architectureTags,
  ctaPanelTitle,
  ctaPanelDescription,
  ctaPanel,
}: ServicePageTemplateProps) {
  return (
    <PageShell>
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(117deg,_#082957_0%,_#114a97_48%,_#2f7bec_100%)] pb-18 pt-20 text-white lg:pb-24 lg:pt-24">
          <div className="orb-a absolute -left-24 top-16 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="orb-b absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[var(--brand-orange)]/30 blur-3xl" />

          <div className="container-pad relative grid items-center gap-12 lg:grid-cols-[1.07fr_0.93fr]">
            <div className="reveal-up">
              <p className="mb-5 inline-block rounded-full bg-white/15 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-100">
                {eyebrow}
              </p>
              <h1 className="max-w-[16ch] text-4xl font-extrabold leading-[1.06] tracking-[-0.02em] md:text-6xl">
                {title}
              </h1>
              <p className="mt-6 max-w-2xl text-[18px] leading-[1.65] text-blue-100">{description}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={ctaPrimary.href}
                  className="rounded-full bg-[var(--brand-orange)] px-7 py-3 text-center text-sm font-bold uppercase tracking-[0.03em] text-white transition hover:brightness-95"
                >
                  {ctaPrimary.label}
                </Link>
                <Link
                  href={ctaSecondary.href}
                  className="rounded-full border border-white/70 px-7 py-3 text-center text-sm font-bold uppercase tracking-[0.03em] text-white transition hover:bg-white hover:text-[var(--brand-blue)]"
                >
                  {ctaSecondary.label}
                </Link>
              </div>
            </div>

            <div className="relative min-h-[320px] lg:min-h-[380px]">
              <div className="reveal-up reveal-delay-1 absolute inset-0 overflow-hidden rounded-[1.7rem] border border-white/25 bg-white/10 p-5 backdrop-blur-sm">
                <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/20 bg-white/10">
                  <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/25 blur-2xl" />
                  <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-[#fa9539]/25 blur-2xl" />
                  <Image
                    src={heroImage.src}
                    alt={heroImage.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 44vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="container-pad relative z-10 -mt-11 scroll-mt-28">
          <div className="reveal-up reveal-delay-1 rounded-3xl border border-[#dbe6ff] bg-white p-8 shadow-[0_14px_40px_rgba(11,45,99,0.12)] lg:p-10">
            <p className="mx-auto mb-4 w-fit rounded-full bg-[#e7f0ff] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#31509f]">
              {highlightsEyebrow}
            </p>
            <h2 className="section-title text-center font-black text-[#0c336b]">{highlightsTitle}</h2>
            <p className="section-copy mx-auto mt-5 max-w-4xl text-center text-slate-600">{highlightsDescription}</p>

            <div className="mt-11 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {highlights.map((service, index) => {
                const Icon = service.icon;
                return (
                  <article
                    key={service.title}
                    className={`card-lift reveal-up ${revealDelays[index % revealDelays.length]} rounded-2xl border border-slate-200 bg-white p-6 shadow-sm`}
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf2ff] text-[#1355b2]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#0b2f63]">{service.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{service.desc}</p>
                    <Link
                      href={service.href}
                      className="mt-4 inline-flex text-sm font-bold text-[var(--brand-blue)] hover:text-[var(--brand-blue-strong)]"
                    >
                      Learn more →
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container-pad mt-20">
          <div className="reveal-up mx-auto max-w-3xl text-center">
            <h2 className="section-title font-extrabold text-[#0c336b]">{processTitle}</h2>
            <p className="section-copy mt-5 text-slate-600">{processDescription}</p>
          </div>

          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className={`card-lift reveal-up ${revealDelays[index % revealDelays.length]} rounded-2xl border border-slate-200 bg-white p-5 shadow-sm`}
                >
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#6f8ec2]">0{index + 1}</p>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf2ff] text-[#1355b2]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#0b2f63]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-18 bg-white py-16">
          <div className="container-pad grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="reveal-up">
              <h2 className="section-title font-extrabold text-[#0c336b]">{architectureTitle}</h2>
              <p className="section-copy mt-5 text-slate-600">{architectureDescription}</p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {architectureTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#eaf2ff] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.04em] text-[#1f4c91]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="reveal-up reveal-delay-2 rounded-3xl border border-[#c8dbff] bg-[linear-gradient(135deg,_#0f3f85_0%,_#0a2e63_100%)] p-8 text-white shadow-[0_16px_36px_rgba(8,28,66,0.2)]">
              <h3 className="text-3xl font-extrabold leading-tight">{ctaPanelTitle}</h3>
              <p className="mt-4 text-[16px] leading-7 text-blue-100">{ctaPanelDescription}</p>
              <Link
                href={ctaPanel.href}
                className="mt-7 inline-flex rounded-full bg-[#3d7a28] px-6 py-3 text-sm font-bold uppercase tracking-[0.04em] text-white transition hover:bg-[#2d6020]"
              >
                {ctaPanel.label}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
