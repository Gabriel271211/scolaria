# SKILL — DESIGN SCOLARIA (Anti-IA Slop)

## Règle fondamentale
Chaque mode de ScolarIA a sa propre **identité visuelle forte**. Un élève qui ouvre l'app doit sentir la différence entre les modes en moins de 0,5 seconde. Jamais de copier-coller de styles entre modes.

---

## Ce qui fait une interface qui PUE l'IA (à bannir absolument)

- Fond blanc ou gris neutre avec du texte noir
- Cards identiques partout, même border-radius, même padding
- Dégradés violet→rose sur fond blanc (le classique "fait avec Claude")
- Titres en Inter ou Space Grotesk partout
- Boutons arrondis génériques avec `border-radius: 9999px` sur tout
- Icônes SVG génériques identiques pour tout
- Ombres douces uniformes `box-shadow: 0 4px 6px rgba(0,0,0,.1)` partout
- Animations de fade-in identiques sur chaque élément
- Couleurs pastel insipides, jamais de couleurs qui claquent
- Hiérarchie typographique plate (tout le monde est medium/semibold)

---

## Identité visuelle par mode

### 🌍 Mode Langues
**Vibe** : Application mobile premium, Duolingo mais plus sombre et plus adulte
**Couleur dominante** : `#0ea5e9` (sky-500), bleu vif électrique
**Fond** : `#020b14` (quasi-noir bleuté, pas noir pur)
**Accent** : `#f59e0b` (amber) pour les XP et récompenses
**Typo principale** : Syne (display, headings) — géométrique, modern
**Typo corps** : Space Grotesk — dense, technique
**Typo chiffres** : JetBrains Mono — monospace pour XP/scores
**Signature visuelle** :
- Nœuds circulaires du parcours avec animation `pulse` 2s
- Barre XP ultra-fine (3px) sous le header
- Cards de cours avec bande de couleur à gauche selon le niveau
- Résultats avec emoji géant (64px) centré
- Lignes zigzag SVG entre les nœuds du parcours

### 🔬 Mode Sciences
**Vibe** : Laboratoire, données scientifiques, clean mais pas froid
**Couleur dominante** : `#10b981` (emerald-500), vert science
**Fond** : `#020f0a` (noir verdâtre)
**Accent** : `#34d399` (emerald-400) pour les formules
**Typo principale** : `IBM Plex Serif` — sérieux, scientifique
**Typo corps** : `IBM Plex Sans`
**Typo formules** : `IBM Plex Mono`
**Signature visuelle** :
- Grille de points subtile en fond (pattern SVG)
- Tableaux périodiques stylisés pour la chimie
- Graphiques et schémas avec lignes fines
- Formules dans des encadrés style LaTeX minimaliste
- Couleurs par matière : vert=SVT, bleu=Physique, orange=Chimie

### 📜 Mode Histoire-Géo
**Vibe** : Parchemin moderne, archives, timeline épique
**Couleur dominante** : `#d97706` (amber-600), or/sépia chaud
**Fond** : `#0d0906` (noir brun, comme du papier brûlé)
**Accent** : `#fbbf24` (amber-400)
**Typo principale** : `Playfair Display` — serifs élégants, histoire
**Typo corps** : `Lora` — serif lisible
**Signature visuelle** :
- Timeline verticale avec points connectés
- Texture de papier très subtile en fond (noise SVG)
- Bordures décoratives fines autour des cartes événements
- Dates en grand format monospace, années en DISPLAY
- Cartes géo avec dégradé de chaleur
- Citations historiques avec guillemets stylisés géants

### 🎨 Mode Arts
**Vibe** : Galerie moderne, exhibition, expressif
**Couleur dominante** : `#ec4899` (pink-500), mais variable selon l'œuvre
**Fond** : `#0a0008` (noir violacé)
**Accent** : thème adaptatif selon le sujet étudié
**Typo principale** : `Cormorant Garamond` — élégant, cultuel
**Typo corps** : `Outfit`
**Signature visuelle** :
- Plein écran pour les images d'œuvres
- Transition entre œuvres avec effet de révélation
- Palette de couleurs extraite de l'œuvre étudiée
- Typography oversized pour les noms d'artistes
- Fond qui change selon l'époque (impressionnisme = pastels doux, etc.)

---

## Règles de design partagées (mais adaptées par mode)

### Spacing
- Utiliser 8px comme unité de base
- Padding intérieur cards : `16px` mobile, jamais moins de `12px`
- Gaps entre éléments : `8px`, `12px`, `16px`, `24px`, `32px`
- Respirer : toujours plus d'espace qu'on pense en avoir besoin

### Typographie
- Hiérarchie à 3 niveaux MINIMUM : display (bold) → body → meta (muted)
- Display : font-family spéciale du mode, font-weight 800
- Body : font-size 13-14px sur mobile
- Meta : 9-11px, color: var(--mu), uppercase + letter-spacing pour les labels
- NE JAMAIS utiliser la même font sur tout un projet

### Couleurs
- Toujours 1 couleur dominante + 1 accent + fond sombre + texte clair
- Variable CSS `--a1` pour la couleur principale du mode
- Opacités : `.08`, `.12`, `.15`, `.2` pour les backgrounds de hover
- Bordures : `rgba(couleur, .2)` pas `#cccccc`
- Jamais de gris neutres #888 — toujours teinté par la couleur du mode

### Animations
- Entrée de page : `opacity 0→1 + translateY(8px→0)` en 300ms
- Hover sur cards : `transform: scale(.97)` ou `translateY(-2px)`
- Bouton principal : `box-shadow` qui s'intensifie au hover
- Transitions : `all .2s` ou `all .22s` max — jamais `all .5s` sur tout
- L'animation principale (parcours pulse, etc.) max 1 par page

### Mobile first
- `max-width: 480px` centré
- `height: 100dvh` (pas vh — évite le bug iOS barre d'adresse)
- `env(safe-area-inset-*)` pour les notches
- Touch targets minimum 44px
- Pas de hover-only interactions — tout doit marcher au tap
- `-webkit-tap-highlight-color: transparent` sur tout

---

## Checklist avant de livrer une interface

- [ ] Ouvre-t-on le fichier sur mobile et c'est beau en moins d'1 seconde ?
- [ ] Les polices sont-elles chargées depuis Google Fonts ?
- [ ] La couleur dominante est-elle différente des autres modes ?
- [ ] Y a-t-il AU MOINS une animation/micro-interaction unique à ce mode ?
- [ ] Les cards ont-elles une vraie hiérarchie visuelle (pas tout au même niveau) ?
- [ ] Le fond est-il différent du fond générique `#020b14` des Langues ?
- [ ] Les boutons principaux ont-ils un `box-shadow` coloré (pas neutre) ?
- [ ] Peut-on distinguer ce mode d'une app IA générique au premier coup d'œil ?
