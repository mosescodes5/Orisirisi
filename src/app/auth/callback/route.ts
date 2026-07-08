import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Where our custom-sent verification/reset emails point after Supabase's
 * own /auth/v1/verify endpoint confirms the token. Supabase can't set a
 * session cookie on OUR domain directly (different origin), so it appends
 * a one-time `code` here instead — we exchange that for a real session and
 * then redirect the browser onward, fully signed in.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectPath = searchParams.get("redirect_to") || "/account";
  const safePath = redirectPath.startsWith("/") ? redirectPath : "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("auth callback: exchangeCodeForSession failed:", error.message);
      return NextResponse.redirect(`${origin}/account?verified=error`);
    }
  }

  return NextResponse.redirect(`${origin}${safePath}`);
}
