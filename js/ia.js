/* ScolarIA — js/ia.js
   Appels à l'IA (Groq via le proxy Supabase) : prompts, règles par matière, detectMat(),
   relance sur limite (_groqFetch), recherche internet, correcteur commun (corrigerReponse).
   Chargé par scolaria-home-v2.html, dans l'ordre des <script> (une ligne exécutée au chargement
   ne peut utiliser que les fonctions des fichiers chargés AVANT celui-ci). */

/* ══ GROQ API ══ */
var SCOLARIA_SYSTEM = 'Tu es ScolarIA — assistant scolaire IA pour élèves français, du collège au lycée (6ème → Terminale).\n\n' +
'RÈGLE N°1 — NE POSE JAMAIS DE QUESTION non demandée : tu expliques et tu t\'arrêtes.\n' +
'RÈGLE N°2 — Reste STRICTEMENT sur le sujet demandé. Histoire = histoire uniquement. Maths = maths uniquement. Ne mélange jamais les matières.\n' +
'RÈGLE N°3 — Fautes d\'orthographe : ne les signale JAMAIS. Comprends le sens et réponds directement.\n' +
'RÈGLE N°4 — Interdit absolu : "Bien sûr !", "Absolument !", reformuler la question avant de répondre, poser une question non demandée.\n\n' +
'FORMAT FICHE — utilise UNIQUEMENT quand on demande une fiche/révision :\n' +
'RÈGLE ABSOLUE : ZÉRO PARAGRAPHE. Tout en listes à puces (• item), numérotées (1. item) ou tableaux markdown. Une puce = une info max 15 mots. **Gras** sur mots-clés/formules/dates. JAMAIS de phrases rédigées.\n\n' +
'##FICHE##\n' +
'TITRE:[sujet exact demandé]\n' +
'MATIERE:[histoire|maths|français|physique|chimie|svt|anglais|espagnol|géo|philo|ses|autre]\n' +
'SECTION:[nom de section adapté au contenu réel]\n' +
'• [puce concise]\n' +
'• [puce concise]\n' +
'SECTION:[autre nom adapté]\n' +
'• [puce]\n' +
'RETENIR:\n' +
'• [point clé à mémoriser]\n' +
'• [point clé]\n' +
'##FINFICHE##\n\n' +
'FORMAT FLASH — utilise UNIQUEMENT quand on demande des flashcards :\n' +
'| Question | Réponse |\n| --- | --- |\nToutes les questions portent UNIQUEMENT sur le sujet demandé.\n\n' +
'En conversation normale : texte fluide, markdown simple. Format chat = pas de ##FICHE##.';

/* ══ RÈGLES SPÉCIFIQUES PAR MATIÈRE ══ */
var _matRules = {
  "Maths":
    "--- MATIERE : MATHEMATIQUES ---\n" +
    "SECTIONS OBLIGATOIRES (utilise EXACTEMENT ces noms dans SECTION:) : Formule | Variables | Exemple resolu | Pieges\n" +
    "• SECTION:Formule — la formule seule sur sa ligne, en gras (**formule**), rien d'autre\n" +
    "• SECTION:Variables — definir chaque lettre/symbole (ex : a = longueur en m)\n" +
    "• SECTION:Exemple resolu — vraies valeurs numeriques, chaque etape numerotee, resultat en gras + unite\n" +
    "• SECTION:Pieges — erreurs classiques (signe negatif oublie, unite non convertie, division par zero)\n" +
    "Regle absolue : unite obligatoire sur chaque grandeur. Jamais de variable sans definition.",

  "Physique-Chimie":
    "--- MATIERE : PHYSIQUE-CHIMIE ---\n" +
    "SECTIONS OBLIGATOIRES : Formule | Variables | Loi | Exemple resolu | Pieges\n" +
    "• SECTION:Formule — symboles avec unites (ex : U [V] = R [Ohm] x I [A]), en gras\n" +
    "• SECTION:Variables — symbole → nom → unite SI\n" +
    "• SECTION:Loi — ce que dit la loi, domaine d'application\n" +
    "• SECTION:Exemple resolu — application numerique pas a pas, resultat + unite\n" +
    "• SECTION:Pieges — erreurs d'unites, mauvais isolement, confusion de signes\n" +
    "Regle : chaque etape de calcul sur sa propre puce numerotee.",

  "Histoire-Geo":
    "--- MATIERE : HISTOIRE-GEOGRAPHIE ---\n" +
    "SECTIONS OBLIGATOIRES : Reperes chronologiques | Contexte | Acteurs cles | Causes et Consequences | Chiffres cles | Vocabulaire | Pieges brevet\n" +
    "• SECTION:Reperes chronologiques — date → evenement en 6 mots max, ordre chronologique\n" +
    "• SECTION:Acteurs cles — nom → role → dates importantes (1 ligne par personne)\n" +
    "• SECTION:Causes et Consequences — 2 blocs distincts, chacun en puces\n" +
    "• SECTION:Chiffres cles — victimes, superficies, populations — en gras\n" +
    "• SECTION:Vocabulaire — terme → definition courte (1 ligne)\n" +
    "• SECTION:Pieges brevet — dates confondues, noms mal orthographies, anachronismes",

  "Francais":
    "--- MATIERE : FRANCAIS ---\n" +
    "SECTIONS OBLIGATOIRES : Regle | Exemples | Contre-exemples | Exceptions | Pieges\n" +
    "• SECTION:Regle — enoncee en 1-2 puces claires\n" +
    "• SECTION:Exemples — 3-5 exemples avec le point-cle en gras\n" +
    "• SECTION:Contre-exemples — ce qui est FAUX et pourquoi\n" +
    "• SECTION:Exceptions — listees une par une\n" +
    "• SECTION:Pieges — confusions frequentes (a/a, ou/ou, ces/ses...), erreurs au brevet\n" +
    "Si conjugaison : ajouter SECTION:Conjugaison avec tableau je/tu/il/nous/vous/ils en colonnes.",

  "SVT":
    "--- MATIERE : SVT ---\n" +
    "SECTIONS OBLIGATOIRES : Vocabulaire | Structures et roles | Processus | Chiffres cles | Liens cause-effet | Exemples\n" +
    "• SECTION:Vocabulaire — terme → definition exacte (1 ligne)\n" +
    "• SECTION:Structures et roles — organe/cellule → role precis\n" +
    "• SECTION:Processus — fleches textuelles A → B → C → D\n" +
    "• SECTION:Chiffres cles — valeurs avec unites en gras\n" +
    "• SECTION:Liens cause-effet — que se passe-t-il si X est absent ou en exces\n" +
    "• SECTION:Exemples — maladie, espece, experience reelle",

  "Anglais":
    "--- MATIERE : ANGLAIS ---\n" +
    "SECTIONS OBLIGATOIRES : Structure | Usage | Conjugaison | Exemples | Irreguliers | Pieges\n" +
    "• SECTION:Structure — 1 ligne en gras (ex : S + HAVE + V-ed + complement)\n" +
    "• SECTION:Usage — quand utiliser cette forme, marqueurs temporels (since, for, yesterday...)\n" +
    "• SECTION:Conjugaison — tableau : affirmatif | negatif | interrogatif (avec traduction)\n" +
    "• SECTION:Exemples — 5-6 phrases avec traduction, varier affirmatif/negatif/interrogatif\n" +
    "• SECTION:Irreguliers — base → past simple → past participle\n" +
    "• SECTION:Pieges — faux amis, prononciation piegeuse",

  "Espagnol":
    "--- MATIERE : ESPAGNOL ---\n" +
    "SECTIONS OBLIGATOIRES : Structure | Conjugaison | Usage | Exemples | Irreguliers | Pieges\n" +
    "• SECTION:Structure — 1 ligne en gras\n" +
    "• SECTION:Conjugaison — tableau yo/tu/el/nosotros/vosotros/ellos (avec traduction)\n" +
    "• SECTION:Usage — quand utiliser cette forme, marqueurs temporels\n" +
    "• SECTION:Exemples — 5-6 phrases avec traduction francaise\n" +
    "• SECTION:Irreguliers — verbes irreguliers importants du groupe\n" +
    "• SECTION:Pieges — faux amis espagnol-francais, accents, accords",

  "Philosophie":
    "--- MATIERE : PHILOSOPHIE ---\n" +
    "SECTIONS OBLIGATOIRES : Question centrale | Definitions | Distinctions | Arguments | Auteurs | Citations\n" +
    "• SECTION:Question centrale — formulee en 1 phrase precise\n" +
    "• SECTION:Definitions — terme → definition rigoureuse\n" +
    "• SECTION:Distinctions — X vs Y : en quoi deux notions proches different\n" +
    "• SECTION:Arguments — 1 puce = 1 argument + justification, numerotes\n" +
    "• SECTION:Auteurs — nom → idee principale → oeuvre cle\n" +
    "• SECTION:Citations — entre guillemets, 1 ligne max, auteur mentionne",

  "SES":
    "--- MATIERE : SES ---\n" +
    "SECTIONS OBLIGATOIRES : Definitions | Mecanisme | Acteurs | Donnees chiffrees | Exemple concret | Theories et Auteurs | Nuances\n" +
    "• SECTION:Definitions — concept → definition rigoureuse (1 ligne)\n" +
    "• SECTION:Mecanisme — processus en fleches A → B → C\n" +
    "• SECTION:Acteurs — agent/institution → role precis\n" +
    "• SECTION:Donnees chiffrees — stats, taux, indices en gras (source + annee)\n" +
    "• SECTION:Exemple concret — situation reelle recente\n" +
    "• SECTION:Theories et Auteurs — nom → these → courant de pensee\n" +
    "• SECTION:Nuances — ce qui contredit ou nuance le mecanisme",

  "NSI":
    "--- MATIERE : NSI ---\n" +
    "SECTIONS OBLIGATOIRES : Syntaxe | Parametres | Exemple minimal | Exemple complet | Erreurs frequentes\n" +
    "• SECTION:Syntaxe — code indenté correctement (Python, HTML, SQL selon la lecon)\n" +
    "• SECTION:Parametres — nom → type attendu → role (1 puce par parametre)\n" +
    "• SECTION:Exemple minimal — code le plus court qui illustre le concept\n" +
    "• SECTION:Exemple complet — cas d'usage reel avec entree/sortie\n" +
    "• SECTION:Erreurs frequentes — TypeError, IndexError, boucle infinie, = vs =="
};

/* Detecter la matière depuis le texte du sujet */
function detectMat(text) {
  var t = (text || '').toLowerCase();
  /* expressions de physique qui contiennent des mots de maths : a tester en premier */
  if (/équation de réaction|equation de reaction|puissance électrique|puissance electrique|énergie|energie|tension électrique|loi d.ohm/.test(t)) return 'Physique-Chimie';
  if (/math|algèbre|algeb|géomét|geomet|calcul|équation|equation|fonction|triangle|probabilit|statist|théorème|theoreme|pythagore|thales|vecteur|fraction|puissance|racine|pgcd|ppcm/.test(t)) return 'Maths';
  if (/ensembles? de nombres|nombres? (relatif|décima|decima|rationnel|irrationnel|réel|reel|premier|entier|complexe)|dérivé|derive|dérivation|derivation|suites? (numérique|arithm|géom|geom)|intégrale|integrale|primitive|logarithme|exponentielle|trigonom|cosinus|sinus|tangente|pourcentage|proportionnalit|inéquation|inequation|identités? remarquable|développer|developper|factoris|valeur absolue|intervalle|périmètre|perimetre|second degré|discriminant|polynôme|polynome|produit scalaire|parabole|médiane|mediane|parallélogramme|parallelogramme|\baires?\b/.test(t)) return 'Maths';
  if (/physique|chimie|électri|electri|optique|\bforces?\b|réaction chimique|reaction chimique|transformation chimique|newton|résistance électrique|resistance electrique|\bohms?\b|vitesse|accélér|acceler|atome|molécule|molecule|\bions?\b|\bph\b|\bacides?\b|basique|\bmoles?\b|masse volumique|mélange|melange|dissolution|solubilit|changements? d.état|combustion|circuit|gravitation|\bpoids\b|signal|propagation|vitesse de la lumière|année.lumière|lentille|spectre|\bondes?\b|radioactiv|cinétique|cinetique|électrolyse|thermodynamique|kepler/.test(t)) return 'Physique-Chimie';
  if (/conjugaison|grammaire|orthographe|accord|participe|imparfait|subjonctif|conditionnel|impératif|infinitif|verbe|français\b|figures? de style|roman|poème|narrateur|ponctuation|registre|tirade|sonnet|théâtre|theatre|comédie|comedie|tragédie|tragedie|poésie|poesie|poète|poete|récit|recit|\bcontes?\b|fable|mythe|argumentati|dissertation|commentaire|explication linéaire|subordonnée|subordonnee|complément d|\bcod\b|\bcoi\b|déterminant|determinant|adjectif|pronom|adverbe|dictée|dictee|réécriture|reecriture|métaphore|metaphore|personnage|œuvre intégrale|héroïne|heroine/.test(t)) return 'Francais';
  if (/histoire|guerre|révolution|empire|siècle|roi|reine|président|traité|moyen.âge|moyen.age|antiquité|colonisation|débarquement|nazisme|shoah|fascisme|communisme|résistance|occupation|lumières|renaissance|réforme|féodal|chrétienté|\bislam|république|totalitar|décolonisation|union européenne|esclavage|napoléon|monarchie|absolutisme|démocratie|citoyenneté|\bemc\b|laïcité|préhistoire|néolithique/.test(t)) return 'Histoire-Geo';
  if (/géograph|geograph|continent|pays|capitale|relief|climat|population|mondialisation|territoire|aménagement|migration|espace|zone/.test(t)) return 'Histoire-Geo';
  if (/svt|biologie|écosystème|ecosysteme|cellule|organisme|génétique|genetique|évolution|evolution|respiration|digestion|nutriment|biodiversité|photosynthèse|photosynthese|gène|gene|adn|chromosome|immunit|vaccin|séisme|seisme|volcan|tectonique|plaques lithosph|puberté|reproduction|nerveu|neurone|microbe|bactérie|bacterie|virus|anticorps|méiose|meiose|mitose|fossile/.test(t)) return 'SVT';
  if (/anglais|english|present perfect|past simple|tense|irregular|vocabulary|grammar|be going to|would|modal|should/.test(t)) return 'Anglais';
  if (/espagnol|español|presente|pretérito|preterito|futuro|subjuntivo|ser|estar|haber/.test(t)) return 'Espagnol';
  if (/philo|philosophie|liberté|liberte|conscience|vérité|verite|bonheur|justice|existence|morale|éthique|ethique/.test(t)) return 'Philosophie';
  if (/\bses\b|sciences.éco|économie|economie|marché|entreprise|emploi|inflation|mondialisation|inégalit|chomage/.test(t)) return 'SES';
  if (/nsi|python|algorithme|informatique|programme|code|boucle|récursion|recursion|complexité/.test(t)) return 'NSI';
  return '';
}

/* Construire le system prompt enrichi pour les fiches */
function buildFicheSys(mat) {
  var base = SCOLARIA_SYSTEM;
  if (mat && _matRules[mat]) {
    return base + '\n\n' + _matRules[mat].replace(/brevet/g, examLabel());
  }
  /* Fallback : instructions génériques multi-matière */
  return base + '\n\n--- SECTIONS PAR MATIERE (detection auto) ---\n' +
    '• Maths : Formule | Variables | Exemple resolu | Pieges\n' +
    '• Histoire-Geo : Reperes chronologiques | Contexte | Acteurs | Causes et Consequences | Vocabulaire\n' +
    '• Francais : Regle | Exemples | Contre-exemples | Exceptions | Pieges\n' +
    '• SVT : Vocabulaire | Structures et roles | Processus | Chiffres | Exemples\n' +
    '• Anglais/Espagnol : Structure | Conjugaison | Exemples | Pieges';
}

/* L'app n'appelle plus Groq en direct : tout passe par une Edge Function
   Supabase (groq-proxy) qui garde la clé GROQ_API_KEY cote serveur.
   La cle Groq n'est donc jamais exposee dans le code public. */
var GROQ_PROXY = 'https://vefnkztjmodchvmspukh.supabase.co/functions/v1/groq-proxy';
var SUPA_ANON = 'sb_publishable_OVVDWsvA2-0dJuTdQREYVw_kSiTu7Ge';

/* Modeles Groq — Groq supprime regulierement d'anciens modeles (erreur
   "model_not_found") : il suffit alors de changer les noms ICI.
   Liste a jour : https://console.groq.com/docs/models */
var AI_TEXT_MODEL = 'openai/gpt-oss-120b';
var AI_VISION_MODELS = ['qwen/qwen3.8-27b'];

/* Exposant en exposants Unicode : 10^{23} -> 10²³, x^{-3} -> x⁻³, x^{n+1} -> x^(n+1) */
var _SUP = { '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻','−':'⁻','+':'⁺','n':'ⁿ' };
function _supExp(m, inBraces, bare) {
  var e = (inBraces !== undefined ? inBraces : bare).trim();
  if (e && e.split('').every(function(ch) { return _SUP[ch]; })) return e.split('').map(function(ch) { return _SUP[ch]; }).join('');
  return '^(' + e + ')';
}

/* gpt-oss ecrit parfois les formules en LaTeX : on les rend lisibles */
function _cleanMath(t) {
  if (!t) return t;
  return t
    .replace(/\\[()\[\]]/g, '')
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^{}]*)\}/g, '√($1)')
    .replace(/\^\{([^{}]*)\}|\^(-?\d+)/g, _supExp)
    .replace(/\\times/g, '×').replace(/\\cdot/g, '·').replace(/\\div/g, '÷')
    .replace(/\\leq?(?![a-z])/g, '≤').replace(/\\geq?(?![a-z])/g, '≥').replace(/\\neq(?![a-z])/g, '≠')
    .replace(/\\approx/g, '≈').replace(/\\pi(?![a-z])/g, 'π')
    .replace(/\\left|\\right/g, '')
    .replace(/\\lim_\{([^{}]*)\}/g, 'lim($1) ').replace(/\\lim(?![a-z])/g, 'lim')
    .replace(/\\(Longrightarrow|Rightarrow|implies)/g, '⇒').replace(/\\(Leftrightarrow|iff)/g, '⇔')
    .replace(/\\Delta(?![a-z])/g, 'Δ').replace(/\\to(?![a-z])/g, '→').replace(/\\infty/g, '∞')
    .replace(/\\(alpha|beta|theta|lambda|mu)(?![a-z])/g, function(m, g) { return { alpha:'α', beta:'β', theta:'θ', lambda:'λ', mu:'µ' }[g]; })
    .replace(/\\[,;!]/g, ' ')
    .replace(/\\text\{([^{}]*)\}/g, '$1');
}

/* opts.noNiveau : pas de bloc niveau (formats stricts)
   opts.niveau : 'court' (correcteurs) | 'revision' (fiches, flashcards, quiz...) | absent = chat */
function _applyNiveau(messages, opts) {
  if (opts && opts.noNiveau) return messages;
  return _withNiveau(messages, opts && opts.niveau);
}
var AI_EMPTY_MSG = 'L\'IA n\'a pas répondu, réessaie.';

/* ══ ENVOI A GROQ AVEC RELANCE ══
   Compte gratuit Groq : 8 000 jetons/minute et 200 000/jour pour TOUTE l'app.
   Si Groq repond 429 "try again in 0.8s" (limite par minute), on attend et on relance
   (2 fois max, attente <= 15 s). Sinon : message clair en francais (err.rateLimit = true). */
function _groqWaitMs(msg) {
  var m = /try again in (?:(\d+)h)?(?:(\d+)m(?!s))?([\d.]+)(ms|s)/i.exec(msg || '');
  if (!m) return null;
  return (m[1] ? +m[1] * 3600000 : 0) + (m[2] ? +m[2] * 60000 : 0) + (m[4] === 'ms' ? +m[3] : +m[3] * 1000);
}
/* Jeton de session de l'eleve : le proxy peut ainsi refuser les appels qui ne viennent
   pas d'un eleve connecte (sinon n'importe qui peut vider le quota Groq de l'app) */
async function _groqJeton() {
  try {
    if (typeof _supa !== 'undefined' && _supa) {
      var s = await _supa.auth.getSession();
      if (s && s.data && s.data.session) return s.data.session.access_token;
    }
  } catch(e) {}
  return SUPA_ANON;
}
var GROQ_TIMEOUT_MS = 90000;
var AI_TROP_LONG_MSG = 'Ta demande est trop longue pour ScolarIA : raccourcis ton texte (ou commence un nouveau chat) et réessaie.';
async function _groqFetch(payload) {
  var jeton = await _groqJeton();
  for (var essai = 0; ; essai++) {
    /* pas de reponse au bout de 90 s : on abandonne au lieu d'attendre a l'infini */
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var tm = ctrl ? setTimeout(function() { ctrl.abort(); }, GROQ_TIMEOUT_MS) : null;
    var res;
    try {
      res = await fetch(GROQ_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jeton },
        body: JSON.stringify(payload),
        signal: ctrl ? ctrl.signal : undefined
      });
    } catch(e) {
      clearTimeout(tm);
      if (e && e.name === 'AbortError') throw new Error('ScolarIA met trop de temps à répondre. Réessaie.');
      throw new Error(navigator.onLine === false ? 'Pas de connexion internet : l\'IA a besoin du réseau.' : 'Impossible de joindre ScolarIA. Vérifie ta connexion et réessaie.');
    }
    clearTimeout(tm);
    if (res.status === 401) throw new Error('Ta session a expiré : déconnecte-toi puis reconnecte-toi.');
    if (res.status === 413) throw new Error(AI_TROP_LONG_MSG);
    if (res.status !== 429) return res;
    var info = null; try { info = await res.clone().json(); } catch(e) {}
    var msg = (info && info.error && info.error.message) || '';
    /* demande plus grosse que la limite par minute : attendre ne sert a rien */
    if (/request too large|reduce your message size/i.test(msg)) throw new Error(AI_TROP_LONG_MSG);
    var wait = _groqWaitMs(msg);
    if (essai < 2 && wait !== null && wait <= 15000) {
      await new Promise(function(r) { setTimeout(r, wait + 400); });
      continue;
    }
    var err = new Error(/per day|\(TPD\)|\(RPD\)/i.test(msg)
      ? 'ScolarIA a atteint sa limite gratuite pour aujourd\'hui. Réessaie plus tard.'
      : 'ScolarIA est très demandée en ce moment. Réessaie dans une minute.');
    err.rateLimit = true;
    throw err;
  }
}

async function callGroq(messages, maxTok, opts) {
  messages = _applyNiveau(messages, opts);
  /* Contenu de revision : plus de reflexion = definitions plus justes (~2 s de plus).
     max_tokens inclut la reflexion de gpt-oss, d'ou la marge ajoutee. */
  var effort = (opts && opts.effort) || ((opts && opts.niveau === 'revision') ? 'medium' : 'low');
  var res = await _groqFetch({ model: AI_TEXT_MODEL, reasoning_effort: effort, max_tokens: (maxTok || 1800) + (effort === 'medium' ? 1500 : 600), messages: messages });
  var data = await res.json();
  if (data.error) throw new Error(data.error.message);
  /* gpt-oss peut tout depenser en reflexion et renvoyer un texte vide : on le signale */
  var txt = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
  if (!txt.trim()) throw new Error(AI_EMPTY_MSG);
  return _cleanMath(txt);
}

/* Photos : essaie chaque modele vision a la suite, meme sortie que callGroq */
async function callGroqVision(messages, maxTok, opts) {
  messages = _applyNiveau(messages, opts);
  var lastErr = 'Modèle vision indisponible';
  for (var mi = 0; mi < AI_VISION_MODELS.length; mi++) {
    try {
      var res = await _groqFetch({ model: AI_VISION_MODELS[mi], max_tokens: maxTok || 1800, messages: messages });
      var data = await res.json();
      if (data.error) { lastErr = data.error.message; continue; }
      var txt = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
      if (!txt.trim()) { lastErr = AI_EMPTY_MSG; continue; }
      return _cleanMath(txt);
    } catch(e) {
      if (e.rateLimit) throw e;   /* limite Groq : inutile d'essayer un autre modele */
      lastErr = e.message;
    }
  }
  throw new Error(lastErr);
}

/* ══ RECHERCHE INTERNET (bouton 🌐 du chat) ══
   Outil browser_search de gpt-oss sur Groq. Une recherche coute ~10 000 a 60 000 jetons
   (les pages lues sont envoyees au modele) alors que le quota gratuit Groq est de
   200 000 jetons/jour pour TOUTE l'app : d'ou la limite par appareil et par jour. */
var WEB_MAX_PAR_JOUR = 5;
var WEB_RULE = 'RECHERCHE INTERNET : tu DOIS chercher sur le web avant de répondre. Privilégie les sources fiables : ' +
  'eduscol.education.gouv.fr et education.gouv.fr (programmes officiels), lumni.fr, sites institutionnels, encyclopédies, manuels et sites de cours reconnus. ' +
  'Ignore les forums et les sites douteux. N\'ouvre pas de gros PDF si une page web suffit. Si les sources se contredisent ou si tu ne trouves rien de fiable, dis-le. ' +
  'Réponds en français, clairement, puis termine sans liste de liens (les sources sont affichées à part).';
function webUsedToday() {
  try { var q = JSON.parse(localStorage.getItem('sk_web') || '{}'); return q.d === vcYmd(new Date()) ? (q.n || 0) : 0; } catch(e) { return 0; }
}
function webCount() {
  try { localStorage.setItem('sk_web', JSON.stringify({ d: vcYmd(new Date()), n: webUsedToday() + 1 })); } catch(e) {}
}
/* Pages vraiment lues (ou, a defaut, premiers resultats) -> [{title, url}] */
function _webSources(tools) {
  var lues = [], trouvees = [];
  (tools || []).forEach(function(t) {
    var res = (t.search_results && t.search_results.results) || [];
    if (t.type === 'browser_search') res.forEach(function(r) { if (r.url) trouvees.push({ title: r.title || r.url, url: r.url }); });
    else if (/open/.test(t.type || '') && !/do not have access/i.test(t.output || '') && res[0] && res[0].url) {
      var titre = String(t.output || '').split('\n').filter(function(l) { return /^L\d+: \S/.test(l) && !/URL:|https?:/.test(l); })[0];
      lues.push({ title: titre ? titre.replace(/^L\d+: /, '').replace(/^#\s*/, '') : res[0].url, url: res[0].url });
    }
  });
  var out = [], vu = {};
  (lues.length ? lues : trouvees.slice(0, 3)).forEach(function(s) {
    if (/^https?:\/\//.test(s.url) && !vu[s.url]) { vu[s.url] = 1; out.push(s); }
  });
  return out.slice(0, 4);
}
async function callGroqWeb(messages, maxTok) {
  messages = _applyNiveau(messages);
  messages[0] = { role: 'system', content: messages[0].content + '\n\n' + WEB_RULE };
  var res = await _groqFetch({ model: AI_TEXT_MODEL, reasoning_effort: 'low', max_tokens: maxTok || 2500,
    tools: [{ type: 'browser_search' }], messages: messages });
  var data = await res.json();
  if (data.error) {
    var m = data.error.message || '', code = data.error.code || '';
    if (code === 'context_length_exceeded' || /reduce the length/i.test(m)) throw new Error('La page trouvée était trop longue. Reformule ta question de façon plus précise.');
    throw new Error(m);
  }
  var msg = (data.choices && data.choices[0] && data.choices[0].message) || {};
  /* retire les marqueurs de citation internes du modele : 【1†L7-L9】 */
  var txt = String(msg.content || '').replace(/【[^】]*】/g, '').replace(/[ \t]+\n/g, '\n').trim();
  if (!txt) throw new Error(AI_EMPTY_MSG);
  return { text: _cleanMath(txt), sources: _webSources(msg.executed_tools) };
}

/* opts.tools : outils (function calling) que l'IA peut appeler d'elle-meme.
   Avec opts.tools, renvoie { text, toolCalls: [{ name, args }] } au lieu d'un texte. */
async function callGroqStream(messages, onToken, maxTok, opts) {
  messages = _applyNiveau(messages, opts);
  var payload0 = { model: AI_TEXT_MODEL, reasoning_effort: 'low', max_tokens: (maxTok || 1800) + 600, messages: messages, stream: true };
  if (opts && opts.tools) { payload0.tools = opts.tools; payload0.tool_choice = opts.toolChoice || 'auto'; }
  var res = await _groqFetch(payload0);
  if (!res.ok || !res.body) {
    var ed = null; try { ed = await res.json(); } catch(e) {}
    throw new Error(ed && ed.error ? ed.error.message : 'Erreur API Groq (' + res.status + ')');
  }
  var reader = res.body.getReader();
  var decoder = new TextDecoder();
  var full = '', buf = '', calls = [];
  /* affichage au plus toutes les 80 ms (et pas a chaque jeton : tout le texte est
     reconverti en HTML a chaque affichage, trop lourd pour un telephone) */
  var _aff = null;
  function _afficher() { _aff = null; onToken(_cleanMath(full)); }
  while (true) {
    var chunk;
    try { chunk = await reader.read(); }
    catch(e) { clearTimeout(_aff); throw new Error('La connexion a été coupée pendant la réponse. Réessaie.'); }
    if (chunk.done) break;
    buf += decoder.decode(chunk.value, { stream: true });
    var lines = buf.split('\n');
    buf = lines.pop();
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i].trim();
      if (ln.indexOf('data:') !== 0) continue;
      var payload = ln.slice(5).trim();
      if (payload === '[DONE]') continue;
      try {
        var j = JSON.parse(payload);
        var d = (j.choices && j.choices[0] && j.choices[0].delta) || {};
        if (d.content) { full += d.content; if (!_aff) _aff = setTimeout(_afficher, 80); }
        /* appels d'outil : le nom puis les arguments peuvent arriver en plusieurs morceaux */
        (d.tool_calls || []).forEach(function(tc) {
          var k = tc.index || 0;
          calls[k] = calls[k] || { name: '', args: '' };
          if (tc.function && tc.function.name) calls[k].name += tc.function.name;
          if (tc.function && tc.function.arguments) calls[k].args += tc.function.arguments;
        });
      } catch(e) {}
    }
  }
  if (_aff) { clearTimeout(_aff); _afficher(); }   /* dernier morceau toujours affiche */
  var toolCalls = calls.filter(Boolean).map(function(c) {
    var a = {}; try { a = JSON.parse(c.args || '{}'); } catch(e) {}
    return { name: c.name, args: a };
  });
  if (!full.trim() && !toolCalls.length) throw new Error(AI_EMPTY_MSG);
  if (opts && opts.tools) return { text: _cleanMath(full), toolCalls: toolCalls };
  return _cleanMath(full);
}

/* Verdict d'une correction IA : tolere le gras (**CORRECT**) et une phrase avant */
function _verdictOk(r) {
  var t = String(r || '').replace(/[*_`#>]/g, '').toUpperCase();
  var m = t.match(/\b(INCORRECT|PAS CORRECT|NON CORRECT|CORRECT)\b/);
  return !!m && m[1] === 'CORRECT';
}
function _verdictText(r) { return String(r || '').replace(/\*\*/g, '').trim(); }
/* Defini AVANT CORRECTEUR_SYS qui l'utilise (sinon le prompt finit par « undefined ») */
var GRADER_RULE = ' Ta réponse commence OBLIGATOIREMENT par le mot CORRECT ou INCORRECT (sans gras, sans phrase avant).';

/* ══ CORRECTEUR COMMUN (interro du chat, Interro IA, Quiz vocal) ══
   La reponse prevue n'est qu'UN EXEMPLE : beaucoup de questions acceptent plusieurs
   bonnes reponses (« cite une cause », « donne un exemple », « un philosophe des Lumieres »).
   L'IA juge donc le FOND de la reponse avec ses connaissances, pas la ressemblance. */
var CORRECTEUR_SYS = 'Tu es un professeur bienveillant qui corrige la réponse d\'un élève.\n' +
  'RÈGLES :\n' +
  '- La « réponse prévue » n\'est qu\'UN EXEMPLE de bonne réponse, pas la seule. Si la question admet plusieurs bonnes réponses (une cause parmi d\'autres, un exemple, un personnage, une date équivalente, un synonyme, une autre méthode, une autre formulation…), TOUTE réponse juste est CORRECTE, même si elle est différente de l\'exemple.\n' +
  '- Juge le FOND avec tes connaissances du cours : la réponse de l\'élève répond-elle correctement à la question posée ?\n' +
  '- Ignore l\'orthographe, les accents, les majuscules, les fautes de frappe et la façon de formuler.\n' +
  '- Si la question demande plusieurs éléments (« deux causes »), il faut ce nombre d\'éléments justes.\n' +
  '- Une réponse fausse, hors sujet, trop vague ou « je ne sais pas » est INCORRECTE.\n' +
  'Ensuite, 1 à 2 phrases simples : si c\'est correct, confirme pourquoi c\'est juste ; si c\'est faux, explique l\'erreur et donne une bonne réponse.' +
  GRADER_RULE;
/* choix : liste des propositions d'un QCM (facultatif) -> { ok, expl } */
async function corrigerReponse(question, prevue, reponse, choix) {
  var r = await callGroq([
    { role: 'system', content: CORRECTEUR_SYS },
    { role: 'user', content: 'Question : ' + question +
      (choix && choix.length ? '\nChoix : ' + choix.map(function(o, k) { return 'ABCD'.charAt(k) + ') ' + o; }).join(' ; ') : '') +
      '\nExemple de réponse prévue : ' + prevue + '\nRéponse de l\'élève : ' + reponse }
  ], 400, { niveau: 'court', effort: 'medium' });
  return { ok: _verdictOk(r), expl: _verdictText(r).replace(/^(IN)?CORRECT\s*[.:!,—–-]*\s*/i, '') };
}
