"use client";

import { useEffect, useRef, useState } from "react";

export function HoverVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const active = useRef(false);
  const [playing, setPlaying] = useState(false);

  const stop = () => {
    active.current = false;
    const video = videoRef.current;
    video?.pause();
    if (video && video.readyState > 0) video.currentTime = 0;
    setPlaying(false);
  };

  const start = () => {
    active.current = true;
    void videoRef.current?.play().catch(() => {});
  };

  useEffect(() => {
    const video = videoRef.current;
    const onVisibility = () => { if (document.hidden) stop(); };
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) stop();
    });
    if (video) observer.observe(video);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", stop);
    return () => {
      active.current = false;
      video?.pause();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", stop);
    };
  }, []);

  return (
    <div
      role="group"
      aria-label={`${label} — hover or focus to play`}
      tabIndex={0}
      onPointerEnter={start}
      onPointerLeave={stop}
      onFocus={start}
      onBlur={stop}
      className="relative h-full w-full overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-neutral-500"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlaying={() => {
          if (active.current) setPlaying(true);
          else videoRef.current?.pause();
        }}
        className="block h-full w-full object-cover"
      />
      <img src={poster} alt="" aria-hidden="true" draggable={false} className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${playing ? "invisible" : ""}`} />
    </div>
  );
}
