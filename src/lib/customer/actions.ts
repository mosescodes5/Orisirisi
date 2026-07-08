"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { sendEmail, emailTemplates, STORE_URL } from "@/lib/email";

export type CustomerAuthResult =
  | { ok: true }
  | { ok: true; needsConfirmation: true }
  | { ok: false; error: string };

export async function signUpCustomer(
  _prevState: CustomerAuthResult | null,
  formData: FormData
): Promise<CustomerAuthResult> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (fullName.length < 2) return { ok: false, error: "Enter your full name." };
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

  try {
    // Use the admin API (service role) to create the user AND get back a
    // confirmation link, WITHOUT Supabase sending its own email for it —
    // generateLink() only ever generates the link, it never sends anything.
    // We then email that link ourselves via Brevo/Gmail, branded to match
    // the rest of the site, instead of Supabase's default sender.
    const admin = createServiceRoleClient();
    const { data, error } = await admin.auth.admin.generateLink({
      type: "signup",
      email,
      password,
      options: {
        data: { full_name: fullName },
        redirectTo: `${STORE_URL}/auth/callback?redirect_to=/account`,
      },
    });

    if (error) {
      // Supabase's admin API is allowed to tell the truth about duplicate
      // emails (unlike the public signup endpoint) since only our trusted
      // server calls this, so this message is generally accurate as-is.
      return { ok: false, error: error.message };
    }

    // Extra safety net: some Supabase versions return success with an
    // empty `identities` array for an already-registered, already-confirmed
    // email instead of an error. Treat that the same way.
    if (data.user?.identities && data.user.identities.length === 0) {
      return { ok: false, error: "An account with this email already exists. Try signing in instead." };
    }

    if (data.user) {
      await admin.from("profiles").update({ full_name: fullName }).eq("id", data.user.id);
    }

    const emailResult = await sendEmail({
      to: email,
      subject: `Confirm your email — ${fullName ? "welcome," + " " + fullName.split(" ")[0] : "welcome"}`,
      html: emailTemplates.verifyEmail({ name: fullName, link: data.properties.action_link }),
    });

    if (!emailResult.success) {
      console.error("signUpCustomer: verification email failed to send:", emailResult.error);
      return {
        ok: false,
        error: "Your account was created, but we couldn't send the confirmation email. Please try again shortly or contact us.",
      };
    }
  } catch (err) {
    console.error("signUpCustomer failed:", err);
    return { ok: false, error: "Something went wrong creating your account. Please try again." };
  }

  return { ok: true, needsConfirmation: true };
}

export async function signInCustomer(
  _prevState: CustomerAuthResult | null,
  formData: FormData
): Promise<CustomerAuthResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/account");
  } catch (err) {
    console.error("signInCustomer failed:", err);
    return { ok: false, error: "Something went wrong signing you in. Please try again." };
  }

  redirect("/account");
}

export async function signOutCustomer() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/account");
  redirect("/account");
}
