import Image from "next/image";
import Link from "next/link";
import { COMPANY, phoneLink, whatsappLink } from "@/lib/company";

export function Footer() {
  const wa = whatsappLink();
  const tel = phoneLink();

  return (
    <footer className="bg-charcoal text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Image src="/brand/logo-full.png" alt={COMPANY.brand} width={1127} height={862} className="h-auto w-40" />
          <p className="mt-4 text-sm leading-relaxed">
            IGI certified diamond jewelry, made in Dubai and supplied to retailers.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/collections" className="hover:text-white">Collections</Link></li>
            <li><Link href="/shop" className="hover:text-white">Shop all</Link></li>
            <li><Link href="/mood-board" className="hover:text-white">Mood board</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About us</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of use</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li><a href={`mailto:${COMPANY.email}`} className="break-all hover:text-white">{COMPANY.email}</a></li>
            {tel && <li><a href={tel} className="hover:text-white">{COMPANY.phone}</a></li>}
            {wa && <li><a href={wa} className="hover:text-white">WhatsApp</a></li>}
            {COMPANY.address && <li>{COMPANY.address}</li>}
            <li>
              <a href={COMPANY.googleUrl} target="_blank" rel="noopener" className="hover:text-white">
                Find us on Google
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {COMPANY.brand}. {COMPANY.brand} is a brand of {COMPANY.parent}.
      </div>
    </footer>
  );
}
