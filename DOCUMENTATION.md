# 📘 Documentation ScolarIA

Vue d'ensemble complète de l'application : architecture, connexions externes, fonctionnalités et données. Document de référence pour comprendre tout ce qu'il y a dans ScolarIA.

---

## 1. C'est quoi ScolarIA ?

Application scolaire pour élèves français du **collège au lycée (6ème → Terminale)**, développée par Gabriel. L'élève choisit sa classe et toute l'IA s'adapte à son programme et à sa façon de parler.
**Single Page Application en HTML/CSS/JS pur** — pas de framework, pas de build system.
Chaque écran est un fichier `.html` autonome (standalone).

Cible principale : **smartphone Android sous Chrome** (installable comme app PWA).

---

## 2. Les fichiers du projet

| Fichier | Rôle |
|---------|------|
| `index.html` | Redirige immédiatement vers `scolaria-home-v2.html` (point d'entrée). |
| `scolaria-home-v2.html` | **App principale** (~5900 lignes) : chat IA, devoirs, flashcards, pomodoro, moyennes, révisions, bibliothèque, annales brevet, profil. |
| `annales-data.js` | Banque d'exercices type Brevet (Maths + Physique-Chimie, 280 exos), chargée par `scolaria-home-v2.html`. |
| `archive/` | **Ancien projet conservé mais retiré de l'app** (non déployé, voir `archive/README.md`) : modes Langues et Sciences + anciens docs de plan. |
| `.vercelignore` | Exclut `archive/` du déploiement Vercel. |
| `reset-password.html` | Page de réinitialisation de mot de passe (liée depuis l'écran de connexion). |
| `manifest.json` | Manifeste PWA (nom, icônes, couleurs, écran de démarrage). |
| `icons/` | Icônes PNG de l'app installée (192, 512, maskable, apple-touch). |
| `sw.js` | Service Worker (cache hors-ligne, stratégie network-first). |
| `vercel.json` | Config Vercel : rewrite `/` → `scolaria-home-v2.html`, headers CORS pour `/api/*`, no-cache sur les `.html`. |
| `supabase/functions/groq-proxy/index.ts` | **Edge Function** Deno qui relaie les appels IA vers Groq en gardant la clé secrète côté serveur. |
| `CLAUDE.md` | Instructions de travail pour l'assistant IA. |
| `DOCUMENTATION.md` | Ce document. |
| `CONTEXTE-PROMPT.md` | Prompt de contexte réutilisable pour de futures sessions IA. |
| `RECAP_SESSION.md` | Objectifs / feuille de route + checklist de session. |

---

## 3. Les connexions externes

### 3.1 Supabase (backend)

- **Projet** : `https://vefnkztjmodchvmspukh.supabase.co`
- **Clé publique (publishable)** : `sb_publishable_OVVDWsvA2-0dJuTdQREYVw_kSiTu7Ge`
  - Publique par nature, OK dans le code client.
- **Librairie chargée** : `@supabase/supabase-js@2` via CDN jsDelivr.

**Trois usages de Supabase :**

1. **Authentification** (email + mot de passe)
   - `signUp` (inscription), `signInWithPassword` (connexion), `onAuthStateChange` (suit l'état de session).
   - À la connexion, les données du cloud sont récupérées (`syncFromCloud`).

2. **Synchronisation des données** (table `user_data`)
   - Ligne par utilisateur : `{ user_id, data }`.
   - `syncToCloud` → `upsert` (sauvegarde, anti-spam de 3 s via `scheduleSync`).
   - `syncFromCloud` → `select` (récupération à la connexion).
   - Seules les clés listées dans `SYNC_KEYS` + les clés `sk_day_*` sont synchronisées.

3. **Edge Function `groq-proxy`** (proxy IA)
   - URL : `https://vefnkztjmodchvmspukh.supabase.co/functions/v1/groq-proxy`
   - Runtime Deno. Déployée avec **"Verify JWT" = OFF**.
   - Garde le secret `GROQ_API_KEY` côté serveur.
   - Reçoit la requête du client, ajoute l'en-tête `Authorization: Bearer <GROQ_API_KEY>`, et relaie vers l'API Groq. Renvoie tel quel le flux (SSE streaming ou JSON) + en-têtes CORS.

### 3.2 Groq (intelligence artificielle)

- **JAMAIS appelée directement par le client.** Tout passe par le proxy Supabase.
- API compatible OpenAI (`/openai/v1/chat/completions`).
- **Modèles utilisés** (définis à UN seul endroit : `AI_TEXT_MODEL` et `AI_VISION_MODELS` dans `scolaria-home-v2.html`) :
  - Texte : `openai/gpt-oss-120b` (avec `reasoning_effort: 'low'` pour rester rapide). Ses formules LaTeX sont converties en texte lisible par `_cleanMath()`.
  - Vision (photos de cours/devoirs) : `qwen/qwen3.8-27b`
  - ⚠️ Groq supprime régulièrement des modèles → erreur `model_not_found` = l'IA ne répond plus. Il suffit de changer les noms dans `AI_TEXT_MODEL` / `AI_VISION_MODELS` (liste : https://console.groq.com/docs/models). Les anciens Llama 3.3 / Llama 4 ont disparu en 2026.
- Supporte le **streaming SSE** (réponse token par token dans le chat) et le JSON classique.

> ⚠️ **Sécurité critique** : la clé Groq vit UNIQUEMENT dans le secret Supabase `GROQ_API_KEY`. Elle ne doit JAMAIS être écrite en dur dans le code client ni commitée — sinon elle est volée et révoquée automatiquement. C'est exactement le bug qui cassait l'IA des autres comptes auparavant.

> ⚠️ **Projet gratuit = mise en pause automatique** après ~7 jours sans activité. Symptôme : connexion ET IA cassées, l'adresse `vefnkztjmodchvmspukh.supabase.co` ne répond plus. Solution : dashboard Supabase → **Restore project** (possible seulement pendant 90 jours de pause). Arrivé en octobre 2026 après 3 mois d'inactivité.

### 3.3 Vercel (hébergement)

- Déploiement automatique : un `git push` sur la branche `main` du repo GitHub (`Gabriel271211/scolaria`) redéploie le site.

---

## 4. Comment les appels IA fonctionnent (dans le code)

Dans `scolaria-home-v2.html` :

```js
var GROQ_PROXY = 'https://vefnkztjmodchvmspukh.supabase.co/functions/v1/groq-proxy';
var SUPA_ANON  = 'sb_publishable_OVVDWsvA2-0dJuTdQREYVw_kSiTu7Ge';

async function callGroq(messages, maxTok) { ... }        // réponse complète (JSON)
async function callGroqStream(messages, onChunk) { ... } // streaming token par token (SSE)
async function callGroqVision(messages, maxTok, opts) { ... } // photos : essaie chaque modèle vision
```

- Toutes les fonctions IA appellent `GROQ_PROXY` avec l'en-tête `Authorization: Bearer <SUPA_ANON>`.
- Les appels vision (photos) passent tous par `callGroqVision` (scan d'agenda, photo dans le chat, scanner de cours).
- Tous les appels passent par `_groqFetch()` : relance automatique si Groq répond 429 avec une attente courte (limite gratuite de 8 000 jetons/minute), sinon message en français.
- Le bloc niveau contient le **programme officiel 2026-2027 de la matière détectée** (`PROG_MATIERES` : maths, physique-chimie, SVT, histoire-géo, français, philosophie).
- Les trois fonctions ajoutent le bloc niveau (sauf `{noNiveau:true}` ; `{niveau:'court'}` = une ligne), nettoient les formules (`_cleanMath` : LaTeX → texte, exposants en ², ³, ⁻³…) et **lèvent une erreur si la réponse est vide**.
- À la déconnexion, `logout()` efface aussi le cache `scolaria-data` et la vérification en arrière-plan : plus de rappels de contrôles pour l'ancien compte.

---

## 5. Les fonctionnalités

| Fonctionnalité | Description |
|----------------|-------------|
| **Chat IA** | Discussion avec ScolarIA (streaming). Détecte les demandes de fiche/flashcards/quiz et propose le résultat en carte. Support des **photos** (vision IA). **Interrogation dans le chat** : l'IA dispose d'un outil `lancer_interrogation` qu'elle utilise d'elle-même quand l'élève veut être interrogé (« interroge-moi sur… », « vérifie si je connais ma leçon »…) : questions une par une (QCM à boutons A-D ou réponse écrite), correction IA indulgente sur l'orthographe, bilan avec les points à revoir, « Nouvelles questions », « Explique-moi mes erreurs » ; score ajouté à la progression (`sk_quiz_stats`) et à l'historique. Bouton **🌐 Recherche internet** (`callGroqWeb`, outil `browser_search`) : la prochaine question est cherchée sur le web, sources affichées sous la réponse ; 5 recherches/jour/appareil (`sk_web`) car une recherche consomme ~40× plus de quota Groq. |
| **Devoirs** | Liste des devoirs avec dates. Ajout manuel ou par **scan de photo** (analyse d'agenda/cahier via vision IA). Swipe pour gérer. Les **contrôles à venir** de la Veille de contrôle y apparaissent aussi (lus en direct depuis `sk_ctrl`, pas de doublon) : badge « Contrôle », sujets, progression des révisions ; un appui ouvre le planning. Ils comptent dans le nombre de devoirs de l'accueil. |
| **Révisions** | Génération IA de fiches, flashcards, résumés et interrogations à partir d'un sujet ou d'un cours collé. |
| **Flashcards** | Decks de cartes (question/réponse), session de révision, stats de réussite. |
| **Interrogation IA** | Questions générées par l'IA + correction automatique des réponses de l'élève. |
| **Quiz vocal (VQ)** | Quiz avec réponse libre, correction IA. |
| **Scanner de cours** | Photo d'un cours → fiche de révision ou flashcards générées par vision IA. |
| **Veille de contrôle** | Liste « Mes contrôles » (`sk_ctrl`, synchronisé). Chaque contrôle : matière, **date précise** (+ heure facultative), **plusieurs sujets**. L'IA génère un planning jour par jour calé sur les vraies dates (cases à cocher + progression). **Rappels** : la veille à 17h, le matin du contrôle (7h) et les jours de révision (17h), envoyés par `sw.js` (`checkCtrl`) via le cache `scolaria-data`. |
| **Conjugaison** | FR (tables locales + IA pour irréguliers), EN et ES (local + enrichissement IA). |
| **Pomodoro** | Minuteur de travail/pause avec alerte sonore (WebAudio) et vibration (haptique) en fin de cycle. |
| **Moyennes** | Calcul de moyenne pondérée par coefficients. |
| **Bibliothèque / Historique** | Historique des contenus générés (`sk_hist`), favoris. |
| **Profil** | Avatar (emoji), nom, niveau, stats, thème clair/sombre. |
| **Annales Brevet** | Banque de 280 exercices type DNB (Maths + Physique-Chimie, `annales-data.js`), correction étape par étape, « piège brevet », coach IA, génération IA quand un thème est épuisé. |

---

## 5 bis. Niveau scolaire (6ème → Terminale)
- L'élève choisit sa classe (onboarding + profil, `userProfile.classe`). `getClasse()` la renvoie (défaut : 3ème).
- `NIVEAUX` (dans `scolaria-home-v2.html`) : pour chaque classe → cycle, examen, **façon de parler**, **programme officiel**.
- `niveauPrompt()` construit le bloc envoyé à l'IA ; `_withNiveau(messages)` l'ajoute au prompt système.
- **`callGroq` / `callGroqStream` l'ajoutent automatiquement à CHAQUE appel.** Passer `{ noNiveau: true }` en 3e argument (`callGroq`) ou 4e (`callGroqStream`) pour les formats stricts (conjugueur JSON, génération d'exo d'annales). Les appels vision directs utilisent `_withNiveau` à la main.
- Règle IA : un sujet d'une autre année est **toujours expliqué** (signalé en 1re phrase, puis adapté au niveau de l'élève).
- Ne JAMAIS réécrire « 3ème » ou « brevet » en dur dans un prompt : utiliser `getClasse()` et `examLabel()` (brevet/bac).

- Interface : accueil « Classe · Brevet/Bac de français/Bac + année » (`updateNiveauUI()`), badge « Niveau 3ème » sur les Annales pour les autres classes (`annLevelNote()`), objectif « Réussir le bac » pour les lycéens à l'onboarding.

---

## 6. Les données locales (localStorage)

Préfixe commun : `sk_`.

| Clé | Contenu | Synchronisée ? |
|-----|---------|:--------------:|
| `sk_prof` | Profil (nom, classe, avatar emoji, `photo` = photo de profil en JPEG 256px base64…) | ✅ |
| `sk_dv` | Devoirs | ✅ |
| `sk_decks` | Decks de flashcards | ✅ |
| `sk_hist` | Historique des générations IA | ✅ |
| `sk_chat` | Historique du chat (20 derniers) | ✅ |
| `sk_fiche_count` | Nombre de fiches créées | ✅ |
| `sk_flash_stats` | Stats flashcards `{ok,total}` | ✅ |
| `sk_quiz_stats` | Stats quiz `{ok,total}` | ✅ |
| `sk_streak` | Série de jours `{count,date}` | ✅ |
| `sk_ctrl` | Contrôles de la Veille de contrôle (date, sujets, planning, cases cochées, rappels) | ✅ |
| `sk_day_*` | Activité journalière | ✅ (préfixe) |
| `sk_theme` | Thème clair/sombre | ❌ (local au device) |
| `sk_web` | Compteur de recherches internet du jour `{d, n}` | ❌ (local au device) |

> La clé `sk_groq` (ancienne clé Groq stockée côté client) **n'existe plus** — supprimée lors de la migration vers le proxy.

---

## 7. PWA (installation et hors-ligne)

- **`manifest.json`** : nom « ScolarIA », `id` + `start_url` = `/scolaria-home-v2.html`, affichage `standalone`, portrait, thème `#4F46E5`. Icônes **PNG** dans `icons/` (192, 512, 512 maskable — Android refuse les icônes SVG/data:), `icons/apple-touch-icon.png` pour iPhone.
- **Bouton « Installer l'app »** dans le tiroir (`#dm-install`, fonction `installApp()`) : caché par défaut, apparaît quand Chrome déclenche `beforeinstallprompt` (ouvre la vraie fenêtre d'installation) ou sur iPhone (affiche les instructions Partager → Sur l'écran d'accueil). Disparaît une fois l'app installée.
- **`sw.js`** : cache `scolaria-v7` + cache `scolaria-data` (jamais effacé : contrôles à rappeler + rappels déjà envoyés). Gère aussi les **notifications des contrôles** : message `ctrl-check` envoyé par la page (ouverture + toutes les 10 min), `periodicsync` en arrière-plan (Chrome Android, app installée, au mieux), clic sur la notif → ouvre le contrôle (`?ctrl=<id>`). Stratégie **network-first** (réseau d'abord, cache en secours). Les hôtes d'API (`groq.com`, `supabase.co`, `anthropic.com`, `generativelanguage`) sont exclus du cache pour ne jamais servir une réponse IA périmée.

---

## 8. Règles techniques importantes

- **JS toujours valide** : après chaque modif, vérifier avec Node.js (extraction des `<script>` + `new Function()`).
- **Div équilibrés** : nombre de `<div` == nombre de `</div>`.
- **Pas d'apostrophes non échappées** dans les strings JS délimitées par `'`.
- **Échapper le HTML généré** côté JS (fonction `esc`/`e`) pour éviter le XSS.
- Modifications **section par section**, jamais tout d'un coup.
