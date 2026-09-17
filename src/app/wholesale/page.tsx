import Link from "next/link";
import type { Metadata } from "next";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Aviora Jewelry";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Wholesale Diamond Jewelry for Retailers`,
  description: `${SITE_NAME} supplies certified diamond jewelry at wholesale prices to independent and chain jewelry retailers across the USA. Apply for a wholesale account.`,
};

const STYLES = `
  :root {
    --ink: #1b1712;
    --ink-soft: #514a40;
    --cream: #faf7f2;
    --cream-2: #f1ebe1;
    --card: #ffffff;
    --gold: #a9812f;
    --gold-soft: #e8d9b5;
    --border: rgba(27, 23, 18, 0.1);
    --font-head: "Playfair Display", Georgia, serif;
    --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .aviora-landing * { box-sizing: border-box; margin: 0; padding: 0; }
  .aviora-landing { scroll-behavior: smooth; }

  .aviora-landing {
    font-family: var(--font-body);
    color: var(--ink);
    background: var(--cream);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .aviora-landing img, .aviora-landing svg { max-width: 100%; display: block; }
  .aviora-landing a { color: inherit; }
  .aviora-landing .wrap { max-width: 1140px; margin: 0 auto; padding: 0 1.5rem; }

  /* ---------- Header ---------- */
  .aviora-landing header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(250, 247, 242, 0.92);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border);
  }
  .aviora-landing .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.1rem 0;
    gap: 1rem;
  }
  .aviora-landing .logo {
    font-family: var(--font-head);
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .aviora-landing .nav-links {
    display: flex;
    gap: 1.75rem;
    font-size: 0.92rem;
    font-weight: 500;
  }
  .aviora-landing .nav-links a { opacity: 0.8; text-decoration: none; }
  .aviora-landing .nav-links a:hover { opacity: 1; }
  .aviora-landing .nav-cta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .aviora-landing .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.65rem 1.3rem;
    border-radius: 999px;
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    border: 1px solid transparent;
    cursor: pointer;
    white-space: nowrap;
  }
  .aviora-landing .btn-gold { background: var(--ink); color: var(--cream); }
  .aviora-landing .btn-gold:hover { background: #322c22; }
  .aviora-landing .btn-outline { border-color: var(--ink); background: transparent; color: var(--ink); }
  .aviora-landing .btn-outline:hover { background: rgba(27,23,18,0.06); }
  .aviora-landing .btn-sm { padding: 0.5rem 1rem; font-size: 0.82rem; }

  @media (max-width: 860px) { .aviora-landing .nav-links { display: none; } }

  /* ---------- Hero ---------- */
  .aviora-landing .hero {
    padding: 4.5rem 0 3.5rem;
    text-align: center;
    background:
      radial-gradient(circle at 15% 20%, rgba(169,129,47,0.12), transparent 45%),
      radial-gradient(circle at 85% 30%, rgba(169,129,47,0.10), transparent 45%);
  }
  .aviora-landing .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--gold);
    background: var(--gold-soft);
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
    margin-bottom: 1.5rem;
  }
  .aviora-landing h1 {
    font-family: var(--font-head);
    font-weight: 600;
    font-size: clamp(2.1rem, 5vw, 3.3rem);
    line-height: 1.15;
    max-width: 44rem;
    margin: 0 auto 1.1rem;
  }
  .aviora-landing .hero p.sub {
    max-width: 36rem;
    margin: 0 auto 2.2rem;
    color: var(--ink-soft);
    font-size: 1.08rem;
  }
  .aviora-landing .hero-ctas {
    display: flex;
    justify-content: center;
    gap: 0.9rem;
    flex-wrap: wrap;
    margin-bottom: 2.8rem;
  }
  .aviora-landing .trust-row {
    display: flex;
    justify-content: center;
    gap: 2.2rem;
    flex-wrap: wrap;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--ink-soft);
  }
  .aviora-landing .trust-row span { display: inline-flex; align-items: center; gap: 0.4rem; }
  .aviora-landing .trust-row svg { width: 16px; height: 16px; stroke: var(--gold); flex-shrink: 0; }

  /* ---------- Placeholder art ---------- */
  .aviora-landing .ph {
    background: linear-gradient(135deg, var(--cream-2), #e3d6bd);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
    position: relative;
    overflow: hidden;
  }
  .aviora-landing .ph svg { width: 34%; height: 34%; stroke: var(--gold); opacity: 0.55; }
  .aviora-landing .ph::after {
    content: attr(data-label);
    position: absolute;
    bottom: 0.7rem;
    left: 0.9rem;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--ink-soft);
    opacity: 0.7;
  }
  .aviora-landing .hero-art {
    max-width: 780px;
    margin: 0 auto;
    aspect-ratio: 16 / 7;
    border-radius: 1.2rem;
    border: 1px solid var(--border);
  }

  /* ---------- Sections ---------- */
  .aviora-landing section { padding: 4rem 0; }
  .aviora-landing .section-head { text-align: center; max-width: 36rem; margin: 0 auto 2.75rem; }
  .aviora-landing .section-head .eyebrow { margin-bottom: 1rem; }
  .aviora-landing h2 {
    font-family: var(--font-head);
    font-weight: 600;
    font-size: clamp(1.6rem, 3.4vw, 2.15rem);
    margin-bottom: 0.6rem;
  }
  .aviora-landing .section-head p { color: var(--ink-soft); font-size: 1rem; }

  /* ---------- Value props ---------- */
  .aviora-landing .value-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
  .aviora-landing .value-card { background: var(--card); border: 1px solid var(--border); border-radius: 1rem; padding: 1.75rem 1.5rem; }
  .aviora-landing .value-card .icon {
    width: 2.6rem; height: 2.6rem; border-radius: 0.7rem;
    background: var(--gold-soft); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;
  }
  .aviora-landing .value-card .icon svg { width: 1.3rem; height: 1.3rem; stroke: var(--gold); }
  .aviora-landing .value-card h3 { font-size: 1.02rem; margin-bottom: 0.4rem; font-weight: 600; }
  .aviora-landing .value-card p { font-size: 0.9rem; color: var(--ink-soft); }

  @media (max-width: 900px) { .aviora-landing .value-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px) { .aviora-landing .value-grid { grid-template-columns: 1fr; } }

  /* ---------- Collections ---------- */
  .aviora-landing .band { background: var(--cream-2); }
  .aviora-landing .collection-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.4rem; }
  .aviora-landing .collection-card { background: var(--card); border-radius: 1rem; overflow: hidden; border: 1px solid var(--border); text-decoration: none; }
  .aviora-landing .collection-card .ph { aspect-ratio: 1; }
  .aviora-landing .collection-card .label { padding: 1rem 1.1rem 1.2rem; }
  .aviora-landing .collection-card h3 { font-size: 0.98rem; font-weight: 600; margin-bottom: 0.2rem; }
  .aviora-landing .collection-card span { font-size: 0.82rem; color: var(--gold); font-weight: 600; }

  @media (max-width: 900px) { .aviora-landing .collection-grid { grid-template-columns: repeat(2, 1fr); } }

  /* ---------- How it works ---------- */
  .aviora-landing .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .aviora-landing .step { text-align: center; padding: 0 1rem; }
  .aviora-landing .step .num {
    width: 2.4rem; height: 2.4rem; border-radius: 50%; background: var(--ink); color: var(--cream);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-head); font-weight: 600; margin: 0 auto 1.1rem;
  }
  .aviora-landing .step h3 { font-size: 1.02rem; margin-bottom: 0.5rem; font-weight: 600; }
  .aviora-landing .step p { font-size: 0.9rem; color: var(--ink-soft); }

  @media (max-width: 780px) { .aviora-landing .steps { grid-template-columns: 1fr; gap: 2.2rem; } }

  /* ---------- Stats ---------- */
  .aviora-landing .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; text-align: center; }
  .aviora-landing .stat .num { font-family: var(--font-head); font-size: clamp(1.6rem, 3.5vw, 2.2rem); font-weight: 700; color: var(--ink); }
  .aviora-landing .stat .lbl { font-size: 0.82rem; color: var(--ink-soft); font-weight: 500; }
  @media (max-width: 700px) { .aviora-landing .stats { grid-template-columns: repeat(2, 1fr); gap: 2rem; } }

  /* ---------- Testimonials ---------- */
  .aviora-landing .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.4rem; }
  .aviora-landing .testi-card { background: var(--card); border: 1px solid var(--border); border-radius: 1rem; padding: 1.6rem; }
  .aviora-landing .stars { color: var(--gold); font-size: 0.9rem; margin-bottom: 0.8rem; letter-spacing: 0.1em; }
  .aviora-landing .testi-card p.quote { font-size: 0.92rem; color: var(--ink-soft); margin-bottom: 1.1rem; }
  .aviora-landing .testi-who { display: flex; align-items: center; gap: 0.7rem; }
  .aviora-landing .avatar {
    width: 2.1rem; height: 2.1rem; border-radius: 50%; background: var(--gold-soft); color: var(--gold);
    display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; font-family: var(--font-head);
  }
  .aviora-landing .testi-who .name { font-size: 0.86rem; font-weight: 600; }
  .aviora-landing .testi-who .loc { font-size: 0.76rem; color: var(--ink-soft); }

  @media (max-width: 900px) { .aviora-landing .testi-grid { grid-template-columns: 1fr; } }

  /* ---------- Newsletter ---------- */
  .aviora-landing .newsletter { background: var(--ink); color: var(--cream); border-radius: 1.3rem; padding: 3rem 2.5rem; text-align: center; }
  .aviora-landing .newsletter h2 { color: var(--cream); }
  .aviora-landing .newsletter p { color: rgba(250,247,242,0.72); max-width: 32rem; margin: 0 auto 1.7rem; }
  .aviora-landing .nl-form { display: flex; justify-content: center; gap: 0.7rem; flex-wrap: wrap; max-width: 30rem; margin: 0 auto; }
  .aviora-landing .nl-form input {
    flex: 1 1 15rem; padding: 0.75rem 1rem; border-radius: 999px; border: 1px solid rgba(250,247,242,0.25);
    background: rgba(250,247,242,0.08); color: var(--cream); font-size: 0.9rem;
  }
  .aviora-landing .nl-form input::placeholder { color: rgba(250,247,242,0.5); }
  .aviora-landing .nl-form .btn-gold { background: var(--gold); color: var(--ink); }
  .aviora-landing .nl-form .btn-gold:hover { background: #bd9750; }
  .aviora-landing .nl-note { font-size: 0.76rem; color: rgba(250,247,242,0.5); margin-top: 0.9rem; }

  /* ---------- Contact ---------- */
  .aviora-landing .contact-grid { display: grid; grid-template-columns: 1.15fr 1fr; gap: 2.5rem; align-items: start; }
  .aviora-landing .contact-card { background: var(--card); border: 1px solid var(--border); border-radius: 1.1rem; padding: 2rem; }
  .aviora-landing .contact-card h3 { font-size: 1.05rem; margin-bottom: 0.3rem; font-weight: 600; }
  .aviora-landing .contact-card .hint { font-size: 0.85rem; color: var(--ink-soft); margin-bottom: 1.3rem; }
  .aviora-landing .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .aviora-landing .field { margin-bottom: 1rem; }
  .aviora-landing .field label { display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 0.35rem; }
  .aviora-landing .field input, .aviora-landing .field select, .aviora-landing .field textarea {
    width: 100%; padding: 0.7rem 0.85rem; border: 1px solid var(--border); border-radius: 0.6rem;
    font-family: var(--font-body); font-size: 0.9rem; background: var(--cream);
  }
  .aviora-landing .field textarea { resize: vertical; min-height: 5rem; }
  .aviora-landing .field .opt { font-weight: 400; color: var(--ink-soft); font-size: 0.78rem; }

  @media (max-width: 560px) { .aviora-landing .field-row { grid-template-columns: 1fr; } }

  .aviora-landing .contact-direct { display: flex; flex-direction: column; gap: 1rem; }
  .aviora-landing .direct-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 1.1rem;
    padding: 1.5rem 1.6rem; display: flex; align-items: center; gap: 1rem;
  }
  .aviora-landing .direct-card .icon {
    width: 2.6rem; height: 2.6rem; border-radius: 0.7rem; background: var(--gold-soft);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .aviora-landing .direct-card .icon svg { width: 1.25rem; height: 1.25rem; stroke: var(--gold); }
  .aviora-landing .direct-card .lbl { font-size: 0.78rem; color: var(--ink-soft); font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
  .aviora-landing .direct-card .val { font-size: 1rem; font-weight: 600; }
  .aviora-landing .direct-card .val a { text-decoration: none; }

  @media (max-width: 860px) { .aviora-landing .contact-grid { grid-template-columns: 1fr; } }

  /* ---------- FAQ ---------- */
  .aviora-landing .faq { max-width: 44rem; margin: 0 auto; }
  .aviora-landing details { border-bottom: 1px solid var(--border); padding: 1.1rem 0; }
  .aviora-landing summary { cursor: pointer; font-weight: 600; font-size: 0.98rem; list-style: none; display: flex; justify-content: space-between; align-items: center; }
  .aviora-landing summary::-webkit-details-marker { display: none; }
  .aviora-landing summary::after { content: "+"; font-size: 1.3rem; color: var(--gold); font-weight: 400; margin-left: 1rem; }
  .aviora-landing details[open] summary::after { content: "\\2212"; }
  .aviora-landing details p { margin-top: 0.7rem; color: var(--ink-soft); font-size: 0.9rem; }

  /* ---------- Footer ---------- */
  .aviora-landing footer { background: var(--ink); color: rgba(250,247,242,0.7); padding: 3rem 0 1.6rem; font-size: 0.86rem; }
  .aviora-landing .foot-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 2rem; margin-bottom: 2.2rem; }
  .aviora-landing .foot-grid .logo { color: var(--cream); margin-bottom: 0.8rem; }
  .aviora-landing .foot-grid h4 { color: var(--cream); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.9rem; }
  .aviora-landing .foot-grid ul { list-style: none; display: flex; flex-direction: column; gap: 0.55rem; }
  .aviora-landing .foot-grid a { text-decoration: none; opacity: 0.85; }
  .aviora-landing .foot-grid a:hover { opacity: 1; }
  .aviora-landing .foot-bottom {
    border-top: 1px solid rgba(250,247,242,0.12); padding-top: 1.4rem; display: flex;
    justify-content: space-between; flex-wrap: wrap; gap: 0.8rem; font-size: 0.78rem; opacity: 0.6;
  }

  @media (max-width: 780px) { .aviora-landing .foot-grid { grid-template-columns: 1fr 1fr; } }
`;

const CHECK = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function LandingPage() {
  const year = new Date().getFullYear();

  return (
    <div className="aviora-landing">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <header>
        <div className="wrap nav">
          <div className="logo">Aviora Jewelry</div>
          <nav className="nav-links">
            <a href="#collections">Collections</a>
            <a href="#why-us">For Retailers</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
            <Link href="/">Catalog</Link>
          </nav>
          <div className="nav-cta">
            <a className="btn btn-outline btn-sm" href="https://wa.me/10000000000" target="_blank" rel="noopener">
              WhatsApp
            </a>
            <a className="btn btn-gold btn-sm" href="#contact">
              Apply for Wholesale Account
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="wrap">
            <span className="eyebrow">Wholesale &middot; USA Retailers Only &middot; GIA/IGI Certified</span>
            <h1>Certified diamond jewelry, supplied wholesale to America&rsquo;s jewelry retailers.</h1>
            <p className="sub">
              Aviora Jewelry is a wholesale supplier of certified diamond rings, necklaces, earrings and bracelets —
              built for independent and multi-location jewelry retailers who want reliable inventory, real margins,
              and a partner who ships fast.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-gold" href="#contact">Apply for a Wholesale Account</a>
              <a className="btn btn-outline" href="tel:+10000000000">Call (000) 000-0000</a>
            </div>
            <div className="trust-row">
              <span>{CHECK}GIA &amp; IGI Certified</span>
              <span>{CHECK}Net-30 Terms Available</span>
              <span>{CHECK}Low Minimum Orders</span>
              <span>{CHECK}Ships in 48 Hours</span>
            </div>
          </div>
        </section>

        <div className="wrap">
          <div className="hero-art ph" data-label="Showroom / catalog photo — add here">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12l3 5-9 13L3 8Z" />
              <path d="M3 8h18" />
              <path d="M9 3l3 5 3-5" />
              <path d="M12 8v13" />
            </svg>
          </div>
        </div>

        {/* WHY US */}
        <section id="why-us">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Why Retailers Partner With Us</span>
              <h2>Built for jewelry stores, not one-off buyers</h2>
              <p>
                We only sell wholesale, to registered retailers — so pricing, inventory and support are all built
                around what a store actually needs.
              </p>
            </div>
            <div className="value-grid">
              <div className="value-card">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8}><path d="M12 2v20M2 12h20" /></svg>
                </div>
                <h3>Real Wholesale Margins</h3>
                <p>Pricing structured so you keep healthy margin at your own retail price point — not just a small discount off retail.</p>
              </div>
              <div className="value-card">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8}>
                    <path d="M12 15a4 4 0 100-8 4 4 0 000 8Z" />
                    <path d="M3 12a9 9 0 0018 0 9 9 0 00-18 0Z" />
                  </svg>
                </div>
                <h3>Certified &amp; Consistent</h3>
                <p>Every diamond ships with GIA or IGI certification, so what your customers see in-store matches what&rsquo;s on paper, every time.</p>
              </div>
              <div className="value-card">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8}>
                    <path d="M20 7h-9m0 0l3-3m-3 3l3 3M4 17h9m0 0l-3-3m3 3l-3 3" />
                  </svg>
                </div>
                <h3>Low Minimum Orders</h3>
                <p>Start with a small opening order to test what sells in your store, then reorder your bestsellers as needed.</p>
              </div>
              <div className="value-card">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8}>
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92Z" />
                  </svg>
                </div>
                <h3>A Dedicated Account Rep</h3>
                <p>One point of contact who knows your store, your reorders, and can get you answers fast — not a call center queue.</p>
              </div>
            </div>
          </div>
        </section>

        {/* COLLECTIONS */}
        <section id="collections" className="band">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Wholesale Line Sheet</span>
              <h2>Collections available to stock</h2>
              <p>A preview of what&rsquo;s in the catalog — full line sheet and wholesale pricing shared once your account is approved.</p>
            </div>
            <div className="collection-grid">
              <a className="collection-card" href="#contact">
                <div className="ph" data-label="Rings">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.4}><circle cx={12} cy={14} r={7} /><path d="M9 7l3-5 3 5" /></svg>
                </div>
                <div className="label"><h3>Rings</h3><span>See wholesale pricing &rarr;</span></div>
              </a>
              <a className="collection-card" href="#contact">
                <div className="ph" data-label="Necklaces">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.4}><path d="M4 4c0 6 3.5 10 8 10s8-4 8-10" /><circle cx={12} cy={17} r={3} /></svg>
                </div>
                <div className="label"><h3>Necklaces</h3><span>See wholesale pricing &rarr;</span></div>
              </a>
              <a className="collection-card" href="#contact">
                <div className="ph" data-label="Earrings">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.4}>
                    <path d="M12 3v4" /><circle cx={12} cy={11} r={3} /><path d="M12 14v3a3 3 0 006 0v-1" />
                  </svg>
                </div>
                <div className="label"><h3>Earrings</h3><span>See wholesale pricing &rarr;</span></div>
              </a>
              <a className="collection-card" href="#contact">
                <div className="ph" data-label="Bracelets">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.4}><ellipse cx={12} cy={12} rx={9} ry={5} /></svg>
                </div>
                <div className="label"><h3>Bracelets</h3><span>See wholesale pricing &rarr;</span></div>
              </a>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Getting Started</span>
              <h2>Opening a wholesale account</h2>
            </div>
            <div className="steps">
              <div className="step">
                <div className="num">1</div>
                <h3>Apply for an account</h3>
                <p>Tell us about your store — we verify you&rsquo;re a registered retailer before opening a wholesale account.</p>
              </div>
              <div className="step">
                <div className="num">2</div>
                <h3>Get the line sheet &amp; pricing</h3>
                <p>Once approved, you get full catalog access, wholesale pricing, and your dedicated account rep.</p>
              </div>
              <div className="step">
                <div className="num">3</div>
                <h3>Place your first order</h3>
                <p>Start small, see what sells, and reorder bestsellers with fast, insured shipping to your store.</p>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="band">
          <div className="wrap">
            <div className="stats">
              <div className="stat"><div className="num">500+</div><div className="lbl">Retail Partners Nationwide</div></div>
              <div className="stat"><div className="num">15+</div><div className="lbl">Years in Wholesale Diamonds</div></div>
              <div className="stat"><div className="num">48 hr</div><div className="lbl">Average Order Turnaround</div></div>
              <div className="stat"><div className="num">100%</div><div className="lbl">Certified &amp; Conflict-Free</div></div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section>
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Retailer Stories</span>
              <h2>What store owners are saying</h2>
              <p>Placeholder quotes — swap in real partner testimonials once you have them.</p>
            </div>
            <div className="testi-grid">
              <div className="testi-card">
                <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p className="quote">&ldquo;Reorders show up in two days, every certification matches, and our engagement ring case turns over faster than it ever did with our old supplier.&rdquo;</p>
                <div className="testi-who"><div className="avatar">M</div><div><div className="name">M. Whitfield, Owner</div><div className="loc">Heirloom Jewelers &mdash; Austin, TX</div></div></div>
              </div>
              <div className="testi-card">
                <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p className="quote">&ldquo;Low minimums let us test three new styles before committing to a full case. Two of them are now our top sellers.&rdquo;</p>
                <div className="testi-who"><div className="avatar">D</div><div><div className="name">D. Alvarez, Buyer</div><div className="loc">Sunburst Fine Jewelry &mdash; San Diego, CA</div></div></div>
              </div>
              <div className="testi-card">
                <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p className="quote">&ldquo;Having one account rep who actually knows our store instead of a call queue has made reordering painless.&rdquo;</p>
                <div className="testi-who"><div className="avatar">S</div><div><div className="name">S. Kapoor, Owner</div><div className="loc">Kapoor &amp; Sons Jewelers &mdash; Edison, NJ</div></div></div>
              </div>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section>
          <div className="wrap">
            <div className="newsletter">
              <h2>Get new collections &amp; wholesale-only pricing first</h2>
              <p>Join the trade list for early access to new lines, limited inventory alerts, and offers we only share with retail partners.</p>
              <form className="nl-form" action="mailto:brij.klexports@gmail.com" method="post" encType="text/plain">
                <input type="email" name="email" placeholder="you@yourstore.com" required />
                <button className="btn btn-gold" type="submit">Subscribe</button>
              </form>
              <p className="nl-note">For registered retailers only. Unsubscribe anytime.</p>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="band">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Get In Touch</span>
              <h2>Apply for a wholesale account</h2>
              <p>Reach us by phone, WhatsApp, or the form below — we typically respond within one business day.</p>
            </div>
            <div className="contact-grid">
              <div className="contact-card">
                <h3>Wholesale account application</h3>
                <p className="hint">For registered jewelry retailers in the USA. We&rsquo;ll follow up to verify your business before opening an account.</p>
                <form action="mailto:brij.klexports@gmail.com" method="post" encType="text/plain">
                  <div className="field-row">
                    <div className="field"><label>Store / Business Name</label><input type="text" name="business" required /></div>
                    <div className="field"><label>Your Name</label><input type="text" name="name" required /></div>
                  </div>
                  <div className="field-row">
                    <div className="field"><label>Business Email</label><input type="email" name="email" required /></div>
                    <div className="field"><label>Phone</label><input type="tel" name="phone" required /></div>
                  </div>
                  <div className="field-row">
                    <div className="field"><label>State</label><input type="text" name="state" placeholder="e.g. TX" /></div>
                    <div className="field"><label>Resale / Tax ID <span className="opt">(optional)</span></label><input type="text" name="resale_id" /></div>
                  </div>
                  <div className="field">
                    <label>Estimated Monthly Order Volume</label>
                    <select name="volume">
                      <option>Under $1,000</option>
                      <option>$1,000 &ndash; $5,000</option>
                      <option>$5,000 &ndash; $20,000</option>
                      <option>$20,000+</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Tell us about your store</label>
                    <textarea name="message" placeholder="Store type, number of locations, categories you're most interested in..." />
                  </div>
                  <button className="btn btn-gold" style={{ width: "100%", marginTop: "0.4rem" }} type="submit">
                    Submit Application
                  </button>
                </form>
              </div>
              <div className="contact-direct">
                <div className="direct-card">
                  <div className="icon">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8}>
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92Z" />
                    </svg>
                  </div>
                  <div><div className="lbl">Call</div><div className="val"><a href="tel:+10000000000">(000) 000-0000</a></div></div>
                </div>
                <div className="direct-card">
                  <div className="icon">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8}>
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                    </svg>
                  </div>
                  <div><div className="lbl">WhatsApp</div><div className="val"><a href="https://wa.me/10000000000" target="_blank" rel="noopener">Chat with us</a></div></div>
                </div>
                <div className="direct-card">
                  <div className="icon">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8}>
                      <path d="M4 4h16v16H4z" fill="none" /><path d="M22 6l-10 7L2 6" />
                    </svg>
                  </div>
                  <div><div className="lbl">Email</div><div className="val"><a href="mailto:brij.klexports@gmail.com">brij.klexports@gmail.com</a></div></div>
                </div>
                <div className="direct-card">
                  <div className="icon">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8}>
                      <circle cx={12} cy={12} r={9} /><path d="M12 7v5l3 3" />
                    </svg>
                  </div>
                  <div><div className="lbl">Hours</div><div className="val">Mon&ndash;Sat, 9am&ndash;6pm ET</div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Questions</span>
              <h2>Frequently asked by retailers</h2>
            </div>
            <div className="faq">
              <details open>
                <summary>Do I need a resale certificate to open an account?</summary>
                <p>Yes — we sell wholesale exclusively to registered retailers. A resale certificate or business tax ID speeds up approval, but isn&rsquo;t required to start the application.</p>
              </details>
              <details>
                <summary>What&rsquo;s your minimum order quantity?</summary>
                <p>[Add your actual MOQ here — e.g. &ldquo;Opening orders start at just 10 pieces, mixed styles welcome.&rdquo;]</p>
              </details>
              <details>
                <summary>Do you offer net terms?</summary>
                <p>Net-30 terms are available to approved accounts after an initial order history is established. Ask your account rep for details.</p>
              </details>
              <details>
                <summary>Can I get samples before ordering in bulk?</summary>
                <p>Yes — we can send a small sample selection so you can evaluate quality and finish before placing a larger order.</p>
              </details>
              <details>
                <summary>Do you offer memo or consignment options?</summary>
                <p>[Add your policy here — e.g. &ldquo;Memo terms available for established accounts on select higher-value pieces.&rdquo;]</p>
              </details>
              <details>
                <summary>How fast do orders ship?</summary>
                <p>Most in-stock orders ship within 48 hours, fully insured with tracking included.</p>
              </details>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="logo">Aviora Jewelry</div>
              <p style={{ maxWidth: "16rem", opacity: 0.8 }}>
                Certified diamond jewelry, supplied wholesale to jewelry retailers across the USA.
              </p>
            </div>
            <div>
              <h4>Collections</h4>
              <ul>
                <li><a href="#collections">Rings</a></li>
                <li><a href="#collections">Necklaces</a></li>
                <li><a href="#collections">Earrings</a></li>
                <li><a href="#collections">Bracelets</a></li>
              </ul>
            </div>
            <div>
              <h4>For Retailers</h4>
              <ul>
                <li><a href="#why-us">Why Partner With Us</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li><a href="tel:+10000000000">(000) 000-0000</a></li>
                <li><a href="mailto:brij.klexports@gmail.com">brij.klexports@gmail.com</a></li>
                <li><a href="https://wa.me/10000000000" target="_blank" rel="noopener">WhatsApp</a></li>
                <li><Link href="/">Browse Catalog</Link></li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <span>&copy; {year} Aviora Jewelry. All rights reserved.</span>
            <span>GIA &amp; IGI Certified &middot; Wholesale to USA Retailers Only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
