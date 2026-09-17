import { ensureSchema, getSql } from "./db";
import { fetchAllGemboxProducts, type GemboxProduct } from "./gembox";
import { productSlug } from "./slug";

export interface SyncResult {
  durationMs: number;
  seen: number;
  created: number;
  updated: number;
  deactivated: number;
}

function extractImages(product: GemboxProduct): string[] {
  return product.medias
    .filter((m) => m.type === "image" && (m.file.medium || m.file.original || m.file.small))
    .sort((a, b) => a.mediaPosition - b.mediaPosition)
    .map((m) => m.file.medium || m.file.original || m.file.small)
    .filter((url): url is string => Boolean(url));
}

// Pulls every product from the source gembox.app catalog and upserts it into
// our own `products` table. Products no longer present upstream are marked
// inactive (not deleted), so history/URLs aren't destroyed by a transient
// glitch on the source side.
export async function syncCatalog(): Promise<SyncResult> {
  const startedAt = Date.now();
  await ensureSchema();
  const sql = getSql();

  const runRows = (await sql`
    INSERT INTO sync_runs (status) VALUES ('running') RETURNING id
  `) as Array<{ id: number }>;
  const runId = runRows[0].id;

  try {
    const products = await fetchAllGemboxProducts();

    if (products.length === 0) {
      throw new Error("Source catalog returned 0 products — refusing to sync (likely an upstream issue)");
    }

    let created = 0;
    let updated = 0;
    const seenIds: number[] = [];

    for (const product of products) {
      seenIds.push(product.id);
      const slug = productSlug(product.title, product.id);
      const images = extractImages(product);

      const result = (await sql.query(
        `
          INSERT INTO products (
            id, slug, product_type, title, description, sku, price, currency,
            quantity, attributes, images, source_uuid, active, last_synced_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, TRUE, now())
          ON CONFLICT (id) DO UPDATE SET
            slug = EXCLUDED.slug,
            product_type = EXCLUDED.product_type,
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            sku = EXCLUDED.sku,
            price = EXCLUDED.price,
            currency = EXCLUDED.currency,
            quantity = EXCLUDED.quantity,
            attributes = EXCLUDED.attributes,
            images = EXCLUDED.images,
            source_uuid = EXCLUDED.source_uuid,
            active = TRUE,
            last_synced_at = now()
          RETURNING (xmax = 0) AS inserted
        `,
        [
          product.id,
          slug,
          product.productType,
          product.title,
          product.description,
          product.sku,
          product.price,
          product.currency,
          product.quantity,
          JSON.stringify(product.attributes),
          JSON.stringify(images),
          product.link?.uuid ?? null,
        ]
      )) as Array<{ inserted: boolean }>;

      if (result[0]?.inserted) created++;
      else updated++;
    }

    const deactivateResult = (await sql.query(
      `
        UPDATE products
        SET active = FALSE
        WHERE active = TRUE AND NOT (id = ANY($1::bigint[]))
        RETURNING id
      `,
      [seenIds]
    )) as Array<{ id: number }>;

    const durationMs = Date.now() - startedAt;

    await sql`
      UPDATE sync_runs SET
        finished_at = now(),
        status = 'success',
        products_seen = ${products.length},
        products_created = ${created},
        products_updated = ${updated},
        products_deactivated = ${deactivateResult.length}
      WHERE id = ${runId}
    `;

    return {
      durationMs,
      seen: products.length,
      created,
      updated,
      deactivated: deactivateResult.length,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await sql`
      UPDATE sync_runs SET finished_at = now(), status = 'error', error = ${message}
      WHERE id = ${runId}
    `;
    throw err;
  }
}
