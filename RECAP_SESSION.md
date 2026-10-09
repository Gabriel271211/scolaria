# 🎯 OBJECTIFS SCOLARIA + checklist de session

> ScolarIA = **une seule app** (`scolaria-home-v2.html`). L'ancien plan « un mode par matière » (Langues, Sciences, Histoire, Arts, Arène…) est abandonné → voir `archive/`.
> Mis à jour : octobre 2026.

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

---

## 🔜 À faire (par ordre de priorité)

| # | Objectif | Détail | Statut |
|---|----------|--------|:------:|
| 1 | Empêcher Supabase de se mettre en pause | Petite tâche automatique qui « réveille » le projet chaque semaine (sinon connexion + IA cassées après ~7 jours sans utilisation) | ⬜ |
| 2 | Vérifier l'app sur téléphone après la pause | Connexion, sync, chat IA, photos, annales | ⬜ |
| 3 | Annales — SVT | ~75 exos, même format (énoncé + schéma + correction + piège brevet) | ⬜ |
| 4 | Annales — Histoire-Géo-EMC | ~60 exos (documents, repères, développement construit) | ⬜ |
| 5 | Annales — Français | ~40 exos (compréhension, grammaire, réécriture, dictée) | ⬜ |
| 6 | Annales — Technologie | ~30 exos | ⬜ |
| 7 | Version primaire (CM1, CM2) | Ajouter les classes dans `NIVEAUX` + onboarding, façon de parler encore plus simple | ⬜ |
| 8 | Annales pour le lycée | Exercices type bac (bac de français, épreuve anticipée de maths, spécialités) | ⬜ |
| 9 | _À compléter par Gabriel_ | | ⬜ |

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
