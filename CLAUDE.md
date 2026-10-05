# PROMPT CLAUDE CODE — PROJET SCOLARIA

## Contexte du projet

Tu travailles sur **ScolarIA**, une application scolaire pour collégiens français (niveau 3ème) développée par Gabriel. C'est une **Single Page Application HTML** sans framework, sans build system — juste du HTML/CSS/JS pur. Cible : **smartphone Android (Chrome)**, installable en PWA. Toujours parler en français avec Gabriel.

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
- **Groq** : jamais appelé en direct, toujours via `GROQ_PROXY` (`callGroq` / `callGroqStream`).
- **Vercel** : redéploiement automatique à chaque `git push` sur `main`.

⚠️ **Ne JAMAIS écrire une clé Groq dans le code client.** Elle vit uniquement dans le secret Supabase `GROQ_API_KEY`.

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
- Contenu adapté niveau **3ème français** avec rappels, tableaux, pièges brevet
- Les objectifs à jour sont dans `RECAP_SESSION.md`
