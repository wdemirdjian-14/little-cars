"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Mesure d'audience sans cookie (voir lib/analytics.ts). Une page vue par
// navigation, plus quelques gestes utiles au commercial : appel, e-mail,
// téléchargement de PDF, vidéo, ouverture du widget.

let firstHit = true;

function send(payload: object) {
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon?.("/api/a/", new Blob([body], { type: "application/json" }))) return;
  } catch {
    // sendBeacon indisponible : repli sur fetch
  }
  fetch("/api/a/", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
}

export function track(type: "widget_ouvert" | "appel" | "email" | "pdf" | "video", label = "") {
  send({ e: type, l: label.slice(0, 160), p: window.location.pathname });
}

export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Le référent n'a de sens que pour la première page de la visite.
    send({ p: pathname, r: firstHit ? document.referrer : "", q: window.location.search });
    firstHit = false;
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a");
      const href = link?.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) track("appel", href.slice(4));
      else if (href.startsWith("mailto:")) track("email", href.slice(7));
      else if (/\.pdf($|[?#])/i.test(href)) track("pdf", decodeURIComponent(href.split("/").pop() ?? href));
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
