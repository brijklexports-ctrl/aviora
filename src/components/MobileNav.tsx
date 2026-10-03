"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icons";
import { MoodBoardPill } from "./MoodBoardPill";

export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-ink/5"
      >
        <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full z-40 border-b border-line bg-white px-6 pb-6 pt-2 shadow-lg">
          <ul className="divide-y divide-line">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[52px] items-center text-lg text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="flex min-h-[52px] items-center text-lg" onClick={() => setOpen(false)}>
              <MoodBoardPill />
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
