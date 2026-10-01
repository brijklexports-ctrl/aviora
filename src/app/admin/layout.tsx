import Link from "next/link";
import { logoutAction } from "./login/actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/admin" className="font-serif text-lg">
              Admin
            </Link>
            <Link href="/admin/collections" className="text-ink/70 hover:text-ink">
              Collections
            </Link>
            <Link href="/admin/products" className="text-ink/70 hover:text-ink">
              Products
            </Link>
            <Link href="/" className="text-ink/70 hover:text-ink">
              View site
            </Link>
          </nav>
          <form action={logoutAction}>
            <button type="submit" className="text-sm text-ink/60 hover:text-ink">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
