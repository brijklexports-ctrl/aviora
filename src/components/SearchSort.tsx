export function SearchSort({
  productType,
  search,
  sort,
}: {
  productType?: string;
  search?: string;
  sort?: string;
}) {
  return (
    <form action="/" method="get" className="flex flex-1 flex-wrap items-center gap-3">
      {productType && <input type="hidden" name="productType" value={productType} />}
      <input
        type="text"
        name="q"
        defaultValue={search}
        placeholder="Search products"
        className="min-w-[220px] flex-1 rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-ink"
      />
      <select
        name="sort"
        defaultValue={sort || "newest"}
        className="rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-ink"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
      <button
        type="submit"
        className="rounded-full border border-ink px-4 py-2 text-sm hover:bg-ink hover:text-white"
      >
        Apply
      </button>
    </form>
  );
}
