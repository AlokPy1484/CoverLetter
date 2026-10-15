"use client";

import { Fragment, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import XFormerlyTwitter from "@thesvg/react/x-formerly-twitter";
import Linkedin from "@thesvg/react/linkedin";
import Github from "@thesvg/react/github";
import { InlineVideo } from "./project-video";
import { BeardMascot } from "./beard-mascot";
import { GlassText } from "./glass-text";
import { FunctionalTechText } from "./functional-tech-text";
import { SmoothGradientText } from "./smooth-gradient-text";
import { IntuitiveFuzzyText } from "./intuitive-fuzzy-text";
import { AwesomeGlitchText } from "./awesome-glitch-text";
import { ConveyorCard } from "./conveyor-card";
import { animateInlineLayout } from "./inline-layout-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export function ScrollRevealSequence({ children, className }: {
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP((_context, contextSafe) => {
    const container = containerRef.current;
    if (!container || !contextSafe) return;

    const media = gsap.matchMedia();
    let cancelled = false;
    const canvas = document.createElement("canvas");
    const measuringContext = canvas.getContext("2d");
    const alignCrowns = () => {
      if (!measuringContext) return;
      container.querySelectorAll<HTMLElement>("[data-crown-word]").forEach(word => {
        const baseline = word.querySelector<HTMLElement>("[data-crown-baseline]");
        if (!baseline) return;
        const style = getComputedStyle(word);
        measuringContext.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const metrics = measuringContext.measureText(word.dataset.crownWord || "great");
        const baselineOffset = baseline.getBoundingClientRect().top - word.getBoundingClientRect().top;
        const inkTop = baselineOffset - metrics.actualBoundingBoxAscent;
        word.style.setProperty("--crown-ink-top", `${inkTop}px`);
      });
      container.querySelectorAll<HTMLElement>("[data-inline-player]").forEach(player => {
        const word = player.parentElement?.querySelector<HTMLElement>("[data-inline-video-word]");
        if (!word) return;
        const style = getComputedStyle(word);
        measuringContext.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const metrics = measuringContext.measureText(word.textContent || "UI/UX");
        // An inline-block's bottom is its baseline. Raise/lower that baseline
        // so the frame's center matches the glyph ink, not the font x-height.
        const alignment = (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent - player.offsetHeight) / 2;
        player.style.setProperty("--inline-player-align", `${alignment}px`);
      });
      container.querySelectorAll<HTMLElement>("[data-conveyor-card]").forEach(card => {
        const paragraph = card.closest("p");
        if (!paragraph) return;
        const style = getComputedStyle(paragraph);
        measuringContext.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const metrics = measuringContext.measureText("life");
        const alignment = (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent - card.offsetHeight) / 2;
        card.style.setProperty("--conveyor-card-align", `${alignment}px`);
      });
      container.querySelectorAll<HTMLElement>("[data-glass-word]").forEach(word => {
        const svg = word.querySelector<SVGSVGElement>("[data-glass-svg]");
        const letters = word.querySelector<SVGTextElement>("[data-glass-lettering]");
        const baseline = word.querySelector<HTMLElement>("[data-glass-baseline]");
        if (!svg || !letters || !baseline) return;
        const box = word.getBoundingClientRect();
        svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
        letters.setAttribute("y", `${baseline.getBoundingClientRect().top - box.top}`);
        letters.setAttribute("textLength", `${box.width}`);
        letters.setAttribute("lengthAdjust", "spacingAndGlyphs");
      });
      container.querySelectorAll<HTMLElement>("[data-tech-word]").forEach(word => {
        const paragraph = word.closest("p");
        const overlay = paragraph?.querySelector<HTMLElement>("[data-tech-overlay]");
        const baseline = word.querySelector<HTMLElement>("[data-tech-baseline]");
        if (!paragraph || !overlay || !baseline) return;
        const box = word.getBoundingClientRect();
        const parent = paragraph.getBoundingClientRect();
        overlay.style.left = `${box.left - parent.left}px`;
        overlay.style.top = `${box.top - parent.top}px`;
        overlay.style.width = `${box.width}px`;
        overlay.style.height = `${box.height}px`;
        overlay.style.setProperty("--tech-baseline", `${baseline.getBoundingClientRect().top - box.top}px`);
      });
      container.querySelectorAll<HTMLElement>("[data-gradient-word]").forEach(word => {
        const paragraph = word.closest("p");
        const overlay = paragraph?.querySelector<HTMLElement>("[data-gradient-overlay]");
        if (!paragraph || !overlay) return;
        const box = word.getBoundingClientRect();
        const parent = paragraph.getBoundingClientRect();
        overlay.style.left = `${box.left - parent.left}px`;
        overlay.style.top = `${box.top - parent.top}px`;
        overlay.style.width = `${box.width}px`;
        overlay.style.height = `${box.height}px`;
      });
      container.querySelectorAll<HTMLElement>("[data-fuzzy-word]").forEach(word => {
        const paragraph = word.closest("p");
        const overlay = paragraph?.querySelector<HTMLElement>("[data-fuzzy-overlay]");
        if (!paragraph || !overlay) return;
        const box = word.getBoundingClientRect();
        const parent = paragraph.getBoundingClientRect();
        overlay.style.left = `${box.left - parent.left}px`;
        overlay.style.top = `${box.top - parent.top}px`;
        overlay.style.width = `${box.width}px`;
        overlay.style.height = `${box.height}px`;
      });
      container.querySelectorAll<HTMLElement>("[data-glitch-word]").forEach(word => {
        const paragraph = word.closest("p");
        const overlay = paragraph?.querySelector<HTMLElement>("[data-glitch-overlay]");
        if (!paragraph || !overlay) return;
        const box = word.getBoundingClientRect();
        const parent = paragraph.getBoundingClientRect();
        overlay.style.left = `${box.left - parent.left}px`;
        overlay.style.top = `${box.top - parent.top}px`;
        overlay.style.width = `${box.width}px`;
        overlay.style.height = `${box.height}px`;
      });
    };
    const refreshFontLayout = () => {
      alignCrowns();
      ScrollTrigger.refresh();
    };
    const initialize = contextSafe(() => {
      media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1024px)" }, context => {
        if (!context.conditions?.motion) return;
        const desktop = Boolean(context.conditions.desktop);
        const paragraphs = Array.from(
          container.querySelectorAll<HTMLElement>("[data-scroll-reveal]"),
        );
        const paragraphLabels = paragraphs.map(element => element.getAttribute("aria-label") || "");
        const splits = paragraphs.map(element => SplitText.create(element, {
          type: desktop ? "chars" : "words,chars",
          tag: "span",
          smartWrap: false,
          reduceWhiteSpace: false,
          aria: "auto",
          charsClass: "scroll-reveal-char",
          wordsClass: "scroll-reveal-word",
          ignore: "[data-crown], [data-crown-baseline], [data-extra-ws], [data-inline-player], [data-conveyor-card], [data-opportunity-slot], [data-glass-overlay], [data-glass-baseline], [data-tech-baseline], [data-fuzzy-baseline]",
        }));
        // Decorative SVG lettering duplicates the phrase visually, but the
        // accessible paragraph should announce its original text only once.
        paragraphs.forEach((element, index) => element.setAttribute("aria-label", paragraphLabels[index]));
        const stopLayoutMotion = desktop ? undefined : animateInlineLayout(paragraphs);

        // Inline spans keep the original wrapping, including nonbreaking spaces.
        gsap.set(splits.flatMap(split => split.chars), {
          display: "inline",
          opacity: 0.2,
        });
        gsap.set(container.querySelectorAll("[data-extra-ws]"), { width: 0, opacity: 0 });
        gsap.set(container.querySelectorAll("[data-inline-player]"), { width: 0, marginLeft: 0, opacity: 0, scale: desktop ? 0.95 : 0 });
        const staggeredIcons = container.querySelectorAll<HTMLElement>("[data-avatar], [data-social-icon]");
        gsap.set(staggeredIcons, { opacity: 0, x: -24 });
        gsap.set(container.querySelectorAll("[data-social-icon]"), { rotation: -25 });
        const crowns = container.querySelectorAll<HTMLElement>("[data-crown]");
        gsap.set(crowns, { opacity: 0, y: -12 });
        gsap.set(container.querySelectorAll("[data-conveyor-card]"), { autoAlpha: 0, scale: 0 });
        gsap.set(container.querySelectorAll("[data-opportunity-icon]"), { autoAlpha: 0, scale: 0, transformOrigin: "50% 70%" });
        gsap.set(container.querySelectorAll("[data-opportunity-slot]"), { width: 0, marginLeft: 0 });
        const projectAnchor = container.querySelector<HTMLElement>("[data-project-anchor]");
        const projectStage = container.querySelector<HTMLElement>("[data-project-stage]");
        const projectTarget = container.querySelector<HTMLElement>("[data-project-target]");
        const projectFrame = container.querySelector<HTMLElement>("[data-project-frame]");
        const projectSurface = container.querySelector<HTMLElement>("[data-project-surface]");
        const projectSides = Array.from(container.querySelectorAll<HTMLElement>("[data-project-side]"));
        // Measure stationary slots, never the animated frame. Functions are
        // reevaluated on refresh so resizing cannot accumulate transform errors.
        const projectGeometry = () => {
          const anchor = projectAnchor!.getBoundingClientRect();
          const target = projectTarget!.getBoundingClientRect();
          return { x: anchor.left - target.left, y: anchor.top - target.top, width: anchor.width, height: anchor.height };
        };
        if (projectAnchor && projectTarget && projectFrame && projectSurface) {
          gsap.set(projectFrame, {
            x: () => projectGeometry().x, y: () => projectGeometry().y,
            width: () => projectGeometry().width, height: () => projectGeometry().height,
            autoRound: false,
          });
          gsap.set(projectSurface, { opacity: 0, scale: 0.95 });
          gsap.set(projectSides, { opacity: 0 });
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 0,
            end: () => Math.max(1, ScrollTrigger.maxScroll(window)),
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        const triggeredAnimations: { animation: gsap.core.Timeline; startsAt: number; reset?: () => void }[] = [];

        splits.forEach((split, index) => {
          const crown = paragraphs[index].querySelector<HTMLElement>("[data-crown]");
          const wordChars = paragraphs[index].querySelectorAll<HTMLElement>("[data-crown-word] .scroll-reveal-char");
          const lastWordChar = wordChars.item(wordChars.length - 1);
          const wordEnd = lastWordChar ? split.chars.indexOf(lastWordChar) + 1 : 0;
          const inlinePlayer = paragraphs[index].querySelector<HTMLElement>("[data-inline-player]");
          const inlineWordChars = paragraphs[index].querySelectorAll<HTMLElement>("[data-inline-video-word] .scroll-reveal-char");
          const lastInlineChar = inlineWordChars.item(inlineWordChars.length - 1);
          const inlineWordEnd = lastInlineChar ? split.chars.indexOf(lastInlineChar) + 1 : 0;
          const expandingWord = paragraphs[index].querySelector<HTMLElement>("[data-expanding-word]");
          const firstA = expandingWord?.querySelector<HTMLElement>(".scroll-reveal-char");
          const extraWs = expandingWord?.querySelector<HTMLElement>("[data-extra-ws]");
          const glassOriginal = paragraphs[index].querySelector<HTMLElement>("[data-glass-original]");
          const firstGlassChar = glassOriginal?.querySelector<HTMLElement>(".scroll-reveal-char");
          const glassOverlay = paragraphs[index].querySelector<HTMLElement>("[data-glass-overlay]");
          const glassShine = paragraphs[index].querySelector<SVGGElement>("[data-glass-shine]");
          const techOriginal = paragraphs[index].querySelector<HTMLElement>("[data-tech-original]");
          const techChars = techOriginal?.querySelectorAll<HTMLElement>(".scroll-reveal-char");
          const lastTechChar = techChars?.item(techChars.length - 1);
          const techOverlay = paragraphs[index].parentElement?.querySelector<HTMLElement>("[data-tech-overlay]");
          const gradientOriginal = paragraphs[index].querySelector<HTMLElement>("[data-gradient-original]");
          const gradientChars = gradientOriginal?.querySelectorAll<HTMLElement>(".scroll-reveal-char");
          const lastGradientChar = gradientChars?.item(gradientChars.length - 1);
          const gradientOverlay = paragraphs[index].parentElement?.querySelector<HTMLElement>("[data-gradient-overlay]");
          const fuzzyOriginal = paragraphs[index].querySelector<HTMLElement>("[data-fuzzy-original]");
          const fuzzyChars = fuzzyOriginal?.querySelectorAll<HTMLElement>(".scroll-reveal-char");
          const lastFuzzyChar = fuzzyChars?.item(fuzzyChars.length - 1);
          const fuzzyOverlay = paragraphs[index].parentElement?.querySelector<HTMLElement>("[data-fuzzy-overlay]");
          const glitchOriginal = paragraphs[index].querySelector<HTMLElement>("[data-glitch-original]");
          const glitchChars = glitchOriginal?.querySelectorAll<HTMLElement>(".scroll-reveal-char");
          const lastGlitchChar = glitchChars?.item(glitchChars.length - 1);
          const glitchOverlay = paragraphs[index].parentElement?.querySelector<HTMLElement>("[data-glitch-overlay]");
          const conveyorCard = paragraphs[index].querySelector<HTMLElement>("[data-conveyor-card]");
          const conveyorChars = paragraphs[index].querySelectorAll<HTMLElement>("[data-conveyor-word] .scroll-reveal-char");
          const lastConveyorChar = conveyorChars.item(conveyorChars.length - 1);
          const opportunityIcon = paragraphs[index].querySelector<HTMLElement>("[data-opportunity-icon]");
          const opportunitySlot = paragraphs[index].querySelector<HTMLElement>("[data-opportunity-slot]");
          const opportunityChars = paragraphs[index].querySelectorAll<HTMLElement>("[data-opportunity-word] .scroll-reveal-char");
          const lastOpportunityChar = opportunityChars.item(opportunityChars.length - 1);
          const reveal = (characters: Element[]) => {
            if (!characters.length) return;
            const startsAt = timeline.duration();
            timeline.to(characters, {
              opacity: 1,
              duration: 1,
              stagger: { each: 0.08, from: "start" },
              ease: "none",
            });
            const conveyorCharIndex = lastConveyorChar ? characters.indexOf(lastConveyorChar) : -1;
            const opportunityCharIndex = lastOpportunityChar ? characters.indexOf(lastOpportunityChar) : -1;
            if (opportunityIcon && opportunitySlot && opportunityCharIndex >= 0) {
              // Clear the text before the icon entrance can expand into it.
              const arrival = gsap.timeline({ paused: true });
              const slotSize = {
                width: () => Number.parseFloat(getComputedStyle(opportunitySlot).height),
                marginLeft: 8,
              };
              if (desktop) {
                arrival.to(opportunitySlot, { ...slotSize, duration: 0.12, ease: "power2.out", autoRound: false }, 0);
              } else {
                // Reserve the final width immediately: one fast FLIP movement,
                // then reveal the icon after the words have reached their slots.
                arrival.set(opportunitySlot, { ...slotSize, immediateRender: false }, 0.001);
              }
              arrival.to(opportunityIcon, {
                scale: 1, autoAlpha: 1, duration: desktop ? 0.7 : 0.3,
                ease: desktop ? "back.out(1.2)" : "power1.inOut",
              }, desktop ? 0.12 : 0.2);
              triggeredAnimations.push({ animation: arrival, startsAt: startsAt + opportunityCharIndex * 0.08 + 1 });
            }
            if (conveyorCard && conveyorCharIndex >= 0) {
              const reset = () => {
                gsap.set(conveyorCard, { pointerEvents: "none" });
                conveyorCard.dispatchEvent(new Event("conveyor:reset", { bubbles: true }));
              };
              const arrival = gsap.timeline({ paused: true });
              arrival.to(conveyorCard, {
                scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.4)",
                onComplete: () => {
                  gsap.set(conveyorCard, { pointerEvents: "auto" });
                  conveyorCard.dispatchEvent(new Event("conveyor:play", { bubbles: true }));
                },
                onReverseComplete: reset,
              });
              triggeredAnimations.push({ animation: arrival, startsAt: startsAt + conveyorCharIndex * 0.08 + 1, reset });
            }
            const glitchCharIndex = lastGlitchChar ? characters.indexOf(lastGlitchChar) : -1;
            if (glitchOriginal && glitchOverlay && glitchCharIndex >= 0) {
              const replacement = gsap.timeline({ paused: true });
              replacement.to(glitchOriginal, { opacity: 0, duration: 0.5, ease: "power1.inOut" });
              replacement.to(glitchOverlay, { opacity: 1, duration: 0.5, ease: "power1.inOut" }, "<");
              triggeredAnimations.push({ animation: replacement, startsAt: startsAt + glitchCharIndex * 0.08 + 1 });
            }
            const fuzzyCharIndex = lastFuzzyChar ? characters.indexOf(lastFuzzyChar) : -1;
            if (fuzzyOriginal && fuzzyOverlay && fuzzyCharIndex >= 0) {
              const replacement = gsap.timeline({ paused: true });
              replacement.to(fuzzyOriginal, { opacity: 0, duration: 0.5, ease: "power1.inOut" });
              replacement.to(fuzzyOverlay, { opacity: 1, pointerEvents: "auto", duration: 0.5, ease: "power1.inOut" }, "<");
              triggeredAnimations.push({ animation: replacement, startsAt: startsAt + fuzzyCharIndex * 0.08 + 1 });
            }
            const gradientCharIndex = lastGradientChar ? characters.indexOf(lastGradientChar) : -1;
            if (gradientOriginal && gradientOverlay && gradientCharIndex >= 0) {
              const replacement = gsap.timeline({ paused: true });
              replacement.to(gradientOriginal, { opacity: 0, duration: 0.5, ease: "power1.inOut" });
              replacement.to(gradientOverlay, { opacity: 1, duration: 0.5, ease: "power1.inOut" }, "<");
              triggeredAnimations.push({ animation: replacement, startsAt: startsAt + gradientCharIndex * 0.08 + 1 });
            }
            const techCharIndex = lastTechChar ? characters.indexOf(lastTechChar) : -1;
            if (techOriginal && techOverlay && techCharIndex >= 0) {
              const replacement = gsap.timeline({ paused: true });
              replacement.to(techOriginal, { opacity: 0, duration: 0.5, ease: "power1.inOut" });
              replacement.to(techOverlay, { opacity: 1, pointerEvents: "auto", duration: 0.5, ease: "power1.inOut" }, "<");
              triggeredAnimations.push({ animation: replacement, startsAt: startsAt + techCharIndex * 0.08 + 1 });
            }
            const glassCharIndex = firstGlassChar ? characters.indexOf(firstGlassChar) : -1;
            if (glassOriginal && glassOverlay && glassShine && glassCharIndex >= 0) {
              const glassAnimation = gsap.timeline({ paused: true });
              glassAnimation.to(glassOriginal, { opacity: 0, duration: 0.5, ease: "power1.inOut" });
              glassAnimation.to(glassOverlay, { opacity: 1, duration: 0.5, ease: "power1.inOut" }, "<");
              glassAnimation.fromTo(glassShine, { xPercent: -140, opacity: 0 }, { xPercent: 240, opacity: 1, duration: 0.8, ease: "power1.inOut" }, 0.3);
              glassAnimation.to(glassShine, { opacity: 0, duration: 0.15 }, 1.1);
              triggeredAnimations.push({ animation: glassAnimation, startsAt: startsAt + glassCharIndex * 0.08 });
            }
            const firstAIndex = firstA ? characters.indexOf(firstA) : -1;
            if (extraWs && firstAIndex >= 0) {
              // Match the first letter's stagger offset, rather than waiting
              // for the word (or paragraph) to finish. Width moves the suffix
              // continuously and reverses naturally when scrolling back.
              timeline.to(extraWs, {
                width: () => {
                  const style = getComputedStyle(extraWs);
                  if (!measuringContext) return Number.parseFloat(style.fontSize) * 1.6;
                  measuringContext.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
                  return measuringContext.measureText("ww").width;
                },
                opacity: 1,
                duration: 1,
                ease: "power2.inOut",
                autoRound: false,
              }, startsAt + firstAIndex * 0.08);
            }
          };
          // Append after the entire preceding tween, including its stagger.
          if (inlinePlayer && inlineWordEnd > 0) {
            reveal(split.chars.slice(0, inlineWordEnd));
            const arrival = gsap.timeline({ paused: true });
            const playerSize = {
              width: () => Number.parseFloat(getComputedStyle(inlinePlayer).getPropertyValue("--inline-player-width")),
              marginLeft: 10,
            };
            if (desktop) {
              arrival.to(inlinePlayer, { ...playerSize, opacity: 1, scale: 1, duration: 0.5, ease: "power2.inOut", autoRound: false, onUpdate: alignCrowns });
            } else {
              arrival.set(inlinePlayer, { ...playerSize, immediateRender: false }, 0.001);
              arrival.call(alignCrowns, [], 0.001);
              arrival.to(inlinePlayer, { opacity: 1, scale: 1, duration: 0.3, ease: "power1.inOut" }, 0.2);
            }
            triggeredAnimations.push({ animation: arrival, startsAt: timeline.duration() });
            timeline.to({}, { duration: arrival.duration() });
            reveal(split.chars.slice(inlineWordEnd));
          } else if (crown && wordEnd > 0) {
            reveal(split.chars.slice(0, wordEnd));
            timeline.to(crown, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
            reveal(split.chars.slice(wordEnd));
          } else {
            reveal(split.chars);
          }
          const paragraphIcons = paragraphs[index].parentElement?.querySelectorAll<HTMLElement>("[data-avatar], [data-social-icon]");
          if (paragraphIcons?.length) {
            timeline.to(paragraphIcons, {
              opacity: 1,
              x: 0,
              rotation: 0,
              duration: 0.7,
              stagger: 0.18,
              ease: "power2.out",
            });
          }
          if (paragraphs[index].parentElement?.querySelector("[data-project-anchor]") && projectAnchor && projectTarget && projectFrame && projectSurface) {
            if (!desktop && projectStage) {
              // A short, centered journey tied to this section's viewport position.
              const mobileCards = gsap.timeline({
                scrollTrigger: {
                  trigger: projectAnchor, start: "top 80%",
                  endTrigger: projectStage, end: "top 40%",
                  scrub: 0.35, invalidateOnRefresh: true,
                },
              });
              mobileCards.to(projectSurface, { opacity: 1, scale: 1, duration: 0.15, ease: "power2.out" });
              mobileCards.fromTo(projectFrame, {
                x: () => projectGeometry().x, y: () => projectGeometry().y,
                width: () => projectGeometry().width, height: () => projectGeometry().height,
              }, {
                x: 0, y: 0,
                width: () => projectTarget.getBoundingClientRect().width,
                height: () => projectTarget.getBoundingClientRect().height,
                duration: 0.65, ease: "power1.inOut", immediateRender: true, autoRound: false,
              });
              projectSides.forEach(side => {
                mobileCards.fromTo(side, {
                  x: () => (side.dataset.projectSide === "left" ? 1 : -1) * projectStage.getBoundingClientRect().width * 0.1,
                  rotation: 0, opacity: 0,
                }, {
                  x: 0, rotation: side.dataset.projectSide === "left" ? -3 : 3,
                  opacity: 1, duration: 0.35, ease: "power1.out", immediateRender: false,
                }, 0.6);
              });
              // Retain the text reveal's pacing while the cards use their own trigger.
              timeline.to({}, { duration: 9.5 });
              return;
            }
            const entrance = gsap.timeline({ paused: true }).to(projectSurface, {
              opacity: 1, scale: 1, duration: 0.45, ease: "power2.out",
            });
            triggeredAnimations.push({ animation: entrance, startsAt: timeline.duration() });
            timeline.to({}, { duration: 1.5 });
            const morphStart = timeline.duration();
            timeline.fromTo(projectFrame, {
              x: () => projectGeometry().x, y: () => projectGeometry().y,
              width: () => projectGeometry().width, height: () => projectGeometry().height,
            }, {
              x: 0, y: 0,
              width: () => projectTarget.getBoundingClientRect().width,
              height: () => projectTarget.getBoundingClientRect().height,
              duration: 8, ease: "none", immediateRender: true, autoRound: false,
            });
            projectSides.forEach(side => {
              timeline.fromTo(side, {
                x: () => (side.dataset.projectSide === "left" ? 1 : -1) * projectTarget.getBoundingClientRect().width * 0.43,
                rotation: 0, opacity: 0,
              }, {
                x: 0, rotation: side.dataset.projectSide === "left" ? -6.5 : 6.5,
                opacity: 1, duration: 3, ease: "power1.out", immediateRender: false,
              }, morphStart + 5);
            });
          }
        });

        triggeredAnimations.forEach(({ animation, startsAt, reset }) => {
          ScrollTrigger.create({
            trigger: container,
            start: () => {
              const master = timeline.scrollTrigger;
              if (!master) return 0;
              return master.start + (master.end - master.start) * startsAt / timeline.duration();
            },
            end: () => Math.max(1, ScrollTrigger.maxScroll(window)),
            animation,
            toggleActions: "play none none reverse",
            onLeaveBack: reset,
            onRefresh: trigger => {
              if (trigger.scroll() < trigger.start) {
                animation.pause(0);
                reset?.();
              }
              else if (!animation.isActive()) animation.play();
            },
          });
        });
        return () => stopLayoutMotion?.();
      });
      alignCrowns();
      window.addEventListener("resize", alignCrowns);
      document.fonts.addEventListener("loadingdone", refreshFontLayout);
    });

    // Split after font loading. Characters stay inline, so responsive reflow
    // needs no re-splitting; ScrollTrigger refreshes its range on resize.
    const refreshSiteLayout = () => {
      alignCrowns();
      ScrollTrigger.refresh();
    };
    window.addEventListener("site:refresh-layout", refreshSiteLayout);
    void document.fonts.ready.then(() => {
      if (!cancelled) {
        initialize();
        refreshSiteLayout();
        container.dataset.layoutReady = "true";
        window.dispatchEvent(new Event("site:layout-ready"));
      }
    });

    return () => {
      cancelled = true;
      delete container.dataset.layoutReady;
      window.removeEventListener("site:refresh-layout", refreshSiteLayout);
      window.removeEventListener("resize", alignCrowns);
      document.fonts.removeEventListener("loadingdone", refreshFontLayout);
      media.revert();
    };
  }, { scope: containerRef });

  return <main ref={containerRef} data-scroll-layout className={className}>{children}</main>;
}

export function ScrollRevealText({ as: Tag = "p", text, className, avatars = false, crownWord, projectVideo = false, socialIcons = false, inlineVideoAfter, inlineVideoContent, mascotAfter, glassWord, techWord, gradientWord, fuzzyWord, glitchWord, conveyorAfter, opportunityIcon = false, callIcon = false }: {
  as?: "h1" | "p";
  text: string;
  className?: string;
  avatars?: boolean;
  crownWord?: string;
  projectVideo?: boolean;
  socialIcons?: boolean;
  inlineVideoAfter?: string;
  inlineVideoContent?: "video" | "pong" | "website";
  mascotAfter?: string;
  glassWord?: string;
  techWord?: string;
  gradientWord?: string;
  fuzzyWord?: string;
  glitchWord?: string;
  conveyorAfter?: string;
  opportunityIcon?: boolean;
  callIcon?: boolean;
}) {
  const wordIndex = crownWord ? text.indexOf(crownWord) : -1;
  const inlineVideoIndex = inlineVideoAfter ? text.indexOf(inlineVideoAfter) : -1;
  const mascotIndex = mascotAfter ? text.indexOf(mascotAfter) : -1;
  const conveyorIndex = conveyorAfter ? text.indexOf(conveyorAfter) : -1;
  const conveyorEnd = conveyorIndex >= 0 && conveyorAfter ? conveyorIndex + conveyorAfter.length : -1;
  const conveyorWordStart = conveyorEnd >= 0 ? text.lastIndexOf(" ", conveyorEnd - 1) + 1 : -1;
  const renderPlainText = (value: string) => {
    const iconWord = callIcon ? "call" : "opportunity";
    const iconSrc = callIcon ? "/calendar-call.webp" : "/opportunity-travel.png";
    const opportunityIndex = opportunityIcon || callIcon ? value.indexOf(iconWord) : -1;
    if (opportunityIndex < 0) return withAnimatedWords(value, { techWord, gradientWord, fuzzyWord, glitchWord });
    return <>{value.slice(0, opportunityIndex)}<span data-layout-pair className="inline-block whitespace-nowrap"><span data-opportunity-word>{iconWord}</span><span data-opportunity-slot aria-hidden="true" className={`relative ml-[8px] inline-block ${callIcon ? "h-[1.7em] w-[1.7em] align-[-0.4em]" : "h-[1.15em] w-[1.15em] align-[-0.2em]"}`}><img data-opportunity-icon src={iconSrc} alt="" width={100} height={100} className="absolute left-0 top-0 h-full w-full max-w-none object-contain" /></span></span>{value.slice(opportunityIndex + iconWord.length)}</>;
  };
  if (mascotAfter && mascotIndex >= 0) {
    const suffix = text.slice(mascotIndex + mascotAfter.length);
    return (
      <Tag className={`relative ${className || ""}`}>
        <span data-static-intro>{text.slice(0, mascotIndex)}<span className="inline-block whitespace-nowrap">{mascotAfter}<BeardMascot /></span></span><span data-scroll-reveal aria-label={suffix}>{suffix}</span>
      </Tag>
    );
  }
  return (
    <Tag className={`relative ${className || ""}`}>
      <span data-scroll-reveal aria-label={text.replace("awwwsome", "awwwwwsome")}>
        {conveyorEnd >= 0 ? <>{text.slice(0, conveyorWordStart)}<span data-layout-pair className="inline-block whitespace-nowrap"><span data-conveyor-word>{text.slice(conveyorWordStart, conveyorEnd)}</span><ConveyorCard /></span>{text.slice(conveyorEnd)}</> : inlineVideoAfter && inlineVideoIndex >= 0 ? <>{renderPlainText(text.slice(0, inlineVideoIndex))}<span data-layout-pair className="inline-block whitespace-nowrap"><span data-inline-video-word>{inlineVideoAfter}</span><InlineVideo content={inlineVideoContent} /></span>{renderPlainText(text.slice(inlineVideoIndex + inlineVideoAfter.length))}</> : crownWord && wordIndex >= 0 ? <>{text.slice(0, wordIndex)}<span data-crown-word={crownWord} className="relative inline-block whitespace-nowrap">{crownWord}<span data-crown-baseline aria-hidden="true" className="inline-block h-0 w-0 align-baseline" /><Crown /></span>{renderPlainText(text.slice(wordIndex + crownWord.length))}</> : glassWord ? withGlassWord(text, glassWord) : renderPlainText(text)}
      </span>
      {techWord && text.includes(techWord) && <FunctionalTechText text={techWord} />}
      {gradientWord && text.includes(gradientWord) && <SmoothGradientText text={gradientWord} />}
      {fuzzyWord && text.includes(fuzzyWord) && <IntuitiveFuzzyText text={fuzzyWord} />}
      {glitchWord && text.includes(glitchWord) && <AwesomeGlitchText text={glitchWord} />}
      {avatars && <UserAvatars />}
      {socialIcons && <SocialIcons />}
      {projectVideo && <span aria-hidden="true" className="relative mx-auto mt-6 block aspect-video w-[clamp(112px,40%,177px)] lg:ml-[10px] lg:mr-0 lg:mt-0 lg:inline-block lg:aspect-auto lg:h-0 lg:w-[177px] lg:align-baseline"><span data-project-anchor className="pointer-events-none absolute left-0 top-0 block aspect-video w-full lg:top-[-60px]" /></span>}
    </Tag>
  );
}

function withAnimatedWords(text: string, { techWord, gradientWord, fuzzyWord, glitchWord }: {
  techWord?: string; gradientWord?: string; fuzzyWord?: string; glitchWord?: string;
}) {
  const matches = [
    { word: techWord, type: "tech" },
    { word: gradientWord, type: "gradient" },
    { word: fuzzyWord, type: "fuzzy" },
    { word: glitchWord, type: "glitch" },
  ].flatMap(({ word, type }) => {
    const index = word ? text.indexOf(word) : -1;
    return word && index >= 0 ? [{ word, type, index }] : [];
  }).sort((a, b) => a.index - b.index);
  if (!matches.length) return withExpandingAwesome(text);
  const result: ReactNode[] = [];
  let cursor = 0;
  matches.forEach(({ word, type, index }) => {
    result.push(<Fragment key={`prefix-${index}`}>{withExpandingAwesome(text.slice(cursor, index))}</Fragment>);
    result.push(type === "tech" ? (
      <span key={index} data-tech-word className="relative inline-block whitespace-nowrap"><span data-tech-original>{word}</span><span data-tech-baseline aria-hidden="true" className="inline-block h-0 w-0 align-baseline" /></span>
    ) : type === "gradient" ? (
      <span key={index} data-gradient-word className="inline-block whitespace-nowrap"><span data-gradient-original>{word}</span></span>
    ) : type === "fuzzy" ? (
      <span key={index} data-fuzzy-word className="inline-block whitespace-nowrap"><span data-fuzzy-original>{word}</span><span data-fuzzy-baseline aria-hidden="true" className="inline-block h-0 w-0 align-baseline" /></span>
    ) : (
      <span key={index} data-glitch-word className="inline-block whitespace-nowrap"><span data-glitch-original>{word}</span></span>
    ));
    cursor = index + word.length;
  });
  result.push(<Fragment key="suffix">{withExpandingAwesome(text.slice(cursor))}</Fragment>);
  return <>{result}</>;
}

function withGlassWord(text: string, word: string) {
  const index = text.indexOf(word);
  if (index < 0) return text;
  return <>{text.slice(0, index)}<GlassText text={word} />{text.slice(index + word.length)}</>;
}

function withExpandingAwesome(text: string) {
  const index = text.indexOf("awwwsome");
  if (index < 0) return text;
  return <>{text.slice(0, index)}<span data-expanding-word className="inline-block whitespace-nowrap">awww<span data-extra-ws aria-hidden="true" className="inline-block w-0 align-baseline opacity-0 [clip-path:inset(0)]">ww</span>some</span>{text.slice(index + "awwwsome".length)}</>;
}

function SocialIcons() {
  return (
    <span className="relative ml-[10px] inline-flex h-[40px] w-[100px] align-middle whitespace-normal sm:h-[55px] sm:w-[135px]">
      {[
        { icon: <XFormerlyTwitter variant="light" aria-hidden="true" className="h-5 w-5 sm:h-7 sm:w-7" />, label: "X / Twitter" },
        { icon: <Linkedin aria-hidden="true" className="h-5 w-5 sm:h-7 sm:w-7" />, label: "LinkedIn" },
        { icon: <Github aria-hidden="true" className="h-5 w-5 sm:h-7 sm:w-7" />, label: "GitHub" },
      ].map(({ icon, label }, index) => (
        <span
          key={label}
          data-social-icon
          role="img"
          aria-label={label}
          className={`absolute top-0 flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#D5D5D5] bg-white transition-[scale,translate] duration-200 ease-out hover:z-10 hover:scale-150 hover:-translate-y-[40%] motion-reduce:transition-none sm:h-[55px] sm:w-[55px] ${index === 0 ? "left-0" : index === 1 ? "left-[30px] sm:left-[40px]" : "left-[60px] sm:left-[80px]"}`}
        >
          {icon}
        </span>
      ))}
    </span>
  );
}

function Crown() {
  return (
    <span data-crown aria-hidden="true" className="pointer-events-none absolute left-[2.5%] block h-[var(--crown-height)] w-[95%] [--crown-height:32px] sm:[--crown-height:42px]" style={{ top: "calc(var(--crown-ink-top, 0px) - var(--crown-height))" }}>
      <img src="/crown-painted-v2.png" alt="" width={2079} height={756} className="block h-full w-full object-fill" />
    </span>
  );
}

// Three crops from the supplied illustration sheet, matching Paper's avatar fills.
const avatarCrops = [
  { position: "79.64% 90.19%", size: "644.43% 507.69%", border: "transparent" },
  { position: "59.82% 63.3%", size: "664.57% 523.81%", border: "#D5D5D5" },
  { position: "79.47% 10.11%", size: "664.57% 523.81%", border: "#DFDEDE" },
];

function UserAvatars() {
  return (
    <span aria-hidden="true" className="relative ml-[10px] inline-flex h-[40px] w-[80px] align-middle whitespace-normal sm:h-[55px] sm:w-[111px]">
      {avatarCrops.map((crop, index) => (
        <span
          key={crop.position}
          data-avatar
          className={`absolute top-0 block h-[40px] w-[40px] rounded-full border border-solid bg-white bg-no-repeat sm:h-[55px] sm:w-[55px] ${index === 0 ? "left-0" : index === 1 ? "left-[20px] sm:left-[28px]" : "left-[40px] sm:left-[56px]"}`}
          style={{
            backgroundImage: "url('/avatar-sheet.png')",
            backgroundPosition: crop.position,
            backgroundSize: crop.size,
            backgroundOrigin: "border-box",
            borderColor: crop.border,
          }}
        />
      ))}
    </span>
  );
}
