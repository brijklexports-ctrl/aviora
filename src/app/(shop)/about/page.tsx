import Link from "next/link";
import { COMPANY } from "@/lib/company";

export const metadata = {
  title: "About us",
  description: `${COMPANY.brand} is a brand of ${COMPANY.parent}, supplying IGI certified diamond jewelry made in Dubai to retailers.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-gold">About us</p>
      <h1 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
        {COMPANY.yearsInBusiness} years of supplying jewelry retailers
      </h1>

      <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-ink/80">
        <p>
          {COMPANY.brand} is a brand of {COMPANY.parent}. Under the {COMPANY.parent} name we have been in business for{" "}
          {COMPANY.yearsInBusiness} years, and more than {COMPANY.retailersServed} retailers have trusted us to supply
          their stores.
        </p>
        <p>
          Our diamond jewelry is made in Dubai and is IGI certified. IGI is an independent gemological laboratory, so the
          grading on a certificate comes from a third party.
        </p>
        <p>
          We supply retailers only. If you own or buy for a jewelry store, browse our collections, save the pieces you
          like, and send us your list. We will get back to you with pricing.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { big: COMPANY.yearsInBusiness, small: "years in business" },
          { big: COMPANY.retailersServed, small: "retailers served" },
          { big: "IGI", small: "certified diamonds" },
        ].map((s) => (
          <div key={s.small} className="rounded-xl border border-line bg-ivory p-5 text-center">
            <p className="font-serif text-4xl font-semibold text-gold">{s.big}</p>
            <p className="mt-1 text-sm text-ink/70">{s.small}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/collections"
          className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-charcoal px-8 text-base font-medium text-white hover:bg-ink"
        >
          Browse collections
        </Link>
        <Link
          href="/#contact"
          className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-ink px-8 text-base hover:bg-ink hover:text-white"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
