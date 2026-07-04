import { NextRequest, NextResponse } from "next/server";
import { sendEmail, emailTemplates, ADMIN_EMAIL, isEmailConfigured } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Name, email, and message are required" }, { status: 400 });
    }

    if (!isEmailConfigured() || !ADMIN_EMAIL) {
      // Same as /api/newsletter: the form itself isn't broken, email
      // delivery just isn't wired up yet in this environment — don't tell
      // the customer their message failed to send.
      return NextResponse.json({ success: true, skipped: true });
    }

    const result = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New message from ${name}`,
      html: emailTemplates.contactNotificationAdmin({ name, email, message }),
      replyTo: email,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("contact route error:", error);
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}
