import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/site/page-shell";
import { ProductActions } from "@/components/products/product-actions";
import { productCategories } from "@/lib/site-data";
import { createClient } from "@/lib/supabase/server";
import { getProductImage, formatPrice } from "@/lib/product-helpers";
import type { Product } from "@/lib/types";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const { category, product: productSlug } = await params;
  const categoryMeta = productCategories.find((item) => item.slug === category);

  if (!categoryMeta) {
    notFound();
  }

  let product: Product | null = null;
  let connectionError = false;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .eq("slug", productSlug)
      .eq("is_active", true)
      .single();

    if (error) {
      connectionError = true;
    } else {
      product = data;
    }
  } catch {
    connectionError = true;
  }

  if (connectionError) {
    return (
      <PageShell>
        <main className="container-pad py-16">
          <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
            This product page isn&rsquo;t available yet — this site&rsquo;s Supabase project hasn&rsquo;t been
            connected. Set <code className="rounded bg-amber-100 px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>, then run{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5">supabase/schema.sql</code> in the Supabase SQL
            editor.
          </p>
        </main>
      </PageShell>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <PageShell>
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[linear-gradient(117deg,_#082957_0%,_#114a97_48%,_#2f7bec_100%)] py-16 text-white">
          <div className="container-pad relative">
            {/* Breadcrumbs */}
            <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
              <Link href="/store" className="hover:underline">
                Our Store
              </Link>
              <span>/</span>
              <Link href={`/store?category=${categoryMeta.slug}`} className="hover:underline">
                {categoryMeta.label}
              </Link>
              <span>/</span>
              <span className="text-white">{product.sku}</span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
              <div>
                <h1 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
                  {product.name}
                </h1>
                <p className="mt-4 max-w-2xl text-base sm:text-lg text-blue-100 leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-6 flex items-baseline gap-4">
                  <p className="text-3xl sm:text-4xl font-black text-white">
                    {formatPrice(Number(product.price))}
                  </p>
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-200">
                    Ready to Order
                  </span>
                </div>
              </div>

              {/* Product Visual Card */}
              <div className="flex h-56 w-56 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md p-6 border border-white/20 shadow-xl justify-self-center lg:justify-self-end">
                <div className="relative h-44 w-44">
                  <Image
                    src={getProductImage(product)}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Actions & Ordering Section */}
        <section className="container-pad py-16">
          <div className="max-w-3xl">
            <ProductActions product={product} />
          </div>
        </section>
      </main>
    </PageShell>
  );
}
