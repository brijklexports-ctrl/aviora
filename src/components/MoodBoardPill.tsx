"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMoodBoard } from "@/lib/moodBoard";

export function MoodBoardPill() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(getMoodBoard().length);
    update();
    window.addEventListener("aviora-mood-board-change", update);
    return () => window.removeEventListener("aviora-mood-board-change", update);
  }, []);

  if (count === 0) {
    return (
      <Link href="/mood-board" className="hover:text-ink">
        Mood board
      </Link>
    );
  }

  return (
    <Link
      href="/mood-board"
      className="flex items-center gap-1.5 rounded-full border border-ink bg-ink px-3 py-1 text-white"
    >
      Mood board
      <span className="rounded-full bg-white/20 px-1.5 text-xs">{count}</span>
    </Link>
  );
}
