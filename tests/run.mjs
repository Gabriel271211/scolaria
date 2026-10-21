#!/usr/bin/env node
/* ══ TESTS AUTOMATIQUES DE SCOLARIA ══
 *
 *   node tests/run.mjs              tout (environ 1 min)
 *   node tests/run.mjs --rapide     seulement les verifications du code, sans navigateur (2 s)
 *   node tests/run.mjs synchro      seulement les groupes dont le nom contient « synchro »
 *   node tests/run.mjs --captures   + captures d'ecran des ecrans dans tests/.out/
 *
 * Aucune dependance : Node 22+ et Chrome (ou Edge) deja installes.
 * Le navigateur tourne sans fenetre, en taille telephone Android (390 px).
 * Supabase et l'IA sont SIMULES : aucun vrai compte, aucune vraie donnee, aucun jeton Groq.
 *
 * A lancer apres CHAQUE modification de l'app. Un test qui echoue = quelque chose est casse
 * (ou le comportement a change expres : mettre alors le test a jour dans ce fichier).
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import vm from 'node:vm';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARGS = process.argv.slice(2);
const RAPIDE = ARGS.includes('--rapide');
const CAPTURES = ARGS.includes('--captures');
const FILTRE = (ARGS.find(a => !a.startsWith('--')) || '').toLowerCase();
const APP = 'scolaria-home-v2.html';
const SUPA_HOTE = 'vefnkztjmodchvmspukh.supabase.co';
const CLE_SESSION = 'sb-vefnkztjmodchvmspukh-auth-token';
const UA_ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36';

/* ══ MINI-CADRE DE TEST ══ */
let nbOk = 0, nbSautes = 0, groupeActif = true;
const echecs = [];
function groupe(nom) {
  groupeActif = !FILTRE || nom.toLowerCase().includes(FILTRE);
  if (groupeActif) console.log('\n▸ ' + nom);
  return groupeActif;
}
async function test(nom, fn) {
  if (!groupeActif) return;
  const t = Date.now(), duree = () => (Date.now() - t > 1500 ? ' (' + ((Date.now() - t) / 1000).toFixed(1) + ' s)' : '');
  try {
    const r = await fn();
    if (typeof r === 'string' && r.startsWith('SAUTE')) { nbSautes++; console.log('  ⏭️  ' + nom + ' (' + r.slice(6) + ')'); return; }
    nbOk++; console.log('  ✅ ' + nom + duree());
  } catch (e) {
    const detail = String((e && e.message) || e);
    echecs.push(nom); console.log('  ❌ ' + nom + duree() + '\n       → ' + detail.split('\n').join('\n         '));
  }
}
function egal(obtenu, attendu, quoi) {
  if (JSON.stringify(obtenu) !== JSON.stringify(attendu))
    throw new Error((quoi ? quoi + ' : ' : '') + 'obtenu ' + JSON.stringify(obtenu) + ', attendu ' + JSON.stringify(attendu));
}
function vrai(v, msg) { if (!v) throw new Error(msg || 'condition fausse'); }
const pause = ms => new Promise(r => setTimeout(r, ms));

/* ══ FICHIERS DE L'APP ══
   « servis » = tout ce que Vercel met en ligne (pas archive/, tests/, supabase/, docs) */
const EXCLUS = /^(archive|tests|supabase|node_modules|\.git|\.vercel|\.claude)(\/|$)/;
function fichiersServis() {
  const out = [];
  (function parcours(dir) {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = dir ? dir + '/' + e.name : e.name;
      if (EXCLUS.test(rel) || e.name.startsWith('.')) continue;
      if (e.isDirectory()) parcours(rel);
      else if (!/\.md$/i.test(e.name)) out.push(rel);
    }
  })('');
  return out;
}
const lire = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const SERVIS = fichiersServis();
const HTMLS = SERVIS.filter(f => f.endsWith('.html'));
const JSS = SERVIS.filter(f => f.endsWith('.js'));
/* Scripts en ligne d'une page : [{ code, ligne }] (ligne = 1re ligne du code dans le fichier) */
function scriptsEnLigne(html) {
  const out = [], re = /<script(\s[^>]*)?>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    if (/\ssrc=/.test(m[1] || '')) continue;
    out.push({ code: m[2], ligne: html.slice(0, m.index + m[0].indexOf('>') + 1).split('\n').length });
  }
  return out;
}
/* Tout le JavaScript de l'app (scripts en ligne + fichiers .js servis, sauf les donnees des annales) */
function toutLeJs() {
  return HTMLS.map(f => scriptsEnLigne(lire(f)).map(s => s.code).join('\n')).join('\n') + '\n' +
    JSS.filter(f => f !== 'annales-data.js' && f !== 'sw.js').map(lire).join('\n');
}

/* ══ 1. VERIFICATIONS DU CODE (sans navigateur) ══ */
async function testsCode() {
  if (!groupe('Code : syntaxe, structure, sécurité')) return;

  for (const f of HTMLS) {
    const scripts = scriptsEnLigne(lire(f));
    await test('Syntaxe JavaScript de ' + f + ' (' + scripts.length + ' script' + (scripts.length > 1 ? 's' : '') + ')', () => {
      scripts.forEach(s => { new vm.Script('\n'.repeat(s.ligne - 1) + s.code, { filename: f }); });
    });
  }
  for (const f of JSS) await test('Syntaxe JavaScript de ' + f, () => { new vm.Script(lire(f), { filename: f }); });

  for (const f of HTMLS) {
    await test('Balises équilibrées dans ' + f + ' (<div>, <script>, fin de fichier)', () => {
      const html = lire(f);
      egal((html.match(/<script\b/g) || []).length, (html.match(/<\/script>/g) || []).length, '<script> ouverts / fermés');
      /* les <div> ecrits dans des chaines JavaScript ne comptent pas : seulement le HTML */
      const balisage = html.replace(/<script\b[\s\S]*?<\/script>/g, '').replace(/<!--[\s\S]*?-->/g, '');
      egal((balisage.match(/<div\b/g) || []).length, (balisage.match(/<\/div>/g) || []).length, '<div> ouverts / fermés');
      vrai(/<\/body>\s*<\/html>\s*$/.test(html), 'le fichier doit finir par </body></html>');
    });
  }

  await test('Aucune clé Groq ni appel direct à Groq dans les fichiers en ligne', () => {
    for (const f of SERVIS.filter(f => /\.(html|js|json)$/.test(f))) {
      const t = lire(f);
      vrai(!/gsk_[A-Za-z0-9]{20,}/.test(t), 'clé Groq trouvée dans ' + f);
      vrai(!/api\.groq\.com/.test(t), 'appel direct à api.groq.com dans ' + f + ' (toujours passer par GROQ_PROXY)');
    }
  });

  await test('Même version de supabase-js partout (app, reset-password, sw.js)', () => {
    const v = ['scolaria-home-v2.html', 'reset-password.html', 'sw.js'].map(f => ((lire(f).match(/supabase-js@([\d.]+)/) || [])[1] || 'absente'));
    vrai(v.every(x => x === v[0] && x !== 'absente'), 'versions trouvées : ' + v.join(', '));
  });

  await test('Les fichiers précachés par sw.js existent', () => {
    const m = lire('sw.js').match(/addAll\(\[([^\]]*)\]/);
    vrai(m, 'liste addAll([...]) introuvable dans sw.js');
    const manquants = m[1].match(/'[^']*'/g).map(s => s.slice(1, -1)).filter(f => f !== './' && !fs.existsSync(path.join(ROOT, f)));
    egal(manquants, [], 'fichiers manquants');
  });

  await test('Les fichiers locaux appelés par les pages existent (src, href, manifest)', () => {
    const manquants = [];
    for (const f of HTMLS) {
      const re = /\s(?:src|href)="([^"#?]+)/g; let m;
      const html = lire(f).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, s => s.slice(0, s.indexOf('>') + 1));
      while ((m = re.exec(html))) {
        const u = m[1];
        if (/^(https?:|data:|mailto:|tel:|javascript:|\/\/)/.test(u)) continue;
        if (!fs.existsSync(path.join(ROOT, path.dirname(f), u))) manquants.push(f + ' → ' + u);
      }
    }
    const man = JSON.parse(lire('manifest.json'));
    (man.icons || []).forEach(i => { if (!fs.existsSync(path.join(ROOT, i.src))) manquants.push('manifest.json → ' + i.src); });
    egal(manquants, [], 'introuvables');
  });

  await test('localStorage.clear() seulement dans logout()', () => {
    const js = toutLeJs(), mauvais = [];
    let i = -1;
    while ((i = js.indexOf('localStorage.clear()', i + 1)) !== -1) {
      const avant = js.slice(0, i), fn = [...avant.matchAll(/function\s+([\w$]+)\s*\(/g)].pop();
      if (!fn || fn[1] !== 'logout') mauvais.push(fn ? fn[1] : '(hors fonction)');
    }
    egal(mauvais, [], 'appelé dans');
  });

  await test('Les clés synchronisées (SYNC_KEYS) commencent par sk_ (jamais sk__)', () => {
    const m = toutLeJs().match(/var SYNC_KEYS\s*=\s*\[([^\]]*)\]/);
    vrai(m, 'SYNC_KEYS introuvable');
    const cles = m[1].match(/'[^']*'/g).map(s => s.slice(1, -1));
    egal(cles.filter(k => !/^sk_[^_]/.test(k)), [], 'clés invalides');
  });

  await test('Les dates ne passent pas par toISOString() (UTC : décalage après minuit)', () => {
    egal((toutLeJs().match(/toISOString\(\)/g) || []).length, 0, 'nombre de toISOString()');
  });

  await testsServiceWorker();
}

/* Le gestionnaire « fetch » de sw.js avec un faux reseau et un faux cache (delai reduit a 0,3 s) */
async function testsServiceWorker() {
  const src = lire('sw.js').replace(/RESEAU_MAX = \d+/, 'RESEAU_MAX = 300');
  function lancer(cas) {
    const handlers = {}, mises = [];
    const self = { addEventListener: (t, f) => { handlers[t] = f; }, registration: { scope: 'http://x/' }, skipWaiting() {}, clients: {} };
    const caches = { match: async () => (cas.cache ? 'COPIE' : undefined), open: async () => ({ put: async () => { mises.push(1); } }), keys: async () => [] };
    const fetch = () => new Promise((res, rej) => {
      if (cas.reseau === 'jamais') return;
      setTimeout(() => (cas.reseau === 'echec' ? rej(new Error('hors ligne')) : res({ ok: true, clone: () => 'CLONE', id: 'RESEAU' })), cas.delai);
    });
    new Function('self', 'caches', 'fetch', src)(self, caches, fetch);
    let reponse = null; const vie = [];
    handlers.fetch({ request: { method: 'GET', url: 'http://x/scolaria-home-v2.html', mode: 'navigate' }, respondWith: p => { reponse = p; }, waitUntil: p => vie.push(p) });
    const t0 = Date.now();
    return new Promise(fin => {
      let fait = false;
      reponse.then(r => { fait = true; fin({ servi: r === 'COPIE' ? 'cache' : r.id, ms: Date.now() - t0 }); }, () => { fait = true; fin({ servi: 'erreur', ms: Date.now() - t0 }); });
      setTimeout(() => { if (!fait) fin({ servi: 'en attente', ms: Date.now() - t0 }); }, 1200);
    }).then(r => Promise.race([Promise.all(vie), pause(1200)]).then(() => Object.assign(r, { majCache: mises.length })));
  }
  const cas = [
    ['réseau rapide → réponse du réseau, cache mis à jour', { reseau: 'ok', delai: 30, cache: true }, r => r.servi === 'RESEAU' && r.majCache === 1],
    ['réseau muet → copie en cache après le délai', { reseau: 'jamais', cache: true }, r => r.servi === 'cache' && r.ms >= 280 && r.ms < 600],
    ['mode avion → copie en cache tout de suite', { reseau: 'echec', delai: 5, cache: true }, r => r.servi === 'cache' && r.ms < 250],
    ['mode avion sans copie → erreur (pas d\'attente infinie)', { reseau: 'echec', delai: 5, cache: false }, r => r.servi === 'erreur'],
    ['réseau lent sans copie → on attend le réseau', { reseau: 'ok', delai: 600, cache: false }, r => r.servi === 'RESEAU' && r.majCache === 1],
    ['réseau lent avec copie → copie, puis cache mis à jour', { reseau: 'ok', delai: 600, cache: true }, r => r.servi === 'cache' && r.majCache === 1]
  ];
  await Promise.all(cas.map(async c => { c.r = await lancer(c[1]); }));
  for (const c of cas) await test('Service worker : ' + c[0], () => vrai(c[2](c.r), 'résultat : ' + JSON.stringify(c.r)));
}

/* ══ 2. NAVIGATEUR (Chrome sans fenetre, piloté par le protocole DevTools) ══ */
function trouverNavigateur() {
  const L = process.env.LOCALAPPDATA || '';
  return [process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    L && path.join(L, 'Google/Chrome/Application/chrome.exe'),
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
  ].find(p => p && fs.existsSync(p));
}

async function lancerNavigateur(exe) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scolaria-tests-'));
  const proc = spawn(exe, ['--headless=new', '--remote-debugging-port=0', '--user-data-dir=' + dir,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-gpu', '--mute-audio',
    /* pas de CORS : Supabase et l'IA sont simules depuis ce script */
    '--disable-web-security', '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
  const ws = await new Promise((res, rej) => {
    let buf = '';
    const t = setTimeout(() => rej(new Error('le navigateur ne démarre pas')), 30000);
    proc.stderr.on('data', d => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) { clearTimeout(t); res(m[1]); } });
    proc.on('exit', c => rej(new Error('le navigateur s\'est arrêté (code ' + c + ')')));
  });
  const cdp = new CDP(ws);
  await cdp.ouvrir();
  return {
    cdp,
    async fermer() {
      try { await cdp.send('Browser.close'); } catch (e) {}
      await pause(300);
      try { proc.kill(); } catch (e) {}
      for (let i = 0; i < 10; i++) { try { fs.rmSync(dir, { recursive: true, force: true }); break; } catch (e) { await pause(300); } }
    }
  };
}

class CDP {
  constructor(url) { this.url = url; this.n = 0; this.attente = new Map(); this.ecouteurs = new Set(); }
  ouvrir() {
    return new Promise((res, rej) => {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => res();
      this.ws.onerror = () => rej(new Error('connexion au navigateur impossible'));
      this.ws.onmessage = e => {
        const m = JSON.parse(e.data);
        if (m.id && this.attente.has(m.id)) {
          const a = this.attente.get(m.id); this.attente.delete(m.id);
          m.error ? a.rej(new Error(m.error.message)) : a.res(m.result);
        } else if (m.method) this.ecouteurs.forEach(f => f(m.method, m.params, m.sessionId));
      };
    });
  }
  send(method, params = {}, sessionId) {
    const id = ++this.n;
    this.ws.send(JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params }));
    return new Promise((res, rej) => this.attente.set(id, { res, rej }));
  }
  on(f) { this.ecouteurs.add(f); return () => this.ecouteurs.delete(f); }
}

/* ══ FAUX ELEVE, FAUSSE SESSION, FAUX CLOUD ══ */
const UID = '00000000-0000-4000-8000-0000000000aa';
const USER = { id: UID, aud: 'authenticated', role: 'authenticated', email: 'eleve@test.local', app_metadata: { provider: 'email' }, user_metadata: {}, created_at: '2026-09-01T08:00:00Z' };
const b64u = o => Buffer.from(JSON.stringify(o)).toString('base64url');
function fausseSession(valideEncore = 86400) {
  const exp = Math.floor(Date.now() / 1000) + valideEncore;
  const jeton = b64u({ alg: 'HS256', typ: 'JWT' }) + '.' + b64u({ sub: UID, aud: 'authenticated', role: 'authenticated', exp, iat: exp - 3600, email: USER.email }) + '.c2lnbmF0dXJl';
  return { jeton, json: JSON.stringify({ access_token: jeton, token_type: 'bearer', expires_in: 86400, expires_at: exp, refresh_token: 'jeton-de-test', user: USER }) };
}
const PROFIL = JSON.stringify({ prenom: 'Léa', classe: '3ème', avatar: '🎓' });

/* Reponses simulees de l'IA (meme format que Groq / le proxy) */
const iaTexte = t => ({ status: 200, json: { choices: [{ message: { role: 'assistant', content: t } }] } });
const iaFlux = t => ({ status: 200, type: 'text/event-stream',
  body: (t.match(/[\s\S]{1,14}/g) || []).map(c => 'data: ' + JSON.stringify({ choices: [{ delta: { content: c } }] }) + '\n\n').join('') + 'data: [DONE]\n\n' });
const iaErreur = (status, message) => ({ status, json: { error: { message } } });

let LIB_SUPABASE = null;   /* supabase-js 2.118.0, telechargee une fois dans tests/.cache/ */
async function chargerLibSupabase() {
  const url = (lire(APP).match(/https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@[^"]+/) || [])[0];
  if (!url) return;
  const f = path.join(ROOT, 'tests', '.cache', url.replace(/[^\w.@-]+/g, '_'));
  if (!fs.existsSync(f)) {
    try {
      const r = await fetch(url);
      if (!r.ok) return;
      fs.mkdirSync(path.dirname(f), { recursive: true });
      fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
    } catch (e) { return; }
  }
  LIB_SUPABASE = { url, corps: fs.readFileSync(f) };
}

function serveurLocal() {
  const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp' };
  return new Promise(res => {
    const s = http.createServer((req, rep) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p === '/') p = '/' + APP;   /* comme la reecriture de vercel.json */
      const f = path.join(ROOT, p);
      if (!f.startsWith(ROOT) || EXCLUS.test(p.slice(1)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rep.writeHead(404); rep.end('introuvable'); return; }
      rep.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      fs.createReadStream(f).pipe(rep);
    });
    s.listen(0, '127.0.0.1', () => res(s));
  });
}

/* Un onglet isole (stockage vide) avec son faux reseau.
   opts : stockage {cle: valeur} (pose avant le demarrage de l'app), horsLigne (mode avion),
          cloud (ligne user_data simulee, null = aucune), reseauSupabase ('ok' | 'muet' | 'echec'),
          sansLib (supabase-js introuvable), envoiEchoue (l'enregistrement dans le cloud echoue) */
class Onglet {
  static async ouvrir(nav, base, opts = {}) {
    const { browserContextId } = await nav.cdp.send('Target.createBrowserContext', { disposeOnDetach: true });
    const { targetId } = await nav.cdp.send('Target.createTarget', { url: 'about:blank', browserContextId });
    const { sessionId } = await nav.cdp.send('Target.attachToTarget', { targetId, flatten: true });
    const o = new Onglet(nav.cdp, base, sessionId, browserContextId, opts);
    await o._init();
    return o;
  }
  constructor(cdp, base, sessionId, contexte, opts) {
    Object.assign(this, { cdp, base, sessionId, contexte, opts });
    this.erreurs = []; this.requetes = []; this.envois = []; this.appelsIA = []; this.ia = []; this.dialogues = [];
    this.cloud = opts.cloud === undefined ? null : opts.cloud;
    this._charge = null;
  }
  s(m, p) { return this.cdp.send(m, p, this.sessionId); }
  async _init() {
    this.stop = this.cdp.on((m, p, sid) => { if (sid === this.sessionId) this._evt(m, p); });
    for (const m of ['Page.enable', 'Runtime.enable', 'Network.enable']) await this.s(m);
    /* le service worker est teste a part (voir testsServiceWorker) */
    await this.s('Network.setBypassServiceWorker', { bypass: true });
    await this.s('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await this.s('Emulation.setUserAgentOverride', { userAgent: UA_ANDROID, platform: 'Android' });
    const init = '(() => {' +
      (this.opts.horsLigne ? 'Object.defineProperty(Navigator.prototype, "onLine", { get: () => false, configurable: true });' : '') +
      'if (location.origin !== ' + JSON.stringify(this.base) + ') return;' +
      'try { if (sessionStorage.getItem("__test")) return; sessionStorage.setItem("__test", "1");' +
      'var d = ' + JSON.stringify(this.opts.stockage || {}) + '; for (var k in d) localStorage.setItem(k, d[k]); } catch (e) {}' +
      '})();';
    await this.s('Page.addScriptToEvaluateOnNewDocument', { source: init });
    await this.s('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  }
  _evt(m, p) {
    if (m === 'Fetch.requestPaused') { this._requete(p).catch(() => {}); return; }
    if (m === 'Runtime.exceptionThrown') {
      const d = p.exceptionDetails, ex = d.exception;
      this.erreurs.push((ex && ex.description ? ex.description.split('\n')[0] : d.text) + (d.url ? ' (' + d.url.split('/').pop() + ':' + (d.lineNumber + 1) + ')' : ''));
    }
    if (m === 'Runtime.consoleAPICalled' && (p.type === 'error' || p.type === 'assert'))
      this.erreurs.push('console.error : ' + p.args.map(a => a.value !== undefined ? a.value : a.description).join(' '));
    if (m === 'Page.javascriptDialogOpening') { this.dialogues.push(p.message); this.s('Page.handleJavaScriptDialog', { accept: true }).catch(() => {}); }
    if (m === 'Page.loadEventFired' && this._charge) { this._charge(); this._charge = null; }
  }
  async _repondre(id, r) {
    if (r === 'echec') return this.s('Fetch.failRequest', { requestId: id, errorReason: 'InternetDisconnected' });
    if (r === 'muet') return;   /* la requete reste sans reponse (reseau qui ne repond pas) */
    const corps = r.corps || Buffer.from(r.json !== undefined ? JSON.stringify(r.json) : (r.body || ''));
    return this.s('Fetch.fulfillRequest', { requestId: id, responseCode: r.status || 200, body: corps.toString('base64'),
      responseHeaders: [{ name: 'Content-Type', value: r.type || (r.json !== undefined ? 'application/json' : 'text/plain') }, { name: 'Access-Control-Allow-Origin', value: '*' }] });
  }
  async _requete(p) {
    const q = p.request, url = q.url, id = p.requestId;
    this.requetes.push({ url, methode: q.method });
    if (url.startsWith(this.base)) return this.s('Fetch.continueRequest', { requestId: id });
    /* supabase-js : en mode avion, le service worker la sert depuis son cache */
    if (url.includes('cdn.jsdelivr.net/npm/@supabase/')) {
      if (this.opts.sansLib || !LIB_SUPABASE) return this._repondre(id, 'echec');
      return this._repondre(id, { corps: LIB_SUPABASE.corps, type: 'application/javascript' });
    }
    if (this.opts.horsLigne) return this._repondre(id, 'echec');
    if (url.includes(SUPA_HOTE)) {
      if (url.includes('/functions/v1/groq-proxy')) {
        let payload = null; try { payload = JSON.parse(q.postData || 'null'); } catch (e) {}
        this.appelsIA.push({ payload, auth: q.headers.Authorization || q.headers.authorization || '' });
        const r = this.ia.shift();
        return this._repondre(id, typeof r === 'function' ? r(payload) : (r || iaErreur(500, 'test : aucune réponse IA prévue')));
      }
      const mode = this.opts.reseauSupabase || 'ok';
      if (mode !== 'ok') return this._repondre(id, mode);
      if (url.includes('/auth/v1/user')) return this._repondre(id, { json: USER });
      if (url.includes('/auth/v1/')) return this._repondre(id, { status: 400, json: { error: 'invalid_grant', error_description: 'test' } });
      if (url.includes('/rest/v1/user_data')) {
        if (q.method === 'GET') return this._repondre(id, { json: this.cloud ? [{ data: this.cloud }] : [] });
        if (q.method === 'POST' || q.method === 'PATCH') {
          let corps = null; try { corps = JSON.parse(q.postData || 'null'); } catch (e) {}
          const ligne = Array.isArray(corps) ? corps[0] : corps;
          this.envois.push(ligne);
          if (this.opts.envoiEchoue) return this._repondre(id, { status: 500, json: { message: 'test : enregistrement refusé' } });
          if (ligne && ligne.data) this.cloud = ligne.data;
          return this._repondre(id, { status: 201, json: [] });
        }
      }
      return this._repondre(id, { status: 404, json: { message: 'test : adresse non simulée' } });
    }
    /* polices Google et tout le reste d'internet : coupes (les tests ne dependent pas du reseau) */
    return this._repondre(id, 'echec');
  }
  async aller(chemin = '/' + APP) {
    const charge = new Promise(r => { this._charge = r; });
    await this.s('Page.navigate', { url: this.base + chemin });
    await Promise.race([charge, pause(15000)]);
  }
  async ev(expr) {
    const r = await this.s('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true });
    if (r.exceptionDetails) {
      const ex = r.exceptionDetails.exception;
      throw new Error('erreur dans la page : ' + (ex && ex.description ? ex.description.split('\n')[0] : r.exceptionDetails.text) + '\n  pendant : ' + expr.slice(0, 160));
    }
    return r.result.value;
  }
  async attendre(expr, ms = 5000, quoi) {
    const fin = Date.now() + ms;
    while (Date.now() < fin) { if (await this.ev(expr).catch(() => false)) return; await pause(50); }
    throw new Error((quoi ? quoi + ' (' + ms / 1000 + ' s)' : 'attente trop longue (' + ms / 1000 + ' s) : ' + expr.slice(0, 200)));
  }
  sansErreur(tolerees = []) {
    const e = this.erreurs.filter(x => !tolerees.some(t => t.test(x)));
    this.erreurs = [];
    if (e.length) throw new Error('erreurs JavaScript :\n' + [...new Set(e)].slice(0, 8).join('\n'));
  }
  async capture(nom) {
    if (!CAPTURES) return;
    const r = await this.s('Page.captureScreenshot', { format: 'png' });
    const d = path.join(ROOT, 'tests', '.out');
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, nom + '.png'), Buffer.from(r.data, 'base64'));
  }
  async fermer() { this.stop(); try { await this.cdp.send('Target.disposeBrowserContext', { browserContextId: this.contexte }); } catch (e) {} }
}

/* Fonctions appelees dans les attributs on…="" (onclick, oninput…) d'un texte HTML ou JS */
const MOTS_JS = new Set(['if', 'else', 'return', 'function', 'typeof', 'new', 'event', 'this', 'var', 'let', 'const', 'void', 'true', 'false', 'null',
  'Math', 'String', 'Number', 'JSON', 'Date', 'parseInt', 'parseFloat', 'isNaN', 'setTimeout', 'clearTimeout', 'alert', 'confirm', 'encodeURIComponent',
  'document', 'window', 'history', 'location', 'navigator', 'Array', 'Object', 'Boolean', 'requestAnimationFrame', 'for', 'while', 'switch']);
function nomsAppeles(texte) {
  const noms = new Set(), re = /\son[a-z]+=\\?["']([^"'\\]*(?:\\.[^"'\\]*)*)/g;
  let m;
  while ((m = re.exec(texte))) for (const a of m[1].matchAll(/(^|[^.\w$])([A-Za-z_$][\w$]*)\s*\(/g)) if (!MOTS_JS.has(a[2])) noms.add(a[2]);
  return [...noms];
}
/* expression a evaluer dans la page : les noms qui ne sont pas des fonctions */
const fonctionsAbsentes = noms => '(' + JSON.stringify(noms) + ').filter(function(n) { try { return typeof eval(n) !== "function"; } catch (e) { return true; } })';

/* Avertissements attendus quand le cloud est volontairement en panne */
const TOLERE_SYNC = [/syncToCloud échoué|syncFromCloud échoué/];

/* ══ 3. SCENARIOS ══ */
async function testsNavigateur(nav, base) {
  const ouvrir = opts => Onglet.ouvrir(nav, base, opts);
  const sess = fausseSession();
  const ELEVE = { [CLE_SESSION]: sess.json, sk_prof: PROFIL };

  /* ── Démarrage ── */
  if (groupe('Démarrage')) {
    let o = await ouvrir({});
    await test('Premier lancement : écran de connexion, sans erreur', async () => {
      if (!LIB_SUPABASE) return 'SAUTE pas de copie de supabase-js (internet nécessaire une fois)';
      await o.aller();
      await o.attendre('getComputedStyle(document.getElementById("fb-auth-forms")).display === "flex"', 6000, 'formulaire de connexion invisible');
      egal(await o.ev('_appDemarre'), false, 'app ouverte sans compte');
      await o.capture('connexion');
      o.sansErreur();
    });
    await o.fermer();

    o = await ouvrir({ stockage: ELEVE, cloud: { __modif: 1, sk_prof: PROFIL } });
    await test('Élève connecté : l\'app s\'ouvre sur l\'accueil avec son prénom', async () => {
      if (!LIB_SUPABASE) return 'SAUTE pas de copie de supabase-js';
      await o.aller();
      await o.attendre('_appDemarre === true', 8000, 'app pas démarrée');
      egal(await o.ev('document.getElementById("fb-login").style.display'), 'none', 'écran de connexion');
      vrai(/Léa/.test(await o.ev('document.getElementById("home-greeting").textContent')), 'prénom absent de l\'accueil');
      egal(await o.ev('document.querySelector(".sec.active").id'), 's-home', 'section affichée');
      await o.capture('accueil');
      o.sansErreur();
    });
    await o.fermer();

    o = await ouvrir({ stockage: ELEVE, horsLigne: true });
    await test('Mode avion : l\'app s\'ouvre tout de suite avec les données du téléphone', async () => {
      const t0 = Date.now();
      await o.aller();
      await o.attendre('_appDemarre === true', 3000, 'app bloquée sur le logo');
      vrai(Date.now() - t0 < 2500, 'trop lent : ' + (Date.now() - t0) + ' ms');
      vrai(await o.ev('document.body.classList.contains("offline")'), 'bandeau « Hors connexion » absent');
      vrai(/Hors connexion/.test(await o.ev('document.getElementById("sk-toast").textContent')), 'message « Hors connexion » absent');
      o.sansErreur();
    });
    await o.fermer();

    /* le vrai blocage du telephone : session expiree (plus d'1 h) + mode avion → Supabase essaie
       sans fin de la renouveler ; l'app doit s'ouvrir quand meme, tout de suite */
    o = await ouvrir({ stockage: { [CLE_SESSION]: fausseSession(-3600).json, sk_prof: PROFIL }, horsLigne: true });
    await test('Mode avion + session expirée (le blocage sur le logo) : l\'app s\'ouvre tout de suite', async () => {
      if (!LIB_SUPABASE) return 'SAUTE pas de copie de supabase-js';
      const t0 = Date.now();
      await o.aller();
      await o.attendre('_appDemarre === true', 4000, 'app bloquée sur le logo');
      vrai(Date.now() - t0 < 2500, 'trop lent : ' + (Date.now() - t0) + ' ms');
      vrai(/Léa/.test(await o.ev('document.getElementById("home-greeting").textContent')), 'données du téléphone absentes');
      o.sansErreur();
    });
    await o.fermer();

    o = await ouvrir({ stockage: ELEVE, reseauSupabase: 'muet' });
    await test('Réseau qui ne répond pas : l\'app s\'ouvre quand même (≤ 8 s)', async () => {
      if (!LIB_SUPABASE) return 'SAUTE pas de copie de supabase-js';
      const t0 = Date.now();
      await o.aller();
      await o.attendre('_appDemarre === true', 9000, 'app bloquée sur le logo');
      vrai(Date.now() - t0 < 8500, 'trop lent : ' + (Date.now() - t0) + ' ms');
      o.sansErreur(TOLERE_SYNC);
    });
    await o.fermer();

    o = await ouvrir({ stockage: ELEVE, sansLib: true });
    await test('Librairie Supabase introuvable : l\'app s\'ouvre en mode local', async () => {
      await o.aller();
      await o.attendre('_appDemarre === true', 3000, 'app pas démarrée');
      egal(await o.ev('_supa'), null, '_supa');
      o.sansErreur();
    });
    await o.fermer();

    o = await ouvrir({ stockage: { [CLE_SESSION]: sess.json }, cloud: null });
    await test('Nouvel élève (compte sans données) : l\'accueil de bienvenue s\'affiche', async () => {
      if (!LIB_SUPABASE) return 'SAUTE pas de copie de supabase-js';
      await o.aller();
      await o.attendre('_appDemarre === true && document.getElementById("onboarding").style.display !== "none"', 8000, 'onboarding absent');
      await o.capture('onboarding');
      o.sansErreur();
    });
    await o.fermer();

    o = await ouvrir({});
    await test('reset-password.html se charge sans erreur, ses boutons fonctionnent', async () => {
      if (!LIB_SUPABASE) return 'SAUTE pas de copie de supabase-js';
      await o.aller('/reset-password.html');
      await pause(500);
      egal(await o.ev(fonctionsAbsentes(nomsAppeles(lire('reset-password.html')))), [], 'fonctions introuvables');
      o.sansErreur();
    });
    await o.fermer();
  }

  /* ── Synchro : jamais de perte de donnees ── */
  if (groupe('Synchro avec le cloud') && LIB_SUPABASE) {
    const DV_TEL = JSON.stringify([{ id: 1, mat: 'Maths', desc: 'fait sur le téléphone', due: '', date: '?', done: false }]);
    const DV_CLOUD = JSON.stringify([{ id: 1, mat: 'SVT', desc: 'venu du cloud', due: '', date: '?', done: false }]);

    let o = await ouvrir({ stockage: { ...ELEVE, sk_dv: DV_TEL, sk__modif: '2000', sk__envoi: '1000' }, cloud: { __modif: 1500, sk_dv: DV_CLOUD, sk_prof: PROFIL } });
    await test('Modifs du téléphone pas encore envoyées : le cloud ne les écrase pas, elles partent', async () => {
      await o.aller();
      await o.attendre('_appDemarre === true', 8000);
      egal(await o.ev('localStorage.getItem("sk_dv")'), DV_TEL, 'devoirs du téléphone');
      vrai(o.envois.some(e => e && e.data && e.data.sk_dv === DV_TEL), 'les modifs n\'ont pas été envoyées au cloud');
      egal(await o.ev('localStorage.getItem("sk__envoi")'), '2000', 'sk__envoi');
      o.sansErreur();
    });
    await o.fermer();

    o = await ouvrir({ stockage: { ...ELEVE, sk_dv: DV_TEL, sk__modif: '1000', sk__envoi: '1000' }, cloud: { __modif: 3000, sk_dv: DV_CLOUD, sk_prof: PROFIL } });
    await test('Cloud plus récent (autre appareil) : le téléphone reçoit ses données', async () => {
      await o.aller();
      await o.attendre('_appDemarre === true', 8000);
      egal(await o.ev('localStorage.getItem("sk_dv")'), DV_CLOUD, 'devoirs');
      egal(await o.ev('localStorage.getItem("sk__envoi")'), '3000', 'sk__envoi');
      egal(o.envois.length, 0, 'envois inutiles');
      vrai(/venu du cloud/.test(await o.ev('document.getElementById("s-devoirs").textContent')), 'devoir du cloud pas affiché');
      o.sansErreur();
    });
    await o.fermer();

    o = await ouvrir({ stockage: { ...ELEVE, sk_dv: DV_TEL, sk__modif: '5000', sk__envoi: '5000' }, cloud: { __modif: 5000, sk_dv: DV_CLOUD, sk_prof: PROFIL } });
    await test('Déjà à jour : rien n\'est réécrit ni renvoyé', async () => {
      await o.aller();
      await o.attendre('_appDemarre === true', 8000);
      egal(await o.ev('localStorage.getItem("sk_dv")'), DV_TEL, 'devoirs');
      egal(o.envois.length, 0, 'envois');
      o.sansErreur();
    });
    await o.fermer();

    o = await ouvrir({ stockage: ELEVE, cloud: { __modif: 1, sk_prof: PROFIL }, envoiEchoue: true });
    await test('Envoi refusé par le cloud : la modif reste en attente et repart plus tard', async () => {
      await o.aller();
      await o.attendre('_appDemarre === true', 8000);
      await o.ev('markActivity(); syncToCloud()');
      vrai(o.envois.length >= 1, 'aucun envoi tenté');
      vrai(await o.ev('_syncEnAttente()'), 'la modif n\'est plus en attente alors que l\'envoi a échoué');
      o.opts.envoiEchoue = false;
      egal(await o.ev('syncToCloud()'), true, 'deuxième envoi');
      egal(await o.ev('_syncEnAttente()'), false, 'toujours en attente après un envoi réussi');
      o.sansErreur(TOLERE_SYNC);
    });
    await o.fermer();
  }

  /* ── L'app en usage (un seul onglet, eleve connecte) ── */
  const actif = n => !FILTRE || n.toLowerCase().includes(FILTRE);
  if (!actif(G_ECRANS) && !actif(G_FONCTIONS)) return;
  if (!LIB_SUPABASE) { groupe(G_ECRANS); await test('Écrans et fonctions', () => 'SAUTE pas de copie de supabase-js'); return; }
  const o = await ouvrir({ stockage: ELEVE, cloud: { __modif: 1, sk_prof: PROFIL } });
  await o.aller();
  await o.attendre('_appDemarre === true', 8000, 'app pas démarrée');
  groupe(G_ECRANS);

  await test('Chaque bouton appelle une fonction qui existe (onclick, oninput…)', async () => {
    /* le HTML de l'app ET les morceaux de HTML generes par son JavaScript */
    const noms = nomsAppeles(lire(APP) + '\n' + JSS.filter(f => f !== 'sw.js').map(lire).join('\n'));
    vrai(noms.length > 50, 'trop peu de boutons trouvés (' + noms.length + ') : l\'analyse est cassée');
    egal(await o.ev(fonctionsAbsentes(noms)), [], 'fonctions introuvables');
  });

  await test('Les onglets du bas s\'ouvrent, le retour revient à l\'accueil', async () => {
    const onglets = await o.ev('[].map.call(document.querySelectorAll(".nav-btn"), function(b) { return (b.getAttribute("onclick") || "").match(/goSec\\(\'([^\']+)/)[1]; })');
    vrai(onglets.length >= 4, 'onglets trouvés : ' + onglets.length);
    for (const id of onglets) {
      await o.ev('document.querySelector(\'.nav-btn[onclick*="' + id + '"]\').click(); navSync()');
      egal(await o.ev('document.querySelector(".sec.active").id'), id, 'section après le clic');
      await o.capture('onglet-' + id);
      if (id === 's-home') continue;
      await o.ev('history.back()');
      await o.attendre('document.querySelector(".sec.active").id === "s-home"', 2000, 'le retour n\'est pas revenu à l\'accueil depuis ' + id);
    }
    o.sansErreur();
  });

  const OUVERTS = '(function() { return ["drawer", "mo", "pomo-modal", "moy-modal", "tool-modal", "vq-modal", "interro-ai-modal", "scan-modal", "vc-modal"]' +
    '.filter(function(id) { var e = document.getElementById(id); return e && e.classList.contains("open"); })' +
    '.concat(["hist-panel", "rev-fullscreen", "mc-panel"].filter(function(id) { var e = document.getElementById(id); return e && e.style.display && e.style.display !== "none"; })); })()';
  const FENETRES = [
    ['menu', 'toggleDrawer()'], ['Pomodoro', 'openTool("pomo")'], ['Moyenne', 'openTool("moy")'], ['Calculatrice', 'openTool("calc")'],
    ['Convertisseur', 'openTool("conv")'], ['Conjugueur', 'openTool("conj")'], ['nouveau devoir', 'openMo()'], ['Quiz vocal', 'openVocalQuiz()'],
    ['Interro IA', 'openInterroAI()'], ['Scanner de cours', 'openScanCours()'], ['Veille de contrôle', 'openVeilleControle()'],
    ['Historique', 'openHistPanel()'], ['Mes cours', 'openMesCours()']
  ];
  /* apres chaque test de fenetre (meme rate) : tout est referme, pour que l'echec d'un test n'entraine pas les suivants */
  const TOUT_FERMER = '["drawer", "mo", "pomo-modal", "moy-modal", "tool-modal", "vq-modal", "interro-ai-modal", "scan-modal", "vc-modal"].forEach(function(id) { var e = document.getElementById(id); if (e) e.classList.remove("open"); });' +
    'if (mcPanelOuvert()) closeMesCours(); ["hist-panel", "rev-fullscreen"].forEach(function(id) { var e = document.getElementById(id); if (e) e.style.display = "none"; });' +
    'goSec("s-home", document.querySelector(\'.nav-btn[onclick*="s-home"]\'))';
  for (const [nom, ouvre] of FENETRES) {
    await test('Fenêtre « ' + nom + ' » : s\'ouvre et se ferme avec le bouton retour', async () => {
      try {
        await o.ev(ouvre + '; navSync(); typeof mcSyncHistorique === "function" && mcSyncHistorique()');
        const ouverts = await o.ev(OUVERTS);
        vrai(ouverts.length > 0, 'rien ne s\'est ouvert');
        await o.capture('fenetre-' + nom.replace(/\W+/g, '-'));
        await o.ev('history.back()');
        await o.attendre(OUVERTS + '.length === 0', 2000, 'toujours ouvert après le retour : ' + ouverts.join(', ') + ' (à ajouter dans navOuvert() et navFermerHaut())');
        o.sansErreur();
      } finally { await o.ev(TOUT_FERMER).catch(() => {}); await pause(100); }
    });
  }

  await test('Annales : les 280 exercices se chargent à l\'ouverture', async () => {
    await o.ev('annOpen()');
    await o.attendre('typeof ANNALES !== "undefined"', 5000, 'annales-data.js pas chargé');
    const n = await o.ev('Object.keys(ANNALES).reduce(function(t, m) { return t + ANNALES[m].themes.reduce(function(u, th) { return u + th.exos.length; }, 0); }, 0)');
    vrai(n >= 280, n + ' exercices seulement');
    await o.attendre('document.getElementById("ann-view").children.length > 0', 2000, 'écran des annales vide');
    await o.capture('annales');
    await o.ev('goSec("s-home")');
    o.sansErreur();
  });

  await test('Ajouter un devoir : enregistré, affiché, envoyé au cloud', async () => {
    const demain = await o.ev('vcYmd(vcAddDays(new Date(), 1))');
    const avant = await o.ev('devoirs.length');
    o.envois = [];
    await o.ev('openMo(); document.getElementById("mo-desc").value = "Exercices p.42 (test)"; moSetDue("' + demain + '"); moSave()');
    egal(await o.ev('devoirs.length'), avant + 1, 'nombre de devoirs');
    egal(await o.ev('devoirs[devoirs.length - 1].due'), demain, 'date de rendu');
    egal(await o.ev('dvGroupe(devoirs[devoirs.length - 1]).k'), 'Demain', 'groupe');
    vrai(/Exercices p\.42 \(test\)/.test(await o.ev('localStorage.getItem("sk_dv")')), 'pas enregistré sur le téléphone');
    vrai(/Exercices p\.42 \(test\)/.test(await o.ev('document.getElementById("s-devoirs").textContent')), 'pas affiché');
    const t0 = Date.now();
    while (!o.envois.some(e => e && e.data && /Exercices p\.42/.test(e.data.sk_dv || '')) && Date.now() - t0 < 6000) await pause(100);
    vrai(o.envois.some(e => e && e.data && /Exercices p\.42/.test(e.data.sk_dv || '')), 'pas envoyé au cloud après 6 s');
    await o.attendre('!_syncEnAttente()', 2000, 'toujours en attente après l\'envoi');
    o.sansErreur();
  });

  await test('Série : compte les jours de vrai travail', async () => {
    await o.ev('[1, 2].forEach(function(n) { localStorage.setItem("sk_day_" + vcYmd(vcAddDays(new Date(), -n)), "1"); }); markActivity()');
    egal(await o.ev('getStreakCount()'), 3, 'série');
    egal(await o.ev('document.getElementById("hdr-streak-val").textContent'), '3', 'affichage');
    o.sansErreur();
  });

  await test('Mode nuit : s\'active, se désactive et est mémorisé', async () => {
    const d0 = await o.ev('document.body.classList.contains("dark")');
    await o.ev('toggleTheme()');
    egal(await o.ev('document.body.classList.contains("dark")'), !d0, 'thème après 1 clic');
    egal(await o.ev('localStorage.getItem("sk_theme")'), d0 ? 'light' : 'dark', 'thème mémorisé');
    await o.capture('mode-nuit');
    await o.ev('toggleTheme()');
    o.sansErreur();
  });

  await test('Chat : question → réponse de l\'IA affichée, niveau et session envoyés', async () => {
    await o.ev('goSec("s-chat", document.querySelector(\'.nav-btn[onclick*="s-chat"]\'))');
    o.ia.push(iaFlux('Le **théorème de Pythagore** : dans un triangle rectangle, a² + b² = c².'));
    o.appelsIA = [];
    await o.ev('document.getElementById("chat-input").value = "Explique-moi le théorème de Pythagore"; sendChat()');
    await o.attendre('/triangle rectangle/.test(document.getElementById("chat-msgs").innerHTML) && !_chatBusy', 5000, 'réponse pas affichée');
    vrai(await o.ev('/<strong>théorème de Pythagore<\\/strong>/.test(document.getElementById("chat-msgs").innerHTML)'), 'le gras (markdown) n\'est pas rendu');
    egal(o.appelsIA.length, 1, 'appels à l\'IA');
    const a = o.appelsIA[0];
    egal(a.auth, 'Bearer ' + sess.jeton, 'jeton envoyé au proxy');
    vrai(a.payload.stream === true, 'pas en streaming');
    const sys = a.payload.messages[0];
    vrai(sys.role === 'system' && /3ème/.test(sys.content), 'le niveau (3ème) n\'est pas dans le prompt système');
    vrai(a.payload.messages.reduce((t, x) => t + String(x.content).length, 0) < 40000, 'prompt trop gros');
    egal(await o.ev('chatHistory.slice(-2).map(function(m) { return m.role; })'), ['user', 'assistant'], 'historique du chat');
    await o.capture('chat');
    o.sansErreur();
  });

  await test('Correcteur : CORRECT / INCORRECT bien lus (même en gras)', async () => {
    o.ia.push(iaTexte('**CORRECT** — Bravo, c\'est juste.'), iaTexte('INCORRECT. La bonne réponse est 1789.'));
    egal(await o.ev('corrigerReponse("Date de la Révolution ?", "1789", "1789")'), { ok: true, expl: 'Bravo, c\'est juste.' });
    egal(await o.ev('corrigerReponse("Date de la Révolution ?", "1789", "1515")'), { ok: false, expl: 'La bonne réponse est 1789.' });
    o.sansErreur();
  });

  await test('IA : limite Groq par minute → attente puis nouvel essai automatique', async () => {
    o.ia.push(iaErreur(429, 'Rate limit reached for model. Please try again in 0.3s.'), iaTexte('Réponse après attente'));
    o.appelsIA = [];
    egal(await o.ev('callGroq([{ role: "user", content: "test" }], 50)'), 'Réponse après attente');
    egal(o.appelsIA.length, 2, 'essais');
  });

  await test('IA : limite du jour atteinte → message clair en français', async () => {
    o.ia.push(iaErreur(429, 'Rate limit reached on tokens per day (TPD). Please try again in 7m12s.'));
    const r = await o.ev('callGroq([{ role: "user", content: "test" }], 50).then(function() { return "pas d\'erreur"; }, function(e) { return [e.message, !!e.rateLimit]; })');
    vrai(Array.isArray(r) && /limite gratuite/.test(r[0]) && r[1], 'obtenu ' + JSON.stringify(r));
  });

  await test('IA : réponse vide, session expirée, réseau coupé → erreurs claires', async () => {
    const err = 'function(e) { return e.message; }';
    o.ia.push(iaTexte('   '));
    egal(await o.ev('callGroq([{ role: "user", content: "x" }]).then(null, ' + err + ')'), await o.ev('AI_EMPTY_MSG'), 'réponse vide');
    o.ia.push(iaErreur(401, 'Invalid JWT'));
    vrai(/session a expiré/.test(await o.ev('callGroq([{ role: "user", content: "x" }]).then(null, ' + err + ')')), 'session expirée');
    o.ia.push('echec');
    vrai(/connexion/i.test(await o.ev('callGroq([{ role: "user", content: "x" }]).then(null, ' + err + ')')), 'réseau coupé');
  });

  await test('IA : le niveau est ajouté partout sauf avec { noNiveau: true }', async () => {
    o.ia.push(iaTexte('a'), iaTexte('b'));
    o.appelsIA = [];
    await o.ev('callGroq([{ role: "system", content: "SYS" }, { role: "user", content: "x" }], 50)');
    await o.ev('callGroq([{ role: "system", content: "SYS" }, { role: "user", content: "x" }], 50, { noNiveau: true })');
    vrai(o.appelsIA[0].payload.messages[0].content.length > 'SYS'.length + 50, 'niveau absent');
    egal(o.appelsIA[1].payload.messages[0].content, 'SYS', 'avec noNiveau');
  });

  if (groupe(G_FONCTIONS)) await testsFonctions(o);
  await o.fermer();
}

/* ── Fonctions pures, testees dans la vraie page ── */
const G_ECRANS = 'Écrans, fenêtres et bouton retour';
const G_FONCTIONS = 'Fonctions (dates, correcteur, matières, sécurité du HTML)';
async function testsFonctions(o) {

  await test('Dates en heure locale (vcYmd, vcAddDays, vcDiff)', async () => {
    egal(await o.ev('vcYmd(new Date(2026, 0, 5))'), '2026-01-05');
    egal(await o.ev('vcYmd(vcAddDays(new Date(2026, 1, 28), 1))'), '2026-03-01', 'fin février');
    egal(await o.ev('vcDiff(vcYmd(vcAddDays(new Date(), 3)))'), 3);
  });

  await test('Date de rendu d\'un devoir depuis un texte (dvDueDe)', async () => {
    const r = await o.ev('[dvDueDe("demain") === vcYmd(vcAddDays(new Date(), 1)), dvDueDe("aujourd\'hui") === vcYmd(new Date()), dvDueDe("2026-11-03"), dvDueDe("?"), dvDueDe("n\'importe quoi")]');
    egal(r, [true, true, '2026-11-03', '', '']);
  });

  await test('Devoirs : groupe et urgence recalculés chaque jour', async () => {
    const r = await o.ev('(function() { var d = function(n) { return { due: vcYmd(vcAddDays(new Date(), n)) }; };' +
      'return [dvGroupe(d(-1)).k, dvUrg(d(-1)), dvGroupe(d(0)).k, dvUrg(d(1)), dvUrg(d(5)), dvUrg(d(20)), dvGroupe({ date: "?" }).k]; })()');
    egal(r, ['En retard', 'urgent', 'Aujourd\'hui', 'urgent', 'semaine', 'plus', 'Sans date']);
  });

  await test('Verdict du correcteur (_verdictOk)', async () => {
    const r = await o.ev('["CORRECT", "**CORRECT** bravo", "Ta réponse est CORRECTE ? CORRECT.", "INCORRECT", "**INCORRECT**", "pas correct", "", "Je ne sais pas"].map(_verdictOk)');
    egal(r, [true, true, true, false, false, false, false, false]);
  });

  await test('Délai demandé par Groq (_groqWaitMs)', async () => {
    egal(await o.ev('[_groqWaitMs("Please try again in 1.5s"), _groqWaitMs("try again in 250ms"), _groqWaitMs("try again in 1m2.5s"), _groqWaitMs("rien")]'), [1500, 250, 62500, null]);
  });

  await test('Matière détectée d\'après la question (detectMat)', async () => {
    const cas = [
      ['la Résistance pendant la Seconde Guerre mondiale', 'Histoire-Geo'], ['la résistance électrique et la loi d\'Ohm', 'Physique-Chimie'],
      ['le siècle des Lumières', 'Histoire-Geo'], ['la Révolution française', 'Histoire-Geo'], ['le théorème de Pythagore', 'Maths'],
      ['résoudre une équation du premier degré', 'Maths'], ['l\'énergie cinétique', 'Physique-Chimie'], ['la photosynthèse', 'SVT'],
      ['l\'accord du participe passé', 'Francais'], ['le present perfect', 'Anglais'], ['la conscience et la liberté', 'Philosophie'],
      ['les ions et le pH', 'Physique-Chimie'], ['la mitose et la méiose', 'SVT'], ['une boucle en Python', 'NSI']
    ];
    const r = await o.ev('(' + JSON.stringify(cas) + ').filter(function(c) { return detectMat(c[0]) !== c[1]; }).map(function(c) { return c[0] + " → " + detectMat(c[0]) + " (attendu " + c[1] + ")"; })');
    egal(r, [], 'mauvaises matières');
  });

  await test('Niveau scolaire : classe par défaut, brevet au collège, bac au lycée', async () => {
    const r = await o.ev('(function() { var c = userProfile.classe, out = [];' +
      '["6ème", "3ème", "2nde", "Terminale", "classe inconnue"].forEach(function(k) { userProfile.classe = k; out.push(getClasse() + ":" + examLabel()); });' +
      'userProfile.classe = c; return out; })()');
    egal(r, ['6ème:brevet', '3ème:brevet', '2nde:bac', 'Terminale:bac', '3ème:brevet']);
  });

  await test('Historique du chat envoyé à l\'IA limité (chatHistIA)', async () => {
    const r = await o.ev('(function() { var h = chatHistory; chatHistory = []; for (var i = 0; i < 30; i++) chatHistory.push({ role: i % 2 ? "assistant" : "user", content: "x".repeat(3000) });' +
      'var out = chatHistIA(12); chatHistory = h; return [out.length, out.reduce(function(t, m) { return t + m.content.length; }, 0), CHAT_HIST_MAX + CHAT_MSG_MAX + 10]; })()');
    vrai(r[0] >= 1 && r[1] <= r[2], 'messages ' + r[0] + ', caractères ' + r[1] + ' (max ' + r[2] + ')');
  });

  await test('Sécurité : le texte de l\'IA ou de l\'élève ne peut pas injecter de HTML', async () => {
    egal(await o.ev('esc(\'<img src=x onerror="alert(1)">\')'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;', 'esc()');
    vrai(!/<img|<script/i.test(await o.ev('mdToHtml("**gras** <img src=x onerror=alert(1)> <script>alert(1)</script>")')), 'mdToHtml laisse passer du HTML');
    egal(await o.ev('mcPropre(\'<p onclick="x()">a<b style="color:red">b</b><script>alert(1)</script><img src=x><span style="background-color: yellow">c</span></p>\')'),
      '<p>a<b>b</b><mark>c</mark></p>', 'mcPropre()');
  });

  await test('Calculatrice : 12 × 3 + 4 = 40', async () => {
    egal(await o.ev('openTool("calc"); calcClear(); ["1","2","*","3","+","4"].forEach(calcInput); calcEquals(); var r = document.getElementById("calc-result").textContent; closeTool("calc"); r'), '40');
  });

  o.sansErreur();
}

/* ══ LANCEMENT ══ */
const t0 = Date.now();
console.log('Tests ScolarIA' + (RAPIDE ? ' (rapides, sans navigateur)' : '') + (FILTRE ? ' — groupes « ' + FILTRE + ' »' : ''));
await testsCode();
if (!RAPIDE) {
  const exe = trouverNavigateur();
  if (!exe) { console.log('\n⚠️  Chrome ou Edge introuvable : tests du navigateur sautés (CHROME_PATH=… pour l\'indiquer)'); nbSautes++; }
  else {
    await chargerLibSupabase();
    if (!LIB_SUPABASE) console.log('\n⚠️  supabase-js pas encore copiée (il faut internet une fois) : une partie des tests est sautée');
    const srv = await serveurLocal();
    const nav = await lancerNavigateur(exe);
    try { await testsNavigateur(nav, 'http://127.0.0.1:' + srv.address().port); }
    catch (e) { echecs.push('arrêt imprévu'); console.log('\n❌ Les tests se sont arrêtés : ' + ((e && e.stack) || e)); }
    finally { await nav.fermer(); srv.close(); }
  }
}
const duree = ((Date.now() - t0) / 1000).toFixed(1);
console.log('\n' + (echecs.length ? '❌ ' + echecs.length + ' échec(s)' : '✅ Tout est bon') + ' — ' + nbOk + ' réussi(s)' + (nbSautes ? ', ' + nbSautes + ' sauté(s)' : '') + ' en ' + duree + ' s');
if (echecs.length) console.log('À corriger :\n' + echecs.map(e => '  • ' + e).join('\n'));
if (CAPTURES) console.log('Captures : tests/.out/');
process.exit(echecs.length ? 1 : 0);
