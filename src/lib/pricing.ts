import { parseSpecs } from "./specs";

// Price = gross weight (g) x rate per gram + diamond weight (ct) x rate per
// carat, using the rates set for the product's category in Admin -> Pricing.
// Computed on the fly (never stored): the daily sync would overwrite a stored
// price with gembox's empty one, and a computed price reprices the whole
// category the moment a rate changes.

const CARAT_GRAMS = 0.2;

export interface CategoryRates {
  perGram: number | null;
  perCarat: number | null;
}

export interface PricingContext {
  showPrices: boolean;
  // Keyed by canonical (merged) category name.
  rates: Record<string, CategoryRates>;
  // raw product_type -> canonical category (category merging).
  aliases: Record<string, string>;
}

export interface PriceableProduct {
  title: string;
  product_type: string;
  price_override?: number | string | null;
}

export function resolveCategory(productType: string, aliases: Record<string, string>): string {
  return aliases[productType] ?? productType;
}

export type PriceFailure = "no-weights" | "no-rates" | "silver" | "weights-look-wrong";

export type PriceResult = { ok: true; amount: number; source: "override" | "formula" } | { ok: false; reason: PriceFailure };

export function calculatePrice(p: PriceableProduct, ctx: PricingContext): PriceResult {
  const override = p.price_override === null || p.price_override === undefined ? null : Number(p.price_override);
  if (override !== null && Number.isFinite(override) && override > 0) {
    return { ok: true, amount: Math.round(override), source: "override" };
  }

  // Silver pieces are not priced at gold rates; give them a fixed price.
  if (/silver/i.test(p.title)) return { ok: false, reason: "silver" };

  const specs = parseSpecs(p.title);
  // Both weights are needed. A ring with only a gross weight would be
  // underpriced, so it falls back to "Request price" instead.
  if (specs.grossWeightG === null || specs.diamondWeightCt === null) return { ok: false, reason: "no-weights" };

  // A carat is 0.2 g, and the gross weight includes the stones. If the
  // diamonds alone outweigh the whole piece, the title has a typo, and
  // pricing it would put an absurd number on the website.
  if (specs.diamondWeightCt * CARAT_GRAMS > specs.grossWeightG) return { ok: false, reason: "weights-look-wrong" };

  const rates = ctx.rates[resolveCategory(p.product_type, ctx.aliases)];
  if (!rates || rates.perGram === null || rates.perCarat === null) return { ok: false, reason: "no-rates" };

  const amount = specs.grossWeightG * rates.perGram + specs.diamondWeightCt * rates.perCarat;
  return { ok: true, amount: Math.round(amount), source: "formula" };
}

export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

// What to print for a product, or null when prices are switched off.
export function priceLabel(p: PriceableProduct, ctx: PricingContext): string | null {
  if (!ctx.showPrices) return null;
  const r = calculatePrice(p, ctx);
  return r.ok ? formatPrice(r.amount) : "Request price";
}

export function priceAmount(p: PriceableProduct, ctx: PricingContext): number | null {
  if (!ctx.showPrices) return null;
  const r = calculatePrice(p, ctx);
  return r.ok ? r.amount : null;
}
