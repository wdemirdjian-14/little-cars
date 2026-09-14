"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Chef d'orchestre des animations, monté une fois dans le layout.
 *
 *  - défilement fluide (Lenis) synchronisé avec GSAP ScrollTrigger
 *  - [data-in]        : révélations CSS (.is-in) à l'entrée dans l'écran
 *  - [data-parallax]  : décalage vertical proportionnel au scroll
 *  - [data-drift]     : rangées de photos qui glissent horizontalement
 *  - [data-count]     : compteurs qui défilent jusqu'à leur valeur
 *
 * Le contenu est rendu visible côté serveur : la classe .motion (qui masque
 * ce qui doit apparaître) n'est posée qu'ici, après avoir marqué comme
 * « déjà vu » tout ce qui est dans l'écran. Rien ne clignote, rien ne reste
 * caché sans JavaScript, et le LCP n'attend jamais une animation.
 */

let lenis: Lenis | null = null;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmt = new Intl.NumberFormat("fr-FR");

export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (reducedMotion() || lenis) return;
    lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = reducedMotion();
    lenis?.scrollTo(0, { immediate: true, force: true });

    // 1. Révélations : ce qui est déjà visible est marqué avant de poser .motion.
    const revealables = Array.from(document.querySelectorAll<HTMLElement>("[data-in]"));
    const vh = window.innerHeight;
    const pending: HTMLElement[] = [];
    for (const el of revealables) {
      const r = el.getBoundingClientRect();
      if (reduce || (r.top < vh * 0.95 && r.bottom > 0)) el.classList.add("is-in");
      else pending.push(el);
    }
    root.classList.toggle("motion", !reduce);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    pending.forEach((el) => io.observe(el));

    // 2. Compteurs.
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    const counterIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          counterIo.unobserve(el);
          const end = Number(el.dataset.count);
          const obj = { v: 0 };
          gsap.to(obj, { v: end, duration: 1.6, ease: "power3.out", onUpdate: () => (el.textContent = fmt.format(Math.round(obj.v))) });
        }
      },
      { threshold: 0.6 },
    );
    if (!reduce) {
      for (const el of counters) {
        const r = el.getBoundingClientRect();
        if (r.top > vh) {
          el.textContent = "0";
          counterIo.observe(el);
        }
      }
    }

    // 3. Effets liés à la position de scroll.
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax || 0.15);
        const target = el.firstElementChild ?? el;
        gsap.fromTo(
          target,
          { yPercent: -amount * 50 },
          {
            yPercent: amount * 50,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((row) => {
        const dir = Number(row.dataset.drift || 1);
        gsap.fromTo(
          row,
          { xPercent: dir > 0 ? -18 : 0 },
          {
            xPercent: dir > 0 ? 0 : -18,
            ease: "none",
            scrollTrigger: { trigger: row.parentElement ?? row, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 300);
    window.addEventListener("load", refresh);

    return () => {
      io.disconnect();
      counterIo.disconnect();
      ctx.revert();
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
    };
  }, [pathname]);

  return null;
}
