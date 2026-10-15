import gsap from "gsap";

// Translate the wrapping group, not its animated children. The player's scale
// entrance uses a separate transform after the layout has made room.
export function animateInlineLayout(paragraphs: HTMLElement[]) {
  const elements = paragraphs.flatMap(paragraph => {
    if (!paragraph.querySelector("[data-layout-pair]")) return [];
    return Array.from(paragraph.querySelectorAll<HTMLElement>(".scroll-reveal-word, [data-layout-pair]"))
      .filter(element => !element.parentElement?.closest("[data-layout-pair]"));
  });
  const states = elements.map(element => {
    const display = element.style.display;
    // Non-replaced inline text cannot be translated. A word remains an atomic
    // wrapping unit, with the original whitespace still between word wrappers.
    element.style.display = "inline-block";
    return { element, display, x: 0, y: 0, initialized: false, animation: null as Animation | null };
  });

  const update = () => {
    // Read before writing to avoid a separate layout pass for every word.
    const measurements = states.map(state => {
      const translate = getComputedStyle(state.element).translate;
      const values = translate === "none" ? [] : translate.split(/\s+/).map(Number.parseFloat);
      const dx = values[0] || 0;
      const dy = values[1] || 0;
      const rect = state.element.getBoundingClientRect();
      return { x: rect.left + window.scrollX - dx, y: rect.top + window.scrollY - dy, dx, dy };
    });
    states.forEach((state, index) => {
      const next = measurements[index];
      if (state.initialized && (Math.abs(next.x - state.x) > 0.5 || Math.abs(next.y - state.y) > 0.5)) {
        const dx = state.x - next.x + next.dx;
        const dy = state.y - next.y + next.dy;
        state.animation?.cancel();
        state.animation = state.element.animate([
          { translate: `${dx}px ${dy}px` },
          { translate: "0px 0px" },
        ], { duration: 180, easing: "ease-out" });
      }
      state.x = next.x;
      state.y = next.y;
      state.initialized = true;
    });
  };

  update();
  gsap.ticker.add(update);
  return () => {
    gsap.ticker.remove(update);
    states.forEach(state => {
      state.animation?.cancel();
      state.element.style.display = state.display;
    });
  };
}
