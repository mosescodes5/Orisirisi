"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) return { ok: false, error: error.message };

  // Supabase deliberately does NOT return an error here if the email
  // already belongs to a confirmed account — it returns a fake "success"
  // with an empty `identities` array, so an attacker can't use signup to
  // probe which emails are registered. We still need to tell the customer
  // what actually happened, so detect that case and surface it honestly.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { ok: false, error: "An account with this email already exists. Try signing in instead." };
  }

  // Give the profile row (created by the DB trigger) the customer's name.
  if (data.user) {
    await supabase.from("profiles").update({ full_name: fullName }).eq("id", data.user.id);
  }

  // If email confirmation is required, Supabase won't return a session yet.
  if (!data.session) {
    return { ok: true, needsConfirmation: true };
  }

  revalidatePath("/account");
  redirect("/account");
}

export async function signInCustomer(
  _prevState: CustomerAuthResult | null,
  formData: FormData
): Promise<CustomerAuthResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/account");
  redirect("/account");
}

export async function signOutCustomer() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/account");
  redirect("/account");
}
