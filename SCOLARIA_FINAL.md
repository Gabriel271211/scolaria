# SCOLARIA — SESSIONS CLAUDE CODE
## Prompts optimisés · Design startup · Frontend skill au max

---

# RÈGLES ABSOLUES — À lire avant chaque session

1. Lire CLAUDE.md (règles anti-bug) + SKILL_DESIGN.md (règles design)
2. node --check après CHAQUE modification
3. Divs ouvertes = divs fermées
4. Pas d'apostrophes non échappées dans les strings JS
5. Si bug après 2 tentatives → revenir en arrière, approche différente
6. Tester sur mobile 390px dans Chrome DevTools avant de livrer

---

# CHARTE DESIGN STARTUP — S'applique à TOUS les modes

## Ce qu'on veut
ScolarIA doit avoir le niveau de Duolingo, Notion, Linear, Vercel.
Chaque mode est une app à part entière avec sa propre identité visuelle forte.
Un élève qui ouvre l'app doit sentir que c'est premium en moins d'une seconde.

## Typographie
- Chaque mode a SA police display unique (voir ci-dessous)
- Titres : font-weight 800 minimum, letter-spacing -0.5px à -1px
- Labels et catégories : UPPERCASE + letter-spacing 1.5px + font-size 9-10px
- Chiffres et scores : police monospace dédiée

## Couleurs
- Fond toujours sombre et teinté (jamais noir pur #000000)
- 1 couleur dominante vive + 1 accent chaud (amber/gold pour XP/scores)
- Bordures : rgba(couleur, 0.15-0.2) — jamais #333 ou #444
- Hover : rgba(couleur, 0.08-0.12) comme background
- Box-shadow coloré sur les boutons principaux : 0 8px 24px rgba(couleur, 0.35)

## Animations startup
- Page load : stagger reveal — chaque élément entre avec animation-delay +50ms
  ```css
  @keyframes slideUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .card { animation: slideUp 0.4s ease both; }
  .card:nth-child(1) { animation-delay: 0ms; }
  .card:nth-child(2) { animation-delay: 60ms; }
  .card:nth-child(3) { animation-delay: 120ms; }
  ```
- Cards : transition scale(0.97) au tap + border-color change
- Bouton principal : glow qui pulse toutes les 3 secondes
- Score/XP : compteur animé de 0 → valeur en 600ms (requestAnimationFrame)
- Bonne réponse : flash vert + scale(1.03) sur la card
- Mauvaise réponse : shake horizontal 3 fois + flash rouge

## Éléments visuels qui font la différence
- Gradient mesh en fond (2-3 blobs de couleur flous, opacity 0.06-0.08)
- Barre XP avec shimmer animé quand elle se remplit
- Cards avec inner glow subtil au hover (box-shadow inset)
- Séparateurs de sections : ligne fine avec dégradé transparent→couleur→transparent
- Badges et niveaux avec texture légère
- Empty states : illustration SVG simple + texte encourageant (jamais juste du texte)

## NAV bas — spec exacte pour TOUS les modes
```css
/* Structure identique partout */
position: fixed; bottom: 0;
height: calc(62px + 22px + env(safe-area-inset-bottom, 20px));
background: transparent; border: none;
display: flex; align-items: flex-end;
z-index: 99990; overflow: visible;

/* Fond via ::before */
::before {
  bottom: 0;
  height: calc(62px + env(safe-area-inset-bottom, 20px));
  background: fond du mode;
  border-top: 1px solid rgba(couleur, 0.15);
  backdrop-filter: blur(20px); /* verre dépoli premium */
}

/* Bouton central */
width: 54px; height: 54px; border-radius: 50%;
background: dégradé couleur du mode;
margin-top: 0; align-self: flex-start;
z-index: 99999;
box-shadow: 0 8px 24px rgba(couleur, 0.5);
```

---

# COMPOSANT ACCUEIL UNIVERSEL

Identique dans tous les modes. Seule la couleur et les labels changent.

## Structure HTML complète

```
1. Hero card (dégradé couleur du mode, mesh en fond)
   ├── Avatar + Prénom (depuis sk_profile, défaut Gabriel/🎓)
   ├── Streak avec animation flamme (depuis sk_s)
   └── Citation motivante (5 phrases, choisie aléatoirement)

2. XP Card (fond card, bordure couleur du mode)
   ├── Niveau actuel (Débutant/Intermédiaire/Avancé/Expert)
   ├── XP avec compteur animé
   └── Barre de progression avec shimmer

3. Stats grid 3 colonnes
   ├── Col 1 : activités [MODE]
   ├── Col 2 : 🔥 Streak
   └── Col 3 : points spéciaux [MODE]

4. Bouton Continuer (visible si activité non terminée)
   └── Style : bordure couleur du mode, fond légèrement teinté

5. Bouton principal [MODE] (CTA principal, glow pulsant)

6. Section "⚡ ACTIONS RAPIDES"
   └── Grid 2 colonnes, 6 cards (voir tableau ci-dessous)

7. Section "🎯 OUTILS [MODE]"
   └── Grid 2 colonnes, 3 cards spécifiques au mode
```

## Les 6 actions rapides (identiques partout)

| # | Titre | Sous-titre | Action | Couleur |
|---|-------|-----------|--------|---------|
| 1 | Scanner cours | Photo → Fiche IA | openScanCours() | var(--a1) |
| 2 | Veille contrôle | Plan de révision | openVeilleControle() | #f43f5e |
| 3 | Quiz vocal | Réponds à voix haute | openVocalQuiz() | #10b981 |
| 4 | Focus | 25 min Pomodoro | goTo('pomo') | #f59e0b |
| 5 | Moyenne | Notes & coefficients | goTo('moy') | #3b82f6 |
| 6 | Fiche + Flash | Générer en 1 clic | sendCombo();goTo('chat') | #f59e0b |

## Outils par mode

**Sciences** : 🧮 Calculer formule | 📐 Légender schéma | ⚗️ Expérience aléatoire
**Histoire** : ⏳ Entraînement dates | 🗺 Quiz carte | ⚖️ Débat du jour
**Arts** : 🔍 Œuvre mystère | 🎭 Duel mouvements | 🎲 Œuvre aléatoire
**Langues** : 💬 Conversation | 🔊 Phonétique | 🎯 Sprint vocabulaire
**Arène** : ⚡ Sprint 60s | 💣 Mode Bombe | 🏆 Défi du jour
**Enquête** : 📁 Affaire aléatoire | 👤 Profil suspect | 🔬 Affaire science
**Oral** : 🎲 Sujet surprise | ⏱ Chrono strict | 📋 Grille du prof
**Mind Map** : ✨ Générer auto | 🔄 Mode révision | 📸 Exporter

## Style des cards actions (spec précise)

```css
.action-card {
  background: var(--card);
  border: 1px solid var(--bord);
  border-radius: 20px;
  padding: 18px 16px;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
}
.action-card:active {
  transform: scale(0.96);
  border-color: couleur de l'icône;
  box-shadow: 0 0 0 1px couleur, 0 4px 12px rgba(couleur, 0.2);
}
.action-card .icon-wrap {
  width: 40px; height: 40px;
  border-radius: 12px;
  background: rgba(couleur, 0.12);
  display: flex; align-items: center; justify-content: center;
}
.action-card .title { font-size: 13px; font-weight: 700; color: var(--tx); }
.action-card .sub { font-size: 11px; color: var(--mu); }
```

## Composant Profil universel

```
1. Hero card dégradé (couleur du mode)
   ├── Avatar + Prénom + Classe (depuis sk_profile)
   └── Niveau + XP total

2. Stats grid 2x2
   ├── XP total | Activités faites
   └── Streak | Temps passé

3. Paramètres
   ├── Toggle son (avec animation switch)
   └── Toggle vibrations

4. Bouton "Réinitialiser" (rouge, confirmation obligatoire)
```

---

# SESSIONS COPIER-COLLER

---

## ══ SESSION 1 ══ Correction bug + Fusion

```
Lis CLAUDE.md et SKILL_DESIGN.md.

ÉTAPE 1 — Corriger scolaria-langues.html
Le fichier a un bug JS : il manque un } pour fermer l'objet en:{} dans LANG_COURSES.
Cherche exactement ce texte :    ]}\n  ]},\n  es:{name:'Espagnol'
La structure correcte doit être : unité]} ferme lessons, ]} ferme unit,
] ferme units[], } ferme en:{}, puis ,  es:{
Vérifie avec : node --check scolaria-langues.html → doit être ✅
Ouvre dans Chrome → zéro erreur console.

ÉTAPE 2 — Fusionner en scolaria.html
Prends scolaria-base.html et scolaria-langues.html.
Fusionne en un seul fichier scolaria.html.
Le mode Langues s'ouvre depuis un bouton dans le sidebar de ScolarIA.
Quand on est dans Langues, le bouton ‹ retour revient dans ScolarIA.

ÉTAPE 3 — Nav identique
La nav du mode Langues DANS scolaria.html doit utiliser
exactement le même CSS que la nav de ScolarIA (même structure ::before,
même z-index:99990/99999, même hauteur avec 22px extra).
Seule la couleur change : #0ea5e9 pour Langues, violet pour ScolarIA.

node --check scolaria.html → ✅
Zéro erreur console.
Tester sur mobile 390px.
```

---

## ══ SESSION 2 ══ Mode Sciences 🔬

```
Lis CLAUDE.md et SKILL_DESIGN.md.
Fichier : scolaria.html — ajouter le MODE SCIENCES.

━━ IDENTITÉ VISUELLE — NE PAS DÉROGER ━━

AMBIANCE : Laboratoire de recherche privé. NASA meets Apple.
Sobre, précis, technique. Chaque pixel doit respirer la rigueur scientifique.

Fond : #020f0a (noir verdâtre profond)
Couleur dominante : #10b981 (emerald-500)
Accent chaud : #f59e0b (amber, pour XP et scores)
Typo display : "IBM Plex Serif" — sérieux, scientifique, haut de gamme
Typo corps : "IBM Plex Sans" — neutre, très lisible
Typo formules/chiffres : "IBM Plex Mono" — style terminal de labo

ÉLÉMENTS VISUELS OBLIGATOIRES :
- Grille de points SVG en fond (#content) : pattern radial, opacity 0.04, vert
  ```svg
  <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="1" fill="#10b981" opacity="0.4"/>
  </pattern>
  ```
- Formules dans des blocs style terminal :
  fond #010a06, bordure gauche 3px #10b981, police IBM Plex Mono, padding 12px 16px
- Couleurs par matière (utilisées sur les cards et badges) :
  SVT #10b981 | Physique #3b82f6 | Chimie #f59e0b | Maths #8b5cf6
- Séparateurs de sections : hr avec dégradé transparent→#10b981→transparent

ANIMATIONS OBLIGATOIRES :
- Stagger reveal au chargement (voir charte design)
- Les formules s'affichent lettre par lettre (typewriter CSS) au premier affichage
- Les curseurs interactifs ont un glow vert au drag
- Compteur animé sur les scores (0 → valeur en 600ms)

━━ NAV BAS ━━
Labo | Formules | 🏠 (centre, #10b981) | Schémas | Profil
Appliquer exactement la spec nav de la charte design, couleur #10b981.
backdrop-filter: blur(20px) sur le ::before pour effet verre.

━━ ACCUEIL ━━
Utiliser le composant Accueil Universel (voir Partie 2).
Stats col 3 : "Formules apprises"
Bouton principal : "🧪 Aller au labo" avec glow #10b981
localStorage 'sk_sci'

━━ SECTION LABO ━━
4 expériences interactives. Chaque expérience est une "carte labo" :
fond sombre, titre en IBM Plex Serif, badge de difficulté coloré.

EXPÉRIENCE 1 — Circuit électrique SVG
SVG 300x200px avec bornes cliquables.
Drag entre deux bornes → trace un fil (ligne SVG animée).
Bouton "⚡ Mettre sous tension" :
  → Bonne config : animation ampoule qui s'allume (cercle jaune qui pulse)
    + affichage U=RI avec les valeurs calculées
    + flash vert sur toute la carte
  → Mauvaise config : animation éclair rouge + texte erreur
Après résolution : explication de la loi d'Ohm avec exemple concret.

EXPÉRIENCE 2 — Équation chimique
Cases vides pour coefficients (inputs numériques stylisés).
Exemple : __ H₂ + __ O₂ → __ H₂O
Bouton "Vérifier l'équilibre" :
  → Compte les atomes de chaque côté
  → Animation : les atomes bougent visuellement (SVG)
  → Feedback précis : "Côté gauche : 4H, 2O — Côté droit : 2H, 1O → Déséquilibré"
Les inputs ont un style terminal : fond #010a06, texte #10b981, monospace.

EXPÉRIENCE 3 — Tableau périodique interactif
Grille CSS du tableau périodique complet.
Familles colorées (alcalins, halogènes, gaz nobles, etc.).
Tap sur élément → bottom sheet avec :
  Symbole en grand (64px, IBM Plex Mono), masse atomique, groupe, période, anecdote.
Bouton "🎯 Quiz" → cache les noms, tu trouves depuis les propriétés.

EXPÉRIENCE 4 — Simulation optique
Laser SVG avec angle draggable (range input stylisé en arc).
Prisme/lentille SVG au centre.
Le rayon réfracté se recalcule en JS à chaque changement d'angle.
Affichage en temps réel : θ₁ = X° → θ₂ = Y°

━━ SECTION FORMULES ━━
Liste par matière. Chaque formule :
- Bloc terminal avec la formule en IBM Plex Mono, 18px
- Trois curseurs range interactifs (ex: U, R, I pour U=RI)
  Drag un curseur → les deux autres se recalculent automatiquement
  Les valeurs s'affichent avec animation de compteur
- Bouton "💡 Cas concret" → exemple avec un vrai appareil
- Bouton "🧠 Mnémotechnique" → astuce de mémorisation

━━ SECTION SCHÉMAS ━━
Schémas SVG sans étiquettes (cellule, œil, circuit, atome).
Flèches numérotées sans texte.
Tap sur une flèche → input qui apparaît à côté.
Bouton "✓ Vérifier" → vert = bon (animation check), rouge = erreur (animation shake).
Bouton "👁 Mode mémo" → toutes les étiquettes visibles 30s puis cachées.
Score affiché avec compteur animé.

━━ PROFIL ━━
Composant Profil Universel. localStorage 'sk_sci'.

━━ RÈGLES TECHNIQUES ━━
localStorage 'sk_sci'
Expériences en SVG/Canvas — pas d'images statiques
node --check ✅ | mobile 390px | zéro erreur console
```

---

## ══ SESSION 3 ══ Mode Histoire 📜

```
Lis CLAUDE.md et SKILL_DESIGN.md.
Fichier : scolaria.html — ajouter le MODE HISTOIRE.

━━ IDENTITÉ VISUELLE ━━

AMBIANCE : Archives nationales rencontrent une app iOS premium.
Chaud, ancien, mais avec une précision moderne. Comme si The New York Times
avait conçu une app d'histoire pour Gen Z.

Fond : #0d0906 (noir brun, comme du parchemin brûlé)
Couleur dominante : #d97706 (amber-600, or chaud)
Accent : #fbbf24 (amber-400)
Typo display : "Playfair Display" — serif classique, éditoriale
Typo corps : "Lora" — serif lisible, confortable
Typo dates : "JetBrains Mono" 20px, couleur amber — dates imposantes

ÉLÉMENTS VISUELS OBLIGATOIRES :
- Texture noise SVG très subtile en fond (opacity 0.025) :
  ```css
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  ```
- Dates en JetBrains Mono 20px amber avec un subtle glow : text-shadow 0 0 20px rgba(217,119,6,0.4)
- Cards événements avec double bordure :
  border: 1px solid rgba(217,119,6,0.2) + outline: 1px solid rgba(217,119,6,0.06) + outline-offset: 3px
- Couleurs par époque sur la timeline :
  Antiquité #78350f | Moyen-Âge #1e3a5f | Moderne #14532d | XIXe #7c2d12 | XXe #0c4a6e | Contemporain #1e1b4b

ANIMATIONS OBLIGATOIRES :
- Timeline : les nœuds apparaissent avec une animation de "tampon" (scale 0→1 avec bounce)
- Cartes événements : slide-in depuis la gauche au scroll (IntersectionObserver)
- Les dates s'affichent avec un effet de "défilement" (roll) vertical
- Compteur animé sur les scores

━━ NAV BAS ━━
Chronos | Carte | 🏠 (centre, #d97706) | Débat | Profil
Spec nav exacte de la charte. backdrop-filter: blur(20px). Couleur #d97706.

━━ ACCUEIL ━━
Composant Accueil Universel. Stats col 3 : "Dates mémorisées".
Bouton principal : "⏳ Voir la frise" avec glow amber.
localStorage 'sk_hist'.

━━ SECTION CHRONOS ━━

JEU 1 — Frise à reconstituer
5 cartes d'événements affichées en désordre (style post-it sombre).
Drag & drop pour les mettre dans l'ordre chronologique.
Frise horizontale SVG en bas comme zone de dépôt.
Feedback : la ligne de frise se colore de gauche à droite selon la précision.
Score : 100% si ordre parfait, partiel selon les erreurs.

JEU 2 — Avant ou Après ?
Design : deux grands boutons AVANT / APRÈS qui prennent 50% de l'écran chacun.
Un événement central avec sa date s'affiche en grand.
Un second événement apparaît avec son titre mais PAS sa date.
Timer circulaire SVG de 5 secondes qui se vide.
Bonne réponse → flash vert + score + l'événement s'ajoute à une mini-frise perso.
Mauvaise → shake + rouge + révélation de la vraie position.

JEU 3 — Quelle époque ?
Image ou citation s'affiche (sans date).
Slider horizontal = frise temporelle (Antiquité → Aujourd'hui).
Bouton "C'est ma réponse" → mesure l'écart.
Moins de 10 ans : parfait ⭐ | Moins de 50 ans : bien 👍 | Plus : à retravailler

━━ SECTION CARTE ━━
Carte SVG schématique de l'Europe (paths SVG des pays).
Sélecteur de période en haut (boutons pill : 1914, 1918, 1939, 1945, 1947, 1991).
Au changement de période → les frontières se redessinent avec transition CSS (clip-path ou opacity).
Tap pays → bottom sheet :
  Drapeau emoji + Nom en Playfair Display + Régime politique + Rôle dans l'événement.
Bouton "🎯 Quiz cartes" → les noms des pays disparaissent, tu cliques sur le bon.

━━ SECTION DÉBAT ━━
Design : comme un article de journal (padding généreux, serif, colonnes).
Question en Playfair Display 20px au centre.
Deux colonnes POUR / CONTRE avec 3 arguments chacune (vrais arguments historiques).
Tu choisis ta position en tapant sur la colonne.
Les arguments que tu sélectionnes se mettent en surbrillance amber.
Bouton "Voir la position des historiens" → révélation + ce qui est attendu au brevet.
Note : pas de bonne/mauvaise réponse — exercice d'argumentation.

━━ PROFIL ━━
Composant Profil Universel. localStorage 'sk_hist'.

━━ RÈGLES TECHNIQUES ━━
localStorage 'sk_hist'
Carte en SVG animé (pas image statique)
IntersectionObserver pour animations au scroll
node --check ✅ | mobile 390px
```

---

## ══ SESSION 4 ══ Mode Arts 🎨

```
Lis CLAUDE.md et SKILL_DESIGN.md.
Fichier : scolaria.html — ajouter le MODE ARTS.

━━ IDENTITÉ VISUELLE ━━

AMBIANCE : Galerie d'art contemporaine premium. MoMA meets Figma.
Sombre, élégant, avec des moments de couleur explosive.
Les œuvres sont les stars — l'interface s'efface pour les mettre en valeur.

Fond : #0a0008 (noir violacé profond)
Couleur dominante : #ec4899 (pink-500) — MAIS adaptative selon l'œuvre affichée
Typo display : "Cormorant Garamond" — luxueux, culturel, 32px+ sur les noms d'artistes
Typo corps : "Outfit" — moderne, neutre, laisse les œuvres parler
Typo labels : "DM Mono" — pour les dimensions, dates, technique

ÉLÉMENTS VISUELS OBLIGATOIRES :
- Images d'œuvres PLEINE LARGEUR sans padding latéral (edge-to-edge)
- Noms d'artistes en Cormorant Garamond 36px+ avec letter-spacing -1px
- Fond adaptatif : quand une œuvre s'affiche, extraire sa couleur dominante
  et l'appliquer en dégradé très subtil (opacity 0.06) sur le fond du mode
  (utiliser un canvas caché pour l'extraction de couleur)
- Points d'intérêt sur les œuvres : cercles numérotés animés (pulse)
- Palette de couleurs de l'œuvre : 5 cercles de couleur en bas de l'image
- Séparateurs : lignes très fines (0.5px) opacity 0.15

ANIMATIONS OBLIGATOIRES :
- Transition entre œuvres : crossfade 400ms
- Révélation du zoom : clip-rect qui s'ouvre depuis le centre
- Les noms d'artistes entrent avec un slide depuis la gauche
- Palette de couleurs : les cercles tombent un par un (stagger 80ms)

━━ NAV BAS ━━
Galerie | Zoom | 🏠 (centre, #ec4899) | Mouvements | Profil
Spec nav exacte. backdrop-filter: blur(20px). Couleur #ec4899.

━━ ACCUEIL ━━
Composant Accueil Universel. Stats col 3 : "Œuvres analysées".
Bouton principal : "🖼 Ouvrir la galerie" avec glow rose.
localStorage 'sk_arts'.

━━ SECTION GALERIE ━━
Grille masonry (colonnes inégales) — plus original qu'une grille uniforme.
Chaque œuvre : image + titre overlay en bas (Cormorant Garamond) + artiste.

Au clic sur une œuvre → page plein écran :
  Image edge-to-edge en haut (60% de l'écran)
  Scrollable en bas : infos + analyse + interactivité

  FEATURE 1 — Points d'intérêt
  3-5 cercles numérotés qui pulsent sur l'image.
  Tap sur un cercle → bottom sheet avec explication du détail :
    "Cette zone de flou (sfumato) est caractéristique de Léonard de Vinci..."
  
  FEATURE 2 — Palette
  5 couleurs dominantes extraites (canvas getImageData).
  Affichées en cercles colorés avec leur rôle : "rouge = passion/révolution"
  Bouton "🆚 Comparer avec une autre œuvre" → deux palettes côte à côte.
  
  FEATURE 3 — Slider restauration
  Pour certaines œuvres : drag horizontal qui révèle l'original vs restauré.
  Implémentation avec clip-path: inset(0 X% 0 0) animé au touch/mouse.
  Ligne de séparation avec poignée draggable.

━━ SECTION ZOOM ANALYSE ━━
Un crop d'une œuvre s'affiche (zoom x4 sur un détail).
Le zoom se réduit progressivement toutes les 5 secondes.
Bouton "Voir plus" → réduction immédiate de 20% → -100 points.
Input texte pour la réponse.

Puis : Analyse guidée en 4 étapes avec progression visuelle :
  ①DESCRIPTION ②COMPOSITION ③INTERPRÉTATION ④CONTEXTE
  Progress bar horizontale entre les étapes.
  Chaque étape : question + zone de texte + réponse modèle.
  Bouton "📝 Réponse attendue au brevet" → modèle visible.

━━ SECTION MOUVEMENTS ━━
Frise horizontale scrollable (snap) avec une œuvre représentative par mouvement.
Layout : image pleine largeur + overlay avec nom du mouvement + dates + mots-clés.
Swipe horizontal pour naviguer.
Tap → détails : caractéristiques visuelles + artistes + œuvres clés.
Bouton "⚔️ DUEL" → deux œuvres de mouvements différents côte à côte (split screen).
Tu dois identifier lequel est de quel mouvement. Feedback visuel avec explication.

━━ PROFIL ━━
Composant Profil Universel. localStorage 'sk_arts'.

━━ RÈGLES TECHNIQUES ━━
localStorage 'sk_arts'
Images : URLs Wikimedia Commons (domaine public)
Canvas pour extraction de couleur (getImageData)
Slider avec clip-path animé au touch
node --check ✅ | mobile 390px
```

---

## ══ SESSION 5 ══ Mode Arène ⚔️

```
Lis CLAUDE.md et SKILL_DESIGN.md.
Fichier : scolaria.html — ajouter le MODE ARÈNE.

━━ IDENTITÉ VISUELLE ━━

AMBIANCE : Jeu mobile premium. Clash Royale meets Duolingo. Dark gaming.
Chaque interaction doit déclencher une réponse visuelle immédiate et satisfaisante.
L'adrénaline est dans les détails.

Fond : #03000d (noir quasi pur, reflet violet)
Couleur dominante : #7c3aed (violet intense)
Accent victoire : #fbbf24 (or)
Accent danger : #ef4444 (rouge)
Typo display : "Bebas Neue" — impact, sport, gaming pur
Typo corps : "DM Sans"
Typo scores : "JetBrains Mono" 48px+ pour les chiffres

ÉLÉMENTS VISUELS OBLIGATOIRES :
- Fond avec gradient radial violet très subtle au centre (opacity 0.08)
- Boutons avec border qui brille (box-shadow 0 0 0 1px + outer glow)
- Le score principal affiché en Bebas Neue 72px
- Timer circulaire SVG (stroke-dashoffset animé) — pas un rectangle
- Effets de particules au score (confetti ou étoiles via canvas)
- Multiplicateur de combo qui pulse et change de taille (x1=normal, x5=énorme)

ANIMATIONS OBLIGATOIRES :
- Entrée de chaque question : slide depuis le bas 200ms
- Bonne réponse : scale(1.05) + flash vert + "+1" qui monte et disparaît
- Mauvaise réponse : shake horizontal + flash rouge + "-3s" qui monte
- Combo : le multiplicateur grossit avec animation élastique
- Game over : explosion de particules + score final avec compteur
- Record battu : animation dorée spéciale

━━ NAV BAS ━━
Défis | Sprint | ⚔️ (centre, #7c3aed) | Records | Stats
Spec nav exacte. Couleur #7c3aed.

━━ ACCUEIL ━━
Composant Accueil Universel. Stats col 3 : "Records battus".
Bouton principal : "⚔️ Lancer un Sprint" avec glow violet pulsant.
localStorage 'sk_arena'.

━━ MODE SPRINT (cœur du mode) ━━
Layout : plein écran, centré, minimaliste.

1. Écran de démarrage :
   Sélecteur matière (chips : Tout | Maths | Histoire | Sciences | Langues)
   Gros bouton "▶ COMMENCER" avec countdown 3-2-1-GO animé.

2. En jeu :
   Timer circulaire SVG (60 secondes) en haut, Bebas Neue 48px au centre.
   Score en bas à gauche (compteur animé).
   Combo en bas à droite (x1, x2, x3, x5 avec couleurs différentes).
   Question au centre : texte 18px, fond card légèrement différent.
   4 boutons réponse en grille 2x2.
   Bonne réponse → timer accelere de 0.5s, +1 score, +combo.
   Mauvaise réponse → -3 secondes sur timer, reset combo.

3. Game over :
   Score en Bebas Neue 96px avec compteur 0→score.
   Meilleur score avec comparaison.
   Badges si nouveaux records.
   Bouton "🔄 REJOUER" énorme.

━━ MODE COMBO CHAIN ━━
Multiplicateur géant au centre (x1→x2→x3→x5).
Question + 4 réponses en bas.
Erreur → animation de "fracture" sur le multiplicateur puis reset x1.

━━ MODE BOMBE ━━
Visuel : une bombe SVG animée avec mèche qui brûle.
10 secondes max par question, la mèche raccourcit.
3 vies (cœurs en haut). Perdre une vie → animation explosion partielle.
Game over → grosse explosion animée.

━━ DÉFI DU JOUR ━━
Card spéciale avec badge "QUOTIDIEN" + timer jusqu'à minuit.
Exemple : "10 questions d'histoire — zéro erreur".
Compléter → badge spécial doré + XP bonus.

━━ QUESTIONS (minimum 50 par matière) ━━
Hardcodées en JS dans un objet ARENA_QUESTIONS.
Matières : Maths, Histoire, Sciences (SVT+Physique+Chimie), Langues (EN+ES), Géo.
Format : { q: "question", opts: ["A","B","C","D"], a: 0 }

━━ RÈGLES TECHNIQUES ━━
requestAnimationFrame pour le timer circulaire SVG
Canvas pour les particules/confetti
navigator.vibrate([30]) bonne réponse | navigator.vibrate([80,30,80]) erreur
localStorage 'sk_arena'
node --check ✅ | mobile 390px
```

---

## ══ SESSION 6 ══ Mode Enquête 🕵️

```
Lis CLAUDE.md et SKILL_DESIGN.md.
Fichier : scolaria.html — ajouter le MODE ENQUÊTE.

━━ IDENTITÉ VISUELLE ━━

AMBIANCE : Dossier classifié des années 70. Fincher meets iOS.
Chaque interaction doit donner l'impression de découvrir quelque chose.
L'information est révélée progressivement, jamais tout d'un coup.

Fond : #0a0a0a (noir pur)
Couleur dominante : #dc2626 (rouge dossier)
Accent : #d97706 (amber, lampe de bureau)
Typo display : "Special Elite" (Google Fonts) — machine à écrire
Typo corps : "Courier Prime" — style document dactylographié

ÉLÉMENTS VISUELS OBLIGATOIRES :
- Animation "machine à écrire" sur les indices (lettre par lettre, 30ms/lettre)
- Tampons SVG : CONFIDENTIEL (rouge), RÉSOLU (vert), EN COURS (amber), CLASSÉ (gris)
- Cards dossier avec coin plié (CSS triangle en ::after)
- Fond légèrement granuleux (noise SVG opacity 0.02)
- Numéros de dossier en Courier Prime, monospace

━━ NAV BAS ━━
Dossiers | En cours | 🕵️ (centre, #dc2626) | Archives | Stats
Spec nav exacte. Couleur #dc2626.

━━ ACCUEIL ━━
Composant Accueil Universel. Stats col 3 : "Affaires résolues".
Bouton principal : "🕵️ Ouvrir un dossier" avec glow rouge.
localStorage 'sk_enquete'.

━━ TYPES D'AFFAIRES ━━

AFFAIRE HISTORIQUE :
4 indices révélés un par un. Chaque indice s'écrit lettre par lettre.
Score : 1000 → 750 → 500 → 250 selon le nb d'indices utilisés.
Bouton "💡 Indice suivant (-250 pts)" avec le coût affiché.
Input texte + bouton "🔍 Soumettre" pour la réponse.

AFFAIRE SCIENTIFIQUE :
Description d'expérience ou phénomène → identifier la loi/formule/concept.
Même mécanique d'indices.

AFFAIRE ARTISTIQUE :
Image d'une œuvre qui se révèle progressivement (clip-path qui s'agrandit).
Commencer : juste 15% de l'image visible.
Bouton "Voir plus" → +15% visible → -100 points.
Tu dois identifier l'artiste, le mouvement, l'époque.

PROFIL SUSPECT :
Biographie anonymisée en Courier Prime.
"Né en 1889 en Autriche. Refusé aux Beaux-Arts de Vienne..."
4 boutons : 4 personnages historiques possibles.
Mauvais choix → l'indice suivant apparaît automatiquement.

━━ MÉCANIQUE GÉNÉRALE ━━
Score max 1000 par affaire.
Affichage du score qui diminue en temps réel.
Résoudre au 1er indice → bonus x2 (score s'affiche en or avec animation).
Mauvaise réponse → -200 pts + animation rouge.
Bouton "Abandonner" → révèle la réponse, score 0.

━━ ARCHIVES ━━
Toutes les affaires résolues avec leur score et le nb d'indices utilisés.
Filtre par matière. Bouton "Reprendre" pour améliorer son score.

━━ CONTENU (à hardcoder en JS) ━━
15 affaires historiques (programme 3ème)
10 affaires scientifiques
5 affaires artistiques
5 profils suspects (personnages historiques célèbres)

━━ RÈGLES TECHNIQUES ━━
Animation machine à écrire : setTimeout lettre par lettre
Révélation image : clip-path: inset(0 X% 0 0)
localStorage 'sk_enquete'
node --check ✅ | mobile 390px
```

---

## ══ SESSION 7 ══ Mode Oral Brevet 🎙️

```
Lis CLAUDE.md et SKILL_DESIGN.md.
Fichier : scolaria.html — ajouter le MODE ORAL BREVET.

━━ IDENTITÉ VISUELLE ━━

AMBIANCE : Studio d'enregistrement premium. Propre, concentré, professionnel.
Comme GarageBand mais pour réviser. Chaque élément doit inspirer la confiance.

Fond : #0f0f0f (noir neutre)
Couleur dominante : #0ea5e9 (sky-500, bleu calme)
Accent enregistrement : #ef4444 (rouge vif)
Typo display : "DM Sans" 700 — neutre, professionnel
Typo timer : "JetBrains Mono" — précision chronométrique

ÉLÉMENTS VISUELS OBLIGATOIRES :
- Ondes sonores SVG animées (10-20 barres verticales qui bougent avec Web Audio API)
- Indicateur ENREGISTREMENT : cercle rouge pulsant animé (scale 1→1.2, opacity 0.8→1)
- Timer en JetBrains Mono 48px au centre pendant l'enregistrement
- Grille d'évaluation style bulletin scolaire (bordures fines, serif)
- Graphique de progression des sessions (barres SVG animées)

━━ NAV BAS ━━
Sujets | Train. | 🎙️ (centre, #0ea5e9) | Historique | Profil
Spec nav exacte. Couleur #0ea5e9.

━━ ACCUEIL ━━
Composant Accueil Universel. Stats col 3 : "Sessions d'oral".
Bouton principal : "🎙️ Démarrer" avec glow bleu.
localStorage 'sk_oral'.

━━ SECTION SUJETS ━━
3 catégories avec tabs :
  📚 Brevet Français | 🎨 Histoire des Arts | 🎤 Exposé libre

Chaque sujet = card avec :
  Durée attendue (ex: "10 min") + Thème + Conseils en bullet points
  Bouton "Choisir ce sujet"

Sujets disponibles :
  Français : Lecture d'un texte, Présentation œuvre intégrale, Récitation poème
  Histoire Arts : Présentation œuvre (Guernica, La Liberté...), Comparaison 2 œuvres
  Exposé libre : Mon métier rêvé, Un livre/film marquant, L'IA dans notre société

━━ SECTION ENTRAÎNEMENT ━━

ÉTAPE 1 — Préparer (optionnel)
Timer de 30 minutes (peut être désactivé).
Zone de notes avec un fond légèrement différent (style bloc-notes).
Bouton "Je suis prêt →"

ÉTAPE 2 — Enregistrer
Plein écran. Fond sombre. Design minimaliste.
Centre : gros bouton rouge "● COMMENCER" (60px de diamètre minimum).
Pendant l'enregistrement :
  Timer JetBrains Mono 48px qui monte (0:00 → X:XX)
  20 barres d'ondes sonores animées via Web Audio API
  Durée cible affichée en petit sous le timer
  Boutons PAUSE (⏸) et STOP (⏹) en bas
Bouton PAUSE → les ondes se figent, le timer s'arrête.

ÉTAPE 3 — Analyse automatique
Durée : X min X sec (comparaison avec la durée cible)
Rythme : calculé depuis durée/contenu → Trop rapide / Bon rythme / Trop lent
Conseils contextuels selon l'analyse.
Tout affiché avec stagger reveal.

ÉTAPE 4 — Auto-évaluation
Grille brevet style tableau :
  4 critères avec case ✅ / ❌ cliquable :
  Introduction claire | Exemples donnés | Conclusion | Rythme correct
Score /20 calculé automatiquement.
Bouton "💾 Sauvegarder cette session"

━━ BOUTONS SPÉCIAUX ━━
"🎲 Sujet surprise" → tirage aléatoire + lancement immédiat
"⏱ Mode chrono strict" → le micro se coupe automatiquement à la fin du temps imparti
"📋 Grille officielle" → bottom sheet avec critères officiels du brevet
"🔄 Recommencer" → même sujet, compare les deux sessions côte à côte

━━ SECTION HISTORIQUE ━━
Liste des sessions avec durée, score auto-évaluation, date.
Mini graphique SVG de progression (barres animées au chargement).
Bouton "📊 Mes points faibles" → analyse des critères souvent en ❌.

━━ RÈGLES TECHNIQUES ━━
Web Audio API (AudioContext, AnalyserNode) pour les ondes
navigator.mediaDevices.getUserMedia pour l'enregistrement
Fallback si API non dispo : mode simulation avec timer + évaluation manuelle
localStorage 'sk_oral'
node --check ✅ | mobile 390px
```

---

## ══ SESSION 8 ══ Mode Mind Map 🧠

```
Lis CLAUDE.md et SKILL_DESIGN.md.
Fichier : scolaria.html — ajouter le MODE MIND MAP.

━━ IDENTITÉ VISUELLE ━━

AMBIANCE : Miro meets Apple Freeform. Infini, organique, fluide.
Le canvas est un espace de liberté. Les connexions révèlent la structure de la pensée.

Fond canvas : #030710 (noir bleu profond)
Couleur centrale : blanc pur
Couleur notion : adaptatif selon matière
Couleur exemple : rgba(blanc, 0.5) — discret
Couleur date : #f59e0b (amber)
Typo nœuds : "Nunito" — très lisible à petite taille
Fond UI (hors canvas) : #030710

ÉLÉMENTS VISUELS OBLIGATOIRES :
- Fond canvas avec grille de points (dots) :
  background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)
  background-size: 24px 24px
- Connexions entre nœuds : courbes de Bézier SVG (pas des lignes droites)
  stroke: rgba(couleur du parent, 0.4), stroke-width: 2, fill: none
- Animation à la création d'un nœud : scale 0→1 avec spring (cubic-bezier élastique)
- Animation à la création d'une connexion : pathLength 0→1 (stroke-dasharray/dashoffset)
- Nœud sélectionné : box-shadow coloré + léger scale(1.05)

━━ NAV BAS ━━
Mes cartes | Créer | 🧠 (centre, #6366f1) | Templates | Profil
Spec nav exacte. Couleur #6366f1.

━━ ACCUEIL ━━
Composant Accueil Universel. Stats col 3 : "Cartes créées".
Bouton principal : "🧠 Voir mes cartes" avec glow indigo.
localStorage 'sk_mindmap'.

━━ CANVAS INTERACTIF ━━
SVG ou Canvas HTML5 (SVG recommandé pour les interactions).
Viewport infini avec transform translate + scale.

Types de nœuds (styles différents) :
  Concept central : cercle 80px, fond blanc, texte noir, Nunito 700 14px
  Notion : cercle 60px, fond couleur matière opacity 0.2, bordure couleur matière
  Exemple : rect arrondi 16px, fond rgba(255,255,255,0.06), bordure fine
  Date : rect 12px, fond rgba(245,158,11,0.15), bordure amber

Interactions tactiles :
  Tap → sélectionner (outline + poignées)
  Double tap → éditer le texte (input inline)
  Tap long (500ms) → menu contextuel (Couleur / Ajouter enfant / Supprimer)
  Pinch → zoom (min 0.3x, max 3x)
  Drag nœud → déplacer (les connexions suivent)
  Drag fond → pan du canvas

━━ GÉNÉRATION AUTOMATIQUE ━━
Bouton "✨ Générer" → liste de chapitres 3ème.
Au choix d'un chapitre → l'app construit la mind map :
  Nœud central : titre du chapitre
  5-8 branches principales (notion centrale)
  2-3 sous-branches par branche (détails/exemples)
Layout en étoile autour du centre (algorithme radial).

Chapitres disponibles (hardcodés) :
  Histoire : La WW1, La WW2, Guerre froide, Ve République
  Sciences : Génétique, Électricité, Loi d'Ohm, Réactions chimiques
  Français : Mouvements littéraires, Figures de style
  Maths : Fonctions affines, Probabilités

━━ MODE RÉVISION ━━
Bouton "🔄 Mode révision" → cache tous les textes (nœuds vides avec ?).
Tap sur un nœud vide → input s'ouvre.
Tu tapes ta réponse → ✅ vert (bon) ou ❌ rouge (montré en rouge 1 seconde puis texte révélé).
Score final avec compteur animé.

━━ EXPORT ━━
Bouton "📸 Exporter" → screenshot du canvas actuel (html2canvas ou canvas natif → PNG).

━━ MES CARTES ━━
Liste des cartes sauvegardées avec miniature (snapshot SVG).
Tap → ouvre la carte.
Tap long → supprimer (confirmation).

━━ RÈGLES TECHNIQUES ━━
SVG pour le rendu des nœuds et connexions
Positions sauvegardées en localStorage 'sk_mindmap'
Courbes Bézier pour les connexions (path SVG)
Support multi-touch pour pinch/zoom
node --check ✅ | mobile 390px
```

---

## ══ SESSION 9 ══ Mode Langues — améliorations

```
Lis CLAUDE.md et SKILL_DESIGN.md.
Fichier : scolaria.html — améliorer le Mode Langues.

━━ VÉRIFICATIONS D'ABORD ━━
1. La nav du mode Langues utilise exactement la même spec que ScolarIA.
2. Le bouton central est entièrement dans la nav (pas de débordement).
3. L'accueil utilise le composant Accueil Universel.

━━ NOUVELLES FONCTIONNALITÉS ━━

MODE CONVERSATION
Personnage fictif avec avatar (Emma 🇬🇧 pour l'anglais, Marco 🇪🇸 pour l'espagnol).
Design : style iMessage/WhatsApp sombre.
Bulles de messages : les siennes à droite (couleur du mode), les tiennes à gauche.
Il t'écrit un message dans la langue cible.
Tu as 3 réponses possibles (dont une avec erreur volontaire).
Si tu choisis la mauvaise → il répond "Hmm, je ne comprends pas 🤔" et reformule.
Si tu choisis la bonne → il continue la conversation.
Scénarios (4 minimum) : Se présenter | Restaurant | Demander son chemin | Loisirs.
Bouton "💬 Nouveau scénario" | Bouton "🌍 Mode immersion" (interface en anglais/espagnol).

MODE PHONÉTIQUE
Design : oscilloscope sombre, ondes visuelles.
Mots affichés avec transcription phonétique en dessous (ex: "enough /ɪˈnʌf/").
Bouton "🔊 Écouter" → window.speechSynthesis (voix native).
Les ondes s'animent pendant la lecture (Web Audio API).
Bouton "🎤 Répéter" → enregistrement + comparaison visuelle des deux formes d'ondes.
Feedback basé sur la durée relative : Trop rapide / Trop lent / Bien rythmé.
Exercice minimal pairs : "ship vs sheep", "cama vs kama", "pero vs perro".

━━ PROFIL ━━
Mettre à jour avec le Composant Profil Universel. localStorage 'sk_lang'.

━━ RÈGLES TECHNIQUES ━━
window.speechSynthesis pour la synthèse vocale
navigator.mediaDevices.getUserMedia pour l'enregistrement
Web Audio API pour les ondes visuelles
Fallback propre si APIs non disponibles
node --check ✅ | mobile 390px
```

---

## ══ SESSION 10 ══ Intégration finale + Polish startup

```
Lis CLAUDE.md et SKILL_DESIGN.md.
Fichier : scolaria.html

━━ INTÉGRATION ━━

1. Sidebar ScolarIA — ajouter tous les modes
   Section "Mes modes" avec 8 tuiles colorées :
   🌍 Langues #0ea5e9 | 🔬 Sciences #10b981 | 📜 Histoire #d97706 | 🎨 Arts #ec4899
   ⚔️ Arène #7c3aed | 🕵️ Enquête #dc2626 | 🎙️ Oral #0ea5e9 | 🧠 Mind Map #6366f1

2. Dashboard ScolarIA — section "Mes modes"
   Grid 2 colonnes, 8 tuiles avec :
   Icône + Nom + Dernier XP (depuis localStorage) + Barre de progression mini
   Si XP = 0 : badge "Nouveau" amber

━━ POLISH DESIGN STARTUP ━━

3. Typographie finale
   Vérifier que CHAQUE mode charge vraiment ses Google Fonts spéciales.
   Letter-spacing -0.5px sur TOUS les titres display.
   Labels UPPERCASE + letter-spacing 1.5px sur TOUS les modes.

4. Stagger reveal
   Implémenter sur TOUS les modes : les cards entrent avec animation-delay échelonné.
   Délai : +60ms par card (card 1 = 0ms, card 2 = 60ms, card 3 = 120ms...).

5. Backdrop blur sur les navs
   Tous les ::before de nav doivent avoir backdrop-filter: blur(20px).
   Ça donne un effet "verre dépoli" premium sur le contenu qui passe dessous.

6. Micro-interactions
   navigator.vibrate([40]) sur chaque bonne réponse dans tous les modes.
   navigator.vibrate([40,30,40]) sur chaque erreur.
   scale(0.96) au tap sur TOUTES les cards cliquables.
   Transition color 0.2s sur tous les boutons nav au changement d'onglet.

7. Empty states
   Si aucune activité dans un mode : illustration SVG simple + texte + bouton démarrer.
   Ne jamais laisser une section vide sans message.

8. Vérification nav TOUS les modes
   Chaque mode : bouton central entièrement dans la nav (pas de débordement hors parent).
   z-index:99999 sur le bouton central.
   overflow:visible sur la nav.

━━ VÉRIFICATIONS FINALES ━━
node --check scolaria.html → ✅
Zéro erreur console dans Chrome
Chaque mode ouvert et testé sur mobile 390px
Rapport : liste de ce qui est fait dans chaque mode
```

---

## RÈGLE D'OR

```
Si un bug résiste après 2 tentatives :
"Reviens exactement à la version d'avant cette modification.
Essaie une approche complètement différente."
```
