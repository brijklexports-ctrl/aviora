# Aviora Jewelry

A jewelry catalog storefront that mirrors your gembox.app catalog (`mnix9bljni`)
under the Aviora Jewelry brand, kept in sync automatically.

## How the sync works

Your gembox.app catalog page calls a public GraphQL API
(`https://graphql.gemlightbox.com/graphql`, operation `LinkProductList`) to
load and paginate products — no login required for a public share link. This
app calls the same API on a schedule, upserts every product into its own
Postgres database, and marks products no longer present upstream as inactive
(never deletes them, so URLs stay stable through a transient glitch).

- `src/lib/gembox.ts` — pages through the source catalog's GraphQL API
- `src/lib/sync.ts` — upserts into the `products` table, deactivates stale rows
- `src/app/api/sync/route.ts` — HTTP endpoint that runs a sync, secret-protected
- `vercel.json` — schedules that endpoint via Vercel Cron

If gembox.app ever changes this API, the fix is contained to `gembox.ts`.

## One-time setup

```bash
npm install
```

1. **Attach a database.** In your Vercel project: Storage → Create Database →
   Postgres (Neon). This sets `DATABASE_URL` (or `POSTGRES_URL`) automatically
   in your Vercel env vars.
2. **Set `CRON_SECRET`.** Generate one and add it as a Vercel env var:
   ```bash
   openssl rand -hex 32
   ```
   Vercel automatically sends this as `Authorization: Bearer <CRON_SECRET>`
   on scheduled Cron requests once the env var is set — no extra config.
3. **Pull env vars locally** for testing:
   ```bash
   vercel link
   vercel env pull .env
   ```
4. **Create the schema and run a first sync:**
   ```bash
   npm run db:migrate
   npm run sync
   ```
5. **Run locally:**
   ```bash
   npm run dev
   ```

## Deploying

```bash
vercel deploy --prod
```

`vercel.json` schedules `/api/sync` to run once a day (3am UTC), which is
the fastest cron frequency Vercel's free Hobby plan allows — no extra setup
needed, this works out of the box.

If you ever want faster refresh (e.g. every few hours), Vercel's Hobby plan
still won't allow it natively — you'd need either a Pro plan, or an external
scheduler (like a GitHub Actions workflow) hitting `/api/sync` with
`Authorization: Bearer <CRON_SECRET>` on its own schedule. Not set up here
since daily is what's needed right now.

You can also trigger a sync manually anytime without waiting for the cron:
```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://YOUR-DOMAIN/api/sync
```

## What's replicated vs. simplified

- **Replicated:** category tiles with counts, sidebar Product Type filter,
  search, sort, product grid, product detail page (gallery, thumbnails,
  description, spec attributes, "Contact the Seller" CTA).
- **Simplified:** the source site's richer facets (Stone Type, Shape, Cutting
  Style, Diamond Variety) aren't broken out as separate filters yet — only
  Product Type is. The underlying data (`attributes` JSONB column) has
  whatever the source provides per product, so this can be extended later.
- **Images** are hot-linked from gembox.app's CDN (`media.gemlightbox.com`,
  `static.cloud.picupmedia.com`) via Next.js Image optimization rather than
  re-hosted. This is simpler and works well, but means image availability
  depends on that CDN staying up. Mirroring images into Vercel Blob storage
  is a reasonable follow-up if you want full independence from their CDN.
- **No cart/checkout** — "Contact the Seller" is a `mailto:` link. Update the
  address in `src/app/product/[slug]/page.tsx`.

## Rebranding

- Site name: `NEXT_PUBLIC_SITE_NAME` env var (defaults to "Aviora Jewelry").
- Colors/fonts: `tailwind.config.ts`.
- Contact email: `src/app/product/[slug]/page.tsx`.

## Monitoring sync health

Every run is logged in the `sync_runs` table (`status`, counts, `error`).
Query it directly, or hit `/api/sync` manually to see the latest result:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://YOUR-DOMAIN/api/sync
```
