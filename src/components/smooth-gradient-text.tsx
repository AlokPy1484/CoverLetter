"use client";

import GradientText from "./GradientText";

export function SmoothGradientText({ text }: { text: string }) {
  return (
    <span data-gradient-overlay aria-hidden="true" className="pointer-events-none absolute left-0 top-0 block opacity-0">
      <GradientText className="h-full w-full" direction="horizontal" style={{}}>{text}</GradientText>
    </span>
  );
}
