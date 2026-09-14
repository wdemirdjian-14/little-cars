/* eslint-disable @next/next/no-img-element -- WebP pré-générés par scripts/import-media.mjs */
import type { ImgHTMLAttributes } from "react";
import { mediaInfo, mediaSrcSet, mediaUrl } from "@/lib/media";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src: string;
  alt: string;
  /** Image visible au premier affichage : chargée tout de suite, en priorité. */
  priority?: boolean;
};

export function Photo({ src, alt, sizes = "100vw", priority, ...rest }: Props) {
  const info = mediaInfo(src);
  return (
    <img
      src={mediaUrl(src, 1600)}
      srcSet={mediaSrcSet(src)}
      sizes={sizes}
      alt={alt}
      width={info?.w}
      height={info?.h}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding={priority ? "sync" : "async"}
      {...rest}
    />
  );
}
