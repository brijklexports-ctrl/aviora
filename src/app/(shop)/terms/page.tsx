import { COMPANY } from "@/lib/company";

export const metadata = { title: "Terms of use" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h1 className="font-serif text-4xl font-semibold sm:text-5xl">Terms of use</h1>
      <p className="mt-2 text-sm text-ink/50">Last updated: October 2026</p>

      <div className="mt-8 space-y-6 text-[16px] leading-relaxed text-ink/80">
        <section>
          <h2 className="mb-2 font-serif text-2xl font-semibold text-ink">Using this site</h2>
          <p>
            This website is provided by {COMPANY.brand}, a brand of {COMPANY.parent}, for jewelry retailers to view our
            range. By using it you agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-2xl font-semibold text-ink">Products and pricing</h2>
          <p>
            Photos, descriptions and weights are shown to help you choose. Pieces and details may change, and a listing
            does not guarantee that a piece is currently available. Prices are provided on request and are confirmed by
            us in writing before any order.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-2xl font-semibold text-ink">Quote requests are not orders</h2>
          <p>
            Sending us your mood board or an enquiry is a request for information and a quote. It does not create an
            order or any obligation for either side until we both confirm the order terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-2xl font-semibold text-ink">Our content</h2>
          <p>
            The photos, videos, text, logo and design on this site belong to us or are used with permission. Please do
            not copy or reuse them without asking us first.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-2xl font-semibold text-ink">Liability</h2>
          <p>
            We work to keep this site accurate and available, but we cannot promise it will always be free of errors or
            interruptions. To the extent the law allows, we are not responsible for losses that come from using the site.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-2xl font-semibold text-ink">Contact</h2>
          <p>
            Questions about these terms: <a className="underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
