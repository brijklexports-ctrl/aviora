import Image from "next/image";
import Link from "next/link";
import type { ProductRow } from "@/lib/db";
import { MoodBoardButton } from "./MoodBoardButton";
import { parseSpecs, specSummary } from "@/lib/specs";

export function ProductCard({ product }: { product: ProductRow }) {
  const specs = parseSpecs(product.title);
  const summary = specSummary(specs);
  const first = product.media[0];
  const image = first ? (first.type === "image" ? first.url : first.poster ?? first.url) : undefined;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-line bg-white"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-black">
        {image ? (
          <Image
            src={image}
            alt={specs.cleanTitle}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-white/50">
            No image
          </div>
        )}
        <div className="absolute right-2 top-2">
          <MoodBoardButton
            item={{ slug: product.slug, title: specs.cleanTitle, sku: product.sku, productType: product.product_type }}
          />
        </div>
      </div>
      <div className="space-y-1 p-4">
        <p className="text-[11px] uppercase tracking-wider text-accent">{product.product_type}</p>
        <h3 className="line-clamp-2 text-sm font-medium">{specs.cleanTitle}</h3>
        {summary && <p className="text-xs text-ink/55">{summary}</p>}
      </div>
    </Link>
  );
}
