import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/db";
import { ProductGallery } from "@/components/ProductGallery";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.avioralab.com";
const CONTACT_EMAIL = "brij.klexports@gmail.com";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const specAttributes = product.attributes.filter(
    (a) => !["price", "description", "detailedTitle"].includes(a.name)
  );

  const productUrl = `${SITE_URL}/product/${product.slug}`;
  const mailSubject = `Inquiry: ${product.title}`;
  const mailBody = [
    `Hi,`,
    ``,
    `I'm interested in this piece:`,
    ``,
    product.title,
    product.sku ? `SKU: ${product.sku}` : null,
    `Product Type: ${product.product_type}`,
    `Link: ${productUrl}`,
    ``,
    `Please send me more details.`,
    ``,
    `Thanks!`,
  ]
    .filter((line) => line !== null)
    .join("\n");
  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <nav className="mb-6 text-sm text-ink/60">
        <Link href="/" className="hover:text-ink">
          Catalogue
        </Link>
        <span className="mx-2">/</span>
        <span>{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery media={product.media} title={product.title} />

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
            href={mailtoHref}
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
