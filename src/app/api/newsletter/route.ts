import { NextRequest, NextResponse } from "next/server";
import { sendEmail, emailTemplates, ADMIN_EMAIL, isEmailConfigured } from "@/lib/email";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "A valid email is required" }, { status: 400 });
    }

    const db = createServiceRoleClient();
    const { error: insertError, data: inserted } = await db
      .from("newsletter_subscribers")
      .insert({ email })
      .select("id")
      .maybeSingle();

    // 23505 = unique violation -> already subscribed. Treat as success
    // (idempotent from the customer's point of view) but skip re-sending
    // the welcome email so repeat submissions don't spam them.
    const alreadySubscribed = insertError?.code === "23505";
    if (insertError && !alreadySubscribed) {
      console.error("newsletter route: failed to save subscriber:", insertError.message);
      return NextResponse.json({ success: false, error: "Failed to save your subscription" }, { status: 500 });
    }

    if (!isEmailConfigured()) {
      // Subscriber is saved either way — email delivery just isn't
      // configured in this environment yet.
      return NextResponse.json({ success: true, skipped: true });
    }

    if (alreadySubscribed || !inserted) {
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }

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

    if (!welcome.success) {
      // The subscriber IS saved at this point — only the confirmation
      // email failed to send — so don't tell the customer to try again
      // (that would create a duplicate-attempt loop against the unique
      // constraint). Just log it for follow-up.
      console.error("newsletter route: welcome email failed to send:", welcome.error);
    }

    return NextResponse.json({ success: true, welcome, adminNotice });
  } catch (error) {
    console.error("newsletter route error:", error);
    return NextResponse.json({ success: false, error: "Failed to subscribe" }, { status: 500 });
  }
}
