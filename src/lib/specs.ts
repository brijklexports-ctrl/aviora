// Turns the free-text product titles from gembox ("... in Yellow Gold.
// G.wt- 4.29g. D.wt- 3.53cts") into a clean title plus structured specs, so
// weights always display the same way. Pure functions only: nothing here is
// stored, so improving the rules later fixes every product instantly.

export interface ParsedSpecs {
  cleanTitle: string;
  grossWeightG: number | null;
  diamondWeightCt: number | null;
  metal: string | null;
  karat: string | null;
  // True when the title still looks like it carries unparsed weight text,
  // so an admin can double check it.
  needsReview: boolean;
}

const NUM = "([0-9]+(?:\\.[0-9]+)?)";
const SEP = "\\s*(?:-|:|\u2013|\u2014)*\\s*";

const GROSS_RE = new RegExp(
  `\\b(?:g|gross)\\.?\\s*w(?:t|eight)?\\.?${SEP}${NUM}\\s*(?:grams?|gms?|gm|g)?\\b\\.?`,
  "i"
);
const DIAMOND_RE = new RegExp(
  `\\b(?:d|dia|diamond)\\.?\\s*w(?:t|eight)?\\.?${SEP}${NUM}\\s*(?:carats?|cts?|crt|ct)?\\b\\.?`,
  "i"
);
const KARAT_RE = /\b(9|10|14|18|22)\s*k(?:t)?(?![a-z])/i;
const METAL_RE = /\b(yellow|white|rose|pink)\s*gold\b/i;
const TWO_TONE_RE = /\b(white|yellow|rose|pink)\s*\/\s*(white|yellow|rose|pink)\s*gold\b/i;
const WG_RE = /\bwg\b/i;
const LEFTOVER_RE = /\b(?:g\.?\s*wt|d\.?\s*wt|dia\.?\s*wt|gross\s*wt|lg\s*wt|crt)\b/i;

function titleCaseMetal(color: string): string {
  const c = color.toLowerCase() === "pink" ? "Rose" : color[0].toUpperCase() + color.slice(1).toLowerCase();
  return `${c} Gold`;
}

export function parseSpecs(rawTitle: string): ParsedSpecs {
  let t = (rawTitle ?? "").replace(/\s+/g, " ").trim();
  // "14kWhite Gold" -> "14K White Gold"
  t = t.replace(/\b(\d{1,2})\s*k(?:t)?(?=[A-Za-z])/gi, "$1K ");

  let grossWeightG: number | null = null;
  let diamondWeightCt: number | null = null;

  const g = t.match(GROSS_RE);
  if (g) {
    grossWeightG = parseFloat(g[1]);
    t = t.replace(GROSS_RE, " ");
  }
  const d = t.match(DIAMOND_RE);
  if (d) {
    diamondWeightCt = parseFloat(d[1]);
    t = t.replace(DIAMOND_RE, " ");
  }

  let metal: string | null = null;
  const tt = t.match(TWO_TONE_RE);
  const m = t.match(METAL_RE);
  if (tt) {
    const cap = (w: string) => titleCaseMetal(w).replace(" Gold", "");
    metal = `${cap(tt[1])} / ${cap(tt[2])} Gold`;
    t = t.replace(TWO_TONE_RE, `${cap(tt[1])}/${cap(tt[2])} Gold`);
  } else if (m) {
    metal = titleCaseMetal(m[1]);
    // Normalise "yellow Gold" -> "Yellow Gold" inside the title too.
    t = t.replace(METAL_RE, metal);
  } else if (WG_RE.test(t)) {
    metal = "White Gold";
    t = t.replace(WG_RE, "White Gold");
  }

  // "White Gold over Silver" is not solid gold; don't label it as such.
  if (/silver/i.test(t)) metal = null;

  let karat: string | null = null;
  const k = t.match(KARAT_RE);
  if (k) karat = `${k[1]}K`;

  // Tidy what is left: stray separators, doubled spaces, trailing dots.
  t = t
    .replace(/\s+([.,])/g, "$1")
    .replace(/[\s.,\-–—:]+$/g, "")
    .replace(/^[\s.,\-–—:]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const needsReview = LEFTOVER_RE.test(t) || (grossWeightG === null && diamondWeightCt === null && /\bwt\b/i.test(rawTitle));

  return { cleanTitle: t || rawTitle.trim(), grossWeightG, diamondWeightCt, metal, karat, needsReview };
}

export function formatGrams(g: number): string {
  return `${g.toFixed(2)} g`;
}

export function formatCarats(ct: number): string {
  return `${ct.toFixed(2)} ct`;
}

// Short one-line summary for product cards, e.g. "3.53 ct diamonds · 4.29 g".
export function specSummary(s: ParsedSpecs): string | null {
  const parts: string[] = [];
  if (s.diamondWeightCt !== null) parts.push(`${formatCarats(s.diamondWeightCt)} diamonds`);
  if (s.grossWeightG !== null) parts.push(formatGrams(s.grossWeightG));
  return parts.length ? parts.join(" · ") : null;
}
