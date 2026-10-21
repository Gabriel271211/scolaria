# 🎯 OBJECTIFS SCOLARIA + checklist de session

> ScolarIA = **une seule app** (`scolaria-home-v2.html`). L'ancien plan « un mode par matière » (Langues, Sciences, Histoire, Arts, Arène…) est abandonné → voir `archive/`.
> Mis à jour : 21 octobre 2026 (audit complet).

---

## ✅ Déjà fait

| Fonctionnalité | Statut |
|----------------|:------:|
| Comptes (Supabase) + sync cloud + mot de passe oublié | ✅ |
| Onboarding style Duolingo (prénom, classe, objectif, avatar) | ✅ |
| Chat IA en streaming + photos (vision IA) | ✅ |
| Devoirs (manuel + scan de l'agenda) | ✅ |
| Révisions : fiches, flashcards, interro, quiz vocal, scanner de cours, veille de contrôle | ✅ |
| Conjugueur FR / EN / ES (IA) | ✅ |
| Pomodoro, moyennes, historique, favoris, mode nuit | ✅ |
| PWA installable (icônes PNG + bouton « Installer l'app ») + hors-ligne | ✅ |
| Annales Brevet — Physique-Chimie (140 exos) | ✅ |
| Annales Brevet — Maths (140 exos) | ✅ |
| Nettoyage : Langues & Sciences archivés | ✅ |
| Multi-niveaux 6ème → Terminale : l'IA s'adapte à la classe (programme + façon de parler) | ✅ |
| Veille de contrôle v2 : date précise, plusieurs sujets, planning jour par jour, notifications | ✅ |
| Programmes officiels de maths 2026-2027 intégrés (6ème → Terminale) + bouton 🌐 recherche internet dans le chat | ✅ |
| Interrogation interactive dans le chat : outil que l'IA lance d'elle-même quand l'élève veut être interrogé | ✅ |
| Scanner → « Mes cours » : transcription fidèle, sauvegardée, modifiable, plusieurs pages, révisable (fiche, flashcards, interro) | ✅ |
| Mes cours v2 (style Notes d'Apple) : cahiers colorés, page de cahier modifiable directement, barre de mise en forme, menu ⋯, rangement automatique | ✅ |
| Mes cours : vraies pages (26 lignes, numérotées, débordement automatique), ajout de pages facile (vierge / photo / plusieurs photos), bouton retour Android, clavier aligné | ✅ |
| **Audit complet (21 oct. 2026)** : synchro sans perte de données (hors ligne, app fermée vite, erreurs d'envoi), session qui ne recharge plus tout chaque heure, mode hors connexion, correcteur IA réparé (prompt finissait par « undefined »), historique du chat limité (plus de chat cassé par la limite Groq), délai max 90 s + erreurs en français, photos réduites partout, devoirs avec vraie date (+ « En retard »), série = jours de travail réel, Pomodoro juste écran verrouillé, bouton retour Android partout, Interro IA → interro du chat, flashcards échappées, Annales chargées à la demande, mode nuit, accents, code mort supprimé, proxy IA durci | ✅ |
| App bloquée sur le logo sans réseau (21 oct. 2026) : ouverture immédiate en mode avion, jamais plus de 8 s d'attente du cloud, service worker qui sert la copie en cache si le réseau ne répond pas en 4 s | ✅ |

---

## 🔜 À faire (par ordre de priorité)

| # | Objectif | Détail | Statut |
|---|----------|--------|:------:|
| 0 | **Redéployer le proxy IA durci** | Dashboard Supabase → Edge Functions → `groq-proxy` → Code → coller `supabase/functions/groq-proxy/index.ts` → Deploy (garder Verify JWT sur OFF). Puis tester une question dans le chat. Tant que ce n'est pas fait, n'importe qui peut utiliser la clé Groq de l'app. Déployé le 21 oct. 2026 (vérifié : un appel sans élève connecté est refusé, 401) | ✅ |
| 0 bis | Vérifier sur le téléphone après l'audit | Bouton retour (fiche plein écran, Veille, menu, Pomodoro), ajout d'un devoir avec date, Pomodoro écran verrouillé, mode avion (l'app doit s'ouvrir avec « Hors connexion ») | ⬜ |
| 0 ter | Bouton « Supprimer mon compte » (RGPD, élèves mineurs) | Demande une petite Edge Function avec la clé service (supprime `user_data` + l'utilisateur) | ⬜ |
| 1 | Empêcher Supabase de se mettre en pause | Petite tâche automatique qui « réveille » le projet chaque semaine (sinon connexion + IA cassées après ~7 jours sans utilisation) | ⬜ |
| 2 | Vérifier l'app sur téléphone après la pause | Connexion, sync, chat IA, photos, annales | ⬜ |
| 3 | Annales — SVT | ~75 exos, même format (énoncé + schéma + correction + piège brevet) | ⬜ |
| 4 | Annales — Histoire-Géo-EMC | ~60 exos (documents, repères, développement construit) | ⬜ |
| 5 | Annales — Français | ~40 exos (compréhension, grammaire, réécriture, dictée) | ⬜ |
| 6 | Annales — Technologie | ~30 exos | ⬜ |
| 7 | Version primaire (CM1, CM2) | Ajouter les classes dans `NIVEAUX` + onboarding, façon de parler encore plus simple | ⬜ |
| 8 | Annales pour le lycée | Exercices type bac (bac de français, épreuve anticipée de maths, spécialités) | ⬜ |
| 9 | Programmes détaillés des autres matières | Physique-chimie, SVT, histoire-géo, français, philosophie intégrés (`PROG_MATIERES`). Reste possible : technologie, langues, SES, enseignement scientifique | ✅ |
| 10 | Mettre à jour `PROG_MATIERES` à chaque rentrée | Rentrée 2027 : nouveaux programmes de maths et français en 4ème, maths en Terminale. Rentrée 2028 : en 3ème | ⬜ |
| 10 bis | Passer Groq en « Dev Tier » si beaucoup d'élèves | Compte gratuit = 8 000 jetons/minute pour toute l'app (≈ 3 générations de fiches par minute) ; au-delà, les élèves attendent ou voient « ScolarIA est très demandée » | ⬜ |
| 11 | _À compléter par Gabriel_ | | ⬜ |

Change ⬜ en ✅ quand c'est fait.

---

## AVANT de commencer une session

- [ ] Ouvrir le dossier ScolarIA dans Claude Code
- [ ] Claude lit `CLAUDE.md` automatiquement (sinon : copier `CONTEXTE-PROMPT.md`)
- [ ] Dire **une seule chose à la fois**

## PENDANT

- [ ] Si bug après 2 tentatives → **« Reviens à la version d'avant et essaie autrement »**

## APRÈS

- [ ] Ouvrir l'app dans Chrome → F12 → icône mobile → 390px
- [ ] Tester la nav + la fonctionnalité modifiée
- [ ] Aucune erreur rouge dans la Console
- [ ] Commit + push (Vercel redéploie tout seul)
- [ ] Mettre à jour le tableau des objectifs ci-dessus
