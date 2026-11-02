"use strict";

// Generated release values are inserted by tools/build_web.py. Never register
// this source template directly; a release only installs after every file has
// been downloaded and checked against its SHA-256 hash.
const BUILD_ID = "684fc93ada6dba86c38eae57";
const ASSETS = [{"url":"/sudoku/assets/AssetManifest.bin","sha256":"168dbe863ea8509d94928cc7c91c383e64a103f9d479b36cdefbc5e45a24fd0d","size":239},{"url":"/sudoku/assets/AssetManifest.bin.json","sha256":"fa9bbc796206113847c96e326845faf5fe5d472b235b8a86d73bde5fca1da4db","size":322},{"url":"/sudoku/assets/FontManifest.json","sha256":"c5bc89fffa25a6106de80133db5eaa5a0a2d2ecba8d765349b67e5649736252f","size":284},{"url":"/sudoku/assets/NOTICES","sha256":"edfd1e34c65b633717b6c952ee23405af56b6b7409f9756ac9319461cec55e89","size":1311025},{"url":"/sudoku/assets/assets/images/marsik.png","sha256":"aea5c8ac3fc20daa0c948d1b260953ae33038a68cd415303ac20627108ba7472","size":2270336},{"url":"/sudoku/assets/assets/images/miki.png","sha256":"40c3ea6c92f24accdf35b76a7110643e70fa0854e379a29a9a148f8a09dadb98","size":1461464},{"url":"/sudoku/assets/fonts/MaterialIcons-Regular.otf","sha256":"e86f3dca0a01c234893d713234e713bee4c48a81eefce7e4c737fce69363639f","size":10292},{"url":"/sudoku/assets/fonts/fallback/Roboto-Regular.ttf","sha256":"79e851404657dac2106b3d22ad256d47824a9a5765458edb72c9102a45816d95","size":171676},{"url":"/sudoku/assets/packages/cupertino_icons/assets/CupertinoIcons.ttf","sha256":"3d90c370aa4cf00dc57ee2b902f6652147c0f81e03e483df584a9c08b1687c9d","size":1472},{"url":"/sudoku/assets/shaders/ink_sparkle.frag","sha256":"2dca5ab93d4ec29e963f996f3916320ba60825e9537dfb149a68008c7a16b026","size":8890},{"url":"/sudoku/assets/shaders/stretch_effect.frag","sha256":"ab412f07a5b9b50b67a885b24dbe16929738ae28630407d6490c924caf0a3220","size":6737},{"url":"/sudoku/canvaskit/canvaskit.js","sha256":"bb559f6080c7d312ac2a912b4abec9f68ff3d3022d4a603c7796b9b31460642b","size":86987},{"url":"/sudoku/canvaskit/canvaskit.wasm","sha256":"2898c0795cf4a694e86ee3445c7414c2503fbcb46967154762f50ebde988da04","size":7284349},{"url":"/sudoku/flutter.js","sha256":"2beb1ce6b159c71540aa66030af1d7964b6a92377cc78473745e02f97b74effe","size":12136},{"url":"/sudoku/flutter_bootstrap.js","sha256":"f5f7f1e17cfb9e59544927142ca457722f8096282f72771d1009781554f7b4b3","size":13718},{"url":"/sudoku/icons/apple-touch-icon.png","sha256":"4223f4ed8e9c82acb678fa12046388119b7989b06ff39da3e3eb78d5dfe333b0","size":55853},{"url":"/sudoku/icons/icon-192.png","sha256":"6ce930638f8e4080ef392f139f435974efe1041f1f4cce3f8805994ed498cf46","size":63071},{"url":"/sudoku/icons/icon-512.png","sha256":"d412879032091be3730d90ea965d00ce0a8d60efbca293b39f0e87f729b4085a","size":410727},{"url":"/sudoku/index.html","sha256":"9b091bc6ef5a01cf345bb6f3fbd4b423bd704411ca0be5e9c2d30fa03967a010","size":2656},{"url":"/sudoku/main.dart.js","sha256":"66c8af39d83d4caa022424fc5686995d2d2881764bebb8c7c1ea3388b3508bc9","size":2408770},{"url":"/sudoku/manifest.json","sha256":"e7d8dd458b857fd2ad0e2862ee80290dd3b896cc703aa3683d6ecdd0883ed865","size":723},{"url":"/sudoku/pwa.js","sha256":"d8607e6b31f79b825cb4264d46485894a36b47bcb1d05b943e7411a38a2bdab4","size":7968},{"url":"/sudoku/shell.css","sha256":"266a1afb8a812a397049e9d70a567f8c1eb15e74724b77d2e2532268f1f40081","size":3182},{"url":"/sudoku/version.json","sha256":"5cc2193c301fe9f22f6249f487b36cd092a54552ee2b79b2a3304e0dd4db2359","size":82}];
const APP_PATH = "/sudoku/";
const CACHE_PREFIX = "crazyalarmclock-sudoku-precache-v1-";
const CACHE_NAME = CACHE_PREFIX + BUILD_ID;
const READY_PATH = `${APP_PATH}.offline-ready`;
const byPath = new Map(ASSETS.map((asset) => [asset.url, asset]));

function inScope(url) {
  return url.origin === self.location.origin && url.pathname.startsWith(APP_PATH);
}

async function announce(data) {
  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  for (const client of windows) {
    if (inScope(new URL(client.url))) {
      try { client.postMessage(data); } catch (_) { /* The window has closed. */ }
    }
  }
}

async function verifiedResponse(asset) {
  const url = new URL(asset.url, self.location.origin);
  // A unique query bypasses intermediary caches during a Pages rollout. If
  // the deploy is between versions, the hash fails and the old worker stays.
  url.searchParams.set("sudoku-release", BUILD_ID);
  url.searchParams.set("sha256", asset.sha256);
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), 45000);
  let response;
  let bytes;
  try {
    response = await fetch(url.href, {
      cache: "no-store",
      credentials: "same-origin",
      redirect: "error",
      signal: abort.signal,
    });
    if (!response.ok || response.type === "opaque") {
      throw new Error(`Cannot cache ${asset.url}: HTTP ${response.status}`);
    }
    bytes = await response.arrayBuffer();
  } finally {
    clearTimeout(timeout);
  }
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hash = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  if (hash !== asset.sha256 || bytes.byteLength !== asset.size) {
    throw new Error(`Release file does not match its manifest: ${asset.url}`);
  }
  const headers = new Headers(response.headers);
  // Fetch has already decompressed the body. Storing it with an old encoding
  // or compressed Content-Length would misdescribe the cached response.
  headers.delete("content-encoding");
  headers.set("content-length", String(bytes.byteLength));
  return new Response(bytes, { status: 200, headers });
}

async function completeCache() {
  if (!await caches.has(CACHE_NAME)) return false;
  const cache = await caches.open(CACHE_NAME);
  const marker = await cache.match(READY_PATH);
  if (!marker) return false;
  const paths = new Set((await cache.keys()).map((request) => new URL(request.url).pathname));
  return ASSETS.length > 0 && ASSETS.every((asset) => paths.has(asset.url));
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    if (BUILD_ID.startsWith("__") || !ASSETS.length) {
      throw new Error("Build the Sudoku release before installing its worker");
    }
    // A rollback can install the same release that an older active worker is
    // still serving while a different release waits. Reuse its complete cache.
    if (await completeCache()) return;
    const cacheExistedBeforeInstall = await caches.has(CACHE_NAME);
    const cache = await caches.open(CACHE_NAME);
    let nextIndex = 0;
    let completed = 0;
    try {
      // Two concurrent downloads bound memory while the wasm and artwork load.
      const download = async () => {
        while (nextIndex < ASSETS.length) {
          const asset = ASSETS[nextIndex++];
          await cache.put(asset.url, await verifiedResponse(asset));
          completed++;
          await announce({ type: "SUDOKU_CACHE_PROGRESS", buildId: BUILD_ID, completed, total: ASSETS.length });
        }
      };
      // Wait for both workers to settle before deleting a failed staging cache.
      const results = await Promise.allSettled([download(), download()]);
      const failed = results.find((result) => result.status === "rejected");
      if (failed) throw failed.reason;
      await cache.put(READY_PATH, new Response(JSON.stringify({ buildId: BUILD_ID, files: ASSETS.length }), {
        headers: { "content-type": "application/json" },
      }));
      // No skipWaiting: an existing game keeps the complete old release until
      // every window using it has closed. First installation activates normally.
    } catch (error) {
      // Never remove a cache that another worker may already be serving.
      if (!cacheExistedBeforeInstall) await caches.delete(CACHE_NAME);
      throw error;
    }
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    if (!await completeCache()) throw new Error("Incomplete Sudoku release cache");
    // Own cache prefix only. The portfolio and other applications share origin
    // storage, so never clear caches or unregister workers globally.
    for (const name of await caches.keys()) {
      if (name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME) await caches.delete(name);
    }
    await self.clients.claim();
    await announce({ type: "SUDOKU_CACHE_READY", buildId: BUILD_ID });
  })());
});

async function serveAsset(asset) {
  const cache = await caches.open(CACHE_NAME);
  const stored = await cache.match(asset.url);
  if (stored) return stored;
  // Recover an evicted file only if it is still exactly the running release;
  // never mix a newer Dart entrypoint into an older game session.
  try {
    const response = await verifiedResponse(asset);
    await cache.put(asset.url, response.clone());
    return response;
  } catch (_) {
    return new Response("Не удалось загрузить файл игры. Подключитесь к интернету и откройте судоку снова.", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || !inScope(url)) return;
  const asset = request.mode === "navigate"
    ? byPath.get(`${APP_PATH}index.html`)
    : byPath.get(url.pathname);
  if (asset) event.respondWith(serveAsset(asset));
  // Unknown requests are left to the browser. Only the generated allowlist is
  // cached, so unrelated URLs and responses can never enter this release.
});

let repairInProgress;
self.addEventListener("message", (event) => {
  const sourceURL = event.source?.url;
  if (!sourceURL || !inScope(new URL(sourceURL))) return;
  if (event.data?.type === "SUDOKU_STATUS" && event.ports[0]) {
    event.waitUntil((async () => {
      event.ports[0].postMessage({
        type: "SUDOKU_STATUS",
        buildId: BUILD_ID,
        complete: await completeCache(),
      });
    })());
  } else if (event.data?.type === "SUDOKU_REPAIR_CACHE") {
    // Repair browser-evicted files without disturbing a running game. Every
    // restored response still has to match this exact release's hash.
    repairInProgress ??= (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        let completed = 0;
        for (const asset of ASSETS) {
          if (!await cache.match(asset.url)) await cache.put(asset.url, await verifiedResponse(asset));
          completed++;
          await announce({ type: "SUDOKU_CACHE_PROGRESS", buildId: BUILD_ID, completed, total: ASSETS.length });
        }
        await cache.put(READY_PATH, new Response(JSON.stringify({ buildId: BUILD_ID, files: ASSETS.length }), {
          headers: { "content-type": "application/json" },
        }));
        await announce({ type: "SUDOKU_CACHE_READY", buildId: BUILD_ID });
      } catch (_) {
        await announce({ type: "SUDOKU_CACHE_FAILED", buildId: BUILD_ID });
      } finally {
        repairInProgress = null;
      }
    })();
    event.waitUntil(repairInProgress);
  }
});
