"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { COMPANY, whatsappLink } from "@/lib/company";
import { Icon } from "@/components/Icons";
import { clearMoodBoard, getMoodBoard, removeFromMoodBoard } from "@/lib/moodBoard";
import type { MoodBoardProduct } from "@/app/api/mood-board/route";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.avioralab.com";

function quoteText(items: MoodBoardProduct[]): string {
  const lines = [
    `Hi, I'd like a quote on these ${items.length} piece${items.length === 1 ? "" : "s"}:`,
    "",
    ...items.map((i, idx) => {
      const parts = [`${idx + 1}. ${i.title}`];
      if (i.sku) parts.push(`   Style no.: ${i.sku}`);
      if (i.metal) parts.push(`   Metal: ${i.metal}`);
      if (i.diamondWeight) parts.push(`   Diamond weight: ${i.diamondWeight}`);
      if (i.grossWeight) parts.push(`   Gross weight: ${i.grossWeight}`);
      if (i.price && i.price !== "Request price") parts.push(`   Listed price: ${i.price}`);
      parts.push(`   ${SITE_URL}/product/${i.slug}`);
      return parts.join("\n");
    }),
    "",
    "Please send pricing and availability. Thank you!",
  ];
  return lines.join("\n");
}

function buildMailto(items: MoodBoardProduct[]): string {
  const subject = `Quote request: ${items.length} piece${items.length === 1 ? "" : "s"}`;
  return `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(quoteText(items))}`;
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="aspect-square animate-pulse bg-line/70" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-line/70" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-line/70" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-line/70" />
      </div>
    </div>
  );
}

export default function MoodBoardPage() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [details, setDetails] = useState<Record<string, MoodBoardProduct>>({});
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const update = () => setSlugs(getMoodBoard().map((i) => i.slug));
    update();
    setHydrated(true);
    window.addEventListener("aviora-mood-board-change", update);
    return () => window.removeEventListener("aviora-mood-board-change", update);
  }, []);

  // Fetch fresh photos and details only for slugs we haven't loaded yet.
  const slugsKey = slugs.join(",");
  useEffect(() => {
    // Wait until the saved list has been read from this browser, otherwise
    // an empty first render would flash the wrong state.
    if (!hydrated) return;
    const missing = slugs.filter((s) => !(s in details));
    if (missing.length === 0) {
      setStatus("ready");
      return;
    }
    setStatus("loading");
    let cancelled = false;
    fetch(`/api/mood-board?slugs=${encodeURIComponent(missing.join(","))}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { items: MoodBoardProduct[] }) => {
        if (cancelled) return;
        setDetails((prev) => {
          const next = { ...prev };
          for (const item of data.items) next[item.slug] = item;
          return next;
        });
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugsKey, hydrated]);

  const available = useMemo(() => slugs.map((s) => details[s]).filter(Boolean), [slugs, details]);
  const count = slugs.length;
  const canQuote = status === "ready" && available.length > 0;
  const wa = canQuote ? whatsappLink(quoteText(available)) : null;
  const hasContactBar = Boolean(COMPANY.whatsapp || COMPANY.phone);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-32 sm:px-6 md:py-12 md:pb-12">
      <nav className="mb-3 text-sm text-ink/60">
        <Link href="/collections" className="hover:text-ink">
          Collections
        </Link>
        <span className="mx-2">/</span>
        <span>Mood board</span>
      </nav>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-semibold sm:text-5xl">Your mood board</h1>
          <p className="mt-2 max-w-xl text-ink/65">
            The pieces you have saved, all in one place. Send us the list and we will get back to you with pricing.
          </p>
        </div>

        {count > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={canQuote ? buildMailto(available) : undefined}
              aria-disabled={!canQuote}
              className="hidden min-h-[52px] items-center justify-center gap-2 rounded-full bg-charcoal px-7 text-base font-medium text-white hover:bg-ink md:inline-flex"
            >
              <Icon name="mail" />
              Request a quote ({available.length || count})
            </a>
            {wa && (
              <a
                href={wa}
                className="hidden min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#1f8f4e] px-7 text-base font-medium text-white md:inline-flex"
              >
                <Icon name="chat" />
                Send on WhatsApp
              </a>
            )}
            <button type="button" onClick={clearMoodBoard} className="min-h-[44px] px-2 text-sm text-ink/55 hover:text-ink">
              Clear all
            </button>
          </div>
        )}
      </div>

      {status === "ready" && count === 0 && (
        <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-ivory text-gold">
            <Icon name="heart" className="h-8 w-8" />
          </div>
          <h2 className="font-serif text-2xl font-semibold">Nothing saved yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-ink/60">
            Tap the heart on any piece you like and it will appear here, so you can compare and ask us for a quote.
          </p>
          <Link
            href="/collections"
            className="mt-7 inline-flex min-h-[52px] items-center justify-center rounded-full bg-charcoal px-8 text-base font-medium text-white hover:bg-ink"
          >
            Browse collections
          </Link>
        </div>
      )}

      {status === "error" && (
        <p className="mb-6 rounded-lg border border-line bg-white p-4 text-sm text-ink/70">
          We could not load your saved pieces just now. Please refresh the page and try again.
        </p>
      )}

      {count > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {status === "loading" && slugs.map((s) => <SkeletonCard key={s} />)}

          {status === "ready" &&
            slugs.map((slug) => {
              const item = details[slug];

              if (!item) {
                return (
                  <div key={slug} className="flex flex-col justify-between rounded-xl border border-line bg-white p-4">
                    <div>
                      <p className="text-sm font-medium text-ink/70">No longer available</p>
                      <p className="mt-1 text-xs text-ink/50">This piece has been removed from our catalog.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromMoodBoard(slug)}
                      className="mt-4 min-h-[44px] self-start text-sm text-ink underline"
                    >
                      Remove
                    </button>
                  </div>
                );
              }

              const chips = [item.metal, item.diamondWeight && `${item.diamondWeight} diamonds`, item.grossWeight].filter(
                (c): c is string => Boolean(c)
              );

              return (
                <article key={slug} className="group overflow-hidden rounded-xl border border-line bg-white">
                  <div className="relative aspect-square bg-black">
                    <Link href={`/product/${slug}`} aria-label={item.title} className="absolute inset-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-xs text-white/50">No image</span>
                      )}
                    </Link>
                    <button
                      type="button"
                      aria-label={`Remove ${item.title} from mood board`}
                      onClick={() => removeFromMoodBoard(slug)}
                      className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm hover:bg-white"
                    >
                      <Icon name="close" className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-3 sm:p-4">
                    <p className="text-[11px] uppercase tracking-wider text-accent">{item.category}</p>
                    <h3 className="mt-1 line-clamp-3 font-serif text-lg font-semibold leading-snug">
                      <Link href={`/product/${slug}`} className="hover:underline">
                        {item.title}
                      </Link>
                    </h3>

                    {chips.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {chips.map((chip) => (
                          <span key={chip} className="rounded-full bg-ivory px-2.5 py-1 text-xs text-ink/70">
                            {chip}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.price && (
                      <p
                        className={
                          item.price === "Request price" ? "mt-3 text-sm text-ink/50" : "mt-3 text-lg font-semibold text-ink"
                        }
                      >
                        {item.price}
                      </p>
                    )}

                    <Link
                      href={`/product/${slug}`}
                      className="mt-3 inline-flex min-h-[44px] items-center gap-1 text-sm font-medium text-ink underline-offset-4 hover:underline"
                    >
                      View details <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
        </div>
      )}

      {/* Phone: the quote action stays within thumb reach while scrolling. */}
      {count > 0 && (
        <div
          className={`fixed inset-x-0 z-20 border-t border-line bg-white/95 p-3 backdrop-blur md:hidden ${
            hasContactBar ? "bottom-[72px]" : "bottom-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          }`}
        >
          <a
            href={canQuote ? buildMailto(available) : undefined}
            aria-disabled={!canQuote}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-charcoal text-base font-medium text-white"
          >
            <Icon name="mail" />
            Request a quote ({available.length || count})
          </a>
        </div>
      )}
    </div>
  );
}
