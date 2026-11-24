import { Suspense } from "react";
import { PageShell } from "@/components/site/page-shell";
import { StoreContent } from "@/components/store/store-content";

export const metadata = {
  title: "Our Store | Licomanagement Pvt. Ltd.",
  description:
    "Explore our complete product catalog: IT software development solutions, smart devices, lighting automation, security hardware, and business SaaS packages.",
};

export default function StorePage() {
  return (
    <PageShell>
      <main>
        {/* Store Hero Banner */}
        <section className="relative overflow-hidden bg-[linear-gradient(117deg,_#082957_0%,_#114a97_48%,_#2f7bec_100%)] py-16 text-white">
          <div className="container-pad relative">
            <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-100 backdrop-blur-xs">
              Official Store
            </span>
            <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
              Our Store & Technology Solutions
            </h1>
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-blue-100">
              Browse our complete catalog of enterprise software, IoT devices, smart automation systems,
              and SaaS applications. Order online directly or request custom technical deployment.
            </p>
          </div>
        </section>

        {/* Store Catalog Content */}
        <section className="container-pad py-12">
          <Suspense
            fallback={
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-96 animate-pulse rounded-3xl border border-slate-200 bg-slate-100"
                  />
                ))}
              </div>
            }
          >
            <StoreContent />
          </Suspense>
        </section>
      </main>
    </PageShell>
  );
}
