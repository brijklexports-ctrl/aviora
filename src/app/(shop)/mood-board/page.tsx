"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clearMoodBoard, getMoodBoard, removeFromMoodBoard, type MoodBoardItem } from "@/lib/moodBoard";

const CONTACT_EMAIL = "brij.klexports@gmail.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.avioralab.com";

function buildMailto(items: MoodBoardItem[]): string {
  const subject = `Quote request: ${items.length} piece${items.length === 1 ? "" : "s"}`;
  const lines = [
    "Hi,",
    "",
    "I'd like a quote on the following pieces:",
    "",
    ...items.map((i, idx) => {
      const parts = [`${idx + 1}. ${i.title}`];
      if (i.sku) parts.push(`   SKU: ${i.sku}`);
      parts.push(`   Type: ${i.productType}`);
      parts.push(`   Link: ${SITE_URL}/product/${i.slug}`);
      return parts.join("\n");
    }),
    "",
    "Please send pricing and availability.",
    "",
    "Thanks!",
  ];
  const body = lines.join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function MoodBoardPage() {
  const [items, setItems] = useState<MoodBoardItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const update = () => setItems(getMoodBoard());
    update();
    setLoaded(true);
    window.addEventListener("aviora-mood-board-change", update);
    return () => window.removeEventListener("aviora-mood-board-change", update);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <nav className="mb-2 text-sm text-ink/60">
        <Link href="/" className="hover:text-ink">
          Collections
        </Link>
        <span className="mx-2">/</span>
        <span>Mood board</span>
      </nav>
      <h1 className="mb-2 font-serif text-4xl">Mood board</h1>
      <p className="mb-8 text-sm text-ink/60">
        Pieces you've saved while browsing. Saved on this device only — request a quote when you're ready and
        we'll follow up by email.
      </p>

      {loaded && items.length === 0 && (
        <div className="rounded-lg border border-dashed border-line py-16 text-center text-ink/50">
          <p>Nothing saved yet.</p>
          <Link href="/" className="mt-2 inline-block text-sm text-ink underline">
            Browse collections
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="mb-6 divide-y divide-line rounded-lg border border-line bg-white">
            {items.map((item) => (
              <div key={item.slug} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <Link href={`/product/${item.slug}`} className="text-sm font-medium hover:underline">
                    {item.title}
                  </Link>
                  <p className="text-xs text-ink/50">
                    {item.sku || "no sku"} · {item.productType}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromMoodBoard(item.slug)}
                  className="shrink-0 text-xs text-ink/50 hover:text-ink"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={buildMailto(items)}
              className="inline-block rounded-full bg-ink px-6 py-3 text-sm text-white hover:bg-ink/90"
            >
              Request a quote on {items.length} piece{items.length === 1 ? "" : "s"}
            </a>
            <button type="button" onClick={clearMoodBoard} className="text-sm text-ink/50 hover:text-ink">
              Clear all
            </button>
          </div>
        </>
      )}
    </div>
  );
}
