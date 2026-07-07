import { redirect } from "next/navigation";
import { getCurrentAdminProfile } from "@/lib/admin/queries";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentAdminProfile();
  if (!profile) redirect("/admin/login");

  return <AdminShell profile={profile}>{children}</AdminShell>;
}
