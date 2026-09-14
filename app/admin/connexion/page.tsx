import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/AuthForms";
import { Photo } from "@/components/Photo";
import { brand } from "@/content/brand";
import { currentUser } from "@/lib/auth";

export const metadata = { title: "Connexion" };

export default async function LoginPage() {
  if (await currentUser()) redirect("/admin/");
  return (
    <main className="bo-auth">
      <div className="bo-auth__card">
        <Photo src={brand.logoDark.src} alt="Little" sizes="160px" priority />
        <div>
          <h1 className="bo-title" style={{ fontSize: 28 }}>
            Back-office
          </h1>
          <p className="bo-sub">Connectez-vous pour gérer le site, l&apos;audience et les messages.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
