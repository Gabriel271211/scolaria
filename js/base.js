/* ScolarIA — js/base.js
   Thème (mode nuit), navigation, bouton retour du téléphone, clavier mobile,
   utilitaires (esc, toast, vibration), bandeau hors connexion, installation de l'app.
   Chargé par scolaria-home-v2.html, dans l'ordre des <script> (une ligne exécutée au chargement
   ne peut utiliser que les fonctions des fichiers chargés AVANT celui-ci). */

/* ══ THÈME ══ */
function _applyThemeUI(isDark) {
  var sw    = document.getElementById('theme-sw');
  var knob  = document.getElementById('theme-sw-knob');
  var title = document.getElementById('theme-row-title');
  var sub   = document.getElementById('theme-row-sub');
  if (isDark) {
    if (sw) sw.classList.add('on');
    if (knob) knob.textContent = '☀️';
    if (title) title.textContent = 'Mode nuit';
    if (sub) sub.textContent = 'Désactiver le thème sombre';
  } else {
    if (sw) sw.classList.remove('on');
    if (knob) knob.textContent = '🌙';
    if (title) title.textContent = 'Mode nuit';
    if (sub) sub.textContent = 'Activer le thème sombre';
  }
}
function toggleTheme() {
  var isDark = document.body.classList.toggle('dark');
  localStorage.setItem('sk_theme', isDark ? 'dark' : 'light');
  _applyThemeUI(isDark);
}
(function initTheme() {
  /* pas encore de choix : on suit le mode sombre du telephone */
  var saved = localStorage.getItem('sk_theme');
  var sombre = saved ? saved === 'dark' : !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (sombre) { document.body.classList.add('dark'); _applyThemeUI(true); }
})();

/* ── NAVIGATION ── */
function goSec(id, btn) {
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (btn) btn.classList.add('active');
  if (id === 's-home') updateHomeStats();
}

function toggleDrawer() {
  document.getElementById('drawer').classList.toggle('open');
  document.getElementById('drawer-overlay').classList.toggle('open');
}

function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('open');
}

/* ══ BOUTON RETOUR DU TÉLÉPHONE ══
   Avant, le retour Android FERMAIT l'app depuis n'importe quelle fenetre (sauf Mes cours).
   Tant qu'une fenetre est ouverte, ou qu'on n'est pas sur l'accueil, une entree « garde »
   ({ng:1}) reste dans l'historique : le retour ferme la fenetre du dessus, puis revient a
   l'accueil, et seulement ensuite quitte l'app. Mes cours garde ses propres entrees ({mc:n}). */
function _visible(id) { var e = document.getElementById(id); return !!e && !!e.style.display && e.style.display !== 'none'; }
function navOuvert() {
  if (document.getElementById('fb-login') && document.getElementById('fb-login').style.display !== 'none') return false;
  if (_visible('onboarding')) return typeof _obStep !== 'undefined' && _obStep > 0;
  if (_visible('hist-panel') || _visible('rev-fullscreen')) return true;
  if (document.querySelector('.ia-modal.open, .tool-modal.open, #mo.open, #drawer.open')) return true;
  var sec = document.querySelector('.sec.active');
  return !!sec && sec.id !== 's-home';
}
/* ferme ce qui est le plus haut a l'ecran ; false s'il n'y avait rien */
function navFermerHaut() {
  if (_visible('onboarding')) { if (typeof _obStep !== 'undefined' && _obStep > 0) { obBack(); return true; } return false; }
  if (_visible('hist-panel')) { closeHistPanel(); return true; }
  if (_visible('rev-fullscreen')) { closeRevFullscreen(); return true; }
  var vc = document.getElementById('vc-modal');
  if (vc && vc.classList.contains('open')) {
    var vb = document.getElementById('vc-back');
    if (vb && vb.style.display !== 'none') vcShowList(); else closeVeilleControle();
    return true;
  }
  var fermer = { 'vq-modal': closeVocalQuiz, 'interro-ai-modal': closeInterroAI, 'scan-modal': closeScanCours,
    'pomo-modal': function() { closeTool('pomo'); }, 'moy-modal': function() { closeTool('moy'); },
    'tool-modal': function() { closeTool('tool'); }, 'mo': closeMo };
  for (var id in fermer) {
    var m = document.getElementById(id);
    if (m && m.classList.contains('open')) { fermer[id](); return true; }
  }
  var dr = document.getElementById('drawer');
  if (dr && dr.classList.contains('open')) { closeDrawer(); return true; }
  return false;
}
function navRetour() {
  if (!navFermerHaut()) {
    var sec = document.querySelector('.sec.active');
    var r1 = document.getElementById('rev-s1');
    if (sec && sec.id === 's-annales' && typeof annStack !== 'undefined' && annStack.length) annBack();
    else if (sec && sec.id === 's-revisions' && r1 && r1.style.display === 'none') showRevStep(1);
    else if (sec && sec.id !== 's-home') goSec('s-home', document.querySelector('.nav-btn[onclick*="s-home"]'));
  }
  navSync();
}
/* une entree a consommer doit exister des que quelque chose est ouvert */
function navSync() {
  if ((typeof _mcIgnorePop !== 'undefined' && _mcIgnorePop > 0) || (typeof mcPanelOuvert === 'function' && mcPanelOuvert())) return;
  if (!navOuvert()) return;
  var st = history.state;
  if (st && (st.ng || st.mc)) return;
  try { history.pushState({ ng: 1 }, ''); } catch(e) {}
}
/* toutes les fenetres s'ouvrent par un appui (ou Entree) : on resynchronise juste apres */
document.addEventListener('click', function() { setTimeout(navSync, 0); }, true);
document.addEventListener('keyup', function(e) { if (e.key === 'Enter') setTimeout(navSync, 0); }, true);

/* ── CLAVIER MOBILE ── */
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', onVVResize);
  window.visualViewport.addEventListener('scroll', onVVResize);
}
function onVVResize() {
  const bar = document.getElementById('chat-bar');
  if (!bar) return;
  const offset = window.innerHeight - window.visualViewport.offsetTop - window.visualViewport.height;
  bar.style.transform = 'translateY(-' + Math.max(0, offset) + 'px)';
}

/* ══ UTILITAIRES ══ */
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

/* ── RETOUR HAPTIQUE (vibration mobile) ── */
function haptic(ms){ try { if (navigator.vibrate) navigator.vibrate(ms || 22); } catch(e) {} }
document.addEventListener('click', function(e){
  if (e.target.closest('button, .nav-btn, .chat-sc, .dvck, .drawer-mode, .rev-type-btn, .rev-dur-btn, .home-mod-card, .chat-sc-toggle')) haptic(22);
}, { passive: true });

var _toastTimer = null;
function toast(msg, ms) {
  var t = document.getElementById('sk-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function() { t.classList.remove('show'); }, ms || 2800);
}

/* ══ HORS CONNEXION ══
   Bandeau visible tant que le telephone n'a pas de reseau (mode avion, pas de 4G/wifi) */
function majHorsLigne(evt) {
  var hors = navigator.onLine === false;
  document.body.classList.toggle('offline', hors);
  if (evt && evt.type === 'online') toast('Connexion retrouvée ✅');
}
window.addEventListener('online', majHorsLigne);
window.addEventListener('offline', majHorsLigne);
majHorsLigne();

/* ══ INSTALLATION PWA ══ */
var _installEvt = null;
function _isStandalone() {
  return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
}
function _isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent); }
function _showInstallBtn(on) {
  var b = document.getElementById('dm-install');
  if (b) b.style.display = on ? '' : 'none';
}
window.addEventListener('beforeinstallprompt', function(ev) {
  ev.preventDefault();
  _installEvt = ev;
  _showInstallBtn(true);
});
window.addEventListener('appinstalled', function() {
  _installEvt = null;
  _showInstallBtn(false);
  toast('ScolarIA est installée sur ton téléphone');
});
document.addEventListener('DOMContentLoaded', function() {
  /* iPhone : pas d'événement d'installation, on affiche quand même le bouton (instructions) */
  if (!_isStandalone() && _isIOS()) _showInstallBtn(true);
});
function installApp() {
  closeDrawer();
  if (_installEvt) {
    _installEvt.prompt();
    _installEvt.userChoice.then(function(r) {
      if (r && r.outcome === 'accepted') _showInstallBtn(false);
      _installEvt = null;
    });
  } else if (_isIOS()) {
    toast('Appuie sur Partager puis « Sur l\'écran d\'accueil »', 5000);
  } else {
    toast('Menu ⋮ de Chrome puis « Installer l\'application »', 5000);
  }
}
