"use client";

import { useState } from "react";
import type { Video } from "@/content/pages";
import { Icon } from "./Icons";
import { Photo } from "./Photo";
import { track } from "./Tracker";

/**
 * Vidéo chargée au clic seulement : aucune requête ni cookie YouTube/Vimeo
 * tant que le visiteur n'a rien demandé (RGPD, performance).
 */
export function VideoLite({ video, caption = true }: { video: Video; caption?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const src =
    video.provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`
      : `https://player.vimeo.com/video/${video.id}?autoplay=1&dnt=1&title=0&byline=0`;

  return (
    <figure style={{ margin: 0 }}>
      <div className="video frame">
        {playing ? (
          <iframe src={src} title={video.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        ) : (
          <>
            <Photo src={video.poster.src} alt={video.poster.alt} sizes="(max-width: 760px) 100vw, 50vw" />
            <button className="video__play" type="button" onClick={() => {
                setPlaying(true);
                track("video", video.title);
              }}>
              <i>
                <Icon name="play" />
              </i>
              <span className="hud">Lire la vidéo</span>
              <span className="sr-only">{video.title}</span>
            </button>
          </>
        )}
      </div>
      {caption && (
        <figcaption className="video-caption">
          <strong>{video.title}</strong>
          {video.caption && <span className="hud muted">{video.caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}
