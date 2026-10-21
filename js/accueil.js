/* ScolarIA — js/accueil.js
   Prénom, citation du jour, compteurs de l'accueil.
   Chargé par scolaria-home-v2.html, dans l'ordre des <script> (une ligne exécutée au chargement
   ne peut utiliser que les fonctions des fichiers chargés AVANT celui-ci). */

/* ══ PRÉNOM & CITATIONS ══ */
let userPrenom = '';

const QUOTES = [
  "Chaque matin est une nouvelle chance. Profite-en.",
  "Tu es plus fort que tu ne le crois. Prouve-le aujourd'hui.",
  "Un examen se prépare un jour à la fois. Et c'est aujourd'hui.",
  "Ceux qui réussissent font ce que les autres remettent à demain.",
  "Même 20 minutes de révision font la différence.",
  "Tu es capable de tout gérer.",
  "La régularité bat le talent. Sois régulier.",
  "Chaque flashcard révisée, c'est un point de plus.",
  "Focus. Le reste peut attendre.",
  "Un petit effort aujourd'hui, un grand résultat demain.",
  "Croire en soi, c'est déjà la moitié du chemin.",
];
function showQuote() {
  const txt = document.getElementById('chat-quote-txt');
  if (txt) txt.textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

/* ══ ACCUEIL ══ */
function updateHomeStats() {
  /* Prénom accueil */
  var hg = document.getElementById('home-greeting');
  if (hg && userPrenom) hg.textContent = 'Bonjour ' + userPrenom;

  /* Devoirs restants (controles a venir compris) */
  var dvActive = dvActiveCount();
  var dvDone   = devoirs.filter(function(d){ return d.done; }).length;
  var dc = document.getElementById('home-devoirs-count');
  if (dc) dc.textContent = dvActive;
  var pdn = document.getElementById('prof-devoirs-n');
  if (pdn) pdn.textContent = dvDone;

  /* Flashcards enregistrées */
  var cards = 0;
  try {
    var decks = JSON.parse(localStorage.getItem('sk_decks') || '[]');
    cards = decks.reduce(function(s, d){ return s + (d.count || 0); }, 0);
  } catch(e) {}
  var elF = document.getElementById('home-flash-count');
  if (elF) elF.textContent = cards;
  var pfn = document.getElementById('prof-flash-n');
  if (pfn) pfn.textContent = cards;

  /* Section accès rapide — sous-titres dynamiques */
  var genChatSub = document.getElementById('gen-chat-sub');
  if (genChatSub) {
    var msgs = chatHistory.length;
    genChatSub.textContent = msgs > 0 ? msgs + ' message' + (msgs > 1 ? 's' : '') + ' en cours' : 'Pose une question à l\'IA';
  }
  var genFlashSub = document.getElementById('gen-flash-sub');
  if (genFlashSub) {
    genFlashSub.textContent = cards > 0 ? cards + ' carte' + (cards > 1 ? 's' : '') + ' enregistrée' + (cards > 1 ? 's' : '') : 'Aucune flashcard';
  }
  var genDvSub = document.getElementById('gen-dv-sub');
  if (genDvSub) {
    var urgents = devoirs.filter(function(d){ return !d.done && dvUrg(d) === 'urgent'; }).length +
      dvControles().filter(function(c){ return vcDiff(c.date) <= 1; }).length;
    if (dvActive === 0) genDvSub.textContent = 'Tout est à jour';
    else if (urgents > 0) genDvSub.textContent = urgents + ' urgent' + (urgents > 1 ? 's' : '') + ' · ' + dvActive + ' au total';
    else genDvSub.textContent = dvActive + ' devoir' + (dvActive > 1 ? 's' : '') + ' restant' + (dvActive > 1 ? 's' : '');
  }

  /* Streak + progression */
  updateStreak();
  updateHomeProgression();
}
