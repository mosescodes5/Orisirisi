import { redirect } from "next/navigation";
import { getCurrentAdminProfile } from "@/lib/admin/queries";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentAdminProfile();
  if (!profile) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-[#F7F6F4] text-ink">
      <AdminSidebar profile={profile} />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-[1200px] px-6 py-8 sm:px-10 sm:py-10">{children}</div>
      </div>
    </div>
  );
}
