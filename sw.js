// Pixel Krypta service worker: network first (updates land right away), cache as an offline fallback.
// 09z7: game.js / krypta.css / lang-en.js go with ?v=GAME_VER; offline they are found without the query too (ignoreSearch).
// Only same-origin GETs are handled (fonts and supabase-js are same-origin since 09y and get cached); Supabase API goes straight to the network.
const CACHE='krypta-v4';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./game.js','./krypta.css','./manifest.webmanifest','./icon-192.png','./vendor/supabase-2.45.4.js'])).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  // no-cache = always revalidate with the server (GitHub Pages sends max-age=600, so a plain fetch could serve a 10 min old game)
  e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.delete(r,{ignoreSearch:true}).then(()=>c.put(r,cp))).catch(()=>{}); // one copy per file, old ?v= versions are dropped}return res;})
    .catch(()=>caches.match(r).then(m=>m||caches.match(r,{ignoreSearch:true})).then(m=>m||(r.mode==='navigate'?caches.match('./index.html'):undefined))));});
