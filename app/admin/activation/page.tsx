import Link from "next/link";
import { ActivationForm } from "@/components/admin/AuthForms";
import { Photo } from "@/components/Photo";
import { brand } from "@/content/brand";
import { PASSWORD_MIN, findInvitation } from "@/lib/auth";

export const metadata = { title: "Activation du compte" };

type Props = { searchParams: Promise<{ jeton?: string }> };

export default async function ActivationPage({ searchParams }: Props) {
  const { jeton } = await searchParams;
  const invitation = findInvitation(jeton);
  return (
    <main className="bo-auth">
      <div className="bo-auth__card">
        <Photo src={brand.logoDark.src} alt="Little" sizes="160px" priority />
        {invitation && jeton ? (
          <>
            <div>
              <h1 className="bo-title" style={{ fontSize: 28 }}>
                Choisir un mot de passe
              </h1>
              <p className="bo-sub">
                Compte <strong>{invitation.email}</strong>. Au moins {PASSWORD_MIN} caractères.
              </p>
            </div>
            <ActivationForm jeton={jeton} nom={invitation.nom} min={PASSWORD_MIN} />
          </>
        ) : (
          <>
            <h1 className="bo-title" style={{ fontSize: 28 }}>
              Lien expiré
            </h1>
            <p className="bo-alert bo-alert--warn">
              Ce lien d&apos;invitation n&apos;est plus valable (72 h, usage unique). Demandez-en un nouveau à un administrateur.
            </p>
            <Link href="/admin/connexion/">Aller à la connexion</Link>
          </>
        )}
      </div>
    </main>
  );
}
