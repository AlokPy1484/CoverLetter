# Alok page mascot

Created with the built-in image-generation tool from the user's supplied reference photograph. Integrated beside Alok's name in src/components/beard-mascot.tsx.

## Final prompt specifications

Directions: Matching 3×3 head-direction grid in detailed storybook chibi sticker style. Warm medium-brown skin, swept-up black quiff and small forehead lock, thick eyebrows, neatly connected black beard and moustache, large dark-brown eyes, black crew-neck T-shirt. Preserve likeness while discarding photographic realism. Uniform front-facing body, only head turns; viewer-relative up-left/up/up-right, left/centre/right, down-left/down/down-right. Small busts with wide transparent gutters; no symbols, borders or text. Genuine transparent alpha.

Reactions: Copy the corrected directions sheet's centre character, preserving palette, hair, beard, outlines, size and constant shoulder shape. All heads face forward. Nine expressions: blink, heart, sparkles, surprise, star eyes, blush, sleep, dizzy, delight. Keep symbols inside each cell and broad transparent margins.

## Assets and verification

- directions.png and reactions.png: final source sheets retained for rebuilding.
- directions-v1.png and reactions-v1.png: initial drafts retained.
- ../../public/mascots/alok-directions.webp and alok-reactions.webp: production atlases.
- portrait.png: centre-frame preview.
- page-preview.png: live page screenshot.

Skill build and verification passed: 0.00 rendered pixels of click movement, 82.7% palette match, 0.4% shoulder width change. Left and right head directions visually checked. Live pointer tracking and reaction layer switching checked. Project TypeScript check passed.

## Skin tone update — 15 October 2026

Recolored with the built-in image generation tool, using the user's `kamran-directions.webp` as a skin-color reference. The original source sheets are retained as `directions-before-tone.png` and `reactions-before-tone.png`.

Edit prompt specifications: Change only the skin across all nine frames to a softer golden peach tan matching the reference; reduce the orange-red cast. Preserve the mascot's likeness, hair, beard, eyes, black shirt, head directions, expressions, symbols, grid positions, and transparent margins. Use the corrected directions sheet as an additional palette reference for the reactions; retain subtle intentional blush marks. Do not copy the reference character's glasses.

Rebuilt both production atlases and checked them visually. Verification: genuine alpha, 0.39 rendered pixels of click movement at 140px display size, 78.8% palette match, and 0.3% shoulder width change. The component's asset URLs include a new version query to refresh cached images. TypeScript check passed.

Rebuild with `python scripts/build-mascot.py alok --anchor shoulders`. This local copy of the skill's atlas builder also removes faint disconnected scraps inside the cell gutters, retaining the character and reaction symbols.
