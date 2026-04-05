/**
 * Returns true if the given email is in the NEXT_PUBLIC_ADMIN_EMAILS env var.
 * NEXT_PUBLIC_ADMIN_EMAILS is a comma-separated list in .env.local:
 *   NEXT_PUBLIC_ADMIN_EMAILS=you@example.com,other@example.com
 *
 * Using NEXT_PUBLIC_ so client components (admin pages) can read it.
 * Falls back to an empty list so admin pages are locked by default.
 */
export function isAdminEmail(email) {
  if (!email) return false;
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  const allowed = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}
