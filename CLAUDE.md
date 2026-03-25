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
- **Vérifier la syntaxe JS** avec `node --check fichier.js` avant de sauvegarder
- **Ne jamais modifier `scolaria-base.html`** sauf demande explicite

### 2. Le JS doit toujours être valide
- Vérifier avec Node.js après chaque modification : `node --check`
- Pas d'apostrophes (`'`) non échappées dans les strings JS délimitées par `'`
  - ❌ `'onclick="this.classList.toggle('on')"'` — apostrophe non échappée
  - ✅ `'onclick="toggleClass(this)"'` — passer par une fonction
- Pas de template literals (backticks) dans les strings JS inline du HTML
- Quand on génère du HTML dans du JS, utiliser `e()` pour échapper les valeurs

### 3. Structure HTML
- Toujours vérifier que `<div id="app">` est bien fermé avec `</div>` avant `</body>`
- Toujours terminer avec `</body></html>`
- Les scripts `<script>` doivent être fermés avec `</script>` — compter les deux

### 4. Modificatons sûres
- Faire les changements **section par section**, pas tout d'un coup
- Pour les insertions dans des objets JS (comme `LANG_COURSES`) :
  - Vérifier la virgule avant et après l'insertion
  - Ne jamais créer de double virgule `,,`
  - Ne jamais insérer une propriété hors de son objet parent
- Pour les données `courseHTML` : ne pas mettre d'apostrophes — utiliser `&#39;` ou reformuler

---

## Architecture de scolaria-langues.html

### Structure HTML
```
#app
  #hdr (header : bouton retour ‹, logo, switchers EN/ES, XP)
  #xpw + #xpb (barre XP fine)
  #content (conteneur relatif)
    .sec#s-accueil  (section accueil, active par défaut)
    .sec#s-cours    (liste des cours)
    .sec#s-parcours (parcours zigzag)
    .sec#s-chat     (chat IA)
    .sec#s-profil   (profil)
  #cm (modal cours écrit, position:fixed)
  #lo (overlay leçon, position:fixed)
  #nav (barre nav 5 boutons)
  #toast
```

### Variables globales importantes
```js
CL = 'en'          // langue active ('en' ou 'es')
CU = null          // unité courante
CD = null          // leçon courante (currentLessonData)
LS = 0             // étape courante de la leçon
SC = 0             // score leçon
MS, MP, MD         // état du mode match
OP = []            // ordre placé (word order)
```

### Fonctions principales
| Fonction | Rôle |
|----------|------|
| `goSec(s)` | Naviguer entre sections |
| `switchLang(l)` | Changer EN/ES |
| `updXP()` | Mettre à jour la barre XP |
| `rAcc()` | Render accueil |
| `rCours()` | Render liste cours |
| `rParcours()` | Render parcours zigzag |
| `rProfil()` | Render profil |
| `openCM(uid)` | Ouvrir modal cours |
| `openLesson(u, lesson)` | Lancer une leçon |
| `rStep()` | Render l'étape courante |
| `nextStep()` | Passer à l'étape suivante |
| `rResult()` | Afficher le résultat |
| `gP()` / `sP(d)` | Get/Set progression localStorage |

### Types d'exercices supportés
- `vocab` → cartes à retourner
- `grammar` → règle + exemples + traduction
- `qcm` → questions à choix multiples
- `match` → association paires
- `order` → remettre dans l'ordre
- `fill` → compléter les blancs

### Structure LANG_COURSES
```js
const LANG_COURSES = {
  en: { name:'Anglais', flag:'🇬🇧', color:'#0ea5e9', units: [
    { id:'en_a1_1', level:'A1', title:'...', emoji:'...', xp:50, color:'#...', desc:'...',
      lessons: [
        { id:'en_a1_1_1', title:'...', type:'vocab', pairs:[['mot','traduction'],...] },
        { id:'en_a1_1_2', title:'...', type:'qcm', questions:[{q:'...',opts:[...],a:0},...] },
        ...
      ]
    },
    ...
  ]},
  es: { ... }
};
```

### COURSE_DATA
Objet séparé qui stocke le HTML des cours écrits :
```js
const COURSE_DATA = {};
COURSE_DATA['en_a1_1'] = '<div class="cs">...</div>';
// Règle : PAS d'apostrophes dans ces strings — utiliser les entités HTML ou reformuler
```

---

## Bug connu à corriger en premier

Dans `scolaria-langues.html`, il manque une **virgule** entre l'objet `en:{}` et `es:{}` dans `LANG_COURSES` :

```js
// ❌ Actuellement (bug)
  ]}
}
  es:{name:'Espagnol'...

// ✅ Correct
  ]}
},
  es:{name:'Espagnol'...
```

Chercher `}\n\n  es:{name:` et remplacer par `},\n\n  es:{name:`.

---

## Workflow recommandé pour chaque tâche

1. `node --check scolaria-langues.html` → vérifier l'état initial
2. Faire la modification
3. `node --check scolaria-langues.html` → vérifier après
4. Ouvrir dans le navigateur et tester manuellement
5. Si OK → confirmer à Gabriel

## Ce que Gabriel veut pour la suite
- Que l'app fonctionne bien sur **smartphone Android (Chrome)**
- Pas de framework, pas de build — fichiers HTML standalone
- Style proche de Duolingo pour le mode Langues
- Cours adaptés niveau **3ème français** avec rappels, tableaux, pièges brevet
- Éventuellement fusionner `scolaria-base.html` et `scolaria-langues.html` en un seul fichier quand les deux sont stables
