# Cover Letter

Next.js App Router, Tailwind CSS, and TypeScript implementation of the **Homepage** artboard in Paper's **Engaging quartz** file.

## Run

For the Vercel multi-service configuration and routing awaiting confirmation, see [VERCEL.md](./VERCEL.md).

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000.

```sh
npm run typecheck
npm run build
npm start
```

## Design fidelity

At a 1440px viewport, the page preserves the source's 2492px artboard height, #D4D4D4 background, 696px text blocks, 360px left offset (361px for the final block), 48px regular Geist type, exact text positions, and 130%/160% line heights. Original wording and nonbreaking spaces are preserved. Smaller screens use a flowing layout so paragraphs do not overlap.

The original source contains no portfolio URL or booking URL. Those lines remain text until destinations are supplied. The three avatars after “user” use the supplied illustration sheet in `public/avatar-sheet.png`, with crops matching the updated Paper artboard.

Source: https://app.paper.design/file/01M4KVVC7ZT2FTGSTEKCJKAM94/p-1-0

## Initial loading state

The small centered loader waits for fonts, decoded images (including CSS mascot
sprites), video posters, videos' `canplay` readiness, the conveyor's ready signal,
and scroll layout initialization. Video files need enough buffered data to start;
the gate does not require downloading every video in full. Content remains mounted
for measurement but hidden and inert until reveal. Hero entrance motion starts
after the 300ms loader fade. Reduced-motion users receive an immediate reveal.

Failed image/video requests settle to the existing card/poster fallbacks. After
10 seconds, visitors can choose “Continue to website” if a connection stalls.
Without JavaScript, the loader is hidden and the page text remains available.
Run `npm run test:loading` for resource-readiness regression tests (Node 22+).

## Scroll animation

`src/components/scroll-reveal-text.tsx` uses GSAP SplitText and ScrollTrigger through `@gsap/react`. Each paragraph's characters start at 20% opacity and brighten in reading order as scrolling progresses. Scrolling back reverses the reveal. All paragraphs share one scrubbed timeline spanning the available document scroll distance. Each paragraph starts only after every character of the previous paragraph reaches full opacity. After paragraph one finishes, the three avatars animate from `x: -24` and zero opacity to their final positions with a left-to-right stagger; paragraph two waits for that entrance to finish. Longer paragraphs receive more scroll distance based on their stagger duration.

Characters remain inline to preserve wrapping. SplitText handles accessible labels; initialization waits for fonts to load. Inline characters reflow naturally when the viewport changes. Reduced-motion users receive fully visible, unsplit text, as do users with JavaScript disabled. Animation instances are scoped and reverted on unmount.

The “write blogs” phrase crossfades into locally bundled Caveat handwriting after its last character finishes revealing. The note transformation plays on elapsed time after scrolling past the phrase’s complete-reveal position, so it finishes even when scrolling stops. Scrolling back before that position reverses it. The transformation is a handwriting crossfade only; the remaining text retains its scrubbed scroll interval. The original phrase reserves its layout width, and reduced-motion users see the completed note. Caveat is distributed under the SIL Open Font License; see `public/fonts/Caveat-OFL.txt`.
