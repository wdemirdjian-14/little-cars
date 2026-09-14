"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Section épinglée dont le contenu défile horizontalement quand on scrolle
 * verticalement. Sur mobile ou en mouvement réduit : simple bande
 * horizontale balayable au doigt (CSS scroll-snap), sans épinglage.
 */
export function Horizontal({
  children,
  className = "",
  trackClassName,
  head,
  progress = true,
}: {
  children: ReactNode;
  className?: string;
  trackClassName: string;
  head?: ReactNode;
  progress?: boolean;
}) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    const tr = track.current;
    if (!el || !tr) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.max(0, tr.scrollWidth - window.innerWidth);
      gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => el.style.setProperty("--p", self.progress.toFixed(4)),
        },
      });
      tr.querySelectorAll<HTMLElement>("[data-hparallax] img").forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -6 },
          {
            xPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  // L'épinglage GSAP enveloppe la section dans un « pin-spacer ». Sans ce
  // conteneur possédé par React, la section ne serait plus l'enfant direct de
  // son parent React et la navigation vers une autre page planterait
  // (removeChild : « The node to be removed is not a child of this node »).
  return (
    <div>
      <section ref={section} className={className}>
        {head}
        <div className="range__viewport">
          <div ref={track} className={trackClassName}>
            {children}
          </div>
        </div>
        {progress && <div className="range__progress" aria-hidden="true" />}
      </section>
    </div>
  );
}
