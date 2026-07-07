import type { Metadata } from "next";
import { getCurrentTheme } from "@/lib/admin/queries";
import { ThemeCustomizer } from "@/components/admin/ThemeCustomizer";

export const metadata: Metadata = { title: "Brand Theme" };

export default async function AdminThemePage() {
  const currentTheme = await getCurrentTheme();

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow">Settings</p>
        <h1 className="mt-2 font-display text-[30px] font-medium sm:text-[36px]">Brand Theme</h1>
        <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-ink/60">
          Control the two colors used across the storefront and admin: <strong>Primary</strong> (buttons,
          links, badges) and <strong>Secondary</strong> (body text, dark backgrounds, borders — normally
          black). Set them to anything, including swapping them entirely.
        </p>
      </div>

      <ThemeCustomizer currentPrimary={currentTheme.primary} currentSecondary={currentTheme.secondary} />
    </div>
  );
}
