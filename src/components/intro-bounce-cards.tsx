"use client";

import { useLayoutEffect, useRef } from "react";
import BounceCards from "./BounceCards";
import "./intro-bounce-cards.css";

// Card positions differ from the source video filenames. Keep each poster
// explicitly paired with its card so thumbnail changes do not change the order.
const images = [
  { src: "/videos/hero/hero-first-card-thumbnail.png", video: "/videos/hero/Hero02.mp4", alt: "Hero card 1 — hover or focus to play" },
  { src: "/videos/hero/Hero03.jpg", video: "/videos/hero/Hero03.mp4", alt: "Hero card 2 — hover or focus to play" },
  { src: "/videos/hero/Hero04.jpg", video: "/videos/hero/Hero04.mp4", alt: "Hero card 3 — hover or focus to play" },
  { src: "", video: "/videos/hero/Hero01.mp4", alt: "Hero card 4 — hover or focus to play" },
];

export function IntroBounceCards() {
  const frameRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const main = frame?.parentElement;
    const first = frame?.previousElementSibling;
    const second = frame?.nextElementSibling;
    if (!frame || !main || !first || !second) return;

    const align = () => {
      const scale = Math.min(1, frame.clientWidth / 696);
      frame.style.setProperty("--cards-scale", String(scale));
      frame.style.setProperty("--cards-height", `${220 * scale}px`);
      // The desktop paragraphs are positioned independently. Measure their
      // actual line boxes so font loading and wrapping keep equal space above/below.
      const midpoint = (first.getBoundingClientRect().bottom + second.getBoundingClientRect().top) / 2;
      frame.style.setProperty("--cards-center", `${midpoint - main.getBoundingClientRect().top}px`);
    };
    const observer = new ResizeObserver(align);
    [frame, main, first, second].forEach(element => observer.observe(element));
    align();
    void document.fonts.ready.then(align);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} data-intro-cards className="intro-bounce-cards" role="group" aria-label="Hero video gallery">
      <div className="intro-bounce-cards__scale">
        <BounceCards
          images={images}
          className="intro-bounce-cards__gallery"
          containerWidth={696}
          containerHeight={220}
          cardSize={240}
          transformStyles={[
            "translate(-200px, 0px) rotate(-10deg)",
            "translate(-50px, 0px) rotate(-4deg)",
            "translate(50px, 0px) rotate(4deg)",
            "translate(200px, 0px) rotate(10deg)",
          ]}
          animationDelay={0.2}
          animationStagger={0.1}
          bounciness={0.6}
          pushDistance={40}
          borderWidth={4}
          radius={14}
          style={{}}
        />
      </div>
    </div>
  );
}
