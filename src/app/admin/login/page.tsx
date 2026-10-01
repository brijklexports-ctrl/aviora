import { loginAction } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-6 font-serif text-2xl">Admin sign in</h1>
      <form action={loginAction} className="space-y-4">
        <input type="hidden" name="from" value={sp.from || "/admin"} />
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            autoFocus
            required
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-ink"
          />
        </div>
        {sp.error && <p className="text-sm text-red-600">Wrong password. Try again.</p>}
        <button
          type="submit"
          className="w-full rounded-full bg-ink px-4 py-2 text-sm text-white hover:bg-ink/90"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
