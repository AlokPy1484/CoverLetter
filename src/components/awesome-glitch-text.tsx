"use client";

import GlitchText from "./GlitchText";

export function AwesomeGlitchText({ text }: { text: string }) {
  return (
    <span data-glitch-overlay aria-hidden="true" className="pointer-events-none absolute left-0 top-0 block opacity-0">
      <GlitchText inline>{text}</GlitchText>
    </span>
  );
}
