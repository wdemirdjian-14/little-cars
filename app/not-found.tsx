import { ButtonLink, TextLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="section" style={{ minHeight: "86svh", display: "grid", alignItems: "center", paddingTop: "calc(var(--header-h) + 64px)" }}>
      <div className="wrap stack" style={{ gap: 32 }}>
        <p className="hud eyebrow">Erreur 404</p>
        <h1 className="h-mega">Hors piste</h1>
        <p className="lead">Cette page n&apos;existe pas ou a changé d&apos;adresse. Même un EBOX 4WD ne passe pas par ici.</p>
        <div className="actions">
          <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
          <TextLink href="/les-utilitaires-electriques-par-usage/">Voir la gamme</TextLink>
          <TextLink href="/little-contact/">Nous contacter</TextLink>
        </div>
      </div>
    </section>
  );
}
