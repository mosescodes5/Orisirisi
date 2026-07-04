import { NextRequest, NextResponse } from "next/server";
import { sendEmail, emailTemplates, ADMIN_EMAIL, isEmailConfigured } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Name, email, and message are required" }, { status: 400 });
    }

    if (!isEmailConfigured() || !ADMIN_EMAIL) {
      return NextResponse.json({ success: false, skipped: true, reason: "Email not configured" });
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
