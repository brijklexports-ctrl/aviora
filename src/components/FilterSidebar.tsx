import Link from "next/link";

export function FilterSidebar({
  categories,
  activeType,
}: {
  categories: { productType: string; count: number }[];
  activeType?: string;
}) {
  return (
    <aside className="w-full shrink-0 lg:w-56">
      <h2 className="mb-3 text-sm font-semibold">Filters</h2>
      <div className="space-y-1">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/50">
          Product Type
        </p>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href="/catalog"
              className={`block rounded px-2 py-1 ${!activeType ? "bg-ink text-white" : "hover:bg-line/60"}`}
            >
              All
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.productType}>
              <Link
                href={`/catalog?productType=${encodeURIComponent(c.productType)}`}
                className={`flex items-center justify-between rounded px-2 py-1 ${
                  activeType === c.productType ? "bg-ink text-white" : "hover:bg-line/60"
                }`}
              >
                <span>{c.productType}</span>
                <span className="text-xs opacity-60">{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
