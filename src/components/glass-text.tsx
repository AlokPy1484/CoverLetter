"use client";

import { useId } from "react";

export function GlassText({ text }: { text: string }) {
  const id = `glass-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <span data-glass-word className="relative inline-block whitespace-nowrap">
      <span data-glass-original>{text}</span>
      <span data-glass-baseline aria-hidden="true" className="inline-block h-0 w-0 align-baseline" />
      <span data-glass-overlay aria-hidden="true" className="pointer-events-none absolute inset-0 block opacity-0">
        <svg data-glass-svg className="block h-full w-full overflow-visible" fill="none">
          <defs>
            <text id={`${id}-letters`} data-glass-lettering x="0" y="48" style={{ fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" }}>{text}</text>
            <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="#4C626A" />
              <stop offset="0.16" stopColor="#F6FFFF" />
              <stop offset="0.38" stopColor="#A9BFC3" />
              <stop offset="0.52" stopColor="#FFFFFF" />
              <stop offset="0.64" stopColor="#6A858D" />
              <stop offset="0.82" stopColor="#D7E8EA" />
              <stop offset="1" stopColor="#49626C" />
            </linearGradient>
            <linearGradient id={`${id}-shine`}>
              <stop offset="0" stopColor="white" stopOpacity="0" />
              <stop offset="0.45" stopColor="white" stopOpacity="0.1" />
              <stop offset="0.55" stopColor="white" stopOpacity="1" />
              <stop offset="0.68" stopColor="#E1FFFF" stopOpacity="0.55" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <filter id={`${id}-bevel`} x="-15%" y="-25%" width="130%" height="150%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="bump" />
              <feSpecularLighting in="bump" surfaceScale="2" specularConstant="1" specularExponent="22" lightingColor="white" result="light">
                <fePointLight x="-10" y="-30" z="40" />
              </feSpecularLighting>
              <feComposite in="light" in2="SourceAlpha" operator="in" />
            </filter>
            <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="-5%" y="-10%" width="110%" height="120%">
              <use href={`#${id}-letters`} fill="white" />
            </mask>
          </defs>
          <use href={`#${id}-letters`} fill={`url(#${id}-body)`} stroke="#4D646D" strokeWidth="0.7" strokeLinejoin="round" paintOrder="stroke fill" />
          <use href={`#${id}-letters`} fill="white" filter={`url(#${id}-bevel)`} opacity="0.85" />
          <use href={`#${id}-letters`} fill="none" stroke="white" strokeWidth="0.3" opacity="0.7" transform="translate(-0.25 -0.4)" />
          <g mask={`url(#${id}-mask)`}>
            <g data-glass-shine opacity="0">
              <rect width="70%" height="100%" fill={`url(#${id}-shine)`} />
            </g>
          </g>
        </svg>
      </span>
    </span>
  );
}
