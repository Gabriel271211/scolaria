# 📘 Documentation ScolarIA

Vue d'ensemble complète de l'application : architecture, connexions externes, fonctionnalités et données. Document de référence pour comprendre tout ce qu'il y a dans ScolarIA.

---

## 1. C'est quoi ScolarIA ?

Application scolaire pour collégiens français (niveau 3ème), développée par Gabriel.
**Single Page Application en HTML/CSS/JS pur** — pas de framework, pas de build system.
Chaque écran est un fichier `.html` autonome (standalone).

Cible principale : **smartphone Android sous Chrome** (installable comme app PWA).

---

## 2. Les fichiers du projet

| Fichier | Rôle |
|---------|------|
| `scolaria-home-v2.html` | **App principale** (~5900 lignes) : chat IA, devoirs, flashcards, pomodoro, moyennes, révisions, bibliothèque, profil. |
| `scolaria-langues.html` | **Mode Langues** style Duolingo (EN/ES) : parcours zigzag, cours écrits, exercices interactifs, chat IA. |
| `scolaria-base.html` | Ancienne base de l'app. À ne pas toucher sauf demande. |
| `manifest.json` | Manifeste PWA (nom, icônes, couleurs, écran de démarrage). |
| `sw.js` | Service Worker (cache hors-ligne, stratégie network-first). |
| `supabase/functions/groq-proxy/index.ts` | **Edge Function** Deno qui relaie les appels IA vers Groq en gardant la clé secrète côté serveur. |
| `CLAUDE.md` | Instructions de travail pour l'assistant IA. |
| `DOCUMENTATION.md` | Ce document. |
| `CONTEXTE-PROMPT.md` | Prompt de contexte réutilisable pour de futures sessions IA. |

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
- **Modèles utilisés :**
  - Texte : `llama-3.3-70b-versatile`
  - Vision (photos de cours/devoirs) : `meta-llama/llama-4-maverick-17b-128e-instruct`, `meta-llama/llama-4-scout-17b-16e-instruct`
- Supporte le **streaming SSE** (réponse token par token dans le chat) et le JSON classique.

> ⚠️ **Sécurité critique** : la clé Groq vit UNIQUEMENT dans le secret Supabase `GROQ_API_KEY`. Elle ne doit JAMAIS être écrite en dur dans le code client ni commitée — sinon elle est volée et révoquée automatiquement. C'est exactement le bug qui cassait l'IA des autres comptes auparavant.

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
```

- Toutes les fonctions IA appellent `GROQ_PROXY` avec l'en-tête `Authorization: Bearer <SUPA_ANON>`.
- Les appels vision (photos) postent directement sur `GROQ_PROXY` avec le modèle vision et un message `image_url`.

---

## 5. Les fonctionnalités

| Fonctionnalité | Description |
|----------------|-------------|
| **Chat IA** | Discussion avec ScolarIA (streaming). Détecte les demandes de fiche/flashcards/quiz et propose le résultat en carte. Support des **photos** (vision IA). |
| **Devoirs** | Liste des devoirs avec dates. Ajout manuel ou par **scan de photo** (analyse d'agenda/cahier via vision IA). Swipe pour gérer. |
| **Révisions** | Génération IA de fiches, flashcards, résumés et interrogations à partir d'un sujet ou d'un cours collé. |
| **Flashcards** | Decks de cartes (question/réponse), session de révision, stats de réussite. |
| **Interrogation IA** | Questions générées par l'IA + correction automatique des réponses de l'élève. |
| **Quiz vocal (VQ)** | Quiz avec réponse libre, correction IA. |
| **Scanner de cours** | Photo d'un cours → fiche de révision ou flashcards générées par vision IA. |
| **Veille de contrôle** | Planning de révision sur N jours généré par l'IA, avec création de flashcards. |
| **Conjugaison** | FR (tables locales + IA pour irréguliers), EN et ES (local + enrichissement IA). |
| **Pomodoro** | Minuteur de travail/pause avec alerte sonore (WebAudio) et vibration (haptique) en fin de cycle. |
| **Moyennes** | Calcul de moyenne pondérée par coefficients. |
| **Bibliothèque / Historique** | Historique des contenus générés (`sk_hist`), favoris. |
| **Profil** | Avatar (emoji), nom, niveau, stats, thème clair/sombre. |
| **Mode Langues** | Fichier séparé `scolaria-langues.html`, style Duolingo (voir son propre doc dans `CLAUDE.md`). |

---

## 6. Les données locales (localStorage)

Préfixe commun : `sk_`.

| Clé | Contenu | Synchronisée ? |
|-----|---------|:--------------:|
| `sk_prof` | Profil (nom, avatar, niveau…) | ✅ |
| `sk_dv` | Devoirs | ✅ |
| `sk_decks` | Decks de flashcards | ✅ |
| `sk_hist` | Historique des générations IA | ✅ |
| `sk_chat` | Historique du chat (20 derniers) | ✅ |
| `sk_fiche_count` | Nombre de fiches créées | ✅ |
| `sk_flash_stats` | Stats flashcards `{ok,total}` | ✅ |
| `sk_quiz_stats` | Stats quiz `{ok,total}` | ✅ |
| `sk_streak` | Série de jours `{count,date}` | ✅ |
| `sk_day_*` | Activité journalière | ✅ (préfixe) |
| `sk_theme` | Thème clair/sombre | ❌ (local au device) |

> La clé `sk_groq` (ancienne clé Groq stockée côté client) **n'existe plus** — supprimée lors de la migration vers le proxy.

---

## 7. PWA (installation et hors-ligne)

- **`manifest.json`** : nom « ScolarIA », `start_url` = `scolaria-home-v2.html`, affichage `standalone`, portrait, icône S indigo, thème `#4F46E5`.
- **`sw.js`** : cache `scolaria-v4`. Stratégie **network-first** (réseau d'abord, cache en secours). Les hôtes d'API (`groq.com`, `supabase.co`, etc.) sont exclus du cache pour ne jamais servir une réponse IA périmée.

---

## 8. Règles techniques importantes

- **JS toujours valide** : après chaque modif, vérifier avec Node.js (extraction des `<script>` + `new Function()`).
- **Div équilibrés** : nombre de `<div` == nombre de `</div>`.
- **Pas d'apostrophes non échappées** dans les strings JS délimitées par `'`.
- **Échapper le HTML généré** côté JS (fonction `esc`/`e`) pour éviter le XSS.
- Modifications **section par section**, jamais tout d'un coup.
