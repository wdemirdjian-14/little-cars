import { ContactWidget } from "@/components/ContactWidget";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionRoot } from "@/components/MotionRoot";
import { Tracker } from "@/components/Tracker";
import { JsonLd } from "@/components/ui";
import { getContent } from "@/lib/content";
import { organizationLd } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { company } = await getContent("site");
  return (
    <>
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <Header phone={company.phone} phoneIntl={company.phoneIntl} />
      <main id="contenu">{children}</main>
      <Footer company={company} />
      <ContactWidget />
      <MotionRoot />
      <Tracker />
      <JsonLd data={organizationLd(company)} />
    </>
  );
}
