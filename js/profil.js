/* ScolarIA — js/profil.js
   Profil, série (jours de vrai travail), anneaux de progression.
   Chargé par scolaria-home-v2.html, dans l'ordre des <script> (une ligne exécutée au chargement
   ne peut utiliser que les fonctions des fichiers chargés AVANT celui-ci). */

/* ══════════════════════════════════════════════
   PROFIL V2
══════════════════════════════════════════════ */
var AVATARS = [
  '🎓','📚','✏️','🧠','💡','🔬','🔭','📐','🎯','🏆',
  '🦊','🦁','🐼','🐯','🦅','🦉','🐺','🦄','🐸','🐙',
  '🚀','⚡','🌟','🔥','💫','🎮','🎸','🌈','🍀','✨',
  '🧑‍💻','👩‍🔬','🧑‍🚀','👨‍🏫','👩‍🎓','🧝','🧙','🦸','🌺','🎭'
];
var userProfile = { prenom: '', classe: '', matiere: '', objectif: '', avatar: '🎓', photo: '' };

/* ══════════════════════════════════════════════
   STREAK — SYSTÈME FLAME FONCTIONNEL
══════════════════════════════════════════════ */
/* Un jour compte seulement si l'eleve a TRAVAILLE (question a l'IA, flashcards, interro,
   devoir coche, fiche, cours ecrit...) : markActivity(). Ouvrir l'app ne suffit plus.
   Date LOCALE (avant : date UTC, donc apres minuit en France le travail comptait pour la veille). */
function getTodayKey() { return 'sk_day_' + vcYmd(new Date()); }

/* Serie en cours : si rien n'est encore fait aujourd'hui, on compte jusqu'a hier
   (la serie ne retombe pas a 0 le matin) */
function getStreakCount() {
  var count = 0, d = new Date();
  if (localStorage.getItem(getTodayKey()) !== '1') d = vcAddDays(d, -1);
  for (var i = 0; i < 400; i++) {
    if (localStorage.getItem('sk_day_' + vcYmd(d)) !== '1') break;
    count++;
    d = vcAddDays(d, -1);
  }
  return count;
}

function markActivity() {
  var k = getTodayKey();
  if (localStorage.getItem(k) !== '1') {
    try { localStorage.setItem(k, '1'); } catch(e) {}
    /* on oublie les jours de plus d'un an (ils sont aussi envoyes au cloud) */
    var limite = 'sk_day_' + vcYmd(vcAddDays(new Date(), -400));
    Object.keys(localStorage).forEach(function(x) { if (x.indexOf('sk_day_') === 0 && x < limite) localStorage.removeItem(x); });
  }
  scheduleSync();
  updateStreak();
}

/* Affiche la serie (n'ecrit plus rien) */
function updateStreak() {
  var count = getStreakCount();
  try {
    localStorage.setItem('sk_streak', JSON.stringify({ count: count, date: vcYmd(new Date()) }));
  } catch(e) {}
  /* Mettre à jour tous les affichages */
  ['hdr-streak-val', 'home-streak', 'prof-streak'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = count;
  });
  return count;
}

/* ══════════════════════════════════════════════
   PROGRESSION — CERCLES CONNECTÉS AUX VRAIES DONNÉES
══════════════════════════════════════════════ */
function updateProgRing(id, pct, color) {
  var ring = document.getElementById(id);
  if (!ring) return;
  pct = Math.max(0, Math.min(100, pct));
  var deg = Math.round(pct * 360 / 100);
  ring.style.setProperty('--pa', deg + 'deg');
  ring.style.setProperty('--pc', color);
  var inner = ring.querySelector('.home-prog-inner');
  if (inner) { inner.textContent = pct + '%'; inner.style.color = color; }
}

function updateHomeProgression() {
  /* 1. Flashcards : ratio bonnes réponses / total */
  try {
    var fStats = JSON.parse(localStorage.getItem('sk_flash_stats') || '{"ok":0,"total":0}');
    var flashPct = fStats.total > 0 ? Math.round(fStats.ok / fStats.total * 100) : 0;
    updateProgRing('prog-flash', flashPct, '#4f46e5');
  } catch(e) {}
  /* 2. Fiches : chaque fiche générée = 10 % (max 100) */
  try {
    var ficheN = parseInt(localStorage.getItem('sk_fiche_count') || '0');
    updateProgRing('prog-fiche', Math.min(ficheN * 10, 100), '#c07010');
  } catch(e) {}
  /* 3. Quiz vocal : ratio bonnes réponses vocales */
  try {
    var qStats = JSON.parse(localStorage.getItem('sk_quiz_stats') || '{"ok":0,"total":0}');
    var quizPct = qStats.total > 0 ? Math.round(qStats.ok / qStats.total * 100) : 0;
    updateProgRing('prog-quiz', quizPct, '#16a34a');
  } catch(e) {}
  /* 4. Objectifs : devoirs cochés / total */
  try {
    var dvs = JSON.parse(localStorage.getItem('sk_dv') || '[]');
    var objPct = dvs.length > 0 ? Math.round(dvs.filter(function(d){ return d.done; }).length / dvs.length * 100) : 0;
    updateProgRing('prog-obj', objPct, '#e84040');
  } catch(e) {}
}

/* Profil — toggle section "Mes infos" */
function toggleProfInfos() {
  var body = document.getElementById('prof-infos-body');
  var chev = document.getElementById('prof-infos-chev');
  if (!body) return;
  var open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (chev) chev.style.transform = open ? 'rotate(-90deg)' : 'rotate(0deg)';
}

/* Objectif : memes codes que l'onboarding (anciens profils : libelles du profil convertis) */
function _objectifCode(o) {
  o = String(o || '');
  if (/^(bonnes-notes|brevet|niveau|progresser)$/.test(o)) return o;
  if (/brevet|bac/i.test(o)) return 'brevet';
  if (/couler/i.test(o)) return 'niveau';
  if (/notes|interro/i.test(o)) return 'bonnes-notes';
  return '';
}
function loadProfile() {
  try {
    var s = localStorage.getItem('sk_prof');
    if (s) {
      var p = JSON.parse(s);
      userProfile.prenom   = p.prenom   || '';
      userProfile.classe   = p.classe   || '';
      userProfile.matiere  = p.matiere  || '';
      userProfile.objectif = _objectifCode(p.objectif);
      userProfile.avatar   = p.avatar   || '🎓';
      userProfile.photo    = p.photo    || '';
    }
  } catch(e) {}
  /* Mettre à jour le prénom global et le greeting */
  userPrenom = userProfile.prenom;
  var cg = document.getElementById('chat-greeting');
  if (cg) cg.textContent = userPrenom ? 'Salut ' + userPrenom + ' !' : 'Salut !';
  var hg = document.getElementById('home-greeting');
  if (hg && userPrenom) hg.textContent = 'Bonjour ' + userPrenom;
  /* Afficher l'email connecté dans la section sécurité */
  var emailEl = document.getElementById('sec-email-display');
  if (emailEl && currentUser) emailEl.textContent = 'Compte : ' + (currentUser.email || '');
  renderProfileUI();
}

/* ── Changer le mot de passe ── */
async function changePassword() {
  var np  = (document.getElementById('sec-pass-new')     || {}).value || '';
  var nc  = (document.getElementById('sec-pass-confirm') || {}).value || '';
  var msg = document.getElementById('sec-msg');
  if (!np || !nc) { _secMsg('Remplis les deux champs.', false); return; }
  if (np.length < 6) { _secMsg('Mot de passe trop court (6 caractères minimum).', false); return; }
  if (np !== nc)  { _secMsg('Les mots de passe ne correspondent pas.', false); return; }
  if (!_supa || !currentUser) { _secMsg('Pas de connexion au compte pour le moment. Réessaie plus tard.', false); return; }
  var res = await _supa.auth.updateUser({ password: np });
  if (res.error) { _secMsg(res.error.message, false); }
  else {
    _secMsg('Mot de passe changé avec succès !', true);
    document.getElementById('sec-pass-new').value     = '';
    document.getElementById('sec-pass-confirm').value = '';
  }
}
function _secMsg(txt, ok) {
  var el = document.getElementById('sec-msg');
  if (!el) return;
  el.textContent  = txt;
  el.style.color  = ok ? 'var(--success)' : 'var(--danger)';
  el.style.display = 'block';
}

function saveProfile() {
  userProfile.prenom   = (document.getElementById('profil-prenom')  ? document.getElementById('profil-prenom').value.trim()  : '');
  userProfile.classe   = (document.getElementById('profil-classe')  ? document.getElementById('profil-classe').value          : '');
  userProfile.matiere  = (document.getElementById('profil-matiere') ? document.getElementById('profil-matiere').value         : '');
  userProfile.objectif = (document.getElementById('profil-objectif')? document.getElementById('profil-objectif').value        : '');
  try {
    var existing = {};
    try { existing = JSON.parse(localStorage.getItem('sk_prof') || '{}'); } catch(e2) {}
    var toSave = Object.assign({}, existing, userProfile);
    localStorage.setItem('sk_prof', JSON.stringify(toSave));
  } catch(e) {}
  renderProfileUI();
  updateStreak();
  /* Update greeting */
  userPrenom = userProfile.prenom;
  var hg = document.getElementById('home-greeting');
  if (hg && userPrenom) hg.textContent = 'Bonjour ' + userPrenom;
  var cg = document.getElementById('chat-greeting');
  if (cg) cg.textContent = userPrenom ? 'Salut ' + userPrenom + ' !' : 'Salut !';
  toast('Profil sauvegardé !');
  scheduleSync();
}

function renderProfileUI() {
  /* Hero */
  renderAvatarDisplay();
  var nm = document.getElementById('profil-name-display');
  if (nm) nm.textContent = userProfile.prenom || 'Mon Profil';
  var sub = document.getElementById('profil-sub-display');
  if (sub) sub.textContent = (userProfile.classe || 'Élève') + ' · ScolarIA';
  updateNiveauUI();
  var oe = document.getElementById('profil-obj-exam'); if (oe) oe.textContent = 'Réussir le ' + examLabel();
  /* Fields */
  var pi = document.getElementById('profil-prenom');   if (pi) pi.value = userProfile.prenom;
  var pc = document.getElementById('profil-classe');   if (pc) pc.value = userProfile.classe;
  var pm = document.getElementById('profil-matiere');  if (pm) pm.value = userProfile.matiere;
  var po = document.getElementById('profil-objectif'); if (po) po.value = userProfile.objectif;
  /* Stats — streak via la vraie fonction */
  var streakEl = document.getElementById('prof-streak');
  if (streakEl) streakEl.textContent = getStreakCount();
  try {
    var profDecks = JSON.parse(localStorage.getItem('sk_decks') || '[]');
    var ef = document.getElementById('prof-flash-n');
    if (ef) ef.textContent = profDecks.reduce(function(s, d){ return s + (d.count || 0); }, 0);
  } catch(e) {}
  var ed = document.getElementById('prof-devoirs-n');
  if (ed) ed.textContent = devoirs.filter(function(d){ return d.done; }).length;
}

var AVATAR_SECTIONS = [
  { lbl: '🎓 Académique', items: ['🎓','📚','✏️','🧠','💡','🔬','🔭','📐','🎯','🏆'] },
  { lbl: '🦊 Animaux',    items: ['🦊','🦁','🐼','🐯','🦅','🦉','🐺','🦄','🐸','🐙'] },
  { lbl: '🚀 Cool',       items: ['🚀','⚡','🌟','🔥','💫','🎮','🎸','🌈','🍀','✨'] },
  { lbl: '🧑 Personnages', items: ['🧑‍💻','👩‍🔬','🧑‍🚀','👨‍🏫','👩‍🎓','🧝','🧙','🦸','🌺','🎭'] }
];

function renderAvatarGrid() {
  var g = document.getElementById('avatar-grid');
  if (!g) return;
  var html = '';
  AVATAR_SECTIONS.forEach(function(sec) {
    html += '<div class="avatar-section-lbl">' + sec.lbl + '</div>';
    sec.items.forEach(function(a) {
      var on = a === userProfile.avatar ? ' on' : '';
      html += '<button class="prof-av-btn' + on + '" onclick="pickAvatar(this)"  data-av="' + a + '">' + a + '</button>';
    });
  });
  g.innerHTML = html;
}

/* Photo de profil : prioritaire sur l'emoji quand elle existe */
/* Valeur entiere verifiee (elle peut venir du cloud) : uniquement des caracteres base64 */
function _hasPhoto() { return /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(userProfile.photo || ''); }

function renderAvatarDisplay() {
  var av = document.getElementById('profil-avatar-display');
  if (av) {
    av.textContent = '';
    if (_hasPhoto()) {
      /* createElement + .src : jamais de HTML construit a partir de la donnee */
      var img = document.createElement('img');
      img.className = 'prof-av-img';
      img.alt = 'Photo de profil';
      img.src = userProfile.photo;
      av.appendChild(img);
    } else av.textContent = userProfile.avatar;
  }
  var rm = document.getElementById('prof-photo-rm');
  if (rm) rm.style.display = _hasPhoto() ? '' : 'none';
}

function _saveAvatarFields() {
  try {
    var existing = JSON.parse(localStorage.getItem('sk_prof') || '{}');
    existing.avatar = userProfile.avatar;
    existing.photo  = userProfile.photo || '';
    localStorage.setItem('sk_prof', JSON.stringify(existing));
  } catch(e) { toast('Photo trop lourde pour être enregistrée'); }
  scheduleSync();
}

/* Recadre en carre (centre) + reduit a 256px JPEG pour rester leger (~20-40 Ko) */
function pickProfilePhoto(ev) {
  var f = ev.target.files && ev.target.files[0];
  ev.target.value = '';
  if (!f || !/^image\//.test(f.type)) return;
  var url = URL.createObjectURL(f);
  var img = new Image();
  img.onload = function() {
    var side = Math.min(img.naturalWidth, img.naturalHeight);
    var sx = (img.naturalWidth - side) / 2, sy = (img.naturalHeight - side) / 2;
    var cv = document.createElement('canvas');
    cv.width = cv.height = 256;
    cv.getContext('2d').drawImage(img, sx, sy, side, side, 0, 0, 256, 256);
    URL.revokeObjectURL(url);
    userProfile.photo = cv.toDataURL('image/jpeg', 0.82);
    renderAvatarDisplay();
    _saveAvatarFields();
    toast('Photo de profil mise à jour !');
  };
  img.onerror = function() { URL.revokeObjectURL(url); toast('Impossible de lire cette image'); };
  img.src = url;
}

function removeProfilePhoto() {
  userProfile.photo = '';
  renderAvatarDisplay();
  _saveAvatarFields();
  toast('Photo retirée');
}

function pickAvatar(btn) {
  var a = btn.getAttribute('data-av');
  if (!a) return;
  userProfile.avatar = a;
  userProfile.photo = '';   /* choisir un emoji remplace la photo */
  renderAvatarDisplay();
  /* Mettre à jour la sélection visuelle */
  var g = document.getElementById('avatar-grid');
  if (g) g.querySelectorAll('.prof-av-btn').forEach(function(b) {
    b.classList.toggle('on', b.getAttribute('data-av') === a);
  });
  _saveAvatarFields();
  toast('Avatar mis à jour ! ' + a);
}

function toggleAvatarPicker() {
  var p = document.getElementById('avatar-picker');
  var chev = document.getElementById('prof-avatar-chev');
  if (!p) return;
  var open = p.style.display === 'block';
  p.style.display = open ? 'none' : 'block';
  if (chev) chev.style.transform = open ? 'rotate(-90deg)' : 'rotate(0deg)';
  if (!open) renderAvatarGrid();
}
