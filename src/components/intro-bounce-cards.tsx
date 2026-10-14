"use client";

import { useLayoutEffect, useRef } from "react";
import BounceCards from "./BounceCards";
import "./intro-bounce-cards.css";

const images = [
  { src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=960&h=540&q=85", alt: "Forested valley beneath granite cliffs" },
  { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&h=540&q=85", alt: "Road winding through red rock hills" },
  { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=960&h=540&q=85", alt: "Mountain peaks against the sky" },
  { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=960&h=540&q=85", alt: "Green hills covered in morning mist" },
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
    <div ref={frameRef} data-intro-cards className="intro-bounce-cards" role="group" aria-label="Landscape image gallery">
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
