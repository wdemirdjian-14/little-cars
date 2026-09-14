import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ButtonLink, TextLink } from "@/components/ui";
import { getContent } from "@/lib/content";

// Rendue hors du groupe (site) : on remet l'en-tête et le pied de page.
export default async function NotFound() {
  const { company } = await getContent("site");
  return (
    <>
      <Header phone={company.phone} phoneIntl={company.phoneIntl} />
      <main id="contenu">
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
      </main>
      <Footer company={company} />
    </>
  );
}
