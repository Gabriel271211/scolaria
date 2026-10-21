/* ScolarIA — js/cours.js
   Mes cours : cahiers, pages de cahier modifiables, mise en forme, scan → cours.
   Chargé par scolaria-home-v2.html, dans l'ordre des <script> (une ligne exécutée au chargement
   ne peut utiliser que les fonctions des fichiers chargés AVANT celui-ci). */

/* ══════════════════════════════════════════════
   MES COURS — des notes facon « Notes » d'Apple, sur papier de cahier
   sk_cours   (synchronise) : [{ id, titre, mat, pages, suites, html, texte, cahier, cree, maj }]
   sk_cahiers (synchronise) : [{ id, nom, couleur, cree }]
   html  = contenu mis en forme (nettoye par mcPropre), modifie directement
   texte = version texte brut, utilisee par l'IA (fiche, flashcards, interro)
   Fonctions mc*, CSS .mc-, panneau #mc-panel
══════════════════════════════════════════════ */
var MC_KEY = 'sk_cours', MCC_KEY = 'sk_cahiers';
var MC_COULEURS = ['#4f46e5', '#e84040', '#16a34a', '#f59e0b', '#0ea5e9', '#a855f7', '#ec4899', '#64748b'];
var _mc = { vue: 'cahiers', cahier: null, cours: null };   /* cahier : id, 'tous' ou 'sans' */
var _mcTimer = null, _mcScanCahier = null, _mcSheetCb = null;

/* ── Donnees ── */
function mcLoad() { try { var l = JSON.parse(localStorage.getItem(MC_KEY) || '[]'); return Array.isArray(l) ? l : []; } catch(e) { return []; } }
function mcSaveAll(l) {
  try { localStorage.setItem(MC_KEY, JSON.stringify(l)); }
  catch(e) { toast('Mémoire pleine : supprime un ancien cours'); }
  scheduleSync();
  mcRenderRev();
}
function mccLoad() { try { var l = JSON.parse(localStorage.getItem(MCC_KEY) || '[]'); return Array.isArray(l) ? l : []; } catch(e) { return []; } }
function mccSaveAll(l) { try { localStorage.setItem(MCC_KEY, JSON.stringify(l)); } catch(e) {} scheduleSync(); }
function mccGet(id) { return mccLoad().filter(function(k) { return k.id === id; })[0] || null; }
function mcGet(id) { return mcLoad().filter(function(c) { return c.id === id; })[0] || null; }
function mcPut(c, garderDate) {
  if (!garderDate) c.maj = Date.now();
  var l = mcLoad(), trouve = false;
  l = l.map(function(x) { if (x.id === c.id) { trouve = true; return c; } return x; });
  if (!trouve) l.unshift(c);
  mcSaveAll(l);
}
function mcNouveau(titre, mat, html, texte, cahier) {
  var c = { id: 'm' + Date.now(), titre: titre || '', mat: mat || '', html: html || '', texte: texte || '', pages: [html || ''],
            cahier: cahier || '', cree: Date.now(), maj: Date.now() };
  mcPut(c);
  return c;
}
function mcDuCahier(id) {
  return mcLoad().filter(function(c) {
    if (id === 'tous') return true;
    if (id === 'sans') return !c.cahier || !mccGet(c.cahier);
    return c.cahier === id;
  }).sort(function(a, b) { return b.maj - a.maj; });
}
function mcNomCahier(id) {
  if (id === 'tous') return 'Tous les cours';
  if (id === 'sans') return 'Sans cahier';
  var k = mccGet(id); return k ? k.nom : 'Cahier';
}
function mcSansAccent(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
/* Range un cours dans le cahier de sa matiere s'il existe (« Maths » <-> « Mathématiques ») */
function mcCahierAuto(mat) {
  var m = mcSansAccent(mat); if (!m) return '';
  var k = mccLoad().filter(function(k) {
    var n = mcSansAccent(k.nom);
    return n && (n.indexOf(m) !== -1 || m.indexOf(n) !== -1 || (n.length >= 4 && m.slice(0, 4) === n.slice(0, 4)));
  })[0];
  return k ? k.id : '';
}
function mcDate(ts) { return new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }); }
function mcDateLongue(ts) { return new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); }

/* ── HTML sur : seules les balises de mise en forme sont gardees, sans aucun attribut ── */
var MC_TAGS = { H1:1, H2:1, H3:1, P:1, DIV:1, BR:1, UL:1, OL:1, LI:1, B:1, STRONG:1, I:1, EM:1, U:1, S:1, MARK:1,
  TABLE:1, THEAD:1, TBODY:1, TR:1, TH:1, TD:1, HR:1, BLOCKQUOTE:1, CODE:1, SUP:1, SUB:1 };
var MC_JETER = { SCRIPT:1, STYLE:1, IFRAME:1, OBJECT:1, EMBED:1, LINK:1, META:1, IMG:1, SVG:1, VIDEO:1, AUDIO:1,
  FORM:1, INPUT:1, BUTTON:1, TEXTAREA:1, SELECT:1, TEMPLATE:1 };
function mcPropre(html) {
  var tpl = document.createElement('template');
  tpl.innerHTML = String(html || '');
  (function nettoie(parent) {
    Array.prototype.slice.call(parent.childNodes).forEach(function(n) {
      if (n.nodeType === 3) return;
      if (n.nodeType !== 1) { n.remove(); return; }
      var tag = n.tagName;
      if (MC_JETER[tag]) { n.remove(); return; }
      nettoie(n);
      var fond = n.style ? n.style.backgroundColor : '';
      if (tag === 'SPAN' || tag === 'FONT' || !MC_TAGS[tag]) {
        /* le surligneur de l'editeur cree un <span style="background-color"> : on le garde en <mark> */
        if (fond && fond !== 'transparent' && fond !== 'rgba(0, 0, 0, 0)' && fond !== 'inherit') {
          var mk = document.createElement('mark');
          while (n.firstChild) mk.appendChild(n.firstChild);
          n.replaceWith(mk);
        } else {
          while (n.firstChild) parent.insertBefore(n.firstChild, n);
          n.remove();
        }
        return;
      }
      Array.prototype.slice.call(n.attributes).forEach(function(a) { n.removeAttribute(a.name); });
    });
  })(tpl.content);
  return tpl.innerHTML;
}
/* Texte brut (pour l'IA) a partir du HTML */
function mcTexteDe(html) {
  var d = document.createElement('div');
  d.innerHTML = String(html || '')
    .replace(/<li[^>]*>/gi, '<li>- ')
    .replace(/<(br|hr)[^>]*>/gi, '\n')
    .replace(/<\/(p|div|h1|h2|h3|li|tr|blockquote)>/gi, '\n');
  return d.textContent.replace(/\n{3,}/g, '\n\n').trim();
}
/* Markdown de la transcription -> HTML de note (# titre, ## sous-titre, ### ...) */
function mcMd(md) {
  var out = '', buf = [];
  function vide() { if (buf.length) { out += mdToHtml(buf.join('\n')); buf = []; } }
  String(md || '').split('\n').forEach(function(l) {
    var m = l.trim().match(/^(#{1,3})\s+(.+)$/);
    if (m) { vide(); var n = m[1].length; out += '<h' + n + '>' + esc(m[2].replace(/\*\*/g, '')) + '</h' + n + '>'; }
    else buf.push(l);
  });
  vide();
  return mcPropre(out.replace(/<br>/g, '<p><br></p>'));
}

/* Photo -> { titre, mat, texte (markdown) } : copie FIDELE (pas de resume, pas d'adaptation au niveau) */
async function mcTranscrire(dataUrl) {
  var prompt = 'Transcris FIDÈLEMENT tout le texte de cette photo de cours (manuscrit ou imprimé), dans l\'ordre de lecture.\n' +
    'RÈGLES : ne résume pas, n\'ajoute rien, ne corrige pas le fond. Garde la structure avec du markdown simple : # pour les titres, ## pour les sous-titres, - pour les listes, **gras** pour ce qui est souligné ou encadré. ' +
    'Recopie les formules telles quelles (x², √, π, fractions a/b). Mot illisible : [illisible]. Schéma ou dessin : [schéma : courte description]. Tableau : tableau markdown.\n' +
    'FORMAT EXACT de ta réponse :\nTITRE: titre du cours (court)\nMATIERE: la matière (Maths, Français, Histoire-Géo, SVT, Physique-Chimie, Anglais…)\n---\n(la transcription)';
  var txt = await callGroqVision([{ role: 'user', content: [
    { type: 'image_url', image_url: { url: dataUrl } },
    { type: 'text', text: prompt }
  ]}], 3000, { noNiveau: true });
  var titre = '', mat = '', corps = txt;
  var sep = txt.indexOf('\n---');
  if (sep !== -1) {
    var tete = txt.slice(0, sep);
    corps = txt.slice(sep + 4).replace(/^-*\s*\n/, '');
    var mt = tete.match(/TITRE\s*:\s*(.+)/i); if (mt) titre = mt[1].replace(/\*\*/g, '').trim();
    var mm = tete.match(/MATI[EÈ]RE\s*:\s*(.+)/i); if (mm) mat = mm[1].replace(/\*\*/g, '').trim();
  }
  corps = corps.trim();
  if (!corps) throw new Error('Je n\'ai trouvé aucun texte sur cette photo.');
  if (!titre) { var h = corps.match(/^#+\s*(.+)$/m); titre = h ? h[1].trim() : corps.split('\n')[0].slice(0, 50); }
  return { titre: titre.slice(0, 80), mat: mat.slice(0, 30), texte: corps };
}
/* Nouveau cours a partir d'une transcription (scanner) */
function mcDepuisScan(t) {
  var cahier = (_mcScanCahier && mccGet(_mcScanCahier)) ? _mcScanCahier : mcCahierAuto(t.mat);
  _mcScanCahier = null;
  var html = mcMd(t.texte);
  var c = mcNouveau(t.titre, t.mat, html, mcTexteDe(html), cahier);
  if (cahier) toast('Rangé dans le cahier « ' + mcNomCahier(cahier) + ' »');
  return c;
}

/* ══ PANNEAU ══
   Bouton retour du telephone : chaque niveau (cahiers = 1, liste = 2, cours = 3) a une
   entree dans l'historique du navigateur. Le retour Android declenche « popstate » :
   on remonte alors d'un niveau, exactement comme la fleche ‹ en haut a gauche. */
var _mcPile = 0, _mcIgnorePop = 0;
function mcPanelOuvert() { var p = document.getElementById('mc-panel'); return !!p && p.style.display !== 'none'; }
function mcSyncHistorique() {
  if (!mcPanelOuvert()) return;
  var voulu = _mc.vue === 'cours' ? 3 : _mc.vue === 'liste' ? 2 : 1;
  while (_mcPile < voulu) { try { history.pushState({ mc: _mcPile + 1 }, ''); } catch(e) { break; } _mcPile++; }
  if (_mcPile > voulu) { var n = _mcPile - voulu; _mcPile = voulu; _mcIgnorePop++; history.go(-n); }
}
function openMesCours(id) {
  if (typeof closeDrawer === 'function') closeDrawer();
  var p = document.getElementById('mc-panel'); if (p) p.style.display = 'flex';
  mcAjusterHauteur();
  if (id && mcGet(id)) { var c = mcGet(id); _mc.cahier = c.cahier && mccGet(c.cahier) ? c.cahier : 'tous'; mcVueCours(id); }
  else mcVueCahiers();
}
function closeMesCours() {
  mcEnregistrer();
  mcFermerPop();
  mcFermerSheet();
  var p = document.getElementById('mc-panel');
  if (p) { p.style.display = 'none'; p.style.height = ''; p.style.top = ''; }
  _mc.cours = null;
  /* fermeture par un bouton (Fiche, Scanner…) : on retire nos entrees d'historique */
  if (_mcPile > 0) { var n = _mcPile; _mcPile = 0; _mcIgnorePop++; history.go(-n); }
}
function mcRetourInterne() {
  if (_mc.vue === 'cours') { mcEnregistrer(); mcVueListe(_mc.cahier || 'tous'); return; }
  if (_mc.vue === 'liste') { mcVueCahiers(); return; }
  closeMesCours();
}
/* fleche ‹ : passe par l'historique pour rester synchronise avec le bouton du telephone */
function mcRetour() { if (_mcPile > 0) history.back(); else mcRetourInterne(); }
window.addEventListener('popstate', function() {
  if (_mcIgnorePop > 0) { _mcIgnorePop--; navSync(); return; }
  /* hors de Mes cours : bouton retour commun (fenetre du dessus, puis accueil) */
  if (_mcPile <= 0 || !mcPanelOuvert()) { navRetour(); return; }
  _mcPile--;
  /* un menu ou une fenetre ouverte : le retour la ferme seulement */
  var sh = document.getElementById('mc-sheet'), po = document.getElementById('mc-pop');
  if ((sh && sh.style.display !== 'none') || (po && po.style.display !== 'none')) {
    mcFermerSheet(); mcFermerPop(); mcSyncHistorique(); return;
  }
  var a = document.activeElement; if (a && a.isContentEditable) a.blur();
  mcRetourInterne();
});
/* barre du haut : texte du bouton retour + boutons de droite */
function mcHaut(retour, droite) {
  document.getElementById('mc-body').classList.toggle('mc-body-cours', _mc.vue === 'cours');
  document.getElementById('mc-retour-t').textContent = retour;
  document.getElementById('mc-haut-d').innerHTML = droite || '';
}
var MC_ICO = {
  plus: '<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  ecrire: '<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  photo: '<svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  dossier: '<svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>',
  points: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',
  chev: '<svg viewBox="0 0 8 14"><path d="M1.5 1.5L6.5 7L1.5 12.5"/></svg>',
  tous: '<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></svg>'
};
function mcBas(html) {
  var b = document.getElementById('mc-bas');
  b.innerHTML = html || '';
  b.style.display = html ? 'flex' : 'none';
}

/* ── 1. Les cahiers ── */
function mcVueCahiers() {
  _mc.vue = 'cahiers'; _mc.cours = null;
  mcHaut('Retour', '');
  var cahiers = mccLoad(), tous = mcLoad();
  var compte = function(id) { return mcDuCahier(id).length; };
  var h = '<div class="mc-grand">Mes cours</div>' +
    '<div class="mc-cherche"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.6" y2="16.6"/></svg>' +
      '<input id="mc-q" placeholder="Rechercher dans mes cours" oninput="mcChercher(this.value)"></div>' +
    '<div id="mc-zone">';
  h += '<div class="mc-sec">Cahiers</div><div class="mc-groupe">' +
    mcLigneCahier('tous', 'Tous les cours', compte('tous'), 'var(--mu)', true) +
    cahiers.map(function(k) { return mcLigneCahier(k.id, k.nom, compte(k.id), k.couleur); }).join('') +
    (compte('sans') && cahiers.length ? mcLigneCahier('sans', 'Sans cahier', compte('sans'), 'var(--bord)') : '') +
    '</div>';
  if (!cahiers.length) h += '<div class="mc-astuce">Crée un cahier par matière (Maths, Histoire…) : les cours scannés y seront rangés automatiquement.</div>';
  if (!tous.length) h += '<div class="vc-empty"><b>Aucun cours pour l\'instant</b>Scanne une page de ton cahier ou écris un cours : tu pourras le relire et le modifier quand tu veux.</div>';
  h += '</div>';
  document.getElementById('mc-body').innerHTML = h;
  mcBas('<button class="mc-bas-b" onclick="mcNouveauCahier()">' + MC_ICO.dossier + '<span>Nouveau cahier</span></button>' +
    '<span class="mc-bas-c">' + tous.length + ' cours</span>' +
    '<span class="mc-bas-d"><button class="mc-bas-i" onclick="mcScanner()" aria-label="Scanner un cours">' + MC_ICO.photo + '</button>' +
    '<button class="mc-bas-i" onclick="mcEcrire()" aria-label="Écrire un cours">' + MC_ICO.ecrire + '</button></span>');
  mcSyncHistorique();
}
function mcLigneCahier(id, nom, n, couleur, icoTous) {
  return '<div class="mc-ligne" onclick="mcVueListe(\'' + id + '\')">' +
    (icoTous ? '<span class="mc-ico-tous">' + MC_ICO.tous + '</span>' : '<span class="mc-pastille" style="background:' + couleur + '"></span>') +
    '<span class="mc-ligne-t">' + esc(nom) + '</span><span class="mc-ligne-n">' + n + '</span><span class="mc-chev">' + MC_ICO.chev + '</span></div>';
}
function mcChercher(q) {
  q = mcSansAccent(q).trim();
  var zone = document.getElementById('mc-zone'); if (!zone) return;
  if (!q) { mcVueCahiers(); var i = document.getElementById('mc-q'); if (i) i.focus(); return; }
  var l = mcLoad().filter(function(c) { return mcSansAccent(c.titre + ' ' + c.mat + ' ' + c.texte).indexOf(q) !== -1; })
    .sort(function(a, b) { return b.maj - a.maj; });
  zone.innerHTML = '<div class="mc-sec">' + l.length + ' résultat' + (l.length > 1 ? 's' : '') + '</div>' + mcListeHtml(l, true);
}

/* ── 2. La liste des cours d'un cahier ── */
function mcVueListe(id) {
  _mc.vue = 'liste'; _mc.cahier = id; _mc.cours = null;
  var reel = id !== 'tous' && id !== 'sans';
  if (reel && !mccGet(id)) { mcVueCahiers(); return; }
  mcHaut('Cahiers', reel ? '<button class="mc-haut-i" onclick="mcMenuCahier(this)" aria-label="Options du cahier">' + MC_ICO.points + '</button>' : '');
  var l = mcDuCahier(id), k = reel ? mccGet(id) : null;
  document.getElementById('mc-body').innerHTML =
    '<div class="mc-grand">' + (k ? '<span class="mc-pastille mc-pastille-g" style="background:' + k.couleur + '"></span>' : '') + esc(mcNomCahier(id)) + '</div>' +
    mcListeHtml(l, id === 'tous');
  mcBas('<span></span><span class="mc-bas-c">' + l.length + ' cours</span>' +
    '<span class="mc-bas-d"><button class="mc-bas-i" onclick="mcScanner()" aria-label="Scanner un cours">' + MC_ICO.photo + '</button>' +
    '<button class="mc-bas-i" onclick="mcEcrire()" aria-label="Écrire un cours">' + MC_ICO.ecrire + '</button></span>');
  mcSyncHistorique();
}
function mcListeHtml(l, montrerCahier) {
  if (!l.length) return '<div class="vc-empty"><b>Aucun cours ici</b>Touche l\'appareil photo pour scanner une page, ou le crayon pour écrire.</div>';
  return '<div class="mc-groupe">' + l.map(function(c) {
    var apercu = String(c.texte || '').replace(/^.*\n?/, '').replace(/[#*>|`-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
    var k = montrerCahier && c.cahier ? mccGet(c.cahier) : null;
    return '<div class="mc-note-l" onclick="mcVueCours(\'' + c.id + '\')">' +
      '<div class="mc-note-t">' + esc(c.titre || 'Nouveau cours') + '</div>' +
      '<div class="mc-note-s"><b>' + mcDate(c.maj) + '</b> ' + esc(apercu || 'Pas de texte') + '</div>' +
      (k ? '<div class="mc-note-k"><span class="mc-pastille" style="background:' + k.couleur + '"></span>' + esc(k.nom) + '</div>' : '') +
    '</div>';
  }).join('') + '</div>';
}

/* ── 3. Un cours : des PAGES de cahier, modifiables directement (comme Notes) ──
   Un cours = plusieurs pages de taille fixe (MC_LIGNES_PAGE lignes de MC_LIGNE px).
   Quand une page est pleine, la fin passe toute seule sur la page suivante (mcPaginer).
   c.pages = [html de chaque page] ; c.html = pages jointes par <hr> ; c.texte = texte brut */
var MC_LIGNES_PAGE = 26, MC_LIGNE = 28;
var _mcDerniereNote = null;

/* pages d'un cours (anciens cours : un seul html, les <hr> separaient les pages ajoutees) */
function mcPagesDe(c) {
  if (Array.isArray(c.pages) && c.pages.length) return c.pages.slice();
  var html = c.html || (c.texte ? mcMd(c.texte) : '');
  var p = String(html).split(/<hr\s*\/?>/i);
  return p.length ? p : [''];
}
function mcEstVide(html) { return !mcTexteDe(html).trim(); }
/* suites[i] = true : page de SUITE (creee quand la page d'avant deborde), recalculee a chaque
   ouverture ; false : vraie page ajoutee par l'eleve (vierge ou photo), qui commence une feuille */
function mcSuitesDe(c, n) { return Array.from({ length: n }, function(_, i) { return !!(Array.isArray(c.suites) && c.suites[i]); }); }
function mcFixerPages(c, pages, suites) {
  c.suites = suites || mcSuitesDe(c, pages.length);
  c.pages = pages; c.html = pages.join('<hr>'); c.texte = mcTexteDe(c.html);
}
function mcNotes() { return Array.prototype.slice.call(document.querySelectorAll('#mc-pages .mc-note')); }

function mcPageHtml(i, html, n, c, suite) {
  var k = c.cahier ? mccGet(c.cahier) : null;
  return '<div class="mc-papier" data-p="' + i + '" data-suite="' + (suite ? 1 : 0) + '" onclick="mcClicPage(event,this)">' +
    (i === 0
      ? '<div class="mc-meta">' + mcDateLongue(c.maj || Date.now()) + (k ? ' · <span class="mc-pastille" style="background:' + k.couleur + '"></span>' + esc(k.nom) : '') + '</div>' +
        '<div class="mc-titre" id="mc-titre" contenteditable="true" spellcheck="true" data-ph="Titre" onkeydown="mcTitreTouche(event)" onpaste="mcCollerTexte(event)" oninput="mcModif()">' + esc(c.titre || '') + '</div>'
      : '') +
    '<div class="mc-note" contenteditable="true" spellcheck="true" data-ph="' + (i === 0 ? 'Commence à écrire ton cours…' : 'Page vide') + '" oninput="mcModif(this)" onkeydown="mcToucheNote(event,this)" onpaste="mcColler(event)">' + html + '</div>' +
    '<div class="mc-pied">' + (i + 1) + ' / ' + n + '</div>' +
  '</div>';
}

function mcVueCours(id) {
  var c = mcGet(id); if (!c) { mcVueCahiers(); return; }
  mcEnregistrer();
  /* pages vides oubliees (sauf la premiere) : retirees ; anciens cours convertis */
  /* les pages de suite rejoignent leur page : la mise en pages est refaite a l'ouverture
     (du texte efface remonte) ; les pages vides oubliees (sauf la 1re) sont retirees */
  var brutes = mcPagesDe(c).map(mcPropre), suites = mcSuitesDe(c, brutes.length), pages = [];
  brutes.forEach(function(h, i) {
    if (i > 0 && suites[i] && pages.length) pages[pages.length - 1] += h;
    else pages.push(h);
  });
  pages = pages.filter(function(h, i) { return i === 0 || !mcEstVide(h); });
  _mc.vue = 'cours'; _mc.cours = id;
  if (!_mc.cahier) _mc.cahier = c.cahier && mccGet(c.cahier) ? c.cahier : 'tous';
  mcHaut(mcNomCahier(_mc.cahier), '<button class="mc-haut-ok" id="mc-ok" onclick="mcFinEdition()">OK</button>' +
    '<button class="mc-haut-i" onclick="mcMenuCours(this)" aria-label="Plus d\'actions">' + MC_ICO.points + '</button>');
  var body = document.getElementById('mc-body');
  body.innerHTML = '<div id="mc-pages">' + pages.map(function(h, i) { return mcPageHtml(i, h, pages.length, c); }).join('') + '</div>' +
    '<button class="mc-ajout-page" onclick="mcMenuAjoutPage()">' + MC_ICO.plus + '<span>Ajouter une page</span></button>' +
    '<div id="mc-page-etat"></div>';
  mcBas('');
  try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch(e) {}
  body.scrollTop = 0;
  /* mise en pages : ce qui depasse d'une page passe sur la suivante */
  requestAnimationFrame(function() { if (_mc.vue === 'cours' && _mc.cours === id) { mcPaginerTout(); mcEnregistrer(); } });
  if (!c.titre && mcEstVide(c.html)) setTimeout(function() { var t = document.getElementById('mc-titre'); if (t) t.focus(); }, 80);
  mcSyncHistorique();
}

/* Toucher le vide d'une page = ecrire a la fin de cette page */
function mcClicPage(e, papier) {
  if (e.target !== papier && !e.target.classList.contains('mc-pied')) return;
  var n = papier.querySelector('.mc-note'); if (!n) return;
  n.focus(); mcCurseurFin(n);
}
function mcCurseurFin(el) {
  var r = document.createRange(); r.selectNodeContents(el); r.collapse(false);
  var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
}
/* Entree dans le titre -> on passe au texte ; pas de mise en forme dans le titre */
function mcTitreTouche(e) {
  if (e.key === 'Enter') { e.preventDefault(); var n = document.querySelector('#mc-pages .mc-note'); if (n) { n.focus(); mcCurseurDebut(n); } }
}
function mcCurseurDebut(el) {
  var r = document.createRange(); r.selectNodeContents(el); r.collapse(true);
  var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
}
/* Effacer sur une page vide (sauf la 1re) supprime la page et remonte a la fin de la precedente */
function mcToucheNote(e, note) {
  if (e.key !== 'Backspace') return;
  var papier = note.closest('.mc-papier'); if (!papier || papier.getAttribute('data-p') === '0') return;
  if (!mcEstVide(note.innerHTML)) return;
  e.preventDefault();
  var prec = papier.previousElementSibling && papier.previousElementSibling.querySelector('.mc-note');
  papier.remove();
  mcNumeroter();
  if (prec) { prec.focus(); mcCurseurFin(prec); }
  mcModif();
}
function mcCollerTexte(e) {
  e.preventDefault();
  var t = (e.clipboardData || window.clipboardData).getData('text/plain').replace(/\s+/g, ' ');
  document.execCommand('insertText', false, t);
}
/* Coller dans la note : HTML nettoye (pas de styles bizarres venant d'un site) */
function mcColler(e) {
  var cd = e.clipboardData || window.clipboardData; if (!cd) return;
  var h = cd.getData('text/html');
  e.preventDefault();
  if (h) document.execCommand('insertHTML', false, mcPropre(h));
  else document.execCommand('insertText', false, cd.getData('text/plain'));
}

/* ── Mise en pages ── */
function mcLimite(papier) {
  return papier.getBoundingClientRect().top + parseFloat(getComputedStyle(papier).paddingTop) + MC_LIGNES_PAGE * MC_LIGNE;
}
function mcSauverCurseur() { var s = window.getSelection(); return s && s.rangeCount ? { n: s.focusNode, o: s.focusOffset } : null; }
function mcRemettreCurseur(sv) {
  if (!sv || !sv.n || !document.contains(sv.n)) return;
  var el = sv.n.nodeType === 1 ? sv.n : sv.n.parentElement;
  var note = el && el.closest('.mc-note'); if (!note) return;
  if (document.activeElement !== note) note.focus({ preventScroll: true });
  var r = document.createRange();
  try { r.setStart(sv.n, Math.min(sv.o, sv.n.nodeType === 3 ? sv.n.length : sv.n.childNodes.length)); } catch(e) { return; }
  r.collapse(true);
  var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
}
/* du texte tape directement dans la page (hors paragraphe) -> range dans un <p> */
function mcEnBlocs(note) {
  var p = null;
  Array.prototype.slice.call(note.childNodes).forEach(function(n) {
    if (n.nodeType === 1 && /^(H1|H2|H3|P|DIV|UL|OL|TABLE|BLOCKQUOTE|HR)$/.test(n.tagName)) { p = null; return; }
    if (n.nodeType === 3 && !n.data.trim() && !p) return;
    if (!p) { p = document.createElement('p'); note.insertBefore(p, n); }
    p.appendChild(n);
  });
}
/* Une page trop pleine : sa fin passe au debut de la page suivante (creee si besoin).
   Les listes sont coupees entre deux puces. Un seul bloc plus grand qu'une page reste
   sur sa page (qui s'allonge). Renvoie true si quelque chose a bouge. */
function mcPaginer(note) {
  var papier = note.closest('.mc-papier'); if (!papier) return false;
  var limite = mcLimite(papier);
  if (note.getBoundingClientRect().bottom <= limite + 1) return false;
  var sv = mcSauverCurseur();
  if (Array.prototype.some.call(note.childNodes, function(n) { return n.nodeType === 3 && n.data.trim(); })) mcEnBlocs(note);
  var bouge = [];
  while (note.children.length) {
    var der = note.lastElementChild, r = der.getBoundingClientRect();
    if (r.bottom <= limite + 1) break;
    if ((der.tagName === 'UL' || der.tagName === 'OL') && r.top < limite && der.children.length > 1) {
      var nl = document.createElement(der.tagName);
      while (der.children.length > 1 && der.lastElementChild.getBoundingClientRect().bottom > limite + 1) nl.insertBefore(der.lastElementChild, nl.firstChild);
      if (nl.children.length) bouge.unshift(nl);
      break;
    }
    if (note.children.length === 1) break;
    bouge.unshift(der);
    note.removeChild(der);
  }
  if (!bouge.length) return false;
  var suiv = papier.nextElementSibling;
  /* on continue sur la page de suite existante, sinon on en insere une (jamais dans une vraie page) */
  if (!suiv || !suiv.classList.contains('mc-papier') || suiv.getAttribute('data-suite') !== '1') suiv = mcCreerPageDom(papier, true);
  var ns = suiv.querySelector('.mc-note');
  if (mcEstVide(ns.innerHTML)) ns.innerHTML = '';
  var avant = ns.firstChild;
  bouge.forEach(function(b) { ns.insertBefore(b, avant); });
  mcRemettreCurseur(sv);
  mcPaginer(ns);
  mcNumeroter();
  return true;
}
function mcPaginerTout() { var change = false; mcNotes().forEach(function(n) { if (document.contains(n) && mcPaginer(n)) change = true; }); return change; }
function mcCreerPageDom(apres, suite) {
  var tmp = document.createElement('div');
  tmp.innerHTML = mcPageHtml(1, '', 1, mcGet(_mc.cours) || {}, suite);
  var pg = tmp.firstChild;
  apres.parentNode.insertBefore(pg, apres.nextSibling);
  return pg;
}
function mcNumeroter() {
  var pp = document.querySelectorAll('#mc-pages .mc-papier'), n = pp.length;
  Array.prototype.forEach.call(pp, function(p, i) {
    p.setAttribute('data-p', i);
    var s = p.querySelector('.mc-pied'); if (s) s.textContent = (i + 1) + ' / ' + n;
  });
}

/* ── Sauvegarde automatique 0,6 s apres la derniere modification ── */
function mcModif(note) {
  clearTimeout(_mcTimer);
  _mcTimer = setTimeout(mcEnregistrer, 600);
  if (note && note.classList) requestAnimationFrame(function() { if (document.contains(note) && mcPaginer(note)) mcModif(); });
  mcCaretBientot();
}
function mcEnregistrer() {
  clearTimeout(_mcTimer); _mcTimer = null;
  if (_mc.vue !== 'cours' || !_mc.cours) return;
  var t = document.getElementById('mc-titre'), notes = mcNotes();
  var c = mcGet(_mc.cours); if (!c || !t || !notes.length) return;
  var titre = t.textContent.replace(/\s+/g, ' ').trim();
  var pages = notes.map(function(n) { return mcPropre(n.innerHTML); });
  var suites = notes.map(function(n) { return n.closest('.mc-papier').getAttribute('data-suite') === '1'; });
  if (titre === c.titre && Array.isArray(c.pages) && pages.length === c.pages.length && pages.join('<hr>') === c.pages.join('<hr>') &&
      JSON.stringify(suites) === JSON.stringify(mcSuitesDe(c, pages.length))) return;
  c.titre = titre;
  mcFixerPages(c, pages, suites);
  mcPut(c);
  markActivity();   /* ecrire son cours = travailler */
}
function mcFinEdition() {
  mcEnregistrer();
  if (document.activeElement) document.activeElement.blur();
}

/* ── Ajouter des pages : vierge, photo, ou plusieurs photos d'un coup ── */
function mcMenuAjoutPage() {
  mcEnregistrer();
  mcSheet('<div class="mc-sheet-t">Ajouter une page</div><div class="mc-groupe">' +
    '<div class="mc-ligne" onclick="mcFermerSheet();mcPageVierge()"><span class="mc-ajout-ico">📄</span><span class="mc-ligne-t">Page vierge</span></div>' +
    '<div class="mc-ligne" onclick="mcFermerSheet();document.getElementById(\'mc-page-cam\').click()"><span class="mc-ajout-ico">📷</span><span class="mc-ligne-t">Prendre une photo</span></div>' +
    '<div class="mc-ligne" onclick="mcFermerSheet();document.getElementById(\'mc-page-inp\').click()"><span class="mc-ajout-ico">🖼️</span><span class="mc-ligne-t">Photos de la galerie<small>Tu peux en choisir plusieurs : une page par photo</small></span></div>' +
    '</div>');
}
function mcPageVierge() {
  var pp = document.querySelectorAll('#mc-pages .mc-papier'); if (!pp.length) return;
  var pg = mcCreerPageDom(pp[pp.length - 1], false);
  mcNumeroter();
  var n = pg.querySelector('.mc-note');
  n.focus();
  pg.scrollIntoView({ block: 'start', behavior: 'smooth' });
  mcEnregistrer();
}
/* Une ou plusieurs photos -> recopiees, chacune a la suite sur une nouvelle page */
async function mcAjouterPages(files) {
  files = Array.prototype.slice.call(files || []).filter(function(f) { return /^image\//.test(f.type); });
  if (!files.length || !_mc.cours) return;
  mcEnregistrer();
  var id = _mc.cours, ajoutees = 0, erreur = '', premiere = -1;
  for (var i = 0; i < files.length; i++) {
    var etat = document.getElementById('mc-page-etat');
    if (etat) etat.innerHTML = '<div class="rev-loading" style="padding:16px 0"><div class="rev-spin"></div><div class="rev-loading-txt">ScolarIA recopie la photo ' + (i + 1) + ' / ' + files.length + '…</div></div>';
    try {
      var dataUrl = await imageReduiteP(files[i]);
      if (!dataUrl) throw new Error('Image illisible');
      var t = await mcTranscrire(dataUrl);
      var c = mcGet(id); if (!c) return;
      var pages = mcPagesDe(c);
      if (pages.length === 1 && mcEstVide(pages[0])) { pages[0] = mcMd(t.texte); if (premiere < 0) premiere = 0; }
      else { pages.push(mcMd(t.texte)); if (premiere < 0) premiere = pages.length - 1; }
      if (!c.titre) c.titre = t.titre;
      if (!c.mat && t.mat) c.mat = t.mat;
      mcFixerPages(c, pages);
      mcPut(c);
      ajoutees++;
    } catch(e) { erreur = e.message; }
  }
  var e2 = document.getElementById('mc-page-etat'); if (e2) e2.innerHTML = '';
  if (_mc.vue === 'cours' && _mc.cours === id) {
    mcVueCours(id);
    if (premiere >= 0) setTimeout(function() { var pp = document.querySelectorAll('#mc-pages .mc-papier'); if (pp[premiere]) pp[premiere].scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 120);
  }
  toast(ajoutees ? (ajoutees > 1 ? ajoutees + ' pages ajoutées' : 'Page ajoutée') + (erreur ? ' (une photo n\'a pas pu être lue)' : '') : 'Erreur : ' + erreur, 3500);
}

/* ── Barre de mise en forme (au-dessus du clavier pendant l'ecriture) ── */
/* page en cours d'ecriture (ou la derniere touchee) */
function mcNoteActive() {
  var a = document.activeElement;
  if (a && a.classList && a.classList.contains('mc-note')) return a;
  if (_mcDerniereNote && document.contains(_mcDerniereNote)) return _mcDerniereNote;
  return document.querySelector('#mc-pages .mc-note');
}
function mcFmt(cmd) {
  var n = mcNoteActive(); if (!n) return;
  if (document.activeElement !== n) n.focus();
  try {
    if (cmd === 'h1' || cmd === 'h2' || cmd === 'p') document.execCommand('formatBlock', false, cmd);
    else if (cmd === 'ul') document.execCommand('insertUnorderedList');
    else if (cmd === 'ol') document.execCommand('insertOrderedList');
    else if (cmd === 'mark') mcSurligner();
    else document.execCommand(cmd);
  } catch(e) {}
  mcModif(n);
  mcEtatFmt();
}
var MC_SURLIGNEUR = '#fde68a';
function mcSurligner() {
  var s = window.getSelection(); if (!s.rangeCount) return;
  var el = s.anchorNode && (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentNode);
  var mk = el && el.closest ? el.closest('mark, span[style*="background"]') : null;
  if (mk && mk.closest('.mc-note')) {
    /* deja surligne : on enleve le surlignage */
    while (mk.firstChild) mk.parentNode.insertBefore(mk.firstChild, mk);
    mk.remove();
    return;
  }
  if (s.isCollapsed) { toast('Sélectionne le texte à surligner'); return; }
  document.execCommand('styleWithCSS', false, true);
  document.execCommand('hiliteColor', false, MC_SURLIGNEUR);
  document.execCommand('styleWithCSS', false, false);
}
/* boutons B / I / U allumes selon la selection */
function mcEtatFmt() {
  var bar = document.getElementById('mc-fmt'); if (!bar || bar.style.display === 'none') return;
  ['bold', 'italic', 'underline'].forEach(function(c) {
    var b = bar.querySelector('[data-c="' + c + '"]');
    if (b) { var on = false; try { on = document.queryCommandState(c); } catch(e) {} b.classList.toggle('on', on); }
  });
  var bloc = ''; try { bloc = String(document.queryCommandValue('formatBlock') || '').toLowerCase(); } catch(e) {}
  ['h1', 'h2', 'p'].forEach(function(c) {
    var b = bar.querySelector('[data-c="' + c + '"]'); if (b) b.classList.toggle('on', bloc === c);
  });
}
/* ── Clavier ──
   Sur Android, le clavier ne reduit que la zone VISIBLE (visualViewport). On donne au
   panneau exactement cette hauteur : la barre de mise en forme, derniere de la colonne,
   se pose donc pile sur le clavier, et la zone de texte s'arrete juste au-dessus. */
function mcAjusterHauteur() {
  var p = document.getElementById('mc-panel'); if (!p || p.style.display === 'none') return;
  var vv = window.visualViewport; if (!vv) return;
  p.style.height = Math.round(vv.height) + 'px';
  p.style.top = Math.round(vv.offsetTop) + 'px';
}
/* La ligne ou l'on ecrit reste visible, juste au-dessus de la barre et du clavier */
function mcCaretVisible() {
  if (_mc.vue !== 'cours') return;
  var a = document.activeElement; if (!a || !(a.id === 'mc-titre' || (a.classList && a.classList.contains('mc-note')))) return;
  var s = window.getSelection(); if (!s || !s.rangeCount) return;
  var r = s.getRangeAt(0).cloneRange(); r.collapse(false);
  var rect = r.getClientRects()[0] || r.getBoundingClientRect();
  if (!rect || (!rect.top && !rect.bottom)) {   /* ligne vide : on prend la ligne elle-meme */
    var n = s.focusNode, el = n && (n.nodeType === 1 ? n : n.parentElement);
    if (!el) return;
    rect = el.getBoundingClientRect();
  }
  var body = document.getElementById('mc-body'), b = body.getBoundingClientRect();
  if (rect.bottom > b.bottom - 6) body.scrollTop += rect.bottom - b.bottom + 28;   /* + une ligne de marge */
  else if (rect.top < b.top + 6) body.scrollTop -= b.top - rect.top + 28;
}
var _mcRaf = 0;
function mcCaretBientot() { cancelAnimationFrame(_mcRaf); _mcRaf = requestAnimationFrame(mcCaretVisible); }
/* barre visible seulement quand on ecrit dans la note ; bouton OK pendant l'ecriture */
function mcMajFmt() {
  var bar = document.getElementById('mc-fmt'), ok = document.getElementById('mc-ok'); if (!bar) return;
  var a = document.activeElement;
  var estNote = !!(a && a.classList && a.classList.contains('mc-note'));
  if (estNote) _mcDerniereNote = a;
  var ecrit = a && (estNote || a.id === 'mc-titre') && _mc.vue === 'cours';
  bar.style.display = ecrit && estNote ? 'flex' : 'none';
  if (ok) ok.style.display = ecrit ? 'block' : 'none';
  mcAjusterHauteur();
  mcEtatFmt();
  if (ecrit) mcCaretBientot();
}
document.addEventListener('focusin', mcMajFmt);
document.addEventListener('focusout', function() { setTimeout(mcMajFmt, 50); });
document.addEventListener('selectionchange', function() { if (_mc.vue === 'cours') { mcEtatFmt(); mcCaretBientot(); } });
if (window.visualViewport) {
  /* le clavier s'ouvre, se ferme ou fait defiler la zone visible */
  window.visualViewport.addEventListener('resize', mcMajFmt);
  window.visualViewport.addEventListener('scroll', function() { mcAjusterHauteur(); mcCaretBientot(); });
}

/* ── Menus « ⋯ » ── */
function mcPop(btn, items) {
  mcFermerPop();
  var r = btn.getBoundingClientRect();
  var pop = document.getElementById('mc-pop');
  pop.innerHTML = '<div class="mc-pop-fond" onclick="mcFermerPop()"></div><div class="mc-pop-menu" style="top:' + Math.round(r.bottom + 6) + 'px">' +
    items.map(function(it) {
      if (it.sep) return '<div class="mc-pop-sep">' + (it.sep === true ? '' : esc(it.sep)) + '</div>';
      return '<button class="mc-pop-it' + (it.danger ? ' danger' : '') + '" onclick="mcFermerPop();' + it.action + '">' +
        '<span>' + esc(it.label) + '</span>' + (it.ico ? '<span class="mc-pop-ico">' + it.ico + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  pop.style.display = 'block';
}
function mcFermerPop() { var p = document.getElementById('mc-pop'); if (p) { p.style.display = 'none'; p.innerHTML = ''; } }
function mcMenuCours(btn) {
  mcEnregistrer();
  if (document.activeElement) document.activeElement.blur();
  mcPop(btn, [
    { sep: 'Réviser ce cours' },
    { label: 'Fiche de révision', ico: '📄', action: 'mcGenerer(\'fiche\')' },
    { label: 'Flashcards', ico: '🃏', action: 'mcGenerer(\'flashcards\')' },
    { label: 'M\'interroger', ico: '❓', action: 'mcInterroger()' },
    { sep: true },
    { label: 'Ajouter une page', ico: '📄', action: 'mcMenuAjoutPage()' },
    { label: 'Ranger dans un cahier', ico: '📁', action: 'mcRanger()' },
    { sep: true },
    { label: 'Supprimer le cours', ico: '🗑', action: 'mcSupprimer()', danger: true }
  ]);
}
function mcMenuCahier(btn) {
  mcPop(btn, [
    { label: 'Renommer le cahier', ico: '✏️', action: 'mcRenommerCahier()' },
    { label: 'Supprimer le cahier', ico: '🗑', action: 'mcSupprimerCahier()', danger: true }
  ]);
}

/* ── Feuilles du bas (nouveau cahier, renommer, ranger) ── */
function mcSheet(html, cb) {
  var s = document.getElementById('mc-sheet');
  s.innerHTML = '<div class="mc-sheet-fond" onclick="mcFermerSheet()"></div><div class="mc-sheet-box">' + html + '</div>';
  s.style.display = 'block';
  _mcSheetCb = cb || null;
}
function mcFermerSheet() { var s = document.getElementById('mc-sheet'); if (s) { s.style.display = 'none'; s.innerHTML = ''; } _mcSheetCb = null; }
function mcFormCahier(titre, nom, couleur, bouton) {
  return '<div class="mc-sheet-t">' + titre + '</div>' +
    '<input class="vc-inp" id="mc-k-nom" maxlength="30" placeholder="Nom du cahier (ex : Maths)" value="' + esc(nom || '') + '" onkeydown="if(event.key===\'Enter\')mcValiderSheet()">' +
    '<div class="mc-couleurs">' + MC_COULEURS.map(function(co) {
      return '<button class="mc-coul' + (co === couleur ? ' on' : '') + '" style="background:' + co + '" onclick="mcChoixCouleur(this,\'' + co + '\')" aria-label="Couleur"></button>';
    }).join('') + '</div>' +
    '<button class="rev-go-btn" style="margin-top:14px" onclick="mcValiderSheet()">' + bouton + '</button>';
}
var _mcCouleur = MC_COULEURS[0];
function mcChoixCouleur(b, co) {
  _mcCouleur = co;
  Array.prototype.forEach.call(b.parentNode.children, function(x) { x.classList.remove('on'); });
  b.classList.add('on');
}
function mcValiderSheet() {
  var i = document.getElementById('mc-k-nom'); var nom = i ? i.value.trim() : '';
  if (!nom) { if (i) i.focus(); return; }
  var cb = _mcSheetCb; mcFermerSheet();
  if (cb) cb(nom, _mcCouleur);
}
function mcNouveauCahier(apres) {
  _mcCouleur = MC_COULEURS[mccLoad().length % MC_COULEURS.length];
  mcSheet(mcFormCahier('Nouveau cahier', '', _mcCouleur, 'Créer le cahier'), function(nom, couleur) {
    var k = { id: 'k' + Date.now(), nom: nom, couleur: couleur, cree: Date.now() };
    var l = mccLoad(); l.push(k); mccSaveAll(l);
    if (apres) apres(k); else mcVueCahiers();
    toast('Cahier « ' + nom + ' » créé');
  });
  setTimeout(function() { var i = document.getElementById('mc-k-nom'); if (i) i.focus(); }, 80);
}
function mcRenommerCahier() {
  var k = mccGet(_mc.cahier); if (!k) return;
  _mcCouleur = k.couleur;
  mcSheet(mcFormCahier('Modifier le cahier', k.nom, k.couleur, 'Enregistrer'), function(nom, couleur) {
    mccSaveAll(mccLoad().map(function(x) { if (x.id === k.id) { x.nom = nom; x.couleur = couleur; } return x; }));
    mcVueListe(k.id);
  });
}
function mcSupprimerCahier() {
  var k = mccGet(_mc.cahier); if (!k) return;
  var n = mcDuCahier(k.id).length;
  if (!confirm('Supprimer le cahier « ' + k.nom + ' » ?' + (n ? ' Ses ' + n + ' cours ne sont pas supprimés : ils vont dans « Sans cahier ».' : ''))) return;
  mccSaveAll(mccLoad().filter(function(x) { return x.id !== k.id; }));
  mcSaveAll(mcLoad().map(function(c) { if (c.cahier === k.id) c.cahier = ''; return c; }));
  mcVueCahiers();
}
function mcRanger() {
  var c = mcGet(_mc.cours); if (!c) return;
  var h = '<div class="mc-sheet-t">Ranger dans un cahier</div><div class="mc-groupe">' +
    mccLoad().map(function(k) {
      return '<div class="mc-ligne" onclick="mcRangerDans(\'' + k.id + '\')"><span class="mc-pastille" style="background:' + k.couleur + '"></span>' +
        '<span class="mc-ligne-t">' + esc(k.nom) + '</span>' + (c.cahier === k.id ? '<span class="mc-coche">✓</span>' : '') + '</div>';
    }).join('') +
    '<div class="mc-ligne" onclick="mcRangerDans(\'\')"><span class="mc-pastille" style="background:var(--bord)"></span><span class="mc-ligne-t">Sans cahier</span>' + (!c.cahier ? '<span class="mc-coche">✓</span>' : '') + '</div>' +
    '</div><button class="mc-btn2" onclick="mcFermerSheet();mcNouveauCahier(function(k){mcRangerDans(k.id)})">+ Nouveau cahier</button>';
  mcSheet(h);
}
function mcRangerDans(id) {
  var c = mcGet(_mc.cours); mcFermerSheet(); if (!c) return;
  c.cahier = id; mcPut(c, true);
  _mc.cahier = id || 'sans';
  mcVueCours(c.id);
  toast(id ? 'Rangé dans « ' + mcNomCahier(id) + ' »' : 'Retiré du cahier');
}

/* ── Creer, scanner, ajouter une page, supprimer ── */
function mcCahierCourant() { return (_mc.cahier && _mc.cahier !== 'tous' && _mc.cahier !== 'sans' && mccGet(_mc.cahier)) ? _mc.cahier : ''; }
function mcEcrire() { var c = mcNouveau('', '', '', '', mcCahierCourant()); mcVueCours(c.id); }
function mcScanner() { _mcScanCahier = mcCahierCourant() || null; closeMesCours(); openScanCours(); }
function mcSupprimer() {
  var c = mcGet(_mc.cours); if (!c) return;
  if (!confirm('Supprimer « ' + (c.titre || 'ce cours') + ' » ? Cette action est définitive.')) return;
  _mc.vue = 'liste';
  mcSaveAll(mcLoad().filter(function(x) { return x.id !== c.id; }));
  mcVueListe(_mc.cahier || 'tous');
}

/* ── Reviser a partir du cours ── */
function mcGenerer(type) {
  mcEnregistrer();
  var c = mcGet(_mc.cours); if (!c || !c.texte.trim()) { toast('Le cours est vide'); return; }
  closeMesCours();
  goSec('s-revisions', document.querySelector('.nav-btn[onclick*=s-revisions]'));
  setTimeout(function() {
    var inp = document.getElementById('rev-topic'); if (inp) inp.value = c.titre || 'Mon cours';
    if (!revCoursOn) revToggleCours();
    var ta = document.getElementById('rev-cours-txt'); if (ta) ta.value = c.texte;
    revPickType(type);
  }, 150);
}
function mcInterroger() {
  mcEnregistrer();
  var c = mcGet(_mc.cours); if (!c || !c.texte.trim()) { toast('Le cours est vide'); return; }
  if (_cq) { toast('Une interrogation est déjà en cours dans le chat'); return; }
  closeMesCours();
  goSec('s-chat', document.querySelectorAll('.nav-btn')[0]);
  var demande = 'Interroge-moi sur mon cours « ' + (c.titre || 'sans titre') + ' »';
  addMsg(demande, 'user');
  cqStart({ sujet: c.titre || 'mon cours', cours: c.texte }, addMsg('', 'ai thinking'), demande);
}

/* Section « Mes cours » de l'ecran Revisions (3 derniers) */
function mcRenderRev() {
  var box = document.getElementById('rev-mc'); if (!box) return;
  var l = mcLoad().sort(function(a, b) { return b.maj - a.maj; });
  box.innerHTML = l.length
    ? '<div class="mc-groupe">' + l.slice(0, 3).map(function(c) {
        var k = c.cahier ? mccGet(c.cahier) : null;
        return '<div class="mc-note-l" onclick="openMesCours(\'' + c.id + '\')"><div class="mc-note-t">' + esc(c.titre || 'Nouveau cours') + '</div>' +
          '<div class="mc-note-s"><b>' + mcDate(c.maj) + '</b> ' + (k ? '<span class="mc-pastille" style="background:' + k.couleur + '"></span>' + esc(k.nom) : '') + '</div></div>';
      }).join('') + '</div>'
    : '<div class="mc-vide" onclick="openScanCours()">📷 Scanne ton cahier : ScolarIA recopie ton cours pour le garder et le modifier.</div>';
}
async function scanGenerate(type) {
  if(!scanImageData){toast('Charge une image d\'abord');return;}
  var res=document.getElementById('scan-result');
  var acts=document.getElementById('scan-actions'); if(acts) acts.style.display='none';
  res.innerHTML='<div class="rev-loading" style="padding:30px 0"><div class="rev-spin"></div><div class="rev-loading-txt">ScolarIA analyse ton cours...</div></div>';
  var prompt=type==='fiche'
    ?'Voici la photo d\'un cours. Transcris et génère une fiche de révision structurée (titre, notions clés, définitions, exemples). Niveau '+getClasse()+'.'
    :'Voici la photo d\'un cours. Génère 8 flashcards | Question | Réponse | sous forme de tableau markdown ---|--- à partir de ce cours.';
  try{
    var reply=await callGroqVision([{role:'user',content:[
      {type:'image_url',image_url:{url:scanImageData.full}},
      {type:'text',text:prompt}
    ]}],2000,{niveau:'revision'});
    res.innerHTML='<div class="rev-ia-result">'+mdToHtml(reply)+'</div>';
    if(acts)acts.style.display='block';
  }catch(e){
    res.innerHTML='<div class="rev-err-box">'+esc(e.message)+'<br><button onclick="scanGenerate(\''+type+'\')">Réessayer</button></div>';
    if(acts)acts.style.display='block';
  }
}
