const C='cs-v10',F=['./','index.html','manifest.json','icon.svg'];
const LIBS=['https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js','https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/amiri/Amiri-Regular.ttf'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(F)))});
self.addEventListener('activate',e=>e.waitUntil(
 caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x))))
 .then(()=>caches.open(C).then(c=>Promise.allSettled(LIBS.map(u=>c.add(u)))))
 .then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.url.includes('googleapis.com'))return;
 const u=new URL(e.request.url);
 const doc=e.request.mode==='navigate'||u.pathname.endsWith('/index.html')||/\/cs-agent\/?$/.test(u.pathname);
 if(doc){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match('index.html'))));return}
 e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r})))});
