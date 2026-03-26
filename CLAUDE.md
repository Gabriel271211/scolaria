# PROMPT CLAUDE CODE — PROJET SCOLARIA

## Contexte du projet

Tu travailles sur **ScolarIA**, une application scolaire pour collégiens français (niveau 3ème) développée par Gabriel (14 ans). C'est une **Single Page Application HTML** sans framework, sans build system — juste du HTML/CSS/JS pur dans des fichiers `.html`.

Le projet est séparé en **deux fichiers indépendants** :
- `scolaria-base.html` — L'app ScolarIA principale (chat IA, devoirs, flashcards, pomodoro, moyennes, bibliothèque). **Ne pas toucher sauf si demandé explicitement.**
- `scolaria-langues.html` — Le mode Langues style Duolingo (EN/ES, parcours zigzag, cours écrits, exercices interactifs, chat IA).

---

## Règles absolues — NE JAMAIS violer

### 1. Avant toute modification
- **Lire le fichier entier** avant de commencer
- **Compter les `<div>` ouverts et fermés** — ils doivent être égaux
- **Vérifier la syntaxe JS** avec Node.js après chaque modif (voir workflow)
- **Ne jamais modifier `scolaria-base.html`** sauf demande explicite

### 2. Le JS doit toujours être valide
- Vérifier avec Node.js après chaque modification :
```js
node -e "const fs=require('fs');const c=fs.readFileSync('scolaria-langues.html','utf8');const s=c.match(/<script>([\s\S]*?)<\/script>/g);let j=s?s.map(x=>x.replace(/<\/?script>/g,'')).join('\n'):'';try{new Function(j);console.log('JS OK')}catch(e){console.error('JS ERROR:',e.message)}"
```
- Pas d'apostrophes (`'`) non échappées dans les strings JS délimitées par `'`
  - ❌ `'onclick="this.classList.toggle('on')"'` — apostrophe non échappée
  - ✅ `'onclick="toggleClass(this)"'` — passer par une fonction
- Pas de template literals (backticks) dans les strings JS inline du HTML
- Quand on génère du HTML dans du JS, utiliser `e()` pour échapper les valeurs

### 3. Structure HTML
- Toujours vérifier que `<div id="app">` est bien fermé avec `</div>` avant `</body>`
- Toujours terminer avec `</body></html>`
- Les scripts `<script>` doivent être fermés avec `</script>` — compter les deux

### 4. Modifications sûres
- Faire les changements **section par section**, pas tout d'un coup
- Pour les insertions dans `LANG_COURSES` :
  - Vérifier la virgule avant et après l'insertion
  - Ne jamais créer de double virgule `,,`
  - Ne jamais insérer une propriété hors de son objet parent
  - Bien fermer chaque `lessons:[...]` avant d'ouvrir la prochaine unité
- Pour les données `COURSE_DATA` : pas d'apostrophes — utiliser `&#39;` ou reformuler

---

## Architecture de scolaria-langues.html

### Structure HTML
```
#app
  #dotgrid (SVG fond à points décoratif, pointer-events:none)
  #hdr (header : bouton retour ‹, logo "ScolarIA Langues", switchers EN/ES, XP)
  #xpw + #xpb (barre XP fine)
  #content (conteneur relatif)
    .sec#s-accueil  (section accueil — hero card, XP card, stats, bouton parcours)
    .sec#s-cours    (liste des cours avec progression)
    .sec#s-parcours (parcours zigzag)
    .sec#s-chat     (chat IA)
    .sec#s-profil   (profil)
  #cm (modal cours écrit, position:fixed)
  #lo (overlay leçon, position:fixed)
  #nav (barre nav 5 boutons — Cours | Parcours | Accueil(centre) | Chat IA | Profil)
  #toast
```

### IDs importants dans #s-accueil
| ID | Contenu |
|----|---------|
| `heroAvatar` | Emoji avatar (🌍) |
| `heroName` | Nom de l'apprenant |
| `heroQuote` | Citation aléatoire |
| `as` | Streak (jours) |
| `statStrk` | Streak dans les stats |
| `alv` | Niveau (Débutant / Intermédiaire...) |
| `axp` | XP total |
| `ab` | Barre de progression XP |
| `an` | XP pour prochain niveau |
| `al` | Nombre de leçons |
| `aw` | Mots appris |
| `bcont` | Bouton "Continuer" (caché si rien à reprendre) |
| `ctxt` | Texte du bouton Continuer |

### Variables globales importantes
```js
CL = 'en'          // langue active ('en' ou 'es')
CU = null          // unité courante
CD = null          // leçon courante (currentLessonData)
LS = 0             // étape courante de la leçon
SC = 0             // score leçon
MS = null          // état match — item sélectionné
MP = []            // paires matchées
MD = []            // données match
OP = []            // ordre placé (word order)
```

### Fonctions principales
| Fonction | Rôle |
|----------|------|
| `goSec(s)` | Naviguer entre sections |
| `switchLang(l)` | Changer EN/ES (met à jour tous les switchers b-/lc-/lp-) |
| `updXP()` | Mettre à jour la barre XP header |
| `rAcc()` | Render accueil (hero, XP card, stats, bouton continuer) |
| `rCours()` | Render liste cours avec barres de progression |
| `rParcours()` | Render parcours zigzag |
| `rProfil()` | Render profil |
| `langContinue()` | Lancer la prochaine leçon non complétée |
| `openCM(uid)` | Ouvrir modal cours (utilise COURSE_DATA ou buildCoursAuto) |
| `closeCM()` | Fermer modal cours |
| `buildCoursAuto(u)` | Générer HTML du cours automatiquement si pas dans COURSE_DATA |
| `startUnit(uid)` | Lancer la première leçon non complétée d'une unité |
| `openLesson(u, lesson)` | Lancer une leçon |
| `closeLesson()` | Fermer l'overlay leçon |
| `rStep()` | Render l'étape courante |
| `nextStep()` | Passer à l'étape suivante |
| `rResult()` | Afficher le résultat |
| `clickNode(el)` | Clic sur nœud du parcours |
| `gP()` / `sP(d)` | Get/Set progression localStorage (clé: `sk_lang`) |
| `markDone(lid, xp)` | Marquer une leçon comme terminée + ajouter XP |
| `isDone(lid)` | Vérifier si une leçon est terminée |
| `getXP()` | Lire le total XP |
| `getLvl(xp)` | Retourner le niveau selon l'XP |
| `wc()` | Compter les mots appris (leçons terminées × 4) |
| `toast(msg)` | Afficher une notification temporaire |
| `e(s)` | Échapper HTML (anti-XSS) |
| `g(id)` | Alias `document.getElementById` |

### Types d'exercices supportés
- `vocab` → cartes à retourner (grille 2 colonnes)
- `grammar` → règle + exemples + exercice de traduction
- `qcm` → questions à choix multiples
- `match` → association paires (grille 2 colonnes)
- `order` → remettre les mots dans l'ordre
- `fill` → compléter les blancs (choix multiples)

### Structure LANG_COURSES
```js
const LANG_COURSES = {
  en: { name:'Anglais', flag:'🇬🇧', color:'#0ea5e9', units: [
    { id:'en_a1_1', level:'A1', title:'...', emoji:'...', xp:50, color:'#...', desc:'...',
      lessons: [
        { id:'en_a1_1_1', title:'...', type:'vocab', pairs:[['mot','traduction'],...] },
        { id:'en_a1_1_2', title:'...', type:'grammar', rule:'...', examples:[...], exercise:{...} },
        { id:'en_a1_1_3', title:'...', type:'match', pairs:[...] },
        { id:'en_a1_1_4', title:'...', type:'qcm', questions:[{q:'...',opts:[...],a:0},...] }
      ]
    },
    ...
  ]},
  es: { ... }
};
```

### Unités actuelles (mars 2026)
**Anglais (EN)**
| ID | Niveau | Titre |
|----|--------|-------|
| en_a1_1 | A1 | Se présenter |
| en_a1_2 | A1 | Nombres & couleurs |
| en_a2_1 | A2 | Present Simple |
| en_a2_2 | A2 | Past Simple |
| en_b1_1 | B1 | Will / Going to |
| en_b1_2 | B1 | Present Perfect |

**Espagnol (ES)**
| ID | Niveau | Titre |
|----|--------|-------|
| es_a1_1 | A1 | Hola — Saludos |
| es_a1_2 | A1 | Números y colores |
| es_a2_1 | A2 | Presente de indicativo |
| es_a2_2 | A2 | Pretérito indefinido |
| es_b1_1 | B1 | Futuro simple |
| es_b1_2 | B1 | Subjuntivo |

### COURSE_DATA
Objet séparé qui stocke le HTML des cours écrits. Toutes les unités listées ci-dessus ont un `COURSE_DATA` défini.
```js
const COURSE_DATA = {};
COURSE_DATA['en_a1_1'] = '<div class="cs">...</div>';
// Règles :
// - PAS d'apostrophes dans ces strings — utiliser les entités HTML ou reformuler
// - Si COURSE_DATA[uid] n'existe pas, buildCoursAuto(u) génère un cours automatique
```

---

## Workflow recommandé pour chaque tâche

1. Lire la section concernée du fichier
2. Faire la modification
3. Vérifier le JS :
```js
node -e "const fs=require('fs');const c=fs.readFileSync('scolaria-langues.html','utf8');const s=c.match(/<script>([\s\S]*?)<\/script>/g);let j=s?s.map(x=>x.replace(/<\/?script>/g,'')).join('\n'):'';try{new Function(j);console.log('JS OK')}catch(e){console.error('JS ERROR:',e.message)}"
```
4. Commiter et pusher → Vercel se redéploie automatiquement
5. Confirmer à Gabriel

## Ce que Gabriel veut pour la suite
- Que l'app fonctionne bien sur **smartphone Android (Chrome)**
- Pas de framework, pas de build — fichiers HTML standalone
- Style proche de Duolingo pour le mode Langues
- Cours adaptés niveau **3ème français** avec rappels, tableaux, pièges brevet
- Éventuellement fusionner `scolaria-base.html` et `scolaria-langues.html` en un seul fichier quand les deux sont stables
