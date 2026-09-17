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

`vercel.json` schedules `/api/sync` every 30 minutes. **Note: Vercel's Hobby
(free) plan only allows cron jobs to run once a day** — if you're on Hobby and
want the ~15–30 min freshness you asked for, use the GitHub Actions workflow
below instead (or upgrade to Pro, which allows frequent crons).

### Alternative: trigger sync from GitHub Actions (works on any Vercel plan)

Remove the `crons` block from `vercel.json` and instead add
`.github/workflows/sync.yml`:

```yaml
name: Sync catalog
on:
  schedule:
    - cron: "*/30 * * * *"
  workflow_dispatch: {}
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -sf -X GET "https://YOUR-DOMAIN/api/sync" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

Add `CRON_SECRET` as a GitHub Actions repository secret (same value as in
Vercel).

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
