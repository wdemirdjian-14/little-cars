import { TeamManager } from "@/components/admin/TeamManager";
import { listUsers, requireAdmin } from "@/lib/auth";
import { mailConfigured } from "@/lib/mailer";

export const metadata = { title: "Équipe" };

export default async function EquipePage() {
  const me = await requireAdmin();
  return (
    <div className="bo-stack" style={{ gap: 20 }}>
      <header className="bo-head">
        <div>
          <h1 className="bo-title">Équipe</h1>
          <p className="bo-sub">Comptes du back-office. Les administrateurs gèrent l&apos;équipe ; les éditeurs gèrent contenus, médias et messages.</p>
        </div>
      </header>
      <TeamManager users={listUsers()} meId={me.id} smtp={mailConfigured()} />
    </div>
  );
}
