"use client";

import TechText from "./TechText";

export function FunctionalTechText({ text }: { text: string }) {
  return (
    <span data-tech-overlay aria-hidden="true" className="pointer-events-none absolute left-0 top-0 block opacity-0">
      <TechText text={text} inline fontWeight={400} letterSpacing={0} color="#000000" accentColor="#333333" reach={40} dashLength={2} dashGap={1} strokeWidth={0.65} specks={5} labels={false} draggable={false} sweep speed={0.8} style={{}} />
    </span>
  );
}
