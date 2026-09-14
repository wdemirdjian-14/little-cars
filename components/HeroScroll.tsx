"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Img } from "@/content/types";
import { Photo } from "./Photo";

type Scene = {
  word: string;
  caption: string;
  image: Img;
  readout: { label: string; value: string; unit: string };
};

/**
 * Ouverture de l'accueil : des scènes plein écran qui se succèdent au scroll.
 * Rendu serveur complet (toutes les scènes sont dans le HTML) ; le mode
 * « scènes » n'est activé qu'après montage, et jamais si l'utilisateur a
 * demandé de réduire les animations.
 */
export function HeroScroll({ h1, scenes }: { h1: string; scenes: Scene[] }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    el.classList.add("hero--live");

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const sceneEls = q<HTMLElement>(".hero__scene");
      const words = q<HTMLElement>(".hero__word");
      const captions = q<HTMLElement>(".hero__caption");
      const readouts = q<HTMLElement>(".hero__readout");
      const ticks = q<HTMLElement>(".hero__rail li");
      const n = sceneEls.length;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          onUpdate: (self) => {
            el.style.setProperty("--p", self.progress.toFixed(4));
            const active = Math.min(n - 1, Math.floor(self.progress * n + 0.15));
            ticks.forEach((t, i) => (t.dataset.active = String(i === active)));
          },
        },
      });

      sceneEls.forEach((scene, i) => {
        const img = scene.querySelector("img");
        if (img) tl.fromTo(img, { scale: 1.16 }, { scale: 1, duration: 1 }, i);
        if (i === 0) return;
        const at = i - 0.35;
        tl.fromTo(scene, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power2.inOut" }, at);
        tl.to([words[i - 1], captions[i - 1], readouts[i - 1]], { autoAlpha: 0, y: -40, duration: 0.25 }, at);
        tl.fromTo([words[i], captions[i], readouts[i]], { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.3 }, at + 0.2);
      });
      tl.to({}, { duration: 0.35 });
    }, el);

    return () => {
      ctx.revert();
      el.classList.remove("hero--live");
    };
  }, []);

  return (
    <section ref={root} className="hero" style={{ "--n": scenes.length } as CSSProperties} aria-label="Présentation de Little">
      <div className="hero__sticky">
        {scenes.map((s, i) => (
          <div className="hero__scene" key={s.image.src} style={{ zIndex: i }}>
            <Photo src={s.image.src} alt={s.image.alt} priority={i === 0} />
          </div>
        ))}
        <div className="hero__shade" style={{ zIndex: scenes.length }} />
        <div className="hero__scan" style={{ zIndex: scenes.length }} />

        <ol className="hero__rail hud" style={{ zIndex: scenes.length + 1 }} aria-hidden="true">
          {scenes.map((s, i) => (
            <li key={s.word} data-active={i === 0}>
              {String(i + 1).padStart(2, "0")} {s.word}
            </li>
          ))}
        </ol>

        <div className="hero__content" style={{ zIndex: scenes.length + 1 }}>
          <div className="wrap hero__grid">
            <div>
              <h1 className="hero__h1">{h1}</h1>
              <div className="hero__words">
                {scenes.map((s) => (
                  <p className="hero__word" key={s.word}>
                    {s.word}
                  </p>
                ))}
              </div>
              <div className="hero__captions">
                {scenes.map((s) => (
                  <p className="hero__caption" key={s.word}>
                    {s.caption}
                  </p>
                ))}
              </div>
              <p className="scroll-cue hud">
                <i />
                Faites défiler
              </p>
            </div>
            <div className="hero__hud">
              {scenes.map((s) => (
                <div className="hero__readout" key={s.word}>
                  <span className="hud muted">{s.readout.label}</span>
                  <span className="hero__readout-value">
                    {s.readout.value}
                    {s.readout.unit && <small>{s.readout.unit}</small>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hero__progress" style={{ zIndex: scenes.length + 1 }} />
      </div>
    </section>
  );
}
