// Trip PWA service worker — offline shell + map tiles + self-update.
// Ships UNENCRYPTED next to the HTML (must NOT be staticrypt-wrapped).
//
// Self-update: skipWaiting + clients.claim means a newly-published sw.js takes over immediately;
// the page reloads once on controllerchange to pick up the fresh shell. Navigation is network-first,
// so an online open always fetches the latest app; the cache is only a fallback for dead zones.
//
// Bump VERSION to force-drop every cached tile / Leaflet / font (old caches are deleted on activate).
const VERSION='v2';   // bump forces stale caches to clear + a one-time reload to the fixed build
const CACHE='trip-'+VERSION, MAX=3000, TRIM=200, NET_TIMEOUT=4000;

self.addEventListener('install', ()=>self.skipWaiting());
self.addEventListener('activate', e=>e.waitUntil((async()=>{
  const names=await caches.keys();
  await Promise.all(names.filter(n=>n.startsWith('trip-') && n!==CACHE).map(n=>caches.delete(n)));
  await self.clients.claim();
})()));

self.addEventListener('fetch', e=>{
  const req=e.request;
  if(req.method!=='GET') return;

  // App shell / HTML: network-first so an updated site shows on the next open. Falls back to cache
  // (and keeps refreshing it in the background) when the signal is slow or gone — Big Sur / Lassen have none.
  if(req.mode==='navigate'){
    e.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      const net=fetch(req).then(r=>{ cache.put(req, r.clone()); return r; });
      const cached=await cache.match(req);
      if(!cached) return net.catch(()=>Response.error());   // first-ever load must reach the network
      // ponytail: 4s ceiling — prefer fresh, don't hang on flaky signal; net still updates the cache for next open.
      return Promise.race([ net.catch(()=>cached), new Promise(res=>setTimeout(()=>res(cached), NET_TIMEOUT)) ]);
    })());
    return;
  }

  // Tiles, Leaflet, fonts: cache-first (immutable, URL-versioned). Cached on first fetch.
  // Only cache genuine 200s — never an opaque/error response, or a failed tile would poison the
  // cache-first path forever. Everything we need offline is CORS (tiles crossOrigin, Leaflet SRI) or
  // same-origin (fonts, HTML), so res.ok is always observable here.
  e.respondWith(caches.open(CACHE).then(async cache=>{
    const hit=await cache.match(req);
    if(hit) return hit;
    const res=await fetch(req);
    if(res && res.ok){
      cache.put(req, res.clone());
      // ponytail: crude FIFO trim, LRU if it ever matters. ~3000 tiles ≈ 60 MB, within iOS quota.
      cache.keys().then(keys=>{ if(keys.length>MAX) for(let i=0;i<TRIM;i++) cache.delete(keys[i]); });
    }
    return res;
  }).catch(()=>caches.match(req)));
});
