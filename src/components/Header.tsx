import Link from "next/link";

export function Header({ siteName }: { siteName: string }) {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-serif text-xl tracking-wide">
          {siteName}
        </Link>
        <nav className="text-sm text-ink/70">
          <Link href="/" className="hover:text-ink">
            Catalogue
          </Link>
        </nav>
      </div>
    </header>
  );
}
