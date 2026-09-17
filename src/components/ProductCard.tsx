import Image from "next/image";
import Link from "next/link";
import type { ProductRow } from "@/lib/db";

export function ProductCard({ product }: { product: ProductRow }) {
  const first = product.media[0];
  const image = first ? (first.type === "image" ? first.url : first.poster ?? first.url) : undefined;

  return (
    <Link
      href={`/catalog/product/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-line bg-white"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-black">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-white/50">
            No image
          </div>
        )}
      </div>
      <div className="space-y-1 p-4">
        <p className="text-[11px] uppercase tracking-wider text-accent">{product.product_type}</p>
        <h3 className="line-clamp-2 text-sm font-medium">{product.title}</h3>
      </div>
    </Link>
  );
}
