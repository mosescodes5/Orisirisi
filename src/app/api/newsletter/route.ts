import { NextRequest, NextResponse } from "next/server";
import { sendEmail, emailTemplates, ADMIN_EMAIL, isEmailConfigured } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "A valid email is required" }, { status: 400 });
    }

    if (!isEmailConfigured()) {
      // Still return success to the UI — the signup itself isn't broken,
      // email delivery is just not wired up yet in this environment.
      return NextResponse.json({ success: true, skipped: true });
    }

    // NOTE: this only sends emails — it doesn't persist the subscriber
    // anywhere yet. Once Supabase is connected, insert into a
    // `newsletter_subscribers` table here before sending.

    const [welcome, adminNotice] = await Promise.all([
      sendEmail({
        to: email,
        subject: "You're on the list ✦",
        html: emailTemplates.newsletterWelcome(),
      }),
      ADMIN_EMAIL
        ? sendEmail({
            to: ADMIN_EMAIL,
            subject: "New newsletter subscriber",
            html: emailTemplates.newsletterNotificationAdmin(email),
          })
        : Promise.resolve({ success: true as const }),
    ]);

    return NextResponse.json({ success: true, welcome, adminNotice });
  } catch (error) {
    console.error("newsletter route error:", error);
    return NextResponse.json({ success: false, error: "Failed to subscribe" }, { status: 500 });
  }
}
