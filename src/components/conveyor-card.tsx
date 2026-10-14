"use client";

import { useEffect, useId, useRef } from "react";

export function ConveyorCard() {
  const id = useId();
  const requestedAction = useRef<"play" | "reset">("reset");

  useEffect(() => {
    const selector = `[data-conveyor-id="${id}"]`;
    // SplitText can replace inline DOM. Resolve the live iframe and delegate
    // events instead of retaining refs to nodes from before the split.
    const frame = () => document.querySelector<HTMLIFrameElement>(`${selector} iframe`);
    const send = (action: "play" | "reset") => {
      requestedAction.current = action;
      frame()?.contentWindow?.postMessage({ type: "conveyor-control", action }, window.location.origin);
    };
    const belongsHere = (event: Event) => event.target instanceof HTMLElement && event.target.matches(selector);
    const play = (event: Event) => { if (belongsHere(event)) send("play"); };
    const reset = (event: Event) => { if (belongsHere(event)) send("reset"); };
    const ready = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === frame()?.contentWindow && event.data?.type === "conveyor-ready") {
        send(requestedAction.current);
      }
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => send(reduced.matches ? "play" : "reset");
    document.addEventListener("conveyor:play", play);
    document.addEventListener("conveyor:reset", reset);
    window.addEventListener("message", ready);
    reduced.addEventListener("change", updateMotion);
    updateMotion();
    return () => {
      document.removeEventListener("conveyor:play", play);
      document.removeEventListener("conveyor:reset", reset);
      window.removeEventListener("message", ready);
      reduced.removeEventListener("change", updateMotion);
    };
  }, [id]);

  return (
    <span
      data-conveyor-card
      data-conveyor-id={id}
      className="pointer-events-none invisible relative ml-[10px] inline-block aspect-video w-[177px] origin-center overflow-hidden rounded-xl border border-black/5 bg-white opacity-0 [transform:scale(0)] [vertical-align:var(--conveyor-card-align,middle)]"
    >
      <iframe
        src="/hairline/conveyor-card.html"
        title="Interactive conveyor turning an idea into a finished box"
        loading="lazy"
        className="absolute inset-0 h-full w-full border-0"
      />
    </span>
  );
}
