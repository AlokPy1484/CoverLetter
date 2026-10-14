# Animated five-bar chart

A 7-second, 1280 × 720 Remotion composition at 30 fps. Five mint bars rise in sequence with synchronized numeric counters and editable labels, values, colors, and timing.

Sample data: JAN 32, FEB 48, MAR 43, APR 68, MAY 92. The vertical scale runs from 0 to 100.

## Preview

```sh
npm install
npm run dev
```

Open `FiveBarChart` in Remotion Studio. Select a named bar in the timeline to edit its label, value, or color. Source: `src/Composition.tsx`.

## Validate

```sh
npm run lint
```

## Export when needed

```sh
npx remotion render src/index.ts FiveBarChart out/five-bar-chart.mp4
```
