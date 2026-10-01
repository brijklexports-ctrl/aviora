import { listCollections } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { saveCollectionAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const collections = await listCollections();

  return (
    <div>
      <h1 className="mb-1 font-serif text-2xl">Collections</h1>
      <p className="mb-6 text-sm text-ink/60">
        One collection per product category, auto-created from what's synced. Add a title, description, and hero
        image to turn a bare category into a real collection page — leave a field blank to fall back to the
        default.
      </p>

      <div className="space-y-4">
        {collections.map((c) => (
          <form
            key={c.productType}
            action={saveCollectionAction}
            className="rounded-lg border border-line bg-white p-4"
          >
            <input type="hidden" name="productType" value={c.productType} />
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{c.productType}</p>
                <p className="text-xs text-ink/50">
                  {c.count} pieces · /collections/{slugify(c.productType)}
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="published" defaultChecked={c.published} />
                Published
              </label>
            </div>

            <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/60">Display title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={c.title !== c.productType ? c.title : ""}
                  placeholder={c.productType}
                  className="w-full rounded border border-line px-3 py-1.5 text-sm outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/60">Sort order (lower = earlier)</label>
                <input
                  type="number"
                  name="sortOrder"
                  defaultValue={c.sortOrder ?? ""}
                  placeholder="auto"
                  className="w-full rounded border border-line px-3 py-1.5 text-sm outline-none focus:border-ink"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-ink/60">Description</label>
              <textarea
                name="description"
                defaultValue={c.description ?? ""}
                rows={2}
                placeholder="A short line about this collection"
                className="w-full rounded border border-line px-3 py-1.5 text-sm outline-none focus:border-ink"
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-ink/60">Hero image URL</label>
              <input
                type="text"
                name="heroImageUrl"
                defaultValue={c.heroImageUrl ?? ""}
                placeholder="Falls back to a representative product photo"
                className="w-full rounded border border-line px-3 py-1.5 text-sm outline-none focus:border-ink"
              />
            </div>

            <button
              type="submit"
              className="rounded-full border border-ink px-4 py-1.5 text-sm hover:bg-ink hover:text-white"
            >
              Save
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
