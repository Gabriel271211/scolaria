/* ScolarIA — js/chat.js
   Chat IA : messages, photo (vision), raccourcis, rendu Markdown, fiche ##FICHE##,
   interrogation dans le chat (outil de l'IA, fonctions cq*), recherche internet 🌐, sendChat().
   Chargé par scolaria-home-v2.html, dans l'ordre des <script> (une ligne exécutée au chargement
   ne peut utiliser que les fonctions des fichiers chargés AVANT celui-ci). */

/* ══ CHAT IA ══ */
var chatHistory = [];
var _chatBusy = false;   /* une reponse est en cours : pas de 2e envoi en parallele (quota Groq) */

/* Historique envoye a l'IA : les derniers messages dans un budget de ~6 000 caracteres
   (~1 700 jetons). Sans limite, quelques longues reponses suffisent a depasser la limite
   Groq de 8 000 jetons/minute et TOUS les messages suivants echouent. */
var CHAT_HIST_MAX = 6000, CHAT_MSG_MAX = 1500;
function chatHistIA(n) {
  var out = [], total = 0, h = chatHistory.slice(-(n || 12));
  for (var i = h.length - 1; i >= 0; i--) {
    var c = String(h[i].content || '');
    if (c.length > CHAT_MSG_MAX) c = c.slice(0, CHAT_MSG_MAX) + ' […]';
    if (total + c.length > CHAT_HIST_MAX && out.length) break;
    total += c.length;
    out.unshift({ role: h[i].role, content: c });
  }
  return out;
}
/* Defilement auto seulement si l'eleve est deja en bas (sinon il ne peut pas relire pendant la reponse) */
function chatEnBas(msgs) { return msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight < 120; }

function newChat() {
  /* une interrogation en cours est abandonnee (sinon le prochain message serait pris pour une reponse) */
  if (_cq) { _cq = null; cqSetInput(false); }
  chatHistory = [];
  saveChatLS();
  _histCurrentId = null;
  var msgs = document.getElementById('chat-msgs');
  if (msgs) msgs.innerHTML = _chatWelcomeHTML;
  resetShortcuts();
  /* Remettre le bon prénom dans le greeting */
  var cg = document.getElementById('chat-greeting');
  if (cg) cg.textContent = userPrenom ? 'Salut ' + userPrenom + ' !' : 'Salut !';
  closeDrawer();
  goSec('s-chat', document.querySelector('#nav button[onclick*="s-chat"]'));
}

const SHORTCUTS = {
  fiche:   'Génère-moi une fiche de révision complète sur : ',
  flash:   'Crée-moi 10 flashcards question/réponse sur : ',
  interro: 'Interroge-moi sur : ',
  résumer: 'Résume en 7 points clés : ',
  calc:    'Résous ce calcul étape par étape : ',
  conj:    'Conjugue ce verbe à tous les temps principaux (présent, imparfait, futur, conditionnel, subjonctif) : ',
  conv:    'Convertis : '
};

function chatShortcut(type) {
  /* « Scan cours » ouvre vraiment le scanner (avant : il collait juste une phrase dans le chat) */
  if (type === 'scan') { openScanCours(); return; }
  const input = document.getElementById('chat-input');
  const current = input.value.trim();
  const prefix = SHORTCUTS[type] || '';
  if (current) {
    input.value = prefix + current;
  } else {
    input.value = prefix;
  }
  autoResize(input);
  input.focus();
}

/* ══ PHOTO DANS LE CHAT (vision IA) ══ */
async function chatPhoto(e) {
  var f = e.target.files[0]; if (!f) return;
  e.target.value = '';
  if (_chatBusy) { toast('Attends la fin de la réponse…'); return; }
  /* photo reduite (2000 px) : une photo de telephone brute depasse la limite d'image de Groq (4 Mo) */
  var dataUrl = await imageReduiteP(f);
  if (!dataUrl) { toast('Impossible de lire cette image'); return; }
  _chatBusy = true;
  try {
    var input = document.getElementById('chat-input');
    var question = input ? input.value.trim() : '';
    if (input) { input.value = ''; autoResize(input); }
    collapseShortcuts();
    markActivity();

    var msgs = document.getElementById('chat-msgs');
    var welcome = msgs ? msgs.querySelector('.chat-welcome') : null;
    if (welcome) welcome.remove();
    var u = document.createElement('div');
    u.className = 'msg msg-user';
    u.innerHTML = '<img src="' + dataUrl + '" class="chat-img">' +
      (question ? '<div style="margin-top:6px">' + esc(question) + '</div>' : '');
    if (msgs) msgs.appendChild(u);

    var thinking = addMsg('ScolarIA analyse la photo…', 'ai thinking');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;

    var prompt = question || 'Analyse cette photo de mon cours. Explique le contenu clairement, niveau ' + getClasse() + '. Si c\'est un exercice, aide-moi à le résoudre étape par étape.';
    try {
      var reply = await callGroqVision([
        { role: 'system', content: SCOLARIA_SYSTEM },
        { role: 'user', content: [
          { type: 'image_url', image_url: { url: dataUrl } },
          { type: 'text', text: prompt }
        ]}
      ], 1800);
      thinking.classList.remove('thinking');
      thinking.style.maxWidth = '100%';
      thinking.innerHTML = mdToHtml(reply);
      chatHistory.push({ role: 'user', content: '[Photo envoyée] ' + prompt });
      chatHistory.push({ role: 'assistant', content: reply });
      if (chatHistory.length > 24) chatHistory = chatHistory.slice(-24);
      saveChatLS();
      updateHomeStats();
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
    } catch(err) {
      thinking.classList.remove('thinking');
      thinking.textContent = 'Erreur : ' + String(err.message).slice(0, 120);
    }
  } finally { _chatBusy = false; }
}

/* ══ RACCOURCIS REPLIABLES ══ */
var _chatStarted = false;
function collapseShortcuts() {
  if (_chatStarted) return;
  _chatStarted = true;
  var sc = document.getElementById('chat-shortcuts');
  var tg = document.getElementById('chat-sc-toggle');
  if (sc) sc.style.display = 'none';
  if (tg) tg.style.display = 'flex';
}
function toggleShortcuts() {
  var sc = document.getElementById('chat-shortcuts');
  if (!sc) return;
  sc.style.display = (sc.style.display === 'none') ? 'flex' : 'none';
}
function resetShortcuts() {
  _chatStarted = false;
  var sc = document.getElementById('chat-shortcuts');
  var tg = document.getElementById('chat-sc-toggle');
  if (sc) sc.style.display = 'flex';
  if (tg) tg.style.display = 'none';
}

function mdToHtml(text) {
  var lines = text.split('\n');
  var out = '';
  var inUl = false, inOl = false, inTable = false, tableFirst = true;

  function inlineFmt(s) {
    s = s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    s = s.replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>');
    s = s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
    s = s.replace(/\*(.+?)\*/g,'<em>$1</em>');
    s = s.replace(/`([^`]+)`/g,'<code>$1</code>');
    return s;
  }
  function closeList() {
    if (inUl) { out += '</ul>'; inUl = false; }
    if (inOl) { out += '</ol>'; inOl = false; }
  }
  function closeTable() {
    if (inTable) { out += '</table>'; inTable = false; tableFirst = true; }
  }

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var trimmed = line.trim();

    if (/^\|.+\|$/.test(trimmed)) {
      if (/^\|[\s:\-|]+\|$/.test(trimmed)) { tableFirst = false; continue; }
      closeList();
      if (!inTable) { out += '<table>'; inTable = true; tableFirst = true; }
      var cells = trimmed.slice(1,-1).split('|');
      if (tableFirst) {
        out += '<tr>' + cells.map(function(c){ return '<th>' + inlineFmt(c.trim()) + '</th>'; }).join('') + '</tr>';
        tableFirst = false;
      } else {
        out += '<tr>' + cells.map(function(c){ return '<td>' + inlineFmt(c.trim()) + '</td>'; }).join('') + '</tr>';
      }
      continue;
    }
    closeTable();

    if (/^#{1,2} /.test(trimmed)) { closeList(); out += '<h2>' + inlineFmt(trimmed.replace(/^#{1,2} /,'')) + '</h2>'; continue; }
    if (/^### /.test(trimmed))     { closeList(); out += '<h3>' + inlineFmt(trimmed.slice(4)) + '</h3>'; continue; }
    if (/^#### /.test(trimmed))    { closeList(); out += '<h4>' + inlineFmt(trimmed.slice(5)) + '</h4>'; continue; }

    if (/^[-*] /.test(trimmed)) {
      if (!inUl) { closeList(); out += '<ul>'; inUl = true; }
      out += '<li>' + inlineFmt(trimmed.slice(2)) + '</li>';
      continue;
    }
    if (/^\d+\. /.test(trimmed)) {
      if (!inOl) { closeList(); out += '<ol>'; inOl = true; }
      out += '<li>' + inlineFmt(trimmed.replace(/^\d+\. /,'')) + '</li>';
      continue;
    }
    closeList();

    if (/^---+$/.test(trimmed)) { out += '<hr>'; continue; }
    if (trimmed === '') { out += '<br>'; continue; }
    out += '<p>' + inlineFmt(line) + '</p>';
  }
  closeList(); closeTable();
  return out;
}

/* ══════════════════════════════════════════════
   PARSER FICHE — FORMAT ##FICHE##...##FINFICHE##
   (même format que l'ancienne version)
══════════════════════════════════════════════ */
function parseFicheV2(text, topic) {
  /* Extraire le bloc entre ##FICHE## et ##FINFICHE## */
  var block = text;
  var m = text.match(/##FICHE##([\s\S]*?)(?:##FINFICHE##|$)/);
  if (m) block = m[1];

  /* Extraire titre et matière */
  var titre = ((block.match(/^TITRE:([^\n]+)/im) || [])[1] || topic || 'Fiche').trim();
  var mat   = ((block.match(/^MATIERE:([^\n]+)/im) || [])[1] || '').trim().toLowerCase();

  /* Couleur selon la matière */
  var MC = { histoire:'#dc2626', 'géo':'#d97706', géographie:'#d97706', maths:'#059669',
             français:'#0891b2', physique:'#6366f1', chimie:'#6366f1', svt:'#16a34a',
             biologie:'#16a34a', anglais:'#0891b2', espagnol:'#ea580c',
             philo:'#6d28d9', ses:'#ea580c' };
  var accentCol = '#6366f1';
  for (var k in MC) { if (mat.indexOf(k) >= 0) { accentCol = MC[k]; break; } }

  var PALS = [
    {c:'#6366f1',bg:'rgba(99,102,241,.08)'},  {c:'#059669',bg:'rgba(5,150,105,.08)'},
    {c:'#d97706',bg:'rgba(217,119,6,.08)'},   {c:'#dc2626',bg:'rgba(220,38,38,.08)'},
    {c:'#0891b2',bg:'rgba(8,145,178,.08)'},   {c:'#16a34a',bg:'rgba(22,163,74,.08)'},
    {c:'#ea580c',bg:'rgba(234,88,12,.08)'}
  ];

  /* Parser les sections */
  var lines = block.split('\n');
  var sections = [], cur = null, retenirLines = [], inRetenir = false;
  for (var i = 0; i < lines.length; i++) {
    var ln = lines[i];
    if (/^(TITRE|MATIERE|NIVEAU):/i.test(ln)) continue;
    if (ln.startsWith('##FIN')) break;
    if (ln.startsWith('SECTION:')) {
      if (cur && cur.lines.length) sections.push({ name: cur.name, lines: cur.lines });
      cur = { name: ln.slice(8).trim(), lines: [] };
      inRetenir = false;
    } else if (ln.startsWith('RETENIR:')) {
      if (cur && cur.lines.length) sections.push({ name: cur.name, lines: cur.lines });
      cur = null; inRetenir = true;
    } else if (ln.startsWith('MINITEST:')) {
      if (cur && cur.lines.length) sections.push({ name: cur.name, lines: cur.lines });
      cur = null; inRetenir = false;
    } else if (cur !== null) {
      cur.lines.push(ln);
    } else if (inRetenir && ln.trim()) {
      retenirLines.push(ln.trim());
    }
  }
  if (cur && cur.lines.length) sections.push({ name: cur.name, lines: cur.lines });

  /* Rendu du contenu d'une section */
  function fmtB(s) {
    s = s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return s.replace(/\*\*([^*\n]+)\*\*/g,
      '<strong style="color:' + accentCol + ';background:rgba(99,102,241,.08);padding:0 3px;border-radius:3px">$1</strong>');
  }
  function renderLines(ls) {
    var html = '', ulItems = [];
    function flushUl() {
      if (!ulItems.length) return;
      html += '<ul style="margin:4px 0;padding:0;list-style:none">' +
        ulItems.map(function(x) {
          return '<li style="display:flex;gap:7px;margin-bottom:3px;line-height:1.55;font-size:13px">' +
            '<span style="color:' + accentCol + ';flex-shrink:0;font-size:11px;margin-top:2px">▸</span>' +
            '<span>' + x + '</span></li>';
        }).join('') + '</ul>';
      ulItems = [];
    }
    ls.forEach(function(ln) {
      var t = ln.trim();
      if (!t) { flushUl(); return; }
      if (/^[•\-→▸\*]\s+/.test(t)) {
        ulItems.push(fmtB(t.replace(/^[•\-→▸\*]\s+/, '')));
      } else if (/^\d+[.)]\s+/.test(t)) {
        flushUl();
        html += '<div style="margin-bottom:4px;font-size:13px;line-height:1.55">' + fmtB(t) + '</div>';
      } else if (/^\|.+\|/.test(t)) {
        flushUl();
        html += '<div style="font-size:12px;font-family:monospace;margin:2px 0;opacity:.85">' + fmtB(t) + '</div>';
      } else {
        flushUl();
        html += '<div style="margin-bottom:3px;font-size:13px">' + fmtB(t) + '</div>';
      }
    });
    flushUl();
    return html;
  }

  /* Rendu des sections */
  var secHtml = sections.map(function(s, i) {
    var p = PALS[i % PALS.length];
    return '<div class="fsec" style="border-left:3px solid ' + p.c + ';background:' + p.bg + ';padding:10px 14px;margin-bottom:1px">' +
      '<div class="fsec-label" style="color:' + p.c + ';font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px">📌 ' + esc(s.name) + '</div>' +
      '<div class="fsec-body" style="font-family:var(--fb),sans-serif">' + renderLines(s.lines) + '</div></div>';
  }).join('');

  /* Bloc À RETENIR */
  var retenirHtml = '';
  if (retenirLines.length) {
    retenirHtml = '<div class="fsec" style="border-left:3px solid #f59e0b;background:rgba(245,158,11,.08);padding:10px 14px">' +
      '<div class="fsec-label" style="color:#d97706;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px">⭐ À RETENIR</div>' +
      '<ul style="margin:0;padding:0;list-style:none">' +
        retenirLines.map(function(l) {
          return '<li style="display:flex;gap:7px;margin-bottom:3px;font-size:13px;line-height:1.55">' +
            '<span style="color:#f59e0b;flex-shrink:0">▸</span><span>' + fmtB(l.replace(/^[•\-]\s*/,'')) + '</span></li>';
        }).join('') + '</ul></div>';
  }

  /* Si pas de sections (l'IA n'a pas utilisé le format) — fallback mdToHtml */
  if (!sections.length) {
    return '<div class="fwrap-paper"><div class="fiche-paper-hdr">' +
      '<div class="fiche-paper-badge">&#128196; Fiche de révision · ScolarIA</div>' +
      '<div class="fiche-paper-title">' + esc(titre) + '</div></div>' +
      '<div class="fiche-paper-body" style="padding:12px 16px">' + mdToHtml(text) + '</div></div>';
  }

  return '<div class="fwrap-paper"><div class="fiche-paper-hdr">' +
    '<div class="fiche-paper-badge">&#128196; Fiche de révision · ScolarIA</div>' +
    '<div class="fiche-paper-title">' + esc(titre) + '</div>' +
    (mat ? '<div style="font-family:\'Caveat\',cursive;font-size:13px;color:#6b5824;margin-top:3px;opacity:.85">' + esc(mat.charAt(0).toUpperCase() + mat.slice(1)) + ' · ' + esc(getClasse()) + '</div>' : '') +
    '</div><div class="fiche-paper-body">' + secHtml + retenirHtml + '</div></div>';
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 96) + 'px';
}

function chatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
}

function addMsg(text, role) {
  const msgs = document.getElementById('chat-msgs');
  const welcome = msgs.querySelector('.chat-welcome');
  if (welcome) welcome.remove();
  const div = document.createElement('div');
  div.className = 'msg msg-' + role;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

/* ══ INTERROGATION DANS LE CHAT (outil de l'IA) ══
   L'IA du chat dispose de l'outil lancer_interrogation (function calling) : elle
   l'appelle d'elle-meme quand l'eleve veut etre interroge. L'interro se deroule ensuite
   dans le chat : une question a la fois (boutons pour les QCM, reponse ecrite en bas
   sinon), correction apres chaque reponse, puis bilan. Fonctions cq*, CSS .cq- */
var CHAT_TOOLS = [{
  type: 'function',
  function: {
    name: 'lancer_interrogation',
    description: 'Lance une interrogation INTERACTIVE dans le chat : l\'application pose les questions une par une, l\'élève répond, reçoit une correction puis son score. ' +
      'Utilise cet outil dès que l\'élève veut être interrogé, testé ou évalué : « interroge-moi », « pose-moi des questions », « teste-moi », « fais-moi un quiz / un QCM », « vérifie si je connais ma leçon », « je veux m\'entraîner pour mon contrôle ». ' +
      'Ne l\'utilise PAS pour une simple question, une explication, une fiche ou des flashcards.',
    parameters: {
      type: 'object',
      properties: {
        sujet: { type: 'string', description: 'Sujet précis (ex : « théorème de Pythagore »). Si l\'élève dit « là-dessus » ou « sur ça », reprends le sujet de la conversation.' },
        nb_questions: { type: 'integer', description: 'Nombre de questions, de 3 à 10 (5 par défaut).' },
        format: { type: 'string', enum: ['mixte', 'qcm', 'ouvertes'], description: 'mixte (par défaut) = QCM et questions ouvertes ; qcm = seulement des QCM ; ouvertes = seulement des réponses à écrire.' }
      },
      required: ['sujet']
    }
  }
}];
var CHAT_TOOL_HINT = 'OUTIL DISPONIBLE : quand l\'élève veut être interrogé, testé, vérifier ses connaissances ou faire un quiz, appelle l\'outil lancer_interrogation au lieu d\'écrire toi-même des questions ou un tableau.';
/* Demande explicite d'interro -> on impose l'outil (l'IA choisit seulement sujet / nombre / format).
   Attention : « l'interrogation directe » (grammaire) ne doit PAS declencher d'interro. */
var CQ_DEMANDE = /interroge[sz]?[- ]?moi|m.interroger|interro sur|interrogation sur|une interro\b|teste[sz]?[- ]?moi|me tester|\bquiz|\bqcm|questionne[sz]?[- ]?moi|pose[sz]?[- ]?moi (des|quelques|\d+) questions|[ée]value[sz]?[- ]?moi/i;

var _cq = null;       /* interro en cours : { sujet, qs, i, score, ratees, attente, el } */
var _cqLast = null;   /* derniere interro (pour « Nouvelles questions ») */

function cqBubble(html, el) {
  var msgs = document.getElementById('chat-msgs');
  var w = msgs.querySelector('.chat-welcome'); if (w) w.remove();
  if (!el) { el = document.createElement('div'); msgs.appendChild(el); }
  el.className = 'msg msg-ai cq-msg';
  el.style.maxWidth = '100%';
  el.innerHTML = html;
  msgs.scrollTop = msgs.scrollHeight;
  return el;
}
function cqSetInput(on) {
  var inp = document.getElementById('chat-input');
  if (inp && !_webMode) inp.placeholder = on ? 'Ta réponse…' : 'Pose ta question...';
}
function cqLettre(k) { return 'ABCD'.charAt(k); }

/* Q: ... / A) ... B) ... / R: lettre ou réponse -> [{ q, opts, bon, a }] */
function cqParse(text) {
  var qs = [], cur = null;
  String(text || '').split('\n').forEach(function(l) {
    l = l.trim().replace(/\*\*/g, '');
    var m;
    if ((m = l.match(/^Q\s*\d*\s*[:.)-]\s*(.+)$/i))) { cur = { q: m[1].trim(), opts: [], a: '' }; qs.push(cur); }
    else if (cur && (m = l.match(/^([A-D])\s*[).:-]\s*(.+)$/))) cur.opts.push(m[2].trim());
    else if (cur && (m = l.match(/^R(?:éponse)?\s*[:.)-]\s*(.+)$/i))) cur.a = m[1].trim();
  });
  return qs.filter(function(q) {
    if (!q.q || !q.a) return false;
    if (q.opts.length < 2) { q.opts = []; return true; }
    var lt = q.a.match(/^\(?([A-D])\b/i);
    q.bon = lt ? 'ABCD'.indexOf(lt[1].toUpperCase())
               : q.opts.map(function(o) { return o.toLowerCase(); }).indexOf(q.a.toLowerCase());
    if (q.bon < 0 || q.bon >= q.opts.length) return false;   /* QCM mal forme : ignore */
    q.a = cqLettre(q.bon) + '. ' + q.opts[q.bon];
    return true;
  });
}

async function cqStart(args, el, demande) {
  args = args || {};
  var sujet = String(args.sujet || '').trim() || demande;
  var nb = Math.max(3, Math.min(10, parseInt(args.nb_questions, 10) || 5));
  var format = (args.format === 'qcm' || args.format === 'ouvertes') ? args.format : 'mixte';
  el.className = 'msg msg-ai thinking';
  el.textContent = 'Je prépare ton interrogation sur « ' + sujet + ' »…';
  var consigne = format === 'qcm' ? 'uniquement des QCM à 4 choix'
    : format === 'ouvertes' ? 'uniquement des questions à réponse courte (aucun QCM)'
    : 'environ moitié QCM à 4 choix, moitié questions à réponse courte';
  /* args.cours : texte d'un cours de l'eleve (Mes cours) -> questions UNIQUEMENT sur ce cours */
  var surCours = args.cours ? 'Les questions portent UNIQUEMENT sur ce cours de l\'élève :\n"""\n' + String(args.cours).slice(0, 6000) + '\n"""\n' : '';
  var prompt = surCours + 'Prépare une interrogation de ' + nb + ' questions sur « ' + sujet + ' » : ' + consigne + '.\n' +
    'Du plus simple au plus difficile, sur l\'essentiel de ce qui tombe en contrôle. Réponses courtes et exactes, une seule bonne réponse par QCM.\n' +
    'FORMAT EXACT, rien d\'autre :\nQ: question\nA) choix\nB) choix\nC) choix\nD) choix\nR: lettre de la bonne réponse\n\n' +
    'ou, pour une question ouverte :\nQ: question\nR: réponse attendue (courte ; si plusieurs réponses sont justes, donnes-en 2 ou 3 séparées par « ; »)';
  try {
    var txt = await callGroq([{ role: 'system', content: SCOLARIA_SYSTEM }, { role: 'user', content: prompt }], 1600, { niveau: 'revision' });
    var qs = cqParse(txt).slice(0, nb);
    if (qs.length < 2) throw new Error('Je n\'ai pas réussi à préparer les questions, réessaie.');
    _cq = { sujet: sujet, qs: qs, i: 0, score: 0, ratees: [], attente: false, el: null };
    _cqLast = { sujet: sujet, nb_questions: nb, format: format };
    cqBubble('<div class="cq-intro"><b>Interrogation : ' + esc(sujet) + '</b>' + qs.length +
      ' questions. Touche la bonne lettre pour les QCM, sinon écris ta réponse en bas. Écris « stop » pour arrêter.</div>', el);
    chatHistory.push({ role: 'user', content: demande });
    chatHistory.push({ role: 'assistant', content: '[Interrogation interactive lancée : ' + qs.length + ' questions sur « ' + sujet + ' »]' });
    if (chatHistory.length > 24) chatHistory = chatHistory.slice(-24);
    saveChatLS();
    cqSetInput(true);
    cqAsk();
  } catch(e) {
    el.className = 'msg msg-ai';
    el.textContent = 'Erreur : ' + e.message;
  }
}

function cqAsk() {
  var q = _cq.qs[_cq.i], n = _cq.qs.length;
  var h = '<div class="cq-head"><span>Question ' + (_cq.i + 1) + '/' + n + ' · ' + esc(_cq.sujet) + '</span>' +
      '<button class="cq-stop" onclick="cqStop()">Arrêter</button></div>' +
    '<div class="cq-prog"><i style="width:' + Math.round(_cq.i / n * 100) + '%"></i></div>' +
    '<div class="cq-q">' + esc(q.q) + '</div>';
  if (q.opts.length) {
    h += '<div class="cq-opts">' + q.opts.map(function(o, k) {
      return '<button class="cq-opt" onclick="cqChoix(this,' + k + ')"><b>' + cqLettre(k) + '</b><span>' + esc(o) + '</span></button>';
    }).join('') + '</div>';
  } else {
    h += '<div class="cq-hint">✍️ Écris ta réponse en bas</div>';
  }
  _cq.el = cqBubble(h);
  _cq.attente = true;
  if (!q.opts.length) { var inp = document.getElementById('chat-input'); if (inp) inp.focus(); }
}

/* Correction IA d'une reponse (courte, adaptee a la classe) */
function cqCorrigerIA(q, rep) { return corrigerReponse(q.q, q.a, rep, q.opts); }

/* QCM : touche d'une lettre */
async function cqChoix(btn, k) {
  if (!_cq || !_cq.attente || !_cq.el || !_cq.el.contains(btn)) return;
  _cq.attente = false;
  var q = _cq.qs[_cq.i];
  var boutons = _cq.el.querySelectorAll('.cq-opt');
  Array.prototype.forEach.call(boutons, function(b, j) {
    b.disabled = true;
    if (j === q.bon) b.classList.add('ok');
    else if (j === k) b.classList.add('ko');
  });
  addMsg(cqLettre(k) + '. ' + q.opts[k], 'user');
  if (k === q.bon) { cqCorrection(null, true, q, cqLettre(k), ''); return; }
  var fb = cqBubble('<div class="cq-wait">Correction…</div>');
  var expl = '';
  try { expl = (await cqCorrigerIA(q, cqLettre(k) + ') ' + q.opts[k])).expl; } catch(e) {}
  cqCorrection(fb, false, q, cqLettre(k), expl);
}

/* Reponse ecrite dans la barre du chat */
async function cqRepondreTexte(text) {
  addMsg(text, 'user');
  if (/^(stop|fin|quitter|arr[eê]te|arr[eê]ter|j.arr[eê]te)\b/i.test(text.trim())) { cqStop(); return; }
  _cq.attente = false;
  var q = _cq.qs[_cq.i];
  /* QCM : une lettre seule suffit */
  var lt = q.opts.length ? text.trim().match(/^([A-Da-d])\s*[).]?$/) : null;
  if (lt) {
    var k = 'ABCD'.indexOf(lt[1].toUpperCase());
    if (k < q.opts.length) {
      Array.prototype.forEach.call(_cq.el.querySelectorAll('.cq-opt'), function(b, j) {
        b.disabled = true;
        if (j === q.bon) b.classList.add('ok'); else if (j === k) b.classList.add('ko');
      });
      if (k === q.bon) { cqCorrection(null, true, q, text, ''); return; }
    }
  }
  var fb = cqBubble('<div class="cq-wait">Correction…</div>');
  try {
    var c = await cqCorrigerIA(q, text);
    cqCorrection(fb, c.ok, q, text, c.expl);
  } catch(e) {
    cqCorrection(fb, null, q, text, 'Je n\'ai pas pu corriger (' + e.message + ').');
  }
}

/* ok : true / false / null (correction impossible : non comptee) */
function cqCorrection(el, ok, q, rep, expl) {
  if (!_cq) return;
  if (ok === true) _cq.score++;
  if (ok === false) _cq.ratees.push({ q: q.q, rep: rep, a: q.a, qcm: q.opts.length > 0 });
  var titre = ok === true ? '✅ Bonne réponse !' : ok === false ? '❌ Pas tout à fait' : '⚠️ Correction indisponible';
  /* question ouverte : la reponse prevue n'est qu'un exemple parmi d'autres bonnes reponses */
  var solLbl = q.opts.length ? 'Bonne réponse : ' : 'Exemple de bonne réponse : ';
  var html = '<b>' + titre + '</b>' + (expl ? '<div>' + esc(expl) + '</div>' : '') +
    (ok !== true ? '<div class="cq-sol">' + solLbl + esc(q.a) + '</div>' : '');
  el = cqBubble(html, el);
  el.classList.add('cq-fb', ok === true ? 'ok' : 'ko');
  _cq.i++;
  setTimeout(function() {
    if (!_cq) return;
    if (_cq.i >= _cq.qs.length) cqFin(); else cqAsk();
  }, ok === true ? 500 : 900);
}

function cqFin() {
  var c = _cq; _cq = null;
  cqSetInput(false);
  var n = c.i;   /* questions vraiment posees (moins si arret) */
  if (!n) { cqBubble('Interrogation arrêtée.'); return; }
  var pct = Math.round(c.score / n * 100);
  var mot = pct === 100 ? 'Parfait, tu maîtrises !' : pct >= 70 ? 'Très bien ! Revois juste les points ratés.'
    : pct >= 40 ? 'C\'est un début : revois les points ratés.' : 'Pas de panique : relis ton cours puis recommence.';
  var h = '<div class="cq-end"><div class="cq-score">' + c.score + '/' + n + '</div><div class="cq-end-t">' + mot + '</div>';
  if (c.ratees.length) {
    h += '<div class="cq-sec">À revoir</div>' + c.ratees.map(function(r) {
      return '<div class="cq-err"><div>' + esc(r.q) + '</div><span>' + (r.qcm ? '' : 'Ex. : ') + esc(r.a) + '</span></div>';
    }).join('');
  }
  h += '<div class="cq-btns"><button onclick="cqRefaire()">Nouvelles questions</button>' +
    (c.ratees.length ? '<button onclick="cqExpliquer()">Explique-moi mes erreurs</button>' : '') + '</div></div>';
  cqBubble(h);
  /* progression (anneau « Quiz » de l'accueil) + historique */
  try {
    var s = JSON.parse(localStorage.getItem('sk_quiz_stats') || '{"ok":0,"total":0}');
    s.total += n; s.ok += c.score;
    localStorage.setItem('sk_quiz_stats', JSON.stringify(s));
  } catch(e) {}
  addToHist('quiz', c.sujet, 'Interrogation', c.qs.map(function(q) {
    return 'Q: ' + q.q + (q.opts.length ? '\n' + q.opts.map(function(o, k) { return cqLettre(k) + ') ' + o; }).join('\n') : '') + '\nR: ' + q.a;
  }).join('\n\n'));
  if (typeof renderFavs === 'function') renderFavs();
  /* le chat se souvient du resultat : « explique-moi mes erreurs » fonctionne ensuite */
  chatHistory.push({ role: 'assistant', content: 'Résultat de l\'interrogation sur « ' + c.sujet + ' » : ' + c.score + '/' + n + '.' +
    (c.ratees.length ? ' Questions ratées : ' + c.ratees.map(function(r) { return r.q + ' (attendu : ' + r.a + ' ; réponse de l\'élève : ' + r.rep + ')'; }).join(' | ') : ' Aucune erreur.') });
  if (chatHistory.length > 24) chatHistory = chatHistory.slice(-24);
  saveChatLS();
  markActivity(); updateHomeProgression(); updateHomeStats();
}
function cqStop() {
  if (!_cq) return;
  _cq.attente = false;
  if (_cq.el) Array.prototype.forEach.call(_cq.el.querySelectorAll('.cq-opt'), function(b) { b.disabled = true; });
  cqFin();
}
function cqRefaire() {
  if (_cq || !_cqLast) return;
  var el = addMsg('', 'ai thinking');
  cqStart(_cqLast, el, 'Interroge-moi encore sur ' + _cqLast.sujet);
}
function cqExpliquer() {
  var inp = document.getElementById('chat-input');
  if (!inp || _cq) return;
  inp.value = 'Explique-moi mes erreurs de l\'interrogation, simplement.';
  sendChat();
}

/* ── Recherche internet : bouton 🌐 (valable pour la prochaine question) ── */
var _webMode = false;
function setWebMode(on) {
  _webMode = on;
  var b = document.getElementById('chat-web-btn');
  if (b) { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); }
  var inp = document.getElementById('chat-input');
  if (inp) inp.placeholder = on ? 'Recherche sur internet…' : 'Pose ta question...';
}
function toggleWebSearch() {
  if (_webMode) { setWebMode(false); return; }
  var reste = WEB_MAX_PAR_JOUR - webUsedToday();
  if (reste <= 0) { toast('Tu as utilisé tes ' + WEB_MAX_PAR_JOUR + ' recherches internet du jour. Reviens demain !', 4000); return; }
  setWebMode(true);
  toast('Recherche internet activée (' + reste + ' restante' + (reste > 1 ? 's' : '') + ' aujourd\'hui)', 3000);
  var inp = document.getElementById('chat-input'); if (inp) inp.focus();
}
function webSourcesHtml(sources) {
  if (!sources || !sources.length) return '';
  return '<div class="chat-src"><div class="chat-src-t">Sources</div>' + sources.map(function(s) {
    var host = ''; try { host = new URL(s.url).hostname.replace(/^www\./, ''); } catch(e) {}
    return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.title) + '<span>' + esc(host) + '</span></a>';
  }).join('') + '</div>';
}

async function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  /* Interrogation en cours : ce qu'on ecrit est la reponse a la question */
  if (_cq && !_webMode) {
    if (!_cq.attente) { toast('Attends la correction…'); return; }
    input.value = '';
    autoResize(input);
    cqRepondreTexte(text);
    return;
  }
  if (_chatBusy) { toast('Attends la fin de la réponse…'); return; }
  _chatBusy = true;
  try { await _sendChat(input, text); } finally { _chatBusy = false; }
}
async function _sendChat(input, text) {
  input.value = '';
  autoResize(input);
  markActivity();
  collapseShortcuts();

  addMsg(text, 'user');
  const thinking = addMsg(_webMode ? 'ScolarIA cherche sur internet… (environ 10 secondes)' : 'ScolarIA réfléchit…', 'ai thinking');
  const msgs = document.getElementById('chat-msgs');

  /* ── Question avec recherche internet ── */
  if (_webMode) {
    setWebMode(false);
    webCount();
    try {
      var wMsgs = [{ role: 'system', content: SCOLARIA_SYSTEM }];
      chatHistIA(6).forEach(function(h){ wMsgs.push(h); });
      wMsgs.push({ role: 'user', content: text });
      var w = await callGroqWeb(wMsgs);
      thinking.classList.remove('thinking');
      thinking.style.maxWidth = '100%';
      thinking.innerHTML = '<div class="chat-web-tag">🌐 Recherche internet</div>' + mdToHtml(w.text) + webSourcesHtml(w.sources);
      chatHistory.push({ role: 'user', content: text });
      chatHistory.push({ role: 'assistant', content: w.text });
      if (chatHistory.length > 24) chatHistory = chatHistory.slice(-24);
      saveChatLS();
      updateHomeStats();
    } catch(e) {
      thinking.textContent = 'Erreur : ' + e.message;
      thinking.classList.remove('thinking');
    }
    msgs.scrollTop = msgs.scrollHeight;
    return;
  }

  /* Fiche / flashcards → résultat en carte (pas de streaming).
     Tout le reste (questions, interrogations, résumés…) → streaming. */
  var _structured = /\bfiches?\b|\bflashcards?\b/i.test(text) && !CQ_DEMANDE.test(text);

  try {
    var reply;

    if (!_structured) {
      /* ── Streaming token par token ── */
      var sMsgs = [{ role: 'system', content: SCOLARIA_SYSTEM }];
      chatHistIA(12).forEach(function(h){ sMsgs.push(h); });
      /* consigne de l'outil juste avant le message : elle pese plus que perdue en haut du prompt */
      sMsgs.push({ role: 'system', content: CHAT_TOOL_HINT });
      sMsgs.push({ role: 'user', content: text });
      var gotText = false;
      var forcer = CQ_DEMANDE.test(text);
      var out = await callGroqStream(sMsgs, function(full){
        if (!gotText) { gotText = true; thinking.classList.remove('thinking'); thinking.style.maxWidth = '100%'; }
        var enBas = chatEnBas(msgs);
        thinking.innerHTML = mdToHtml(full);
        if (enBas) msgs.scrollTop = msgs.scrollHeight;
      }, undefined, { tools: CHAT_TOOLS, toolChoice: forcer ? { type: 'function', function: { name: 'lancer_interrogation' } } : 'auto' });
      /* L'IA a decide d'utiliser l'outil d'interrogation */
      var tool = out.toolCalls.filter(function(c){ return c.name === 'lancer_interrogation'; })[0];
      if (tool) { await cqStart(tool.args, thinking, text); return; }
      reply = out.text;
      chatHistory.push({ role: 'user', content: text });
      chatHistory.push({ role: 'assistant', content: reply });
      if (chatHistory.length > 24) chatHistory = chatHistory.slice(-24);
      saveChatLS();
      updateHomeStats();
      var enBas2 = chatEnBas(msgs);
      thinking.innerHTML = mdToHtml(reply);
      if (enBas2) msgs.scrollTop = msgs.scrollHeight;
      return;
    }

    /* ── Fiche / flashcards : réponse en une fois ── */
    var groqMsgs = [{ role: 'system', content: SCOLARIA_SYSTEM }];
    chatHistIA(12).forEach(function(h){ groqMsgs.push(h); });
    groqMsgs.push({ role: 'user', content: text });
    reply = await callGroq(groqMsgs, undefined, { niveau: 'revision' });

    chatHistory.push({ role: 'user', content: text });
    chatHistory.push({ role: 'assistant', content: reply });
    if (chatHistory.length > 24) chatHistory = chatHistory.slice(-24);
    saveChatLS();
    updateHomeStats();

    var detectedType = detectChatType(reply);
    if (detectedType) {
      var chatTopic = extractChatTopic(text);
      var chatLabels = { fiche: 'Fiche', flashcards: 'Flashcards', quiz: 'Interrogation', resume: 'Résumé' };
      var chatLabel = chatLabels[detectedType] || 'Résultat';
      window._revLastReply = reply;
      window._revLastLabel = chatLabel;
      window._revLastTopic = chatTopic;
      window._revLastType  = detectedType;
      addToHist(detectedType, chatTopic, chatLabel, reply);
      renderFavs();
      if (detectedType === 'flashcards') {
        var chatCards = parseFlashCards(reply, 20);
        if (chatCards.length > 0) saveRevDeck(chatTopic, chatCards);
      }
      var isChatFav = (function(){ var h=loadHist(); for(var i=0;i<h.length;i++){if(h[i].id===_histCurrentId)return h[i].fav;} return false; })();
      var cff = isChatFav ? '#f59e0b' : 'none';
      var cfs = isChatFav ? '#f59e0b' : 'var(--mu)';
      var chatIcos = { fiche: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>', flashcards: '<rect x="4" y="6" width="16" height="12" rx="2"/><rect x="2" y="4" width="16" height="12" rx="2"/>', quiz: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' };
      var chatIco = chatIcos[detectedType] || chatIcos.fiche;
      thinking.className = 'msg msg-ai';
      thinking.style.maxWidth = '100%';
      thinking.style.padding = '8px';
      thinking.innerHTML =
        '<div class="rev-result-preview" onclick="openRevFullscreen()" style="margin:0">' +
          '<div class="rev-result-preview-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + chatIco + '</svg></div>' +
          '<div class="rev-result-preview-info">' +
            '<div class="rev-result-preview-name">' + chatLabel + ' prête !</div>' +
            '<div class="rev-result-preview-sub">' + esc(chatTopic) + '</div>' +
          '</div>' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mu)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</div>' +
        '<div style="display:flex;gap:8px;margin-top:8px">' +
          '<button onclick="openRevFullscreen()" style="flex:1;padding:11px;border:none;border-radius:12px;background:var(--accent);color:#fff;font-size:13px;font-weight:800;font-family:var(--fb);cursor:pointer">Voir</button>' +
          '<button id="chat-fav-btn" onclick="toggleFavChat()" style="width:44px;height:44px;border-radius:12px;border:1.5px solid var(--bord);background:var(--bg);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;-webkit-tap-highlight-color:transparent">' +
            '<svg id="chat-fav-ico" viewBox="0 0 24 24" width="18" height="18" fill="' + cff + '" stroke="' + cfs + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
          '</button>' +
        '</div>';
    } else {
      thinking.innerHTML = mdToHtml(reply);
      thinking.classList.remove('thinking');
    }
  } catch(e) {
    thinking.textContent = 'Erreur : ' + e.message;
    thinking.classList.remove('thinking');
  }
  msgs.scrollTop = msgs.scrollHeight;
}

function detectChatType(reply) {
  if (reply.indexOf('##FICHE##') !== -1) return 'fiche';
  var lines = reply.split('\n');
  var tableRows = lines.filter(function(l) {
    var t = l.trim();
    return t.startsWith('|') && t.endsWith('|') && !(/^\|\s*[-:]+/).test(t);
  });
  if (tableRows.length >= 3) return 'flashcards';
  return null;
}

function extractChatTopic(text) {
  var cuts = [
    'fiche de révision complète sur : ',
    'fiche de révision sur : ',
    'flashcards question/réponse sur : ',
    'flashcards sur : ',
    'interrogation de 8 questions (QCM + réponse courte) sur : ',
    'interrogation sur : ',
    'Résume en 7 points clés : ',
    'résumé sur : ',
    'fiche sur ',
    'flashcard sur '
  ];
  var lower = text.toLowerCase();
  for (var i = 0; i < cuts.length; i++) {
    var idx = lower.indexOf(cuts[i].toLowerCase());
    if (idx !== -1) return text.substring(idx + cuts[i].length).trim().replace(/["""]/g, '');
  }
  return text.substring(0, 50).trim();
}

function toggleFavChat() { if (_histCurrentId) toggleFav(_histCurrentId, 'chat-fav-ico'); }
