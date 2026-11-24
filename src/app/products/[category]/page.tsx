import { notFound } from "next/navigation";
import { PageShell } from "@/components/site/page-shell";
import { ProductGrid } from "@/components/products/product-grid";
import { productCategories } from "@/lib/site-data";

export default async function ProductCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryMeta = productCategories.find((item) => item.slug === category);

  if (!categoryMeta) {
    notFound();
  }

  return (
    <PageShell>
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(117deg,_#082957_0%,_#114a97_48%,_#2f7bec_100%)] py-16 text-white">
          <div className="container-pad relative">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
              <a href="/store" className="hover:underline">
                Our Store
              </a>
              <span>/</span>
              <span>{categoryMeta.label}</span>
            </div>
            <h1 className="max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">{categoryMeta.label}</h1>
            <p className="mt-5 max-w-2xl text-lg text-blue-100">
              Sample {categoryMeta.label.toLowerCase()} products available to request or purchase directly.
            </p>
          </div>
        </section>

        <section className="container-pad py-16">
          <ProductGrid category={categoryMeta.slug} />
        </section>
      </main>
    </PageShell>
  );
}
