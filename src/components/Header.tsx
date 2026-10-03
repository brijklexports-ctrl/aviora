import Image from "next/image";
import Link from "next/link";
import { COMPANY } from "@/lib/company";
import { MobileNav } from "./MobileNav";
import { MoodBoardPill } from "./MoodBoardPill";

const LINKS = [
  { href: "/collections", label: "Collections" },
  { href: "/shop", label: "Shop all" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Header({ siteName }: { siteName: string }) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur">
      <div className="bg-charcoal px-4 py-1.5 text-center text-[11px] tracking-wide text-white/70">
        {siteName} · a {COMPANY.parent} company
      </div>
      <div className="relative border-b border-line">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
          <Link href="/" className="flex items-center gap-3" aria-label={`${siteName} home`}>
            <Image
              src="/brand/logo-mark.png"
              alt=""
              width={572}
              height={514}
              priority
              className="h-11 w-auto"
            />
            <span className="font-serif text-xl font-semibold uppercase tracking-[0.18em] text-gold sm:text-2xl">
              Aviora
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-[15px] text-ink/75 md:flex">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-ink">
                {l.label}
              </Link>
            ))}
            <MoodBoardPill />
          </nav>

          <MobileNav links={LINKS} />
        </div>
      </div>
    </header>
  );
}
