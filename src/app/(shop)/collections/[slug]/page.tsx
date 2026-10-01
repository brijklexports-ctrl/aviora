import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { countProducts, getRepresentativeImage, listCollections, listProducts } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { ProductCard } from "@/components/ProductCard";
import { SearchSort } from "@/components/SearchSort";

const PAGE_SIZE = 24;

type Sort = "newest" | "price_asc" | "price_desc";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const collections = await listCollections({ publishedOnly: true });
  const collection = collections.find((c) => slugify(c.productType) === slug);
  if (!collection) notFound();

  const search = sp.q || undefined;
  const sort = (sp.sort as Sort) || "newest";
  const page = Math.max(1, Number(sp.page) || 1);

  const [total, products, heroImage] = await Promise.all([
    countProducts({ productType: collection.productType, search }),
    listProducts({
      productType: collection.productType,
      search,
      sort,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
    collection.heroImageUrl ? Promise.resolve(collection.heroImageUrl) : getRepresentativeImage(collection.productType),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const basePath = `/collections/${slug}`;

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (sort !== "newest") params.set("sort", sort);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div>
      <div className="relative flex h-64 items-end overflow-hidden bg-black md:h-80">
        {heroImage && (
          <Image src={heroImage} alt={collection.title} fill sizes="100vw" className="object-cover opacity-70" priority />
        )}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-8 text-white">
          <nav className="mb-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white">
              Collections
            </Link>
            <span className="mx-2">/</span>
            <span>{collection.title}</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl">{collection.title}</h1>
          {collection.description && <p className="mt-2 max-w-xl text-sm text-white/80">{collection.description}</p>}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-ink/60">{total} pieces</p>
          <SearchSort action={basePath} search={search} sort={sort} />
        </div>

        {products.length === 0 ? (
          <p className="py-20 text-center text-ink/50">No products match your search.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2 text-sm">
            {page > 1 && (
              <Link href={pageHref(page - 1)} className="rounded-full border border-line px-4 py-2 hover:border-ink">
                Previous
              </Link>
            )}
            <span className="px-3 text-ink/60">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link href={pageHref(page + 1)} className="rounded-full border border-line px-4 py-2 hover:border-ink">
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
