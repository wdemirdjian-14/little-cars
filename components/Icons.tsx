import type { SVGProps } from "react";

const paths = {
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  "arrow-up-right": <path d="M7 17 17 7M9 7h8v8" />,
  down: <path d="M12 4v15m-6-6 6 6 6-6" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m4 12.5 5 5L20 6.5" />,
  menu: <path d="M3 7h18M3 12h18M3 17h12" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  play: <path d="M7 4.5v15L19.5 12Z" fill="currentColor" stroke="none" />,
  download: <path d="M12 3v12m-5-5 5 5 5-5M4 20h16" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  mail: <path d="M3 6h18v12H3zM3 7l9 7 9-7" />,
  pin: <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Zm0-9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
  clock: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2" />,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7Z" />,
  file: <path d="M14 3H6v18h12V7Zm0 0v4h4M9 13h6M9 17h6" />,
  silence: <path d="M3 12h2m2-4v8m4-11v14m4-10v6m4-3h2" />,
  force: <path d="M4 17a8 8 0 1 1 16 0M12 17l4-6M3 17h3m12 0h3" />,
  target: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-4h.01" />,
  agile: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.5 10.5 9 12m6 0 5.5-1.5M12 15v6" />,
  shield: <path d="M12 3 4 6v6c0 4.5 3.4 8.2 8 9 4.6-.8 8-4.5 8-9V6Zm-3.5 9 2.5 2.5L16 9.5" />,
  battery: <path d="M3 8h15v8H3zM21 11v2M6 11v2m3-2v2m3-2v2" />,
  wrench: <path d="M14.5 5.5a4 4 0 0 0 4.9 4.9L21 12l-9 9-3-3 9-9-1.6-1.6a4 4 0 0 0-4.9-4.9l2.5 2.5-1.4 1.4Z" />,
  leaf: <path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15M5 19l7-7" />,
  chart: <path d="M4 20V4m0 16h16M8 16v-5m4 5V8m4 8v-3m4 3V6" />,
  image: <path d="M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15.5 9.5h.01" />,
  users: <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9c0-3.3 2.7-6 6-6s6 2.7 6 6m1-9a3 3 0 1 0-1.5-5.6M18 14c2 .8 3 2.9 3 6" />,
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9c0-3.9 3.1-7 7-7s7 3.1 7 7" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16v4Zm9-13 4 4" />,
  trash: <path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v6m4-6v6" />,
  history: <path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4m4 0v4l3 2" />,
  external: <path d="M14 4h6v6m0-6L11 13M18 14v6H4V6h6" />,
  search: <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 4 4" />,
  logout: <path d="M10 5H5v14h5m4-11 4 4-4 4m4-4H9" />,
  copy: <path d="M8 8h12v12H8zM16 8V4H4v12h4" />,
  upload: <path d="M12 16V4m-5 5 5-5 5 5M4 20h16" />,
  up: <path d="m6 15 6-6 6 6" />,
  send: <path d="M4 12 20 4l-4 16-4-6-8-2Zm8 2 8-10" />,
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z" />,
  instagram: <path d="M4 4h16v16H4zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm5-9.5h.01" />,
  youtube: <path d="M3 8.5C3 6.6 4.6 5 6.5 5h11C19.4 5 21 6.6 21 8.5v7c0 1.9-1.6 3.5-3.5 3.5h-11A3.5 3.5 0 0 1 3 15.5ZM10 9v6l5-3Z" />,
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true" focusable="false" {...props}>
      {paths[name]}
    </svg>
  );
}
