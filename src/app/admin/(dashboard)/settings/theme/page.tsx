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
          Control three colors independently: <strong>Primary</strong> (buttons&apos; hover state, links,
          badges), <strong>Secondary</strong> (solid buttons, dark panels, active states — normally black),
          and <strong>Text</strong> (headings, body copy, gray captions — also normally black, kept
          separate so changing Secondary never washes out ordinary reading text).
        </p>
      </div>

      <ThemeCustomizer currentTheme={currentTheme} />
    </div>
  );
}
