import { test } from 'node:test';
import assert from 'node:assert/strict';
import { waitForSite } from '../src/lib/site-readiness.ts';

const tick = () => new Promise(resolve => setImmediate(resolve));
function image(complete = true, width = 100) {
  return Object.assign(new EventTarget(), { complete, naturalWidth: width, dataset: {}, decode: async () => {} });
}
function setup({ images = [], videos = [], frames = [], layout = { dataset: { layoutReady: 'true' } }, backgrounds = [] } = {}) {
  const urls = [];
  globalThis.window = new EventTarget();
  globalThis.location = { origin: 'https://test.local' };
  globalThis.document = { fonts: { ready: Promise.resolve(), load: () => Promise.resolve([]) } };
  globalThis.getComputedStyle = element => ({ backgroundImage: element.background });
  globalThis.Image = class extends EventTarget {
    complete = true; naturalWidth = 100; dataset = {};
    set src(url) { urls.push(url); }
    decode() { return Promise.resolve(); }
  };
  const root = {
    querySelector: () => layout,
    querySelectorAll: selector => ({ '*': backgrounds.map(background => ({ background })), img: images, video: videos, iframe: frames })[selector],
  };
  return { root, urls };
}

test('waits for layout, image decoding, video readiness and trusted iframe readiness', async () => {
  const img = image(false);
  let decoded;
  img.decode = () => new Promise(resolve => { decoded = resolve; });
  const video = Object.assign(new EventTarget(), { readyState: 0, poster: '/poster.jpg', error: null, load() { this.started = true; } });
  const frame = Object.assign(new EventTarget(), { dataset: {}, contentWindow: {} });
  const layout = { dataset: {} };
  const { root } = setup({ images: [img], videos: [video], frames: [frame], layout });
  let ready = false;
  const promise = waitForSite(root, new AbortController().signal).then(() => { ready = true; });
  await tick(); assert.equal(ready, false); assert.equal(video.started, undefined);
  layout.dataset.layoutReady = 'true'; window.dispatchEvent(new Event('site:layout-ready'));
  await tick(); assert.equal(video.started, true);
  img.complete = true; img.dispatchEvent(new Event('load'));
  video.readyState = 3; video.dispatchEvent(new Event('canplay'));
  window.dispatchEvent(Object.assign(new Event('message'), { origin: 'https://untrusted.test', source: frame.contentWindow, data: { type: 'conveyor-ready' } }));
  await tick(); assert.equal(ready, false);
  decoded();
  await tick(); assert.equal(ready, false);
  window.dispatchEvent(Object.assign(new Event('message'), { origin: location.origin, source: frame.contentWindow, data: { type: 'conveyor-ready' } }));
  await promise; assert.equal(ready, true);
});

test('handles cached resources, CSS backgrounds and an iframe ready before hydration', async () => {
  const frame = Object.assign(new EventTarget(), { dataset: {}, contentDocument: { documentElement: { dataset: { conveyorReady: 'true' } } } });
  const { root, urls } = setup({ images: [image()], frames: [frame], backgrounds: ['url("/mascot-directions.webp"), url("/mascot-reactions.webp")'] });
  await waitForSite(root, new AbortController().signal);
  assert.deepEqual(urls, ['/mascot-directions.webp', '/mascot-reactions.webp']);
});

test('broken images and videos settle so the page can display fallbacks', async () => {
  const img = image(false, 0);
  const video = Object.assign(new EventTarget(), { readyState: 0, poster: '', error: null, load() {} });
  const { root } = setup({ images: [img], videos: [video] });
  const promise = waitForSite(root, new AbortController().signal);
  await tick();
  img.dispatchEvent(new Event('error')); video.dispatchEvent(new Event('error'));
  await promise;
  assert.equal(img.dataset.assetUnavailable, 'true');
});

test('aborting pending resources releases the loading gate', async () => {
  const { root } = setup({ images: [image(false)], frames: [Object.assign(new EventTarget(), { dataset: {} })] });
  const controller = new AbortController();
  const promise = waitForSite(root, controller.signal);
  await tick(); controller.abort();
  await promise;
});
