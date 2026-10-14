import Link from "next/link";
import { getPricingContext, listCollections, listPriceableProducts } from "@/lib/db";
import { calculatePrice, formatPrice, resolveCategory } from "@/lib/pricing";
import { parseSpecs } from "@/lib/specs";
import { saveRatesAction, saveShowPricesAction } from "./actions";

export const dynamic = "force-dynamic";

const REASON_LABEL: Record<string, string> = {
  "no-weights": "no weights in title",
  "no-rates": "no rates for category",
  silver: "silver piece: set a fixed price",
  "weights-look-wrong": "weights look wrong: check the title",
};

export default async function AdminPricingPage() {
  const [ctx, collections, products] = await Promise.all([
    getPricingContext(),
    listCollections(),
    listPriceableProducts(),
  ]);

  // Count priced vs unpriced pieces per canonical category. Run the real
  // calculation with prices forced "on" so the counts hold even while the
  // public switch is still off.
  const calcCtx = { ...ctx, showPrices: true };
  const stats = new Map<string, { total: number; priced: number }>();
  const unpriced: { id: number; title: string; sku: string | null; category: string; reason: string }[] = [];

  for (const p of products) {
    const category = resolveCategory(p.product_type, ctx.aliases);
    const entry = stats.get(category) ?? { total: 0, priced: 0 };
    entry.total++;
    const result = calculatePrice(p, calcCtx);
    if (result.ok) entry.priced++;
    else unpriced.push({ id: p.id, title: p.title, sku: p.sku, category, reason: result.reason });
    stats.set(category, entry);
  }

  const noWeights = unpriced.filter((u) => u.reason === "no-weights");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 font-serif text-2xl">Pricing</h1>
        <p className="text-sm text-ink/60">
          Price = gross weight (g) × rate per gram + diamond weight (ct) × rate per carat. Set the two rates for each
          category. Prices are calculated live, so changing a rate reprices the whole category straight away.
        </p>
      </div>

      <form
        action={saveShowPricesAction}
        className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-white p-4"
      >
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="showPrices" defaultChecked={ctx.showPrices} className="h-5 w-5" />
          <span>
            <span className="font-medium">Show prices on the website</span>
            <span className="block text-xs text-ink/50">
              {ctx.showPrices ? "Prices are visible to everyone." : "Off: visitors see no prices. Set your rates first, then switch on."}
            </span>
          </span>
        </label>
        <button type="submit" className="rounded-full border border-ink px-4 py-1.5 text-sm hover:bg-ink hover:text-white">
          Save
        </button>
      </form>

      <div className="space-y-3">
        {collections.map((c) => {
          const rates = ctx.rates[c.productType];
          const st = stats.get(c.productType) ?? { total: 0, priced: 0 };
          return (
            <form
              key={c.productType}
              action={saveRatesAction}
              className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 md:flex-row md:items-end"
            >
              <input type="hidden" name="category" value={c.productType} />
              <div className="md:w-56">
                <p className="font-medium">{c.productType}</p>
                <p className="text-xs text-ink/50">
                  {st.priced} of {st.total} pieces priced
                </p>
              </div>
              <label className="text-xs text-ink/60">
                Rate per gram (USD)
                <input
                  type="number"
                  name="perGram"
                  min="0"
                  step="0.01"
                  defaultValue={rates?.perGram ?? ""}
                  placeholder="e.g. 85"
                  className="mt-1 block w-36 rounded border border-line px-3 py-1.5 text-sm text-ink outline-none focus:border-ink"
                />
              </label>
              <label className="text-xs text-ink/60">
                Rate per carat (USD)
                <input
                  type="number"
                  name="perCarat"
                  min="0"
                  step="0.01"
                  defaultValue={rates?.perCarat ?? ""}
                  placeholder="e.g. 900"
                  className="mt-1 block w-36 rounded border border-line px-3 py-1.5 text-sm text-ink outline-none focus:border-ink"
                />
              </label>
              <button
                type="submit"
                className="rounded-full border border-ink px-4 py-1.5 text-sm hover:bg-ink hover:text-white md:ml-auto"
              >
                Save
              </button>
            </form>
          );
        })}
      </div>

      <div>
        <h2 className="mb-1 text-sm font-semibold text-ink/70">Pieces that cannot be priced by formula ({unpriced.length})</h2>
        <p className="mb-3 text-sm text-ink/60">
          {noWeights.length} have no gross or diamond weight in their title, so they show "Request price". Give any of
          them a fixed price under{" "}
          <Link href="/admin/products" className="underline">
            Products
          </Link>
          , or leave them as "Request price". Silver pieces and titles with impossible weights (diamonds heavier than
          the whole piece) are held back on purpose, so a wrong number never reaches the website. The rest are in
          categories that have no rates yet.
        </p>
        <div className="max-h-96 overflow-y-auto rounded-lg border border-line bg-white">
          {unpriced.slice(0, 200).map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-3 border-b border-line px-4 py-2 text-sm last:border-0">
              <span className="min-w-0 truncate">{parseSpecs(u.title).cleanTitle}</span>
              <span className="shrink-0 text-xs text-ink/50">
                {u.sku ?? "no style no."} · {REASON_LABEL[u.reason] ?? u.reason}
              </span>
            </div>
          ))}
          {unpriced.length === 0 && <p className="px-4 py-6 text-center text-sm text-ink/50">Every piece can be priced.</p>}
        </div>
      </div>
    </div>
  );
}
