import Link from "next/link";
import { countAllProductsAdmin, listAllProductsAdmin } from "@/lib/db";
import { saveProductAction } from "./actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 30;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const search = sp.q || undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const [total, products] = await Promise.all([
    countAllProductsAdmin(search),
    listAllProductsAdmin({ search, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/admin/products?${qs}` : "/admin/products";
  };

  return (
    <div>
      <h1 className="mb-1 font-serif text-2xl">Products</h1>
      <p className="mb-5 text-sm text-ink/60">
        Feature a piece to pin it to the front of its collection, hide one without deleting it, or override its
        title/description without touching gembox.app. {total} total.
      </p>

      <form action="/admin/products" method="get" className="mb-5">
        <input
          type="text"
          name="q"
          defaultValue={search}
          placeholder="Search by title or SKU"
          className="w-full max-w-sm rounded-full border border-line px-4 py-2 text-sm outline-none focus:border-ink"
        />
      </form>

      <div className="space-y-3">
        {products.map((p) => {
          const thumb = p.media[0];
          const thumbUrl = thumb ? (thumb.type === "image" ? thumb.url : thumb.poster ?? thumb.url) : null;
          return (
            <form
              key={p.id}
              action={saveProductAction}
              className="flex flex-col gap-3 rounded-lg border border-line bg-white p-3 md:flex-row md:items-start"
            >
              <input type="hidden" name="id" value={p.id} />
              <div className="flex shrink-0 gap-3 md:w-64">
                {thumbUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbUrl} alt="" className="h-16 w-16 rounded object-cover" />
                ) : (
                  <div className="h-16 w-16 rounded bg-line" />
                )}
                <div className="min-w-0">
                  <Link
                    href={`/product/${p.slug}`}
                    target="_blank"
                    className="line-clamp-2 text-sm font-medium hover:underline"
                  >
                    {p.title_override || p.title}
                  </Link>
                  <p className="text-xs text-ink/50">
                    {p.sku || "no sku"} · {p.product_type} {!p.active && "· inactive"}
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-wrap items-center gap-4">
                <label className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" name="featured" defaultChecked={p.featured} />
                  Featured
                </label>
                <label className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" name="hidden" defaultChecked={p.hidden} />
                  Hidden
                </label>
                <label className="flex items-center gap-1.5 text-sm">
                  Sort
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={p.sort_order ?? ""}
                    placeholder="auto"
                    className="w-20 rounded border border-line px-2 py-1 text-sm outline-none focus:border-ink"
                  />
                </label>

                <details className="w-full">
                  <summary className="cursor-pointer text-xs text-ink/50">Override title/description</summary>
                  <div className="mt-2 space-y-2">
                    <input
                      type="text"
                      name="titleOverride"
                      defaultValue={p.title_override ?? ""}
                      placeholder={p.title}
                      className="w-full rounded border border-line px-2 py-1 text-sm outline-none focus:border-ink"
                    />
                    <textarea
                      name="descriptionOverride"
                      defaultValue={p.description_override ?? ""}
                      placeholder={p.description ?? ""}
                      rows={2}
                      className="w-full rounded border border-line px-2 py-1 text-sm outline-none focus:border-ink"
                    />
                  </div>
                </details>

                <button
                  type="submit"
                  className="ml-auto rounded-full border border-ink px-4 py-1.5 text-sm hover:bg-ink hover:text-white"
                >
                  Save
                </button>
              </div>
            </form>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
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
  );
}
