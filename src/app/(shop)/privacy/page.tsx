import { COMPANY } from "@/lib/company";

export const metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h1 className="font-serif text-4xl font-semibold sm:text-5xl">Privacy policy</h1>
      <p className="mt-2 text-sm text-ink/50">Last updated: October 2026</p>

      <div className="mt-8 space-y-6 text-[16px] leading-relaxed text-ink/80">
        <section>
          <h2 className="mb-2 font-serif text-2xl font-semibold text-ink">Who we are</h2>
          <p>
            This website is run by {COMPANY.brand}, a brand of {COMPANY.parent}. You can reach us at{" "}
            <a className="underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-2xl font-semibold text-ink">What we collect</h2>
          <p>
            You can browse this site without giving us any personal information. Pieces you save to your mood board are
            stored in your own browser on your own device. We do not receive them unless you choose to send them to us.
          </p>
          <p className="mt-3">
            If you email us, or send us your mood board, we receive your email address and whatever you include in your
            message. We use this only to reply to you and to follow up on your enquiry.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-2xl font-semibold text-ink">Cookies and tracking</h2>
          <p>
            We do not run advertising trackers. Our hosting provider may keep standard server logs, such as the pages
            requested and your IP address, to keep the site secure and working.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-2xl font-semibold text-ink">Sharing your information</h2>
          <p>We do not sell your information. We do not share it with others except where the law requires it.</p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-2xl font-semibold text-ink">Your choices</h2>
          <p>
            You can ask us to delete any information you have sent us by emailing us. You can clear your saved pieces at
            any time from the mood board page.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-2xl font-semibold text-ink">Changes</h2>
          <p>
            When we add features such as retailer accounts, we will update this policy before we start collecting new
            kinds of information.
          </p>
        </section>
      </div>
    </div>
  );
}
