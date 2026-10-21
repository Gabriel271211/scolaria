/* ScolarIA — js/compte.js
   Compte Supabase : connexion / inscription, synchro cloud sans perte, onboarding,
   démarrage de session, mode hors connexion.
   Chargé par scolaria-home-v2.html, dans l'ordre des <script> (une ligne exécutée au chargement
   ne peut utiliser que les fonctions des fichiers chargés AVANT celui-ci). */

/* ══ SUPABASE AUTH + SYNC ══ */
/* Si la librairie Supabase n'a pas pu se charger (hors ligne, CDN bloque), l'app
   demarre quand meme avec les donnees du telephone (voir _demarrageHorsLigne). */
var _supa = (typeof supabase !== 'undefined') ? supabase.createClient(
  'https://vefnkztjmodchvmspukh.supabase.co',
  'sb_publishable_OVVDWsvA2-0dJuTdQREYVw_kSiTu7Ge'
) : null;
var currentUser = null;
var _syncTimer  = null;
var _appDemarre = false;   /* initApp deja lance : un simple renouvellement de session ne recharge plus rien */

var SYNC_KEYS = [
  'sk_dv','sk_prof','sk_decks','sk_hist','sk_chat',
  'sk_fiche_count','sk_flash_stats','sk_quiz_stats','sk_streak','sk_ctrl','sk_cours','sk_cahiers','sk_ann_seen'
];

/* ── Sync ──
   sk__modif = date de la derniere modification locale ; sk__envoi = date de la derniere
   version bien enregistree dans le cloud. sk__modif > sk__envoi : des changements ne sont
   pas encore dans le cloud (hors ligne, app fermee trop vite, erreur reseau...) : le cloud
   ne doit JAMAIS les ecraser. Le cloud garde __modif pour savoir quelle version est la plus recente.
   (cles sk__ = techniques, jamais copiees depuis le cloud) */
function _syncNum(k) { return +(localStorage.getItem(k) || 0) || 0; }
function _syncEnAttente() { return _syncNum('sk__modif') > _syncNum('sk__envoi'); }
function scheduleSync() {
  /* toujours > derniere version connue, meme si l'horloge d'un autre appareil etait en avance */
  var m = Math.max(Date.now(), _syncNum('sk__envoi') + 1, _syncNum('sk__modif') + 1);
  try { localStorage.setItem('sk__modif', String(m)); } catch(e) {}
  if (!currentUser) return;
  clearTimeout(_syncTimer);
  _syncTimer = setTimeout(syncToCloud, 3000);
}

async function syncToCloud() {
  clearTimeout(_syncTimer); _syncTimer = null;
  if (!currentUser || !_supa) return false;
  var modif = _syncNum('sk__modif');
  var data = { __modif: modif };
  SYNC_KEYS.forEach(function(k) {
    var v = localStorage.getItem(k);
    if (v !== null) data[k] = v;
  });
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (key && key.startsWith('sk_day_')) data[key] = localStorage.getItem(key);
  }
  try {
    /* supabase-js ne leve pas d'exception : l'erreur est dans le resultat */
    var r = await _supa.from('user_data').upsert({ user_id: currentUser.id, data: data }, { onConflict: 'user_id' });
    if (r.error) throw new Error(r.error.message);
    /* une modif faite pendant l'envoi garde sk__modif > sk__envoi : elle partira au prochain envoi */
    try { localStorage.setItem('sk__envoi', String(modif)); } catch(e2) {}
    return true;
  } catch(e) {
    console.warn('syncToCloud échoué:', e.message);
    return false;
  }
}

async function syncFromCloud() {
  if (!currentUser || !_supa) return;
  try {
    var res = await _supa.from('user_data').select('data').eq('user_id', currentUser.id).maybeSingle();
    if (res.error) throw new Error(res.error.message);
    var remote = (res.data && res.data.data) || null;
    var rModif = remote ? (+remote.__modif || 0) : 0;
    /* changements locaux pas encore envoyes et plus recents que le cloud : c'est eux qu'on garde */
    if (_syncEnAttente() && _syncNum('sk__modif') > rModif) { await syncToCloud(); return; }
    if (!remote) return;
    /* deja a jour (rien de nouveau dans le cloud) : on ne reecrit rien */
    if (rModif && rModif === _syncNum('sk__envoi') && !_syncEnAttente()) return false;
    Object.keys(remote).forEach(function(k) {
      if (k.indexOf('sk_') === 0 && k.indexOf('sk__') !== 0) {
        try { localStorage.setItem(k, remote[k]); } catch(e2) {}
      }
    });
    try { localStorage.setItem('sk__modif', String(rModif)); localStorage.setItem('sk__envoi', String(rModif)); } catch(e3) {}
    return true;   /* des donnees du cloud ont ete copiees sur le telephone */
  } catch(e) {
    console.warn('syncFromCloud échoué:', e.message);
  }
  return false;
}

/* Envoi immediat quand on quitte l'app (Android peut la geler avant les 3 s) ou au retour du reseau */
document.addEventListener('visibilitychange', function() {
  if (currentUser && _syncEnAttente()) syncToCloud();
});
window.addEventListener('online', function() {
  if (currentUser && _syncEnAttente()) syncToCloud();
});

/* « Réinitialiser toutes mes données » : efface le telephone ET le cloud
   (avant : seul le telephone etait vide, et le cloud remettait tout a la connexion suivante) */
async function resetDonnees() {
  if (!confirm('Effacer TOUTES tes données ScolarIA (devoirs, cours, flashcards, historique, contrôles…) sur ce téléphone et dans ton compte ? C\'est définitif.')) return;
  Object.keys(localStorage).forEach(function(k) {
    if (k.indexOf('sk_') === 0 && k !== 'sk_theme') localStorage.removeItem(k);
  });
  try { localStorage.setItem('sk__modif', String(Date.now() + 1)); } catch(e) {}
  if (currentUser) await syncToCloud();
  try { if ('caches' in window) await caches.delete('scolaria-data'); } catch(e) {}
  location.reload();
}

/* ── Messages d'erreur Supabase → français ── */
function _supaErrMsg(msg) {
  if (!msg) return 'Une erreur est survenue.';
  if (msg.indexOf('already registered') !== -1 || msg.indexOf('already been registered') !== -1) return 'Cet email est déjà utilisé.';
  if (msg.indexOf('Password should be at least') !== -1) return 'Mot de passe trop court (6 caractères minimum).';
  if (msg.indexOf('Invalid login credentials') !== -1 || msg.indexOf('invalid_credentials') !== -1) return 'Email ou mot de passe incorrect.';
  if (msg.indexOf('User not found') !== -1) return 'Aucun compte avec cet email.';
  if (msg.indexOf('invalid email') !== -1 || msg.indexOf('Invalid email') !== -1) return 'Adresse email invalide.';
  if (msg.indexOf('Too many') !== -1 || msg.indexOf('rate limit') !== -1) return 'Trop de tentatives. Réessaie dans quelques minutes.';
  if (msg.indexOf('network') !== -1 || msg.indexOf('fetch') !== -1) return 'Erreur réseau. Vérifie ta connexion.';
  return msg;
}

/* ── Helpers UI ── */
function _fbSetLoading(on) {
  var sub = document.getElementById('fb-submit');
  if (sub) { sub.disabled = on; sub.textContent = on ? 'Chargement…' : (window._fbMode === 'register' ? 'Créer le compte' : 'Se connecter'); }
}

function _fbShowErr(msg) {
  var el = document.getElementById('fb-login-err');
  if (!el) return;
  el.textContent = typeof msg === 'string' ? msg : _supaErrMsg((msg && msg.message) || '');
  el.style.color = '';
  el.style.display = 'block';
}

function _fbHideErr() {
  var el = document.getElementById('fb-login-err');
  if (el) el.style.display = 'none';
}

/* ── Afficher/cacher le mot de passe ── */
function togglePwVis(inputId, btn) {
  var inp = document.getElementById(inputId);
  if (!inp) return;
  var show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  btn.innerHTML = show
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}

/* ── Mode connexion / inscription ── */
window._fbMode = 'login';
function switchFbMode(mode) {
  window._fbMode = mode;
  document.getElementById('fb-tab-login').classList.toggle('active', mode === 'login');
  document.getElementById('fb-tab-reg').classList.toggle('active', mode === 'register');
  var pass2  = document.getElementById('fb-pass2-wrap');
  var forgot = document.getElementById('fb-forgot');
  var sub    = document.getElementById('fb-submit');
  if (pass2)  pass2.style.display  = mode === 'register' ? '' : 'none';
  if (forgot) forgot.style.display = mode === 'login'    ? '' : 'none';
  if (sub)    sub.textContent      = mode === 'register' ? 'Créer le compte' : 'Se connecter';
  _fbHideErr();
}

/* ── Inscription / Connexion email+password ── */
async function submitFbAuth() {
  _fbHideErr();
  var email = (document.getElementById('fb-email').value || '').trim();
  var pass  = document.getElementById('fb-pass').value || '';
  if (!email || !pass) { _fbShowErr('Remplis tous les champs.'); return; }
  if (!_supa) { _fbShowErr('Connexion impossible : vérifie ta connexion internet puis recharge la page.'); return; }
  _fbSetLoading(true);

  if (window._fbMode === 'register') {
    var pass2 = document.getElementById('fb-pass2').value || '';
    if (pass !== pass2) { _fbSetLoading(false); _fbShowErr('Les mots de passe ne correspondent pas.'); return; }
    var res = await _supa.auth.signUp({ email: email, password: pass });
    if (res.error) { _fbSetLoading(false); _fbShowErr(res.error); return; }
    /* Supabase envoie un email de confirmation — informer l'utilisateur */
    var el = document.getElementById('fb-login-err');
    if (el) { el.textContent = 'Compte créé ! Vérifie ton email pour confirmer.'; el.style.color = 'var(--success)'; el.style.display = 'block'; }
    _fbSetLoading(false);
  } else {
    var res = await _supa.auth.signInWithPassword({ email: email, password: pass });
    if (res.error) { _fbSetLoading(false); _fbShowErr(res.error); return; }
    /* onAuthStateChange va prendre le relais */
  }
}


/* ── Déconnexion ── */
async function logout() {
  /* changements pas encore dans le cloud : on les envoie avant de tout effacer */
  if (currentUser && _syncEnAttente()) await syncToCloud();
  if (_syncEnAttente() && !confirm('Tes dernières modifications ne sont pas encore sauvegardées dans ton compte (pas de connexion). Te déconnecter quand même ? Elles seront perdues.')) return;
  if (_supa) { try { await _supa.auth.signOut(); } catch(e) {} }
  /* Plus de rappels de controles pour ce compte : copie du service worker + verif en arriere-plan */
  try { if ('caches' in window) await caches.delete('scolaria-data'); } catch(e) {}
  try {
    if ('serviceWorker' in navigator) {
      var reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.periodicSync) await reg.periodicSync.unregister('ctrl-reminders');
    }
  } catch(e) {}
  var theme = localStorage.getItem('sk_theme');
  localStorage.clear();
  if (theme) localStorage.setItem('sk_theme', theme);
  window.location.reload();
}

/* ── Mise à jour de l'avatar dans le drawer ── */
function _updateDrawerUser(user) {
  var info = document.getElementById('drawer-user-info');
  var sub  = document.getElementById('drawer-sub');
  if (!info || !user) return;
  var meta = (user.user_metadata) || {};
  var av = info.querySelector('.drawer-user-avatar');
  var nm = info.querySelector('.drawer-user-name');
  var em = info.querySelector('.drawer-user-email');
  if (av) { av.src = meta.avatar_url || meta.picture || ''; av.style.display = (meta.avatar_url || meta.picture) ? '' : 'none'; }
  if (nm) nm.textContent = meta.full_name || meta.name || 'Mon compte';
  if (em) em.textContent = user.email || '';
  info.style.display = 'block';
  if (sub) sub.style.display = 'none';
}

/* ══ ONBOARDING ══ */
var _obStep = 0;
var _obAnswers = { prenom:'', classe:'', objectif:'', avatar:'🎓' };
var _obSteps = [
  { type:'text',   mascot:'👋', q:'Comment tu t\'appelles ?',      sub:'Ton prénom pour personnaliser ScolarIA', placeholder:'Ton prénom…' },
  { type:'cards',  mascot:'🏫', q:'Tu es en quelle classe ?',       sub:'Choisis ton niveau', options:[
    { icon:'🟢', label:'6ème', val:'6ème' },
    { icon:'🔵', label:'5ème', val:'5ème' },
    { icon:'🟠', label:'4ème', val:'4ème' },
    { icon:'🔴', label:'3ème', val:'3ème' },
    { icon:'🟣', label:'2nde', val:'2nde' },
    { icon:'🟤', label:'1ère', val:'1ère' },
    { icon:'⚫', label:'Terminale', val:'Terminale' }
  ]},
  { type:'cards',  mascot:'🎯', q:'Quel est ton objectif ?',        sub:'On adapte ScolarIA pour toi', options:[
    { icon:'⭐', label:'Avoir de bonnes notes',   val:'bonnes-notes' },
    { icon:'📜', label:'Réussir le brevet',        val:'brevet' },
    { icon:'📈', label:'Me remettre à niveau',     val:'niveau' },
    { icon:'🚀', label:'Progresser chaque jour',   val:'progresser' }
  ]},
  { type:'avatar', mascot:'😎', q:'Choisis ton avatar',             sub:'Tu pourras le changer plus tard' },
  { type:'finish', mascot:'🎉', q:'',                                sub:'' }
];

function startOnboarding() {
  _obStep = 0;
  _obAnswers = { prenom:'', classe:'', objectif:'', avatar:'🎓' };
  var el = document.getElementById('onboarding');
  if (el) el.style.display = 'flex';
  _obRender();
}

function _obRender() {
  var step  = _obSteps[_obStep];
  var total = _obSteps.length - 1;
  var pct   = Math.round((_obStep / total) * 100);
  var fill  = document.getElementById('ob-bar-fill');
  var back  = document.getElementById('ob-back-btn');
  var btn   = document.getElementById('ob-next-btn');
  var body  = document.getElementById('ob-body');
  var foot  = document.getElementById('ob-footer');
  if (fill) fill.style.width = pct + '%';
  if (back) back.style.visibility = _obStep > 0 ? 'visible' : 'hidden';

  if (step.type === 'finish') {
    if (btn)  btn.style.display = 'none';
    if (foot) foot.style.display = 'none';
    body.innerHTML =
      '<div class="ob-finish-wrap">' +
        '<div class="ob-mascot">🎉</div>' +
        '<div class="ob-q">C\'est parti, ' + _esc(_obAnswers.prenom) + ' !</div>' +
        '<div class="ob-sub">Ton espace ScolarIA est prêt</div>' +
        '<button class="ob-btn ob-btn-primary" style="margin-top:20px;max-width:320px;width:100%" onclick="obFinish()">Commencer ScolarIA 🚀</button>' +
      '</div>';
    return;
  }

  if (foot) foot.style.display = '';
  if (btn)  btn.style.display  = '';

  var html = '<div class="ob-mascot">' + step.mascot + '</div>' +
             '<div class="ob-q">' + step.q + '</div>' +
             '<div class="ob-sub">' + step.sub + '</div>';

  if (step.type === 'text') {
    html += '<input class="ob-inp" id="ob-inp" type="text" placeholder="' + step.placeholder + '" maxlength="20" oninput="_obCheckBtn()" onkeydown="if(event.key===\'Enter\')obNext()">';
    body.innerHTML = html;
    var inp = document.getElementById('ob-inp');
    if (inp) { inp.value = _obAnswers.prenom; inp.focus(); }
    _obCheckBtn();
  } else if (step.type === 'cards') {
    html += '<div class="ob-cards' + (_obStep === 1 ? ' ob-cards-2' : '') + '">';
    var obLycee = NIVEAUX[_obAnswers.classe] && NIVEAUX[_obAnswers.classe].cycle === 'lycée';
    step.options.forEach(function(opt) {
      var sel = (_obStep === 1 ? _obAnswers.classe : _obAnswers.objectif) === opt.val;
      /* L'objectif "examen" devient le bac pour un lyceen */
      var lab = (opt.val === 'brevet' && obLycee) ? 'Réussir le bac' : opt.label;
      html += '<div class="ob-card' + (sel ? ' selected' : '') + '" onclick="_obSelectCard(this,\'' + opt.val + '\')">' +
        '<span class="ob-card-icon">' + opt.icon + '</span>' +
        '<span class="ob-card-label">' + lab + '</span>' +
        '<span class="ob-card-check">' + (sel ? '✓' : '') + '</span>' +
        '</div>';
    });
    html += '</div>';
    body.innerHTML = html;
    _obCheckBtn();
  } else if (step.type === 'avatar') {
    var avs = ['🎓','😎','🦊','🐼','🦁','🐸','🚀','⭐','🎮','🎵','⚽','🍕'];
    html += '<div class="ob-avatar-grid">';
    avs.forEach(function(av) {
      html += '<div class="ob-av' + (av === _obAnswers.avatar ? ' selected' : '') + '" onclick="_obSelectAv(this,\'' + av + '\')">' + av + '</div>';
    });
    html += '</div>';
    body.innerHTML = html;
    if (btn) { btn.disabled = false; }
  }
}

function _esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function _obCheckBtn() {
  var btn  = document.getElementById('ob-next-btn');
  var step = _obSteps[_obStep];
  if (!btn) return;
  if (step.type === 'text') {
    var v = (document.getElementById('ob-inp') || {}).value || '';
    btn.disabled = v.trim().length < 1;
  } else if (step.type === 'cards') {
    var val = _obStep === 1 ? _obAnswers.classe : _obAnswers.objectif;
    btn.disabled = !val;
  } else {
    btn.disabled = false;
  }
}

function _obSelectCard(el, val) {
  var cards = el.parentNode.querySelectorAll('.ob-card');
  cards.forEach(function(c) { c.classList.remove('selected'); c.querySelector('.ob-card-check').textContent = ''; });
  el.classList.add('selected');
  el.querySelector('.ob-card-check').textContent = '✓';
  if (_obStep === 1) _obAnswers.classe    = val;
  else               _obAnswers.objectif  = val;
  _obCheckBtn();
}

function _obSelectAv(el, av) {
  var avs = el.parentNode.querySelectorAll('.ob-av');
  avs.forEach(function(a) { a.classList.remove('selected'); });
  el.classList.add('selected');
  _obAnswers.avatar = av;
}

function obNext() {
  var step = _obSteps[_obStep];
  if (step.type === 'text') {
    var v = ((document.getElementById('ob-inp') || {}).value || '').trim();
    if (!v) return;
    _obAnswers.prenom = v;
  }
  _obStep++;
  _obRender();
}

function obBack() {
  if (_obStep > 0) { _obStep--; _obRender(); }
}

function obFinish() {
  userProfile.prenom   = _obAnswers.prenom;
  userProfile.classe   = _obAnswers.classe;
  userProfile.avatar   = _obAnswers.avatar;
  userProfile.objectif = _obAnswers.objectif;
  try {
    localStorage.setItem('sk_prof', JSON.stringify(userProfile));
  } catch(e) {}
  scheduleSync();
  var el = document.getElementById('onboarding');
  if (el) el.style.display = 'none';
  initApp();
}

/* ── Écoute des changements de session ── */
function _demarrerSession(user) {
  _updateDrawerUser(user);
  /* Jamais plus de 8 s d'attente du cloud (sans reseau, Supabase peut essayer longtemps de
     renouveler la session : l'app restait bloquee sur le logo). Hors ligne : pas d'attente du tout. */
  var sync = navigator.onLine === false ? Promise.resolve(false)
    : Promise.race([syncFromCloud(), new Promise(function(r) { setTimeout(function() { r(false); }, 8000); })]);
  sync.then(function(recu) {
    if (_appDemarre) {
      /* app deja ouverte (hors connexion) : on rafraichit seulement si le cloud a apporte du nouveau */
      if (recu) { initApp(); toast('Tes données ont été mises à jour depuis ton compte'); }
      return;
    }
    var overlay = document.getElementById('fb-login');
    if (overlay) overlay.style.display = 'none';
    var prof = null;
    try { prof = JSON.parse(localStorage.getItem('sk_prof') || 'null'); } catch(e) {}
    if (!prof || !prof.prenom) startOnboarding();
    else initApp();
    _appDemarre = true;
  });
}
if (_supa) _supa.auth.onAuthStateChange(function(event, session) {
  if (session && session.user) {
    var memeCompte = currentUser && currentUser.id === session.user.id;
    currentUser = session.user;
    /* TOKEN_REFRESHED (environ toutes les heures, et au retour dans l'app), USER_UPDATED... :
       surtout NE PAS recharger le cloud par-dessus le travail en cours (interro, cours, devoirs) */
    if (memeCompte && _appDemarre) return;
    /* recommandation Supabase : aucun appel Supabase directement dans ce callback ;
       et on attend que toute la page (modales en bas du fichier) soit chargee */
    setTimeout(function() {
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function() { _demarrerSession(session.user); });
      else _demarrerSession(session.user);
    }, 0);
  } else {
    currentUser = null;
    if (_appDemarre) return;   /* app deja ouverte (mode hors connexion) : on y reste */
    var status = document.getElementById('fb-login-status');
    var forms  = document.getElementById('fb-auth-forms');
    if (status) status.style.display = 'none';
    if (forms)  forms.style.display  = 'flex';
  }
});

/* ── Mode hors connexion ──
   Sans reseau, la session ne peut pas etre verifiee : au lieu d'un chargement sans fin,
   l'app s'ouvre avec les donnees du telephone (elles partiront dans le cloud au retour du reseau). */
function _aSessionLocale() {
  try { for (var i = 0; i < localStorage.length; i++) if (/^sb-.+-auth-token$/.test(localStorage.key(i) || '')) return true; } catch(e) {}
  return false;
}
function _demarrageHorsLigne() {
  if (_appDemarre) return;
  var prof = null;
  try { prof = JSON.parse(localStorage.getItem('sk_prof') || 'null'); } catch(e) {}
  if (!prof || !prof.prenom) {
    var st = document.querySelector('#fb-login-status span');
    if (st && !_supa) st.textContent = 'Connexion impossible : vérifie ta connexion internet puis recharge la page.';
    return;
  }
  var overlay = document.getElementById('fb-login');
  if (overlay) overlay.style.display = 'none';
  initApp();
  _appDemarre = true;
  toast('Hors connexion : tes données restent sur ce téléphone', 4000);
}
if (!_supa) document.addEventListener('DOMContentLoaded', _demarrageHorsLigne);
else if (navigator.onLine === false) {
  /* mode avion : rien a attendre, on ouvre des que la page est chargee */
  var _hlDirect = function() { if (_aSessionLocale()) _demarrageHorsLigne(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _hlDirect);
  else _hlDirect();
}
else setTimeout(function() { if (_aSessionLocale()) _demarrageHorsLigne(); }, 6000);
