/* ScolarIA — js/niveau.js
   Niveau scolaire (6ème → Terminale) et programmes officiels 2026-2027
   (NIVEAUX, PROG_MATIERES…) : à mettre à jour aux rentrées 2027 et 2028.
   Chargé par scolaria-home-v2.html, dans l'ordre des <script> (une ligne exécutée au chargement
   ne peut utiliser que les fonctions des fichiers chargés AVANT celui-ci). */

/* ══ NIVEAU SCOLAIRE ══
   La classe choisie par l'eleve (onboarding / profil) personnalise TOUTES
   les reponses IA : programme officiel, facon de parler, examen vise.
   _withNiveau() l'ajoute automatiquement au prompt systeme de chaque appel. */
var NIVEAUX = {
  '6ème': {
    cycle: 'collège', examen: 'contrôle',
    ton: 'Parle très simplement, phrases courtes, exemples de la vie de tous les jours. Explique chaque mot nouveau. Ton chaleureux et encourageant.',
    prog: 'Maths : nombres entiers et décimaux, fractions simples, les 4 opérations, proportionnalité (débuts), périmètres et aires, angles, symétrie axiale. Français : contes, mythes, récits d\'aventure, nature et fonction des mots (bases), présent/passé simple/imparfait. Histoire-Géo : Préhistoire, premiers États et écritures, Grèce et Rome antiques, débuts du judaïsme et du christianisme ; habiter une ville, un espace de faible densité, le littoral. Sciences et technologie (matière unique : vivant, matière, énergie, objets techniques). Anglais niveau A1.'
  },
  '5ème': {
    cycle: 'collège', examen: 'contrôle',
    ton: 'Parle simplement et clairement, avec des exemples concrets. Introduis le vocabulaire précis de chaque matière en l\'expliquant.',
    prog: 'Maths : nombres relatifs, priorités de calcul, fractions (comparer, additionner), calcul littéral (débuts), proportionnalité, triangles et parallélogrammes, symétrie centrale, statistiques simples. Français (nouveau programme 2026) : destins romanesques de héros et d\'héroïnes, poésie du voyage, théâtre et comédie, récits pour plaire et instruire ; grammaire et dictée chaque semaine. Histoire-Géo : chrétientés et islam (VIe-XIIIe s.), société féodale, Renaissance, Grandes découvertes, Réformes ; croissance démographique, ressources, changement climatique. SVT, Physique-Chimie et Technologie séparées. Début de la LV2.'
  },
  '4ème': {
    cycle: 'collège', examen: 'contrôle',
    ton: 'Parle clairement avec le vocabulaire exact de la matière (défini au besoin). Donne des méthodes pas à pas.',
    prog: 'Maths : puissances, calcul littéral (développer, factoriser), équations du 1er degré, théorème de Pythagore, proportionnalité dans le triangle, translations, probabilités (débuts). Français : nouvelles réalistes, lettres, théâtre, poésie. Histoire-Géo : Lumières, Révolution française et Empire, révolution industrielle, colonisation, IIIe République ; urbanisation, mobilités, mondialisation. Physique-Chimie : atomes et molécules, circuits électriques, vitesse. SVT : reproduction, système nerveux, géologie.'
  },
  '3ème': {
    cycle: 'collège', examen: 'brevet',
    ton: 'Parle clairement avec le vocabulaire précis attendu au brevet. Donne des méthodes et signale les pièges classiques du brevet.',
    prog: 'Maths : théorème de Thalès, trigonométrie, fonctions linéaires et affines, équations et inéquations, arithmétique, probabilités, statistiques, géométrie dans l\'espace. Français : se raconter, dénoncer les travers de la société, argumentation, réécriture, dictée. Histoire-Géo-EMC : guerres mondiales, régimes totalitaires, guerre froide, décolonisation, Ve République ; aires urbaines, territoires français, Union européenne. Physique-Chimie : ions et pH, transformations chimiques, énergie et puissance, gravitation, signaux. SVT : génétique, évolution, immunité. Examen : le Diplôme National du Brevet (DNB).'
  },
  '2nde': {
    cycle: 'lycée', examen: 'contrôle',
    ton: 'Ton plus mature, vocabulaire disciplinaire précis, raisonnement rigoureux et justifié. Fais le lien avec ce qui a été vu au collège.',
    prog: 'Tronc commun du lycée général et technologique. Maths : fonctions de référence, variations, vecteurs, équations de droites, statistiques, probabilités, algorithmique en Python. Français : genres littéraires, initiation au commentaire et à la dissertation. Histoire-Géo : Méditerranée antique et médiévale, Renaissance, Lumières, Révolution ; sociétés face aux risques, développement durable. Physique-Chimie : la mole, solutions, mouvements et forces, ondes. SVT, SES, SNT. Choix des spécialités pour la 1ère.'
  },
  '1ère': {
    cycle: 'lycée', examen: 'bac',
    ton: 'Ton de lycéen, vocabulaire disciplinaire exact, rigueur de rédaction attendue au bac (démonstrations rédigées, argumentation structurée).',
    prog: 'Trois spécialités (ex. maths, physique-chimie, SVT, SES, HGGSP, HLP, NSI, LLCER…). Maths spécialité : second degré, suites, dérivation, exponentielle, trigonométrie, produit scalaire, probabilités conditionnelles. Français : épreuves anticipées du bac (écrit : commentaire ou dissertation sur les œuvres au programme ; oral : explication de texte et entretien). Épreuve anticipée de mathématiques en fin de 1ère. Histoire-Géo, enseignement scientifique, langues en tronc commun.'
  },
  'Terminale': {
    cycle: 'lycée', examen: 'bac',
    ton: 'Ton de lycéen de Terminale, exigence du bac : rigueur, vocabulaire précis, méthode d\'épreuve (dissertation, commentaire, démonstration, étude de documents).',
    prog: 'Deux spécialités (épreuves écrites du bac) + philosophie + Grand oral. Maths spécialité : limites, continuité, logarithme, intégration, suites, loi binomiale, géométrie dans l\'espace. Philosophie : notions (conscience, liberté, vérité, justice, bonheur, travail, État…), dissertation et explication de texte. Histoire-Géo, enseignement scientifique, langues, EMC en tronc commun. Préparation Parcoursup.'
  }
};

/* ══ PROGRAMMES OFFICIELS DE MATHS — ANNÉE 2026-2027 ══
   Envoyes a l'IA seulement quand le sujet est mathematique (detectMat).
   Sources (verifiees en octobre 2026) :
   - 6e : programme de cycle 3 (2025), applique en 6e depuis la rentree 2025
   - 5e : nouveau programme de cycle 4, arrete du 18/02/2026 (BO n°10 du 5 mars 2026), en 5e depuis la rentree 2026
   - 4e et 3e : ANCIEN programme de cycle 4 + reperes de progression 2019 (le nouveau arrive en 4e en 2027, en 3e en 2028)
   - 2nde et 1ere : nouveaux programmes (BO du 2 avril 2026), depuis la rentree 2026
   - Terminale : programme 2020 (le nouveau arrive a la rentree 2027)
   A METTRE A JOUR a la rentree 2027 (4e, Terminale) et 2028 (3e). */
var PROG_MATHS = {
  '6ème': {
    prog: 'nombres entiers et décimaux (écriture, comparaison, encadrement, droite graduée) ; fractions (fraction d\'une quantité, comparaison, encadrement, addition et soustraction, multiplication par un entier) ; les 4 opérations (mental, posé, en ligne) ; pré-algèbre avec schémas en barres, balances et suites de motifs ; proportionnalité (retour à l\'unité, linéarité, tableaux) et pourcentages simples ; angles (vocabulaire, mesure, somme des angles d\'un triangle, bissectrice), médiatrice, cercle circonscrit, symétrie axiale, triangles particuliers ; longueurs, périmètres (dont le cercle avec π), aires du carré et du rectangle, durées, masses, contenances ; lecture et production de tableaux et graphiques ; probabilité = nombre entre 0 et 1 (cas simples) ; séquences d\'instructions et boucles',
    pas: 'nombres négatifs, puissances, racine carrée, calcul littéral avec des lettres, équations, coefficient de proportionnalité, formules d\'aire du triangle et du disque, volumes par formule, parallélogrammes, symboles ℕ ℤ ℚ ℝ'
  },
  '5ème': {
    prog: 'nombres relatifs (sens, comparaison, droite graduée, addition, soustraction), distance à zéro / valeur absolue ; fractions et nombres rationnels (une fraction est le quotient de deux entiers ; égalité, comparaison, addition) ; carré et cube d\'un nombre ; priorités opératoires ; premiers pas en calcul littéral (expressions, substitution) ; angles alternes-internes et correspondants (parallélisme) ; triangles (inégalité triangulaire, somme des angles, droites remarquables, aire du triangle) ; demi-tour (symétrie centrale) ; parallélogrammes (définition, propriétés, propriétés caractéristiques, aire) ; solides (pavé, cube, prisme droit, cylindre) et leurs volumes, aire du disque ; proportionnalité (linéarité, retour à l\'unité, coefficient, vitesse moyenne, échelle, prix unitaire ; points alignés avec l\'origine), pourcentages ; « en fonction de », tableaux de valeurs, lecture de graphiques ; effectifs, fréquences, moyenne simple ; probabilités (expérience aléatoire, issue, évènement, équiprobabilité) ; programmation par blocs (boucles)',
    pas: 'produit et quotient de relatifs (surtout en 4ème), racine carrée et Pythagore (4ème), puissances de 10 et notation scientifique, équations formelles, Thalès et trigonométrie (3ème), fonctions linéaires et affines (3ème), symboles ℕ ℤ ℚ ℝ (2nde)'
  },
  '4ème': {
    prog: 'nombres relatifs (les 4 opérations) ; fractions (les 4 opérations, inverse) ; puissances (exposants entiers positifs et négatifs, puissances de 10, notation scientifique) ; nombres premiers et décomposition en facteurs premiers ; racine carrée (avec Pythagore) ; calcul littéral (développer, factoriser, double distributivité) ; équations du premier degré ; théorème de Pythagore et sa réciproque ; cosinus d\'un angle aigu dans le triangle rectangle ; Thalès dans la configuration des triangles emboîtés ; translations et rotations ; pyramide et cône (volumes) ; proportionnalité ; moyenne pondérée, médiane, étendue ; probabilités ; programmation par blocs (variables, conditions)',
    pas: 'sinus et tangente (3ème), configuration papillon de Thalès (3ème), homothéties (3ème), notion de fonction et fonctions linéaires/affines (3ème), inéquations, identités remarquables, vecteurs, symboles ℕ ℤ ℚ ℝ (2nde)'
  },
  '3ème': {
    prog: 'arithmétique (multiples, diviseurs, nombres premiers, décomposition en facteurs premiers, fraction irréductible) ; puissances et notation scientifique ; racine carrée ; calcul littéral (développer, factoriser, (a−b)(a+b) = a² − b²) ; équations, équation produit nul, inéquations du premier degré ; notion de fonction (image, antécédent, notation f(x)) ; fonctions linéaires et affines (représentation graphique, coefficients) ; proportionnalité et pourcentages ; théorème de Thalès et sa réciproque (triangles emboîtés et papillon) ; trigonométrie (cosinus, sinus, tangente) ; homothéties et transformations ; sphère et boule, sections de solides, repérage sur la sphère (latitude, longitude) ; médiane, étendue, moyenne ; probabilités ; algorithmique par blocs. Examen : le brevet (DNB)',
    pas: 'symboles ℕ ℤ 𝔻 ℚ ℝ et ∈ ⊂, intervalles, vecteurs, identités (a+b)² et (a−b)² comme attendu, fonctions carré/inverse et tableaux de signes (2nde), second degré avec discriminant, dérivée (1ère)'
  },
  '2nde': {
    prog: 'vocabulaire ensembliste et logique ; nombres réels : ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ, intervalles, valeur absolue (intervalle de centre a), inéquations avec solutions en intervalles ; arithmétique (multiples, diviseurs, nombres premiers) ; algèbre : identités remarquables, équations et inéquations en lien avec les fonctions, comparaison par différence ou par rapport ; vecteurs (somme, relation de Chasles, colinéarité, coordonnées, milieu, distance) et droites du plan (équations, intersection) ; fonctions : ensemble de définition, fonctions de référence (affines, valeur absolue, carré, inverse, racine carrée, cube), parité, variations et extremums, tableaux de signes d\'un produit ou d\'un quotient ; information chiffrée et évolutions (coefficient multiplicateur, taux d\'évolution), moyenne, médiane, écart-type, boîtes à moustaches, croisement de deux variables qualitatives (fréquences conditionnelles et marginales) ; probabilités conditionnelles et arbres ; Python (variables, fonctions)',
    pas: 'trigonométrie et projeté orthogonal (retirés du programme de 2nde), discriminant du second degré, dérivée, suites, exponentielle, produit scalaire (1ère), nombres complexes ℂ (Terminale)'
  },
  '1ère': {
    prog: 'SPÉCIALITÉ : suites (arithmétiques, géométriques, comportement), second degré (forme canonique, discriminant, factorisation, parabole), dérivation (nombre dérivé, tangente, fonctions dérivées, dérivée de x↦g(ax+b), approximation affine), variations, fonction exponentielle (lien avec les suites géométriques, dérivée de t↦e^(at)), fonctions cosinus et sinus (cercle trigonométrique, parité, périodicité), produit scalaire et géométrie repérée, probabilités conditionnelles et indépendance, variables aléatoires (espérance, variance, formule de König-Huygens), Python (listes). SANS LA SPÉCIALITÉ : mathématiques intégrées à l\'enseignement scientifique (information chiffrée, deux variables quantitatives, variation linéaire, modélisation quadratique, exponentielles de base a, répétition d\'épreuves de Bernoulli n ≤ 4). Épreuve anticipée de mathématiques en fin de 1ère (automatismes)',
    pas: 'limites de fonctions, continuité, logarithme, primitives et intégrales, loi binomiale générale, nombres complexes (Terminale)'
  },
  'Terminale': {
    prog: 'SPÉCIALITÉ : suites (récurrence, limites), limites et continuité des fonctions, dérivation (composée, convexité), logarithme népérien, primitives et équations différentielles, calcul intégral, fonctions trigonométriques, dénombrement et combinatoire, loi binomiale, sommes de variables aléatoires, inégalité de Bienaymé-Tchebychev, loi des grands nombres, géométrie dans l\'espace (vecteurs, droites et plans, produit scalaire, représentations paramétriques). MATHS EXPERTES : nombres complexes, arithmétique (congruences, PGCD, Bézout, Gauss), graphes et matrices. MATHS COMPLÉMENTAIRES : modèles discrets et continus, fonctions, probabilités',
    pas: ''
  }
};

/* ══ PROGRAMMES DES AUTRES MATIÈRES — ANNÉE 2026-2027 ══
   Seuls le francais, les maths et les langues changent en 2026 au college (5e en 2026,
   4e en 2027, 3e en 2028 ; francais 6e depuis 2025). Histoire-geo, SVT et physique-chimie
   gardent les programmes de 2015/2020 (college) et 2019/2020 (lycee).
   En physique-chimie et SVT au college, le programme est fixe sur le CYCLE 4 (5e-4e-3e) :
   l'ordre depend du professeur (reperes de progression 2019 indicatifs). */
var C4_NOTE = 'En physique-chimie et SVT au collège, le programme est fixé sur les 3 années du cycle 4 (5ème-4ème-3ème) et l\'ordre dépend du professeur : toute notion du cycle 4 est permise, adapte seulement la difficulté.';
var C4_PC = 'PROGRAMME DU CYCLE 4 : matière (états et changements d\'état, conservation de la masse, mélanges et corps purs, solubilité, masse volumique, atomes et molécules, tableau périodique, transformations chimiques et équations de réaction, combustions, ions, noyau atomique ; pH mesuré au papier pH ou au pH-mètre sur une échelle de 0 à 14 : solution acide = plus d\'ions hydrogène H⁺, solution basique = plus d\'ions hydroxyde HO⁻ — au collège on écrit H⁺, JAMAIS H₃O⁺, et il n\'y a aucune formule de calcul du pH) ; mouvements et interactions (trajectoire, vitesse v = d/t, forces et leur représentation, poids P = m × g, gravitation) ; énergie (sources, formes, conversions, conservation, énergie cinétique Ec = ½mv², énergie potentielle, puissance et énergie électriques P = U × I, E = P × t) ; électricité (circuits série et dérivation, tension, intensité, lois des circuits, loi d\'Ohm U = R × I) ; signaux (propagation de la lumière, année-lumière, son et sa vitesse, fréquence, signal et information) ; Terre, système solaire, Univers. REPÈRES INDICATIFS : 5ème = états de la matière, mélanges, circuits simples, propagation de la lumière et du son ; 4ème = masse volumique, atomes et molécules, transformations chimiques, vitesse, tension et intensité ; 3ème = ions et pH, énergie cinétique et potentielle, puissance électrique, gravitation et poids (loi d\'Ohm en 4ème ou 3ème)';
var C4_SVT = 'PROGRAMME DU CYCLE 4 : la planète Terre (système solaire, structure de la Terre, tectonique des plaques, séismes, volcans, météo et climat, risques naturels, ressources, écosystèmes et action humaine) ; le vivant et son évolution (cellule, nutrition des plantes et photosynthèse, reproduction sexuée et asexuée, biodiversité, classification par parenté, ADN, chromosomes, gènes et allèles, hérédité, évolution et sélection naturelle) ; le corps humain et la santé (digestion, respiration, circulation, effort physique, système nerveux, alimentation, puberté, reproduction humaine et contraception, micro-organismes, système immunitaire, vaccination, antibiotiques). REPÈRES INDICATIFS : la génétique, l\'évolution et l\'immunité sont souvent en 3ème';
var C4_PC_PAS = 'formule pH = −log[H₃O⁺], ion oxonium H₃O⁺, concentrations molaires, logarithme (au collège le pH se MESURE et se lit sur une échelle de 0 à 14 : acide < 7 < basique, lié aux ions H⁺ et HO⁻) ; la mole et la quantité de matière, vecteurs force et vitesse, lois de Newton, schémas de Lewis (lycée)';
var C3_SCI = 'SCIENCES ET TECHNOLOGIE (une seule matière en 6ème, programme de cycle 3) : matière (états, mélanges, propriétés, la masse), mouvements (trajectoire, vitesse), énergie (sources, formes, conversions, énergies renouvelables), signaux et information ; le vivant (classification, cellule, nutrition, besoins des plantes, reproduction, développement, rôle des micro-organismes) ; matériaux et objets techniques ; la Terre (système solaire, alternance jour-nuit, saisons, milieux et écosystèmes)';
var PROG_MATIERES = {
  'Maths': PROG_MATHS,
  'Physique-Chimie': {
    '6ème': { prog: C3_SCI, pas: 'atomes, molécules, ions, pH, équations de réaction, formules (v = d/t, P = m × g, loi d\'Ohm), tension et intensité mesurées' },
    '5ème': { prog: C4_PC, note: C4_NOTE, pas: C4_PC_PAS },
    '4ème': { prog: C4_PC, note: C4_NOTE, pas: C4_PC_PAS },
    '3ème': { prog: C4_PC, note: C4_NOTE, pas: C4_PC_PAS },
    '2nde': { prog: 'corps purs, mélanges, solutions, concentration en masse, dosage par étalonnage ; atome, noyau, configuration électronique, tableau périodique, ions monoatomiques, molécules et schémas de Lewis ; quantité de matière : la mole, constante d\'Avogadro ; transformations physiques, chimiques (équation, réactif limitant) et nucléaires ; mouvement (référentiel, vecteurs déplacement et vitesse), forces et principe d\'inertie ; son (fréquence, période, intensité sonore), lumière (spectres, réfraction avec les lois de Snell-Descartes, lentilles minces convergentes) ; circuits électriques, loi d\'Ohm, capteurs', pas: 'tableau d\'avancement et oxydoréduction, énergie mécanique et travail (1ère), pKa, cinétique, deuxième loi de Newton complète (Terminale)' },
    '1ère': { prog: 'SPÉCIALITÉ : tableau d\'avancement, oxydoréduction, titrages colorimétriques ; géométrie et polarité des molécules, cohésion, solubilité ; chimie organique (groupes caractéristiques, nomenclature, synthèse) ; combustions et énergie ; interactions fondamentales et champs, fluides au repos (pression, loi de Mariotte) ; mouvement et variation du vecteur vitesse ; travail d\'une force, énergie cinétique, potentielle et mécanique ; ondes mécaniques progressives et périodiques ; lumière : images par une lentille, couleurs, modèles ondulatoire et particulaire (photon). Tronc commun : enseignement scientifique', pas: 'acides et bases avec pKa, cinétique chimique, radioactivité et décroissance, deuxième loi de Newton et mouvements dans un champ, thermodynamique, diffraction et interférences (Terminale)' },
    'Terminale': { prog: 'SPÉCIALITÉ : acides et bases (pH, Ka, pKa), titrages, cinétique chimique, décroissance radioactive, sens d\'évolution spontanée (quotient de réaction, constante d\'équilibre), piles et électrolyse, stratégies de synthèse organique ; deuxième loi de Newton, mouvements dans un champ uniforme, satellites et lois de Kepler, mécanique des fluides ; premier principe de la thermodynamique et transferts thermiques ; ondes (diffraction, interférences, effet Doppler), lunette astronomique, effet photoélectrique, circuit RC', pas: '' }
  },
  'SVT': {
    '6ème': { prog: C3_SCI, pas: 'ADN, gènes, chromosomes, tectonique des plaques, système immunitaire en détail' },
    '5ème': { prog: C4_SVT, note: C4_NOTE, pas: 'méiose et brassage génétique, expression des gènes (transcription, traduction), datation absolue (lycée)' },
    '4ème': { prog: C4_SVT, note: C4_NOTE, pas: 'méiose et brassage génétique, expression des gènes (transcription, traduction), datation absolue (lycée)' },
    '3ème': { prog: C4_SVT, note: C4_NOTE, pas: 'méiose et brassage génétique, expression des gènes (transcription, traduction), datation absolue (lycée)' },
    '2nde': { prog: 'l\'organisme pluricellulaire, ensemble de cellules spécialisées ; métabolisme des cellules ; biodiversité et évolution ; érosion, sols et dynamique des paysages ; agrosystèmes ; procréation et sexualité humaine ; micro-organismes et santé', pas: 'divisions cellulaires et mutations, immunité adaptative détaillée (1ère), méiose et brassage, datation (Terminale)' },
    '1ère': { prog: 'SPÉCIALITÉ : divisions cellulaires (mitose), réplication de l\'ADN, mutations, expression du génome, biodiversité et évolution ; structure et dynamique interne de la Terre (lithosphère, dorsales, subduction) ; écosystèmes et services environnementaux ; variation génétique et santé ; immunité innée et adaptative, vaccination. Tronc commun : enseignement scientifique', pas: 'méiose et brassage génétique, datation relative et absolue, climats du passé (Terminale)' },
    'Terminale': { prog: 'SPÉCIALITÉ : brassage génétique (méiose, fécondation) et évolution ; à la recherche du passé géologique (datation relative et absolue) ; climats passés et futurs ; plante domestiquée ; comportements, mouvement et système nerveux ; corps humain et stress', pas: '' }
  },
  'Histoire-Geo': {
    '6ème': { prog: 'HISTOIRE : la longue histoire de l\'humanité et des migrations (Préhistoire, Néolithique, premiers États, premières écritures) ; récits fondateurs, croyances et citoyenneté dans la Méditerranée antique (monde grec, Athènes, débuts du judaïsme) ; l\'Empire romain dans le monde antique (conquêtes, débuts du christianisme). GÉOGRAPHIE : habiter une métropole, habiter un espace de faible densité, habiter les littoraux, le monde habité. EMC', pas: 'Moyen Âge (5ème), Révolution française (4ème), guerres mondiales (3ème)' },
    '5ème': { prog: 'HISTOIRE : chrétientés et islam (VIe-XIIIe siècles), des mondes en contact ; société, Église et pouvoir politique dans l\'Occident féodal (XIe-XVe siècles) ; transformations de l\'Europe et ouverture sur le monde aux XVIe et XVIIe siècles (Grandes découvertes, Renaissance, Réformes, monarchie absolue). GÉOGRAPHIE : la question démographique et l\'inégal développement ; des ressources limitées, à gérer et à renouveler ; prévenir les risques, s\'adapter au changement global. EMC', pas: 'Lumières et Révolution française (4ème), XXe siècle (3ème)' },
    '4ème': { prog: 'HISTOIRE : le XVIIIe siècle, expansions, Lumières et révolutions (traite et esclavage, Révolution française et Empire) ; l\'Europe et le monde au XIXe siècle (révolution industrielle, colonisation) ; société, culture et politique dans la France du XIXe siècle (IIIe République, place des femmes). GÉOGRAPHIE : l\'urbanisation du monde ; les mobilités humaines transnationales ; des espaces transformés par la mondialisation. EMC', pas: 'guerres mondiales, guerre froide, Ve République (3ème)' },
    '3ème': { prog: 'HISTOIRE : l\'Europe, un théâtre majeur des guerres totales (1914-1945 : Première Guerre mondiale, régimes totalitaires, Seconde Guerre mondiale, génocides) ; le monde depuis 1945 (guerre froide, décolonisation, construction européenne) ; Françaises et Français dans une République repensée (1944-1947, Ve République, évolutions de la société). GÉOGRAPHIE : dynamiques territoriales de la France contemporaine (aires urbaines, espaces productifs, espaces de faible densité) ; pourquoi et comment aménager le territoire ; la France et l\'Union européenne. EMC. Examen : le brevet', pas: '' },
    '2nde': { prog: 'HISTOIRE : le monde méditerranéen, empreintes de l\'Antiquité et du Moyen Âge ; XVe-XVIe siècles, un nouveau rapport au monde (Humanisme, Renaissance, Réformes) ; l\'État à l\'époque moderne (France et Angleterre) ; dynamiques et ruptures dans les sociétés des XVIIe et XVIIIe siècles (Lumières, révolution américaine). GÉOGRAPHIE : sociétés et environnements, des équilibres fragiles ; territoires, populations et développement ; des mobilités généralisées ; l\'Afrique australe, un espace en profonde mutation', pas: '' },
    '1ère': { prog: 'HISTOIRE : l\'Europe face aux révolutions ; la France dans l\'Europe des nationalités (1848-1871) ; la IIIe République avant 1914 ; la Première Guerre mondiale, le « suicide de l\'Europe » et la fin des empires européens. GÉOGRAPHIE : la métropolisation ; une diversification des espaces et des acteurs de la production ; les espaces ruraux ; la Chine, des recompositions spatiales multiples. Spécialité possible : HGGSP', pas: '' },
    'Terminale': { prog: 'HISTOIRE : fragilités des démocraties, totalitarismes et Seconde Guerre mondiale (1929-1945) ; la multiplication des acteurs internationaux dans un monde bipolaire (1945-début des années 1970) ; les remises en cause économiques, politiques et sociales (années 1970-1991) ; le monde, l\'Europe et la France depuis les années 1990. GÉOGRAPHIE : mers et océans, au cœur de la mondialisation ; dynamiques territoriales, coopérations et tensions dans la mondialisation ; l\'Union européenne dans la mondialisation ; la France et ses régions dans l\'UE et la mondialisation', pas: '' }
  },
  'Francais': {
    '6ème': { prog: 'nouveau programme 2025 : lecture fluide et compréhension, 6 œuvres intégrales dans l\'année (contes, mythes et récits de l\'Antiquité, fables, récits d\'aventures, poésie, théâtre) ; grammaire (classes de mots, sujet, COD, COI, attribut du sujet, compléments circonstanciels, phrase simple), conjugaison de l\'indicatif (présent, imparfait, passé simple, futur, passé composé), accords dans le groupe nominal et sujet-verbe, vocabulaire ; écriture régulière ; oral', pas: 'subordonnées (4ème), voix passive, subjonctif, analyse de la phrase complexe' },
    '5ème': { prog: 'NOUVEAU PROGRAMME 2026 — perspective « Éprouver, expérimenter : la découverte de soi, d\'autrui et du monde » ; 4 entrées (4 œuvres intégrales et au moins 2 groupements de textes) : « Devenir héroïne/héros : destins romanesques », « Voyager en poésie : du monde entier au cœur du monde », « Expérimenter et jouer au théâtre : la société sens dessus dessous », « Imaginer, sentir, raisonner : des histoires pour plaire et instruire » ; grammaire et orthographe travaillées chaque semaine, dictées régulières ; l\'orthographe rectifiée de 1990 est la référence mais les deux graphies sont acceptées (évènement / événement) ; vocabulaire et étymologie', pas: 'subordonnées et discours rapporté en détail (4ème), analyse logique de la phrase complexe (3ème)' },
    '4ème': { prog: 'entrées (programme 2015-2020, encore en vigueur en 4ème) : « Dire l\'amour », « Individu et société : confrontations de valeurs ? », « La fiction pour interroger le réel », « Informer, s\'informer, déformer ? », « La ville, lieu de tous les possibles ? » ; grammaire : propositions subordonnées (relatives, conjonctives), voix active et passive, discours direct et indirect, modes (indicatif, subjonctif, conditionnel), accord du participe passé', pas: 'méthodes du lycée (commentaire, dissertation)' },
    '3ème': { prog: 'entrées (programme 2015-2020, encore en vigueur en 3ème) : « Se raconter, se représenter », « Dénoncer les travers de la société », « Visions poétiques du monde », « Agir dans la cité : individu et pouvoir », « Progrès et rêves scientifiques » ; grammaire : phrase complexe, valeurs des temps et des modes, discours rapporté ; préparation du brevet : compréhension et compétences d\'interprétation, réécriture, dictée, rédaction (sujet d\'imagination ou de réflexion)', pas: 'commentaire et dissertation (lycée)' },
    '2nde': { prog: 'objets d\'étude : la poésie du Moyen Âge au XVIIIe siècle ; la littérature d\'idées et la presse du XIXe au XXIe siècle ; le roman et le récit du XVIIIe au XXIe siècle ; le théâtre du XVIIe au XXIe siècle ; initiation au commentaire et à la dissertation', pas: '' },
    '1ère': { prog: 'objets d\'étude : la poésie du XIXe au XXIe siècle ; la littérature d\'idées du XVIe au XVIIIe siècle ; le roman et le récit du Moyen Âge au XXIe siècle ; le théâtre du XVIIe au XXIe siècle, avec les œuvres au programme national (liste renouvelée régulièrement) ; épreuves anticipées du bac : écrit (commentaire ou dissertation ; voie technologique : commentaire ou contraction et essai), oral (explication linéaire, question de grammaire, entretien)', pas: '' },
    'Terminale': { prog: 'plus de français en Terminale (le bac de français a lieu en 1ère) : voir la philosophie', pas: '' }
  },
  'Philosophie': {
    'Terminale': { prog: '17 notions : l\'art, le bonheur, la conscience, le devoir, l\'État, l\'inconscient, la justice, le langage, la liberté, la nature, la raison, la religion, la science, la technique, le temps, le travail, la vérité ; exercices : dissertation et explication de texte ; Grand oral', pas: '' }
  }
};
var MATIERE_LABEL = { 'Maths': 'MATHS', 'Physique-Chimie': 'PHYSIQUE-CHIMIE', 'SVT': 'SVT', 'Histoire-Geo': 'HISTOIRE-GÉOGRAPHIE', 'Francais': 'FRANÇAIS', 'Philosophie': 'PHILOSOPHIE' };

function getClasse() {
  var c = (typeof userProfile !== 'undefined' && userProfile.classe) || '';
  if (!c) { try { c = (JSON.parse(localStorage.getItem('sk_prof') || '{}') || {}).classe || ''; } catch(e) {} }
  return NIVEAUX[c] ? c : '3ème';
}
function niveauInfo() { return NIVEAUX[getClasse()]; }
function isLycee() { return niveauInfo().cycle === 'lycée'; }
/* Examen de fin de cycle : brevet au college, bac au lycee */
function examLabel() { return isLycee() ? 'bac' : 'brevet'; }

/* Repères : dans quelle classe une notion (et sa notation) apparait. Evite que l'IA
   presente comme "au programme de 3eme" une notion de lycee (ex : N, Z, Q, R, C). */
var NIVEAU_REPERES = 'REPÈRES (classe où une notion et sa NOTATION apparaissent) : ' +
  'nombres entiers, décimaux, fractions simples, π (périmètre du cercle) 6ème ; nombres relatifs, priorités de calcul 5ème ; ' +
  'puissances, notation scientifique, Pythagore, racine carrée, opérations sur fractions et relatifs 4ème ; ' +
  'cosinus 4ème ; nombres premiers, irrationnels (√2, π), Thalès (papillon), sinus et tangente, fonctions linéaires et affines 3ème ' +
  '(au collège on parle de « nombres entiers, décimaux, relatifs, fractions, irrationnels comme √2 ou π » SANS les symboles ℕ ℤ 𝔻 ℚ ℝ ni ∈ ⊂) ; ' +
  'ensembles de nombres ℕ ℤ 𝔻 ℚ ℝ, notations ∈ ⊂, intervalles, valeur absolue, vecteurs, mole 2nde ' +
  '(ordre EXACT : entiers naturels ⊂ entiers relatifs ⊂ décimaux ⊂ rationnels ⊂ réels, soit ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ) ; ' +
  'second degré, suites, dérivée, produit scalaire 1ère ; limites, logarithme, intégrales, philosophie Terminale ; nombres complexes ℂ Terminale (option maths expertes) uniquement.';

/* mode 'chat' (defaut) : l'eleve pose une question -> on explique toujours, meme une autre annee.
   mode 'revision' : contenu genere (fiches, flashcards, quiz...) -> strictement au niveau de la classe. */
/* Programme officiel detaille de LA matiere du sujet (detectMat), pour la classe de l'eleve */
function progMatiereBloc(c, sujet) {
  var mat = detectMat(sujet || '');
  var pm = PROG_MATIERES[mat] && PROG_MATIERES[mat][c];
  if (!pm) return '';
  var lbl = MATIERE_LABEL[mat] || mat.toUpperCase();
  return 'PROGRAMME OFFICIEL DE ' + lbl + ' EN ' + c.toUpperCase() + ' (année 2026-2027) : ' + pm.prog + '.\n' +
    (pm.note ? pm.note + '\n' : '') +
    (pm.pas ? 'PAS ENCORE AU PROGRAMME EN ' + c.toUpperCase() + ' : ' + pm.pas + '.\n' : '');
}

function niveauPrompt(mode, sujet) {
  var c = getClasse(), n = NIVEAUX[c];
  /* Matiere reconnue -> seulement son programme detaille (plus precis et ~400 jetons de moins,
     important avec la limite Groq de 8 000 jetons/minute). Sinon -> resume general + reperes. */
  var bloc = progMatiereBloc(c, sujet);
  var base = '--- NIVEAU DE L\'ÉLÈVE ---\n' +
    'L\'élève est en ' + c + ' (' + n.cycle + ', programme officiel français). Tutoie-le.\n' +
    'FAÇON DE PARLER : ' + n.ton + '\n' +
    (bloc || ('PROGRAMME DE ' + c.toUpperCase() + ' : ' + n.prog + '\n' + NIVEAU_REPERES + '\n')) +
    'N\'affirme JAMAIS qu\'une notion est « au programme de ' + c + ' » si le programme ci-dessus la place dans une autre classe.\n';
  if (mode === 'revision') {
    return base +
      'CONTENU DE RÉVISION (fiches, flashcards, quiz, interros, résumés, plannings) — RÈGLE STRICTE :\n' +
      '- Questions ET réponses = exactement ce qu\'un élève de ' + c + ' apprend en classe : SES définitions, SES notations, SES exemples, avec sa façon de parler (pièges et méthodes : ceux du ' + (n.examen === 'contrôle' ? 'contrôle en classe' : n.examen) + ').\n' +
      '- N\'utilise AUCUNE notion, notation ou symbole qui arrive dans une classe plus avancée.\n' +
      '- Si le sujet dépasse sa classe, traite seulement la partie que l\'élève de ' + c + ' connaît déjà (par ex. « ensembles de nombres » en 3ème = entiers, décimaux, relatifs, fractions, irrationnels comme √2 et π, sans ℕ ℤ ℚ ℝ ni ℂ, ni les lettres N, Z, D, Q, R pour nommer un ensemble).\n' +
      '- Ne mentionne JAMAIS une autre classe dans le contenu (pas de « vu en seconde », « au programme de 1ère », « en 3ème »).\n' +
      '- Si un COURS est fourni, il fait foi : garde ses notations et son contenu.';
  }
  return base +
    'Par défaut, cale le contenu, les exemples, les notations et le vocabulaire sur ce programme de ' + c + ' (pièges et méthodes : ceux du ' + (n.examen === 'contrôle' ? 'contrôle en classe' : n.examen) + ').\n' +
    'AUTRES ANNÉES — RÈGLE IMPORTANTE : si l\'élève demande une notion d\'une autre classe (plus avancée ou d\'une année précédente), tu l\'expliques TOUJOURS complètement, tu ne refuses jamais. ' +
    'Ta PREMIÈRE phrase le signale (ex : « C\'est au programme de 1ère, mais voici l\'idée. »). Ensuite explique en partant de ce qu\'un élève de ' + c + ' sait déjà, avec sa façon de parler. ' +
    'Si la notion est plus avancée que sa classe : commence par l\'intuition avec une image ou un exemple concret, et évite les formules, notations et outils qu\'il n\'a pas encore vus (sauf s\'il les demande explicitement ; dans ce cas, explique chaque symbole). ' +
    'Pour une notion d\'une année précédente, fais un rappel clair sans le rabaisser.';
}

/* Textes de l'interface qui dependent de la classe */
function updateNiveauUI() {
  var d = new Date();
  /* Annee de l'examen = fin de l'annee scolaire en cours (bascule en aout) */
  var yr = d.getMonth() >= 7 ? d.getFullYear() + 1 : d.getFullYear();
  /* Prochain examen selon la classe : [nom, annees restantes] */
  var EXAMS = { '6ème':['Brevet',3], '5ème':['Brevet',2], '4ème':['Brevet',1], '3ème':['Brevet',0],
                '2nde':['Bac',2], '1ère':['Bac de français',0], 'Terminale':['Bac',0] };
  var ex = EXAMS[getClasse()];
  var lbl = document.getElementById('home-exam-lbl');
  if (lbl) lbl.textContent = getClasse() + ' · ' + ex[0] + ' ' + (yr + ex[1]);
}

/* Version courte pour les petits appels (corrections d'une ligne) : ~30 jetons au lieu de ~400 */
function niveauPromptCourt() {
  var c = getClasse();
  return 'L\'élève est en ' + c + ' (' + NIVEAUX[c].cycle + '). Tutoie-le et adapte ton vocabulaire à sa classe.';
}

/* Ajoute le bloc niveau au message systeme (ou en cree un).
   mode : 'court' (une ligne), 'revision' (contenu genere), sinon chat */
function _withNiveau(messages, mode) {
  /* sujet = texte du dernier message de l'eleve (pour choisir le programme detaille) */
  var sujet = '';
  for (var i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role !== 'user') continue;
    var ct = messages[i].content;
    sujet = typeof ct === 'string' ? ct : (Array.isArray(ct) ? ct.map(function(p) { return p.text || ''; }).join(' ') : '');
    break;
  }
  var blk = mode === 'court' ? niveauPromptCourt() : niveauPrompt(mode, sujet);
  var out = messages.slice();
  if (out.length && out[0].role === 'system' && typeof out[0].content === 'string') {
    out[0] = { role: 'system', content: out[0].content + '\n\n' + blk };
  } else {
    out.unshift({ role: 'system', content: blk });
  }
  return out;
}
