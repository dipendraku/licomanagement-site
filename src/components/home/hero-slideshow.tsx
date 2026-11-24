"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { HeroSlide } from "@/lib/site-data";

type HeroSlideshowProps = {
  slides: HeroSlide[];
};

export function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeSlides = useMemo(() => (slides.length > 0 ? slides : []), [slides]);

  useEffect(() => {
    if (safeSlides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeSlides.length);
    }, 5600);

    return () => window.clearInterval(timer);
  }, [safeSlides.length]);

  if (safeSlides.length === 0) {
    return null;
  }

  const active = safeSlides[activeIndex];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(117deg,_#082957_0%,_#114a97_48%,_#2f7bec_100%)] pb-18 pt-20 text-white lg:pb-24 lg:pt-24">
      <div className="orb-a absolute -left-24 top-16 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="orb-b absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[var(--brand-orange)]/30 blur-3xl" />

      <div className="container-pad relative grid items-center gap-12 lg:grid-cols-[1.07fr_0.93fr]">
        <div key={`copy-${activeIndex}`} className="reveal-up">
          <p className="mb-5 inline-block rounded-full bg-white/15 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-100">
            {active.eyebrow}
          </p>
          <h1 className="max-w-[14ch] text-4xl font-extrabold leading-[1.06] tracking-[-0.02em] md:text-6xl">
            {active.title}
          </h1>
          <p className="mt-6 max-w-2xl text-[18px] leading-[1.65] text-blue-100">{active.description}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={active.ctaPrimary.href}
              className="rounded-full bg-[var(--brand-orange)] px-7 py-3 text-center text-sm font-bold uppercase tracking-[0.03em] text-white transition hover:brightness-95"
            >
              {active.ctaPrimary.label}
            </Link>
            <Link
              href={active.ctaSecondary.href}
              className="rounded-full border border-white/70 px-7 py-3 text-center text-sm font-bold uppercase tracking-[0.03em] text-white transition hover:bg-white hover:text-[var(--brand-blue)]"
            >
              {active.ctaSecondary.label}
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-2">
            {safeSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? "w-9 bg-white" : "w-2.5 bg-white/45 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="relative min-h-[320px] lg:min-h-[340px]">
          {safeSlides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={slide.title}
                className={`absolute inset-0 rounded-[1.7rem] border border-white/25 bg-white/10 p-5 backdrop-blur-sm transition-all duration-700 [transform-style:preserve-3d] ${
                  isActive
                    ? "z-20 opacity-100 [transform:perspective(1400px)_rotateY(0deg)_translateX(0px)]"
                    : "pointer-events-none z-10 opacity-0 [transform:perspective(1400px)_rotateY(14deg)_translateX(42px)]"
                }`}
              >
                <div className={`relative h-full w-full overflow-hidden rounded-2xl border border-white/20 bg-white/10 ${isActive ? "reveal-up reveal-delay-1" : ""}`}>
                  <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/25 blur-2xl" />
                  <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-[#fa9539]/25 blur-2xl" />
                  <Image
                    src={slide.frameImage.src}
                    alt={slide.frameImage.alt}
                    fill
                    className="object-cover [transform:translateZ(20px)]"
                    sizes="(max-width: 1024px) 100vw, 44vw"
                    priority={index === 0}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
