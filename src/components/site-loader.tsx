"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { waitForSite } from "@/lib/site-readiness";

const phrases = ["Curating the website", "Fetching ideas", "Connecting the dots", "Adding the finishing touches"];

export function SiteLoader({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const priorOverflow = useRef("");
  const [phase, setPhase] = useState<"loading" | "revealing" | "ready">("loading");
  const [hydrated, setHydrated] = useState(false);
  const [phrase, setPhrase] = useState(0);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const root = contentRef.current;
    if (!root) return;
    const controller = new AbortController();
    priorOverflow.current = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    let frame = 0;
    // Both frames allow image/font layout callbacks to settle before disclosure.
    void waitForSite(root, controller.signal).then(() => {
      if (controller.signal.aborted) return;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          if (!controller.signal.aborted) setPhase(current => current === "loading" ? "revealing" : current);
        });
      });
    });
    return () => {
      controller.abort();
      cancelAnimationFrame(frame);
      document.documentElement.style.overflow = priorOverflow.current;
    };
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    const interval = window.setInterval(() => setPhrase(current => (current + 1) % phrases.length), 1500);
    const slowTimer = window.setTimeout(() => setSlow(true), 10000);
    return () => { clearInterval(interval); clearTimeout(slowTimer); };
  }, [phase]);

  useEffect(() => {
    if (phase !== "revealing") return;
    window.dispatchEvent(new Event("site:refresh-layout"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      setPhase("ready");
      document.documentElement.style.overflow = priorOverflow.current;
      if (contentRef.current) contentRef.current.dataset.siteState = "ready";
      window.dispatchEvent(new Event("site:revealed"));
    }, reduced ? 0 : 300);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <>
      <div ref={contentRef} data-site-content data-site-state={phase} inert={hydrated && phase !== "ready"} aria-busy={phase !== "ready"}>
        {children}
      </div>
      {phase !== "ready" && (
        <div data-site-loader className={`site-loader ${phase === "revealing" ? "site-loader--leaving" : ""}`}>
          <div className="site-loader__center">
            <span className="site-loader__spinner" aria-hidden="true" />
            <span role="status" className="sr-only">Preparing the website. Please wait.</span>
            <span key={phrase} aria-hidden="true" className="site-loader__phrase">{phrases[phrase]}</span>
            {slow && <button type="button" className="site-loader__continue" onClick={() => setPhase("revealing")}>Continue to website</button>}
          </div>
        </div>
      )}
      <noscript><style>{`[data-site-content]{visibility:visible!important}[data-site-loader]{display:none!important}`}</style></noscript>
    </>
  );
}
