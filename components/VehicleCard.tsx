import Link from "next/link";
import type { Vehicle } from "@/content/types";
import { Icon } from "./Icons";
import { Photo } from "./Photo";
import { euro } from "./ui";

const CATEGORY: Record<Vehicle["category"], string> = {
  nature: "Gamme Nature",
  industrie: "Gamme Industrie",
  rail: "Ferroviaire",
  bego: "Tout-terrain extrême",
};

export function VehicleCard({ v, sizes = "(max-width: 900px) 82vw, 34vw" }: { v: Vehicle; sizes?: string }) {
  return (
    <Link href={`/${v.slug}/`} className="vcard">
      <div className="vcard__media" data-hparallax>
        <Photo src={v.card.src} alt={v.card.alt} sizes={sizes} />
      </div>
      <div className="vcard__body">
        <span className="hud vcard__cat">{CATEGORY[v.category]}</span>
        <h3 className="vcard__title">{v.name}</h3>
        <p className="vcard__tagline">{v.tagline}</p>
        <dl className="vcard__specs">
          <div className="vcard__spec">
            <dt>Vitesse</dt>
            <dd>{v.quick.speed}</dd>
          </div>
          <div className="vcard__spec">
            <dt>Charge</dt>
            <dd>{v.quick.payload}</dd>
          </div>
          <div className="vcard__spec">
            <dt>Autonomie</dt>
            <dd>{v.quick.range}</dd>
          </div>
        </dl>
        <div className="vcard__foot">
          <span className="vcard__price">
            {v.priceLld ? (
              <>
                Dès <b>{v.priceLld} €</b> HT/mois
                <br />
                ou {euro(v.priceBuy!)} € HT
              </>
            ) : (
              <>Tarif sur demande</>
            )}
          </span>
          <span className="vcard__go" aria-hidden="true">
            <Icon name="arrow" />
          </span>
        </div>
      </div>
    </Link>
  );
}
