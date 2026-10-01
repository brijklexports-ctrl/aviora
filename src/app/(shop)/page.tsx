import Link from "next/link";
import Image from "next/image";
import { listCollections, getRepresentativeImage } from "@/lib/db";
import { slugify } from "@/lib/slug";

// No params/searchParams on this page, so Next would otherwise try to
// statically prerender it at build time (hitting the live DB before any
// deploy env exists). Collections also change via the admin panel and
// daily sync, so it should never be a stale build-time snapshot anyway.
export const dynamic = "force-dynamic";

export default async function CollectionsHomePage() {
  const collections = await listCollections({ publishedOnly: true });

  const withImages = await Promise.all(
    collections.map(async (c) => ({
      ...c,
      image: c.heroImageUrl ?? (await getRepresentativeImage(c.productType)),
      slug: slugify(c.productType),
    }))
  );

  const [featured, ...rest] = withImages;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-6 font-serif text-4xl">Collections</h1>

      {featured && (
        <Link
          href={`/collections/${featured.slug}`}
          className="group mb-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-line bg-white md:grid-cols-2"
        >
          <div className="relative aspect-[4/3] md:aspect-auto">
            {featured.image ? (
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-black" />
            )}
          </div>
          <div className="flex flex-col justify-center p-8 md:p-10">
            <p className="mb-3 text-xs uppercase tracking-wider text-accent">Featured collection</p>
            <h2 className="mb-3 font-serif text-3xl leading-tight">{featured.title}</h2>
            {featured.description && <p className="mb-4 text-sm text-ink/70">{featured.description}</p>}
            <p className="text-sm font-medium text-ink/60">{featured.count} pieces</p>
            <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-white">
              View collection →
            </span>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((c) => (
          <Link
            key={c.productType}
            href={`/collections/${c.slug}`}
            className="group overflow-hidden rounded-xl border border-line bg-white"
          >
            <div className="relative aspect-[4/3] bg-black">
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : null}
            </div>
            <div className="p-4">
              <h3 className="font-serif text-lg">{c.title}</h3>
              {c.description && <p className="mt-1 line-clamp-2 text-sm text-ink/60">{c.description}</p>}
              <p className="mt-2 text-xs uppercase tracking-wide text-ink/50">{c.count} pieces</p>
            </div>
          </Link>
        ))}
      </div>

      {collections.length === 0 && (
        <p className="py-20 text-center text-ink/50">No collections yet — check back soon.</p>
      )}
    </div>
  );
}
