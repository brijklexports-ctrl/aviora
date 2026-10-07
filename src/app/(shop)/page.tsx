import Link from "next/link";
import Image from "next/image";
import { listCollections, getRepresentativeImage } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { COMPANY, phoneLink, whatsappLink } from "@/lib/company";
import { Icon, type IconName } from "@/components/Icons";

// Collections come from the live database and change via the admin panel
// and the scheduled sync, so this page is never a build-time snapshot.
export const dynamic = "force-dynamic";

const WHY: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "shield",
    title: "IGI certified",
    text: "Our diamond jewelry is certified by IGI, an independent gemological laboratory. The grading comes from a third party, not from us.",
  },
  {
    icon: "pin",
    title: "Made in Dubai",
    text: "Every piece is crafted in Dubai, one of the world's leading centers for diamonds and fine jewelry.",
  },
  {
    icon: "tag",
    title: "Pricing that grows with you",
    text: "The more you order, the better your rates. Ask us about wholesale pricing for your store.",
  },
  {
    icon: "diamond",
    title: "A wide range to choose from",
    text: "Engagement rings, bracelets, earrings, necklaces and more, with new pieces added regularly.",
  },
];

const STEPS = [
  { n: "1", title: "Browse", text: "Look through our collections on your phone, tablet or computer." },
  { n: "2", title: "Save your favorites", text: "Tap the heart on any piece to add it to your mood board." },
  { n: "3", title: "Send us your list", text: "Send your mood board to us and we will get back to you with pricing." },
];

const FAQ = [
  {
    q: "Who can buy from Aviora?",
    a: "Aviora Jewelry supplies jewelry retailers. We are a wholesale supplier, so we do not sell single pieces to the public.",
  },
  {
    q: "How do I get prices?",
    a: "Prices are shared when you ask. Save the pieces you like to your mood board and send us the list, or contact us directly.",
  },
  {
    q: "Is the jewelry certified?",
    a: "Yes. Our diamond jewelry is IGI certified.",
  },
  {
    q: "Where is the jewelry made?",
    a: "All of our jewelry is made in Dubai.",
  },
  {
    q: `Who is ${COMPANY.parent}?`,
    a: `${COMPANY.brand} is a brand of ${COMPANY.parent}, the company that retailers have trusted for ${COMPANY.yearsInBusiness} years.`,
  },
];

export default async function HomePage() {
  const collections = await listCollections({ publishedOnly: true });
  const top = collections.slice(0, 6);

  const withImages = await Promise.all(
    top.map(async (c) => ({
      ...c,
      image: c.heroImageUrl ?? (await getRepresentativeImage(c.productType)),
      slug: slugify(c.productType),
    }))
  );
  const heroImage = withImages.find((c) => c.image)?.image ?? null;

  const wa = whatsappLink(`Hi ${COMPANY.brand}, I'd like to know more about your jewelry.`);
  const tel = phoneLink();

  return (
    <div>
      {/* Hero */}
      <section className="bg-charcoal text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-12 md:grid-cols-2 md:gap-12 md:py-20">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Wholesale diamond jewelry
            </p>
            <h1 className="font-serif text-[2.6rem] font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              Certified diamond jewelry, made in Dubai.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
              Trusted by {COMPANY.retailersServed} retailers. {COMPANY.yearsInBusiness} years of experience behind
              every piece.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/collections"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-gold px-8 text-base font-medium text-charcoal hover:bg-[#c29a52]"
              >
                Browse collections <Icon name="arrow" className="h-5 w-5" />
              </Link>
              <Link
                href="#contact"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/30 px-8 text-base text-white hover:bg-white/10"
              >
                Contact us
              </Link>
            </div>
          </div>

          {heroImage && (
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-black md:max-w-none">
              <Image
                src={heroImage}
                alt="Aviora diamond ring"
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-line bg-ivory">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-6 py-8 md:grid-cols-4">
          {[
            { big: `${COMPANY.yearsInBusiness}`, small: "years in business" },
            { big: COMPANY.retailersServed, small: "retailers trust us" },
            { big: "IGI", small: "certified diamonds" },
            { big: "Dubai", small: "made in" },
          ].map((s) => (
            <div key={s.small} className="text-center">
              <p className="font-serif text-4xl font-semibold text-gold sm:text-5xl">{s.big}</p>
              <p className="mt-1 text-sm text-ink/70">{s.small}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      {withImages.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Our collections</h2>
              <p className="mt-2 text-ink/60">Pick a category to see every piece.</p>
            </div>
            <Link href="/collections" className="hidden shrink-0 text-sm font-medium text-ink underline md:block">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {withImages.map((c) => (
              <Link
                key={c.productType}
                href={`/collections/${c.slug}`}
                className="group overflow-hidden rounded-xl border border-line bg-white"
              >
                <div className="relative aspect-[4/3] bg-black">
                  {c.image && (
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-serif text-lg font-semibold leading-tight sm:text-xl">{c.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-wide text-ink/50">{c.count} pieces</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/collections"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-ink px-8 text-sm font-medium hover:bg-ink hover:text-white"
            >
              View all collections
            </Link>
          </div>
        </section>
      )}

      {/* Why Aviora */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <h2 className="mb-10 text-center font-serif text-3xl font-semibold sm:text-4xl">Why retailers choose Aviora</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <div key={w.title} className="rounded-xl border border-line bg-paper p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ivory text-gold">
                  <Icon name={w.icon} className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-serif text-xl font-semibold">{w.title}</h3>
                <p className="text-[15px] leading-relaxed text-ink/70">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <h2 className="mb-10 text-center font-serif text-3xl font-semibold sm:text-4xl">How it works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-4 md:flex-col md:items-center md:text-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-charcoal font-serif text-xl text-gold">
                {s.n}
              </div>
              <div>
                <h3 className="mb-1 font-serif text-xl font-semibold">{s.title}</h3>
                <p className="text-[15px] leading-relaxed text-ink/70">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About strip */}
      <section className="bg-charcoal text-white">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            {COMPANY.yearsInBusiness} years of trust, now under the Aviora name
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/75 sm:text-lg">
            {COMPANY.brand} is a brand of {COMPANY.parent}, the company that retailers have trusted for{" "}
            {COMPANY.yearsInBusiness} years. Today we supply more than {COMPANY.retailersServed} retailers with
            IGI certified diamond jewelry made in Dubai.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/30 px-8 text-sm hover:bg-white/10"
          >
            Read our story
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <h2 className="mb-8 text-center font-serif text-3xl font-semibold sm:text-4xl">Common questions</h2>
        <div className="divide-y divide-line rounded-xl border border-line bg-white">
          {FAQ.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
                {f.q}
                <span className="text-2xl leading-none text-gold transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pt-2 text-[15px] leading-relaxed text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-28 bg-ivory">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Talk to us</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/70">
            Tell us what you are looking for and we will get back to you.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            {wa && (
              <a
                href={wa}
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#1f8f4e] px-8 text-base font-medium text-white"
              >
                <Icon name="chat" /> Message us on WhatsApp
              </a>
            )}
            {tel && (
              <a
                href={tel}
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-ink px-8 text-base font-medium text-white"
              >
                <Icon name="phone" /> Call {COMPANY.phone}
              </a>
            )}
            <a
              href={`mailto:${COMPANY.email}`}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-gold px-8 text-base font-medium text-charcoal hover:bg-[#c29a52]"
            >
              <Icon name="mail" /> Email us
            </a>
          </div>
          <p className="mt-4 break-all text-sm text-ink/60">{COMPANY.email}</p>
          {COMPANY.address && <p className="mt-2 text-sm text-ink/60">{COMPANY.address}</p>}
          <a
            href={COMPANY.googleUrl}
            target="_blank"
            rel="noopener"
            className="mt-6 inline-block text-sm text-ink underline"
          >
            Find us on Google
          </a>
        </div>
      </section>

      <div className="h-20 md:hidden" aria-hidden={wa || tel ? undefined : true} hidden={!wa && !tel} />
    </div>
  );
}
