export const ADMIN_COOKIE_NAME = "aviora_admin_session";

// Web Crypto (not node:crypto) so this works identically in both the Edge
// middleware runtime and the Node server runtime — Node 19+ also exposes
// the same global `crypto.subtle`.
async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET env var is not set");
  return s;
}

// A single fixed token (not time-limited) is enough for a one-admin site:
// producing this HMAC requires knowing ADMIN_SESSION_SECRET, which only
// happens by first knowing ADMIN_PASSWORD and successfully logging in.
export async function sessionToken(): Promise<string> {
  return hmacHex(secret(), "aviora-admin-authenticated");
}

export async function isValidSessionToken(value: string | undefined | null): Promise<boolean> {
  if (!value) return false;
  const expected = await sessionToken();
  return constantTimeEqual(value, expected);
}

export function checkPassword(candidate: string): boolean {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  return constantTimeEqual(candidate, real);
}
