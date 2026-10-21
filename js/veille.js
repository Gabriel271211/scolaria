/* ScolarIA — js/veille.js
   Veille de contrôle : contrôles à venir, planning de révision IA, rappels (notifications).
   Chargé par scolaria-home-v2.html, dans l'ordre des <script> (une ligne exécutée au chargement
   ne peut utiliser que les fonctions des fichiers chargés AVANT celui-ci). */

/* ══════════════════════════════════════════════
   VEILLE DE CONTRÔLE
══════════════════════════════════════════════ */
/* Controles enregistres : localStorage sk_ctrl (synchronise).
   Une copie est mise dans le cache "scolaria-data" pour que le service
   worker (sw.js) puisse envoyer les rappels, meme app en arriere-plan. */
var VC_KEY = 'sk_ctrl';
var vcDraft = null;
var vcCurId = null;
var VC_MOIS = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];

function vcLoad() {
  try { var l = JSON.parse(localStorage.getItem(VC_KEY) || '[]'); return Array.isArray(l) ? l : []; } catch(e) { return []; }
}
function vcSave(list) {
  try { localStorage.setItem(VC_KEY, JSON.stringify(list)); } catch(e) {}
  scheduleSync();
  vcMirror();
  vcUpdateHome();
  /* les controles apparaissent aussi dans les devoirs */
  renderDevoirs();
  updateHomeStats();
}
function vcGet(id) { return vcLoad().filter(function(c) { return c.id === id; })[0] || null; }
function vcPut(c) {
  var l = vcLoad(), found = false;
  l = l.map(function(x) { if (x.id === c.id) { found = true; return c; } return x; });
  if (!found) l.push(c);
  vcSave(l);
}

/* ── Dates (toujours en heure locale) ── */
function vcYmd(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
function vcDate(ymd) { var p = ymd.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
function vcAddDays(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; }
function vcDiff(ymd) {
  var t = new Date(); t = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  return Math.round((vcDate(ymd) - t) / 864e5);
}
function vcCountdown(ymd) {
  var n = vcDiff(ymd);
  if (n < 0) return 'Passé';
  if (n === 0) return 'Aujourd\'hui';
  if (n === 1) return 'Demain';
  return 'Dans ' + n + ' jours';
}
function vcLongDate(ymd) {
  var s = vcDate(ymd).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function vcDayLabel(ymd) {
  var n = vcDiff(ymd);
  if (n === 0) return 'Aujourd\'hui';
  if (n === 1) return 'Demain';
  var d = vcDate(ymd);
  return d.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '') + ' ' + d.getDate() + ' ' + VC_MOIS[d.getMonth()];
}

/* Jours de revision : d'aujourd'hui (demain si apres 21h) a la veille, 7 max */
function vcRevDates(ymd) {
  var now = new Date();
  var start = vcAddDays(now, now.getHours() >= 21 ? 1 : 0);
  var end = vcAddDays(vcDate(ymd), -1);
  if (end < start) return [vcYmd(new Date())];
  var out = [];
  for (var d = start; d <= end; d = vcAddDays(d, 1)) out.push(vcYmd(d));
  return out.slice(-7);
}

/* ── Ouverture / fermeture ── */
function openVeilleControle(id) {
  document.getElementById('vc-modal').classList.add('open');
  if (id && vcGet(id)) vcShowDetail(id); else vcShowList();
  setTimeout(navSync, 0);   /* ouverture possible depuis une notification (sans appui) */
}
function closeVeilleControle() {
  document.getElementById('vc-modal').classList.remove('open');
}
function vcSetHeader(title, back) {
  document.getElementById('vc-ttl').textContent = title;
  document.getElementById('vc-back').style.display = back ? '' : 'none';
}

/* ── Liste ── */
function vcShowList() {
  vcCurId = null;
  vcSetHeader('Mes contrôles', false);
  /* on oublie les controles passes depuis plus de 7 jours */
  var all = vcLoad();
  var list = all.filter(function(c) { return vcDiff(c.date) >= -7; });
  if (list.length !== all.length) vcSave(list);
  list.sort(function(a, b) {
    var pa = vcDiff(a.date) < 0, pb = vcDiff(b.date) < 0;
    if (pa !== pb) return pa ? 1 : -1;
    return a.date < b.date ? -1 : 1;
  });
  var html = '';
  if (!list.length) {
    html += '<div class="vc-empty"><b>Aucun contrôle prévu</b>Ajoute ton prochain contrôle : ScolarIA prépare ton planning de révision et te le rappelle.</div>';
  } else {
    html += '<div class="vc-list">';
    list.forEach(function(c) {
      var d = vcDate(c.date), n = vcDiff(c.date);
      var suj = (c.sujets && c.sujets.length) ? c.sujets.join(' · ') : 'Tout le chapitre';
      html += '<div class="vc-item' + (n < 0 ? ' past' : '') + '" onclick="vcShowDetail(\'' + c.id + '\')">' +
        '<div class="vc-date"><b>' + d.getDate() + '</b><span>' + VC_MOIS[d.getMonth()] + '</span></div>' +
        '<div class="vc-item-main"><div class="vc-item-mat">' + esc(c.mat) + (c.rappel ? ' <span style="font-size:12px">🔔</span>' : '') + '</div>' +
        '<div class="vc-item-suj">' + esc(suj) + '</div></div>' +
        '<span class="vc-pill' + (n >= 0 && n <= 2 ? ' soon' : '') + '">' + vcCountdown(c.date) + '</span>' +
      '</div>';
    });
    html += '</div>';
  }
  html += '<button class="rev-go-btn" onclick="vcShowForm()">+ Nouveau contrôle</button>';
  document.getElementById('vc-view').innerHTML = html;
}

/* ── Formulaire ── */
function vcShowForm() {
  vcDraft = { mat: '', date: vcYmd(vcAddDays(new Date(), 1)), heure: '', sujets: [], pending: '',
              rappel: vcNotifSupported() && Notification.permission !== 'denied' };
  vcSetHeader('Nouveau contrôle', true);
  vcRenderForm();
  setTimeout(function() { var m = document.getElementById('vc-mat'); if (m) m.focus(); }, 50);
}
function vcRenderForm() {
  var dr = vcDraft;
  var quick = [[1, 'Demain'], [2, 'Après-demain'], [7, 'Dans 1 semaine']];
  var chips = quick.map(function(q) {
    var y = vcYmd(vcAddDays(new Date(), q[0]));
    return '<button class="vc-chip' + (dr.date === y ? ' on' : '') + '" onclick="vcSetDate(\'' + y + '\')">' + q[1] + '</button>';
  }).join('');
  var tags = dr.sujets.map(function(s, i) {
    return '<span class="vc-tag">' + esc(s) + '<button onclick="vcRemoveSujet(' + i + ')" aria-label="Retirer">&times;</button></span>';
  }).join('');
  document.getElementById('vc-view').innerHTML =
    '<div class="vc-field"><label class="vc-inp-lbl">Matière</label>' +
      '<input class="vc-inp" id="vc-mat" type="text" maxlength="40" placeholder="ex : Maths, Histoire, SVT…" value="' + esc(dr.mat) + '" oninput="vcDraft.mat=this.value"></div>' +
    '<div class="vc-field"><label class="vc-inp-lbl">Date du contrôle</label>' +
      '<div class="vc-chips">' + chips + '</div>' +
      '<div class="vc-row"><input class="vc-inp" id="vc-date" type="date" min="' + vcYmd(new Date()) + '" value="' + dr.date + '" onchange="vcSetDate(this.value)">' +
      '<input class="vc-inp" id="vc-heure" type="time" style="max-width:120px" value="' + dr.heure + '" onchange="vcDraft.heure=this.value" aria-label="Heure (facultatif)"></div>' +
      '<div class="vc-hint">' + vcLongDate(dr.date) + ' · ' + vcCountdown(dr.date).toLowerCase() + ' · heure facultative</div></div>' +
    '<div class="vc-field"><label class="vc-inp-lbl">Sujets du contrôle</label>' +
      '<div class="vc-row"><input class="vc-inp" id="vc-suj" type="text" maxlength="60" placeholder="ex : Théorème de Pythagore" value="' + esc(dr.pending || '') + '" oninput="vcDraft.pending=this.value" onkeydown="if(event.key===\'Enter\'){event.preventDefault();vcAddSujet();}">' +
      '<button class="vc-add" onclick="vcAddSujet()">Ajouter</button></div>' +
      (tags ? '<div class="vc-tags">' + tags + '</div>' : '<div class="vc-hint">Ajoute un ou plusieurs chapitres. Vide = tout le chapitre en cours.</div>') + '</div>' +
    '<div class="vc-switch-row" onclick="vcDraft.rappel=!vcDraft.rappel;vcRenderForm()">' +
      '<div><b>Rappels</b><span>La veille au soir, le matin du contrôle et les jours de révision</span></div>' +
      '<div class="vc-switch' + (dr.rappel ? ' on' : '') + '"></div></div>' +
    '<button class="rev-go-btn" onclick="vcCreate()">Créer mon planning</button>';
}
function vcSetDate(y) {
  if (!y) return;
  vcDraft.date = y;
  vcRenderForm();
}
function vcAddSujet() {
  var inp = document.getElementById('vc-suj');
  var v = (inp && inp.value || '').trim();
  if (!v) return;
  if (vcDraft.sujets.indexOf(v) === -1 && vcDraft.sujets.length < 8) vcDraft.sujets.push(v);
  vcDraft.pending = '';
  vcRenderForm();
  var n = document.getElementById('vc-suj'); if (n) n.focus();
}
function vcRemoveSujet(i) { vcDraft.sujets.splice(i, 1); vcRenderForm(); }

function vcCreate() {
  var dr = vcDraft;
  dr.mat = (dr.mat || '').trim();
  if (!dr.mat) { toast('Indique la matière'); var m = document.getElementById('vc-mat'); if (m) m.focus(); return; }
  if (!dr.date || vcDiff(dr.date) < 0) { toast('Choisis une date à venir'); return; }
  /* un sujet tape mais pas encore ajoute compte quand meme */
  var pending = (dr.pending || '').trim();
  if (pending && dr.sujets.indexOf(pending) === -1) dr.sujets.push(pending);
  dr.pending = '';
  var c = { id: 'c' + Date.now(), mat: dr.mat, date: dr.date, heure: dr.heure || '', sujets: dr.sujets.slice(), rappel: !!dr.rappel, plan: null, done: {} };
  vcPut(c);
  if (c.rappel) vcEnableNotifs(c.id);
  vcGenPlan(c.id);      /* marque "en preparation" tout de suite (avant le 1er await)... */
  vcShowDetail(c.id);   /* ...donc le detail affiche le chargement */
}

/* ── Planning IA ── */
var _vcGen = {};   /* plannings en cours de generation (id -> true) */
async function vcGenPlan(id) {
  var c = vcGet(id); if (!c || _vcGen[id]) return;
  _vcGen[id] = true;
  renderDevoirs();   /* la carte du devoir passe a "Planning en preparation" */
  var dates = vcRevDates(c.date);
  var box = document.getElementById('vc-plan-box');
  if (box) box.innerHTML = '<div class="rev-loading" style="padding:34px 20px"><div class="rev-spin"></div><div class="rev-loading-txt">ScolarIA prépare ton planning…</div></div>';
  var prompt = 'Planning de revision pour un controle de ' + c.mat + ' le ' + vcLongDate(c.date) + '.\n' +
    (c.sujets.length > 1
      ? 'Le controle porte sur PLUSIEURS sujets : ' + c.sujets.join(' ; ') + '. Repartis-les intelligemment sur les jours (les plus difficiles en premier) et termine par une revision qui melange tout.\n'
      : c.sujets.length === 1 ? 'Sujet du controle : ' + c.sujets[0] + '.\n' : 'Sujet : le chapitre en cours de ' + c.mat + '.\n') +
    'Il y a exactement ' + dates.length + ' jour(s) de revision : ' + dates.map(function(y, i) { return 'JOUR ' + (i + 1) + ' = ' + vcLongDate(y); }).join(', ') + '.\n' +
    (dates.length > 1 ? 'Le dernier jour = revision generale et auto-test, pas de nouvelle notion.\n' : 'Un seul jour : va a l essentiel (notions cles, methodes, un exercice type).\n') +
    'FORMAT EXACT, rien avant ni apres :\nJOUR 1 | titre court\n- tache precise\n- tache precise\n\nJOUR 2 | titre court\n- ...\n' +
    '2 a 4 taches concretes par jour (15 mots max chacune : apprendre les definitions de..., refaire l exercice type sur..., 10 flashcards sur...).';
  try {
    /* callGroq leve une erreur si la reponse est vide : jamais de planning "" */
    var reply = await callGroq([{ role: 'system', content: SCOLARIA_SYSTEM }, { role: 'user', content: prompt }], 1400, { niveau: 'revision' });
    delete _vcGen[id];
    c = vcGet(id); if (!c) return;
    c.plan = vcParsePlan(reply, dates) || reply;
    c.done = {};
    delete c.planErr;
    vcPut(c);
  } catch(e) {
    delete _vcGen[id];
    c = vcGet(id); if (!c) return;
    if (c.plan) toast('Planning non refait : ' + e.message);   /* on garde l'ancien */
    else { c.planErr = e.message; vcPut(c); }                  /* visible meme si l'eleve etait ailleurs */
  }
  if (vcCurId === id) vcShowDetail(id);
}
function vcParsePlan(txt, dates) {
  var days = [], cur = null;
  String(txt || '').split('\n').forEach(function(l) {
    l = l.trim();
    var m = l.replace(/\*\*/g, '').match(/^#*\s*JOUR\s*(\d+)\s*[|:—–-]+\s*(.+)$/i);
    if (m) { cur = { titre: m[2].trim(), taches: [] }; days.push(cur); }
    else if (cur && /^[-•*]\s+/.test(l)) cur.taches.push(l.replace(/^[-•*]\s+/, '').replace(/\*\*/g, ''));
  });
  days = days.slice(0, dates.length).filter(function(d) { return d.taches.length; });
  days.forEach(function(d, i) { d.date = dates[i]; });
  return days.length ? days : null;
}

/* ── Detail d'un controle ── */
function vcShowDetail(id) {
  var c = vcGet(id); if (!c) { vcShowList(); return; }
  vcCurId = id;
  vcSetHeader('Contrôle', true);
  var n = vcDiff(c.date);
  var html = '<div class="vc-hero"><div class="vc-hero-top"><div>' +
      '<div class="vc-hero-mat">' + esc(c.mat) + '</div>' +
      '<div class="vc-hero-date">' + vcLongDate(c.date) + (c.heure ? ' · ' + esc(c.heure.replace(':', 'h')) : '') + '</div></div>' +
      '<span class="vc-pill' + (n >= 0 && n <= 2 ? ' soon' : '') + '">' + vcCountdown(c.date) + '</span></div>';
  if (c.sujets.length) html += '<div class="vc-tags" style="margin-top:12px">' + c.sujets.map(function(s) { return '<span class="vc-tag" style="padding-right:12px">' + esc(s) + '</span>'; }).join('') + '</div>';
  var total = 0, fait = 0;
  if (Array.isArray(c.plan)) c.plan.forEach(function(d, di) { d.taches.forEach(function(t, ti) { total++; if (c.done[di + '-' + ti]) fait++; }); });
  if (total) {
    var pc = Math.round(fait / total * 100);
    html += '<div class="vc-prog-lbl"><span>Révisions</span><span>' + fait + '/' + total + ' · ' + pc + '%</span></div><div class="vc-prog"><i style="width:' + pc + '%"></i></div>';
  }
  html += '</div><div class="vc-sec">Planning</div><div id="vc-plan-box">';
  if (Array.isArray(c.plan)) {
    c.plan.forEach(function(d, di) {
      var dn = vcDiff(d.date);
      html += '<div class="vc-day' + (dn === 0 ? ' today' : dn < 0 ? ' over' : '') + '"><div class="vc-day-lbl">' + vcDayLabel(d.date) + '</div>' +
        '<div class="vc-day-ttl">' + esc(d.titre) + '</div>';
      d.taches.forEach(function(t, ti) {
        var k = di + '-' + ti, ok = !!c.done[k];
        html += '<div class="vc-task' + (ok ? ' done' : '') + '" onclick="vcToggleTask(\'' + c.id + '\',\'' + k + '\')"><i>' + (ok ? '&#10003;' : '') + '</i><span>' + esc(t) + '</span></div>';
      });
      html += '</div>';
    });
  } else if (typeof c.plan === 'string' && c.plan) {
    html += '<div class="vc-plan rev-ia-result">' + mdToHtml(c.plan) + '</div>';
  } else if (_vcGen[c.id]) {
    html += '<div class="rev-loading" style="padding:34px 20px"><div class="rev-spin"></div><div class="rev-loading-txt">ScolarIA prépare ton planning…</div></div>';
  } else {
    html += '<div class="rev-err-box">' + esc(c.planErr || 'Le planning n\'a pas encore été créé.') +
      '<br><button onclick="vcGenPlan(\'' + c.id + '\')">Créer le planning</button></div>';
  }
  html += '</div>';
  html += '<div class="vc-switch-row" style="margin-top:6px" onclick="vcToggleRappel(\'' + c.id + '\')">' +
      '<div><b>Rappels</b><span>' + (c.rappel ? 'Activés pour ce contrôle' : 'Désactivés') + '</span></div>' +
      '<div class="vc-switch' + (c.rappel ? ' on' : '') + '"></div></div>';
  html += '<div class="vc-actions">' +
    '<button class="rev-go-btn" style="margin-top:0" onclick="vcCreateFlash(\'' + c.id + '\')">Flashcards sur ces sujets</button>' +
    '<button class="vc-btn2" onclick="vcGenPlan(\'' + c.id + '\')">Refaire le planning</button>' +
    '<button class="vc-btn2 del" onclick="vcDelete(\'' + c.id + '\')">Supprimer ce contrôle</button></div>';
  document.getElementById('vc-view').innerHTML = html;
}
function vcToggleTask(id, k) {
  var c = vcGet(id); if (!c) return;
  c.done = c.done || {};
  if (c.done[k]) delete c.done[k]; else { c.done[k] = 1; markActivity(); }
  vcPut(c);
  vcShowDetail(id);
}
function vcToggleRappel(id) {
  var c = vcGet(id); if (!c) return;
  c.rappel = !c.rappel;
  vcPut(c);
  vcShowDetail(id);
  if (c.rappel) vcEnableNotifs(id);
}
function vcDelete(id) {
  if (!confirm('Supprimer ce contrôle ?')) return;
  vcSave(vcLoad().filter(function(c) { return c.id !== id; }));
  vcShowList();
}
function vcCreateFlash(id) {
  var c = vcGet(id); if (!c) return;
  closeVeilleControle();
  goSec('s-revisions', document.querySelector('.nav-btn[onclick*=s-revisions]'));
  setTimeout(function() {
    var inp = document.getElementById('rev-topic');
    if (inp) inp.value = c.mat + (c.sujets.length ? ' : ' + c.sujets.join(', ') : '');
    revPickType('flashcards');
  }, 150);
}

/* Carte de l'accueil : prochain controle */
function vcUpdateHome() {
  var el = document.getElementById('vc-home-desc');
  if (!el) return;
  var next = vcLoad().filter(function(c) { return vcDiff(c.date) >= 0; }).sort(function(a, b) { return a.date < b.date ? -1 : 1; })[0];
  el.textContent = next ? 'Prochain : ' + next.mat + ' · ' + vcCountdown(next.date).toLowerCase() : 'Planning de révision + rappels avant chaque contrôle';
}

/* ── Notifications ──
   Les regles d'envoi sont dans sw.js (checkCtrl) : la page copie les controles
   dans le cache puis demande au service worker de verifier. */
function vcNotifSupported() { return 'Notification' in window && 'serviceWorker' in navigator; }
function vcMirror() {
  if (!('caches' in window)) return Promise.resolve();
  var data = JSON.stringify(vcLoad().filter(function(c) { return c.rappel; }));
  return caches.open('scolaria-data').then(function(cache) {
    return cache.put(new URL('__ctrl.json', location.href).href, new Response(data, { headers: { 'Content-Type': 'application/json' } }));
  }).catch(function() {});
}
function vcCheckNow() {
  if (!vcNotifSupported() || Notification.permission !== 'granted') return;
  vcMirror().then(function() { return navigator.serviceWorker.ready; }).then(function(reg) {
    if (reg.active) reg.active.postMessage('ctrl-check');
  }).catch(function() {});
}
/* Rappels impossibles : on remet l'interrupteur sur OFF pour ne pas promettre un rappel qui n'arrivera pas */
function vcRappelOff(id, msg) {
  var c = vcGet(id);
  if (c && c.rappel) { c.rappel = false; vcPut(c); }
  if (vcCurId === id) vcShowDetail(id);
  toast(msg, 4500);
}
function vcEnableNotifs(id) {
  var c = vcGet(id); if (!c) return;
  if (!vcNotifSupported()) { vcRappelOff(id, 'Ton navigateur ne gère pas les notifications'); return; }
  if (Notification.permission === 'denied') { vcRappelOff(id, 'Notifications bloquées : autorise-les dans les réglages de Chrome'); return; }
  var ask = Notification.permission === 'granted' ? Promise.resolve('granted') : Notification.requestPermission();
  ask.then(function(p) {
    if (p !== 'granted') { vcRappelOff(id, 'Rappels désactivés : notifications refusées'); return; }
    navigator.serviceWorker.ready.then(function(reg) {
      reg.showNotification('Rappels activés 🔔', {
        body: 'Contrôle de ' + c.mat + ' · ' + vcLongDate(c.date).toLowerCase() + '. ScolarIA te préviendra.',
        icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: 'ctrl-on-' + c.id
      });
      /* Verification en arriere-plan (Chrome Android, app installee) */
      if ('periodicSync' in reg) reg.periodicSync.register('ctrl-reminders', { minInterval: 4 * 3600 * 1000 }).catch(function() {});
    });
    vcCheckNow();
  });
}
var _vcTimer = null;
function vcInit() {
  vcUpdateHome();
  vcCheckNow();
  if (!_vcTimer) {
    _vcTimer = setInterval(vcCheckNow, 10 * 60 * 1000);
    document.addEventListener('visibilitychange', function() { if (!document.hidden) { vcCheckNow(); vcUpdateHome(); } });
    if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', function(ev) {
      if (ev.data && ev.data.type === 'open-ctrl') openVeilleControle(ev.data.id);
    });
  }
  /* Ouverture depuis une notification : ?ctrl=<id> */
  var m = location.search.match(/[?&]ctrl=([\w-]+)/);
  if (m) {
    openVeilleControle(m[1]);
    try { history.replaceState(null, '', location.pathname); } catch(e) {}
  }
}
