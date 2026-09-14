import { PasswordForm } from "@/components/admin/AuthForms";
import { formatDate } from "@/components/admin/api";
import { PASSWORD_MIN, requireUser } from "@/lib/auth";

export const metadata = { title: "Mon compte" };

export default async function ComptePage() {
  const user = await requireUser();
  return (
    <div className="bo-stack" style={{ gap: 20 }}>
      <header className="bo-head">
        <div>
          <h1 className="bo-title">Mon compte</h1>
          <p className="bo-sub">
            {user.nom} · {user.email} · {user.role === "admin" ? "Administrateur" : "Éditeur"} · compte créé le {formatDate(user.cree_le)}
          </p>
        </div>
      </header>
      <section className="bo-card">
        <h2 className="bo-card__title" style={{ marginBottom: 12 }}>
          Changer de mot de passe
        </h2>
        <PasswordForm min={PASSWORD_MIN} />
      </section>
    </div>
  );
}
