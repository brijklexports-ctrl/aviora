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
  featured: boolean;
  last_synced_at: string;
}

// The admin view needs the raw synced title/description plus the override
// fields, since the public-facing queries already collapse those into one
// effective value.
export interface AdminProductRow extends Omit<ProductRow, "title" | "description"> {
  title: string;
  description: string | null;
  title_override: string | null;
  description_override: string | null;
  hidden: boolean;
  sort_order: number | null;
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
  // Admin-controlled fields. The sync job never writes to these, so they
  // survive every resync untouched.
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE;`;
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT FALSE;`;
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INTEGER;`;
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS title_override TEXT;`;
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS description_override TEXT;`;
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

  // One row per product_type ("collection"), keyed by that category name
  // since collections are auto-derived from it. A category with no row
  // here yet just uses defaults (published, no custom copy/hero). Once a
  // raw product_type is merged elsewhere (see category_aliases below), its
  // own meta row — if any — is simply unused; nothing needs to delete it.
  await sql`
    CREATE TABLE IF NOT EXISTS collection_meta (
      product_type TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      hero_image_url TEXT,
      published BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order INTEGER,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  // Lets an admin fold a raw synced category into another one (e.g.
  // "Solitaire Rings" -> "Engagement Rings") without the sync job ever
  // reverting it — sync only ever writes the raw products.product_type,
  // never touches this table.
  await sql`
    CREATE TABLE IF NOT EXISTS category_aliases (
      source_product_type TEXT PRIMARY KEY,
      target_category TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
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
// Low to High / Price: High to Low), with featured pieces pinned to the
// front of "Newest" so admin-curated highlights show first. Products
// without a price (currently all of them) sort to the end either way.
const ORDER_BY: Record<NonNullable<ListProductsParams["sort"]>, string> = {
  newest: "featured DESC, sort_order ASC NULLS LAST, source_created_at DESC NULLS LAST, first_synced_at DESC",
  price_asc: "price ASC NULLS LAST, featured DESC, source_created_at DESC NULLS LAST",
  price_desc: "price DESC NULLS LAST, featured DESC, source_created_at DESC NULLS LAST",
};

const PUBLIC_SELECT = `
  id, slug, product_type,
  COALESCE(title_override, title) AS title,
  COALESCE(description_override, description) AS description,
  sku, price, currency, quantity, attributes, media, active, featured, last_synced_at
`;

// --- Category merging ------------------------------------------------------
// A raw product_type (as synced from gembox) can be folded into another
// category's name ("Solitaire Rings" -> "Engagement Rings") by an admin.
// Everywhere below that groups or filters by category resolves through
// this map first, so a merge behaves the same as if the two had always
// been one category, without ever rewriting the synced product_type.

async function getCategoryAliasMap(): Promise<Record<string, string>> {
  const sql = db();
  const rows = (await sql`SELECT source_product_type, target_category FROM category_aliases`) as Array<{
    source_product_type: string;
    target_category: string;
  }>;
  const map: Record<string, string> = {};
  for (const r of rows) map[r.source_product_type] = r.target_category;
  return map;
}

function resolveCategory(productType: string, aliasMap: Record<string, string>): string {
  return aliasMap[productType] ?? productType;
}

async function listRawProductTypes(): Promise<string[]> {
  const sql = db();
  const rows = (await sql`SELECT DISTINCT product_type FROM products`) as Array<{ product_type: string }>;
  return rows.map((r) => r.product_type);
}

// Every raw product_type that resolves (after merging) to this canonical
// category name — used to turn a "show me category X" request into the
// SQL-level set of raw values to match.
async function rawTypesForCategory(canonical: string): Promise<string[]> {
  const [allTypes, aliasMap] = await Promise.all([listRawProductTypes(), getCategoryAliasMap()]);
  const matches = allTypes.filter((t) => resolveCategory(t, aliasMap) === canonical);
  return matches.length > 0 ? matches : [canonical];
}

export async function setCategoryAlias(sourceProductType: string, targetCategory: string | null): Promise<void> {
  const sql = db();
  if (!targetCategory || targetCategory === sourceProductType) {
    await sql`DELETE FROM category_aliases WHERE source_product_type = ${sourceProductType}`;
  } else {
    await sql`
      INSERT INTO category_aliases (source_product_type, target_category, updated_at)
      VALUES (${sourceProductType}, ${targetCategory}, now())
      ON CONFLICT (source_product_type) DO UPDATE SET
        target_category = EXCLUDED.target_category,
        updated_at = now()
    `;
  }
}

export interface RawCategoryAdminRow {
  productType: string;
  count: number;
  mergedInto: string | null;
}

export async function listRawCategoriesAdmin(): Promise<RawCategoryAdminRow[]> {
  const sql = db();
  const rows = (await sql`
    SELECT product_type, COUNT(*)::text AS count
    FROM products
    WHERE active = TRUE AND hidden = FALSE
    GROUP BY product_type
    ORDER BY product_type ASC
  `) as Array<{ product_type: string; count: string }>;

  const aliasMap = await getCategoryAliasMap();
  return rows.map((r) => ({
    productType: r.product_type,
    count: Number(r.count),
    mergedInto: aliasMap[r.product_type] ?? null,
  }));
}

export async function listProducts(params: ListProductsParams = {}): Promise<ProductRow[]> {
  const { productType, search, sort = "newest", limit = 24, offset = 0 } = params;
  const sql = db();
  const like = search ? `%${search}%` : null;
  const orderBy = ORDER_BY[sort] ?? ORDER_BY.newest;
  const rawTypes = productType ? await rawTypesForCategory(productType) : null;

  const rows = await sql.query(
    `
      SELECT ${PUBLIC_SELECT}
      FROM products
      WHERE active = TRUE AND hidden = FALSE
        AND ($1::text[] IS NULL OR product_type = ANY($1))
        AND ($2::text IS NULL OR title ILIKE $2)
      ORDER BY ${orderBy}
      LIMIT $3 OFFSET $4
    `,
    [rawTypes, like, limit, offset]
  );

  return rows as ProductRow[];
}

export async function countProducts(params: Pick<ListProductsParams, "productType" | "search"> = {}): Promise<number> {
  const { productType, search } = params;
  const sql = db();
  const like = search ? `%${search}%` : null;
  const rawTypes = productType ? await rawTypesForCategory(productType) : null;

  const rows = await sql.query(
    `
      SELECT COUNT(*)::text AS count
      FROM products
      WHERE active = TRUE AND hidden = FALSE
        AND ($1::text[] IS NULL OR product_type = ANY($1))
        AND ($2::text IS NULL OR title ILIKE $2)
    `,
    [rawTypes, like]
  );

  return Number((rows as Array<{ count: string }>)[0]?.count ?? 0);
}

export async function listCategories(): Promise<{ productType: string; count: number }[]> {
  const sql = db();
  const rows = (await sql`
    SELECT product_type, COUNT(*)::text AS count
    FROM products
    WHERE active = TRUE AND hidden = FALSE
    GROUP BY product_type
  `) as Array<{ product_type: string; count: string }>;

  const aliasMap = await getCategoryAliasMap();
  const merged = new Map<string, number>();
  for (const r of rows) {
    const canonical = resolveCategory(r.product_type, aliasMap);
    merged.set(canonical, (merged.get(canonical) ?? 0) + Number(r.count));
  }

  return Array.from(merged.entries())
    .map(([productType, count]) => ({ productType, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  const sql = db();
  const rows = (await sql.query(
    `SELECT ${PUBLIC_SELECT} FROM products WHERE slug = $1 LIMIT 1`,
    [slug]
  )) as ProductRow[];

  return rows[0] ?? null;
}

// --- Collections (auto-derived from product_type; collection_meta only
// carries editorial overrides on top) -------------------------------------

export interface CollectionSummary {
  productType: string;
  title: string;
  description: string | null;
  heroImageUrl: string | null;
  published: boolean;
  sortOrder: number | null;
  count: number;
}

export async function listCollections(opts: { publishedOnly?: boolean } = {}): Promise<CollectionSummary[]> {
  const sql = db();
  const rawRows = (await sql`
    SELECT product_type, COUNT(*)::text AS count
    FROM products
    WHERE active = TRUE AND hidden = FALSE
    GROUP BY product_type
  `) as Array<{ product_type: string; count: string }>;

  const aliasMap = await getCategoryAliasMap();
  const counts = new Map<string, number>();
  for (const r of rawRows) {
    const canonical = resolveCategory(r.product_type, aliasMap);
    counts.set(canonical, (counts.get(canonical) ?? 0) + Number(r.count));
  }

  const metaRows = (await sql`
    SELECT product_type, title, description, hero_image_url, published, sort_order FROM collection_meta
  `) as Array<{
    product_type: string;
    title: string | null;
    description: string | null;
    hero_image_url: string | null;
    published: boolean;
    sort_order: number | null;
  }>;
  const metaMap = new Map(metaRows.map((m) => [m.product_type, m]));

  let list: CollectionSummary[] = Array.from(counts.entries()).map(([canonical, count]) => {
    const meta = metaMap.get(canonical);
    return {
      productType: canonical,
      title: meta?.title || canonical,
      description: meta?.description ?? null,
      heroImageUrl: meta?.hero_image_url ?? null,
      published: meta ? meta.published : true,
      sortOrder: meta?.sort_order ?? null,
      count,
    };
  });

  if (opts.publishedOnly) {
    list = list.filter((c) => c.published);
  }

  list.sort((a, b) => {
    const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return b.count - a.count;
  });

  return list;
}

export async function getCollectionByProductType(productType: string): Promise<CollectionSummary | null> {
  const all = await listCollections();
  return all.find((c) => c.productType === productType) ?? null;
}

// A representative image for a collection that has no hero_image_url set
// yet — the first (newest/featured, per the normal sort) product's image.
export async function getRepresentativeImage(productType: string): Promise<string | null> {
  const products = await listProducts({ productType, limit: 1 });
  const first = products[0];
  if (!first) return null;
  const media = first.media.find((m) => m.type === "image") ?? first.media[0];
  if (!media) return null;
  return media.type === "image" ? media.url : media.poster ?? media.url;
}

export async function upsertCollectionMeta(
  productType: string,
  fields: { title?: string | null; description?: string | null; heroImageUrl?: string | null; published?: boolean; sortOrder?: number | null }
): Promise<void> {
  const sql = db();
  await sql`
    INSERT INTO collection_meta (product_type, title, description, hero_image_url, published, sort_order, updated_at)
    VALUES (
      ${productType},
      ${fields.title ?? null},
      ${fields.description ?? null},
      ${fields.heroImageUrl ?? null},
      ${fields.published ?? true},
      ${fields.sortOrder ?? null},
      now()
    )
    ON CONFLICT (product_type) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      hero_image_url = EXCLUDED.hero_image_url,
      published = EXCLUDED.published,
      sort_order = EXCLUDED.sort_order,
      updated_at = now()
  `;
}

// --- Admin: full product visibility (no active/hidden filter), raw +
// override fields, and simple mutation helpers --------------------------

export interface ListAdminProductsParams {
  search?: string;
  limit?: number;
  offset?: number;
}

const ADMIN_SELECT = `
  id, slug, product_type, title, description, title_override, description_override,
  sku, price, currency, quantity, attributes, media, active, featured, hidden,
  sort_order, last_synced_at
`;

export async function listAllProductsAdmin(params: ListAdminProductsParams = {}): Promise<AdminProductRow[]> {
  const { search, limit = 50, offset = 0 } = params;
  const sql = db();
  const like = search ? `%${search}%` : null;

  const rows = await sql.query(
    `
      SELECT ${ADMIN_SELECT}
      FROM products
      WHERE ($1::text IS NULL OR title ILIKE $1 OR sku ILIKE $1)
      ORDER BY first_synced_at DESC
      LIMIT $2 OFFSET $3
    `,
    [like, limit, offset]
  );

  return rows as AdminProductRow[];
}

export async function countAllProductsAdmin(search?: string): Promise<number> {
  const sql = db();
  const like = search ? `%${search}%` : null;
  const rows = await sql.query(
    `SELECT COUNT(*)::text AS count FROM products WHERE ($1::text IS NULL OR title ILIKE $1 OR sku ILIKE $1)`,
    [like]
  );
  return Number((rows as Array<{ count: string }>)[0]?.count ?? 0);
}

export async function getProductByIdAdmin(id: number): Promise<AdminProductRow | null> {
  const sql = db();
  const rows = (await sql.query(`SELECT ${ADMIN_SELECT} FROM products WHERE id = $1`, [id])) as AdminProductRow[];
  return rows[0] ?? null;
}

export async function updateProductAdmin(
  id: number,
  fields: { featured?: boolean; hidden?: boolean; sortOrder?: number | null; titleOverride?: string | null; descriptionOverride?: string | null }
): Promise<void> {
  const sql = db();
  const current = await getProductByIdAdmin(id);
  if (!current) throw new Error(`Product ${id} not found`);

  await sql`
    UPDATE products SET
      featured = ${fields.featured ?? current.featured},
      hidden = ${fields.hidden ?? current.hidden},
      sort_order = ${fields.sortOrder !== undefined ? fields.sortOrder : current.sort_order},
      title_override = ${fields.titleOverride !== undefined ? fields.titleOverride : current.title_override},
      description_override = ${fields.descriptionOverride !== undefined ? fields.descriptionOverride : current.description_override}
    WHERE id = ${id}
  `;
}

export interface SyncRunRow {
  id: number;
  started_at: string;
  finished_at: string | null;
  status: string;
  products_seen: number | null;
  products_created: number | null;
  products_updated: number | null;
  products_deactivated: number | null;
  error: string | null;
}

export async function listSyncRuns(limit = 10): Promise<SyncRunRow[]> {
  const sql = db();
  const rows = (await sql`
    SELECT id, started_at, finished_at, status, products_seen, products_created, products_updated, products_deactivated, error
    FROM sync_runs
    ORDER BY started_at DESC
    LIMIT ${limit}
  `) as SyncRunRow[];
  return rows;
}

export function getSql() {
  return db();
}
