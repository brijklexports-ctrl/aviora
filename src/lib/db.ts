import { neon } from "@neondatabase/serverless";

function connectionString(): string {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error("DATABASE_URL (or POSTGRES_URL) env var is not set");
  }
  return url;
}

// A fresh client per call is cheap with Neon's HTTP driver (no pooled
// connection to manage) and keeps this module safe to import from both
// server components and standalone scripts.
function db() {
  return neon(connectionString());
}

export interface ProductMedia {
  type: "image" | "video";
  url: string;
  poster?: string;
}

export interface ProductRow {
  id: number;
  slug: string;
  product_type: string;
  title: string;
  description: string | null;
  sku: string | null;
  price: number | null;
  currency: string | null;
  quantity: number | null;
  attributes: Array<{ name: string; displayName: string; value: string | null; prefix?: string | null; suffix?: string | null }>;
  media: ProductMedia[];
  active: boolean;
  last_synced_at: string;
}

export async function ensureSchema() {
  const sql = db();

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id BIGINT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      product_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      sku TEXT,
      price NUMERIC,
      currency TEXT,
      quantity INTEGER,
      attributes JSONB NOT NULL DEFAULT '[]',
      images JSONB NOT NULL DEFAULT '[]',
      source_uuid TEXT,
      source_created_at TIMESTAMPTZ,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      first_synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      last_synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  // Safe to run repeatedly: adds columns only if an earlier deploy's table
  // doesn't have them yet (e.g. it existed before these fields did).
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS source_created_at TIMESTAMPTZ;`;
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS media JSONB NOT NULL DEFAULT '[]';`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);`;

  await sql`
    CREATE TABLE IF NOT EXISTS sync_runs (
      id SERIAL PRIMARY KEY,
      started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      finished_at TIMESTAMPTZ,
      products_seen INTEGER,
      products_created INTEGER,
      products_updated INTEGER,
      products_deactivated INTEGER,
      status TEXT NOT NULL DEFAULT 'running',
      error TEXT
    );
  `;
}

export interface ListProductsParams {
  productType?: string;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc";
  limit?: number;
  offset?: number;
}

// Matches the sort options on the source gembox.app catalog (Newest / Price:
// Low to High / Price: High to Low). Products without a price (which is
// currently all of them, since pricing is gated behind account approval)
// sort to the end regardless of direction rather than clustering at the top.
const ORDER_BY: Record<NonNullable<ListProductsParams["sort"]>, string> = {
  newest: "source_created_at DESC NULLS LAST, first_synced_at DESC",
  price_asc: "price ASC NULLS LAST, source_created_at DESC NULLS LAST",
  price_desc: "price DESC NULLS LAST, source_created_at DESC NULLS LAST",
};

export async function listProducts(params: ListProductsParams = {}): Promise<ProductRow[]> {
  const { productType, search, sort = "newest", limit = 24, offset = 0 } = params;
  const sql = db();
  const like = search ? `%${search}%` : null;
  const orderBy = ORDER_BY[sort] ?? ORDER_BY.newest;

  const rows = await sql.query(
    `
      SELECT id, slug, product_type, title, description, sku, price, currency,
             quantity, attributes, media, active, last_synced_at
      FROM products
      WHERE active = TRUE
        AND ($1::text IS NULL OR product_type = $1)
        AND ($2::text IS NULL OR title ILIKE $2)
      ORDER BY ${orderBy}
      LIMIT $3 OFFSET $4
    `,
    [productType ?? null, like, limit, offset]
  );

  return rows as ProductRow[];
}

export async function countProducts(params: Pick<ListProductsParams, "productType" | "search"> = {}): Promise<number> {
  const { productType, search } = params;
  const sql = db();
  const like = search ? `%${search}%` : null;

  const rows = await sql.query(
    `
      SELECT COUNT(*)::text AS count
      FROM products
      WHERE active = TRUE
        AND ($1::text IS NULL OR product_type = $1)
        AND ($2::text IS NULL OR title ILIKE $2)
    `,
    [productType ?? null, like]
  );

  return Number((rows as Array<{ count: string }>)[0]?.count ?? 0);
}

export async function listCategories(): Promise<{ productType: string; count: number }[]> {
  const sql = db();
  const rows = (await sql`
    SELECT product_type, COUNT(*)::text AS count
    FROM products
    WHERE active = TRUE
    GROUP BY product_type
    ORDER BY COUNT(*) DESC
  `) as Array<{ product_type: string; count: string }>;

  return rows.map((r) => ({ productType: r.product_type, count: Number(r.count) }));
}

export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  const sql = db();
  const rows = (await sql`
    SELECT id, slug, product_type, title, description, sku, price, currency,
           quantity, attributes, media, active, last_synced_at
    FROM products
    WHERE slug = ${slug}
    LIMIT 1
  `) as ProductRow[];

  return rows[0] ?? null;
}

export function getSql() {
  return db();
}
