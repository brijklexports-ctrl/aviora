import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/db";
import { ProductGallery } from "@/components/ProductGallery";
import { MoodBoardButton } from "@/components/MoodBoardButton";
import { slugify } from "@/lib/slug";
import { formatCarats, formatGrams, parseSpecs } from "@/lib/specs";
import { COMPANY } from "@/lib/company";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.avioralab.com";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const specs = parseSpecs(product.title);
  const title = specs.cleanTitle;

  const specRows: { label: string; value: string }[] = [];
  if (specs.metal) specRows.push({ label: "Metal", value: specs.karat ? `${specs.karat} ${specs.metal}` : specs.metal });
  if (specs.diamondWeightCt !== null) specRows.push({ label: "Diamond weight", value: formatCarats(specs.diamondWeightCt) });
  if (specs.grossWeightG !== null) specRows.push({ label: "Gross weight", value: formatGrams(specs.grossWeightG) });
  specRows.push({ label: "Category", value: product.product_type });
  if (product.sku) specRows.push({ label: "Style no.", value: product.sku });

  const productUrl = `${SITE_URL}/product/${product.slug}`;
  const mailSubject = `Inquiry: ${title}`;
  const mailBody = [
    `Hi,`,
    ``,
    `I'm interested in this piece:`,
    ``,
    title,
    product.sku ? `Style no.: ${product.sku}` : null,
    ...specRows.filter((r) => r.label !== "Style no." && r.label !== "Category").map((r) => `${r.label}: ${r.value}`),
    `Category: ${product.product_type}`,
    `Link: ${productUrl}`,
    ``,
    `Please send me more details.`,
    ``,
    `Thanks!`,
  ]
    .filter((line) => line !== null)
    .join("\n");
  const mailtoHref = `mailto:${COMPANY.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <nav className="mb-6 text-sm text-ink/60">
        <Link href="/collections" className="hover:text-ink">
          Collections
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/collections/${slugify(product.product_type)}`} className="hover:text-ink">
          {product.product_type}
        </Link>
        <span className="mx-2">/</span>
        <span>{title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery media={product.media} title={title} />

        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-ink/50">
            {product.sku ? `${product.sku} · ` : ""}
            {product.product_type}
          </p>
          <h1 className="mb-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>

          {product.description && (
            <p className="mb-6 text-sm leading-relaxed text-ink/80">{product.description}</p>
          )}

          <div className="mb-8 flex flex-wrap items-center gap-3">
            <a
              href={mailtoHref}
              className="inline-flex min-h-[48px] items-center rounded-full bg-ink px-6 text-sm text-white hover:bg-ink/90"
            >
              Contact the Seller
            </a>
            <MoodBoardButton
              withLabel
              item={{ slug: product.slug, title, sku: product.sku, productType: product.product_type }}
            />
          </div>

          <h2 className="mb-2 font-serif text-xl font-semibold">Specifications</h2>
          <dl className="divide-y divide-line border-y border-line">
            {specRows.map((r) => (
              <div key={r.label} className="flex justify-between gap-4 py-3 text-[15px]">
                <dt className="text-ink/60">{r.label}</dt>
                <dd className="text-right font-medium">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
