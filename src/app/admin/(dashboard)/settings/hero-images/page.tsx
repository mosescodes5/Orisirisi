import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdminProfile } from "@/lib/admin/queries";
import { isDeveloperEmail } from "@/lib/admin/developer";
import { getHeroImageOverrides } from "@/lib/site-settings";
import { HeroImagesForm } from "@/components/admin/HeroImagesForm";

export const metadata: Metadata = { title: "Hero Images" };

export default async function AdminHeroImagesPage() {
  const profile = await getCurrentAdminProfile();
  // Belt-and-suspenders: the sidebar link is already hidden from everyone
  // but the developer account, and the save action re-checks this too, but
  // the page itself refuses to render for anyone who lands here directly.
  if (!profile || !isDeveloperEmail(profile.email)) redirect("/admin");

  const overrides = await getHeroImageOverrides();

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow">Settings</p>
        <h1 className="mt-2 font-display text-[30px] font-medium sm:text-[36px]">Hero Images</h1>
        <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-ink/60">
          Developer-only. Swap the homepage hero photos and each category page&apos;s banner photo.
          Changes go live on the site as soon as you save — no redeploy needed.
        </p>
      </div>

      <HeroImagesForm overrides={overrides} />
    </div>
  );
}
