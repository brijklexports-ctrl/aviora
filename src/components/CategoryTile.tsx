import Link from "next/link";

export function CategoryTile({
  productType,
  count,
  active,
}: {
  productType: string;
  count: number;
  active: boolean;
}) {
  const href = active ? "/catalog" : `/catalog?productType=${encodeURIComponent(productType)}`;

  return (
    <Link
      href={href}
      className={`flex min-w-[160px] items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
        active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40"
      }`}
    >
      <span className="font-medium">{productType}</span>
      <span className={active ? "text-white/70" : "text-ink/50"}>{count}</span>
    </Link>
  );
}
