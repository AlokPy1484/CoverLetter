/** Wait for one browser resource, releasing every listener on settle/unmount. */
function resourceReady(
  target: EventTarget,
  events: string[],
  isReady: () => boolean,
  signal: AbortSignal,
) {
  return new Promise<void>(resolve => {
    const finish = () => {
      events.forEach(event => target.removeEventListener(event, finish));
      signal.removeEventListener("abort", finish);
      resolve();
    };
    if (signal.aborted || isReady()) return finish();
    events.forEach(event => target.addEventListener(event, finish, { once: true }));
    signal.addEventListener("abort", finish, { once: true });
    if (isReady()) finish();
  });
}

async function imageReady(image: HTMLImageElement, signal: AbortSignal) {
  image.loading = "eager";
  await resourceReady(image, ["load", "error"], () => image.complete, signal);
  if (signal.aborted) return;
  if (!image.naturalWidth) {
    image.dataset.assetUnavailable = "true";
    return;
  }
  await image.decode().catch(() => {});
}

function preloadImage(url: string, signal: AbortSignal) {
  const image = new Image();
  image.src = url;
  return imageReady(image, signal);
}

function frameReady(frame: HTMLIFrameElement, signal: AbortSignal) {
  frame.loading = "eager";
  return new Promise<void>(resolve => {
    const finish = () => {
      window.removeEventListener("message", onMessage);
      frame.removeEventListener("error", finish);
      signal.removeEventListener("abort", finish);
      resolve();
    };
    const onMessage = (event: MessageEvent) => {
      if (event.origin === location.origin && event.source === frame.contentWindow && event.data?.type === "conveyor-ready") finish();
    };
    window.addEventListener("message", onMessage);
    frame.addEventListener("error", finish, { once: true });
    signal.addEventListener("abort", finish, { once: true });
    let alreadyReady = frame.dataset.assetReady === "true";
    try {
      alreadyReady ||= frame.contentDocument?.documentElement.dataset.conveyorReady === "true";
    } catch { /* Cross-origin embeds must report readiness by message. */ }
    if (signal.aborted || alreadyReady) finish();
  });
}

export async function waitForSite(root: HTMLElement, signal: AbortSignal) {
  const layout = root.querySelector<HTMLElement>("[data-scroll-layout]");
  const layoutReady = layout ? resourceReady(window, ["site:layout-ready"], () => layout.dataset.layoutReady === "true", signal) : Promise.resolve();
  await Promise.allSettled([document.fonts.ready, document.fonts.load('400 48px "Caveat"'), layoutReady]);
  if (signal.aborted) return;
  // SplitText has finished modifying the inline DOM; collect the live nodes.
  // CSS backgrounds (including both mascot atlases) do not emit DOM load events.
  const backgrounds = new Set<string>();
  root.querySelectorAll<HTMLElement>("*").forEach(element => {
    const background = getComputedStyle(element).backgroundImage;
    for (const match of background.matchAll(/url\(["']?([^"')]+)["']?\)/g)) backgrounds.add(match[1]);
  });
  const images = [...root.querySelectorAll<HTMLImageElement>("img")];
  const videos = [...root.querySelectorAll<HTMLVideoElement>("video")];
  const posters = new Set(videos.map(video => video.poster).filter(Boolean));

  await Promise.allSettled([
    ...images.map(image => imageReady(image, signal)),
    ...[...backgrounds, ...posters].map(url => preloadImage(url, signal)),
    ...[...root.querySelectorAll<HTMLIFrameElement>("iframe")].map(frame => frameReady(frame, signal)),
    ...videos.map(video => {
      const ready = resourceReady(video, ["canplay", "error"], () => video.readyState >= 3 || !!video.error, signal);
      if (video.readyState < 3 && !video.error && !signal.aborted) {
        video.preload = "auto";
        video.load();
      }
      return ready;
    }),
  ]);
}
