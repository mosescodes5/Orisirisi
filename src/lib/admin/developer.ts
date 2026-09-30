/**
 * Server-only — reads a non-public env var, so this must only ever be
 * called from Server Components, Server Actions, or Route Handlers. If
 * imported into a "use client" file, process.env.DEVELOPER_EMAIL is not
 * inlined and this will silently always return false; pass the boolean
 * result down as a prop instead.
 *
 * Gates a handful of admin features (currently just Hero Images) to one
 * specific account — the developer — separate from the regular
 * admin/staff role system in the `profiles` table. Defaults to Moses'
 * email so this works even if DEVELOPER_EMAIL isn't set in the environment.
 */
export function isDeveloperEmail(email: string | null | undefined): boolean {
  const developerEmail = (process.env.DEVELOPER_EMAIL || "mosesoluwa2005@gmail.com").toLowerCase();
  return (email ?? "").toLowerCase() === developerEmail;
}
