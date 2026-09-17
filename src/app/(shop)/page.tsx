import Link from "next/link";
import { countProducts, listCategories, listProducts } from "@/lib/db";
import { CategoryTile } from "@/components/CategoryTile";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ProductCard } from "@/components/ProductCard";
import { SearchSort } from "@/components/SearchSort";

const PAGE_SIZE = 24;

type Sort = "newest" | "price_asc" | "price_desc";

interface PageProps {
  searchParams: Promise<{ productType?: string; q?: string; sort?: string; page?: string }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const productType = sp.productType || undefined;
  const search = sp.q || undefined;
  const sort = (sp.sort as Sort) || "newest";
  const page = Math.max(1, Number(sp.page) || 1);

  const [categories, total, products] = await Promise.all([
    listCategories(),
    countProducts({ productType, search }),
    listProducts({ productType, search, sort, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (productType) params.set("productType", productType);
    if (search) params.set("q", search);
    if (sort !== "newest") params.set("sort", sort);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-6 font-serif text-4xl">Catalogue</h1>

      <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
        {categories.map((c) => (
          <CategoryTile
            key={c.productType}
            productType={c.productType}
            count={c.count}
            active={productType === c.productType}
          />
        ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar categories={categories} activeType={productType} />

        <div className="flex-1">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-ink/60">{total} pieces</p>
            <SearchSort productType={productType} search={search} sort={sort} />
          </div>

          {products.length === 0 ? (
            <p className="py-20 text-center text-ink/50">No products match your filters.</p>
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
    </div>
  );
}
