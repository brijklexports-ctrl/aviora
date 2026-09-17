"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductMedia } from "@/lib/db";

export function ProductGallery({ media, title }: { media: ProductMedia[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = media[active];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black">
        {!current ? (
          <div className="flex h-full items-center justify-center text-white/50">No image</div>
        ) : current.type === "video" ? (
          <video
            key={current.url}
            src={current.url}
            poster={current.poster}
            controls
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            key={current.url}
            src={current.url}
            alt={title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        )}
      </div>

      {media.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {media.map((m, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${m.type === "video" ? "video" : "photo"} ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded border-2 bg-black transition-colors ${
                i === active ? "border-ink" : "border-transparent hover:border-ink/30"
              }`}
            >
              <Image
                src={m.type === "video" ? m.poster ?? m.url : m.url}
                alt={`${title} ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
              {m.type === "video" && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                  <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
