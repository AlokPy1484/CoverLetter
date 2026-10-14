import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const page = await readFile(new URL("hairline-conveyor.html", root), "utf8");
const kernel = page.match(/<script id="hl-kernel">([\s\S]*?)<\/script>/)?.[1];
if (!kernel) throw new Error("The standalone conveyor page is missing its Hairline kernel.");
const figure = await readFile(new URL("conveyor.js", root), "utf8");

// Keep the original engine and figure unchanged; this host fits them to an inline card.
const card = `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Chaos to clarity conveyor</title>
<link rel="icon" href="data:,">
<style>
  html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: #fff; }
  #stage { position: absolute; left: 0; top: 50%; width: 100%; aspect-ratio: 5 / 4; transform: translateY(-50%); }
  #read { position: absolute; right: 7px; bottom: 5px; color: #6f6f78; pointer-events: none; font: 7px/1 ui-monospace, monospace; }
</style>
</head>
<body>
<div id="stage"></div>
<output id="read" aria-live="off"></output>
<script>${kernel}</script>
<script>
window.hairline = function (figure) {
  HL.inject(document);
  const stage = document.getElementById("stage");
  stage.setAttribute("data-hairline", figure.name);
  stage.setAttribute("role", "img");
  stage.setAttribute("aria-label", figure.means);
  const svg = HL.mk("svg", {viewBox: "0 0 400 320", "aria-hidden": "true"}, stage);
  const handle = figure.mount({stage, svg, read: document.getElementById("read"), managed: true}, figure.range[1]);
  const control = (event) => {
    if (event.source !== parent || event.origin !== location.origin || event.data?.type !== "conveyor-control") return;
    if (event.data.action === "play") handle.play();
    else if (event.data.action === "reset") handle.reset();
  };
  addEventListener("message", control);
  parent.postMessage({type: "conveyor-ready"}, location.origin);
  addEventListener("pagehide", () => {
    removeEventListener("message", control);
    handle.destroy();
  }, {once: true});
};
</script>
<script type="module">${figure}</script>
</body>
</html>`;

await mkdir(new URL("public/hairline/", root), { recursive: true });
await writeFile(new URL("public/hairline/conveyor-card.html", root), card);
