/*
  annales-data.js — Bibliotheque d'exercices type Brevet (DNB) pour ScolarIA
  ------------------------------------------------------------------------------
  Fichier de DONNEES uniquement (aucune logique d'app ici).
  Charge dans le HTML avec : <script src="annales-data.js"></script>
  Puis disponible via la variable globale ANNALES.

  STRUCTURE
  ANNALES = {
    pc: {                         // code matiere (pc = physique-chimie)
      nom: "Physique-Chimie",
      icone: "flask",
      themes: [
        {
          id: "ions_ph",          // identifiant unique du theme
          titre: "Les ions et le pH",
          exos: [                 // liste d'exercices du theme
            {
              id: "pc_ions_01",   // identifiant unique de l'exo (jamais en double)
              titre: "...",       // titre court
              diff: "moyen",      // facile | moyen | difficile
              enonce: "...",      // texte de l'enonce
              table: [ [..], [..] ], // OPTIONNEL : tableau (1re ligne = en-tete)
              schema: "<svg>...",    // OPTIONNEL : schema SVG (string)
              questions: ["...", "..."],   // les questions, dans l'ordre
              correction: ["...", "..."],  // la correction, question par question
              piege: "..."        // le petit "piege brevet" a retenir
            }
          ]
        }
      ]
    }
  }

  REGLES DE REDACTION (pour les prochains ajouts) :
  - Strings en "double quotes" : les apostrophes francaises (l', d', qu') passent sans echappement.
  - Pas de guillemets droits " a l'interieur du texte : utiliser les guillemets « ».
  - Le champ schema (SVG, qui contient des guillemets doubles) est en backticks `...`.
  - Verifier les calculs : un exo faux est pire que pas d'exo.
  - 10 themes du programme officiel de 3eme couverts (voir ci-dessous).

  Themes officiels (4 grands themes du programme -> 10 sous-themes ici) :
   - Organisation et transformation de la matiere : ions_ph, atomes_molecules,
     masse_conservation, combustions, masse_volumique
   - Mouvements et interactions : mouvement_vitesse, gravitation
   - L'energie et ses conversions : circuits_ohm, energie_puissance
   - Des signaux pour observer et communiquer : signaux
*/

const ANNALES = {
  pc: {
    nom: "Physique-Chimie",
    icone: "flask",
    themes: [

      /* ================= THEME 1 : LES IONS ET LE pH ================= */
      {
        id: "ions_ph",
        titre: "Les ions et le pH",
        exos: [
          {
            id: "pc_ions_01",
            titre: "Analyse de trois solutions",
            diff: "moyen",
            enonce: "Un technicien analyse trois solutions incolores A, B et C. Il realise les tests rassembles dans le tableau suivant.",
            table: [
              ["Sol.", "Test a la soude", "Nitrate d'argent", "pH"],
              ["A", "precipite bleu", "—", "5"],
              ["B", "precipite rouille", "—", "7"],
              ["C", "aucun precipite", "precipite blanc qui noircit", "9"]
            ],
            questions: [
              "Identifie l'ion metallique present dans A et dans B.",
              "Quel ion le nitrate d'argent revele-t-il dans C ? Donne sa formule.",
              "La solution A est-elle acide, neutre ou basique ? Contient-elle plus d'ions H+ ou OH- ?",
              "Range A, B et C de la plus acide a la plus basique."
            ],
            correction: [
              "Precipite bleu -> ion cuivre Cu2+ ; precipite rouille -> ion fer III Fe3+.",
              "Precipite blanc qui noircit a la lumiere -> ion chlorure, formule Cl-.",
              "pH 5 < 7 -> A est acide -> elle contient plus d'ions H+ que d'ions OH-.",
              "A (pH 5) < B (pH 7) < C (pH 9)."
            ],
            piege: "Couleur des precipites a la soude : bleu = cuivre, vert = fer II, rouille = fer III. Ne pas confondre."
          },
          {
            id: "pc_ions_02",
            titre: "Sulfate de cuivre et soude",
            diff: "facile",
            enonce: "On dispose d'une solution de sulfate de cuivre. Le papier pH y indique pH = 4. On ajoute ensuite de la soude (hydroxyde de sodium) goutte a goutte.",
            questions: [
              "La solution de depart est-elle acide ou basique ?",
              "Quel precipite observe-t-on ? La presence de quel ion prouve-t-il ?",
              "Donne la formule de l'ion cuivre.",
              "Comment evolue le pH si on continue d'ajouter de la soude ?"
            ],
            correction: [
              "pH 4 < 7 -> la solution est acide.",
              "Un precipite bleu apparait -> il prouve la presence d'ions cuivre Cu2+.",
              "Cu2+.",
              "La soude est une base : le pH augmente (il se rapproche de 7 puis depasse 7)."
            ],
            piege: "Ajouter une base fait MONTER le pH ; ajouter un acide le fait BAISSER."
          },
          {
            id: "pc_ions_03",
            titre: "Du citron a l'eau savonneuse",
            diff: "facile",
            enonce: "Trois bechers contiennent : du jus de citron (pH 2), de l'eau pure (pH 7) et de l'eau savonneuse (pH 9).",
            questions: [
              "Classe les trois liquides du plus acide au plus basique.",
              "Lequel contient le plus d'ions H+ ?",
              "On dilue le jus de citron avec beaucoup d'eau : son pH se rapproche-t-il de 7 ou s'en eloigne-t-il ?",
              "Quelle precaution prendre pour manipuler un acide concentre ?"
            ],
            correction: [
              "citron (pH 2) < eau pure (pH 7) < eau savonneuse (pH 9).",
              "Le plus acide -> le jus de citron contient le plus d'ions H+.",
              "Diluer un acide rapproche son pH de 7.",
              "Porter des lunettes et des gants (un acide concentre est corrosif)."
            ],
            piege: "Diluer un acide ou une base rapproche toujours le pH de 7 (neutre)."
          },
          {
            id: "pc_ions_04",
            titre: "Le precipite vert",
            diff: "facile",
            enonce: "On verse de la soude (hydroxyde de sodium) dans une solution : il se forme un precipite vert.",
            questions: [
              "Quel ion metallique est present dans la solution ?",
              "Donne la formule de cet ion.",
              "Quelle couleur de precipite obtiendrait-on avec des ions cuivre ?",
              "Le test a la soude permet-il d'identifier les ions chlorure ?"
            ],
            correction: [
              "Un precipite vert indique la presence d'ions fer II.",
              "Fe2+.",
              "Un precipite bleu.",
              "Non : les ions chlorure s'identifient au nitrate d'argent (precipite blanc)."
            ],
            piege: "Precipites a la soude : vert = fer II, rouille = fer III, bleu = cuivre."
          },
          {
            id: "pc_ions_05",
            titre: "Le pH des produits du quotidien",
            diff: "facile",
            enonce: "On mesure le pH de produits courants : Coca (pH 2,5), lait (pH 6,5), eau de Javel (pH 11).",
            questions: [
              "Lesquels sont acides ?",
              "Lequel est basique ?",
              "Classe-les du plus acide au plus basique.",
              "Lequel est le plus dangereux pour la peau, et pourquoi ?"
            ],
            correction: [
              "Le Coca (2,5) et le lait (6,5) ont un pH inferieur a 7 : ils sont acides.",
              "L'eau de Javel (pH 11 > 7) est basique.",
              "Coca (2,5) < lait (6,5) < eau de Javel (11).",
              "L'eau de Javel : une base forte (pH eleve) est corrosive."
            ],
            piege: "Plus le pH s'eloigne de 7 (vers 0 ou vers 14), plus la solution est agressive."
          },
          {
            id: "pc_ions_06",
            titre: "Pourquoi l'eau salee conduit le courant",
            diff: "moyen",
            enonce: "L'eau distillee conduit tres mal le courant electrique, mais l'eau salee le conduit bien.",
            questions: [
              "Qu'est-ce qui permet a l'eau salee de conduire le courant ?",
              "L'eau distillee contient-elle beaucoup d'ions ?",
              "Que se passe-t-il si on ajoute du sel dans l'eau distillee ?",
              "Cite un danger d'utiliser un appareil electrique pres de l'eau."
            ],
            correction: [
              "La presence d'ions (des charges electriques mobiles) dans la solution.",
              "Non, tres peu d'ions : c'est pour cela qu'elle conduit mal.",
              "Le sel se dissocie en ions : l'eau devient conductrice.",
              "L'eau (surtout salee ou savonneuse) conduit le courant : risque d'electrocution."
            ],
            piege: "Ce sont les IONS, et non l'eau elle-meme, qui conduisent le courant."
          },
          {
            id: "pc_ions_07",
            titre: "Neutraliser un acide",
            diff: "moyen",
            enonce: "On melange un acide (pH 3) avec une base (pH 11) en quantites adaptees. Le pH final mesure est 7.",
            questions: [
              "Comment qualifie-t-on la solution finale ?",
              "Que s'est-il passe entre l'acide et la base ?",
              "Une solution de pH 7 contient-elle plus d'ions H+ ou OH- ?",
              "Donne un exemple de neutralisation dans la vie courante."
            ],
            correction: [
              "Elle est neutre (pH = 7).",
              "L'acide et la base se sont neutralises (reaction acide-base).",
              "Autant d'ions H+ que d'ions OH-.",
              "Par exemple un medicament qui neutralise l'acidite de l'estomac, ou une base qui soulage une piqure."
            ],
            piege: "pH 7 = neutre = autant d'ions H+ que d'ions OH-."
          },
          {
            id: "pc_ions_08",
            titre: "Deux tests sur une eau",
            diff: "moyen",
            enonce: "Sur une eau de source, on ajoute du nitrate d'argent a un echantillon : precipite blanc. Sur un autre echantillon, on ajoute de la soude : precipite bleu.",
            questions: [
              "Quel ion le nitrate d'argent revele-t-il ?",
              "Quel ion la soude revele-t-elle ici ?",
              "Donne les formules de ces deux ions.",
              "Cette eau est-elle un corps pur ?"
            ],
            correction: [
              "L'ion chlorure (precipite blanc).",
              "L'ion cuivre (precipite bleu).",
              "Cl- et Cu2+.",
              "Non : elle contient plusieurs ions dissous, c'est un melange."
            ],
            piege: "Chaque test revele un ion precis : nitrate d'argent -> chlorure, soude -> ion metallique."
          },
          {
            id: "pc_ions_09",
            titre: "L'echelle de pH",
            diff: "facile",
            enonce: "L'echelle de pH va de 0 a 14.",
            questions: [
              "Quelle valeur correspond a une solution neutre ?",
              "Un pH de 0 a 7 correspond a quoi ? de 7 a 14 ?",
              "Une solution de pH 1 est-elle plus ou moins acide qu'une solution de pH 3 ?",
              "Avec quoi mesure-t-on rapidement un pH en classe ?"
            ],
            correction: [
              "pH 7.",
              "0 a 7 : acide ; 7 a 14 : basique.",
              "pH 1 est plus acide que pH 3 (plus on se rapproche de 0, plus c'est acide).",
              "Avec du papier pH (ou un pH-metre)."
            ],
            piege: "Plus le pH est petit, plus c'est acide ; plus il est grand, plus c'est basique."
          },
          {
            id: "pc_ions_10",
            titre: "Les pluies acides",
            diff: "facile",
            enonce: "Les pluies acides ont un pH inferieur a celui d'une pluie normale (environ 5,5).",
            questions: [
              "Une pluie de pH 4 est-elle acide ?",
              "Est-elle plus ou moins acide qu'une pluie de pH 5,5 ?",
              "Cite une consequence des pluies acides.",
              "Une pluie de pH 7 serait-elle acide ?"
            ],
            correction: [
              "Oui (pH 4 < 7).",
              "Plus acide (4 < 5,5).",
              "Elles abiment les batiments, les forets, et acidifient les lacs.",
              "Non, elle serait neutre."
            ],
            piege: "Pour comparer l'acidite, on compare les pH : le plus petit est le plus acide."
          },
          {
            id: "pc_ions_11",
            titre: "Manipuler un acide en securite",
            diff: "moyen",
            enonce: "Au laboratoire, on manipule un acide concentre et une base concentree.",
            questions: [
              "Ces produits sont-ils dangereux ? Pourquoi ?",
              "Cite deux equipements de protection.",
              "Que faut-il faire en cas de projection sur la peau ?",
              "Pour diluer, verse-t-on l'eau dans l'acide ou l'acide dans l'eau ?"
            ],
            correction: [
              "Oui : ils sont corrosifs (ils attaquent la peau et les yeux).",
              "Des lunettes de protection et des gants (et une blouse).",
              "Rincer abondamment a l'eau et prevenir un adulte.",
              "On verse l'acide dans l'eau, jamais l'eau dans l'acide."
            ],
            piege: "« L'acide dans l'eau » : l'inverse peut provoquer des projections dangereuses."
          }
        ]
      },

      /* ============== THEME 2 : ATOMES ET MOLECULES ============== */
      {
        id: "atomes_molecules",
        titre: "Atomes et molecules",
        exos: [
          {
            id: "pc_atom_01",
            titre: "Lire une formule chimique",
            diff: "facile",
            enonce: "La molecule d'eau a pour formule H2O. La molecule de dioxyde de carbone a pour formule CO2.",
            questions: [
              "Combien d'atomes, et de quels elements, compte une molecule d'eau ?",
              "Combien d'atomes au total compte une molecule de CO2 ?",
              "Toutes les molecules d'un corps pur sont-elles identiques ?",
              "Quelle est la difference entre un atome et une molecule ?"
            ],
            correction: [
              "2 atomes d'hydrogene (H) + 1 atome d'oxygene (O) = 3 atomes.",
              "1 atome de carbone + 2 atomes d'oxygene = 3 atomes.",
              "Oui : dans un corps pur, toutes les molecules sont identiques.",
              "Un atome est la plus petite partie d'un element ; une molecule est un assemblage de plusieurs atomes lies."
            ],
            piege: "L'indice (petit chiffre) ne compte que l'atome ecrit juste avant lui."
          },
          {
            id: "pc_atom_02",
            titre: "La structure de l'atome",
            diff: "moyen",
            enonce: "Un atome est forme d'un noyau (protons et neutrons) entoure d'electrons. L'atome est electriquement neutre.",
            questions: [
              "Quelles particules portent une charge positive ? une charge negative ?",
              "Pourquoi l'atome est-il electriquement neutre ?",
              "Un atome perd un electron : obtient-on un ion positif ou negatif ?",
              "Comment appelle-t-on un ion positif ? un ion negatif ?"
            ],
            correction: [
              "Les protons sont positifs (+), les electrons sont negatifs (-). Les neutrons n'ont pas de charge.",
              "Il y a autant de protons (+) que d'electrons (-) : les charges se compensent.",
              "Il manque une charge negative -> on obtient un ion positif.",
              "Un ion positif est un cation, un ion negatif est un anion."
            ],
            piege: "Perdre des electrons -> ion positif ; en gagner -> ion negatif (c'est contre-intuitif)."
          },
          {
            id: "pc_atom_03",
            titre: "L'atome de lithium",
            diff: "moyen",
            enonce: "On donne la composition d'un atome de lithium : 3 protons, 4 neutrons et 3 electrons.",
            questions: [
              "Combien de particules le noyau contient-il ?",
              "L'atome est-il electriquement neutre ? Justifie.",
              "Si cet atome perd un electron, ecris la formule de l'ion forme.",
              "La masse de l'atome est-elle surtout dans le noyau ou dans les electrons ?"
            ],
            correction: [
              "Le noyau contient les protons et les neutrons : 3 + 4 = 7 particules.",
              "Oui : 3 protons (+) et 3 electrons (-), les charges se compensent.",
              "Li+ (il manque une charge negative).",
              "Dans le noyau : protons et neutrons sont bien plus lourds que les electrons."
            ],
            piege: "La masse des electrons est negligeable : presque toute la masse est dans le noyau."
          },
          {
            id: "pc_atom_04",
            titre: "Corps pur ou melange ?",
            diff: "facile",
            enonce: "On observe : (a) de l'eau distillee, (b) de l'eau minerale, (c) du dioxygene O2.",
            questions: [
              "Lesquels sont des corps purs ?",
              "L'eau minerale est-elle un corps pur ? Pourquoi ?",
              "Combien d'atomes une molecule de O2 contient-elle ?",
              "Le dioxygene est-il un corps simple ou compose ?"
            ],
            correction: [
              "L'eau distillee et le dioxygene sont des corps purs.",
              "Non : elle contient de l'eau et des sels mineraux dissous, c'est un melange.",
              "2 atomes d'oxygene.",
              "Un corps simple (un seul type d'atome)."
            ],
            piege: "Corps simple = un seul element (O2) ; corps compose = plusieurs elements (H2O)."
          },
          {
            id: "pc_atom_05",
            titre: "L'atome est surtout du vide",
            diff: "moyen",
            enonce: "Un atome a un diametre de l'ordre de 0,1 nanometre. Son noyau est environ 100 000 fois plus petit que l'atome.",
            questions: [
              "L'atome est-il plein de matiere ou surtout du vide ?",
              "Ou se concentre la masse de l'atome ?",
              "Que trouve-t-on entre le noyau et les electrons ?",
              "Range du plus petit au plus grand : atome, noyau, molecule."
            ],
            correction: [
              "L'atome est essentiellement constitue de vide.",
              "Dans le noyau.",
              "Du vide (les electrons s'y deplacent).",
              "Noyau < atome < molecule."
            ],
            piege: "L'atome est surtout du vide ; sa masse est concentree dans un noyau minuscule."
          },
          {
            id: "pc_atom_06",
            titre: "Les gaz de l'air",
            diff: "facile",
            enonce: "On donne trois formules : H2 (dihydrogene), N2 (diazote) et H2O (eau).",
            questions: [
              "Combien d'atomes une molecule de dihydrogene contient-elle ?",
              "Le diazote est-il un corps simple ou compose ?",
              "L'eau est-elle un corps simple ou compose ?",
              "Quel gaz est majoritaire dans l'air que nous respirons ?"
            ],
            correction: [
              "2 atomes d'hydrogene.",
              "Un corps simple (un seul element : l'azote).",
              "Un corps compose (hydrogene + oxygene).",
              "Le diazote N2 (environ 78 % de l'air)."
            ],
            piege: "L'air est surtout du diazote (78 %) ; le dioxygene ne represente que 21 %."
          },
          {
            id: "pc_atom_07",
            titre: "Former l'ion sodium",
            diff: "moyen",
            enonce: "L'atome de sodium possede 11 protons et 11 electrons. Il peut perdre 1 electron.",
            questions: [
              "L'atome de sodium est-il electriquement neutre ?",
              "Apres avoir perdu 1 electron, combien d'electrons reste-t-il ?",
              "Ecris la formule de l'ion sodium.",
              "Cet ion est-il un cation ou un anion ?"
            ],
            correction: [
              "Oui : 11 protons (+) et 11 electrons (-).",
              "10 electrons.",
              "Na+.",
              "Un cation (ion positif)."
            ],
            piege: "Le nombre de protons ne change jamais ; seul le nombre d'electrons varie pour former un ion."
          },
          {
            id: "pc_atom_08",
            titre: "Compter les atomes du glucose",
            diff: "moyen",
            enonce: "Le glucose a pour formule C6H12O6.",
            questions: [
              "Combien d'atomes de carbone contient-il ?",
              "Combien d'atomes d'hydrogene ?",
              "Combien d'atomes au total dans une molecule de glucose ?",
              "Le glucose est-il un corps simple ou compose ?"
            ],
            correction: [
              "6 atomes de carbone.",
              "12 atomes d'hydrogene.",
              "6 + 12 + 6 = 24 atomes.",
              "Compose (3 elements differents : C, H et O)."
            ],
            piege: "Pour le total d'atomes, on additionne tous les indices de la formule."
          },
          {
            id: "pc_atom_09",
            titre: "Le modele de la molecule d'eau",
            diff: "facile",
            enonce: "On represente la molecule d'eau par un modele : une boule rouge (oxygene) reliee a deux boules blanches (hydrogene).",
            questions: [
              "Combien de liaisons relient les atomes ?",
              "Que represente la boule rouge ?",
              "La formule H2O correspond-elle bien a ce modele ?",
              "Pourquoi utilise-t-on des modeles moleculaires ?"
            ],
            correction: [
              "2 liaisons (oxygene-hydrogene).",
              "L'atome d'oxygene.",
              "Oui : 2 atomes H et 1 atome O.",
              "Pour visualiser la disposition des atomes dans la molecule."
            ],
            piege: "La formule indique le nombre d'atomes ; le modele montre leur arrangement."
          },
          {
            id: "pc_atom_10",
            titre: "Les atomes pendant une reaction",
            diff: "moyen",
            enonce: "Au cours d'une reaction chimique, les molecules sont cassees et les atomes se reorganisent.",
            questions: [
              "Les atomes sont-ils conserves pendant la reaction ?",
              "Les molecules sont-elles les memes avant et apres ?",
              "Qu'est-ce qui explique la conservation de la masse ?",
              "Peut-on creer un atome lors d'une reaction chimique ?"
            ],
            correction: [
              "Oui, ils sont tous conserves.",
              "Non : de nouvelles molecules se forment.",
              "Les atomes sont conserves (ni crees ni detruits), donc la masse se conserve.",
              "Non : on ne peut ni creer ni detruire d'atomes en chimie."
            ],
            piege: "Les MOLECULES changent, mais les ATOMES sont conserves."
          },
          {
            id: "pc_atom_11",
            titre: "Former l'ion chlorure",
            diff: "moyen",
            enonce: "L'atome de chlore possede 17 protons et 17 electrons. Il peut gagner 1 electron.",
            questions: [
              "L'atome de chlore est-il electriquement neutre ?",
              "Apres avoir gagne 1 electron, combien d'electrons possede-t-il ?",
              "Ecris la formule de l'ion chlorure.",
              "Cet ion est-il un cation ou un anion ?"
            ],
            correction: [
              "Oui : 17 protons (+) et 17 electrons (-).",
              "18 electrons.",
              "Cl-.",
              "Un anion (ion negatif)."
            ],
            piege: "Gagner un electron ajoute une charge negative : on obtient un ion negatif (anion)."
          }
        ]
      },

      /* ====== THEME 3 : CONSERVATION DE LA MASSE / REACTIONS ====== */
      {
        id: "masse_conservation",
        titre: "Conservation de la masse",
        exos: [
          {
            id: "pc_masse_01",
            titre: "La bougie qui brule",
            diff: "moyen",
            enonce: "On fait reagir 4 g de methane avec 16 g de dioxygene. Il se forme du dioxyde de carbone et de l'eau.",
            questions: [
              "Enonce le principe de conservation de la masse.",
              "Quelle est la masse totale des produits formes ?",
              "Les atomes sont-ils crees ou detruits pendant une reaction chimique ?",
              "Pourquoi une bougie qui brule semble-t-elle « perdre » de la masse ?"
            ],
            correction: [
              "La masse totale se conserve : masse des reactifs = masse des produits.",
              "4 + 16 = 20 g de produits.",
              "Ni crees ni detruits : les atomes sont seulement rearranges.",
              "Les produits (CO2, vapeur d'eau) s'echappent dans l'air et ne sont pas peses."
            ],
            piege: "Rien ne se perd : les gaz produits partent simplement dans l'air."
          },
          {
            id: "pc_masse_02",
            titre: "Fer et soufre en tube ferme",
            diff: "moyen",
            enonce: "On fait reagir du fer avec du soufre dans un tube ferme. Avant la reaction : 5,6 g de fer et 3,2 g de soufre.",
            questions: [
              "Quelle masse de sulfure de fer obtient-on si tout reagit ?",
              "Pourquoi le tube doit-il etre ferme pour verifier la conservation ?",
              "Un systeme ferme echange-t-il de la matiere avec l'exterieur ?",
              "Si on mesurait 8,5 g, l'experience respecterait-elle la conservation ?"
            ],
            correction: [
              "5,6 + 3,2 = 8,8 g de sulfure de fer.",
              "Pour qu'aucun gaz ne s'echappe (sinon la masse mesuree diminuerait).",
              "Non : un systeme ferme n'echange pas de matiere avec l'exterieur.",
              "Non : 8,5 g n'est pas egal a 8,8 g -> il manquerait de la masse (fuite ou erreur de mesure)."
            ],
            piege: "La conservation ne se verifie qu'en systeme FERME."
          },
          {
            id: "pc_masse_03",
            titre: "Equilibrer une equation",
            diff: "facile",
            enonce: "La combustion du carbone s'ecrit : C + O2 -> CO2.",
            questions: [
              "Compte les atomes de chaque element a gauche, puis a droite.",
              "L'equation est-elle equilibree ?",
              "Que represente la fleche ?",
              "Cite les reactifs et le produit."
            ],
            correction: [
              "A gauche : 1 C et 2 O. A droite : 1 C et 2 O.",
              "Oui : il y a autant d'atomes de chaque element des deux cotes.",
              "Elle indique le sens de la transformation : reactifs -> produits.",
              "Reactifs : carbone C et dioxygene O2 ; produit : dioxyde de carbone CO2."
            ],
            piege: "Equilibrer = meme nombre d'atomes de chaque element a gauche et a droite."
          },
          {
            id: "pc_masse_04",
            titre: "Dissoudre du sucre",
            diff: "facile",
            enonce: "On dissout 5 g de sucre dans 95 g d'eau, dans un becher pose sur une balance.",
            questions: [
              "Quelle masse la balance indique-t-elle apres dissolution ?",
              "Le sucre a-t-il disparu ?",
              "La dissolution est-elle une transformation physique ou chimique ?",
              "Comment recuperer le sucre ?"
            ],
            correction: [
              "5 + 95 = 100 g : la masse se conserve.",
              "Non, il est dissous (melange homogene).",
              "Physique : aucune nouvelle espece chimique n'est creee.",
              "Par evaporation de l'eau."
            ],
            piege: "Dissoudre ne fait pas disparaitre la matiere : la masse totale reste la meme."
          },
          {
            id: "pc_masse_05",
            titre: "La synthese de l'eau",
            diff: "moyen",
            enonce: "La synthese de l'eau s'ecrit : 2 H2 + O2 -> 2 H2O.",
            questions: [
              "Combien d'atomes d'hydrogene a gauche ? a droite ?",
              "Combien d'atomes d'oxygene a gauche ? a droite ?",
              "L'equation est-elle equilibree ?",
              "A quoi servent les nombres places devant les molecules ?"
            ],
            correction: [
              "A gauche : 2 x 2 = 4 H ; a droite : 2 x 2 = 4 H.",
              "A gauche : 2 O ; a droite : 2 x 1 = 2 O.",
              "Oui : autant d'atomes de chaque element des deux cotes.",
              "Ce sont les coefficients : ils equilibrent l'equation (nombre de molecules)."
            ],
            piege: "Le grand nombre devant multiplie TOUTE la molecule ; l'indice ne multiplie qu'un atome."
          },
          {
            id: "pc_masse_06",
            titre: "Physique ou chimique ?",
            diff: "moyen",
            enonce: "On observe deux transformations : (a) de la glace qui fond, (b) du bois qui brule.",
            questions: [
              "Laquelle est une transformation physique ? Pourquoi ?",
              "Laquelle est une transformation chimique ? Pourquoi ?",
              "Dans les deux cas, la masse totale est-elle conservee ?",
              "Comment reconnait-on qu'une transformation est chimique ?"
            ],
            correction: [
              "La fonte de la glace : c'est de l'eau avant et apres (simple changement d'etat).",
              "La combustion du bois : de nouvelles substances apparaissent (cendres, gaz).",
              "Oui : dans les deux cas la masse totale se conserve.",
              "Quand de nouvelles especes chimiques se forment (changement de couleur, gaz, chaleur...)."
            ],
            piege: "Changement d'etat = physique ; apparition de nouvelles substances = chimique."
          },
          {
            id: "pc_masse_07",
            titre: "Retrouver une masse manquante",
            diff: "moyen",
            enonce: "Lors d'une reaction, 12 g de carbone reagissent avec du dioxygene pour former 44 g de dioxyde de carbone.",
            questions: [
              "Ecris l'egalite des masses (conservation).",
              "Quelle masse de dioxygene a reagi ?",
              "Cette reaction est-elle une combustion ?",
              "Le dioxygene est-il un reactif ou un produit ?"
            ],
            correction: [
              "masse(carbone) + masse(dioxygene) = masse(dioxyde de carbone).",
              "44 - 12 = 32 g de dioxygene.",
              "Oui : du carbone qui brule dans le dioxygene.",
              "Un reactif (il est consomme)."
            ],
            piege: "On retrouve une masse manquante grace a la conservation : produits - reactif connu."
          },
          {
            id: "pc_masse_08",
            titre: "Le clou qui rouille",
            diff: "moyen",
            enonce: "Un clou en fer rouille a l'air libre. Sa masse augmente au fil des semaines.",
            questions: [
              "Avec quel gaz le fer reagit-il pour rouiller ?",
              "Pourquoi la masse du clou augmente-t-elle ?",
              "La conservation de la masse est-elle respectee ?",
              "Comment empecher un objet en fer de rouiller ?"
            ],
            correction: [
              "Le dioxygene de l'air (en presence d'eau).",
              "Le fer capte des atomes d'oxygene, donc sa masse augmente.",
              "Oui, si on compte le dioxygene consomme.",
              "En le peignant, le graissant ou en le recouvrant (galvanisation)."
            ],
            piege: "La rouille fait GAGNER de la masse au fer (il capte de l'oxygene)."
          },
          {
            id: "pc_masse_09",
            titre: "Lire l'equation du methane",
            diff: "moyen",
            enonce: "On donne l'equation : CH4 + 2 O2 -> CO2 + 2 H2O.",
            questions: [
              "Combien d'atomes de carbone de chaque cote ?",
              "Combien d'atomes d'hydrogene de chaque cote ?",
              "L'equation respecte-t-elle la conservation des atomes ?",
              "Que devient le nombre total d'atomes au cours de la reaction ?"
            ],
            correction: [
              "1 atome C a gauche (CH4), 1 atome C a droite (CO2).",
              "4 atomes H a gauche (CH4), 4 atomes H a droite (2 H2O).",
              "Oui : autant d'atomes de chaque element des deux cotes.",
              "Il reste constant (les atomes sont conserves)."
            ],
            piege: "Une equation equilibree traduit la conservation des atomes."
          },
          {
            id: "pc_masse_10",
            titre: "Le ballon qui gonfle",
            diff: "moyen",
            enonce: "On fait reagir du vinaigre avec du bicarbonate dans une bouteille fermee par un ballon. Un gaz se forme et gonfle le ballon.",
            questions: [
              "La masse totale du systeme (bouteille + ballon) change-t-elle ?",
              "Pourquoi le ballon gonfle-t-il ?",
              "Sans le ballon, observerait-on une perte de masse ?",
              "Quel gaz est probablement produit ?"
            ],
            correction: [
              "Non : en systeme ferme, la masse totale se conserve.",
              "Un gaz se forme et vient occuper le ballon.",
              "Oui : le gaz s'echapperait et la masse mesuree diminuerait.",
              "Du dioxyde de carbone CO2."
            ],
            piege: "En systeme ferme, meme s'il se forme un gaz, la masse totale ne change pas."
          },
          {
            id: "pc_masse_11",
            titre: "Former de l'oxyde de cuivre",
            diff: "moyen",
            enonce: "On chauffe 8 g de cuivre avec 2 g de dioxygene. Tout reagit et forme de l'oxyde de cuivre.",
            questions: [
              "Quelle masse d'oxyde de cuivre obtient-on ?",
              "Quelle loi utilises-tu ?",
              "Le cuivre et le dioxygene sont-ils des reactifs ou des produits ?",
              "Cette transformation est-elle physique ou chimique ?"
            ],
            correction: [
              "8 + 2 = 10 g d'oxyde de cuivre.",
              "La conservation de la masse.",
              "Des reactifs.",
              "Chimique : une nouvelle substance (l'oxyde de cuivre) se forme."
            ],
            piege: "Masse des produits = somme des masses des reactifs (en systeme ferme)."
          }
        ]
      },

      /* ================= THEME 4 : COMBUSTIONS ================= */
      {
        id: "combustions",
        titre: "Les combustions",
        exos: [
          {
            id: "pc_comb_01",
            titre: "Combustion du carbone",
            diff: "facile",
            enonce: "On realise la combustion complete du carbone dans le dioxygene. Le gaz forme trouble l'eau de chaux.",
            questions: [
              "Quel gaz se forme ? Comment le test a l'eau de chaux le prouve-t-il ?",
              "Quels sont les deux reactifs ?",
              "Que se passe-t-il s'il manque de dioxygene ?",
              "Pourquoi parle-t-on de reaction exothermique ?"
            ],
            correction: [
              "Du dioxyde de carbone CO2 : l'eau de chaux se trouble (devient blanche laiteuse).",
              "Le carbone et le dioxygene.",
              "La combustion est incomplete : elle peut produire du monoxyde de carbone CO, un gaz toxique.",
              "Parce qu'elle libere de la chaleur (exo = vers l'exterieur)."
            ],
            piege: "Combustion incomplete -> monoxyde de carbone CO, gaz inodore et mortel."
          },
          {
            id: "pc_comb_02",
            titre: "Combustion du methane",
            diff: "moyen",
            enonce: "La combustion du methane (gaz de ville) s'ecrit : CH4 + 2 O2 -> CO2 + 2 H2O.",
            questions: [
              "Cite le combustible et le comburant.",
              "Quels sont les produits de cette combustion ?",
              "Verifie que l'equation est equilibree pour l'oxygene (O).",
              "Pourquoi faut-il aerer une piece ou fonctionne une chaudiere a gaz ?"
            ],
            correction: [
              "Combustible : methane CH4 ; comburant : dioxygene O2.",
              "Du dioxyde de carbone CO2 et de l'eau H2O.",
              "A gauche : 2 x 2 = 4 atomes O. A droite : 2 (dans CO2) + 2 (dans les 2 H2O) = 4 atomes O. C'est equilibre.",
              "Pour apporter assez de dioxygene et eviter la combustion incomplete (CO toxique)."
            ],
            piege: "Le triangle du feu : combustible + comburant + energie d'activation."
          },
          {
            id: "pc_comb_03",
            titre: "La laine de fer qui brule",
            diff: "difficile",
            enonce: "On enflamme de la laine de fer (paille de fer) a l'air libre, posee sur une balance. On observe que sa masse augmente.",
            questions: [
              "Avec quel gaz de l'air le fer reagit-il ?",
              "Pourquoi la masse du solide augmente-t-elle alors que le fer brule ?",
              "Cela contredit-il la conservation de la masse ?",
              "Nomme le produit forme."
            ],
            correction: [
              "Avec le dioxygene O2 de l'air.",
              "Le fer fixe les atomes d'oxygene de l'air : la masse du solide augmente d'autant.",
              "Non : si on comptait aussi le dioxygene consomme, la masse totale se conserve.",
              "De l'oxyde de fer."
            ],
            piege: "Le solide gagne la masse de l'oxygene capte ; rien n'est cree, tout se conserve."
          },
          {
            id: "pc_comb_04",
            titre: "Le triangle du feu",
            diff: "facile",
            enonce: "Pour qu'un feu existe, il faut reunir trois elements : un combustible, un comburant et une source de chaleur.",
            questions: [
              "Comment s'appelle le schema de ces trois elements ?",
              "Quel est le comburant le plus courant ?",
              "Pour eteindre un feu, que peut-on retirer ?",
              "Pourquoi souffler peut-il eteindre une petite flamme mais attiser un grand feu ?"
            ],
            correction: [
              "Le triangle du feu.",
              "Le dioxygene de l'air.",
              "L'un des trois : le combustible, le comburant (etouffer) ou la chaleur (refroidir).",
              "Souffler retire la chaleur d'une petite flamme ; sur un grand feu, on apporte surtout du dioxygene qui l'alimente."
            ],
            piege: "Retirer UN seul cote du triangle du feu suffit a eteindre le feu."
          },
          {
            id: "pc_comb_05",
            titre: "Le rechaud a butane",
            diff: "moyen",
            enonce: "Un rechaud brule du butane. La combustion complete produit du dioxyde de carbone et de l'eau.",
            questions: [
              "Quel gaz, teste a l'eau de chaux, prouve la formation de CO2 ?",
              "Comment mettre en evidence la formation d'eau ?",
              "Qu'est-ce qui differencie une combustion complete d'une incomplete ?",
              "Quel danger represente une combustion incomplete dans une piece fermee ?"
            ],
            correction: [
              "Le dioxyde de carbone : il trouble l'eau de chaux.",
              "Avec du sulfate de cuivre anhydre (blanc) qui bleuit en presence d'eau, ou la buee qui se depose.",
              "Complete : assez de dioxygene (flamme bleue) ; incomplete : manque de dioxygene (flamme jaune, suie).",
              "La formation de monoxyde de carbone CO, un gaz toxique et mortel."
            ],
            piege: "Flamme bleue = combustion complete ; flamme jaune et suie = incomplete (danger CO)."
          },
          {
            id: "pc_comb_06",
            titre: "Bruler de l'ethanol",
            diff: "moyen",
            enonce: "On brule de l'ethanol. La masse d'ethanol diminue et il se forme des gaz.",
            questions: [
              "Une combustion est-elle une transformation physique ou chimique ?",
              "Cite les reactifs.",
              "Pourquoi la masse d'ethanol semble-t-elle diminuer ?",
              "La masse totale (en comptant les gaz) est-elle conservee ?"
            ],
            correction: [
              "Chimique : de nouvelles substances (CO2, eau) se forment.",
              "L'ethanol (combustible) et le dioxygene (comburant).",
              "Parce que les produits formes sont des gaz qui s'echappent.",
              "Oui : en comptant tous les reactifs et tous les produits, la masse se conserve."
            ],
            piege: "La masse du combustible « disparait » dans les gaz produits, mais rien n'est perdu."
          },
          {
            id: "pc_comb_07",
            titre: "Le danger du monoxyde de carbone",
            diff: "moyen",
            enonce: "Une chaudiere a gaz mal reglee produit une flamme jaune au lieu d'une flamme bleue.",
            questions: [
              "Que revele une flamme jaune ?",
              "Quel gaz dangereux peut alors se former ?",
              "Pourquoi ce gaz est-il particulierement dangereux ?",
              "Quel appareil installe-t-on pour s'en proteger ?"
            ],
            correction: [
              "Une combustion incomplete (manque de dioxygene).",
              "Du monoxyde de carbone CO.",
              "Il est inodore, incolore et toxique : on ne le detecte pas sans appareil.",
              "Un detecteur de monoxyde de carbone."
            ],
            piege: "Le CO est mortel et indetectable par l'odorat : un detecteur est indispensable."
          },
          {
            id: "pc_comb_08",
            titre: "Le fer dans le dioxygene pur",
            diff: "moyen",
            enonce: "On plonge de la laine de fer incandescente dans un flacon de dioxygene pur : elle brule vivement avec des etincelles.",
            questions: [
              "Pourquoi la combustion est-elle plus vive dans le dioxygene pur que dans l'air ?",
              "Quel est le comburant ?",
              "Le fer est-il le combustible ou le comburant ?",
              "Quel solide se forme ?"
            ],
            correction: [
              "L'air ne contient que 21 % de dioxygene ; dans le dioxygene pur, il y en a beaucoup plus.",
              "Le dioxygene.",
              "Le combustible.",
              "De l'oxyde de fer."
            ],
            piege: "Plus il y a de comburant (dioxygene), plus la combustion est vive."
          },
          {
            id: "pc_comb_09",
            titre: "Le barbecue dans un garage",
            diff: "facile",
            enonce: "On ne doit jamais utiliser un barbecue au charbon dans un local ferme.",
            questions: [
              "Quel gaz dangereux peut s'accumuler ?",
              "Pourquoi ce gaz se forme-t-il ?",
              "Pourquoi le local ferme aggrave-t-il le danger ?",
              "Que ressent une personne intoxiquee au depart ?"
            ],
            correction: [
              "Le monoxyde de carbone CO.",
              "Par combustion incomplete du charbon (manque de dioxygene).",
              "Le dioxygene s'epuise et le CO s'accumule sans pouvoir s'evacuer.",
              "Des maux de tete, des nausees, de la fatigue (signes d'intoxication)."
            ],
            piege: "Jamais de combustion (barbecue, brasero) dans un local ferme : risque de CO."
          },
          {
            id: "pc_comb_10",
            titre: "Identifier les produits d'une combustion",
            diff: "difficile",
            enonce: "On recueille les gaz d'une combustion d'hydrocarbure. Un test trouble l'eau de chaux ; un autre fait bleuir le sulfate de cuivre anhydre.",
            questions: [
              "Que prouve le trouble de l'eau de chaux ?",
              "Que prouve le bleuissement du sulfate de cuivre anhydre ?",
              "Quels sont donc les deux produits formes ?",
              "De quels elements l'hydrocarbure de depart est-il forme ?"
            ],
            correction: [
              "La presence de dioxyde de carbone CO2.",
              "La presence d'eau H2O.",
              "Du dioxyde de carbone et de l'eau.",
              "De carbone et d'hydrogene (on retrouve C dans CO2 et H dans H2O)."
            ],
            piege: "Eau de chaux troublee -> CO2 ; sulfate de cuivre anhydre qui bleuit -> eau."
          },
          {
            id: "pc_comb_11",
            titre: "Une reaction qui chauffe",
            diff: "facile",
            enonce: "La combustion du gaz libere de la chaleur et de la lumiere.",
            questions: [
              "Une combustion est-elle exothermique ou endothermique ?",
              "Que signifie « exothermique » ?",
              "Donne une application qui utilise la chaleur d'une combustion.",
              "Faut-il un apport d'energie pour demarrer une combustion ?"
            ],
            correction: [
              "Exothermique.",
              "Qui libere de la chaleur vers l'exterieur.",
              "Le chauffage, la cuisson, les moteurs thermiques...",
              "Oui : une source de chaleur (etincelle, flamme) pour atteindre la temperature d'inflammation."
            ],
            piege: "La combustion LIBERE de l'energie, mais il en faut un peu pour la demarrer."
          }
        ]
      },

      /* =========== THEME 5 : MASSE VOLUMIQUE ET CONCENTRATION =========== */
      {
        id: "masse_volumique",
        titre: "Masse volumique et concentration",
        exos: [
          {
            id: "pc_mv_01",
            titre: "La masse volumique du cuivre",
            diff: "moyen",
            enonce: "Un echantillon de cuivre a une masse de 89 g et un volume de 10 cm3.",
            questions: [
              "Rappelle la formule de la masse volumique.",
              "Calcule la masse volumique du cuivre en g/cm3.",
              "L'eau a une masse volumique de 1 g/cm3 : le cuivre coule-t-il dans l'eau ?",
              "Quel volume occuperaient 178 g de ce cuivre ?"
            ],
            correction: [
              "rho = m / V (masse volumique = masse divisee par volume).",
              "rho = 89 / 10 = 8,9 g/cm3.",
              "8,9 > 1 -> le cuivre est plus dense que l'eau, donc il coule.",
              "V = m / rho = 178 / 8,9 = 20 cm3."
            ],
            piege: "Garder des unites coherentes : des g et des cm3 donnent des g/cm3."
          },
          {
            id: "pc_mv_02",
            titre: "Concentration d'eau salee",
            diff: "facile",
            enonce: "On dissout 20 g de sel dans 250 mL d'eau.",
            questions: [
              "Donne la formule de la concentration en masse.",
              "Calcule la concentration en g/L.",
              "Le sel dissous est-il encore present dans l'eau ?",
              "Comment recuperer le sel sans le jeter ?"
            ],
            correction: [
              "c = m / V (concentration = masse de solute divisee par volume de solution).",
              "250 mL = 0,25 L, donc c = 20 / 0,25 = 80 g/L.",
              "Oui : il est dissous (melange homogene), il n'a pas disparu.",
              "Par evaporation de l'eau : le sel reste au fond."
            ],
            piege: "Convertir les mL en L avant de calculer une concentration en g/L."
          },
          {
            id: "pc_mv_03",
            titre: "Huile et eau",
            diff: "moyen",
            enonce: "Une bouteille contient 1,5 L d'huile dont la masse volumique est 0,92 g/mL.",
            questions: [
              "Convertis le volume en mL.",
              "Calcule la masse d'huile.",
              "L'huile flotte-t-elle sur l'eau ? Justifie.",
              "Pourquoi l'huile et l'eau ne se melangent-elles pas ?"
            ],
            correction: [
              "1,5 L = 1500 mL.",
              "m = rho x V = 0,92 x 1500 = 1380 g = 1,38 kg.",
              "0,92 < 1 (masse volumique de l'eau) -> l'huile flotte sur l'eau.",
              "Ce sont deux liquides non miscibles : ils forment un melange heterogene."
            ],
            piege: "m = rho x V. Moins dense que l'eau -> flotte ; plus dense -> coule."
          },
          {
            id: "pc_mv_04",
            titre: "Or ou argent ?",
            diff: "moyen",
            enonce: "Un bijou de masse 96,5 g a un volume de 5 cm3. On hesite entre l'argent (10,5 g/cm3) et l'or (19,3 g/cm3).",
            questions: [
              "Calcule la masse volumique du bijou.",
              "De quel metal s'agit-il ?",
              "La masse volumique depend-elle de la taille de l'echantillon ?",
              "Comment mesurer le volume d'un objet de forme compliquee ?"
            ],
            correction: [
              "rho = m / V = 96,5 / 5 = 19,3 g/cm3.",
              "De l'or (rho = 19,3 g/cm3).",
              "Non : c'est une propriete du materiau, elle ne depend pas de la quantite.",
              "Par deplacement d'eau dans une eprouvette graduee."
            ],
            piege: "La masse volumique identifie un materiau, quelle que soit la taille de l'echantillon."
          },
          {
            id: "pc_mv_05",
            titre: "Convertir les unites",
            diff: "moyen",
            enonce: "L'eau a une masse volumique de 1000 kg/m3.",
            questions: [
              "A combien de g/cm3 cela correspond-il ?",
              "Quelle est la masse de 1 L d'eau ?",
              "Quelle est la masse de 1 m3 d'eau ?",
              "Pour un meme volume, l'eau (1 kg/L) ou l'huile (0,92 kg/L) : lequel est le plus lourd ?"
            ],
            correction: [
              "1000 kg/m3 = 1 g/cm3.",
              "1 L d'eau a une masse de 1 kg (1000 g).",
              "1 m3 = 1000 L, soit 1000 kg (1 tonne).",
              "L'eau (1 kg) est plus lourde que l'huile (0,92 kg) pour le meme volume."
            ],
            piege: "A retenir : 1 g/cm3 = 1000 kg/m3, et 1 L d'eau = 1 kg."
          },
          {
            id: "pc_mv_06",
            titre: "Une boisson sucree",
            diff: "facile",
            enonce: "On prepare une boisson en dissolvant 30 g de sucre dans 0,5 L d'eau.",
            questions: [
              "Calcule la concentration en sucre (en g/L).",
              "Si on ajoute encore de l'eau, la concentration augmente-t-elle ou diminue-t-elle ?",
              "Que signifie « solution saturee » ?",
              "Le solute est-il l'eau ou le sucre ?"
            ],
            correction: [
              "c = m / V = 30 / 0,5 = 60 g/L.",
              "Elle diminue : la meme masse de sucre est repartie dans plus d'eau.",
              "Une solution qui ne peut plus dissoudre de solute (le surplus se depose).",
              "Le solute est le sucre ; l'eau est le solvant."
            ],
            piege: "Solute = ce qu'on dissout ; solvant = ce qui dissout (souvent l'eau)."
          },
          {
            id: "pc_mv_07",
            titre: "Flotte ou coule ?",
            diff: "facile",
            enonce: "On place dans l'eau (1 g/cm3) trois materiaux : liege (0,24 g/cm3), glace (0,92 g/cm3), fer (7,9 g/cm3).",
            questions: [
              "Lesquels flottent sur l'eau ?",
              "Lequel coule ?",
              "Pourquoi un glacon flotte-t-il en depassant un peu de l'eau ?",
              "Enonce la regle generale."
            ],
            correction: [
              "Le liege et la glace (masse volumique inferieure a 1 g/cm3) flottent.",
              "Le fer (7,9 > 1) coule.",
              "La glace est legerement moins dense que l'eau : elle flotte presque au ras de la surface.",
              "Un materiau moins dense que l'eau flotte ; plus dense, il coule."
            ],
            piege: "Comparer la masse volumique du materiau a celle du liquide (ici l'eau = 1 g/cm3)."
          },
          {
            id: "pc_mv_08",
            titre: "Mesurer un volume par deplacement",
            diff: "moyen",
            enonce: "Une eprouvette contient 50 mL d'eau. On y plonge un caillou : le niveau monte a 65 mL. Le caillou a une masse de 40 g.",
            questions: [
              "Quel est le volume du caillou ?",
              "Calcule sa masse volumique.",
              "Le caillou coule-t-il dans l'eau ?",
              "Comment s'appelle cette methode de mesure du volume ?"
            ],
            correction: [
              "65 - 50 = 15 mL, soit 15 cm3.",
              "rho = 40 / 15 = 2,7 g/cm3 (environ).",
              "Oui : 2,7 > 1, il coule.",
              "La methode par deplacement d'eau."
            ],
            piege: "Volume de l'objet = volume final - volume initial d'eau."
          },
          {
            id: "pc_mv_09",
            titre: "L'air a-t-il une masse ?",
            diff: "difficile",
            enonce: "L'air a une masse volumique d'environ 1,2 g/L.",
            questions: [
              "L'air a-t-il une masse ?",
              "Quelle est la masse de l'air contenu dans une piece de 30 m3 ? (1 m3 = 1000 L)",
              "Compare a la masse volumique de l'eau (1000 g/L).",
              "Pourquoi un ballon d'helium s'envole-t-il ?"
            ],
            correction: [
              "Oui : meme s'il est leger, l'air a une masse.",
              "30 m3 = 30 000 L ; m = 1,2 x 30 000 = 36 000 g = 36 kg.",
              "L'air (1,2 g/L) est bien moins dense que l'eau (1000 g/L).",
              "L'helium est moins dense que l'air : le ballon est pousse vers le haut."
            ],
            piege: "Meme un gaz a une masse ; l'air d'une piece pese plusieurs dizaines de kg."
          },
          {
            id: "pc_mv_10",
            titre: "Eau potable et nitrates",
            diff: "moyen",
            enonce: "Une eau est potable si sa concentration en nitrates ne depasse pas 50 mg/L. On mesure 30 mg de nitrates dans 0,5 L.",
            questions: [
              "Calcule la concentration en nitrates (en mg/L).",
              "Cette eau est-elle potable selon ce critere ?",
              "Que se passerait-il si on evaporait la moitie de l'eau ?",
              "La concentration depend-elle du volume de solution ?"
            ],
            correction: [
              "c = 30 / 0,5 = 60 mg/L.",
              "Non : 60 mg/L depasse la limite de 50 mg/L.",
              "Moins d'eau pour la meme masse : la concentration augmenterait.",
              "Oui : c = m / V depend du volume."
            ],
            piege: "Concentration = masse / volume ; reduire le volume augmente la concentration."
          },
          {
            id: "pc_mv_11",
            titre: "Trois liquides en couches",
            diff: "facile",
            enonce: "On verse doucement dans un tube : du miel (1,4 g/mL), de l'eau (1,0 g/mL) et de l'huile (0,9 g/mL).",
            questions: [
              "Quel liquide se place tout en bas ?",
              "Quel liquide se place tout en haut ?",
              "Dans quel ordre se rangent-ils, du bas vers le haut ?",
              "Pourquoi forment-ils des couches separees ?"
            ],
            correction: [
              "Le miel (le plus dense, 1,4 g/mL).",
              "L'huile (la moins dense, 0,9 g/mL).",
              "Miel (en bas), eau (au milieu), huile (en haut).",
              "Ce sont des liquides non miscibles : ils se classent par masse volumique."
            ],
            piege: "Le plus dense va au fond, le moins dense remonte a la surface."
          }
        ]
      },

      /* ========== THEME 6 : CIRCUITS ELECTRIQUES ET LOI D'OHM ========== */
      {
        id: "circuits_ohm",
        titre: "Circuits et loi d'Ohm",
        exos: [
          {
            id: "pc_ohm_01",
            titre: "Etude d'une resistance",
            diff: "moyen",
            enonce: "On mesure la tension U aux bornes d'une resistance R et l'intensite I qui la traverse. Le montage est represente par le schema ci-dessous.",
            schema: `<svg width="100%" viewBox="0 0 380 220" role="img" xmlns="http://www.w3.org/2000/svg"><title>Circuit avec generateur, resistance, amperemetre en serie et voltmetre en derivation</title><desc>Circuit en serie : generateur, resistance R, amperemetre A ; voltmetre V branche aux bornes de R.</desc><g stroke="#888780" stroke-width="2" fill="none" stroke-linecap="round"><line x1="70" y1="80" x2="150" y2="80"/><line x1="230" y1="80" x2="310" y2="80"/><line x1="70" y1="80" x2="70" y2="124"/><line x1="70" y1="136" x2="70" y2="190"/><line x1="70" y1="190" x2="310" y2="190"/><line x1="310" y1="80" x2="310" y2="114"/><line x1="310" y1="146" x2="310" y2="190"/></g><rect x="150" y="69" width="80" height="22" rx="3" fill="none" stroke="#888780" stroke-width="2"/><text x="190" y="84" text-anchor="middle" font-size="13" font-weight="500" fill="#888780" font-family="sans-serif">R</text><g stroke="#888780" stroke-width="2" stroke-linecap="round"><line x1="52" y1="124" x2="88" y2="124"/><line x1="62" y1="136" x2="78" y2="136"/></g><circle cx="310" cy="130" r="16" fill="none" stroke="#888780" stroke-width="2"/><text x="310" y="135" text-anchor="middle" font-size="14" font-weight="500" fill="#888780" font-family="sans-serif">A</text><circle cx="190" cy="34" r="16" fill="none" stroke="#378ADD" stroke-width="2"/><text x="190" y="39" text-anchor="middle" font-size="14" font-weight="500" fill="#378ADD" font-family="sans-serif">V</text><g stroke="#378ADD" stroke-width="1.5" fill="none" stroke-dasharray="3 3"><line x1="150" y1="80" x2="176" y2="46"/><line x1="230" y1="80" x2="204" y2="46"/></g><text x="40" y="118" text-anchor="middle" font-size="12" fill="#888780" font-family="sans-serif">G</text></svg>`,
            table: [
              ["U (V)", "0", "1,5", "3,0", "4,5", "6,0"],
              ["I (A)", "0", "0,03", "0,06", "0,09", "0,12"]
            ],
            questions: [
              "Comment sont branches le voltmetre (V) et l'amperemetre (A) ?",
              "Montre que U est proportionnelle a I.",
              "Calcule la valeur de la resistance R.",
              "Quelle intensite traverse R si U = 2,4 V ?"
            ],
            correction: [
              "Le voltmetre est branche en derivation (en parallele) aux bornes de R ; l'amperemetre est branche en serie dans le circuit.",
              "U / I = 1,5/0,03 = 50 ; 3,0/0,06 = 50 ; 4,5/0,09 = 50. Le rapport est constant -> U et I sont proportionnelles.",
              "Loi d'Ohm : U = R x I, donc R = U / I = 1,5 / 0,03 = 50 ohms.",
              "I = U / R = 2,4 / 50 = 0,048 A = 48 mA."
            ],
            piege: "U en volts, I en amperes -> R en ohms. Penser a convertir les mA en A."
          },
          {
            id: "pc_ohm_02",
            titre: "Appliquer la loi d'Ohm",
            diff: "facile",
            enonce: "Une resistance de 220 ohms est traversee par un courant d'intensite 0,02 A.",
            questions: [
              "Enonce la loi d'Ohm.",
              "Calcule la tension aux bornes de la resistance.",
              "Si on double l'intensite, que devient la tension ?",
              "Donne les unites de U, I et R."
            ],
            correction: [
              "La tension est proportionnelle a l'intensite : U = R x I.",
              "U = 220 x 0,02 = 4,4 V.",
              "Elle double aussi (proportionnalite) : 8,8 V.",
              "U en volts (V), I en amperes (A), R en ohms (symbole oméga)."
            ],
            piege: "U = R x I : si l'intensite double, la tension double."
          },
          {
            id: "pc_ohm_03",
            titre: "Serie ou derivation ?",
            diff: "moyen",
            enonce: "Dans un premier circuit, une pile alimente deux lampes identiques en serie. Dans un second circuit, les deux lampes sont branchees en derivation.",
            questions: [
              "Dans le circuit en serie, qu'arrive-t-il si une lampe grille ?",
              "Et dans le circuit en derivation ?",
              "Dans quel montage l'intensite est-elle la meme partout ?",
              "Pourquoi les installations des maisons sont-elles en derivation ?"
            ],
            correction: [
              "L'autre lampe s'eteint aussi : le circuit est ouvert.",
              "L'autre lampe continue de briller : chaque branche est independante.",
              "Dans le circuit en serie (une seule boucle) : l'intensite est la meme partout.",
              "Pour que chaque appareil fonctionne independamment et sous la meme tension."
            ],
            piege: "En serie : meme intensite partout. En derivation : meme tension sur chaque branche."
          },
          {
            id: "pc_ohm_04",
            titre: "Calculer une resistance",
            diff: "facile",
            enonce: "Pour une resistance, on mesure U = 9 V quand l'intensite vaut I = 0,045 A.",
            questions: [
              "Calcule la resistance R.",
              "Donne le resultat en ohms.",
              "Que vaut U si I = 0,090 A (resistance inchangee) ?",
              "La caracteristique d'une resistance est-elle une droite ?"
            ],
            correction: [
              "R = U / I = 9 / 0,045 = 200.",
              "R = 200 ohms.",
              "I a double, donc U double : U = 18 V.",
              "Oui : une droite passant par l'origine (U proportionnelle a I)."
            ],
            piege: "Pour une resistance, la caracteristique U = f(I) est une droite passant par l'origine."
          },
          {
            id: "pc_ohm_05",
            titre: "Mesurer une intensite",
            diff: "facile",
            enonce: "Dans un circuit serie, on veut mesurer l'intensite du courant qui traverse une lampe.",
            questions: [
              "Quel appareil utilise-t-on ?",
              "Comment doit-il etre branche ?",
              "Quelle est l'unite de l'intensite ?",
              "Dans un circuit serie, l'intensite est-elle la meme dans la lampe et dans la pile ?"
            ],
            correction: [
              "Un amperemetre.",
              "En serie, dans la branche ou l'on veut mesurer l'intensite.",
              "L'ampere (A).",
              "Oui : dans un circuit serie (une seule boucle), l'intensite est la meme partout."
            ],
            piege: "Amperemetre = en serie ; voltmetre = en derivation. Ne pas inverser."
          },
          {
            id: "pc_ohm_06",
            titre: "Le court-circuit",
            diff: "moyen",
            enonce: "On relie directement les deux bornes d'une pile par un fil de tres faible resistance.",
            questions: [
              "Comment appelle-t-on cette situation ?",
              "Que devient l'intensite du courant ?",
              "Quel risque cela presente-t-il ?",
              "Pourquoi place-t-on des fusibles ou des disjoncteurs dans une installation ?"
            ],
            correction: [
              "Un court-circuit.",
              "L'intensite devient tres grande (la resistance est quasi nulle).",
              "Un fort echauffement des fils, avec risque d'incendie.",
              "Pour couper le courant automatiquement en cas de surintensite."
            ],
            piege: "Une faible resistance donne une tres forte intensite (loi d'Ohm : I = U / R)."
          },
          {
            id: "pc_ohm_07",
            titre: "Reconnaitre les dipoles",
            diff: "facile",
            enonce: "On classe des dipoles : pile, lampe, resistance, interrupteur, moteur.",
            questions: [
              "Lequel est un generateur ?",
              "Cite deux recepteurs.",
              "A quoi sert l'interrupteur ?",
              "Que faut-il pour qu'un courant circule dans un circuit ?"
            ],
            correction: [
              "La pile (elle fournit l'energie electrique).",
              "La lampe, le moteur, la resistance (ils consomment l'energie).",
              "A ouvrir ou fermer le circuit (laisser passer ou couper le courant).",
              "Un generateur et un circuit ferme (une boucle complete)."
            ],
            piege: "Generateur = fournit l'energie ; recepteur = la consomme."
          },
          {
            id: "pc_ohm_08",
            titre: "La tension d'une pile",
            diff: "facile",
            enonce: "Une pile porte l'indication 4,5 V. On la branche a une lampe.",
            questions: [
              "Que signifie l'indication 4,5 V ?",
              "Avec quel appareil mesure-t-on une tension ?",
              "Comment branche-t-on cet appareil ?",
              "Que mesure-t-on aux bornes d'une pile quand le circuit est ouvert ?"
            ],
            correction: [
              "La tension fournie par la pile est de 4,5 volts.",
              "Un voltmetre.",
              "En derivation (en parallele) aux bornes du dipole.",
              "Environ 4,5 V (la tension de la pile)."
            ],
            piege: "Le voltmetre se branche en derivation ; il mesure une tension en volts."
          },
          {
            id: "pc_ohm_09",
            titre: "Calculer une intensite",
            diff: "moyen",
            enonce: "Une resistance de 100 ohms est soumise a une tension de 5 V.",
            questions: [
              "Quelle formule relie I, U et R ?",
              "Calcule l'intensite du courant.",
              "Donne le resultat en mA.",
              "Si on augmente R sans changer U, l'intensite augmente-t-elle ?"
            ],
            correction: [
              "I = U / R (a partir de U = R x I).",
              "I = 5 / 100 = 0,05 A.",
              "0,05 A = 50 mA.",
              "Non : si R augmente (U constant), I diminue."
            ],
            piege: "I = U / R ; a tension fixe, plus R est grande, plus I est petite."
          },
          {
            id: "pc_ohm_10",
            titre: "Lampe sous trop de tension",
            diff: "facile",
            enonce: "Une lampe prevue pour 6 V est branchee sur une pile de 9 V.",
            questions: [
              "La tension recue est-elle superieure ou inferieure a sa valeur nominale ?",
              "Que risque-t-il d'arriver a la lampe ?",
              "Et si on la branchait sur une pile de 3 V ?",
              "Que represente la valeur nominale d'une lampe ?"
            ],
            correction: [
              "Superieure (9 V > 6 V).",
              "Elle risque de griller (surtension).",
              "Elle brillerait faiblement (sous-tension).",
              "La tension pour laquelle elle fonctionne normalement."
            ],
            piege: "Trop de tension fait griller la lampe ; pas assez, elle brille faiblement."
          },
          {
            id: "pc_ohm_11",
            titre: "Conducteur ou isolant ?",
            diff: "facile",
            enonce: "On teste differents materiaux dans un circuit avec une lampe : fer, cuivre, plastique, bois sec, verre.",
            questions: [
              "Lesquels laissent briller la lampe (conducteurs) ?",
              "Lesquels sont des isolants ?",
              "Pourquoi entoure-t-on les fils electriques de plastique ?",
              "Les metaux sont-ils en general conducteurs ou isolants ?"
            ],
            correction: [
              "Le fer et le cuivre (les metaux) sont conducteurs.",
              "Le plastique, le bois sec et le verre sont isolants.",
              "Le plastique est isolant : il protege de l'electrisation.",
              "En general conducteurs."
            ],
            piege: "Les metaux conduisent le courant ; plastique, verre et bois sec sont isolants."
          }
        ]
      },

      /* ========== THEME 7 : ENERGIE ET PUISSANCE ELECTRIQUE ========== */
      {
        id: "energie_puissance",
        titre: "Energie et puissance",
        exos: [
          {
            id: "pc_ener_01",
            titre: "Le radiateur electrique",
            diff: "moyen",
            enonce: "Un radiateur electrique porte l'indication 1500 W. Il fonctionne pendant 2 heures.",
            questions: [
              "Que represente la puissance, en watts ?",
              "Calcule l'energie consommee en watt-heures (Wh), puis en kWh.",
              "Si 1 kWh coute 0,20 euro, quel est le cout du fonctionnement ?",
              "Donne la formule reliant energie, puissance et duree."
            ],
            correction: [
              "La puissance est l'energie consommee (ou fournie) chaque seconde.",
              "E = P x t = 1500 x 2 = 3000 Wh = 3 kWh.",
              "3 x 0,20 = 0,60 euro.",
              "E = P x t."
            ],
            piege: "1 kWh = 1000 Wh. Utiliser des heures pour obtenir des Wh."
          },
          {
            id: "pc_ener_02",
            titre: "Puissance d'une lampe",
            diff: "moyen",
            enonce: "Une lampe est branchee sous une tension de 230 V et est traversee par une intensite de 0,26 A.",
            questions: [
              "Donne la formule de la puissance electrique en fonction de U et I.",
              "Calcule la puissance de la lampe (arrondis a l'unite).",
              "Cette lampe est-elle plus ou moins puissante qu'un four de 2000 W ?",
              "Quelle grandeur mesure-t-on en joules ?"
            ],
            correction: [
              "P = U x I.",
              "P = 230 x 0,26 = 59,8, soit environ 60 W.",
              "Bien moins puissante : 60 W est tres inferieur a 2000 W.",
              "L'energie se mesure en joules (J)."
            ],
            piege: "P = U x I en watts. L'energie, elle, se mesure en joules (ou en Wh)."
          },
          {
            id: "pc_ener_03",
            titre: "La centrale hydroelectrique",
            diff: "facile",
            enonce: "Dans une centrale hydroelectrique, l'eau retenue par un barrage tombe et fait tourner une turbine reliee a un alternateur.",
            questions: [
              "Quelle est la source d'energie au depart ?",
              "Cite la chaine de conversions d'energie.",
              "L'energie est-elle creee dans la centrale ?",
              "Cette source d'energie est-elle renouvelable ?"
            ],
            correction: [
              "L'energie de position (potentielle) de l'eau retenue en hauteur.",
              "Energie de position -> energie de mouvement de l'eau -> energie mecanique de la turbine -> energie electrique de l'alternateur.",
              "Non : elle est seulement convertie d'une forme a une autre, jamais creee.",
              "Oui : l'eau et son cycle se renouvellent en permanence."
            ],
            piege: "L'energie se conserve et se convertit : elle ne se cree pas et ne disparait pas."
          },
          {
            id: "pc_ener_04",
            titre: "L'energie en joules",
            diff: "moyen",
            enonce: "Un appareil de puissance 60 W fonctionne pendant 5 minutes.",
            questions: [
              "Convertis la duree en secondes.",
              "Calcule l'energie consommee en joules (E = P x t, avec t en secondes).",
              "Quelle est l'unite de l'energie dans le systeme international ?",
              "A combien de joules correspond 1 Wh ?"
            ],
            correction: [
              "5 min = 5 x 60 = 300 s.",
              "E = 60 x 300 = 18 000 J.",
              "Le joule (J).",
              "1 Wh = 3600 J."
            ],
            piege: "Pour des joules, la duree doit etre en secondes ; pour des Wh, en heures."
          },
          {
            id: "pc_ener_05",
            titre: "La facture d'electricite",
            diff: "moyen",
            enonce: "Une famille consomme 900 kWh en deux mois. Le prix est de 0,20 euro par kWh.",
            questions: [
              "Que represente le kWh ?",
              "Calcule le montant de la facture.",
              "Un appareil de 100 W allume 10 h consomme combien de kWh ?",
              "Cite une facon de reduire sa consommation."
            ],
            correction: [
              "Une unite d'energie (l'energie consommee).",
              "900 x 0,20 = 180 euros.",
              "E = P x t = 100 x 10 = 1000 Wh = 1 kWh.",
              "Eteindre les appareils inutiles, choisir des appareils basse consommation, limiter le chauffage..."
            ],
            piege: "Le kWh est une unite d'ENERGIE : puissance (kW) x duree (h) = energie (kWh)."
          },
          {
            id: "pc_ener_06",
            titre: "Renouvelable ou fossile ?",
            diff: "facile",
            enonce: "On classe des sources d'energie : soleil, charbon, vent, petrole, eau des barrages.",
            questions: [
              "Lesquelles sont renouvelables ?",
              "Lesquelles sont non renouvelables (fossiles) ?",
              "Pourquoi les energies fossiles posent-elles probleme ?",
              "Cite un avantage des energies renouvelables."
            ],
            correction: [
              "Le soleil, le vent et l'eau des barrages.",
              "Le charbon et le petrole (energies fossiles).",
              "Elles s'epuisent et leur combustion rejette du CO2 (gaz a effet de serre).",
              "Elles ne s'epuisent pas et polluent peu pendant leur fonctionnement."
            ],
            piege: "Renouvelable = qui se reconstitue a l'echelle humaine (soleil, vent, eau)."
          },
          {
            id: "pc_ener_07",
            titre: "L'energie d'une lampe",
            diff: "moyen",
            enonce: "Une lampe a incandescence transforme l'energie electrique qu'elle recoit.",
            questions: [
              "En quelles formes d'energie la convertit-elle ?",
              "Quelle forme est utile ? Laquelle est perdue ?",
              "Une lampe LED est-elle plus econome ? Pourquoi ?",
              "L'energie totale est-elle conservee lors de cette conversion ?"
            ],
            correction: [
              "En energie lumineuse et en energie thermique (chaleur).",
              "La lumiere est utile ; la chaleur est en grande partie perdue.",
              "Oui : la LED produit beaucoup de lumiere et tres peu de chaleur (meilleur rendement).",
              "Oui : l'energie se conserve (lumiere + chaleur = electricite recue)."
            ],
            piege: "Une lampe a incandescence gaspille beaucoup d'energie sous forme de chaleur."
          },
          {
            id: "pc_ener_08",
            titre: "Comparer deux appareils",
            diff: "moyen",
            enonce: "On compare deux appareils : un seche-cheveux (1800 W) et une lampe (15 W).",
            questions: [
              "Lequel consomme le plus d'energie pour une meme duree ?",
              "Calcule l'energie consommee par le seche-cheveux en 10 min (en Wh).",
              "Calcule l'energie consommee par la lampe en 10 min (en Wh).",
              "En quelle unite mesure-t-on la puissance ?"
            ],
            correction: [
              "Le seche-cheveux (1800 W, bien plus que 15 W).",
              "10 min = 1/6 h ; E = 1800 x (1/6) = 300 Wh.",
              "E = 15 x (1/6) = 2,5 Wh.",
              "En watts (W)."
            ],
            piege: "A duree egale, plus la puissance est grande, plus l'energie consommee est grande."
          },
          {
            id: "pc_ener_09",
            titre: "Calculer une tension",
            diff: "moyen",
            enonce: "Un moteur de puissance 24 W est traverse par une intensite de 2 A.",
            questions: [
              "Quelle formule relie P, U et I ?",
              "Calcule la tension aux bornes du moteur.",
              "Donne l'unite de la puissance et celle de la tension.",
              "Si l'intensite double a tension constante, que devient la puissance ?"
            ],
            correction: [
              "P = U x I.",
              "U = P / I = 24 / 2 = 12 V.",
              "Puissance en watts (W), tension en volts (V).",
              "Elle double aussi (P = U x I)."
            ],
            piege: "On isole la tension avec U = P / I."
          },
          {
            id: "pc_ener_10",
            titre: "L'effet Joule",
            diff: "facile",
            enonce: "Quand un courant traverse une resistance, elle chauffe : c'est l'effet Joule.",
            questions: [
              "En quelle forme d'energie l'energie electrique est-elle convertie ?",
              "Cite un appareil qui utilise volontairement l'effet Joule.",
              "Dans un ordinateur, l'effet Joule est-il utile ou genant ?",
              "Pourquoi les appareils chauffent-ils quand ils fonctionnent longtemps ?"
            ],
            correction: [
              "En energie thermique (chaleur).",
              "Un radiateur electrique, un grille-pain, un fer a repasser, une bouilloire...",
              "Genant : la chaleur produite doit etre evacuee (ventilateur).",
              "A cause de l'effet Joule dans leurs composants."
            ],
            piege: "L'effet Joule transforme l'electricite en chaleur (utile ou genante selon l'appareil)."
          },
          {
            id: "pc_ener_11",
            titre: "Incandescence ou LED ?",
            diff: "moyen",
            enonce: "Une ampoule a incandescence de 60 W et une LED de 8 W eclairent autant.",
            questions: [
              "Laquelle consomme le moins d'energie ?",
              "Calcule l'energie consommee par chacune en 5 h (en Wh).",
              "Quelle economie d'energie la LED permet-elle sur 5 h ?",
              "Pourquoi conseille-t-on de remplacer les ampoules a incandescence ?"
            ],
            correction: [
              "La LED (8 W, contre 60 W).",
              "Incandescence : 60 x 5 = 300 Wh ; LED : 8 x 5 = 40 Wh.",
              "300 - 40 = 260 Wh economises.",
              "Elles gaspillent beaucoup d'energie en chaleur ; les LED sont bien plus economes."
            ],
            piege: "A eclairage egal, la LED consomme bien moins (moins de pertes en chaleur)."
          }
        ]
      },

      /* ============== THEME 8 : MOUVEMENTS ET VITESSE ============== */
      {
        id: "mouvement_vitesse",
        titre: "Mouvements et vitesse",
        exos: [
          {
            id: "pc_mvt_01",
            titre: "Le trajet du TGV",
            diff: "facile",
            enonce: "Un TGV parcourt 420 km entre deux gares en 1 h 30 min, sans s'arreter.",
            questions: [
              "Convertis la duree du trajet en heures.",
              "Calcule la vitesse moyenne du TGV en km/h.",
              "Convertis cette vitesse en m/s (arrondis a l'unite).",
              "Dans le referentiel du sol, un voyageur assis est-il en mouvement ou immobile ?"
            ],
            correction: [
              "1 h 30 min = 1 + 30/60 = 1,5 h.",
              "v = d / t = 420 / 1,5 = 280 km/h.",
              "280 / 3,6 = 77,8, soit environ 78 m/s.",
              "Dans le referentiel du sol, le voyageur se deplace avec le train : il est en mouvement."
            ],
            piege: "Pour passer de km/h a m/s, on divise par 3,6. Le mouvement depend du referentiel."
          },
          {
            id: "pc_mvt_02",
            titre: "Le sprint du coureur",
            diff: "facile",
            enonce: "Un coureur parcourt 100 m en 12,5 s.",
            questions: [
              "Rappelle la formule de la vitesse moyenne.",
              "Calcule sa vitesse moyenne en m/s.",
              "Convertis cette vitesse en km/h.",
              "Sa vitesse est-elle constante pendant toute la course ?"
            ],
            correction: [
              "v = d / t.",
              "v = 100 / 12,5 = 8 m/s.",
              "8 x 3,6 = 28,8 km/h.",
              "Non : c'est une vitesse MOYENNE ; il accelere au depart puis ralentit (mouvement non uniforme)."
            ],
            piege: "Pour passer de m/s a km/h, on multiplie par 3,6."
          },
          {
            id: "pc_mvt_03",
            titre: "Immobile ou en mouvement ?",
            diff: "moyen",
            enonce: "Dans un train qui roule, Lea est assise a sa place et son voisin marche dans le couloir.",
            questions: [
              "Lea est-elle en mouvement par rapport au sol ?",
              "Lea est-elle en mouvement par rapport au train ?",
              "Qu'appelle-t-on le « referentiel » ?",
              "Le mouvement d'un objet depend-il du point de vue choisi ?"
            ],
            correction: [
              "Oui : elle avance avec le train par rapport au sol.",
              "Non : elle est immobile par rapport au train.",
              "C'est l'objet (ou le lieu) par rapport auquel on etudie le mouvement.",
              "Oui : le mouvement est relatif, il depend du referentiel choisi."
            ],
            piege: "Toujours preciser le referentiel avant de dire « en mouvement » ou « immobile »."
          },
          {
            id: "pc_mvt_04",
            titre: "La distance parcourue",
            diff: "moyen",
            enonce: "Une voiture roule a la vitesse constante de 90 km/h pendant 20 minutes.",
            questions: [
              "Convertis la duree en heures.",
              "Calcule la distance parcourue (d = v x t).",
              "Convertis 90 km/h en m/s.",
              "Le mouvement est-il uniforme ? Pourquoi ?"
            ],
            correction: [
              "20 min = 20/60 h, soit environ 0,33 h.",
              "d = 90 x (20/60) = 30 km.",
              "90 / 3,6 = 25 m/s.",
              "Oui : la vitesse est constante (mouvement uniforme)."
            ],
            piege: "d = v x t ; mettre la duree en heures avec une vitesse en km/h."
          },
          {
            id: "pc_mvt_05",
            titre: "Les trajectoires",
            diff: "facile",
            enonce: "On observe trois mouvements : une bille qui tombe tout droit, une voiture sur un rond-point, une nacelle de grande roue.",
            questions: [
              "Quelle est la trajectoire de la bille qui tombe ?",
              "Quelle est la trajectoire de la voiture sur le rond-point ?",
              "La nacelle de grande roue a-t-elle une trajectoire circulaire ?",
              "Qu'est-ce que la trajectoire d'un objet ?"
            ],
            correction: [
              "Rectiligne (une ligne droite).",
              "Circulaire (un cercle).",
              "Oui, circulaire.",
              "C'est l'ensemble des positions occupees par l'objet au cours du temps."
            ],
            piege: "Rectiligne = ligne droite ; circulaire = cercle ; curviligne = courbe quelconque."
          },
          {
            id: "pc_mvt_06",
            titre: "Vitesse moyenne d'un cycliste",
            diff: "moyen",
            enonce: "Un cycliste parcourt 30 km en 1 h, puis 10 km en 30 min.",
            questions: [
              "Quelle distance totale a-t-il parcourue ?",
              "Quelle duree totale a-t-il mis ?",
              "Calcule sa vitesse moyenne sur tout le trajet (en km/h).",
              "Cette vitesse moyenne est-elle sa vitesse a chaque instant ?"
            ],
            correction: [
              "30 + 10 = 40 km.",
              "1 h + 0,5 h = 1,5 h.",
              "v = 40 / 1,5 = 26,7 km/h (environ).",
              "Non : la vitesse moyenne ne dit rien des variations a chaque instant."
            ],
            piege: "La vitesse moyenne se calcule sur la distance TOTALE et la duree TOTALE."
          },
          {
            id: "pc_mvt_07",
            titre: "Accelere, uniforme, ralenti",
            diff: "facile",
            enonce: "On etudie un objet : phase 1 sa vitesse augmente, phase 2 sa vitesse reste constante, phase 3 sa vitesse diminue.",
            questions: [
              "Comment qualifie-t-on le mouvement en phase 1 ?",
              "En phase 2 ?",
              "En phase 3 ?",
              "Donne un exemple concret pour la phase 3."
            ],
            correction: [
              "Mouvement accelere.",
              "Mouvement uniforme.",
              "Mouvement ralenti (decelere).",
              "Une voiture qui freine a l'approche d'un feu rouge."
            ],
            piege: "Accelere = vitesse augmente ; uniforme = vitesse constante ; ralenti = vitesse diminue."
          },
          {
            id: "pc_mvt_08",
            titre: "La distance de reaction",
            diff: "moyen",
            enonce: "Une voiture roule a 72 km/h. Le conducteur met 1 s a reagir avant de freiner.",
            questions: [
              "Convertis 72 km/h en m/s.",
              "Quelle distance la voiture parcourt-elle pendant la seconde de reaction ?",
              "Pourquoi la distance d'arret augmente-t-elle avec la vitesse ?",
              "Que conseille-t-on aux conducteurs pour limiter ce risque ?"
            ],
            correction: [
              "72 / 3,6 = 20 m/s.",
              "d = v x t = 20 x 1 = 20 m.",
              "Plus on va vite, plus on parcourt de distance avant de s'arreter.",
              "Respecter les limitations de vitesse et garder ses distances de securite."
            ],
            piege: "72 km/h = 20 m/s ; en 1 s on parcourt deja 20 m sans avoir freine."
          },
          {
            id: "pc_mvt_09",
            titre: "Mouvement rectiligne uniforme",
            diff: "facile",
            enonce: "Un objet se deplace en ligne droite et parcourt 10 m chaque seconde, regulierement.",
            questions: [
              "Sa vitesse est-elle constante ?",
              "Quelle est sa vitesse en m/s ?",
              "Comment qualifie-t-on ce mouvement ?",
              "Quelle distance aura-t-il parcourue au bout de 6 s ?"
            ],
            correction: [
              "Oui : il parcourt la meme distance a chaque seconde.",
              "10 m/s.",
              "Un mouvement rectiligne uniforme.",
              "d = v x t = 10 x 6 = 60 m."
            ],
            piege: "Rectiligne uniforme = trajectoire droite ET vitesse constante."
          },
          {
            id: "pc_mvt_10",
            titre: "Le feu d'artifice",
            diff: "moyen",
            enonce: "Le son se propage a 340 m/s et la lumiere a 300 000 km/s.",
            questions: [
              "Convertis 300 000 km/s en m/s.",
              "Combien de fois la lumiere est-elle plus rapide que le son (ordre de grandeur) ?",
              "Pourquoi voit-on un feu d'artifice exploser avant d'entendre la detonation ?",
              "Le son a-t-il besoin d'un milieu pour se propager ?"
            ],
            correction: [
              "300 000 km/s = 300 000 000 m/s, soit 3 x 10^8 m/s.",
              "Environ un million de fois plus rapide.",
              "La lumiere arrive quasi instantanement, le son met du temps a parcourir la distance.",
              "Oui (air, eau, solide) ; il ne se propage pas dans le vide."
            ],
            piege: "Lumiere quasi instantanee ; le son, lui, met un temps perceptible a arriver."
          },
          {
            id: "pc_mvt_11",
            titre: "Le referentiel terrestre",
            diff: "facile",
            enonce: "Pour etudier le mouvement d'une voiture sur une route, on choisit le sol comme reference.",
            questions: [
              "Comment appelle-t-on ce choix de reference ?",
              "Par rapport au sol, le conducteur est-il en mouvement ?",
              "Par rapport a sa voiture, le conducteur est-il en mouvement ?",
              "Le Soleil semble se deplacer dans le ciel : dans quel referentiel ?"
            ],
            correction: [
              "Le referentiel (ici le referentiel terrestre).",
              "Oui, il avance avec la voiture.",
              "Non, il est immobile par rapport a la voiture.",
              "Dans le referentiel terrestre (en realite, c'est la Terre qui tourne)."
            ],
            piege: "Un meme objet peut etre en mouvement ou immobile selon le referentiel choisi."
          }
        ]
      },

      /* ============ THEME 9 : GRAVITATION, POIDS ET MASSE ============ */
      {
        id: "gravitation",
        titre: "Gravitation, poids et masse",
        exos: [
          {
            id: "pc_grav_01",
            titre: "Masse et poids",
            diff: "moyen",
            enonce: "Sur Terre, l'intensite de la pesanteur vaut g = 10 N/kg. Un objet a une masse de 3 kg.",
            questions: [
              "Quelle est la difference entre la masse et le poids ?",
              "Donne la formule reliant le poids P et la masse m.",
              "Calcule le poids de l'objet sur Terre.",
              "Sa masse change-t-elle sur la Lune ? Et son poids ?"
            ],
            correction: [
              "La masse (en kg) est la quantite de matiere, elle est constante ; le poids (en N) est une force d'attraction, qui depend de l'astre.",
              "P = m x g.",
              "P = 3 x 10 = 30 N.",
              "La masse ne change pas (3 kg) ; le poids diminue car g est plus faible sur la Lune."
            ],
            piege: "La masse est en kilogrammes (kg), le poids en newtons (N). Ne pas confondre."
          },
          {
            id: "pc_grav_02",
            titre: "Un astronaute sur la Lune",
            diff: "moyen",
            enonce: "Un astronaute a une masse de 70 kg. Sur la Lune, l'intensite de la pesanteur vaut g = 1,6 N/kg.",
            questions: [
              "Calcule son poids sur Terre (g = 10 N/kg).",
              "Calcule son poids sur la Lune.",
              "Combien de fois son poids est-il plus faible sur la Lune ?",
              "Pourquoi peut-il faire de grands bonds sur la Lune ?"
            ],
            correction: [
              "P = 70 x 10 = 700 N.",
              "P = 70 x 1,6 = 112 N.",
              "700 / 112 = 6,25, soit environ 6 fois plus faible.",
              "Son poids est bien plus faible : l'attraction de la Lune le retient moins."
            ],
            piege: "Meme masse partout, mais un poids different selon l'astre (a cause de g)."
          },
          {
            id: "pc_grav_03",
            titre: "La gravitation dans l'Univers",
            diff: "facile",
            enonce: "La gravitation est l'attraction mutuelle qui s'exerce entre deux corps qui possedent une masse.",
            questions: [
              "De quoi depend la force de gravitation entre deux corps ?",
              "Qu'est-ce qui maintient la Terre en orbite autour du Soleil ?",
              "La gravitation agit-elle seulement sur Terre ?",
              "Pourquoi la Lune tourne-t-elle autour de la Terre ?"
            ],
            correction: [
              "De leurs masses (plus elles sont grandes, plus la force est grande) et de leur distance (plus ils sont proches, plus la force est grande).",
              "L'attraction gravitationnelle exercee par le Soleil.",
              "Non : elle agit dans tout l'Univers, entre tous les corps qui ont une masse.",
              "Parce que la Terre l'attire par gravitation."
            ],
            piege: "La gravitation augmente avec la masse et diminue avec la distance."
          },
          {
            id: "pc_grav_04",
            titre: "Le poids sur differentes planetes",
            diff: "moyen",
            enonce: "Un objet a une masse de 50 kg. On donne g : Terre 10 N/kg, Mars 3,7 N/kg, Jupiter 25 N/kg.",
            questions: [
              "Calcule son poids sur Terre.",
              "Calcule son poids sur Mars.",
              "Calcule son poids sur Jupiter.",
              "Sur quelle planete l'objet est-il le plus « lourd » ?"
            ],
            correction: [
              "P = 50 x 10 = 500 N.",
              "P = 50 x 3,7 = 185 N.",
              "P = 50 x 25 = 1250 N.",
              "Sur Jupiter (g le plus grand donne le poids le plus grand)."
            ],
            piege: "La masse (50 kg) ne change pas ; seul le poids varie selon g."
          },
          {
            id: "pc_grav_05",
            titre: "La pomme qui tombe",
            diff: "facile",
            enonce: "On lache une pomme : elle tombe vers le sol.",
            questions: [
              "Quelle force fait tomber la pomme ?",
              "Cette force est-elle dirigee vers le haut ou vers le bas ?",
              "Comment s'appelle le point ou s'applique le poids ?",
              "Sur la Lune, la pomme tomberait-elle plus vite ou moins vite ?"
            ],
            correction: [
              "Le poids (l'attraction de la Terre).",
              "Vers le bas (vers le centre de la Terre).",
              "Le centre de gravite de l'objet.",
              "Moins vite : la pesanteur y est plus faible (g = 1,6 N/kg)."
            ],
            piege: "Le poids est une force verticale, dirigee vers le bas, appliquee au centre de gravite."
          },
          {
            id: "pc_grav_06",
            titre: "Retrouver l'intensite de pesanteur",
            diff: "moyen",
            enonce: "Sur une planete inconnue, un objet de masse 8 kg a un poids de 24 N.",
            questions: [
              "Donne la formule reliant P, m et g.",
              "Calcule l'intensite de la pesanteur g sur cette planete.",
              "Cette planete a-t-elle une pesanteur plus faible que la Terre ?",
              "Sur cette planete, la masse de l'objet est-elle toujours 8 kg ?"
            ],
            correction: [
              "P = m x g.",
              "g = P / m = 24 / 8 = 3 N/kg.",
              "Oui : 3 N/kg est inferieur a 10 N/kg (Terre).",
              "Oui : la masse ne depend pas de la planete."
            ],
            piege: "On isole g avec g = P / m."
          },
          {
            id: "pc_grav_07",
            titre: "Le systeme solaire",
            diff: "facile",
            enonce: "Les planetes du systeme solaire tournent autour du Soleil.",
            questions: [
              "Quelle force les maintient en orbite ?",
              "Pourquoi le Soleil attire-t-il fortement les planetes ?",
              "Une planete proche du Soleil est-elle plus ou moins attiree qu'une planete lointaine ?",
              "La gravitation existe-t-elle aussi entre deux planetes ?"
            ],
            correction: [
              "La force de gravitation (l'attraction du Soleil).",
              "Parce que sa masse est enorme (plus la masse est grande, plus l'attraction est forte).",
              "Plus attiree : la force augmente quand la distance diminue.",
              "Oui, mais elle est faible car leurs masses sont petites devant celle du Soleil."
            ],
            piege: "L'attraction est plus forte si la masse est grande ET si la distance est petite."
          },
          {
            id: "pc_grav_08",
            titre: "Le poids change-t-il en altitude ?",
            diff: "moyen",
            enonce: "L'intensite de la pesanteur g diminue tres legerement quand on s'eloigne du centre de la Terre.",
            questions: [
              "Le poids d'un objet est-il exactement le meme au sommet d'une montagne et au niveau de la mer ?",
              "La masse de l'objet change-t-elle avec l'altitude ?",
              "Quelle grandeur depend de g : la masse ou le poids ?",
              "Sur Terre, quelle valeur de g utilise-t-on en general ?"
            ],
            correction: [
              "Non : il est tres legerement plus faible en altitude.",
              "Non, la masse ne change pas.",
              "Le poids (P = m x g).",
              "Environ g = 10 N/kg (valeur precise : 9,8 N/kg)."
            ],
            piege: "La masse est constante ; seul le poids varie (avec g)."
          },
          {
            id: "pc_grav_09",
            titre: "Retrouver une masse",
            diff: "moyen",
            enonce: "Sur Terre (g = 10 N/kg), un objet a un poids de 250 N.",
            questions: [
              "Donne la formule reliant m, P et g.",
              "Calcule la masse de l'objet.",
              "Donne le resultat en kg.",
              "Sur la Lune, cette masse serait-elle differente ?"
            ],
            correction: [
              "m = P / g.",
              "m = 250 / 10 = 25.",
              "25 kg.",
              "Non, la masse reste 25 kg partout."
            ],
            piege: "On isole la masse avec m = P / g."
          },
          {
            id: "pc_grav_10",
            titre: "La Terre et la Lune",
            diff: "facile",
            enonce: "La Terre attire la Lune, et la Lune attire la Terre.",
            questions: [
              "L'attraction est-elle a sens unique ou mutuelle ?",
              "Pourquoi est-ce la Lune qui tourne autour de la Terre, et pas l'inverse ?",
              "Cette attraction influence-t-elle les oceans ?",
              "La gravitation diminue-t-elle si la distance augmente ?"
            ],
            correction: [
              "Mutuelle : les deux corps s'attirent l'un l'autre.",
              "Parce que la Terre est beaucoup plus massive que la Lune.",
              "Oui : elle est responsable des marees.",
              "Oui : plus la distance est grande, plus la gravitation est faible."
            ],
            piege: "L'attraction gravitationnelle est toujours mutuelle (les deux corps s'attirent)."
          },
          {
            id: "pc_grav_11",
            titre: "La chute libre dans le vide",
            diff: "difficile",
            enonce: "Dans le vide, une plume et une bille lachees ensemble tombent exactement a la meme vitesse.",
            questions: [
              "Qu'est-ce qui ralentit la plume dans l'air ?",
              "Dans le vide, pourquoi tombent-elles ensemble ?",
              "La masse influence-t-elle la vitesse de chute dans le vide ?",
              "Quelle force agit sur les objets en chute ?"
            ],
            correction: [
              "La resistance de l'air (les frottements).",
              "Il n'y a plus de frottements de l'air dans le vide.",
              "Non : dans le vide, tous les objets tombent de la meme facon.",
              "Le poids (l'attraction de la Terre)."
            ],
            piege: "Sans air, tous les objets tombent a la meme vitesse, quelle que soit leur masse."
          }
        ]
      },

      /* ============== THEME 10 : LES SIGNAUX (SON ET LUMIERE) ============== */
      {
        id: "signaux",
        titre: "Les signaux : son et lumiere",
        exos: [
          {
            id: "pc_sig_01",
            titre: "L'orage",
            diff: "moyen",
            enonce: "Pendant un orage, on voit l'eclair puis on entend le tonnerre 6 secondes plus tard. Le son se deplace a 340 m/s dans l'air.",
            questions: [
              "Pourquoi voit-on l'eclair avant d'entendre le tonnerre ?",
              "Calcule la distance qui nous separe de l'orage.",
              "La lumiere est-elle plus rapide que le son ?",
              "Donne l'ordre de grandeur de la vitesse de la lumiere."
            ],
            correction: [
              "La lumiere va beaucoup plus vite que le son : elle nous parvient presque instantanement.",
              "d = v x t = 340 x 6 = 2040 m, soit environ 2 km.",
              "Oui : la lumiere est bien plus rapide que le son.",
              "Environ 300 000 km/s (soit 3 x 10^8 m/s)."
            ],
            piege: "d = v x t. A notre echelle, la lumiere est quasi instantanee."
          },
          {
            id: "pc_sig_02",
            titre: "La propagation du son",
            diff: "facile",
            enonce: "Un son est produit par la vibration d'un objet (corde, haut-parleur, voix...).",
            questions: [
              "Le son a-t-il besoin d'un milieu pour se propager ?",
              "Le son peut-il se propager dans le vide ?",
              "Cite un milieu ou le son va plus vite que dans l'air.",
              "Pourquoi faut-il proteger ses oreilles des sons trop forts ?"
            ],
            correction: [
              "Oui : il a besoin d'un milieu materiel (air, eau, solide) pour se propager.",
              "Non : dans le vide il n'y a pas de matiere a faire vibrer, donc pas de son.",
              "Dans l'eau ou dans un solide (le metal par exemple), le son va plus vite que dans l'air.",
              "Un son trop fort peut endommager l'audition de facon irreversible."
            ],
            piege: "Le son ne se propage PAS dans le vide, contrairement a la lumiere."
          },
          {
            id: "pc_sig_03",
            titre: "Frequence d'un son",
            diff: "difficile",
            enonce: "Un haut-parleur emet un son dont la periode vaut T = 0,004 s.",
            questions: [
              "Que represente la frequence d'un son ?",
              "Calcule la frequence (f = 1 / T) en hertz.",
              "Un son aigu a-t-il une frequence plus grande ou plus petite qu'un son grave ?",
              "Donne l'unite de la frequence."
            ],
            correction: [
              "Le nombre de vibrations par seconde.",
              "f = 1 / T = 1 / 0,004 = 250 Hz.",
              "Plus grande : un son aigu a une frequence elevee.",
              "Le hertz (Hz)."
            ],
            piege: "f = 1 / T. Aigu -> frequence haute ; grave -> frequence basse."
          },
          {
            id: "pc_sig_04",
            titre: "Le sonar",
            diff: "difficile",
            enonce: "Un sonar emet un son vers le fond marin. L'echo revient 0,4 s apres l'emission. Le son se propage a 1500 m/s dans l'eau.",
            questions: [
              "Quelle distance le son parcourt-il en tout (aller-retour) ?",
              "Quelle est la profondeur du fond marin ?",
              "Le son va-t-il plus vite dans l'eau ou dans l'air ?",
              "Pourquoi divise-t-on la distance par 2 ?"
            ],
            correction: [
              "d = v x t = 1500 x 0,4 = 600 m (aller-retour).",
              "Profondeur = 600 / 2 = 300 m.",
              "Plus vite dans l'eau (1500 m/s) que dans l'air (340 m/s).",
              "Parce que le son fait l'aller ET le retour : la profondeur est la moitie de la distance."
            ],
            piege: "Pour un echo, la distance reelle est la moitie de la distance parcourue (aller-retour)."
          },
          {
            id: "pc_sig_05",
            titre: "Voir un objet",
            diff: "facile",
            enonce: "On ne peut voir un objet que si de la lumiere venant de cet objet entre dans notre oeil.",
            questions: [
              "Un objet non lumineux peut-il etre vu dans le noir total ?",
              "Comment voit-on un objet eclaire (une chaise par exemple) ?",
              "Quelle est la difference entre une source primaire et un objet diffusant ?",
              "Cite une source primaire de lumiere."
            ],
            correction: [
              "Non : sans lumiere, aucun rayon n'entre dans l'oeil.",
              "Il recoit la lumiere d'une source et la renvoie (la diffuse) vers notre oeil.",
              "Une source primaire produit sa propre lumiere ; un objet diffusant renvoie la lumiere recue.",
              "Le Soleil, une lampe, une flamme, une etoile."
            ],
            piege: "La Lune n'est pas une source primaire : elle diffuse la lumiere du Soleil."
          },
          {
            id: "pc_sig_06",
            titre: "La vitesse de la lumiere",
            diff: "moyen",
            enonce: "La lumiere se propage a environ 300 000 km/s. Une etoile est tres eloignee.",
            questions: [
              "La lumiere a-t-elle besoin d'un milieu pour se propager ?",
              "Si la lumiere du Soleil met 500 s a nous parvenir, a combien de minutes cela correspond-il ?",
              "Que signifie « voir une etoile, c'est voir le passe » ?",
              "Compare la vitesse de la lumiere et celle du son."
            ],
            correction: [
              "Non : la lumiere se propage meme dans le vide (contrairement au son).",
              "500 s, soit environ 8 minutes.",
              "La lumiere a mis du temps a venir : on voit l'etoile telle qu'elle etait quand la lumiere est partie.",
              "La lumiere (300 000 km/s) est environ un million de fois plus rapide que le son (340 m/s)."
            ],
            piege: "La lumiere se propage dans le vide, le son non."
          },
          {
            id: "pc_sig_07",
            titre: "Communiquer avec des signaux",
            diff: "facile",
            enonce: "Les informations (television, telephone, internet) sont transportees par des signaux.",
            questions: [
              "Cite deux types de signaux utilises pour communiquer.",
              "La fibre optique utilise quel type de signal ?",
              "Un signal sonore peut-il se propager dans le vide de l'espace ?",
              "Pourquoi les satellites utilisent-ils des ondes et non du son ?"
            ],
            correction: [
              "Les signaux lumineux et les signaux electriques.",
              "Un signal lumineux (de la lumiere guidee dans la fibre).",
              "Non : le son ne se propage pas dans le vide.",
              "Parce que dans le vide de l'espace, seuls les signaux lumineux ou radio se propagent, pas le son."
            ],
            piege: "Dans l'espace (vide), on communique par signaux lumineux ou radio, jamais par le son."
          },
          {
            id: "pc_sig_08",
            titre: "Periode et frequence",
            diff: "moyen",
            enonce: "Un son a une frequence de 500 Hz.",
            questions: [
              "Que represente une frequence de 500 Hz ?",
              "Calcule la periode de ce son (T = 1 / f).",
              "Un son de 1000 Hz est-il plus aigu ou plus grave que celui-ci ?",
              "L'oreille humaine entend de 20 Hz a 20 000 Hz : ce son est-il audible ?"
            ],
            correction: [
              "500 vibrations par seconde.",
              "T = 1 / 500 = 0,002 s.",
              "Plus aigu (frequence plus elevee).",
              "Oui : 500 Hz est dans l'intervalle audible."
            ],
            piege: "T = 1 / f ; une frequence elevee correspond a un son aigu."
          },
          {
            id: "pc_sig_09",
            titre: "Le niveau sonore",
            diff: "facile",
            enonce: "Le niveau sonore se mesure en decibels (dB). Un concert peut atteindre 100 dB.",
            questions: [
              "A partir de quel niveau le son devient-il dangereux (ordre de grandeur) ?",
              "Quel risque court-on a ecouter de la musique trop forte ?",
              "Cite un moyen de se proteger en concert.",
              "Le danger depend-il aussi de la duree d'exposition ?"
            ],
            correction: [
              "A partir d'environ 85 dB, le son peut devenir dangereux.",
              "Une perte d'audition, parfois irreversible, et des acouphenes.",
              "Porter des bouchons d'oreille (et s'eloigner des enceintes).",
              "Oui : plus l'exposition est longue, plus le risque augmente."
            ],
            piege: "Au-dela d'environ 85 dB, surtout longtemps, l'audition est en danger."
          },
          {
            id: "pc_sig_10",
            titre: "La lumiere blanche",
            diff: "facile",
            enonce: "La lumiere blanche du Soleil peut etre decomposee par un prisme en plusieurs couleurs.",
            questions: [
              "Comment appelle-t-on l'ensemble des couleurs obtenues ?",
              "La lumiere blanche est-elle une lumiere simple ou composee ?",
              "Cite un phenomene naturel qui decompose la lumiere.",
              "De quelle couleur apparait un objet qui renvoie surtout la lumiere rouge ?"
            ],
            correction: [
              "Le spectre (de la lumiere blanche).",
              "Composee : elle contient plusieurs couleurs.",
              "L'arc-en-ciel.",
              "Rouge."
            ],
            piege: "La lumiere blanche est composee de toutes les couleurs du spectre."
          },
          {
            id: "pc_sig_11",
            titre: "La lumiere va tout droit",
            diff: "facile",
            enonce: "Dans un milieu transparent et homogene, la lumiere se propage en ligne droite.",
            questions: [
              "Comment se propage la lumiere dans l'air homogene ?",
              "Qu'est-ce qui prouve que la lumiere va en ligne droite ?",
              "Comment modelise-t-on un trajet de lumiere ?",
              "La lumiere peut-elle contourner un obstacle opaque ?"
            ],
            correction: [
              "En ligne droite.",
              "La formation d'ombres nettes derriere les objets opaques.",
              "Par un rayon de lumiere (une ligne droite flechee).",
              "Non : elle est arretee, ce qui cree une ombre."
            ],
            piege: "La lumiere se propage en ligne droite : elle ne contourne pas les obstacles (d'ou les ombres)."
          }
        ]
      }

    ]
  }
};

if (typeof window !== "undefined") { window.ANNALES = ANNALES; }
if (typeof module !== "undefined" && module.exports) { module.exports = ANNALES; }
