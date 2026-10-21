# 📘 Documentation ScolarIA

Vue d'ensemble complète de l'application : architecture, connexions externes, fonctionnalités et données. Document de référence pour comprendre tout ce qu'il y a dans ScolarIA.

---

## 1. C'est quoi ScolarIA ?

Application scolaire pour élèves français du **collège au lycée (6ème → Terminale)**, développée par Gabriel. L'élève choisit sa classe et toute l'IA s'adapte à son programme et à sa façon de parler.
**Single Page Application en HTML/CSS/JS pur** — pas de framework, pas de build system.
L'app = `scolaria-home-v2.html` (HTML) + `css/app.css` + `js/*.js` (un fichier par fonctionnalité, scripts classiques chargés dans l'ordre, servis tels quels).

Cible principale : **smartphone Android sous Chrome** (installable comme app PWA).

---

## 2. Les fichiers du projet

| Fichier | Rôle |
|---------|------|
| `index.html` | Redirige immédiatement vers `scolaria-home-v2.html` (point d'entrée). |
| `scolaria-home-v2.html` | **L'app** : le HTML (écrans, fenêtres, ~1200 lignes) + les `<link>`/`<script>` des fichiers ci-dessous. |
| `css/app.css` | Tous les styles (chercher « ── X ── »). |
| `js/base.js` … `js/annales.js` | Le JavaScript, un fichier par fonctionnalité, **chargés dans cet ordre** : `base` (thème, navigation, bouton retour, esc/toast, hors connexion) → `devoirs` → `accueil` → `revisions` → `chat` (chat IA, interro du chat, recherche 🌐) → `historique` → `niveau` (classes, programmes officiels) → `ia` (appels Groq, detectMat, correcteur) → `outils` (Pomodoro, calculatrice, convertisseur, conjugueur, moyenne, quiz vocal, scanner) → `cours` (Mes cours) → `veille` → `profil` (profil, série, progression) → `demarrage` (initApp) → `compte` (Supabase, synchro, onboarding, session) → `annales`. Une ligne exécutée au chargement ne peut utiliser que les fonctions des fichiers déjà chargés. |
| `annales-data.js` | Banque d'exercices type Brevet (Maths + Physique-Chimie, 280 exos), chargée par `scolaria-home-v2.html` **à la première ouverture des Annales** (`annCharger()`), pas au démarrage. |
| `archive/` | **Ancien projet conservé mais retiré de l'app** (non déployé, voir `archive/README.md`) : modes Langues et Sciences + anciens docs de plan. |
| `.vercelignore` | Exclut `archive/` et `tests/` du déploiement Vercel. |
| `tests/run.mjs` | **Tests automatiques** (voir section 8 bis) : `node tests/run.mjs`. Non déployé. |
| `reset-password.html` | Page de réinitialisation de mot de passe (liée depuis l'écran de connexion). |
| `manifest.json` | Manifeste PWA (nom, icônes, couleurs, écran de démarrage). |
| `icons/` | Icônes PNG de l'app installée (192, 512, maskable, apple-touch). |
| `sw.js` | Service Worker (cache hors-ligne, stratégie network-first). |
| `vercel.json` | Config Vercel : rewrite `/` → `scolaria-home-v2.html`, en-têtes de sécurité (nosniff, referrer, anti-iframe, caméra/micro limités au site), no-cache sur les `.html` et `sw.js`. |
| `supabase/functions/groq-proxy/index.ts` | **Edge Function** Deno qui relaie les appels IA vers Groq en gardant la clé secrète côté serveur. |
| `supabase/functions/supprimer-compte/index.ts` | **Edge Function** « Supprimer mon compte » (RGPD) : efface les données (`user_data`) puis le compte de l'élève connecté. |
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
- **Librairie chargée** : `@supabase/supabase-js@2.118.0` (version **figée**) via CDN jsDelivr, avec `crossorigin="anonymous"` pour que `sw.js` la garde en cache hors ligne. Si elle ne se charge pas, l'app démarre quand même avec les données du téléphone.

**Trois usages de Supabase :**

1. **Authentification** (email + mot de passe)
   - `signUp` (inscription), `signInWithPassword` (connexion), `onAuthStateChange` (suit l'état de session).
   - À l'ouverture de la session, les données du cloud sont récupérées (`syncFromCloud`) puis l'app démarre **une seule fois** (`_appDemarre`) : les renouvellements de session (`TOKEN_REFRESHED`, environ toutes les heures) ne rechargent plus rien.
   - **Bandeau « Hors connexion »** (`#offline-bar`, `majHorsLigne()`) : visible sous l'en-tête dès que le téléphone n'a plus de réseau (`navigator.onLine`, événements `online`/`offline`) ; « Connexion retrouvée » au retour.
   - **Hors connexion** : en mode avion (`navigator.onLine === false`), `_demarrageHorsLigne()` ouvre l'app **tout de suite** avec les données du téléphone ; avec un réseau qui ne répond pas, au bout de 6 s (ou dès que la librairie n'a pas pu se charger). Message « Hors connexion ». `_demarrerSession()` n'attend jamais le cloud plus de 8 s ; si l'app est déjà ouverte hors connexion et que le cloud apporte du nouveau au retour du réseau (`syncFromCloud()` renvoie `true`), l'écran est rafraîchi.

2. **Synchronisation des données** (table `user_data`, protégée par RLS : vérifié en oct. 2026, la clé publique ne voit aucune ligne)
   - Ligne par utilisateur : `{ user_id, data }` ; `data.__modif` = date de la version enregistrée.
   - `scheduleSync()` (à appeler après chaque écriture d'une donnée synchronisée) met à jour `sk__modif` et envoie au bout de 3 s ; envoi immédiat quand on quitte l'app (`visibilitychange`) ou au retour du réseau (`online`).
   - `syncToCloud` → `upsert` ; l'erreur éventuelle est vérifiée (`r.error`) et, en cas d'échec, les changements restent « en attente » (`sk__modif` > `sk__envoi`) pour être renvoyés.
   - `syncFromCloud` → si des changements locaux en attente sont plus récents que le cloud, **ils sont envoyés au lieu d'être écrasés** (travail hors ligne, app fermée trop vite) ; sinon le cloud est récupéré.
   - `logout()` envoie d'abord les modifs en attente (et prévient s'il n'y a pas de réseau) ; « Réinitialiser toutes mes données » (`resetDonnees()`) vide le téléphone **et** le cloud (le compte reste). « Supprimer mon compte » (Profil → Données) supprime le compte lui-même : voir l'Edge Function `supprimer-compte` ci-dessous.
   - Seules les clés listées dans `SYNC_KEYS` + les clés `sk_day_*` sont synchronisées.

3. **Edge Function `groq-proxy`** (proxy IA)
   - URL : `https://vefnkztjmodchvmspukh.supabase.co/functions/v1/groq-proxy`
   - Runtime Deno. Déployée avec **"Verify JWT" = OFF** (la vérification est faite dans le code).
   - Garde le secret `GROQ_API_KEY` côté serveur.
   - Reçoit la requête du client, ajoute l'en-tête `Authorization: Bearer <GROQ_API_KEY>`, et relaie vers l'API Groq. Renvoie tel quel le flux (SSE streaming ou JSON) + en-têtes CORS.
   - **Version durcie (code du dépôt, oct. 2026)** : l'app envoie le jeton de session de l'élève ; la fonction le vérifie auprès de Supabase (`/auth/v1/user`, cache 5 min) et refuse (401) les appels sans élève connecté ; `max_tokens` plafonné à 8000, `n` = 1, demande ≤ 4,5 Mo, outils limités à `function` et `browser_search`. Secret `AUTH_OBLIGATOIRE = 0` pour couper la vérification en urgence. **Se redéploie à la main** (dashboard Supabase → Edge Functions → groq-proxy → Code → coller → Deploy).

4. **Edge Function `supprimer-compte`** (RGPD : droit à l'effacement)
   - URL : `https://vefnkztjmodchvmspukh.supabase.co/functions/v1/supprimer-compte` — code dans `supabase/functions/supprimer-compte/index.ts`.
   - Déployée à la main comme `groq-proxy` (dashboard → Edge Functions → Deploy a new function → Via Editor), **"Verify JWT" = OFF**.
   - Identifie l'élève par **son jeton de session** (`auth.getUser`), jamais par un identifiant envoyé par l'app ; efface sa ligne `user_data`, puis son compte (`auth.admin.deleteUser`). Clé service fournie automatiquement par Supabase (`SUPABASE_SERVICE_ROLE_KEY` ou `SUPABASE_SECRET_KEYS`).
   - Côté app (`js/compte.js`) : fenêtre `#suppr-modal` (ce qui sera effacé + **mot de passe redemandé** via `signInWithPassword`), puis `logout({ compteSupprime: true })` : déconnexion locale, téléphone vidé, **rien n'est renvoyé au cloud**, message de confirmation après rechargement. Testé par `node tests/run.mjs supprimer` (mauvais mot de passe, erreur serveur, fonction absente, suppression réussie).

### 3.2 Groq (intelligence artificielle)

- **JAMAIS appelée directement par le client.** Tout passe par le proxy Supabase.
- API compatible OpenAI (`/openai/v1/chat/completions`).
- **Modèles utilisés** (définis à UN seul endroit : `AI_TEXT_MODEL` et `AI_VISION_MODELS` dans `js/ia.js`) :
  - Texte : `openai/gpt-oss-120b` (avec `reasoning_effort: 'low'` pour rester rapide). Ses formules LaTeX sont converties en texte lisible par `_cleanMath()`.
  - Vision (photos de cours/devoirs) : `qwen/qwen3.8-27b`
  - ⚠️ Groq supprime régulièrement des modèles → erreur `model_not_found` = l'IA ne répond plus. Il suffit de changer les noms dans `AI_TEXT_MODEL` / `AI_VISION_MODELS` (liste : https://console.groq.com/docs/models). Les anciens Llama 3.3 / Llama 4 ont disparu en 2026.
- Supporte le **streaming SSE** (réponse token par token dans le chat) et le JSON classique.

> ⚠️ **Sécurité critique** : la clé Groq vit UNIQUEMENT dans le secret Supabase `GROQ_API_KEY`. Elle ne doit JAMAIS être écrite en dur dans le code client ni commitée — sinon elle est volée et révoquée automatiquement. C'est exactement le bug qui cassait l'IA des autres comptes auparavant.

> ⚠️ **Projet gratuit = mise en pause automatique** après ~7 jours sans activité. Symptôme : connexion ET IA cassées, l'adresse `vefnkztjmodchvmspukh.supabase.co` ne répond plus. **Évité par la tâche GitHub Actions `.github/workflows/supabase-reveil.yml`** (requête quotidienne + vérif auth et proxy IA ; si ça ne répond pas, la tâche échoue et GitHub envoie un e-mail). Solution : dashboard Supabase → **Restore project** (possible seulement pendant 90 jours de pause). Arrivé en octobre 2026 après 3 mois d'inactivité.

### 3.3 Vercel (hébergement)

- Déploiement automatique : un `git push` sur la branche `main` du repo GitHub (`Gabriel271211/scolaria`) redéploie le site.

---

## 4. Comment les appels IA fonctionnent (dans le code)

Dans `js/ia.js` :

```js
var GROQ_PROXY = 'https://vefnkztjmodchvmspukh.supabase.co/functions/v1/groq-proxy';
var SUPA_ANON  = 'sb_publishable_OVVDWsvA2-0dJuTdQREYVw_kSiTu7Ge';

async function callGroq(messages, maxTok) { ... }        // réponse complète (JSON)
async function callGroqStream(messages, onChunk) { ... } // streaming token par token (SSE)
async function callGroqVision(messages, maxTok, opts) { ... } // photos : essaie chaque modèle vision
```

- Toutes les fonctions IA appellent `GROQ_PROXY` avec l'en-tête `Authorization: Bearer <SUPA_ANON>`.
- Les appels vision (photos) passent tous par `callGroqVision` (scan d'agenda, photo dans le chat, scanner de cours).
- Tous les appels passent par `_groqFetch()` : jeton de session de l'élève dans `Authorization`, abandon au bout de 90 s sans réponse, erreurs réseau en français, relance automatique si Groq répond 429 avec une attente courte (limite gratuite de 8 000 jetons/minute), message « demande trop longue » si la requête dépasse la limite (413 / « Request too large »), sinon message en français.
- Le chat n'envoie que `chatHistIA(n)` : les derniers messages dans un budget d'environ 6 000 caractères (chaque message coupé à 1 500). Le streaming est affiché au plus toutes les 80 ms (léger pour le téléphone) et ne fait défiler que si l'élève est déjà en bas. Un seul envoi à la fois (`_chatBusy`).
- Le bloc niveau contient le **programme officiel 2026-2027 de la matière détectée** (`PROG_MATIERES` : maths, physique-chimie, SVT, histoire-géo, français, philosophie).
- Les trois fonctions ajoutent le bloc niveau (sauf `{noNiveau:true}` ; `{niveau:'court'}` = une ligne), nettoient les formules (`_cleanMath` : LaTeX → texte, exposants en ², ³, ⁻³…) et **lèvent une erreur si la réponse est vide**.
- À la déconnexion, `logout()` efface aussi le cache `scolaria-data` et la vérification en arrière-plan : plus de rappels de contrôles pour l'ancien compte.

---

## 5. Les fonctionnalités

| Fonctionnalité | Description |
|----------------|-------------|
| **Chat IA** | Discussion avec ScolarIA (streaming). Détecte les demandes de fiche/flashcards/quiz et propose le résultat en carte. Support des **photos** (vision IA). **Interrogation dans le chat** : l'IA dispose d'un outil `lancer_interrogation` qu'elle utilise d'elle-même quand l'élève veut être interrogé (« interroge-moi sur… », « vérifie si je connais ma leçon »…) : questions une par une (QCM à boutons A-D ou réponse écrite), correction IA indulgente sur l'orthographe, bilan avec les points à revoir, « Nouvelles questions », « Explique-moi mes erreurs » ; score ajouté à la progression (`sk_quiz_stats`) et à l'historique. Bouton **🌐 Recherche internet** (`callGroqWeb`, outil `browser_search`) : la prochaine question est cherchée sur le web, sources affichées sous la réponse ; 5 recherches/jour/appareil (`sk_web`) car une recherche consomme ~40× plus de quota Groq. |
| **Devoirs** | Liste des devoirs groupés par jour. Chaque devoir a une **vraie date de rendu** (`due` = `AAAA-MM-JJ`, choisie avec le sélecteur du téléphone ou les raccourcis Aujourd'hui / Demain / Après-demain / Dans 1 semaine) ; le libellé du jour, le groupe « En retard » et la couleur d'urgence sont recalculés chaque jour (`dvGroupe`, `dvUrg`). Les anciens devoirs à date précise écrite en texte sont convertis automatiquement. Ajout manuel ou par **scan de photo** (analyse d'agenda/cahier via vision IA, qui renvoie la date au format AAAA-MM-JJ). Swipe pour gérer. Le bouton minuteur d'un devoir ouvre le Pomodoro. Les **contrôles à venir** de la Veille de contrôle y apparaissent aussi (lus en direct depuis `sk_ctrl`, pas de doublon) : badge « Contrôle », sujets, progression des révisions ; un appui ouvre le planning. Ils comptent dans le nombre de devoirs de l'accueil. |
| **Révisions** | Génération IA de fiches, flashcards, résumés et interrogations à partir d'un sujet ou d'un cours collé. |
| **Flashcards** | Decks de cartes (question/réponse), session de révision, stats de réussite. |
| **Interrogation IA** | Petite fenêtre (sujet + 5/8/10 questions) qui lance l'**interrogation du chat** (`cqStart`) : plus de second système en double. |
| **Quiz vocal (VQ)** | Quiz avec réponse libre, correction IA. |
| **Scanner de cours** | Photo d'un cours (réduite à 2000 px avant envoi, `imageReduite`) → **Transcrire et sauvegarder** (copie fidèle dans « Mes cours »), ou fiche / flashcards générées par vision IA. |
| **Mes cours** | Inspiré de Notes d'Apple. Panneau `#mc-panel` (fonctions `mc*`, CSS `.mc-`). **Cahiers** (`sk_cahiers` : nom + couleur) → liste des cours → **page de cahier** (lignes + marge rouge) **modifiable directement** (`contenteditable`, sauvegarde auto 0,6 s) avec barre de mise en forme au-dessus du clavier (Titre, Sous-titre, Texte, gras, italique, souligné, surligneur, listes). Menu **⋯** : Fiche, Flashcards, M'interroger, Ajouter une page (photo), Ranger dans un cahier, Supprimer. Recherche dans tous les cours. Un cours scanné est **rangé automatiquement** dans le cahier de sa matière (`mcCahierAuto`). **Pages** : un cours = plusieurs pages de taille fixe (`MC_LIGNES_PAGE` = 26 lignes, numéro « 1 / 3 » en bas, pleine largeur sans cadre). Quand une page est pleine, la fin passe sur une page de **suite** (`mcPaginer`, listes coupées entre deux puces, curseur conservé) ; les pages de suite sont refusionnées puis recalculées à chaque ouverture (du texte effacé remonte). Les pages **ajoutées** (bouton « + Ajouter une page » : vierge, photo, ou plusieurs photos de la galerie → une page chacune) commencent toujours une nouvelle feuille. Retour arrière sur une page vide = page supprimée. Le Scanner accepte aussi plusieurs photos d'un coup → un cours de plusieurs pages. Données : `pages` (html par page) + `suites` (booléens). **Bouton retour du téléphone** : chaque niveau (cahiers 1, liste 2, cours 3) a une entrée d'historique (`mcSyncHistorique`, `popstate`) ; le retour Android ferme d'abord un menu/une fenêtre, puis remonte d'un niveau. **Clavier** : le panneau prend la hauteur de `visualViewport` (`mcAjusterHauteur`), la barre de mise en forme est en bas de la colonne (donc posée sur le clavier) et `mcCaretVisible` garde la ligne écrite juste au-dessus. Le HTML est toujours nettoyé par `mcPropre` (seules les balises de mise en forme, aucun attribut) ; `texte` = version brute pour l'IA. |
| **Veille de contrôle** | Liste « Mes contrôles » (`sk_ctrl`, synchronisé). Chaque contrôle : matière, **date précise** (+ heure facultative), **plusieurs sujets**. L'IA génère un planning jour par jour calé sur les vraies dates (cases à cocher + progression). **Rappels** : la veille à 17h, le matin du contrôle (7h) et les jours de révision (17h), envoyés par `sw.js` (`checkCtrl`) via le cache `scolaria-data`. |
| **Conjugaison** | FR (tables locales + IA pour irréguliers), EN et ES (local + enrichissement IA). |
| **Pomodoro** | Minuteur de travail/pause avec alerte sonore (WebAudio) et vibration (haptique) en fin de cycle. Le temps restant est calculé depuis l'heure de fin (`poFin`) : il reste juste même quand le téléphone est verrouillé. |
| **Série (streak)** | Jours d'affilée **avec du travail** (`markActivity()` : question à l'IA, flashcards terminées, interro, devoir coché, fiche, cours écrit, tâche de révision, Pomodoro fini). Ouvrir l'app ne compte pas. Clés `sk_day_AAAA-MM-JJ` en date locale, gardées 400 jours. |
| **Bouton retour Android** | Ferme la fenêtre du dessus (fiche, historique, Veille, scanner, outils, menu…), revient à l'étape précédente (Annales, Révisions), puis à l'accueil ; ne quitte l'app que depuis l'accueil (`navRetour`, `navSync`, entrées d'historique `{ng:1}`). |
| **Moyennes** | Calcul de moyenne pondérée par coefficients. |
| **Bibliothèque / Historique** | Historique des contenus générés (`sk_hist`), favoris. |
| **Profil** | Avatar (emoji), nom, niveau, stats, thème clair/sombre. |
| **Annales Brevet** | Banque de 280 exercices type DNB (Maths + Physique-Chimie, `annales-data.js`), correction étape par étape, « piège brevet », coach IA, génération IA quand un thème est épuisé. |

---

## 5 bis. Niveau scolaire (6ème → Terminale)
- L'élève choisit sa classe (onboarding + profil, `userProfile.classe`). `getClasse()` la renvoie (défaut : 3ème).
- `NIVEAUX` (dans `js/niveau.js`) : pour chaque classe → cycle, examen, **façon de parler**, **programme officiel**.
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
| `sk_dv` | Devoirs `[{id, mat, desc, due, date, done}]` | ✅ |
| `sk_decks` | Decks de flashcards | ✅ |
| `sk_hist` | Historique des générations IA | ✅ |
| `sk_chat` | Historique du chat (20 derniers) | ✅ |
| `sk_fiche_count` | Nombre de fiches créées | ✅ |
| `sk_flash_stats` | Stats flashcards `{ok,total}` | ✅ |
| `sk_quiz_stats` | Stats quiz `{ok,total}` | ✅ |
| `sk_streak` | Série de jours `{count,date}` | ✅ |
| `sk_cours` | Mes cours : `[{id, titre, mat, html, texte, cahier, cree, maj}]` | ✅ |
| `sk_cahiers` | Cahiers de Mes cours : `[{id, nom, couleur, cree}]` | ✅ |
| `sk_ctrl` | Contrôles de la Veille de contrôle (date, sujets, planning, cases cochées, rappels) | ✅ |
| `sk_day_*` | Activité journalière | ✅ (préfixe) |
| `sk_ann_seen` | Exercices d'annales déjà vus | ✅ |
| `sk__modif` / `sk__envoi` | Synchro : date de la dernière modif locale / de la dernière version envoyée | ❌ (technique) |
| `sk_theme` | Thème clair/sombre (sans choix : suit le mode sombre du téléphone) | ❌ (local au device) |
| `sk_web` | Compteur de recherches internet du jour `{d, n}` | ❌ (local au device) |

> La clé `sk_groq` (ancienne clé Groq stockée côté client) **n'existe plus** — supprimée lors de la migration vers le proxy.

---

## 7. PWA (installation et hors-ligne)

- **`manifest.json`** : nom « ScolarIA », `id` + `start_url` = `/scolaria-home-v2.html`, affichage `standalone`, portrait, thème `#4F46E5`. Icônes **PNG** dans `icons/` (192, 512, 512 maskable — Android refuse les icônes SVG/data:), `icons/apple-touch-icon.png` pour iPhone.
- **Bouton « Installer l'app »** dans le tiroir (`#dm-install`, fonction `installApp()`) : caché par défaut, apparaît quand Chrome déclenche `beforeinstallprompt` (ouvre la vraie fenêtre d'installation) ou sur iPhone (affiche les instructions Partager → Sur l'écran d'accueil). Disparaît une fois l'app installée.
- **`sw.js`** : cache `scolaria-v9`, précache **tout ou rien** de `APP_FILES` (HTML, `css/app.css`, tous les `js/*.js`, annales, icônes : si un fichier manque, l'ancienne version complète reste en place). Une page servie depuis le cache prend aussi ses JS/CSS dans le cache (`pagesEnCache`, jamais deux versions mélangées) ; fichiers d'une page venue du réseau : 10 s avant le cache (`RESEAU_MAX_FICHIER`). Précache aussi la librairie Supabase figée : sans elle l'app hors ligne restait bloquée sur « Vérification en cours… » ; une page ouverte avec `?ctrl=` retrouve la page en cache) + cache `scolaria-data` (jamais effacé : contrôles à rappeler + rappels déjà envoyés). Gère aussi les **notifications des contrôles** : message `ctrl-check` envoyé par la page (ouverture + toutes les 10 min), `periodicsync` en arrière-plan (Chrome Android, app installée, au mieux), clic sur la notif → ouvre le contrôle (`?ctrl=<id>`). Stratégie **network-first** (réseau d'abord, cache en secours) avec un délai max `RESEAU_MAX` (4 s) : si le réseau ne répond pas (une barre, wifi sans internet), la copie en cache est servie et le téléchargement continue pour mettre le cache à jour. Les hôtes d'API (`groq.com`, `supabase.co`, `anthropic.com`, `generativelanguage`) sont exclus du cache pour ne jamais servir une réponse IA périmée.

---

## 8. Règles techniques importantes

- **Après chaque modif : `node tests/run.mjs`** (voir 8 bis). Tout doit être ✅ avant de pousser.
- **JS toujours valide** et **div équilibrés** (`<div` == `</div>` dans le HTML) : vérifiés par les tests.
- **Pas d'apostrophes non échappées** dans les strings JS délimitées par `'`.
- **Échapper le HTML généré** côté JS (fonction `esc`/`e`) pour éviter le XSS.
- Modifications **section par section**, jamais tout d'un coup.

---

## 8 bis. Tests automatiques (`tests/run.mjs`)

Une seule commande vérifie que rien n'est cassé (environ 1 min) :

```bash
node tests/run.mjs
```

- `node tests/run.mjs --rapide` : seulement les vérifications du code, sans navigateur (2 s).
- `node tests/run.mjs synchro` : seulement les groupes dont le nom contient « synchro » (ou `démarrage`, `écrans`, `fonctions`, `code`).
- `node tests/run.mjs --captures` : enregistre aussi des captures d'écran (taille téléphone) dans `tests/.out/`.

**Sans dépendance** : Node 22+ et Chrome (ou Edge) déjà installés. Le script lance Chrome sans fenêtre, en taille Android (390 px), et le pilote par le protocole DevTools. **Supabase et l'IA sont simulés** : aucun vrai compte, aucune vraie donnée, aucun jeton Groq consommé. La première fois, il copie supabase-js dans `tests/.cache/` (internet nécessaire une fois).

| Groupe | Ce qui est vérifié |
|--------|--------------------|
| Code | Syntaxe JS de chaque page et fichier, `<div>`/`<script>` équilibrés, pas de clé Groq ni d'appel direct à Groq, même version de supabase-js partout, fichiers précachés et liens locaux existants, `localStorage.clear()` seulement dans `logout()`, pas de `toISOString()`, service worker (réseau rapide / muet / mode avion / lent). |
| Démarrage | Écran de connexion, élève connecté, mode avion (avec session valide et **expirée**), réseau muet (≤ 8 s), librairie introuvable, nouvel élève (onboarding), `reset-password.html`. |
| Synchro | Le cloud n'écrase jamais des modifs locales non envoyées, le cloud plus récent remplace le téléphone, rien n'est renvoyé si tout est à jour, un envoi refusé reste en attente. |
| Écrans | Chaque `onclick`/`oninput` appelle une fonction qui existe, les onglets du bas, **chaque fenêtre se ferme avec le bouton retour** (liste `FENETRES`), Annales (280 exos), ajout d'un devoir jusqu'au cloud, série, mode nuit, chat avec l'IA simulée (niveau + jeton envoyés), correcteur, limites Groq (par minute / par jour), erreurs IA. |
| Fonctions | Dates locales, date de rendu, groupes/urgence des devoirs, verdict du correcteur, `detectMat` sur des sujets réels (Résistance 1940 / résistance électrique, Lumières…), niveau → brevet/bac, historique du chat limité, échappement HTML (`esc`, `mdToHtml`, `mcPropre`), calculatrice. |

**Quand on ajoute une fonctionnalité** : ajouter son test dans `tests/run.mjs`. Une nouvelle fenêtre ou un nouveau panneau va dans la liste `FENETRES` (le test vérifie que le bouton retour la ferme). Si un test échoue parce que le comportement a changé **exprès**, mettre le test à jour.
