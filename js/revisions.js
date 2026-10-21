/* ScolarIA — js/revisions.js
   Révisions : type et durée, génération IA (fiche, flashcards, quiz…), plein écran,
   paquets de flashcards.
   Chargé par scolaria-home-v2.html, dans l'ordre des <script> (une ligne exécutée au chargement
   ne peut utiliser que les fonctions des fichiers chargés AVANT celui-ci). */

/* ══ RÉVISIONS ══ */
var revCurType = 'flashcards';
var revCurDur  = 'express';
var revCoursOn = false;
var revSession = [];
var revIdx     = 0;
var revScore   = { ok: 0, retry: 0 };

function showRevStep(n) {
  for (var i = 1; i <= 4; i++) {
    var el = document.getElementById('rev-s' + i);
    if (el) el.style.display = (i === n) ? 'block' : 'none';
  }
  if (n === 1) { renderRevDecks(); renderFavs(); }
}

var revDurLabels = {
  flashcards: ['5 min · 5 cartes',            '15 min · 10 cartes',            '30 min · 20 cartes'],
  fiche:      ['5 min · essentiel seulement', '15 min · toutes les sections',  '30 min · tout + exemples détaillés'],
  quiz:       ['5 min · 5 questions',         '15 min · 10 questions',         '30 min · 20 questions'],
  resume:     ['5 min · 3 points clés',       '15 min · 8 points développés',  '30 min · plan complet']
};

var REV_TYPE_LABELS = {
  flashcards: { title: 'Flashcards', placeholder: 'ex: La photosynthèse, les droits de l\'homme...' },
  fiche:      { title: 'Fiche de révision', placeholder: 'ex: La Première Guerre mondiale, les fractions...' },
  quiz:       { title: 'Interrogation',     placeholder: 'ex: Le système solaire, les verbes irréguliers...' },
  resume:     { title: 'Résumé',            placeholder: 'ex: La Révolution française, l\'évolution...' }
};

function revPickType(type) {
  revCurType = type;
  document.querySelectorAll('.rev-type-btn').forEach(function(b) {
    b.classList.remove('sel');
    /* Mark selected by matching onclick attribute */
    if (b.getAttribute('onclick') && b.getAttribute('onclick').indexOf("'" + type + "'") >= 0) {
      b.classList.add('sel');
    }
  });
  showRevStep(3);
  var labels = revDurLabels[type] || revDurLabels.flashcards;
  ['express','normal','complet'].forEach(function(dur, i) {
    var btn = document.querySelector('.rev-dur-btn[data-dur="' + dur + '"]');
    if (btn) { var sub = btn.querySelector('.rev-dur-sub'); if (sub) sub.textContent = '~' + labels[i]; }
  });
  var info = REV_TYPE_LABELS[type] || REV_TYPE_LABELS.flashcards;
  var title = document.getElementById('rev-s3-title');
  var inp   = document.getElementById('rev-topic');
  if (title) title.textContent = info.title;
  if (inp)   inp.placeholder   = info.placeholder;
}

function revPickDur(dur) {
  revCurDur = dur;
  document.querySelectorAll('.rev-dur-btn').forEach(function(b) {
    b.classList.remove('sel');
    if (b.dataset && b.dataset.dur === dur) b.classList.add('sel');
  });
}

function revToggleCours() {
  revCoursOn = !revCoursOn;
  var sw = document.getElementById('rev-cours-sw');
  var zone = document.getElementById('rev-cours-zone');
  if (sw) { revCoursOn ? sw.classList.add('on') : sw.classList.remove('on'); }
  if (zone) { zone.style.display = revCoursOn ? 'block' : 'none'; }
}

function revGetLimit() {
  if (revCurDur === 'normal')  return 10;
  if (revCurDur === 'complet') return 20;
  return 5;
}

async function revStart() {
  var topic = (document.getElementById('rev-topic') ? document.getElementById('rev-topic').value.trim() : '');
  var cours = '';
  if (revCoursOn) {
    var ta = document.getElementById('rev-cours-txt');
    if (ta) cours = ta.value.trim();
  }
  /* limite Groq gratuite = 8 000 jetons/minute (demande + reponse) : un cours entier ne passe pas */
  var REV_COURS_MAX = 7000;
  if (cours.length > REV_COURS_MAX) {
    cours = cours.slice(0, REV_COURS_MAX);
    toast('Cours très long : ScolarIA utilise le début (environ 3 pages)', 4000);
  }

  /* Validation : sujet obligatoire si pas de cours collé */
  if (!topic && !cours) {
    var inp = document.getElementById('rev-topic');
    if (inp) { inp.classList.add('err'); inp.focus(); }
    return;
  }

  var limit   = revGetLimit();
  var subject = cours ? 'ce cours' : '"' + topic + '"';

  /* Affiche l'étape 4 avec spinner */
  showRevStep(4);
  var s4 = document.getElementById('rev-s4');
  var typeLabels = { flashcards: 'Flashcards', fiche: 'Fiche', quiz: 'Interrogation', resume: 'Résumé' };
  s4.innerHTML =
    '<div class="rev-sess-hdr">' +
      '<button class="rev-sess-close" onclick="showRevStep(1)">&#x2715;</button>' +
      '<span class="rev-sess-lbl">' + (typeLabels[revCurType] || 'IA') + '</span>' +
    '</div>' +
    '<div class="rev-loading">' +
      '<div class="rev-spin"></div>' +
      '<div class="rev-loading-txt">ScolarIA génère...</div>' +
      '<div class="rev-loading-sub">Quelques secondes</div>' +
    '</div>';

  /* Construire le prompt selon le type */
  var prompt = '';
  if (revCurType === 'flashcards') {
    var flashLogic =
      'RAISONNE COMME UN ELEVE DE ' + getClasse().toUpperCase() + ' QUI REVISE CE CHAPITRE POUR UN CONTROLE :\n' +
      '- Les questions portent sur le COEUR du sujet : definitions cles, formules, enonces, proprietes, methode pour appliquer, dans quels cas on utilise, et 1 a 2 exemples de calcul ou exercice type.\n' +
      '- INTERDIT les questions de culture generale ou de biographie hors-sujet. Exemple : pour "theoreme de Pythagore", ne demande JAMAIS "qui est Pythagore ?" ni sa date de naissance. Demande l\'enonce, la formule, comment trouver l\'hypotenuse, comment verifier si un triangle est rectangle, etc.\n' +
      '- Vise ce qui tombe VRAIMENT en controle sur ce sujet precis.\n' +
      '- Chaque reponse est courte, precise et exacte (formule juste, valeurs correctes).\n';
    if (cours) {
      prompt = 'Genere exactement ' + limit + ' flashcards de revision basees UNIQUEMENT sur ce cours.\n' +
        flashLogic +
        'FORMAT OBLIGATOIRE — uniquement ce tableau, rien d\'autre :\n' +
        '| Question | Réponse |\n| --- | --- |\n| ... | ... |\n\n' +
        'COURS :\n' + cours;
    } else {
      prompt = 'Genere exactement ' + limit + ' flashcards de revision sur le sujet : "' + topic + '".\n' +
        flashLogic +
        'FORMAT OBLIGATOIRE — uniquement ce tableau, rien d\'autre :\n' +
        '| Question | Réponse |\n| --- | --- |\n| ... | ... |\n' +
        'Les questions doivent porter UNIQUEMENT sur "' + topic + '". Aucun texte avant ni apres le tableau.';
    }
  } else if (revCurType === 'fiche') {
    var ficheDepth = {
      express: 'PROFONDEUR EXPRESS : 3 sections MAXIMUM (les plus importantes uniquement). 2-3 puces très courtes par section. Aller droit au but.',
      normal:  'PROFONDEUR NORMALE : 4-5 sections. 3-5 puces par section. Tous les points importants couverts.',
      complet: 'PROFONDEUR COMPLÈTE : toutes les sections obligatoires de la matière. 5-8 puces par section avec sous-détails. Exemples développés step by step. Toutes les exceptions et pièges. Fiche exhaustive.'
    };
    var depthInstr = ficheDepth[revCurDur] || ficheDepth.normal;
    if (cours) {
      prompt = 'Fais une fiche de révision basée UNIQUEMENT sur ce cours.\n' +
        depthInstr + '\n' +
        'FORMAT OBLIGATOIRE : ##FICHE##, TITRE:, MATIERE:, SECTION: (noms adaptés à la matière selon les règles reçues), RETENIR:, ##FINFICHE##.\n' +
        'ZÉRO paragraphe — tout en puces bullet. Respecte exactement les SECTIONS OBLIGATOIRES de la matière.\n\nCOURS :\n' + cours;
    } else {
      prompt = 'Fais une fiche de révision sur : ' + topic + '\n' +
        depthInstr + '\n' +
        'FORMAT OBLIGATOIRE : ##FICHE##, TITRE:, MATIERE:, SECTION: (noms adaptés à la matière selon les règles reçues), RETENIR:, ##FINFICHE##.\n' +
        'ZÉRO paragraphe — tout en puces bullet. Respecte exactement les SECTIONS OBLIGATOIRES de la matière. Niveau ' + getClasse() + '.';
    }
  } else if (revCurType === 'quiz') {
    if (cours) {
      prompt = 'Génère une interrogation de ' + limit + ' questions basées UNIQUEMENT sur ce cours (niveau ' + getClasse() + ').\n' +
        'Mix : QCM (4 choix), vrai/faux, réponse courte. Donne la correction complète à la fin.\n\n' +
        'COURS :\n' + cours;
    } else {
      prompt = 'Génère une interrogation de ' + limit + ' questions sur : "' + topic + '" (niveau ' + getClasse() + ').\n' +
        'Questions portant UNIQUEMENT sur "' + topic + '". Mix : QCM (4 choix), vrai/faux, réponse courte.\n' +
        'Donne la correction complète à la fin.';
    }
  } else {
    if (cours) {
      prompt = 'Résume ce cours en ' + limit + ' points clés essentiels (liste numérotée, court et percutant).\n\nCOURS :\n' + cours;
    } else {
      prompt = 'Résume "' + topic + '" en ' + limit + ' points clés essentiels pour le ' + examLabel() + ' (liste numérotée, court et percutant). Sujet UNIQUEMENT : "' + topic + '".';
    }
  }

  /* Système adapté selon la matière pour les fiches */
  var detectedMat = (revCurType === 'fiche') ? detectMat(topic + ' ' + cours) : '';
  var activeSys = (revCurType === 'fiche') ? buildFicheSys(detectedMat) : SCOLARIA_SYSTEM;

  /* Tokens max selon profondeur et type */
  var revMaxTok = 1600;
  if (revCurType === 'fiche') {
    revMaxTok = revCurDur === 'express' ? 900 : revCurDur === 'complet' ? 2800 : 1600;
  } else if (revCurType === 'quiz') {
    revMaxTok = revCurDur === 'express' ? 800 : revCurDur === 'complet' ? 2200 : 1400;
  } else if (revCurType === 'flashcards') {
    revMaxTok = revCurDur === 'express' ? 700 : revCurDur === 'complet' ? 1800 : 1100;
  }

  try {
    var reply = await callGroq([
      { role: 'system', content: activeSys },
      { role: 'user', content: prompt }
    ], revMaxTok, { niveau: 'revision' });

    if (revCurType === 'flashcards') {
      var cards = parseFlashCards(reply, limit);
      if (cards.length < 1) {
        s4.innerHTML =
          '<div class="rev-sess-hdr"><button class="rev-sess-close" onclick="showRevStep(1)">&#x2715;</button><span class="rev-sess-lbl">Erreur</span></div>' +
          '<div class="rev-err-box">Les flashcards n’ont pas pu être créées.<br><small>' + esc(reply.substring(0,120)) + '...</small>' +
          '<button onclick="showRevStep(3)">Réessayer</button></div>';
        return;
      }
      revStartSession(cards);
      saveRevDeck(topic || 'Cours', cards);
      addToHist('flashcards', topic || 'Cours', 'Flashcards', reply);
    } else {
      var label = typeLabels[revCurType] || 'Résultat';
      window._revLastReply = reply;
      window._revLastLabel = label;
      window._revLastTopic = topic || 'Cours';
      window._revLastType  = revCurType;
      addToHist(revCurType, topic || 'Cours', label, reply);
      var _genFav = (function(){ var h=loadHist(); for(var i=0;i<h.length;i++){if(h[i].id===_histCurrentId)return h[i].fav;} return false; })();
      var _ff = _genFav ? '#f59e0b' : 'none';
      var _fs = _genFav ? '#f59e0b' : 'var(--mu)';
      var previewIcons = { fiche: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>', quiz: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', resume: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="11" x2="15" y2="11"/><line x1="3" y1="16" x2="18" y2="16"/></svg>' };
      var icon = previewIcons[revCurType] || previewIcons.fiche;
      s4.innerHTML =
        '<div class="rev-sess-hdr">' +
          '<button class="rev-sess-close" onclick="showRevStep(1)">&#x2715;</button>' +
          '<span class="rev-sess-lbl">' + label + '</span>' +
        '</div>' +
        '<div class="rev-result-preview" onclick="openRevFullscreen()">' +
          '<div class="rev-result-preview-icon">' + icon + '</div>' +
          '<div class="rev-result-preview-info">' +
            '<div class="rev-result-preview-name">' + label + ' prête !</div>' +
            '<div class="rev-result-preview-sub">' + esc(window._revLastTopic) + ' — Touche pour voir</div>' +
          '</div>' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--mu)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</div>' +
        '<div style="display:flex;gap:8px;margin-top:16px">' +
          '<button onclick="openRevFullscreen()" style="flex:1;padding:14px;border:none;border-radius:14px;background:var(--accent);color:#fff;font-size:14px;font-weight:800;font-family:var(--fb);cursor:pointer">Voir le résultat</button>' +
          '<button id="gen-fav-btn" onclick="toggleFavGen()" style="width:52px;height:52px;border-radius:14px;border:1.5px solid var(--bord);background:var(--card);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;-webkit-tap-highlight-color:transparent">' +
            '<svg id="gen-fav-ico" viewBox="0 0 24 24" width="20" height="20" fill="' + _ff + '" stroke="' + _fs + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
          '</button>' +
        '</div>' +
        '<button class="rev-ia-btn-sec" style="margin-top:8px;width:100%" onclick="showRevStep(1)">Retour accueil</button>';
    }
  } catch(err) {
    s4.innerHTML =
      '<div class="rev-sess-hdr"><button class="rev-sess-close" onclick="showRevStep(1)">&#x2715;</button><span class="rev-sess-lbl">Erreur</span></div>' +
      '<div class="rev-err-box">Erreur : ' + esc(err.message) + '<br><br>' +
        '' +
        '<br><button onclick="showRevStep(3)">Réessayer</button>' +
      '</div>';
  }
}

function openRevFullscreen() {
  var fs = document.getElementById('rev-fullscreen');
  if (!fs) return;
  var label = window._revLastLabel || '';
  var topic = window._revLastTopic || '';
  var type  = window._revLastType  || '';
  var body  = document.getElementById('rev-fs-body');
  document.getElementById('rev-fs-title').textContent = label + (topic ? ' — ' + topic : '');

  if (type === 'fiche') {
    try {
      var n = parseInt(localStorage.getItem('sk_fiche_count') || '0') + 1;
      localStorage.setItem('sk_fiche_count', String(n));
    } catch(e) {}
    markActivity();
    updateHomeProgression();
    body.innerHTML = parseFicheV2(window._revLastReply || '', topic);
    body.className = 'paper-bg';
  } else {
    body.innerHTML = mdToHtml(window._revLastReply || '');
    body.className = '';
  }
  /* Mettre a jour l'etoile selon fav */
  (function() {
    var isFav = false;
    if (_histCurrentId) {
      var h = loadHist();
      for (var i = 0; i < h.length; i++) {
        if (h[i].id === _histCurrentId) { isFav = h[i].fav; break; }
      }
    }
    _updateFsStar(isFav);
  })();
  fs.style.display = 'flex';
}
function closeRevFullscreen() {
  var fs = document.getElementById('rev-fullscreen');
  if (fs) fs.style.display = 'none';
}

/* Parse un tableau markdown | Question | Reponse | en tableau de cards {q, a} */
function parseFlashCards(md, limit) {
  var cards = [];
  var lines = md.split('\n');
  var pastSep = false;
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i].trim();
    if (!l.startsWith('|')) { pastSep = false; continue; }
    /* Ligne séparateur ---|--- */
    if (/^\|\s*[-:]+\s*\|/.test(l)) { pastSep = true; continue; }
    var parts = l.split('|').map(function(p){ return p.trim(); }).filter(Boolean);
    if (parts.length < 2) continue;
    /* Ignorer la ligne d'en-tête (Question / Réponse / Q / R) */
    if (/^(question|q)$/i.test(parts[0])) continue;
    if (pastSep || cards.length > 0) {
      /* les cartes s'affichent en texte brut : on retire le gras/code markdown (**x**, __x__, `x`) */
      var clean = function(s) { return s.replace(/\*\*|__|`/g, ''); };
      cards.push({ q: clean(parts[0]), a: clean(parts[1]) });
    }
    if (cards.length >= limit) break;
  }
  return cards;
}

function revStartSession(cards) {
  revSession = cards;
  revIdx = 0;
  revScore = { ok: 0, retry: 0 };
  showRevStep(4);
  revRenderCard();
}

function revRenderCard() {
  var s4 = document.getElementById('rev-s4');
  if (!s4) return;
  var card = revSession[revIdx];
  var total = revSession.length;
  var pct = Math.round((revIdx / total) * 100);
  s4.innerHTML =
    '<div class="rev-sess-hdr">' +
      '<button class="rev-sess-close" onclick="showRevStep(1)">&#x2715;</button>' +
      '<span class="rev-sess-lbl">Carte ' + (revIdx+1) + ' / ' + total + '</span>' +
    '</div>' +
    '<div class="rev-prog-bar"><div class="rev-prog-fill" style="width:' + pct + '%"></div></div>' +
    '<div class="rev-card" id="rev-cur-card" onclick="revFlip()">' +
      '<div class="rev-card-front">' +
        '<div class="rev-card-q">' + esc(card.q || '') + '</div>' +
        '<div class="rev-card-hint">Appuie pour voir la réponse</div>' +
      '</div>' +
      '<div class="rev-card-back">' +
        '<div class="rev-card-ok-lbl">Réponse</div>' +
        '<div class="rev-card-a">' + esc(card.a || '') + '</div>' +
      '</div>' +
    '</div>' +
    '<button class="rev-see-btn" id="rev-see-btn" onclick="revFlip()">Voir la réponse</button>' +
    '<div class="rev-act-row" id="rev-act-row" style="display:none">' +
      '<button style="flex:1;background:#dcfce7;color:#16a34a;border:none;border-radius:12px;padding:14px;font-size:14px;font-weight:800;cursor:pointer" onclick="revAnswer(true)">&#10003; Je savais</button>' +
      '<button style="flex:1;background:#fee2e2;color:#dc2626;border:none;border-radius:12px;padding:14px;font-size:14px;font-weight:800;cursor:pointer" onclick="revAnswer(false)">&#8635; À revoir</button>' +
    '</div>';
}

function revFlip() {
  var card = document.getElementById('rev-cur-card');
  var btn  = document.getElementById('rev-see-btn');
  var act  = document.getElementById('rev-act-row');
  if (card) card.classList.add('flipped');
  if (btn)  btn.style.display = 'none';
  if (act)  act.style.display = 'flex';
}

function revAnswer(ok) {
  /* Tracking stats pour la progression */
  try {
    var fStats = JSON.parse(localStorage.getItem('sk_flash_stats') || '{"ok":0,"total":0}');
    fStats.total++;
    if (ok) fStats.ok++;
    localStorage.setItem('sk_flash_stats', JSON.stringify(fStats));
  } catch(e) {}
  if (ok) revScore.ok++; else revScore.retry++;
  revIdx++;
  if (revIdx >= revSession.length) {
    revShowResult();
  } else {
    revRenderCard();
  }
}

function revShowResult() {
  /* Activité = marquer le streak + mettre à jour la progression */
  markActivity();
  updateHomeProgression();
  var s4 = document.getElementById('rev-s4');
  if (!s4) return;
  var total = revSession.length;
  var pct = Math.round((revScore.ok / total) * 100);
  var titre = pct >= 80 ? 'Excellent !' : pct >= 50 ? 'Bien joué !' : 'Continue !';
  var scoreClr = pct >= 80 ? '#16a34a' : pct >= 50 ? '#4f46e5' : '#f59e0b';
  s4.innerHTML =
    '<div class="rev-result">' +
      '<div style="width:72px;height:72px;border-radius:50%;background:' + scoreClr + '22;border:3px solid ' + scoreClr + ';display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:22px;font-weight:900;color:' + scoreClr + '">' + pct + '%</div>' +
      '<div class="rev-result-title">' + titre + '</div>' +
      '<div class="rev-result-sub">' + pct + '% de réussite sur ' + total + ' cartes</div>' +
      '<div class="rev-result-pills">' +
        '<div class="rev-pill" style="background:#dcfce7;color:#16a34a">&#10003; ' + revScore.ok + ' connues</div>' +
        '<div class="rev-pill" style="background:#fee2e2;color:#dc2626">&#8635; ' + revScore.retry + ' à revoir</div>' +
      '</div>' +
      '<button style="width:100%;background:var(--accent);color:#fff;border:none;border-radius:14px;padding:16px;font-size:15px;font-weight:800;cursor:pointer;margin-bottom:12px" onclick="revStartSession(revSession)">Recommencer</button>' +
      '<button style="width:100%;background:var(--card);color:var(--tx);border:1.5px solid var(--bord);border-radius:14px;padding:14px;font-size:14px;font-weight:700;cursor:pointer" onclick="showRevStep(1)">Retour accueil</button>' +
    '</div>';
}

function saveRevDeck(name, cards) {
  try {
    var decks = JSON.parse(localStorage.getItem('sk_decks') || '[]');
    var idx = -1;
    for (var i = 0; i < decks.length; i++) { if (decks[i].name === name) { idx = i; break; } }
    var d = { id: Date.now(), name: name, cards: cards, date: new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'short'}), count: cards.length };
    if (idx >= 0) { decks[idx] = d; } else { decks.unshift(d); }
    if (decks.length > 20) decks = decks.slice(0, 20);
    localStorage.setItem('sk_decks', JSON.stringify(decks));
  } catch(e) {}
  scheduleSync();
}
function deleteRevDeck(id) {
  try {
    var decks = JSON.parse(localStorage.getItem('sk_decks') || '[]');
    localStorage.setItem('sk_decks', JSON.stringify(decks.filter(function(d){ return d.id !== id; })));
    renderRevDecks();
  } catch(e) {}
  scheduleSync();
}
function launchRevDeck(id) {
  try {
    var decks = JSON.parse(localStorage.getItem('sk_decks') || '[]');
    for (var i = 0; i < decks.length; i++) {
      if (decks[i].id === id && decks[i].cards) { revStartSession(decks[i].cards); return; }
    }
  } catch(e) {}
}
function renderRevDecks() {
  var el = document.getElementById('rev-decks-s1');
  if (!el) return;
  try {
    var decks = JSON.parse(localStorage.getItem('sk_decks') || '[]');
    if (!decks.length) {
      el.innerHTML = '<div class="rev-deck-empty">Génère des flashcards pour créer ton premier paquet !</div>';
      return;
    }
    var ico = '<svg viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="16" height="12" rx="2"/><rect x="2" y="4" width="16" height="12" rx="2"/></svg>';
    el.innerHTML = decks.slice(0,8).map(function(d) {
      return '<div class="rev-deck-card" style="cursor:pointer" onclick="launchRevDeck(' + d.id + ')">' +
        '<div class="rev-deck-icon">' + ico + '</div>' +
        '<div class="rev-deck-info">' +
          '<div class="rev-deck-name">' + esc(d.name) + '</div>' +
          '<div class="rev-deck-meta">' + (+d.count || 0) + ' carte' + (d.count > 1 ? 's' : '') + ' &middot; ' + esc(d.date || '') + '</div>' +
        '</div>' +
        '<button onclick="event.stopPropagation();deleteRevDeck(' + d.id + ')" style="background:none;border:none;cursor:pointer;padding:6px;opacity:.4;display:flex;align-items:center;-webkit-tap-highlight-color:transparent">' +
          '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--mu)" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>' +
        '</button>' +
      '</div>';
    }).join('');
  } catch(e) {
    el.innerHTML = '<div class="rev-deck-empty">Aucune flashcard sauvegardée.</div>';
  }
}
