import { listSyncRuns } from "@/lib/db";
import { triggerSyncAction } from "./actions";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminDashboard() {
  const runs = await listSyncRuns(10);
  const last = runs[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 font-serif text-2xl">Sync</h1>
        <p className="mb-5 text-sm text-ink/60">
          Pulls the latest products from your gembox.app catalog. Runs automatically about every 3 days; use the button
          below to sync immediately instead of waiting.
        </p>

        <div className="mb-6 flex items-center justify-between rounded-lg border border-line bg-white p-4">
          <div className="text-sm">
            <p className="font-medium">
              Last sync: {last ? formatDate(last.started_at) : "never"}
              {last && (
                <span className={`ml-2 ${last.status === "success" ? "text-green-700" : "text-red-600"}`}>
                  {last.status}
                </span>
              )}
            </p>
            {last?.status === "success" && (
              <p className="text-ink/60">
                {last.products_seen} seen · {last.products_created} new · {last.products_updated} updated ·{" "}
                {last.products_deactivated} removed
              </p>
            )}
            {last?.status === "error" && <p className="text-red-600">{last.error}</p>}
          </div>
          <form action={triggerSyncAction}>
            <button
              type="submit"
              className="rounded-full bg-ink px-5 py-2 text-sm text-white hover:bg-ink/90"
            >
              Sync now
            </button>
          </form>
        </div>

        <h2 className="mb-2 text-sm font-semibold text-ink/70">Recent runs</h2>
        <div className="overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink/50">
                <th className="px-4 py-2 font-medium">Started</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Seen</th>
                <th className="px-4 py-2 font-medium">New</th>
                <th className="px-4 py-2 font-medium">Updated</th>
                <th className="px-4 py-2 font-medium">Removed</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-2">{formatDate(r.started_at)}</td>
                  <td className={`px-4 py-2 ${r.status === "success" ? "text-green-700" : "text-red-600"}`}>
                    {r.status}
                  </td>
                  <td className="px-4 py-2">{r.products_seen ?? "—"}</td>
                  <td className="px-4 py-2">{r.products_created ?? "—"}</td>
                  <td className="px-4 py-2">{r.products_updated ?? "—"}</td>
                  <td className="px-4 py-2">{r.products_deactivated ?? "—"}</td>
                </tr>
              ))}
              {runs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-ink/50">
                    No syncs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
