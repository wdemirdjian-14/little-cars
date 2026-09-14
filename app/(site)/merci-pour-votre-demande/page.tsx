import { ButtonLink, TextLink } from "@/components/ui";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const thanks = await getContent("merci");
  return pageMetadata({ ...thanks.seo, path: "/merci-pour-votre-demande/", noindex: true });
}

export default async function ThanksPage() {
  const thanks = await getContent("merci");
  return (
    <section className="section" style={{ minHeight: "80svh", display: "grid", alignItems: "center", paddingTop: "calc(var(--header-h) + 64px)" }}>
      <div className="wrap stack" style={{ gap: 32 }}>
        <p className="hud eyebrow">Demande reçue</p>
        <h1 className="h-mega">{thanks.title}</h1>
        <p className="lead">{thanks.text}</p>
        <div className="actions">
          <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
          <TextLink href="/les-utilitaires-electriques-par-usage/">Découvrir la gamme</TextLink>
        </div>
      </div>
    </section>
  );
}
