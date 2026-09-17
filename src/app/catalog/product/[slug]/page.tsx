import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/db";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const images = product.images.length > 0 ? product.images : [];
  const specAttributes = product.attributes.filter(
    (a) => !["price", "description", "detailedTitle"].includes(a.name)
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <nav className="mb-6 text-sm text-ink/60">
        <Link href="/catalog" className="hover:text-ink">
          Catalogue
        </Link>
        <span className="mx-2">/</span>
        <span>{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black">
            {images[0] ? (
              <Image src={images[0]} alt={product.title} fill className="object-cover" priority />
            ) : (
              <div className="flex h-full items-center justify-center text-white/50">No image</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.slice(1, 6).map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded bg-black">
                  <Image src={img} alt={`${product.title} ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-ink/50">
            {product.sku ? `${product.sku} · ` : ""}
            {product.product_type}
          </p>
          <h1 className="mb-4 font-serif text-3xl leading-tight">{product.title}</h1>

          {product.description && (
            <p className="mb-6 text-sm leading-relaxed text-ink/80">{product.description}</p>
          )}

          <a
            href="mailto:brij.klexports@gmail.com"
            className="mb-8 inline-block rounded-full bg-ink px-6 py-3 text-sm text-white hover:bg-ink/90"
          >
            Contact the Seller
          </a>

          {specAttributes.length > 0 && (
            <div className="divide-y divide-line border-t border-line">
              {specAttributes.map((a, i) => (
                <div key={i} className="flex justify-between py-3 text-sm">
                  <span className="text-ink/60">{a.displayName}</span>
                  <span className="font-medium">
                    {a.prefix}
                    {a.value}
                    {a.suffix}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
