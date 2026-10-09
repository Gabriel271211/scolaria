const CACHE = 'scolaria-v7';
/* Cache de donnees (controles + rappels deja envoyes) : jamais supprime aux mises a jour */
const DATA = 'scolaria-data';
const API_HOSTS = ['groq.com', 'supabase.co', 'googleapis.com', 'anthropic.com', 'generativelanguage'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './scolaria-home-v2.html', './annales-data.js', './manifest.json', './icons/icon-192.png', './icons/icon-512.png']).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== DATA).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (API_HOSTS.some(h => e.request.url.includes(h))) return;
  e.respondWith(
    fetch(e.request).then(resp => {
      if (resp.ok) {
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone)).catch(() => {});
      }
      return resp;
    }).catch(() => caches.match(e.request))
  );
});

/* ══ RAPPELS DES CONTROLES (Veille de controle) ══
   La page copie ses controles (avec rappels) dans DATA/__ctrl.json.
   checkCtrl() est lance : par la page (message 'ctrl-check', a l'ouverture
   puis toutes les 10 min) et en arriere-plan par Chrome (periodicsync). */
const dataUrl = name => new URL(name, self.registration.scope).href;
const ymd = d => d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);

function dueReminders(c, now) {
  const p = c.date.split('-');
  const day = new Date(+p[0], +p[1] - 1, +p[2]);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((day - today) / 864e5);
  const h = now.getHours();
  const suj = (c.sujets && c.sujets.length) ? c.sujets.join(', ') : '';
  const planDay = Array.isArray(c.plan) ? c.plan.find(d => d.date === ymd(now)) : null;
  const out = [];
  if (diff === 0 && h >= 7) {
    let avant = true;
    if (c.heure) { const t = c.heure.split(':'); avant = h * 60 + now.getMinutes() < (+t[0]) * 60 + (+t[1]); }
    if (avant) out.push({ key: c.id + '-jour', title: 'Contrôle de ' + c.mat + ' aujourd\'hui',
      body: (c.heure ? 'À ' + c.heure.replace(':', 'h') + '. ' : '') + (suj ? 'Dernier coup d\'œil : ' + suj + '. ' : '') + 'Tu vas gérer 💪' });
  } else if (diff === 1 && h >= 17) {
    out.push({ key: c.id + '-veille', title: 'Contrôle de ' + c.mat + ' demain',
      body: planDay ? 'Révision du soir : ' + planDay.titre : (suj ? 'Révise : ' + suj : 'Dernière révision ce soir !') });
  } else if (diff >= 2 && h >= 17 && planDay) {
    out.push({ key: c.id + '-rev-' + ymd(now), title: 'Révision : ' + c.mat,
      body: 'Aujourd\'hui : ' + planDay.titre + ' (contrôle dans ' + diff + ' jours)' });
  }
  return out;
}

async function checkCtrl() {
  const cache = await caches.open(DATA);
  const r = await cache.match(dataUrl('__ctrl.json'));
  if (!r) return;
  let list = [];
  try { list = await r.json(); } catch (e) { return; }
  const sr = await cache.match(dataUrl('__ctrl_sent.json'));
  let sent = {};
  try { sent = sr ? await sr.json() : {}; } catch (e) { sent = {}; }
  const now = new Date();
  let changed = false;
  for (const c of list) {
    if (!c || !c.rappel || !c.date) continue;
    for (const n of dueReminders(c, now)) {
      if (sent[n.key]) continue;
      await self.registration.showNotification(n.title, {
        body: n.body, tag: n.key, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png',
        data: { id: c.id }
      });
      sent[n.key] = Date.now();
      changed = true;
    }
  }
  /* on oublie les rappels envoyes il y a plus de 30 jours */
  for (const k in sent) if (Date.now() - sent[k] > 30 * 864e5) { delete sent[k]; changed = true; }
  if (changed) await cache.put(dataUrl('__ctrl_sent.json'), new Response(JSON.stringify(sent), { headers: { 'Content-Type': 'application/json' } }));
}

self.addEventListener('message', e => {
  if (e.data === 'ctrl-check') e.waitUntil(checkCtrl());
});

self.addEventListener('periodicsync', e => {
  if (e.tag === 'ctrl-reminders') e.waitUntil(checkCtrl());
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const id = e.notification.data && e.notification.data.id;
  const url = dataUrl('scolaria-home-v2.html' + (id ? '?ctrl=' + id : ''));
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.indexOf(self.registration.scope) === 0 && 'focus' in c) {
          if (id) c.postMessage({ type: 'open-ctrl', id: id });
          return c.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
