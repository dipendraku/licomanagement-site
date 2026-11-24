import Link from "next/link";
import { GlobalNetworkSection } from "@/components/home/global-network-section";
import { HeroSlideshow } from "@/components/home/hero-slideshow";
import FeatureSection from "@/components/ui/stack-feature-section";
import { PageShell } from "@/components/site/page-shell";
import { features, heroSlides, solutionCards } from "@/lib/site-data";

export default function Home() {
  return (
    <PageShell>
      <main>
        <HeroSlideshow slides={heroSlides} />

        <section id="services" className="container-pad relative z-10 -mt-11 scroll-mt-28">
          <div className="reveal-up reveal-delay-1 rounded-3xl border border-[#dbe6ff] bg-white p-8 shadow-[0_14px_40px_rgba(11,45,99,0.12)] lg:p-10">
            <p className="mx-auto mb-4 w-fit rounded-full bg-[#e7f0ff] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#31509f]">
              Cutting-edge. Efficient. Affordable
            </p>
            <h2 className="section-title text-center font-black text-[#0c336b]">
              Cloud Solutions Engineered to Elevate Your Practice
            </h2>
            <p className="section-copy mx-auto mt-5 max-w-4xl text-center text-slate-600">
              Beyond basic infrastructure, your team needs a cloud environment that scales during peak seasons, stays compliant, and keeps collaboration smooth.
            </p>

            <div className="mt-11 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {solutionCards.map((card, index) => (
                <article
                  key={card.title}
                  className={`card-lift rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${
                    index === 0
                      ? "reveal-up reveal-delay-1"
                      : index === 1
                        ? "reveal-up reveal-delay-2"
                        : index === 2
                          ? "reveal-up reveal-delay-3"
                          : "reveal-up reveal-delay-4"
                  }`}
                >
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#6f8ec2]">0{index + 1}</p>
                  <h3 className="text-lg font-extrabold text-[#0b2f63]">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{card.desc}</p>
                  <Link
                    href={card.href}
                    className="mt-4 inline-flex text-sm font-bold text-[var(--brand-blue)] hover:text-[var(--brand-blue-strong)]"
                  >
                    Learn more →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <GlobalNetworkSection />
        <FeatureSection />

        <section className="container-pad mt-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="reveal-up">
              <h2 className="section-title font-extrabold text-[#0c336b]">How Licomanagement Empowers Your Practice to Excel</h2>
              <p className="section-copy mt-5 text-slate-600">
                Thousands of accounting professionals trust our cloud experts to deliver uptime, security, and responsive support. Our platform combines resilient infrastructure with deep accounting-domain expertise.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature, index) => (
                <article
                  key={feature.title}
                  className={`card-lift rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${
                    index === 0
                      ? "reveal-up reveal-delay-1"
                      : index === 1
                        ? "reveal-up reveal-delay-2"
                        : index === 2
                          ? "reveal-up reveal-delay-3"
                          : "reveal-up reveal-delay-4"
                  }`}
                >
                  <h3 className="text-lg font-extrabold text-[#0b2f63]">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-18 bg-white py-16">
          <div className="container-pad grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="reveal-up">
              <h2 className="section-title font-extrabold text-[#0c336b]">Data Integrity & Security</h2>
              <p className="section-copy mt-5 text-slate-600">
                Physical, digital, and operational safeguards protect your hosted accounting environment against ransomware, unauthorized access, and data loss.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {[
                  "End-to-End Encryption",
                  "Multi-Factor Authentication",
                  "Network Firewalls",
                  "Automated Backups",
                ].map((tag) => (
                  <span key={tag} className="rounded-full bg-[#eaf2ff] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.04em] text-[#1f4c91]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="reveal-up reveal-delay-2 rounded-3xl border border-[#c8dbff] bg-[linear-gradient(135deg,_#0f3f85_0%,_#0a2e63_100%)] p-8 text-white shadow-[0_16px_36px_rgba(8,28,66,0.2)]">
              <h3 className="text-3xl font-extrabold leading-tight">Is Your Data Secure Enough?</h3>
              <p className="mt-4 text-[16px] leading-7 text-blue-100">
                Get a no-obligation security walkthrough tailored to your accounting stack and compliance requirements.
              </p>
              <Link
                href="/trial"
                className="mt-7 inline-flex rounded-full bg-[#3d7a28] px-6 py-3 text-sm font-bold uppercase tracking-[0.04em] text-white transition hover:bg-[#2d6020]"
              >
                Get Free Trial Now
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
