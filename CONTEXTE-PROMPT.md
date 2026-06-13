# 🧠 Prompt de contexte — ScolarIA

Copie-colle ce bloc au début d'une nouvelle session IA (Claude, ChatGPT…) pour donner tout le contexte du projet d'un coup.

---

```
Tu travailles sur ScolarIA, une application scolaire pour collégiens français
(niveau 3ème) développée par Gabriel (14 ans). C'est une Single Page Application
en HTML/CSS/JS pur — PAS de framework, PAS de build system. Juste des fichiers
.html autonomes. Cible : smartphone Android sous Chrome, installable en PWA.

FICHIERS PRINCIPAUX
- scolaria-home-v2.html : l'app principale (~5900 lignes) — chat IA, devoirs,
  flashcards, pomodoro, moyennes, révisions, bibliothèque, profil.
- scolaria-langues.html : mode Langues style Duolingo (EN/ES), parcours zigzag,
  cours écrits, exercices, chat IA.
- scolaria-base.html : ancienne base, NE PAS TOUCHER sauf demande explicite.
- manifest.json + sw.js : config PWA (cache hors-ligne network-first).
- supabase/functions/groq-proxy/index.ts : Edge Function Deno (proxy IA).

CONNEXIONS EXTERNES
- Supabase (https://vefnkztjmodchvmspukh.supabase.co, clé publishable
  sb_publishable_OVVDWsvA2-0dJuTdQREYVw_kSiTu7Ge) sert à 3 choses :
  1. Auth email/mot de passe (signUp, signInWithPassword, onAuthStateChange).
  2. Sync cloud des données dans la table user_data ({user_id, data}) via
     upsert/select (clés SYNC_KEYS + sk_day_*).
  3. Edge Function "groq-proxy" qui relaie les appels IA vers Groq en gardant
     la clé secrète GROQ_API_KEY côté serveur (Verify JWT = OFF).
- Groq (API compatible OpenAI) : JAMAIS appelée en direct par le client, TOUJOURS
  via le proxy Supabase. Modèles : llama-3.3-70b-versatile (texte),
  meta-llama/llama-4-maverick et llama-4-scout (vision/photos). Streaming SSE.
- Vercel : déploiement automatique à chaque git push sur main
  (repo GitHub Gabriel271211/scolaria).

APPELS IA DANS LE CODE
  var GROQ_PROXY = 'https://vefnkztjmodchvmspukh.supabase.co/functions/v1/groq-proxy';
  var SUPA_ANON  = 'sb_publishable_OVVDWsvA2-0dJuTdQREYVw_kSiTu7Ge';
  callGroq(messages, maxTok)        -> réponse complète (JSON)
  callGroqStream(messages, onChunk) -> streaming token par token (SSE)
  Tous les fetch vont sur GROQ_PROXY avec header Authorization: Bearer <SUPA_ANON>.

DONNÉES LOCALES (localStorage, préfixe sk_)
  sk_prof, sk_dv (devoirs), sk_decks (flashcards), sk_hist (historique IA),
  sk_chat, sk_fiche_count, sk_flash_stats, sk_quiz_stats, sk_streak,
  sk_day_* (activité), sk_theme (non synchronisé).

⚠️ SÉCURITÉ — RÈGLES ABSOLUES
- La clé Groq vit UNIQUEMENT dans le secret Supabase GROQ_API_KEY.
- Ne JAMAIS écrire une clé Groq en dur dans le code client ni la commiter
  (auto-révoquée + volable). C'était le bug qui cassait l'IA des autres comptes.
- La clé publishable Supabase, elle, est publique : OK dans le code client.

RÈGLES DE DÉVELOPPEMENT
- Lire le fichier concerné en entier avant toute modif.
- Après CHAQUE modif, vérifier le JS avec Node.js :
  node -e "const fs=require('fs');const c=fs.readFileSync('scolaria-home-v2.html','utf8');const s=c.match(/<script>([\s\S]*?)<\/script>/g);let j=s?s.map(x=>x.replace(/<\/?script>/g,'')).join('\n'):'';try{new Function(j);console.log('JS OK')}catch(e){console.error('JS ERROR:',e.message)}"
- Compter les <div ouverts et fermés : ils doivent être égaux.
- Pas d'apostrophes non échappées dans les strings JS en '...'.
- Pas de template literals (backticks) dans le HTML inline.
- Échapper le HTML généré côté JS (esc/e) contre le XSS.
- Modifier section par section, jamais tout d'un coup.
- Toujours en français avec Gabriel.

CE QUE GABRIEL VEUT
- App fluide sur smartphone Android (Chrome).
- Pas de framework, pas de build — fichiers HTML standalone.
- Mode Langues proche de Duolingo, contenu adapté niveau 3ème (rappels,
  tableaux, pièges du brevet).
- Éventuellement fusionner scolaria-base.html et scolaria-langues.html en un
  seul fichier quand les deux seront stables.
```

---

> Pour le détail complet de l'architecture et des fonctionnalités, voir `DOCUMENTATION.md`.
> Pour les règles de travail détaillées, voir `CLAUDE.md`.
