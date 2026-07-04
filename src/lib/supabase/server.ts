import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Supabase client for use in Server Components, Server Actions, and Route
 * Handlers. Reads/writes the auth session via Next.js cookies so the
 * middleware, server, and browser all agree on who's signed in.
 *
 * NOTE: calling `.set()` from a Server Component (rather than a Server
 * Action or Route Handler) throws — that's expected and safe to ignore,
 * because the middleware is what actually refreshes the session cookie.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — ignore, middleware handles refresh.
          }
        },
      },
    }
  );
}

/**
 * Admin-privileged client using the service role key. Bypasses Row Level
 * Security entirely — only ever use this in Server Actions / Route Handlers
 * AFTER you've already verified the caller is an authenticated admin.
 * NEVER import this into a Client Component or expose it to the browser.
 */
/**
 * Stateless anon-key client for public, read-only storefront queries
 * (products, categories). No cookie/session handling, so it's safe to call
 * from generateStaticParams and other build-time contexts where there's no
 * incoming request to read cookies from.
 */
export function createAnonClient() {
  return createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export function createServiceRoleClient() {
  return createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
