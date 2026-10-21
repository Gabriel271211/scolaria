/* ScolarIA — js/devoirs.js
   Devoirs : liste, vraie date de rendu, glisser pour marquer fait,
   fenêtre « nouveau devoir », aide IA, minuteur (= Pomodoro).
   Chargé par scolaria-home-v2.html, dans l'ordre des <script> (une ligne exécutée au chargement
   ne peut utiliser que les fonctions des fichiers chargés AVANT celui-ci). */

/* ══ DEVOIRS ══
   Un devoir : { id, mat, desc, due: 'AAAA-MM-JJ' (vraie date de rendu, '' si inconnue),
   date: libelle (anciens devoirs / secours), done }. Le libelle du jour (« Demain »…) et la
   couleur d'urgence sont recalcules chaque jour a partir de due. */
let devoirs = [], dvId = 1, dvShowDone = false;

function loadDevoirs() {
  try {
    const s = localStorage.getItem('sk_dv');
    devoirs = s ? JSON.parse(s) : [];
    if (!Array.isArray(devoirs)) devoirs = [];
    /* anciens devoirs : une date precise ecrite en texte (« lundi 17 mars ») devient une vraie date */
    devoirs.forEach(function(d) {
      if (d.due) return;
      var n = dvParseDate(String(d.date || '').toLowerCase());
      if (n !== null) d.due = vcYmd(vcAddDays(new Date(), n));
    });
    dvId = devoirs.reduce(function(m, d) { return Math.max(m, +d.id || 0); }, 0) + 1;
  } catch(e) { devoirs = []; }
}

function saveDv() { try { localStorage.setItem('sk_dv', JSON.stringify(devoirs)); } catch(e) {} scheduleSync(); }

/* Texte (« demain », « vendredi », « 17 mars », « 17/03 », « 2026-11-03 ») -> 'AAAA-MM-JJ' ('' si inconnu) */
function dvDueDe(texte) {
  var s = String(texte || '').toLowerCase().trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (!s || s === '?') return '';
  var n = dvLabelRank(s);
  return n === 99 ? '' : vcYmd(vcAddDays(new Date(), n));
}
function dvJours(d) { return d.due ? vcDiff(d.due) : null; }
/* Urgence calculee depuis la vraie date (avant : figee le jour ou le devoir etait ajoute) */
function dvUrg(d) {
  var n = dvJours(d);
  if (n === null) return d.urg || 'semaine';
  return n <= 1 ? 'urgent' : n <= 7 ? 'semaine' : 'plus';
}
/* Groupe d'affichage : { k: libelle, r: rang pour le tri } */
function dvGroupe(d) {
  var n = dvJours(d);
  if (n === null) {
    var k = d.date && d.date !== '?' ? d.date : 'Sans date';
    return { k: k, r: k === 'Sans date' ? 999 : dvLabelRank(k) };
  }
  if (n < 0) return { k: 'En retard', r: -1 };
  return { k: dvCtrlLabel(d.due), r: n };
}

/* Rang d'un libelle de jour ("Demain", "Vendredi"...) : nombre de jours d'ici la */
function dvLabelRank(label) {
  var s = String(label || '').toLowerCase();
  if (s.indexOf('aujourd') !== -1) return 0;
  if (s.indexOf('après-demain') !== -1 || s.indexOf('apres-demain') !== -1) return 2;
  if (s.indexOf('demain') !== -1) return 1;
  /* Date precise ("lundi 17 mars", "17 mars", "17/03") : vrai nombre de jours */
  var exact = dvParseDate(s);
  if (exact !== null) return exact;
  var noms = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  for (var i = 0; i < 7; i++) {
    if (s.indexOf(noms[i]) === 0) return ((i - new Date().getDay() + 7) % 7) || 7;
  }
  return 99;
}

/* "17 mars" / "17/03" -> jours d'ici la (null si pas de date). Sans annee : la prochaine occurrence */
function dvParseDate(s) {
  var mois = ['janv','févr','mars','avr','mai','juin','juil','août','sept','oct','nov','déc'];
  var alt  = { 'fevr':1, 'aout':7, 'dec':11 };
  var j = null, m = -1, r;
  if ((r = s.match(/\b(\d{1,2})\s*(?:er)?\s+([a-zéèûô]+)/))) {
    j = +r[1];
    var w = r[2].replace('.', '');
    for (var k = 0; k < 12; k++) if (w.indexOf(mois[k]) === 0) { m = k; break; }
    if (m < 0) for (var a in alt) if (w.indexOf(a) === 0) { m = alt[a]; break; }
  } else if ((r = s.match(/\b(\d{1,2})\/(\d{1,2})\b/))) {
    j = +r[1]; m = +r[2] - 1;
  }
  if (j === null || m < 0 || m > 11 || j < 1 || j > 31) return null;
  var now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var d = new Date(now.getFullYear(), m, j);
  /* plus de 2 mois dans le passe = annee prochaine (ex : "5 janvier" vu en octobre) */
  if ((d - today) / 864e5 < -60) d = new Date(now.getFullYear() + 1, m, j);
  return Math.round((d - today) / 864e5);
}

/* Controles a venir (Veille de controle) affiches parmi les devoirs */
function dvControles() {
  if (typeof vcLoad !== 'function') return [];
  return vcLoad().filter(function(c) { return vcDiff(c.date) >= 0; });
}
function dvCtrlLabel(ymd) {
  var n = vcDiff(ymd);
  if (n === 0) return 'Aujourd\'hui';
  if (n === 1) return 'Demain';
  var d = vcDate(ymd);
  var s = d.toLocaleDateString('fr-FR', n < 7 ? { weekday: 'long' } : { weekday: 'long', day: 'numeric', month: 'long' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function dvActiveCount() { return devoirs.filter(function(d) { return !d.done; }).length + dvControles().length; }

function buildCtrlCard(c) {
  var total = 0, fait = 0;
  if (Array.isArray(c.plan)) c.plan.forEach(function(d, di) { d.taches.forEach(function(t, ti) { total++; if (c.done && c.done[di + '-' + ti]) fait++; }); });
  var n = vcDiff(c.date);
  var suj = (c.sujets && c.sujets.length) ? c.sujets.join(' · ') : 'Tout le chapitre';
  var prog = total
    ? '<div class="dv-ctrl-prog"><div class="vc-prog"><i style="width:' + Math.round(fait / total * 100) + '%"></i></div><span>Révisions ' + fait + '/' + total + '</span></div>'
    : '<div class="dv-ctrl-prog"><span>' + (typeof _vcGen !== 'undefined' && _vcGen[c.id] ? 'Planning en préparation' : 'Planning à créer') + '</span></div>';
  return '<div class="dvc dv-ctrl" style="border-left-color:#e84040" onclick="openVeilleControle(\'' + c.id + '\')">' +
    '<div class="dvm">' +
      '<div class="dv-ctrl-ic"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>' +
      '<div class="dvi">' +
        '<div class="dvm-m"><span class="dv-ctrl-tag">Contrôle</span>' + esc(c.mat) + (c.heure ? ' <span class="dv-ctrl-h">' + esc(c.heure.replace(':', 'h')) + '</span>' : '') + '</div>' +
        '<div class="dvm-d">' + esc(suj) + '</div>' + prog +
      '</div>' +
      '<div class="dvr"><span class="vc-pill' + (n <= 2 ? ' soon' : '') + '">' + vcCountdown(c.date) + '</span>' +
        '<svg class="dv-ctrl-chev" viewBox="0 0 8 14"><path d="M1.5 1.5L6.5 7L1.5 12.5"/></svg></div>' +
    '</div></div>';
}

function renderDevoirs() {
  const el = document.getElementById('dv-by-day');
  if (!el) return;
  const active = devoirs.filter(d => !d.done);
  const done   = devoirs.filter(d => d.done);
  const ctrls  = dvControles();
  if (!active.length && !done.length && !ctrls.length) {
    el.innerHTML = `<div class="dv-empty">
      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      <p>Aucun devoir !</p><span>Tout est à jour.</span>
    </div>`;
    return;
  }
  const urgColor = {urgent:'#ef4444', semaine:'#f59e0b', plus:'#16a34a'};
  const groups = {}, ctrlGroups = {}, rankOf = {};
  active.forEach(d => {
    const g = dvGroupe(d);
    if(!groups[g.k]) groups[g.k]=[];
    groups[g.k].push(d);
    if (rankOf[g.k] === undefined || g.r < rankOf[g.k]) rankOf[g.k] = g.r;
  });
  /* les controles rejoignent le groupe de leur jour, places en premier */
  ctrls.sort((a,b) => a.date < b.date ? -1 : 1).forEach(c => {
    const k = dvCtrlLabel(c.date);
    if(!groups[k]) groups[k]=[];
    if(!ctrlGroups[k]) ctrlGroups[k]=[];
    ctrlGroups[k].push(c);
    rankOf[k] = vcDiff(c.date);
  });
  const days = Object.keys(groups).sort((a,b) => rankOf[a] - rankOf[b]);
  let html = days.map(day =>
    `<div class="dv-day-group">
      <div class="dv-day-hdr"><div class="dv-day-line"></div><span class="dv-day-lbl"${day === 'En retard' ? ' style="color:var(--danger)"' : ''}>${esc(day)}</span><div class="dv-day-line"></div></div>
      ${(ctrlGroups[day]||[]).map(buildCtrlCard).join('')}
      ${groups[day].map(d => buildDvCard(d, urgColor)).join('')}
    </div>`
  ).join('');
  if (dvShowDone && done.length) {
    html += `<div class="dv-day-group">
      <div class="dv-day-hdr"><div class="dv-day-line"></div><span class="dv-day-lbl" style="color:var(--success)">Terminés</span><div class="dv-day-line"></div></div>
      ${done.map(d => buildDvCard(d, urgColor)).join('')}
    </div>`;
  }
  el.innerHTML = html;
}

function buildDvCard(d, urgColor) {
  const urg = dvUrg(d);
  const color = urgColor[urg] || 'var(--bord)';
  return `<div class="dvc${d.done?' done':''}" id="dvc_${+d.id}" data-urg="${urg}" style="border-left-color:${color}" onclick="this.classList.toggle('expanded')">
    <div class="dvsw"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
    <div class="dvm">
      <div class="dvck${d.done?' on':''}" onclick="event.stopPropagation();toggleDv(${+d.id})">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="dvi">
        <div class="dvm-m">${esc(d.mat)}</div>
        <div class="dvm-d">${esc(d.desc)}</div>
      </div>
      <div class="dvr">
        <button class="dv-btn dv-tm" onclick="event.stopPropagation();openTm(${+d.id})" title="Minuteur" aria-label="Minuteur">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </button>
        <button class="dv-btn dv-ai" onclick="event.stopPropagation();dvAiHelpOne(${+d.id})" title="Aide IA" aria-label="Aide de l'IA">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </button>
        <button class="dv-btn dv-del" onclick="event.stopPropagation();delDv(${+d.id})" title="Supprimer" aria-label="Supprimer">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  </div>`;
}

function toggleDv(id) {
  var d = devoirs.find(function(x){ return x.id === id; });
  if (d) {
    d.done = !d.done;
    saveDv();
    renderDevoirs();
    if (d.done) markActivity(); else updateStreak();
    updateHomeProgression();
    var dc = document.getElementById('home-devoirs-count');
    if (dc) dc.textContent = dvActiveCount();
  }
}
function delDv(id) { devoirs = devoirs.filter(d => d.id !== id); saveDv(); renderDevoirs(); updateHomeStats(); }
function filterDone() { dvShowDone = !dvShowDone; renderDevoirs(); }

/* ── SWIPE POUR MARQUER FAIT (avec résistance + retour si < moitié) ── */
(function initDvSwipe(){
  var sx=0, sy=0, card=null, row=null, bg=null, w=0, drag=false, decided=false, horiz=false;
  function reset(){ card=null; row=null; bg=null; drag=false; decided=false; horiz=false; }
  function onStart(e){
    var c = e.target.closest('.dvc');
    if (!c) return;
    if (e.target.closest('.dv-btn') || e.target.closest('.dvck')) return; /* boutons + coche : ancien système */
    if (c.classList.contains('dv-ctrl')) return; /* un controle ne se coche pas : on l'ouvre */
    var t = e.touches[0];
    sx = t.clientX; sy = t.clientY;
    card = c; row = c.querySelector('.dvm'); bg = c.querySelector('.dvsw');
    w = c.offsetWidth; drag = true; decided = false; horiz = false;
    if (row) row.style.transition = 'none';
  }
  function onMove(e){
    if (!drag || !row) return;
    var t = e.touches[0];
    var dx = t.clientX - sx, dy = t.clientY - sy;
    if (!decided) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      horiz = Math.abs(dx) > Math.abs(dy);
      decided = true;
      if (!horiz) { drag = false; return; } /* scroll vertical : on laisse */
    }
    if (dx < 0) dx = 0;            /* swipe vers la droite uniquement */
    e.preventDefault();
    var move = dx * 0.65;          /* résistance : il faut pousser plus loin */
    row.style.transform = 'translateX(' + move + 'px)';
    if (bg) bg.style.opacity = Math.min(1, dx / (w * 0.5));
  }
  function onEnd(e){
    if (!drag || !row) { reset(); return; }
    var dx = e.changedTouches[0].clientX - sx;
    var _card = card, _row = row, _bg = bg, _w = w, _horiz = horiz;
    _row.style.transition = 'transform .25s cubic-bezier(.4,0,.2,1)';
    if (_horiz && dx >= _w * 0.5) {
      _row.style.transform = 'translateX(' + _w + 'px)';
      if (_bg) _bg.style.opacity = 1;
      var id = parseInt(_card.id.replace('dvc_', ''), 10);
      haptic(35);
      setTimeout(function(){ toggleDv(id); }, 200);
    } else {
      _row.style.transform = 'translateX(0)';
      if (_bg) _bg.style.opacity = 0;
    }
    reset();
  }
  function bind(){
    var c = document.getElementById('dv-by-day');
    if (!c) return;
    c.addEventListener('touchstart', onStart, { passive: true });
    c.addEventListener('touchmove',  onMove,  { passive: false });
    c.addEventListener('touchend',   onEnd,   { passive: true });
    c.addEventListener('touchcancel',onEnd,   { passive: true });
  }
  if (document.readyState !== 'loading') bind();
  else document.addEventListener('DOMContentLoaded', bind);
})();

function todayStr() {
  var d = new Date();
  var days = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  var months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  return days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

async function scanDevoir(e) {
  var f = e.target.files[0]; if (!f) return;
  e.target.value = '';
  toast('⏳ Analyse de la photo...', 8000);
  /* photo reduite : une photo brute de telephone depasse la limite d'image de Groq */
  var dataUrl = await imageReduiteP(f);
  if (!dataUrl) { toast('Impossible de lire cette image'); return; }
  var sysPrompt = 'Tu lis des captures d\'agendas scolaires (Pronote, ENT…) et des photos de cahiers de textes. Aujourd\'hui on est ' + todayStr() + ' (' + vcYmd(new Date()) + '). ' +
    'Réponds UNIQUEMENT avec un JSON valide : {"devoirs":[{"mat":"Maths","desc":"description courte","date":"AAAA-MM-JJ"}]}. ' +
    '"date" = le jour où le devoir est à rendre, au format AAAA-MM-JJ (calcule-le à partir de la date du jour si l\'agenda écrit « pour lundi », « demain »…), ou "" s\'il est inconnu. Si aucun devoir n\'est visible : {"devoirs":[]}.';
  try {
    /* JSON strict attendu : pas de bloc niveau */
    var text = await callGroqVision([
      { role: 'system', content: sysPrompt },
      { role: 'user', content: [
        { type: 'image_url', image_url: { url: dataUrl } },
        { type: 'text', text: 'Extrais tous les devoirs et leurs dates de rendu visibles sur cette image.' }
      ]}
    ], 1200, { noNiveau: true });
    var parsed = null;
    var jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) { try { parsed = JSON.parse(jsonMatch[0]); } catch(e2) {} }
    if (!parsed) { try { parsed = JSON.parse(text); } catch(e2) {} }
    if (!parsed || !Array.isArray(parsed.devoirs)) throw new Error('Réponse inattendue, réessaie avec une photo plus nette');
    if (parsed.devoirs.length) {
      parsed.devoirs.forEach(function(d) {
        var due = dvDueDe(d.date);
        devoirs.push({ id: dvId++, mat: String(d.mat || 'Divers').slice(0, 40), desc: String(d.desc || '').slice(0, 300),
                       date: due ? dvCtrlLabel(due) : String(d.date || '?'), due: due, done: false });
      });
      saveDv(); renderDevoirs(); updateHomeStats();
      goSec('s-devoirs', document.querySelector('.nav-btn[onclick*="s-devoirs"]'));
      toast('✅ ' + parsed.devoirs.length + ' devoir(s) importé(s) !');
    } else {
      toast('ℹ️ Aucun devoir détecté sur la photo');
    }
  } catch(err) {
    toast('❌ ' + String(err.message).slice(0, 80), 4000);
    console.error('scanDevoir :', err.message);
  }
}

function dvAiHelpOne(id) {
  var d = devoirs.find(function(x){ return x.id === id; }); if (!d) return;
  var quand = d.due ? dvCtrlLabel(d.due).toLowerCase() : (d.date && d.date !== '?' ? d.date : '');
  var inp = document.getElementById('chat-input');
  if (inp) inp.value = 'Aide-moi pour ce devoir : ' + d.mat + ' — "' + d.desc + '"' + (quand ? ' (à rendre ' + quand + ')' : '') + '.';
  goSec('s-chat', document.querySelector('.nav-btn[onclick*="s-chat"]'));
  setTimeout(function() {
    var i = document.getElementById('chat-input');
    if (i) { autoResize(i); i.focus(); }
  }, 50);
}

/* ── MODAL DEVOIR ──
   Vraie date (selecteur du telephone + raccourcis) ; l'urgence est deduite de la date */
var _moDue = '';
function openMo() {
  _moDue = vcYmd(vcAddDays(new Date(), 1));
  document.getElementById('moc').innerHTML = `
    <div class="mof"><label>Matière</label><select id="mo-mat">
      <option>Maths</option><option>Français</option><option>Histoire-Géo</option>
      <option>Physique-Chimie</option><option>SVT</option><option>Anglais</option>
      <option>Espagnol</option><option>Allemand</option><option>Technologie</option><option>Arts plastiques</option>
      <option>Musique</option><option>EPS</option><option>SES</option><option>NSI</option><option>Philosophie</option><option>Autre</option>
    </select></div>
    <div class="mof"><label>Description</label><input type="text" id="mo-desc" maxlength="200" placeholder="ex : Exercices p.42-43"></div>
    <div class="mof"><label>À rendre le</label>
      <div class="vc-chips" id="mo-chips"></div>
      <input type="date" id="mo-date" value="${_moDue}" onchange="moSetDue(this.value)">
    </div>`;
  moChips();
  document.getElementById('mo').classList.add('open');
  setTimeout(() => document.getElementById('mo-desc')?.focus(), 200);
}
function moChips() {
  var el = document.getElementById('mo-chips'); if (!el) return;
  el.innerHTML = [[0, 'Aujourd\'hui'], [1, 'Demain'], [2, 'Après-demain'], [7, 'Dans 1 semaine']].map(function(q) {
    var y = vcYmd(vcAddDays(new Date(), q[0]));
    return '<button type="button" class="vc-chip' + (_moDue === y ? ' on' : '') + '" onclick="moSetDue(\'' + y + '\')">' + q[1] + '</button>';
  }).join('');
}
function moSetDue(y) {
  _moDue = /^\d{4}-\d{2}-\d{2}$/.test(y || '') ? y : '';
  var i = document.getElementById('mo-date'); if (i && i.value !== _moDue) i.value = _moDue;
  moChips();
}
function moSave() {
  const mat  = document.getElementById('mo-mat')?.value || 'Divers';
  const desc = document.getElementById('mo-desc')?.value.trim();
  if (!desc) { document.getElementById('mo-desc').style.borderColor = 'var(--danger)'; return; }
  devoirs.push({ id: dvId++, mat, desc, date: _moDue ? dvCtrlLabel(_moDue) : '?', due: _moDue, done: false });
  saveDv(); renderDevoirs(); closeMo(); updateHomeStats();
}
function closeMo() { document.getElementById('mo').classList.remove('open'); }
function moOut(e) { if (e.target === document.getElementById('mo')) closeMo(); }

/* ══ MINUTEUR D'UN DEVOIR ══
   = le Pomodoro (avant : un 2e minuteur en double, sans alarme a la fin) */
function openTm(id) {
  var d = devoirs.find(function(x){ return x.id === id; });
  openTool('pomo');
  var q = document.getElementById('pomo-quote');
  if (q && d && !poR) q.textContent = 'Focus : ' + d.mat + ' — ' + d.desc;
}
