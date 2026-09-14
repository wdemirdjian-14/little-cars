import { AdminNav } from "@/components/admin/AdminNav";
import { requireUser } from "@/lib/auth";
import { countByStatut } from "@/lib/messages";

export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const counts = countByStatut();
  return (
    <div className="bo-shell">
      <AdminNav nom={user.nom} role={user.role} nouveaux={counts.nouveau} />
      <main className="bo-main">{children}</main>
    </div>
  );
}
