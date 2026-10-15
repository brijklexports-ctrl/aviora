import { NextRequest, NextResponse } from "next/server";
import { getPricingContext, getProductsBySlugs } from "@/lib/db";
import { priceLabel } from "@/lib/pricing";
import { parseSpecs, specSummary } from "@/lib/specs";

export const dynamic = "force-dynamic";

const MAX_SLUGS = 100;

export interface MoodBoardProduct {
  slug: string;
  title: string;
  sku: string | null;
  category: string;
  image: string | null;
  summary: string | null;
  metal: string | null;
  diamondWeight: string | null;
  grossWeight: string | null;
  price: string | null;
}

// Read-only: returns the same public details that are already on the product
// pages, for the slugs a visitor saved in their own browser.
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("slugs") ?? "";
  const slugs = Array.from(new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))).slice(0, MAX_SLUGS);

  const [products, pricing] = await Promise.all([getProductsBySlugs(slugs), getPricingContext()]);

  const items: MoodBoardProduct[] = products.map((p) => {
    const specs = parseSpecs(p.title);
    const first = p.media.find((m) => m.type === "image") ?? p.media[0];
    return {
      slug: p.slug,
      title: specs.cleanTitle,
      sku: p.sku,
      category: p.product_type,
      image: first ? (first.type === "image" ? first.url : first.poster ?? first.url) : null,
      summary: specSummary(specs),
      metal: specs.metal ? (specs.karat ? `${specs.karat} ${specs.metal}` : specs.metal) : null,
      diamondWeight: specs.diamondWeightCt !== null ? `${specs.diamondWeightCt.toFixed(2)} ct` : null,
      grossWeight: specs.grossWeightG !== null ? `${specs.grossWeightG.toFixed(2)} g` : null,
      price: priceLabel(p, pricing),
    };
  });

  return NextResponse.json({ items });
}
