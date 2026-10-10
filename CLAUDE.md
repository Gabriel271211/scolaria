# PROMPT CLAUDE CODE — PROJET SCOLARIA

## Contexte du projet

Tu travailles sur **ScolarIA**, une application scolaire pour élèves français **du collège au lycée (6ème → Terminale)** développée par Gabriel. L'élève choisit sa classe et l'IA s'adapte (programme, façon de parler). Une version primaire est envisagée plus tard. C'est une **Single Page Application HTML** sans framework, sans build system — juste du HTML/CSS/JS pur. Cible : **smartphone Android (Chrome)**, installable en PWA. Toujours parler en français avec Gabriel.

**ScolarIA = une seule app** : `scolaria-home-v2.html`. L'ancienne idée de « modes » séparés (Langues, Sciences, Histoire…) est abandonnée ; ces fichiers sont dans `archive/` (non déployé, ne pas modifier, ne pas les remettre dans l'app sauf demande explicite).

### Fichiers
| Fichier | Rôle |
|---------|------|
| `scolaria-home-v2.html` | **L'app** (~5900 lignes) : chat IA, devoirs, révisions, flashcards, interro, quiz vocal, scanner, veille de contrôle, conjugueur, pomodoro, moyennes, historique/favoris, annales brevet, profil, onboarding, auth. Servi par défaut (`index.html` / `vercel.json`). |
| `annales-data.js` | Banque d'exos type brevet (`window.ANNALES`, Maths + PC, 280 exos). Strings en "double quotes", SVG en backticks. |
| `reset-password.html` | Réinitialisation mot de passe (code OTP Supabase). |
| `manifest.json` + `sw.js` | PWA. **Bumper `CACHE` dans `sw.js`** quand on ajoute un fichier au précache. |
| `supabase/functions/groq-proxy/index.ts` | Edge Function qui relaie les appels IA vers Groq (clé côté serveur). |
| `archive/` | Ancien projet (Langues, Sciences, anciens plans). Exclu du déploiement via `.vercelignore`. |
| `DOCUMENTATION.md` | Doc complète (architecture, connexions, fonctionnalités, données). |
| `CONTEXTE-PROMPT.md` | Prompt de contexte à copier-coller dans une autre IA. |
| `RECAP_SESSION.md` | **Objectifs / feuille de route** + checklist de session. |

### Connexions externes
- **Supabase** (`vefnkztjmodchvmspukh`) : auth email/mdp, sync cloud (table `user_data`), Edge Function `groq-proxy`. ⚠️ Projet gratuit : **mis en pause après ~7 jours d'inactivité** → connexion ET IA cassées. Si l'adresse `*.supabase.co` ne répond plus : dashboard Supabase → Restore project.
- **Groq** : jamais appelé en direct, toujours via `GROQ_PROXY` (`callGroq` / `callGroqStream`). Modèles dans `AI_TEXT_MODEL` / `AI_VISION_MODELS`. Si l'IA renvoie `model_not_found`, Groq a retiré le modèle : changer le nom là (ce n'est pas un problème de clé).
- **Vercel** : redéploiement automatique à chaque `git push` sur `main`.

⚠️ **Ne JAMAIS écrire une clé Groq dans le code client.** Elle vit uniquement dans le secret Supabase `GROQ_API_KEY`.

---

## Niveau scolaire (6ème → Terminale)
- L'élève choisit sa classe (onboarding + profil, `userProfile.classe`). `getClasse()` la renvoie (défaut : 3ème).
- `NIVEAUX` (dans `scolaria-home-v2.html`) : pour chaque classe → cycle, examen, **façon de parler**, **programme officiel**.
- `niveauPrompt()` construit le bloc envoyé à l'IA ; `_withNiveau(messages)` l'ajoute au prompt système.
- **`callGroq` / `callGroqStream` / `callGroqVision` l'ajoutent automatiquement à CHAQUE appel.** Options (3e argument, 4e pour `callGroqStream`) : `{ noNiveau: true }` pour les formats stricts (conjugueur JSON, scan d'agenda, génération d'exo d'annales) ; `{ niveau: 'court' }` pour les petits appels (correcteurs CORRECT/INCORRECT) : une ligne au lieu de ~400 jetons ; **`{ niveau: 'revision' }` pour TOUT contenu généré** (fiches, flashcards, quiz, interros, résumés, planning, scanner de cours) : contenu strictement de la classe, aucune notation d'une classe supérieure, jamais « vu en seconde » ; réflexion `medium` (définitions plus justes, ~2 s). Sans option = mode chat (une notion d'une autre année est expliquée et signalée).
- **`PROG_MATIERES`** (maths, physique-chimie, SVT, histoire-géo, français, philosophie) : programme officiel **en vigueur en 2026-2027** pour chaque classe (`prog` + `pas` = pas encore au programme + `note`), sources en commentaire. `detectMat()` choisit la matière d'après le dernier message de l'élève ; seul le programme de CETTE matière est envoyé (sinon résumé général `NIVEAUX[c].prog` + `NIVEAU_REPERES`). En physique-chimie et SVT au collège, le programme est sur le cycle 4 (ordre libre selon le prof) : ne jamais dire qu'une notion du cycle 4 n'est pas au programme. Si l'IA utilise une notion d'une classe supérieure, l'ajouter explicitement dans `pas` (ex. H₃O⁺ et pH = −log au collège). **À mettre à jour à la rentrée 2027 (maths/français 4ème, maths Terminale) et 2028 (3ème)**.
- `detectMat()` : attention aux mots ambigus (« Résistance » 1940 vs résistance électrique, « Lumières », « française ») ; utiliser des expressions précises et des limites de mot `\b` (à écrire avec l'outil Edit : sed et node -e les transforment en caractère invisible). Tester avec des sujets réels après chaque modif.
- **Limites Groq gratuites : 8 000 jetons/minute et 200 000/jour pour toute l'app.** Tous les appels passent par `_groqFetch()` : sur un 429 « try again in Xs » (≤ 15 s) il attend et relance (2 fois max), sinon message clair en français (`err.rateLimit`). Garder les prompts courts.
- **Outils de l'IA du chat (function calling)** : `CHAT_TOOLS` est passé à `callGroqStream(..., { tools, toolChoice })`, qui renvoie alors `{ text, toolCalls }`. Outil actuel : `lancer_interrogation(sujet, nb_questions, format)` → interro interactive dans le chat (fonctions `cq*`, CSS `.cq-`, état `_cq`). L'IA décide seule (`tool_choice: auto`) ; une demande explicite (`CQ_DEMANDE` : « interroge-moi », « quiz », « QCM », « teste-moi »…) impose l'outil. Pendant une interro, `sendChat` envoie le texte à `cqRepondreTexte` (« stop » arrête). Pour ajouter un outil : l'ajouter à `CHAT_TOOLS` + gérer son nom après l'appel dans `sendChat`.
- **Recherche internet** : bouton 🌐 du chat → `callGroqWeb()` (outil `browser_search` de gpt-oss, sources affichées). Une recherche coûte 10 000 à 60 000 jetons alors que le quota gratuit Groq est de **200 000 jetons/jour pour toute l'app** : limite `WEB_MAX_PAR_JOUR` (5) par appareil (`sk_web`, non synchronisé). Ne JAMAIS l'activer automatiquement sur toutes les requêtes.
- `NIVEAU_REPERES` dit dans quelle classe chaque notion **et sa notation** apparaissent (ex. ℕ ℤ ℚ ℝ en 2nde, ℂ en Terminale) : le compléter si l'IA attribue une notion à la mauvaise classe.
- **Photos : toujours `callGroqVision(messages, maxTok, opts)`** (essaie chaque modèle de `AI_VISION_MODELS`), jamais un `fetch` direct.
- Les trois fonctions **lèvent une erreur si l'IA renvoie un texte vide** (`AI_EMPTY_MSG`) : chaque appel doit être dans un `try/catch` ou avoir un `.catch`.
- Correcteurs : lire le verdict avec `_verdictOk(r)` (tolère le gras et une phrase avant), afficher avec `_verdictText(r)`, ajouter `GRADER_RULE` au prompt.
- Règle IA : un sujet d'une autre année est **toujours expliqué** (signalé en 1re phrase, puis adapté au niveau de l'élève).
- Ne JAMAIS réécrire « 3ème » ou « brevet » en dur dans un prompt : utiliser `getClasse()` et `examLabel()` (brevet/bac).

---

## Règles absolues — NE JAMAIS violer

### 1. Avant toute modification
- **Lire la section concernée** avant de commencer (le fichier fait ~6000 lignes : lire ce qui est pertinent, pas tout d'un coup)
- **Compter les `<div` ouverts et fermés** avant/après : l'écart doit rester le même (il y a quelques `<div` dans des strings JS, donc l'écart actuel n'est pas 0)
- **Vérifier la syntaxe JS** avec Node.js après chaque modif (voir workflow)

### 2. Le JS doit toujours être valide
```js
node -e "const fs=require('fs');const c=fs.readFileSync('scolaria-home-v2.html','utf8');const s=c.match(/<script>([\s\S]*?)<\/script>/g);let j=s?s.map(x=>x.replace(/<\/?script>/g,'')).join('\n'):'';try{new Function(j);console.log('JS OK')}catch(e){console.error('JS ERROR:',e.message)}"
```
Pour `annales-data.js` : `node --check annales-data.js`
- Pas d'apostrophes (`'`) non échappées dans les strings JS délimitées par `'`
  - ❌ `'onclick="this.classList.toggle('on')"'`
  - ✅ `'onclick="toggleClass(this)"'` — passer par une fonction
- Pas de template literals (backticks) dans les attributs HTML inline
- Quand on génère du HTML dans du JS, échapper les valeurs (`esc()` / `_esc()`) contre le XSS

### 3. Structure HTML
- Les `<script>` doivent être fermés avec `</script>` — compter les deux
- Toujours terminer avec `</body></html>`

### 4. Modifications sûres
- Faire les changements **section par section**, pas tout d'un coup
- Préfixer les nouvelles fonctionnalités (ex. Annales : fonctions `ann*`, CSS `.ann-`, section `#s-annales`)
- Données localStorage : préfixe `sk_`. Si elles doivent suivre l'utilisateur sur ses appareils, les ajouter à `SYNC_KEYS`

---

## Workflow recommandé pour chaque tâche

1. Lire la section concernée du fichier
2. Faire la modification
3. Vérifier le JS (commande ci-dessus) + l'équilibre des `<div`
4. Tester dans le preview (largeur mobile 390px, console sans erreur rouge)
5. Commiter et pusher → Vercel se redéploie automatiquement
6. Mettre à jour `RECAP_SESSION.md` (objectifs) et `DOCUMENTATION.md` si une fonctionnalité change
7. Confirmer à Gabriel

## Ce que Gabriel veut
- Que l'app fonctionne bien sur **smartphone Android (Chrome)**
- Pas de framework, pas de build — fichiers HTML standalone
- Contenu adapté **à la classe de l'élève** (programme officiel, façon de parler, pièges brevet/bac), et l'IA doit toujours pouvoir expliquer un sujet d'une autre année
- Les objectifs à jour sont dans `RECAP_SESSION.md`
