/* ScolarIA — js/demarrage.js
   initApp() (lancée après la connexion ou en mode hors connexion) + service worker.
   Chargé par scolaria-home-v2.html, dans l'ordre des <script> (une ligne exécutée au chargement
   ne peut utiliser que les fonctions des fichiers chargés AVANT celui-ci). */

/* ══ DÉMARRAGE ══ */
var _chatWelcomeHTML = '';

function initApp() {
  var _cm = document.getElementById('chat-msgs');
  if (_cm && !_chatWelcomeHTML) _chatWelcomeHTML = _cm.innerHTML;
  loadProfile();           /* charge profil + prénom + met à jour le greeting */
  showQuote();
  loadDevoirs();
  renderDevoirs();
  renderHist();
  renderFavs();
  loadChatLS();
  updateHomeStats();
  renderRevDecks();
  updateStreak();
  updateHomeProgression();
  vcInit();
  mcRenderRev();
}

document.addEventListener('DOMContentLoaded', function() {
  /* initApp() est appelé par Supabase auth après syncFromCloud()
     (ou par _demarrageHorsLigne si la session ne peut pas être vérifiée). */

  /* ══ PWA — service worker (offline + installable) ══ */
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(function(){});
  }
});
