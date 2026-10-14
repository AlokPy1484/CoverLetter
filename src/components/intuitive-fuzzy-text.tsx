"use client";

import { useEffect, useRef, useState } from "react";
import FuzzyText from "./FuzzyText";

type Typography = {
  fontSize: number;
  fontWeight: number;
  fontStyle: string;
  fontFamily: string;
  color: string;
  width: number;
  height: number;
  baseline: number;
};

export function IntuitiveFuzzyText({ text }: { text: string }) {
  const overlayRef = useRef<HTMLSpanElement>(null);
  const [typography, setTypography] = useState<Typography | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const word = overlay.parentElement?.querySelector<HTMLElement>("[data-fuzzy-word]");
      const baseline = word?.querySelector<HTMLElement>("[data-fuzzy-baseline]");
      if (!word || !baseline) return;
      const style = getComputedStyle(word);
      const box = word.getBoundingClientRect();
      const next: Typography = {
        fontSize: Number.parseFloat(style.fontSize),
        fontWeight: Number.parseInt(style.fontWeight, 10) || 400,
        fontStyle: style.fontStyle,
        fontFamily: style.fontFamily,
        color: style.color,
        width: box.width,
        height: box.height,
        baseline: baseline.getBoundingClientRect().top - box.top,
      };
      setTypography(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(overlay);
    window.addEventListener("resize", measure);
    document.fonts.addEventListener("loadingdone", measure);
    void document.fonts.ready.then(measure);
    measure();
    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("resize", measure);
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, []);

  return (
    <span ref={overlayRef} data-fuzzy-overlay aria-hidden="true" className="pointer-events-none absolute left-0 top-0 block opacity-0">
      {typography && <FuzzyText inline fontSize={`${typography.fontSize}px`} fontWeight={typography.fontWeight} fontStyle={typography.fontStyle} fontFamily={typography.fontFamily} color={typography.color} viewWidth={typography.width} viewHeight={typography.height} baselineOffset={typography.baseline} fuzzRange={16} baseIntensity={0.18} hoverIntensity={0.45} transitionDuration={150} className="absolute left-0 top-0 block">{text}</FuzzyText>}
    </span>
  );
}
