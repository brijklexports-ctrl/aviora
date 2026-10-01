"use client";

import { useEffect, useState } from "react";
import { isInMoodBoard, toggleMoodBoard, type MoodBoardItem } from "@/lib/moodBoard";

const HEART_OUTLINE = (
  <path d="M12 21s-6.7-4.35-9.3-8.1C.8 10.1 1.4 6.6 4.2 5c2.2-1.25 4.8-.6 6.3 1.2.5.6 1 1.3 1.5 1.9.5-.6 1-1.3 1.5-1.9 1.5-1.8 4.1-2.45 6.3-1.2 2.8 1.6 3.4 5.1 1.5 7.9C18.7 16.65 12 21 12 21Z" />
);
const HEART_FILLED = (
  <path d="M12 21s-6.7-4.35-9.3-8.1C.8 10.1 1.4 6.6 4.2 5c2.2-1.25 4.8-.6 6.3 1.2.5.6 1 1.3 1.5 1.9.5-.6 1-1.3 1.5-1.9 1.5-1.8 4.1-2.45 6.3-1.2 2.8 1.6 3.4 5.1 1.5 7.9C18.7 16.65 12 21 12 21Z" fill="currentColor" />
);

export function MoodBoardButton({
  item,
  className,
  withLabel,
}: {
  item: MoodBoardItem;
  className?: string;
  withLabel?: boolean;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isInMoodBoard(item.slug));
    const onChange = () => setSaved(isInMoodBoard(item.slug));
    window.addEventListener("aviora-mood-board-change", onChange);
    return () => window.removeEventListener("aviora-mood-board-change", onChange);
  }, [item.slug]);

  const defaultClass = withLabel
    ? "inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-sm hover:bg-ink hover:text-white"
    : "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm hover:bg-white";

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from mood board" : "Save to mood board"}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSaved(toggleMoodBoard(item));
      }}
      className={className ?? defaultClass}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
        {saved ? HEART_FILLED : HEART_OUTLINE}
      </svg>
      {withLabel && (saved ? "Saved to mood board" : "Save to mood board")}
    </button>
  );
}
