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
          },
          {
            id: "pc_ions_12",
            titre: "Analyse complete d'une solution",
            diff: "difficile",
            enonce: "Une solution S contient des ions cuivre et des ions chlorure. On preleve un echantillon : le papier pH indique pH = 5. On ajoute de la soude a cet echantillon : un precipite bleu apparait. Sur un autre prelevement, on ajoute du nitrate d'argent : un precipite blanc se forme.",
            questions: [
              "Identifie les deux ions presents et donne leurs formules.",
              "La solution S est-elle acide, neutre ou basique ?",
              "On dilue 10 fois la solution S. Le test a la soude donne-t-il encore un precipite bleu ? Justifie.",
              "Apres cette dilution, le pH se rapproche-t-il ou s'eloigne-t-il de 7 ?"
            ],
            correction: [
              "Precipite bleu a la soude -> ion cuivre Cu2+ ; precipite blanc au nitrate d'argent -> ion chlorure Cl-.",
              "pH 5 < 7 -> la solution est acide.",
              "Oui : les ions cuivre sont toujours presents (seulement moins concentres), le test reste positif.",
              "Diluer un acide rapproche son pH de 7 (le pH augmente)."
            ],
            piege: "Diluer reduit la concentration mais ne fait pas disparaitre les ions : les tests restent positifs."
          },
          {
            id: "pc_ions_13",
            titre: "Le pH d'une piscine",
            diff: "expert",
            enonce: "L'eau d'une piscine doit avoir un pH compris entre 7,0 et 7,4. Un technicien mesure pH = 6,2 : l'eau est trop acide. Pour corriger, il ajoute un produit basique, puis remesure : pH = 7,2.",
            questions: [
              "A pH 6,2, l'eau contient-elle plus d'ions H+ ou d'ions OH- ?",
              "Pourquoi l'ajout d'une base permet-il de faire remonter le pH ?",
              "Apres traitement, le pH vaut 7,2. Est-il conforme a la norme ?",
              "Si le technicien avait ajoute un acide par erreur, comment aurait evolue le pH ? L'eau aurait-elle ete conforme ?",
              "Un baigneur affirme que l'eau salee conduit mieux le courant. A-t-il raison ? Explique avec la notion d'ions."
            ],
            correction: [
              "pH 6,2 < 7 -> plus d'ions H+ que d'ions OH-.",
              "Une base apporte des ions OH- qui neutralisent une partie des ions H+ : le pH augmente.",
              "Oui : 7,2 est bien compris entre 7,0 et 7,4.",
              "Le pH aurait diminue (en dessous de 6,2), l'eau aurait ete encore plus acide : non conforme.",
              "Oui : le sel se dissocie en ions, et ce sont les ions qui rendent l'eau conductrice."
            ],
            piege: "Une base fait monter le pH (apporte des OH-) ; un acide le fait baisser (apporte des H+)."
          },
          {
            id: "pc_ions_14",
            titre: "Trois precipites a la soude",
            diff: "moyen",
            enonce: "On verse de la soude dans trois tubes A, B et C. Tube A : precipite bleu. Tube B : precipite vert. Tube C : precipite rouille.",
            questions: [
              "Identifie l'ion metallique present dans chaque tube.",
              "Donne la formule de l'ion du tube A.",
              "Lequel des trois tubes contient des ions fer III ?",
              "Quel reactif faut-il utiliser pour tester la presence d'ions chlorure ?"
            ],
            correction: [
              "A : ion cuivre ; B : ion fer II ; C : ion fer III.",
              "Cu2+.",
              "Le tube C (precipite rouille).",
              "Le nitrate d'argent (il donne un precipite blanc avec les ions chlorure)."
            ],
            piege: "A la soude : bleu = cuivre, vert = fer II, rouille = fer III."
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
          },
          {
            id: "pc_atom_12",
            titre: "Atome ou ion ?",
            diff: "difficile",
            enonce: "On donne la composition de trois entites. X : 8 protons et 8 electrons. Y : 8 protons et 10 electrons. Z : 11 protons et 10 electrons.",
            questions: [
              "Laquelle de ces entites est un atome ? Lesquelles sont des ions ?",
              "Justifie que X est electriquement neutre.",
              "Y a-t-il gagne ou perdu des electrons ? Quelle est sa charge ?",
              "Z a-t-il gagne ou perdu des electrons ? Donne le signe de sa charge."
            ],
            correction: [
              "X est un atome (autant de protons que d'electrons). Y et Z sont des ions (nombres differents).",
              "8 protons (+) et 8 electrons (-) : les charges se compensent, l'atome est neutre.",
              "Y a 10 electrons pour 8 protons : il a GAGNE 2 electrons -> charge 2- (ion negatif).",
              "Z a 10 electrons pour 11 protons : il a PERDU 1 electron -> charge positive (ion positif)."
            ],
            piege: "On compare protons et electrons : plus d'electrons -> ion negatif ; moins -> ion positif."
          },
          {
            id: "pc_atom_13",
            titre: "Atomes et combustion du methane",
            diff: "expert",
            enonce: "La combustion du methane s'ecrit : CH4 + 2 O2 -> CO2 + 2 H2O.",
            questions: [
              "Combien d'atomes au total dans une molecule de CH4 ? dans une molecule de CO2 ?",
              "Compte les atomes de chaque element a gauche de l'equation, puis a droite.",
              "Montre que tous les atomes sont conserves.",
              "En deduire pourquoi la masse totale se conserve au cours de la reaction.",
              "La combustion transforme-t-elle les atomes de carbone en un autre element ? Justifie."
            ],
            correction: [
              "CH4 : 1 + 4 = 5 atomes. CO2 : 1 + 2 = 3 atomes.",
              "A gauche : C = 1, H = 4, O = 2 x 2 = 4. A droite : C = 1, H = 2 x 2 = 4, O = 2 + 2 = 4.",
              "C : 1 = 1 ; H : 4 = 4 ; O : 4 = 4 -> tous les atomes sont conserves.",
              "Les atomes ne sont ni crees ni detruits, seulement reorganises : la masse totale reste identique.",
              "Non : un atome de carbone reste un atome de carbone (en chimie, les elements ne changent pas de nature)."
            ],
            piege: "En chimie, les atomes se reorganisent mais ne changent jamais de nature."
          },
          {
            id: "pc_atom_14",
            titre: "Lire deux formules",
            diff: "moyen",
            enonce: "On donne deux molecules : le dioxyde de soufre SO2 et l'ammoniac NH3.",
            questions: [
              "Combien d'atomes au total dans une molecule de SO2 ? dans une molecule de NH3 ?",
              "Ces deux molecules sont-elles des corps simples ou composes ?",
              "Cite les elements presents dans la molecule de NH3.",
              "La molecule de dioxygene O2 est-elle un corps simple ? Pourquoi ?"
            ],
            correction: [
              "SO2 : 1 + 2 = 3 atomes ; NH3 : 1 + 3 = 4 atomes.",
              "Des corps composes (elles contiennent plusieurs elements differents).",
              "L'azote (N) et l'hydrogene (H).",
              "Oui : elle ne contient qu'un seul type d'atome (l'oxygene)."
            ],
            piege: "Corps compose = plusieurs elements ; corps simple = un seul type d'atome."
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
          },
          {
            id: "pc_masse_12",
            titre: "Combustion et masse des gaz",
            diff: "difficile",
            enonce: "On brule 24 g de carbone. La combustion complete consomme 64 g de dioxygene et produit du dioxyde de carbone, dans un systeme ferme.",
            questions: [
              "Ecris la relation de conservation des masses pour cette reaction.",
              "Calcule la masse de dioxyde de carbone produite.",
              "Si la combustion avait lieu a l'air libre sur une balance, celle-ci indiquerait-elle cette masse ? Pourquoi ?",
              "Le carbone se transforme-t-il en un autre element ? Justifie."
            ],
            correction: [
              "m(carbone) + m(dioxygene) = m(dioxyde de carbone).",
              "24 + 64 = 88 g de dioxyde de carbone.",
              "Non : le CO2 est un gaz qui s'echappe, la balance ne le pese pas (masse mesuree plus faible).",
              "Non : les atomes de carbone se retrouvent dans le CO2, ils ne changent pas de nature."
            ],
            piege: "La conservation n'est vraie qu'en comptant TOUS les reactifs et produits, gaz compris."
          },
          {
            id: "pc_masse_13",
            titre: "Verifier la conservation de la masse",
            diff: "expert",
            enonce: "On chauffe dans un tube ferme 5,6 g de fer avec 3,2 g de soufre. La reaction forme du sulfure de fer (un solide). On pese le tube et son contenu avant et apres la reaction.",
            questions: [
              "Quelle masse de sulfure de fer obtient-on si tout reagit ?",
              "La masse totale du tube change-t-elle pendant la reaction ? Justifie.",
              "Si on ouvre le tube apres reaction, la masse mesuree change-t-elle ? Pourquoi le sulfure de fer ne produit-il pas de gaz ?",
              "On refait l'experience avec un tube fissure (non etanche). La conservation est-elle verifiable ? Explique.",
              "Conclure : a quelle condition peut-on verifier experimentalement la conservation de la masse ?"
            ],
            correction: [
              "5,6 + 3,2 = 8,8 g de sulfure de fer.",
              "Non : aucun echange avec l'exterieur (systeme ferme), la masse totale reste constante.",
              "Non : le sulfure de fer est un solide, aucun gaz ne se forme ni ne s'echappe -> la masse ne change pas.",
              "Non : par la fissure, de la matiere (gaz, air) pourrait entrer ou sortir, ce qui fausserait la mesure.",
              "Il faut un systeme ferme (etanche), pour qu'aucune matiere n'echange avec l'exterieur."
            ],
            piege: "La conservation de la masse ne se verifie que dans un systeme parfaitement ferme."
          },
          {
            id: "pc_masse_14",
            titre: "Le comprime effervescent",
            diff: "difficile",
            enonce: "On dissout un comprime effervescent dans l'eau, dans un becher ouvert pose sur une balance. Des bulles de gaz se forment et la masse affichee diminue.",
            questions: [
              "Pourquoi la masse affichee diminue-t-elle ?",
              "La conservation de la masse est-elle reellement violee ?",
              "Comment faudrait-il realiser l'experience pour verifier la conservation ?",
              "Quel gaz s'echappe le plus souvent dans ce type de reaction ?"
            ],
            correction: [
              "Un gaz se forme et s'echappe dans l'air : la balance ne le pese plus.",
              "Non : si on comptait le gaz parti, la masse totale serait conservee.",
              "En systeme ferme (recipient bouche), pour retenir le gaz forme.",
              "Du dioxyde de carbone CO2."
            ],
            piege: "En systeme ouvert, le gaz qui s'echappe fait baisser la masse mesuree, sans violer la conservation."
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
            enonce: "Pour son TP, Lucas realise la combustion complete du carbone dans le dioxygene. Le gaz forme trouble l'eau de chaux (voir figure).",
            schema: `<svg width="100%" viewBox="0 0 210 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Test a l'eau de chaux</title><desc>Le gaz forme trouble l'eau de chaux.</desc><path d="M75,45 L75,165 A18 12 0 0 0 111,165 L111,45" fill="none" stroke="currentColor" stroke-width="2"/><line x1="75" y1="98" x2="111" y2="98" stroke="currentColor" stroke-width="1.2"/><g fill="currentColor" fill-opacity="0.3"><circle cx="86" cy="122" r="3"/><circle cx="99" cy="138" r="3"/><circle cx="92" cy="152" r="2.5"/><circle cx="103" cy="118" r="2.5"/></g><path d="M38,32 L93,32 L93,82" fill="none" stroke="currentColor" stroke-width="2"/><g fill="none" stroke="currentColor" stroke-width="1"><circle cx="93" cy="90" r="2"/><circle cx="93" cy="104" r="2"/></g><text x="118" y="128" font-size="10" fill="currentColor" font-family="sans-serif">eau de chaux</text><text x="118" y="142" font-size="10" fill="currentColor" font-family="sans-serif">qui se trouble</text></svg>`,
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
            enonce: "Le professeur ecrit au tableau la combustion du methane (gaz de ville) : CH4 + 2 O2 -> CO2 + 2 H2O.",
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
            enonce: "Emma enflamme de la laine de fer (paille de fer) a l'air libre, posee sur une balance. Elle observe que sa masse augmente (voir figure).",
            schema: `<svg width="100%" viewBox="0 0 230 170" role="img" xmlns="http://www.w3.org/2000/svg"><title>Pesee de la laine de fer</title><desc>La masse mesuree augmente pendant la combustion.</desc><path d="M60,150 L70,120 L160,120 L170,150 Z" fill="none" stroke="currentColor" stroke-width="2"/><line x1="78" y1="120" x2="152" y2="120" stroke="currentColor" stroke-width="2"/><line x1="115" y1="120" x2="115" y2="106" stroke="currentColor" stroke-width="1.5"/><line x1="92" y1="106" x2="138" y2="106" stroke="currentColor" stroke-width="2"/><path d="M104,106 q4,-12 13,-6 q11,-4 7,8 Z" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><rect x="120" y="130" width="34" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M192,118 l0,-24 m-6,8 l6,-8 l6,8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><text x="178" y="138" font-size="10" fill="currentColor" font-family="sans-serif">masse</text></svg>`,
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
            enonce: "Le professeur rappelle a Tom que, pour qu'un feu existe, il faut reunir trois elements : un combustible, un comburant et une source de chaleur.",
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
            enonce: "En camping, Sarah utilise un rechaud a butane. La combustion complete produit du dioxyde de carbone et de l'eau.",
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
            enonce: "Nathan brule de l'ethanol. La masse d'ethanol diminue et il se forme des gaz.",
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
            enonce: "La chaudiere a gaz de la maison de Lea, mal reglee, produit une flamme jaune au lieu d'une flamme bleue.",
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
            enonce: "Sami plonge de la laine de fer incandescente dans un flacon de dioxygene pur : elle brule vivement avec des etincelles.",
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
            enonce: "Karim sait qu'on ne doit jamais utiliser un barbecue au charbon dans un local ferme.",
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
            enonce: "Pour son TP, Ines recueille les gaz d'une combustion d'hydrocarbure. Un test trouble l'eau de chaux ; un autre fait bleuir le sulfate de cuivre anhydre.",
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
            enonce: "Maxime observe que la combustion du gaz libere de la chaleur et de la lumiere.",
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
          },
          {
            id: "pc_comb_12",
            titre: "Combustion du carbone et masse",
            diff: "difficile",
            enonce: "Pour un exercice, Adam etudie la combustion du carbone : C + O2 -> CO2. Il fait bruler 3 g de carbone dans un flacon contenant 8 g de dioxygene. Tout reagit.",
            questions: [
              "Cite le combustible et le comburant.",
              "Quel test permet d'identifier le gaz produit ? Quel resultat attend-on ?",
              "Calcule la masse de dioxyde de carbone formee (conservation de la masse).",
              "Pourquoi, dans un espace clos, la combustion finit-elle par s'arreter ?"
            ],
            correction: [
              "Combustible : le carbone ; comburant : le dioxygene.",
              "Le test a l'eau de chaux : elle se trouble (devient blanche) en presence de dioxyde de carbone.",
              "3 + 8 = 11 g de dioxyde de carbone.",
              "Le dioxygene s'epuise : sans comburant, la combustion s'arrete."
            ],
            piege: "Sans dioxygene, pas de combustion : elle cesse quand le comburant est consomme."
          },
          {
            id: "pc_comb_13",
            titre: "Securite d'une chaudiere a gaz",
            diff: "expert",
            enonce: "La chaudiere de l'immeuble de Chloe brule du gaz naturel (methane). Mal entretenue, elle produit une flamme jaune. La combustion complete s'ecrit : CH4 + 2 O2 -> CO2 + 2 H2O.",
            questions: [
              "Identifie le combustible et le comburant.",
              "Verifie que l'equation est equilibree pour le carbone, l'hydrogene et l'oxygene.",
              "Que revele une flamme jaune au lieu d'une flamme bleue ?",
              "Quel gaz dangereux peut alors se former ? Pourquoi est-il indetectable par l'odorat ?",
              "Cite deux mesures de securite pour eviter une intoxication."
            ],
            correction: [
              "Combustible : methane CH4 ; comburant : dioxygene O2.",
              "C : 1 = 1 ; H : 4 = 4 ; O : 2 x 2 = 4 a gauche et 2 + 2 = 4 a droite -> equilibree.",
              "Une combustion incomplete (le dioxygene est en quantite insuffisante).",
              "Du monoxyde de carbone CO ; il est inodore et incolore, donc l'odorat ne le detecte pas.",
              "Aerer la piece, faire entretenir la chaudiere, installer un detecteur de monoxyde de carbone."
            ],
            piege: "Flamme jaune = combustion incomplete = risque de monoxyde de carbone (mortel)."
          },
          {
            id: "pc_comb_14",
            titre: "La bougie sous un bocal",
            diff: "facile",
            enonce: "Eva compare la combustion d'une bougie a l'air libre et sous un bocal retourne qui l'enferme (voir figure).",
            schema: `<svg width="100%" viewBox="0 0 200 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Bougie sous un bocal</title><desc>Un bocal retourne enferme une bougie allumee.</desc><line x1="30" y1="172" x2="170" y2="172" stroke="currentColor" stroke-width="2"/><path d="M55,172 L55,82 Q55,45 100,45 Q145,45 145,82 L145,172" fill="none" stroke="currentColor" stroke-width="2"/><rect x="92" y="120" width="16" height="48" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="100" y1="120" x2="100" y2="110" stroke="currentColor" stroke-width="1.5"/><path d="M100,94 q8,11 0,22 q-8,-11 0,-22 Z" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.4"/><text x="150" y="60" font-size="11" fill="currentColor" font-family="sans-serif">bocal</text></svg>`,
            questions: [
              "Sous le bocal, que devient la flamme au bout d'un moment ?",
              "Pourquoi s'eteint-elle ?",
              "Quel gaz a ete consomme sous le bocal ?",
              "A l'air libre, pourquoi la bougie continue-t-elle de bruler ?"
            ],
            correction: [
              "Elle s'eteint.",
              "Le dioxygene enferme sous le bocal s'epuise.",
              "Le dioxygene.",
              "L'air apporte en permanence du dioxygene neuf."
            ],
            piege: "Sans renouvellement de dioxygene, la combustion finit par s'arreter."
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
            enonce: "Pour son TP, Lea pese un echantillon de cuivre : il a une masse de 89 g et un volume de 10 cm3.",
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
            enonce: "Maxime dissout 20 g de sel dans 250 mL d'eau.",
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
            enonce: "Sofia verse 1,5 L d'huile, de masse volumique 0,92 g/mL, dans une bouteille.",
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
            enonce: "Un bijoutier examine un bijou de masse 96,5 g et de volume 5 cm3. Il hesite entre l'argent (10,5 g/cm3) et l'or (19,3 g/cm3).",
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
            enonce: "Yanis sait que l'eau a une masse volumique de 1000 kg/m3 et veut convertir cette valeur.",
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
            enonce: "Clara prepare une boisson en dissolvant 30 g de sucre dans 0,5 L d'eau.",
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
            enonce: "Pour son TP, Adam place dans l'eau (1 g/cm3) trois materiaux : du liege (0,24 g/cm3), de la glace (0,92 g/cm3) et du fer (7,9 g/cm3).",
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
            enonce: "Lina remplit une eprouvette avec 50 mL d'eau. Elle y plonge un caillou : le niveau monte a 65 mL (voir figure). Le caillou a une masse de 40 g.",
            schema: `<svg width="100%" viewBox="0 0 200 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Mesure d'un volume par deplacement d'eau</title><desc>Un objet plonge dans l'eprouvette fait monter le niveau d'eau.</desc><path d="M70,30 L70,155 A22 12 0 0 0 114,155 L114,30" fill="none" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="1"><line x1="70" y1="55" x2="80" y2="55"/><line x1="70" y1="80" x2="80" y2="80"/><line x1="70" y1="105" x2="80" y2="105"/><line x1="70" y1="130" x2="80" y2="130"/></g><line x1="70" y1="70" x2="114" y2="70" stroke="currentColor" stroke-width="1.5"/><polygon points="80,135 98,126 108,140 92,152" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.5"/><text x="120" y="68" font-size="11" fill="currentColor" font-family="sans-serif">niveau d'eau</text><text x="120" y="142" font-size="11" fill="currentColor" font-family="sans-serif">objet</text></svg>`,
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
            enonce: "Noa se demande si l'air a une masse. On donne la masse volumique de l'air : environ 1,2 g/L.",
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
            enonce: "Une eau est potable si sa concentration en nitrates ne depasse pas 50 mg/L. Le laboratoire ou travaille Sarah mesure 30 mg de nitrates dans 0,5 L d'eau.",
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
            enonce: "Au labo, Eva verse doucement dans un tube du miel (1,4 g/mL), de l'eau (1,0 g/mL), puis de l'huile (0,9 g/mL). Trois couches se forment (voir figure).",
            schema: `<svg width="100%" viewBox="0 0 180 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Trois liquides non miscibles</title><desc>Miel au fond, eau au milieu, huile au-dessus.</desc><path d="M68,30 L68,160 A18 10 0 0 0 104,160 L104,30" fill="none" stroke="currentColor" stroke-width="2"/><line x1="68" y1="120" x2="104" y2="120" stroke="currentColor" stroke-width="1.5"/><line x1="68" y1="90" x2="104" y2="90" stroke="currentColor" stroke-width="1.5"/><text x="110" y="148" font-size="11" fill="currentColor" font-family="sans-serif">miel</text><text x="110" y="108" font-size="11" fill="currentColor" font-family="sans-serif">eau</text><text x="110" y="76" font-size="11" fill="currentColor" font-family="sans-serif">huile</text></svg>`,
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
          },
          {
            id: "pc_mv_12",
            titre: "La couronne en or",
            diff: "difficile",
            enonce: "Un antiquaire confie a Rayan une couronne de masse 579 g, qui semble en or. Plongee dans une eprouvette, le niveau d'eau passe de 100 mL a 130 mL. Masse volumique de l'or pur : 19,3 g/cm3.",
            questions: [
              "Quel est le volume de la couronne ?",
              "Calcule sa masse volumique.",
              "La couronne est-elle en or pur ? Justifie.",
              "Si la masse volumique mesuree avait ete plus faible, qu'aurait-on pu en conclure ?"
            ],
            correction: [
              "130 - 100 = 30 mL, soit 30 cm3.",
              "rho = 579 / 30 = 19,3 g/cm3.",
              "Oui : 19,3 g/cm3 correspond exactement a la masse volumique de l'or pur.",
              "Que la couronne contient un autre metal, moins dense, melange a l'or (un alliage)."
            ],
            piege: "La masse volumique permet d'identifier un materiau et de detecter un alliage."
          },
          {
            id: "pc_mv_13",
            titre: "Identifier un metal inconnu",
            diff: "expert",
            enonce: "Chloe cherche a identifier un metal. Son echantillon a une masse de 212,5 g. Plonge dans 50 mL d'eau, le niveau monte a 75 mL (voir figure). Donnees : aluminium 2,7 g/cm3 ; fer 7,9 g/cm3 ; cuivre 8,5 g/cm3.",
            schema: `<svg width="100%" viewBox="0 0 200 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Mesure d'un volume par deplacement d'eau</title><desc>L'echantillon plonge fait monter le niveau de 50 a 75 mL.</desc><path d="M70,30 L70,155 A22 12 0 0 0 114,155 L114,30" fill="none" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="1"><line x1="70" y1="60" x2="80" y2="60"/><line x1="70" y1="85" x2="80" y2="85"/><line x1="70" y1="110" x2="80" y2="110"/><line x1="70" y1="135" x2="80" y2="135"/></g><line x1="70" y1="72" x2="114" y2="72" stroke="currentColor" stroke-width="1.5"/><polygon points="82,132 100,124 109,138 93,150" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.5"/><text x="120" y="70" font-size="11" fill="currentColor" font-family="sans-serif">75 mL</text><text x="120" y="142" font-size="11" fill="currentColor" font-family="sans-serif">metal</text></svg>`,
            questions: [
              "Calcule le volume de l'echantillon.",
              "Calcule sa masse volumique.",
              "De quel metal s'agit-il ?",
              "Un second echantillon du meme metal a une masse de 425 g. Calcule son volume sans nouvelle mesure.",
              "Ce metal coule-t-il dans l'eau (1 g/cm3) ? Flotte-t-il sur le mercure (13,6 g/cm3) ? Justifie."
            ],
            correction: [
              "75 - 50 = 25 mL, soit 25 cm3.",
              "rho = 212,5 / 25 = 8,5 g/cm3.",
              "Du cuivre (8,5 g/cm3).",
              "Meme masse volumique : V = m / rho = 425 / 8,5 = 50 cm3.",
              "Il coule dans l'eau (8,5 > 1) ; il flotte sur le mercure (8,5 < 13,6)."
            ],
            piege: "La masse volumique caracterise le metal : elle ne depend pas de la quantite."
          },
          {
            id: "pc_mv_14",
            titre: "La masse d'un liquide",
            diff: "difficile",
            enonce: "Un recipient vide pese par Nathan a une masse de 120 g. Rempli de 200 mL d'un liquide, l'ensemble a une masse de 280 g.",
            questions: [
              "Quelle est la masse du liquide seul ?",
              "Calcule la masse volumique du liquide (en g/mL).",
              "Ce liquide est-il plus ou moins dense que l'eau (1 g/mL) ?",
              "Quelle serait la masse de 1 L de ce liquide ?"
            ],
            correction: [
              "280 - 120 = 160 g.",
              "rho = m / V = 160 / 200 = 0,8 g/mL.",
              "Moins dense que l'eau (0,8 < 1).",
              "1 L = 1000 mL, donc m = 0,8 x 1000 = 800 g."
            ],
            piege: "Masse du liquide = masse de l'ensemble plein - masse du recipient vide."
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
            enonce: "Pour son TP, Hugo branche une resistance de 220 ohms en serie avec un amperemetre. Un courant d'intensite 0,02 A la traverse (voir le schema du circuit).",
            schema: `<svg width="100%" viewBox="0 0 240 150" role="img" xmlns="http://www.w3.org/2000/svg"><title>Circuit en serie</title><desc>Generateur, resistance R et amperemetre A en serie.</desc><g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><line x1="50" y1="40" x2="120" y2="40"/><line x1="160" y1="40" x2="190" y2="40"/><line x1="50" y1="40" x2="50" y2="74"/><line x1="50" y1="86" x2="50" y2="120"/><line x1="50" y1="120" x2="190" y2="120"/><line x1="190" y1="40" x2="190" y2="67"/><line x1="190" y1="93" x2="190" y2="120"/></g><rect x="120" y="29" width="40" height="22" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><text x="140" y="44" text-anchor="middle" font-size="12" fill="currentColor" font-family="sans-serif">R</text><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="34" y1="74" x2="66" y2="74"/><line x1="42" y1="86" x2="58" y2="86"/></g><circle cx="190" cy="80" r="13" fill="none" stroke="currentColor" stroke-width="2"/><text x="190" y="84" text-anchor="middle" font-size="12" fill="currentColor" font-family="sans-serif">A</text></svg>`,
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
            enonce: "En classe, Lea compare deux montages. Dans le premier, une pile alimente deux lampes identiques en serie. Dans le second, les deux lampes sont branchees en derivation.",
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
            enonce: "Lors d'un TP, Tom mesure aux bornes d'une resistance : U = 9 V quand l'intensite vaut I = 0,045 A.",
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
            enonce: "Nina veut mesurer l'intensite du courant qui traverse une lampe, dans un circuit en serie.",
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
            enonce: "Par megarde, Sami relie directement les deux bornes d'une pile par un fil de tres faible resistance (voir schema).",
            schema: `<svg width="100%" viewBox="0 0 240 150" role="img" xmlns="http://www.w3.org/2000/svg"><title>Court-circuit</title><desc>Les deux bornes de la pile sont reliees par un simple fil de faible resistance.</desc><g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><line x1="60" y1="50" x2="180" y2="50"/><line x1="60" y1="50" x2="60" y2="84"/><line x1="60" y1="96" x2="60" y2="120"/><line x1="60" y1="120" x2="180" y2="120"/><line x1="180" y1="50" x2="180" y2="120"/></g><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="44" y1="84" x2="76" y2="84"/><line x1="52" y1="96" x2="68" y2="96"/></g><path d="M150 72 l9 13 l-7 0 l9 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><text x="120" y="40" text-anchor="middle" font-size="11" fill="currentColor" font-family="sans-serif">fil de faible resistance</text></svg>`,
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
            enonce: "Le professeur demande a Manon de classer cinq dipoles : une pile, une lampe, une resistance, un interrupteur et un moteur.",
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
            enonce: "La pile utilisee par Lucas porte l'indication 4,5 V. Il la branche a une lampe.",
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
            enonce: "Dans son montage, Emma soumet une resistance de 100 ohms a une tension de 5 V.",
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
            enonce: "Theo branche par erreur une lampe prevue pour 6 V sur une pile de 9 V.",
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
            enonce: "Pour son TP, Jade intercale differents materiaux dans un circuit avec une lampe : fer, cuivre, plastique, bois sec et verre.",
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
          },
          {
            id: "pc_ohm_12",
            titre: "Exploiter une caracteristique",
            diff: "difficile",
            enonce: "Ines releve la caracteristique d'une resistance. Pour U = 4 V, elle mesure I = 0,016 A ; pour U = 6 V, elle mesure I = 0,024 A.",
            questions: [
              "Calcule le rapport U/I pour chaque mesure. Que constates-tu ?",
              "En deduire la valeur de la resistance R.",
              "Quelle tension faut-il appliquer pour obtenir I = 0,030 A ?",
              "La caracteristique U = f(I) est-elle une droite ? Passe-t-elle par l'origine ?"
            ],
            correction: [
              "4 / 0,016 = 250 ; 6 / 0,024 = 250. Le rapport U/I est constant.",
              "R = 250 ohms.",
              "U = R x I = 250 x 0,030 = 7,5 V.",
              "Oui : une droite passant par l'origine (U est proportionnelle a I)."
            ],
            piege: "Rapport U/I constant -> resistance ohmique -> caracteristique = droite par l'origine."
          },
          {
            id: "pc_ohm_13",
            titre: "Guirlande en serie",
            diff: "expert",
            enonce: "La guirlande de Noel de Gabriel comporte un generateur de 12 V et une resistance R, en serie avec un amperemetre (voir schema). Il mesure I = 0,05 A.",
            schema: `<svg width="100%" viewBox="0 0 240 150" role="img" xmlns="http://www.w3.org/2000/svg"><title>Circuit en serie de la guirlande</title><desc>Generateur 12 V, resistance R et amperemetre A en serie.</desc><g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><line x1="50" y1="40" x2="120" y2="40"/><line x1="160" y1="40" x2="190" y2="40"/><line x1="50" y1="40" x2="50" y2="74"/><line x1="50" y1="86" x2="50" y2="120"/><line x1="50" y1="120" x2="190" y2="120"/><line x1="190" y1="40" x2="190" y2="67"/><line x1="190" y1="93" x2="190" y2="120"/></g><rect x="120" y="29" width="40" height="22" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><text x="140" y="44" text-anchor="middle" font-size="12" fill="currentColor" font-family="sans-serif">R</text><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="34" y1="74" x2="66" y2="74"/><line x1="42" y1="86" x2="58" y2="86"/></g><text x="22" y="104" font-size="11" fill="currentColor" font-family="sans-serif">12 V</text><circle cx="190" cy="80" r="13" fill="none" stroke="currentColor" stroke-width="2"/><text x="190" y="84" text-anchor="middle" font-size="12" fill="currentColor" font-family="sans-serif">A</text></svg>`,
            questions: [
              "Enonce la loi d'Ohm et calcule la valeur de R.",
              "La puissance recue par R vaut P = U x I. Calcule-la.",
              "Quelle energie la guirlande consomme-t-elle en 2 heures (en Wh) ?",
              "On remplace R par une resistance deux fois plus grande (meme generateur). L'intensite augmente-t-elle ou diminue-t-elle ? Calcule la nouvelle intensite.",
              "Dans ce montage en serie, si une lampe grille, que se passe-t-il pour les autres ?"
            ],
            correction: [
              "Loi d'Ohm : U = R x I, donc R = U / I = 12 / 0,05 = 240 ohms.",
              "P = U x I = 12 x 0,05 = 0,6 W.",
              "E = P x t = 0,6 x 2 = 1,2 Wh.",
              "I diminue : avec R = 480 ohms, I = 12 / 480 = 0,025 A (l'intensite est divisee par 2).",
              "Le circuit est ouvert : toutes les lampes s'eteignent (montage en serie)."
            ],
            piege: "En serie, I = U/R : doubler R divise I par 2 ; et une seule lampe grillee coupe tout."
          },
          {
            id: "pc_ohm_14",
            titre: "Choisir la bonne tension",
            diff: "moyen",
            enonce: "Karim dispose d'un conducteur ohmique de resistance R = 150 ohms.",
            questions: [
              "Quelle formule relie U, R et I ?",
              "Quelle tension faut-il appliquer pour obtenir une intensite de 0,04 A ?",
              "Si on applique 9 V a ce conducteur, quelle intensite le traverse ?",
              "Quelle est l'unite de la resistance ?"
            ],
            correction: [
              "U = R x I (et donc I = U / R).",
              "U = 150 x 0,04 = 6 V.",
              "I = U / R = 9 / 150 = 0,06 A.",
              "L'ohm."
            ],
            piege: "Selon ce qu'on cherche : U = R x I ou I = U / R."
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
          },
          {
            id: "pc_ener_12",
            titre: "Le cout du chauffe-eau",
            diff: "difficile",
            enonce: "Un chauffe-eau de puissance 2000 W fonctionne 3 h par jour. Le prix de l'energie est de 0,20 euro par kWh.",
            questions: [
              "Calcule l'energie consommee par jour (en kWh).",
              "Calcule le cout de fonctionnement par jour.",
              "Calcule le cout sur 30 jours.",
              "On le remplace par un modele de 1500 W (meme duree). Quelle economie d'energie realise-t-on par jour (en kWh) ?"
            ],
            correction: [
              "E = P x t = 2000 x 3 = 6000 Wh = 6 kWh.",
              "6 x 0,20 = 1,20 euro par jour.",
              "1,20 x 30 = 36 euros.",
              "Nouveau modele : 1500 x 3 = 4500 Wh = 4,5 kWh. Economie = 6 - 4,5 = 1,5 kWh par jour."
            ],
            piege: "Energie (kWh) = puissance (kW) x duree (h) ; bien convertir les W en kW."
          },
          {
            id: "pc_ener_13",
            titre: "Maison alimentee au solaire",
            diff: "expert",
            enonce: "Une installation solaire alimente une maison. Un radiateur de 1000 W et 5 lampes LED de 10 W chacune fonctionnent ensemble pendant 4 h.",
            questions: [
              "Calcule la puissance totale des 5 lampes.",
              "Calcule la puissance totale installee (radiateur + lampes).",
              "Calcule l'energie consommee en 4 h (en Wh puis en kWh).",
              "Le radiateur transforme l'electricite surtout en quelle forme d'energie ? Comment s'appelle ce phenomene dans une resistance ?",
              "L'energie solaire est-elle renouvelable ? L'energie est-elle creee dans l'installation ?"
            ],
            correction: [
              "5 x 10 = 50 W.",
              "1000 + 50 = 1050 W.",
              "E = 1050 x 4 = 4200 Wh = 4,2 kWh.",
              "Surtout en chaleur (energie thermique) ; ce phenomene s'appelle l'effet Joule.",
              "Oui, le soleil est une source renouvelable ; non, l'energie n'est pas creee, elle est convertie (lumiere -> electricite)."
            ],
            piege: "Les puissances s'additionnent ; energie (Wh) = puissance totale (W) x duree (h)."
          },
          {
            id: "pc_ener_14",
            titre: "L'energie de la bouilloire",
            diff: "difficile",
            enonce: "Une bouilloire de puissance 2200 W chauffe de l'eau pendant 3 minutes.",
            questions: [
              "Convertis la duree en secondes.",
              "Calcule l'energie consommee en joules (E = P x t).",
              "Convertis cette energie en watt-heures (1 Wh = 3600 J).",
              "En quelle forme d'energie l'electricite est-elle transformee dans la bouilloire ?"
            ],
            correction: [
              "3 min = 3 x 60 = 180 s.",
              "E = 2200 x 180 = 396 000 J.",
              "396 000 / 3600 = 110 Wh.",
              "En chaleur (energie thermique) qui chauffe l'eau : c'est l'effet Joule."
            ],
            piege: "Pour des joules, la duree doit etre en secondes : E = P x t."
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
          },
          {
            id: "pc_mvt_12",
            titre: "Vitesse moyenne d'un train",
            diff: "difficile",
            enonce: "Un train doit parcourir 240 km. Il roule pendant la premiere heure a 80 km/h, puis effectue le reste du trajet a 100 km/h.",
            questions: [
              "Quelle distance parcourt-il pendant la premiere heure ?",
              "Quelle distance lui reste-t-il a parcourir ?",
              "Combien de temps met-il pour la deuxieme partie du trajet ?",
              "Calcule sa vitesse moyenne sur l'ensemble du trajet."
            ],
            correction: [
              "d = v x t = 80 x 1 = 80 km.",
              "240 - 80 = 160 km.",
              "t = d / v = 160 / 100 = 1,6 h.",
              "Duree totale = 1 + 1,6 = 2,6 h ; v = 240 / 2,6 = 92,3 km/h (environ)."
            ],
            piege: "La vitesse moyenne n'est PAS la moyenne des vitesses : c'est distance totale / duree totale."
          },
          {
            id: "pc_mvt_13",
            titre: "Distance d'arret d'une voiture",
            diff: "expert",
            enonce: "Securite routiere : une voiture roule a 50 km/h. Le temps de reaction du conducteur est de 1 s. La distance d'arret = distance parcourue pendant la reaction + distance de freinage. On donne la distance de freinage : 14 m.",
            questions: [
              "Convertis 50 km/h en m/s.",
              "Calcule la distance parcourue pendant le temps de reaction (1 s).",
              "En deduire la distance d'arret totale.",
              "A 90 km/h (soit 25 m/s), quelle serait la distance parcourue pendant la reaction ? Pourquoi la distance d'arret augmente-t-elle fortement avec la vitesse ?",
              "Dans quel referentiel etudie-t-on le mouvement de la voiture ?"
            ],
            correction: [
              "50 / 3,6 = 13,9 m/s (environ 14 m/s).",
              "d = v x t = 13,9 x 1 = 13,9 m (environ 14 m).",
              "Distance d'arret = 14 (reaction) + 14 (freinage) = 28 m environ.",
              "25 x 1 = 25 m pendant la reaction. Plus on roule vite, plus la distance parcourue (reaction ET freinage) est grande.",
              "Le referentiel terrestre (la route, le sol)."
            ],
            piege: "A 50 km/h on roule a ~14 m/s : en 1 s de reaction, on parcourt deja ~14 m avant meme de freiner."
          },
          {
            id: "pc_mvt_14",
            titre: "La vitesse de l'avion",
            diff: "moyen",
            enonce: "Un avion vole a vitesse constante et parcourt 900 km en 1 h 15 min.",
            questions: [
              "Convertis la duree du trajet en heures.",
              "Calcule sa vitesse moyenne en km/h.",
              "Convertis cette vitesse en m/s (arrondis a l'unite).",
              "Le mouvement de l'avion est-il uniforme ?"
            ],
            correction: [
              "1 h 15 min = 1 + 15/60 = 1,25 h.",
              "v = d / t = 900 / 1,25 = 720 km/h.",
              "720 / 3,6 = 200 m/s.",
              "Oui : la vitesse est constante, le mouvement est uniforme."
            ],
            piege: "15 min = 0,25 h, donc 1 h 15 = 1,25 h (et non 1,15 h)."
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
          },
          {
            id: "pc_grav_12",
            titre: "Meme objet, Terre et Lune",
            diff: "difficile",
            enonce: "Un objet a une masse de 6 kg. On donne l'intensite de la pesanteur : g = 10 N/kg sur Terre et g = 1,6 N/kg sur la Lune.",
            questions: [
              "Calcule le poids de l'objet sur Terre.",
              "Calcule son poids sur la Lune.",
              "Par combien le poids est-il divise entre la Terre et la Lune (arrondis a l'unite) ?",
              "La masse de l'objet est-elle la meme sur la Lune ? Justifie."
            ],
            correction: [
              "P = m x g = 6 x 10 = 60 N.",
              "P = 6 x 1,6 = 9,6 N.",
              "60 / 9,6 = 6,25, soit environ 6 fois plus faible.",
              "Oui, 6 kg : la masse ne depend pas de l'astre, seul le poids change (a cause de g)."
            ],
            piege: "La masse (kg) est invariable ; le poids (N) depend de l'intensite de pesanteur g."
          },
          {
            id: "pc_grav_13",
            titre: "Mission sur Mars",
            diff: "expert",
            enonce: "Un astronaute et son equipement ont une masse totale de 120 kg. On donne g : 10 N/kg sur Terre et 3,7 N/kg sur Mars.",
            questions: [
              "Calcule le poids de l'ensemble sur Terre.",
              "Calcule son poids sur Mars.",
              "Sur Mars, un autre materiel a un poids de 444 N. Quelle est sa masse ?",
              "Pourquoi un astronaute peut-il faire de grands bonds sur Mars alors qu'il ne le pourrait pas sur Terre ?",
              "Qu'est-ce qui maintient Mars en orbite autour du Soleil ?"
            ],
            correction: [
              "P = 120 x 10 = 1200 N.",
              "P = 120 x 3,7 = 444 N.",
              "m = P / g = 444 / 3,7 = 120 kg.",
              "La pesanteur sur Mars (3,7 N/kg) est bien plus faible : le poids le retient moins.",
              "La force de gravitation exercee par le Soleil (du fait de sa tres grande masse)."
            ],
            piege: "P = m x g dans les deux sens : g = P/m permet de retrouver une masse a partir d'un poids."
          },
          {
            id: "pc_grav_14",
            titre: "Retrouver une masse, puis un poids",
            diff: "moyen",
            enonce: "Sur Terre, l'intensite de la pesanteur vaut g = 10 N/kg. Un sac a un poids de 80 N.",
            questions: [
              "Donne la formule reliant le poids P, la masse m et g.",
              "Calcule la masse du sac.",
              "Sur la Lune (g = 1,6 N/kg), quel serait son poids ?",
              "Sa masse change-t-elle entre la Terre et la Lune ?"
            ],
            correction: [
              "P = m x g, donc m = P / g.",
              "m = 80 / 10 = 8 kg.",
              "P = 8 x 1,6 = 12,8 N.",
              "Non : la masse reste 8 kg, seul le poids change."
            ],
            piege: "On passe du poids a la masse avec m = P / g, et inversement avec P = m x g."
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
          },
          {
            id: "pc_sig_12",
            titre: "A quelle distance est l'orage ?",
            diff: "difficile",
            enonce: "Pendant un orage, on voit l'eclair puis on entend le tonnerre 9 s plus tard. Le son se propage a 340 m/s ; la lumiere a environ 300 000 km/s.",
            questions: [
              "Pourquoi peut-on considerer que l'on voit l'eclair instantanement ?",
              "Calcule la distance qui nous separe de l'orage.",
              "Si le delai passe a 3 s, l'orage se rapproche-t-il ou s'eloigne-t-il ? Calcule la nouvelle distance.",
              "Conclure : comment le delai entre l'eclair et le tonnerre renseigne-t-il sur la distance de l'orage ?"
            ],
            correction: [
              "La lumiere va environ un million de fois plus vite que le son : son temps de trajet est negligeable.",
              "d = v x t = 340 x 9 = 3060 m, soit environ 3 km.",
              "Le delai est plus court -> l'orage se rapproche ; d = 340 x 3 = 1020 m, soit environ 1 km.",
              "Plus le delai est court, plus l'orage est proche (distance = vitesse du son x delai)."
            ],
            piege: "Distance = vitesse du son x delai ; la lumiere, elle, arrive quasi instantanement."
          },
          {
            id: "pc_sig_13",
            titre: "Le sonar du bateau",
            diff: "expert",
            enonce: "Un bateau mesure la profondeur avec un sonar : il emet un signal sonore vers le fond, et l'echo revient 0,2 s apres l'emission. Vitesse du son dans l'eau : 1500 m/s.",
            questions: [
              "Quelle distance le son parcourt-il au total entre l'emission et la reception de l'echo ?",
              "En deduire la profondeur sous le bateau.",
              "Le son se propage-t-il plus vite dans l'eau ou dans l'air ? Donne les deux valeurs.",
              "Le sonar pourrait-il fonctionner dans le vide de l'espace ? Justifie.",
              "Pour un autre fond, l'echo met 0,3 s. La profondeur est-elle plus grande ? Calcule-la."
            ],
            correction: [
              "d = v x t = 1500 x 0,2 = 300 m (c'est l'aller-retour).",
              "Profondeur = 300 / 2 = 150 m.",
              "Plus vite dans l'eau : 1500 m/s, contre 340 m/s dans l'air.",
              "Non : dans le vide, il n'y a pas de matiere pour propager le son.",
              "Oui, plus grande : d = 1500 x 0,3 = 450 m -> profondeur = 225 m."
            ],
            piege: "Pour un echo, profondeur = (vitesse x temps) / 2, car le son fait l'aller-retour."
          },
          {
            id: "pc_sig_14",
            titre: "Voir avant d'entendre",
            diff: "moyen",
            enonce: "Dans un stade, un spectateur eloigne voit le joueur frapper le ballon, puis entend le choc un court instant apres. Le son se propage a 340 m/s.",
            questions: [
              "Pourquoi voit-il l'action avant de l'entendre ?",
              "Le delai entre l'image et le son est de 0,5 s. A quelle distance se trouve-t-il du joueur ?",
              "La lumiere a-t-elle besoin d'un milieu pour se propager ?",
              "Le son peut-il se propager dans le vide ?"
            ],
            correction: [
              "La lumiere va beaucoup plus vite que le son : l'image arrive quasi instantanement.",
              "d = v x t = 340 x 0,5 = 170 m.",
              "Non : la lumiere se propage meme dans le vide.",
              "Non : le son a besoin d'un milieu materiel pour se propager."
            ],
            piege: "Distance = vitesse du son x delai ; la lumiere, elle, arrive quasi instantanement."
          }
        ]
      }

    ]
  },

  maths: {
    nom: "Mathematiques",
    icone: "shapes",
    themes: [

      /* ================= THEME 1 : THEOREME DE PYTHAGORE ================= */
      {
        id: "pythagore",
        titre: "Theoreme de Pythagore",
        exos: [
          {
            id: "m_pyth_01",
            titre: "Calculer l'hypotenuse",
            diff: "facile",
            enonce: "Le triangle ABC est rectangle en A. On donne AB = 3 cm et AC = 4 cm (voir figure).",
            schema: `<svg width="100%" viewBox="0 0 260 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Triangle ABC rectangle en A</title><desc>Triangle rectangle en A, AB = 3 cm, AC = 4 cm.</desc><polygon points="55,165 55,55 225,165" fill="none" stroke="currentColor" stroke-width="2"/><rect x="55" y="151" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="44" y="182" font-size="14" fill="currentColor" font-family="sans-serif">A</text><text x="44" y="50" font-size="14" fill="currentColor" font-family="sans-serif">B</text><text x="231" y="182" font-size="14" fill="currentColor" font-family="sans-serif">C</text><text x="20" y="114" font-size="13" fill="currentColor" font-family="sans-serif">3 cm</text><text x="120" y="184" font-size="13" fill="currentColor" font-family="sans-serif">4 cm</text><text x="150" y="100" font-size="13" fill="currentColor" font-family="sans-serif">? cm</text></svg>`,
            questions: [
              "Quel cote est l'hypotenuse de ce triangle ?",
              "Enonce le theoreme de Pythagore pour ce triangle.",
              "Calcule la longueur BC.",
              "La valeur trouvee est-elle exacte ou approchee ?"
            ],
            correction: [
              "L'hypotenuse est le cote [BC], oppose a l'angle droit.",
              "BC^2 = AB^2 + AC^2.",
              "BC^2 = 3^2 + 4^2 = 9 + 16 = 25, donc BC = 5 cm.",
              "Exacte : BC = 5 cm (racine de 25 tombe juste)."
            ],
            piege: "L'hypotenuse est toujours le cote oppose a l'angle droit (et le plus long)."
          },
          {
            id: "m_pyth_02",
            titre: "Calculer un cote de l'angle droit",
            diff: "moyen",
            enonce: "Le triangle DEF est rectangle en E. On donne l'hypotenuse DF = 13 cm et le cote DE = 5 cm.",
            questions: [
              "Le cote cherche EF est-il l'hypotenuse ou un cote de l'angle droit ?",
              "Ecris l'egalite de Pythagore pour ce triangle.",
              "Calcule EF.",
              "Verifie : 5, 12, 13 forment-ils bien un triangle rectangle ?"
            ],
            correction: [
              "EF est un cote de l'angle droit (l'hypotenuse est DF).",
              "DF^2 = DE^2 + EF^2.",
              "13^2 = 5^2 + EF^2 -> 169 = 25 + EF^2 -> EF^2 = 144 -> EF = 12 cm.",
              "Oui : 5^2 + 12^2 = 25 + 144 = 169 = 13^2."
            ],
            piege: "Pour un cote de l'angle droit, on SOUSTRAIT : EF^2 = DF^2 - DE^2."
          },
          {
            id: "m_pyth_03",
            titre: "Le triangle est-il rectangle ?",
            diff: "difficile",
            enonce: "Un triangle GHI a pour cotes GH = 6 cm, HI = 8 cm et GI = 10 cm. On veut savoir s'il est rectangle.",
            questions: [
              "Quel est le cote le plus long ?",
              "Calcule GI^2 d'une part, puis GH^2 + HI^2 d'autre part.",
              "Compare les deux resultats : le triangle est-il rectangle ?",
              "Si oui, en quel sommet se trouve l'angle droit ?"
            ],
            correction: [
              "Le cote le plus long est [GI] = 10 cm.",
              "GI^2 = 100 ; GH^2 + HI^2 = 36 + 64 = 100.",
              "Les deux sont egaux : d'apres la reciproque de Pythagore, le triangle est rectangle.",
              "En H, le sommet oppose au plus grand cote [GI]."
            ],
            piege: "Reciproque : si (grand cote)^2 = somme des carres des deux autres -> triangle rectangle."
          },
          {
            id: "m_pyth_04",
            titre: "La diagonale d'un terrain",
            diff: "moyen",
            enonce: "Un terrain rectangulaire ABCD a une longueur AB = 12 m et une largeur BC = 9 m. On veut calculer la longueur de la diagonale AC (voir figure).",
            schema: `<svg width="100%" viewBox="0 0 260 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Rectangle ABCD et sa diagonale AC</title><desc>Rectangle de longueur 12 m et largeur 9 m.</desc><polygon points="45,45 215,45 215,150 45,150" fill="none" stroke="currentColor" stroke-width="2"/><line x1="45" y1="45" x2="215" y2="150" stroke="currentColor" stroke-width="2"/><rect x="201" y="45" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="34" y="42" font-size="14" fill="currentColor" font-family="sans-serif">A</text><text x="220" y="42" font-size="14" fill="currentColor" font-family="sans-serif">B</text><text x="220" y="164" font-size="14" fill="currentColor" font-family="sans-serif">C</text><text x="34" y="164" font-size="14" fill="currentColor" font-family="sans-serif">D</text><text x="112" y="38" font-size="12" fill="currentColor" font-family="sans-serif">12 m</text><text x="222" y="102" font-size="12" fill="currentColor" font-family="sans-serif">9 m</text><text x="118" y="108" font-size="12" fill="currentColor" font-family="sans-serif">? m</text></svg>`,
            questions: [
              "Dans quel triangle peut-on appliquer le theoreme de Pythagore ? Est-il rectangle, et en quel point ?",
              "Ecris l'egalite de Pythagore.",
              "Calcule la longueur de la diagonale AC."
            ],
            correction: [
              "Dans le triangle ABC, rectangle en B (c'est un angle du rectangle).",
              "AC^2 = AB^2 + BC^2.",
              "AC^2 = 12^2 + 9^2 = 144 + 81 = 225, donc AC = 15 m."
            ],
            piege: "La diagonale d'un rectangle se calcule avec Pythagore (les angles du rectangle sont droits)."
          },
          {
            id: "m_pyth_05",
            titre: "L'echelle contre le mur",
            diff: "moyen",
            enonce: "Une echelle de 2,5 m est appuyee contre un mur vertical. Le pied de l'echelle est a 0,7 m du mur. On cherche la hauteur h atteinte sur le mur.",
            questions: [
              "L'echelle correspond a quel cote du triangle rectangle ?",
              "Ecris l'egalite de Pythagore.",
              "Calcule la hauteur h atteinte."
            ],
            correction: [
              "L'echelle est l'hypotenuse (2,5 m).",
              "2,5^2 = 0,7^2 + h^2.",
              "6,25 = 0,49 + h^2 -> h^2 = 5,76 -> h = 2,4 m."
            ],
            piege: "L'hypotenuse (l'echelle) au carre = somme des carres des deux autres cotes."
          },
          {
            id: "m_pyth_06",
            titre: "Une valeur non entiere",
            diff: "difficile",
            enonce: "Le triangle KLM est rectangle en L. On donne KL = 7 cm et LM = 4 cm. On cherche l'hypotenuse KM.",
            questions: [
              "Ecris l'egalite de Pythagore pour ce triangle.",
              "Calcule KM^2.",
              "Donne la valeur exacte, puis la valeur arrondie au dixieme de KM."
            ],
            correction: [
              "KM^2 = KL^2 + LM^2.",
              "KM^2 = 7^2 + 4^2 = 49 + 16 = 65.",
              "Valeur exacte : KM = racine de 65. Valeur approchee : KM = 8,1 cm environ."
            ],
            piege: "Si le carre ne tombe pas juste, on garde la racine (valeur exacte) ou on arrondit."
          },
          {
            id: "m_pyth_07",
            titre: "La longueur d'un cable",
            diff: "moyen",
            enonce: "Un mat vertical [AB] mesure 6 m. Un cable relie le sommet B a un point C du sol, situe a 8 m du pied A du mat. Le triangle ABC est rectangle en A. On cherche la longueur du cable BC.",
            questions: [
              "Quel cote du triangle represente le cable ?",
              "Ecris l'egalite de Pythagore.",
              "Calcule la longueur du cable BC."
            ],
            correction: [
              "Le cable est l'hypotenuse [BC] (oppose a l'angle droit).",
              "BC^2 = AB^2 + AC^2.",
              "BC^2 = 6^2 + 8^2 = 36 + 64 = 100, donc BC = 10 m."
            ],
            piege: "L'hypotenuse (le cable) au carre = somme des carres des deux autres cotes."
          },
          {
            id: "m_pyth_08",
            titre: "Triangle rectangle ou non ?",
            diff: "difficile",
            enonce: "Un triangle RST a pour cotes RS = 5 cm, ST = 6 cm et RT = 8 cm. On veut savoir s'il est rectangle.",
            questions: [
              "Quel est le cote le plus long ?",
              "Calcule RT^2 d'une part, puis RS^2 + ST^2 d'autre part.",
              "Compare et conclus."
            ],
            correction: [
              "Le cote le plus long est [RT] = 8 cm.",
              "RT^2 = 64 ; RS^2 + ST^2 = 25 + 36 = 61.",
              "64 n'est pas egal a 61 : d'apres la reciproque (contraposee) de Pythagore, le triangle n'est PAS rectangle."
            ],
            piege: "Si (grand cote)^2 n'est pas egal a la somme des carres des deux autres, le triangle n'est pas rectangle."
          },
          {
            id: "m_pyth_09",
            titre: "La diagonale d'un carre",
            diff: "moyen",
            enonce: "Un carre ABCD a un cote de 5 cm. On cherche la longueur de sa diagonale AC (voir figure).",
            schema: `<svg width="100%" viewBox="0 0 220 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Carre ABCD et sa diagonale</title><desc>Carre de cote 5 cm.</desc><polygon points="55,45 155,45 155,145 55,145" fill="none" stroke="currentColor" stroke-width="2"/><line x1="55" y1="45" x2="155" y2="145" stroke="currentColor" stroke-width="2"/><rect x="141" y="45" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="44" y="42" font-size="14" fill="currentColor" font-family="sans-serif">A</text><text x="160" y="42" font-size="14" fill="currentColor" font-family="sans-serif">B</text><text x="160" y="159" font-size="14" fill="currentColor" font-family="sans-serif">C</text><text x="44" y="159" font-size="14" fill="currentColor" font-family="sans-serif">D</text><text x="92" y="38" font-size="12" fill="currentColor" font-family="sans-serif">5 cm</text><text x="58" y="104" font-size="12" fill="currentColor" font-family="sans-serif">? cm</text></svg>`,
            questions: [
              "La diagonale partage le carre en deux triangles rectangles. Ecris l'egalite de Pythagore dans le triangle ABC.",
              "Calcule le carre de la diagonale AC.",
              "Donne la longueur de la diagonale (arrondie au dixieme)."
            ],
            correction: [
              "AC^2 = AB^2 + BC^2 = 5^2 + 5^2.",
              "AC^2 = 25 + 25 = 50.",
              "AC = racine de 50 = 7,1 cm environ."
            ],
            piege: "La diagonale d'un carre de cote c vaut c x racine de 2 (elle n'est jamais un nombre entier)."
          },
          {
            id: "m_pyth_10",
            titre: "Montrer qu'un triangle est rectangle",
            diff: "difficile",
            enonce: "Sur la figure, on donne AB = 6 cm, AC = 8 cm et BC = 10 cm.",
            schema: `<svg width="100%" viewBox="0 0 240 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Triangle ABC</title><desc>AB = 6 cm, AC = 8 cm, BC = 10 cm.</desc><polygon points="55,160 55,60 205,160" fill="none" stroke="currentColor" stroke-width="2"/><rect x="55" y="146" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="44" y="176" font-size="14" fill="currentColor" font-family="sans-serif">A</text><text x="44" y="56" font-size="14" fill="currentColor" font-family="sans-serif">B</text><text x="211" y="176" font-size="14" fill="currentColor" font-family="sans-serif">C</text><text x="20" y="112" font-size="12" fill="currentColor" font-family="sans-serif">6 cm</text><text x="118" y="178" font-size="12" fill="currentColor" font-family="sans-serif">8 cm</text><text x="138" y="104" font-size="12" fill="currentColor" font-family="sans-serif">10 cm</text></svg>`,
            questions: [
              "Montrer que le triangle ABC est rectangle en A.",
              "En deduire l'aire du triangle ABC."
            ],
            correction: [
              "Le plus grand cote est [BC]. BC^2 = 10^2 = 100. AB^2 + AC^2 = 6^2 + 8^2 = 36 + 64 = 100. Comme BC^2 = AB^2 + AC^2, d'apres la reciproque de Pythagore, ABC est rectangle en A.",
              "Les cotes de l'angle droit servent de base et de hauteur : aire = (AB x AC) / 2 = (6 x 8) / 2 = 24 cm^2."
            ],
            piege: "Pour « montrer que c'est rectangle », on compare (grand cote)^2 et la somme des carres des deux autres."
          },
          {
            id: "m_pyth_11",
            titre: "QCM Pythagore",
            diff: "moyen",
            enonce: "QCM : pour chaque question, une seule reponse est correcte. Un triangle est rectangle ; les deux cotes de l'angle droit mesurent 9 cm et 12 cm.",
            questions: [
              "L'hypotenuse mesure : a) 15 cm   b) 21 cm   c) 225 cm",
              "Le perimetre du triangle vaut : a) 36 cm   b) 30 cm   c) 21 cm"
            ],
            correction: [
              "Hypotenuse^2 = 9^2 + 12^2 = 81 + 144 = 225, donc hypotenuse = 15 cm. Reponse a).",
              "Perimetre = 9 + 12 + 15 = 36 cm. Reponse a)."
            ],
            piege: "Dans un QCM, on calcule vraiment : on ne choisit pas au hasard."
          },
          {
            id: "m_pyth_12",
            titre: "Retrouver la largeur",
            diff: "difficile",
            enonce: "Un rectangle a une longueur de 24 cm et une diagonale de 25 cm. On cherche sa largeur.",
            questions: [
              "Le triangle forme par la longueur, la largeur et la diagonale est rectangle. Ecris l'egalite de Pythagore.",
              "Calcule la largeur du rectangle."
            ],
            correction: [
              "diagonale^2 = longueur^2 + largeur^2, soit 25^2 = 24^2 + largeur^2.",
              "625 = 576 + largeur^2 -> largeur^2 = 49 -> largeur = 7 cm."
            ],
            piege: "La diagonale est l'hypotenuse : pour un cote, on SOUSTRAIT les carres."
          },
          {
            id: "m_pyth_13",
            titre: "Vrai ou faux : triangle rectangle",
            diff: "moyen",
            enonce: "Un triangle a pour cotes 7 cm, 24 cm et 25 cm. Affirmation : ce triangle est rectangle.",
            questions: [
              "Cette affirmation est-elle vraie ou fausse ? Justifie par un calcul."
            ],
            correction: [
              "Plus grand cote : 25. 25^2 = 625. 7^2 + 24^2 = 49 + 576 = 625. Les deux sont egaux : d'apres la reciproque de Pythagore, l'affirmation est VRAIE, le triangle est rectangle."
            ],
            piege: "Pour justifier, on compare toujours (grand cote)^2 a la somme des carres des deux autres."
          },
          {
            id: "m_pyth_14",
            titre: "La distance a vol d'oiseau",
            diff: "moyen",
            enonce: "Un bateau quitte le port, navigue 9 km vers l'est, puis 12 km vers le nord. On cherche la distance directe (a vol d'oiseau) entre le bateau et le port.",
            questions: [
              "Pourquoi le trajet forme-t-il un angle droit ?",
              "Calcule la distance a vol d'oiseau."
            ],
            correction: [
              "L'est et le nord sont des directions perpendiculaires : elles forment un angle droit.",
              "d^2 = 9^2 + 12^2 = 81 + 144 = 225, donc d = 15 km."
            ],
            piege: "Deux directions perpendiculaires (est/nord) forment un angle droit : on peut utiliser Pythagore."
          }
        ]
      },

      /* ================= THEME 2 : THEOREME DE THALES ================= */
      {
        id: "thales",
        titre: "Theoreme de Thales",
        exos: [
          {
            id: "m_thal_01",
            titre: "Calculer une longueur",
            diff: "moyen",
            enonce: "Les droites (BC) et (DE) sont paralleles. Les points A, B, D sont alignes, ainsi que A, C, E. On donne AB = 4 cm, AD = 6 cm et BC = 5 cm (voir figure).",
            schema: `<svg width="100%" viewBox="0 0 280 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Configuration de Thales</title><desc>Triangle ADE avec (BC) parallele a (DE).</desc><polygon points="140,30 45,170 235,170" fill="none" stroke="currentColor" stroke-width="2"/><line x1="77" y1="123" x2="203" y2="123" stroke="currentColor" stroke-width="2"/><text x="134" y="24" font-size="14" fill="currentColor" font-family="sans-serif">A</text><text x="58" y="126" font-size="14" fill="currentColor" font-family="sans-serif">B</text><text x="208" y="126" font-size="14" fill="currentColor" font-family="sans-serif">C</text><text x="32" y="184" font-size="14" fill="currentColor" font-family="sans-serif">D</text><text x="238" y="184" font-size="14" fill="currentColor" font-family="sans-serif">E</text><text x="86" y="74" font-size="12" fill="currentColor" font-family="sans-serif">4</text><text x="44" y="152" font-size="12" fill="currentColor" font-family="sans-serif">6</text><text x="132" y="116" font-size="12" fill="currentColor" font-family="sans-serif">5</text><text x="128" y="188" font-size="12" fill="currentColor" font-family="sans-serif">?</text></svg>`,
            questions: [
              "Pourquoi peut-on appliquer le theoreme de Thales ?",
              "Ecris les rapports egaux donnes par le theoreme.",
              "Calcule la longueur DE.",
              "Le triangle ADE est-il un agrandissement du triangle ABC ? De quel rapport ?"
            ],
            correction: [
              "Car (BC) // (DE) et les points sont alignes : A, B, D d'une part, A, C, E d'autre part.",
              "AB/AD = AC/AE = BC/DE.",
              "AB/AD = BC/DE -> 4/6 = 5/DE -> DE = 5 x 6 / 4 = 7,5 cm.",
              "Oui : rapport AD/AB = 6/4 = 1,5 (agrandissement de coefficient 1,5)."
            ],
            piege: "On place les longueurs correspondantes dans le meme ordre dans chaque rapport."
          },
          {
            id: "m_thal_02",
            titre: "Thales avec deux droites secantes",
            diff: "difficile",
            enonce: "Les droites (MN) et (PQ) sont paralleles. A est le point d'intersection des droites (MP) et (NQ). On donne AM = 3 cm, AP = 7,5 cm et AN = 4 cm.",
            questions: [
              "Ecris l'egalite des rapports de Thales.",
              "Calcule AQ.",
              "Sachant que MN = 2,4 cm, calcule PQ."
            ],
            correction: [
              "AM/AP = AN/AQ = MN/PQ.",
              "AM/AP = AN/AQ -> 3/7,5 = 4/AQ -> AQ = 4 x 7,5 / 3 = 10 cm.",
              "AM/AP = MN/PQ -> 3/7,5 = 2,4/PQ -> PQ = 2,4 x 7,5 / 3 = 6 cm."
            ],
            piege: "Les rapports se lisent dans le meme ordre : petit triangle / grand triangle."
          },
          {
            id: "m_thal_03",
            titre: "Les droites sont-elles paralleles ?",
            diff: "difficile",
            enonce: "Les points A, B, C sont alignes dans cet ordre, ainsi que A, D, E. On donne AB = 2 cm, AC = 5 cm, AD = 3 cm et AE = 7 cm. On veut savoir si (BD) et (CE) sont paralleles.",
            questions: [
              "Calcule le rapport AB/AC.",
              "Calcule le rapport AD/AE.",
              "Compare les deux rapports. Les droites (BD) et (CE) sont-elles paralleles ?"
            ],
            correction: [
              "AB/AC = 2/5 = 0,4.",
              "AD/AE = 3/7 = 0,43 environ.",
              "0,4 n'est pas egal a 0,43 : les rapports sont differents, donc les droites ne sont PAS paralleles."
            ],
            piege: "Si les rapports sont differents, les droites ne sont pas paralleles (contraposee de Thales)."
          },
          {
            id: "m_thal_04",
            titre: "Configuration papillon",
            diff: "moyen",
            enonce: "Les segments [AD] et [BC] se coupent en O. Les droites (AB) et (CD) sont paralleles. On donne OA = 3 cm, OB = 4 cm et OD = 6 cm (voir figure).",
            schema: `<svg width="100%" viewBox="0 0 260 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Configuration papillon de Thales</title><desc>Deux triangles opposes par le sommet O, (AB) parallele a (CD).</desc><line x1="45" y1="40" x2="215" y2="160" stroke="currentColor" stroke-width="2"/><line x1="215" y1="40" x2="45" y2="160" stroke="currentColor" stroke-width="2"/><line x1="45" y1="40" x2="215" y2="40" stroke="currentColor" stroke-width="2"/><line x1="45" y1="160" x2="215" y2="160" stroke="currentColor" stroke-width="2"/><circle cx="130" cy="100" r="2.5" fill="currentColor"/><text x="36" y="38" font-size="14" fill="currentColor" font-family="sans-serif">A</text><text x="220" y="38" font-size="14" fill="currentColor" font-family="sans-serif">B</text><text x="34" y="170" font-size="14" fill="currentColor" font-family="sans-serif">C</text><text x="220" y="170" font-size="14" fill="currentColor" font-family="sans-serif">D</text><text x="136" y="104" font-size="13" fill="currentColor" font-family="sans-serif">O</text><text x="80" y="66" font-size="12" fill="currentColor" font-family="sans-serif">3</text><text x="172" y="66" font-size="12" fill="currentColor" font-family="sans-serif">4</text><text x="172" y="138" font-size="12" fill="currentColor" font-family="sans-serif">6</text><text x="80" y="138" font-size="12" fill="currentColor" font-family="sans-serif">?</text></svg>`,
            questions: [
              "Pourquoi peut-on appliquer le theoreme de Thales (configuration papillon) ?",
              "Ecris les rapports egaux.",
              "Calcule la longueur OC."
            ],
            correction: [
              "Car (AB) // (CD), et les points A, O, D d'une part, B, O, C d'autre part, sont alignes.",
              "OA/OD = OB/OC = AB/CD.",
              "OA/OD = OB/OC -> 3/6 = 4/OC -> OC = 4 x 6 / 3 = 8 cm."
            ],
            piege: "Configuration papillon : O est entre les deux triangles, mais Thales s'applique de la meme facon."
          },
          {
            id: "m_thal_05",
            titre: "La hauteur d'un arbre",
            diff: "moyen",
            enonce: "Pour mesurer un arbre, on plante un piquet de 1 m qui projette une ombre de 1,5 m. Au meme instant, l'arbre projette une ombre de 9 m. Les rayons du soleil forment des triangles semblables.",
            questions: [
              "Ecris la relation de proportionnalite entre les hauteurs et les ombres.",
              "Calcule la hauteur de l'arbre.",
              "Verifie en comparant le rapport hauteur/ombre dans les deux cas."
            ],
            correction: [
              "hauteur du piquet / ombre du piquet = hauteur de l'arbre / ombre de l'arbre -> 1 / 1,5 = H / 9.",
              "H = 9 x 1 / 1,5 = 6 m.",
              "Piquet : 1/1,5 = 0,67 ; arbre : 6/9 = 0,67 : meme rapport."
            ],
            piege: "Les hauteurs sont proportionnelles aux ombres (triangles semblables, theoreme de Thales)."
          },
          {
            id: "m_thal_06",
            titre: "Thales et agrandissement",
            diff: "difficile",
            enonce: "Les droites (RS) et (TU) sont paralleles. Les points O, R, T sont alignes, ainsi que O, S, U. On donne OR = 4 cm, OT = 10 cm et RS = 3 cm.",
            questions: [
              "Ecris les rapports egaux du theoreme de Thales.",
              "Calcule la longueur TU.",
              "Le triangle OTU est l'agrandissement du triangle ORS : de quel coefficient ?"
            ],
            correction: [
              "OR/OT = OS/OU = RS/TU.",
              "OR/OT = RS/TU -> 4/10 = 3/TU -> TU = 3 x 10 / 4 = 7,5 cm.",
              "Coefficient = OT/OR = 10/4 = 2,5."
            ],
            piege: "Le coefficient d'agrandissement = grand cote / petit cote correspondant."
          },
          {
            id: "m_thal_07",
            titre: "Droite parallele dans un triangle",
            diff: "moyen",
            enonce: "Dans le triangle ABC, M est un point de [AB] et N un point de [AC] tels que (MN) // (BC). On donne AM = 2 cm, AB = 6 cm et MN = 3 cm (voir figure).",
            schema: `<svg width="100%" viewBox="0 0 240 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Triangle ABC avec (MN) parallele a (BC)</title><desc>M sur AB, N sur AC, (MN) parallele a (BC).</desc><polygon points="120,30 45,165 195,165" fill="none" stroke="currentColor" stroke-width="2"/><line x1="95" y1="75" x2="145" y2="75" stroke="currentColor" stroke-width="2"/><text x="114" y="24" font-size="14" fill="currentColor" font-family="sans-serif">A</text><text x="34" y="178" font-size="14" fill="currentColor" font-family="sans-serif">B</text><text x="200" y="178" font-size="14" fill="currentColor" font-family="sans-serif">C</text><text x="78" y="78" font-size="13" fill="currentColor" font-family="sans-serif">M</text><text x="150" y="78" font-size="13" fill="currentColor" font-family="sans-serif">N</text><text x="98" y="56" font-size="12" fill="currentColor" font-family="sans-serif">2</text><text x="62" y="128" font-size="12" fill="currentColor" font-family="sans-serif">6</text><text x="112" y="71" font-size="12" fill="currentColor" font-family="sans-serif">3</text><text x="112" y="182" font-size="12" fill="currentColor" font-family="sans-serif">?</text></svg>`,
            questions: [
              "Ecris les rapports egaux du theoreme de Thales.",
              "Calcule la longueur BC."
            ],
            correction: [
              "AM/AB = AN/AC = MN/BC.",
              "AM/AB = MN/BC -> 2/6 = 3/BC -> BC = 3 x 6 / 2 = 9 cm."
            ],
            piege: "On ecrit les longueurs du petit triangle sur celles du grand, dans le meme ordre."
          },
          {
            id: "m_thal_08",
            titre: "Calculer plusieurs longueurs",
            diff: "difficile",
            enonce: "Les points A, M, B sont alignes dans cet ordre, ainsi que A, N, C. Les droites (MN) et (BC) sont paralleles. On donne AM = 4 cm, MB = 6 cm et AN = 3 cm.",
            questions: [
              "Calcule la longueur AB.",
              "Ecris le rapport de Thales et calcule AC.",
              "En deduire la longueur NC."
            ],
            correction: [
              "AB = AM + MB = 4 + 6 = 10 cm.",
              "AM/AB = AN/AC -> 4/10 = 3/AC -> AC = 3 x 10 / 4 = 7,5 cm.",
              "NC = AC - AN = 7,5 - 3 = 4,5 cm."
            ],
            piege: "Attention : AB = AM + MB (on additionne les segments avant d'appliquer Thales)."
          },
          {
            id: "m_thal_09",
            titre: "Prouver que deux droites sont paralleles",
            diff: "moyen",
            enonce: "Les points O, A, B sont alignes dans cet ordre, ainsi que O, C, D. On donne OA = 3 cm, OB = 9 cm, OC = 4 cm et OD = 12 cm. On veut savoir si (AC) et (BD) sont paralleles.",
            questions: [
              "Calcule les rapports OA/OB et OC/OD.",
              "Compare-les et conclus."
            ],
            correction: [
              "OA/OB = 3/9 = 1/3 ; OC/OD = 4/12 = 1/3.",
              "Les rapports sont egaux et les points sont alignes dans le meme ordre : d'apres la reciproque de Thales, (AC) // (BD)."
            ],
            piege: "Rapports egaux + bon ordre d'alignement -> droites paralleles (reciproque de Thales)."
          },
          {
            id: "m_thal_10",
            titre: "Montrer une longueur",
            diff: "difficile",
            enonce: "Sur la figure, B est un point de [AD], C un point de [AE], et (BC) // (DE). On donne AB = 5 cm, AD = 8 cm et DE = 6,4 cm.",
            schema: `<svg width="100%" viewBox="0 0 240 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Configuration de Thales</title><desc>(BC) parallele a (DE).</desc><polygon points="120,30 45,165 195,165" fill="none" stroke="currentColor" stroke-width="2"/><line x1="73" y1="114" x2="167" y2="114" stroke="currentColor" stroke-width="2"/><text x="114" y="24" font-size="14" fill="currentColor" font-family="sans-serif">A</text><text x="56" y="117" font-size="13" fill="currentColor" font-family="sans-serif">B</text><text x="170" y="117" font-size="13" fill="currentColor" font-family="sans-serif">C</text><text x="34" y="178" font-size="14" fill="currentColor" font-family="sans-serif">D</text><text x="200" y="178" font-size="14" fill="currentColor" font-family="sans-serif">E</text><text x="86" y="78" font-size="12" fill="currentColor" font-family="sans-serif">5</text><text x="60" y="148" font-size="12" fill="currentColor" font-family="sans-serif">8</text><text x="110" y="182" font-size="12" fill="currentColor" font-family="sans-serif">6,4</text></svg>`,
            questions: [
              "Justifie que l'on peut appliquer le theoreme de Thales.",
              "Montrer que BC = 4 cm."
            ],
            correction: [
              "Les points A, B, D sont alignes, A, C, E sont alignes, et (BC) // (DE) : on peut appliquer le theoreme de Thales.",
              "AB/AD = BC/DE -> 5/8 = BC/6,4 -> BC = 5 x 6,4 / 8 = 32 / 8 = 4 cm."
            ],
            piege: "« Montrer que » : on pose le calcul de Thales et on doit retomber sur la valeur annoncee."
          },
          {
            id: "m_thal_11",
            titre: "QCM Thales",
            diff: "moyen",
            enonce: "QCM. Dans un triangle ABC, M est sur [AB], N est sur [AC] et (MN) // (BC). On donne AM = 3 cm, AB = 9 cm et AN = 4 cm.",
            questions: [
              "Le rapport AM/AB vaut : a) 1/3   b) 3   c) 1/2",
              "La longueur AC vaut : a) 12 cm   b) 6 cm   c) 7 cm"
            ],
            correction: [
              "AM/AB = 3/9 = 1/3. Reponse a).",
              "AN/AC = AM/AB -> 4/AC = 1/3 -> AC = 4 x 3 = 12 cm. Reponse a)."
            ],
            piege: "Le rapport 1/3 est une reduction ; pour AC, on multiplie AN par 3."
          },
          {
            id: "m_thal_12",
            titre: "Agrandissement et longueur",
            diff: "difficile",
            enonce: "Les points A, B, M sont alignes, ainsi que A, C, N, avec (BC) // (MN). On donne AB = 2,5 cm, AM = 7,5 cm et BC = 3 cm.",
            questions: [
              "Determine le coefficient d'agrandissement AM/AB.",
              "Calcule la longueur MN."
            ],
            correction: [
              "AM/AB = 7,5 / 2,5 = 3.",
              "MN = BC x 3 = 3 x 3 = 9 cm."
            ],
            piege: "Le grand triangle est l'agrandissement du petit : on multiplie par le coefficient (ici 3)."
          },
          {
            id: "m_thal_13",
            titre: "Vrai ou faux : paralleles",
            diff: "moyen",
            enonce: "Les points O, A, B sont alignes dans cet ordre, ainsi que O, C, D. On donne OA = 2 cm, OB = 5 cm, OC = 3 cm et OD = 7,5 cm. Affirmation : (AC) et (BD) sont paralleles.",
            questions: [
              "Cette affirmation est-elle vraie ou fausse ? Justifie."
            ],
            correction: [
              "OA/OB = 2/5 = 0,4 et OC/OD = 3/7,5 = 0,4. Les rapports sont egaux et les points alignes dans le meme ordre : d'apres la reciproque de Thales, l'affirmation est VRAIE, (AC) // (BD)."
            ],
            piege: "Rapports egaux + bon ordre = droites paralleles (reciproque de Thales)."
          },
          {
            id: "m_thal_14",
            titre: "La hauteur d'un batiment",
            diff: "moyen",
            enonce: "Pour mesurer la hauteur DE d'un batiment, on vise son sommet. Les points A, B, D sont alignes, A, C, E sont alignes, et (BC) // (DE). On mesure AB = 2 m, AD = 20 m et BC = 1,6 m.",
            questions: [
              "Ecris l'egalite de Thales adaptee.",
              "Calcule la hauteur DE du batiment."
            ],
            correction: [
              "AB/AD = BC/DE.",
              "2/20 = 1,6/DE -> DE = 1,6 x 20 / 2 = 16 m."
            ],
            piege: "Le theoreme de Thales permet de mesurer des hauteurs inaccessibles."
          }
        ]
      },

      /* ================= THEME 3 : TRIGONOMETRIE ================= */
      {
        id: "trigo",
        titre: "Trigonometrie",
        exos: [
          {
            id: "m_trigo_01",
            titre: "Trouver un angle avec le cosinus",
            diff: "moyen",
            enonce: "Le triangle ABC est rectangle en A. On s'interesse a l'angle en B. On donne AB = 4 cm (cote adjacent a l'angle B) et BC = 8 cm (hypotenuse).",
            schema: `<svg width="100%" viewBox="0 0 260 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Triangle rectangle, angle en B</title><desc>Triangle rectangle en A, AB = 4 cm, BC = 8 cm.</desc><polygon points="50,165 220,165 220,55" fill="none" stroke="currentColor" stroke-width="2"/><rect x="206" y="151" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M 82 165 A 32 32 0 0 0 74 142" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="40" y="180" font-size="14" fill="currentColor" font-family="sans-serif">B</text><text x="226" y="180" font-size="14" fill="currentColor" font-family="sans-serif">A</text><text x="226" y="52" font-size="14" fill="currentColor" font-family="sans-serif">C</text><text x="128" y="183" font-size="13" fill="currentColor" font-family="sans-serif">4 cm</text><text x="118" y="100" font-size="13" fill="currentColor" font-family="sans-serif">8 cm</text><text x="90" y="158" font-size="12" fill="currentColor" font-family="sans-serif">?</text></svg>`,
            questions: [
              "Quelle relation lie l'angle B, le cote adjacent et l'hypotenuse ?",
              "Calcule cos(B).",
              "En deduire la mesure de l'angle B (arrondie au degre)."
            ],
            correction: [
              "cos(B) = cote adjacent / hypotenuse.",
              "cos(B) = AB / BC = 4 / 8 = 0,5.",
              "B = arccos(0,5) = 60 degres."
            ],
            piege: "SOH CAH TOA : le cosinus utilise l'adjacent et l'hypotenuse (CAH)."
          },
          {
            id: "m_trigo_02",
            titre: "Calculer un cote avec la tangente",
            diff: "difficile",
            enonce: "Le triangle DEF est rectangle en D. L'angle en E mesure 30 degres et le cote DE = 5 cm (adjacent a l'angle E). On cherche DF, le cote oppose a l'angle E.",
            questions: [
              "Quelle relation utiliser : cosinus, sinus ou tangente ?",
              "Ecris cette relation pour l'angle E.",
              "Calcule DF (arrondi au dixieme). On donne tan(30) = 0,577."
            ],
            correction: [
              "On connait l'adjacent et on cherche l'oppose : on utilise la tangente.",
              "tan(E) = DF / DE (oppose / adjacent).",
              "DF = DE x tan(30) = 5 x 0,577 = 2,9 cm environ."
            ],
            piege: "TOA : la tangente utilise l'oppose et l'adjacent (Tangente = Oppose / Adjacent)."
          },
          {
            id: "m_trigo_03",
            titre: "L'echelle contre le mur",
            diff: "moyen",
            enonce: "Une echelle de 5 m est appuyee contre un mur vertical. Elle forme un angle de 70 degres avec le sol horizontal. On cherche la hauteur atteinte sur le mur. On donne sin(70) = 0,94.",
            questions: [
              "Dans le triangle rectangle forme, quel cote represente l'echelle ?",
              "La hauteur cherchee est-elle le cote oppose ou adjacent a l'angle de 70 degres ?",
              "Calcule la hauteur atteinte (arrondie au dixieme)."
            ],
            correction: [
              "L'echelle est l'hypotenuse du triangle rectangle.",
              "La hauteur est le cote oppose a l'angle de 70 degres.",
              "sin(70) = hauteur / 5 -> hauteur = 5 x 0,94 = 4,7 m."
            ],
            piege: "SOH : le sinus utilise l'oppose et l'hypotenuse (Sinus = Oppose / Hypotenuse)."
          },
          {
            id: "m_trigo_04",
            titre: "Trouver un cote avec le cosinus",
            diff: "moyen",
            enonce: "Le triangle ABC est rectangle en B. L'angle en A mesure 40 degres et l'hypotenuse AC = 10 cm. On cherche AB, le cote adjacent a l'angle A (voir figure). On donne cos(40) = 0,766.",
            schema: `<svg width="100%" viewBox="0 0 260 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Triangle rectangle en B, angle de 40 degres en A</title><desc>Hypotenuse AC = 10 cm, on cherche AB.</desc><polygon points="50,160 220,160 220,50" fill="none" stroke="currentColor" stroke-width="2"/><rect x="206" y="146" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M 82 160 A 32 32 0 0 0 76 137" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="40" y="175" font-size="14" fill="currentColor" font-family="sans-serif">A</text><text x="226" y="175" font-size="14" fill="currentColor" font-family="sans-serif">B</text><text x="226" y="48" font-size="14" fill="currentColor" font-family="sans-serif">C</text><text x="88" y="153" font-size="11" fill="currentColor" font-family="sans-serif">40</text><text x="128" y="178" font-size="12" fill="currentColor" font-family="sans-serif">? cm</text><text x="120" y="98" font-size="12" fill="currentColor" font-family="sans-serif">10 cm</text></svg>`,
            questions: [
              "Quelle relation lie l'angle A, le cote AB (adjacent) et l'hypotenuse AC ?",
              "Ecris cette relation et isole AB.",
              "Calcule AB (arrondi au dixieme)."
            ],
            correction: [
              "cos(A) = AB / AC (adjacent / hypotenuse).",
              "AB = AC x cos(A).",
              "AB = 10 x cos(40) = 10 x 0,766 = 7,7 cm."
            ],
            piege: "CAH : pour trouver le cote adjacent, on MULTIPLIE l'hypotenuse par le cosinus."
          },
          {
            id: "m_trigo_05",
            titre: "L'angle d'une rampe",
            diff: "difficile",
            enonce: "Une rampe d'acces monte de 0,5 m de hauteur sur une longueur horizontale de 4 m. On cherche l'angle d'inclinaison de la rampe avec l'horizontale.",
            questions: [
              "Quelle relation lie l'angle, la hauteur (cote oppose) et la longueur horizontale (cote adjacent) ?",
              "Calcule la tangente de cet angle.",
              "En deduire la mesure de l'angle (arrondie au degre). On donne arctan(0,125) = 7 degres environ."
            ],
            correction: [
              "tan(angle) = cote oppose / cote adjacent = hauteur / longueur.",
              "tan(angle) = 0,5 / 4 = 0,125.",
              "angle = arctan(0,125) = 7 degres environ."
            ],
            piege: "TOA : la tangente relie l'oppose et l'adjacent (ici la hauteur sur la longueur horizontale)."
          },
          {
            id: "m_trigo_06",
            titre: "Trouver l'hypotenuse avec le sinus",
            diff: "moyen",
            enonce: "Dans un triangle rectangle, un angle mesure 30 degres et le cote oppose a cet angle mesure 5 cm. On cherche l'hypotenuse. On donne sin(30) = 0,5.",
            questions: [
              "Quelle relation lie l'angle, le cote oppose et l'hypotenuse ?",
              "Isole l'hypotenuse dans cette relation.",
              "Calcule la longueur de l'hypotenuse."
            ],
            correction: [
              "sin(30) = cote oppose / hypotenuse.",
              "hypotenuse = cote oppose / sin(30).",
              "hypotenuse = 5 / 0,5 = 10 cm."
            ],
            piege: "SOH : pour trouver l'hypotenuse, on DIVISE le cote oppose par le sinus."
          },
          {
            id: "m_trigo_07",
            titre: "Trouver un angle avec la tangente",
            diff: "moyen",
            enonce: "Le triangle ABC est rectangle en A. On donne AB = 3 cm et AC = 4 cm. On cherche la mesure de l'angle en B (voir figure). On donne arctan(1,33) = 53 degres environ.",
            schema: `<svg width="100%" viewBox="0 0 240 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Triangle rectangle en A</title><desc>AB = 3 cm, AC = 4 cm, angle cherche en B.</desc><polygon points="55,160 55,55 205,160" fill="none" stroke="currentColor" stroke-width="2"/><rect x="55" y="146" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M 55 79 A 24 24 0 0 0 73 64" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="44" y="176" font-size="14" fill="currentColor" font-family="sans-serif">A</text><text x="44" y="52" font-size="14" fill="currentColor" font-family="sans-serif">B</text><text x="211" y="176" font-size="14" fill="currentColor" font-family="sans-serif">C</text><text x="22" y="112" font-size="12" fill="currentColor" font-family="sans-serif">3 cm</text><text x="120" y="178" font-size="12" fill="currentColor" font-family="sans-serif">4 cm</text></svg>`,
            questions: [
              "Pour l'angle B, quel cote est le cote oppose ? Quel cote est le cote adjacent ?",
              "Calcule tan(B).",
              "En deduire la mesure de l'angle B (arrondie au degre)."
            ],
            correction: [
              "Oppose a B : AC = 4 cm. Adjacent a B : AB = 3 cm.",
              "tan(B) = AC / AB = 4 / 3 = 1,33 environ.",
              "B = arctan(1,33) = 53 degres environ."
            ],
            piege: "TOA : pour un angle, bien reperer son cote oppose et son cote adjacent."
          },
          {
            id: "m_trigo_08",
            titre: "La hauteur d'un cerf-volant",
            diff: "difficile",
            enonce: "Un cerf-volant est tenu par un fil tendu de 20 m. Le fil fait un angle de 50 degres avec le sol horizontal. On cherche la hauteur du cerf-volant. On donne sin(50) = 0,766.",
            questions: [
              "Le fil represente quel cote du triangle rectangle ? La hauteur est-elle le cote oppose ou adjacent a l'angle de 50 degres ?",
              "Ecris la relation de trigonometrie adaptee.",
              "Calcule la hauteur du cerf-volant (arrondie au dixieme)."
            ],
            correction: [
              "Le fil est l'hypotenuse. La hauteur est le cote oppose a l'angle de 50 degres.",
              "sin(50) = hauteur / 20.",
              "hauteur = 20 x sin(50) = 20 x 0,766 = 15,3 m."
            ],
            piege: "SOH : cote oppose = hypotenuse x sin(angle)."
          },
          {
            id: "m_trigo_09",
            titre: "Trouver l'hypotenuse avec le cosinus",
            diff: "moyen",
            enonce: "Dans un triangle rectangle, un angle mesure 60 degres et le cote adjacent a cet angle mesure 8 cm. On cherche l'hypotenuse. On donne cos(60) = 0,5.",
            questions: [
              "Quelle relation lie l'angle, le cote adjacent et l'hypotenuse ?",
              "Isole l'hypotenuse.",
              "Calcule la longueur de l'hypotenuse."
            ],
            correction: [
              "cos(60) = cote adjacent / hypotenuse.",
              "hypotenuse = cote adjacent / cos(60).",
              "hypotenuse = 8 / 0,5 = 16 cm."
            ],
            piege: "CAH : pour trouver l'hypotenuse, on DIVISE le cote adjacent par le cosinus."
          },
          {
            id: "m_trigo_10",
            titre: "Pythagore puis trigonometrie",
            diff: "difficile",
            enonce: "Le triangle ABC est rectangle en A. On donne AB = 6 cm et BC = 7,5 cm (hypotenuse).",
            schema: `<svg width="100%" viewBox="0 0 240 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Triangle rectangle en A</title><desc>AB = 6 cm, hypotenuse BC = 7,5 cm.</desc><polygon points="55,160 55,65 205,160" fill="none" stroke="currentColor" stroke-width="2"/><rect x="55" y="146" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M 55 89 A 24 24 0 0 0 72 73" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="44" y="176" font-size="14" fill="currentColor" font-family="sans-serif">A</text><text x="44" y="62" font-size="14" fill="currentColor" font-family="sans-serif">B</text><text x="211" y="176" font-size="14" fill="currentColor" font-family="sans-serif">C</text><text x="20" y="116" font-size="12" fill="currentColor" font-family="sans-serif">6 cm</text><text x="128" y="106" font-size="12" fill="currentColor" font-family="sans-serif">7,5 cm</text></svg>`,
            questions: [
              "Calcule la longueur AC (theoreme de Pythagore).",
              "Calcule cos de l'angle B.",
              "En deduire la mesure de l'angle B (arrondie au degre)."
            ],
            correction: [
              "AC^2 = BC^2 - AB^2 = 7,5^2 - 6^2 = 56,25 - 36 = 20,25, donc AC = 4,5 cm.",
              "cos(B) = AB / BC = 6 / 7,5 = 0,8.",
              "B = arccos(0,8) = 37 degres environ."
            ],
            piege: "On combine Pythagore (pour un cote) et la trigonometrie (pour un angle)."
          },
          {
            id: "m_trigo_11",
            titre: "QCM trigonometrie",
            diff: "moyen",
            enonce: "QCM. Le triangle ABC est rectangle en A, l'angle B mesure 30 degres et BC = 10 cm (hypotenuse). On donne sin(30) = 0,5 et cos(30) = 0,87.",
            questions: [
              "Le cote AC (oppose a B) vaut : a) 5 cm   b) 8,7 cm   c) 10 cm",
              "Le cote AB (adjacent a B) vaut environ : a) 5 cm   b) 8,7 cm   c) 20 cm"
            ],
            correction: [
              "AC = BC x sin(30) = 10 x 0,5 = 5 cm. Reponse a).",
              "AB = BC x cos(30) = 10 x 0,87 = 8,7 cm. Reponse b)."
            ],
            piege: "Cote oppose -> sinus ; cote adjacent -> cosinus."
          },
          {
            id: "m_trigo_12",
            titre: "Trouver un angle avec le sinus",
            diff: "moyen",
            enonce: "Dans un triangle rectangle, le cote oppose a un angle x mesure 5 cm et l'hypotenuse 13 cm. On donne arcsin(0,385) = 23 degres environ.",
            questions: [
              "Quelle relation utiliser pour trouver l'angle x ?",
              "Calcule sin(x).",
              "Donne la mesure de l'angle x (arrondie au degre)."
            ],
            correction: [
              "sin(x) = cote oppose / hypotenuse.",
              "sin(x) = 5 / 13 = 0,385 environ.",
              "x = arcsin(0,385) = 23 degres environ."
            ],
            piege: "Connaitre le cote oppose et l'hypotenuse -> on utilise le sinus."
          },
          {
            id: "m_trigo_13",
            titre: "La pente d'un toit",
            diff: "difficile",
            enonce: "Un toit monte de 3 m de hauteur sur une longueur horizontale de 5 m. On cherche l'angle de la pente avec l'horizontale. On donne arctan(0,6) = 31 degres environ.",
            questions: [
              "Quelle relation lie l'angle, la hauteur et la longueur horizontale ?",
              "Calcule la tangente de l'angle.",
              "Donne la mesure de l'angle de la pente (arrondie au degre)."
            ],
            correction: [
              "tan(angle) = hauteur / longueur horizontale (oppose / adjacent).",
              "tan(angle) = 3 / 5 = 0,6.",
              "angle = arctan(0,6) = 31 degres environ."
            ],
            piege: "Une pente se calcule avec la tangente (hauteur sur longueur horizontale)."
          },
          {
            id: "m_trigo_14",
            titre: "Vrai ou faux : hypotenuse",
            diff: "moyen",
            enonce: "Dans un triangle rectangle, un angle mesure 45 degres et le cote adjacent a cet angle mesure 4 cm. Affirmation : l'hypotenuse mesure environ 5,7 cm. On donne cos(45) = 0,707.",
            questions: [
              "Cette affirmation est-elle vraie ou fausse ? Justifie par un calcul."
            ],
            correction: [
              "hypotenuse = cote adjacent / cos(45) = 4 / 0,707 = 5,66 cm, soit environ 5,7 cm. L'affirmation est VRAIE."
            ],
            piege: "CAH : hypotenuse = cote adjacent / cos(angle)."
          }
        ]
      },

      /* ================= THEME 4 : CALCUL LITTERAL ================= */
      {
        id: "calcul_litteral",
        titre: "Calcul litteral",
        exos: [
          {
            id: "m_lit_01",
            titre: "Developper avec la distributivite",
            diff: "facile",
            enonce: "On considere l'expression A = 3(x + 5).",
            questions: [
              "Developpe l'expression A.",
              "Calcule la valeur de A pour x = 2.",
              "Que vaut A pour x = 0 ?"
            ],
            correction: [
              "A = 3 x x + 3 x 5 = 3x + 15.",
              "A = 3 x 2 + 15 = 6 + 15 = 21.",
              "A = 3 x 0 + 15 = 15."
            ],
            piege: "Distributivite : 3(x + 5) = 3 x x + 3 x 5 (on multiplie CHAQUE terme)."
          },
          {
            id: "m_lit_02",
            titre: "Double distributivite",
            diff: "moyen",
            enonce: "Soit l'expression B = (x + 3)(x + 2).",
            questions: [
              "Developpe et reduis B.",
              "Calcule B pour x = 1.",
              "Calcule B pour x = 0."
            ],
            correction: [
              "B = x x x + x x 2 + 3 x x + 3 x 2 = x^2 + 2x + 3x + 6 = x^2 + 5x + 6.",
              "B = 1 + 5 + 6 = 12.",
              "B = 0 + 0 + 6 = 6."
            ],
            piege: "Double distributivite : chaque terme du 1er facteur multiplie chaque terme du 2e."
          },
          {
            id: "m_lit_03",
            titre: "Factoriser et resoudre",
            diff: "difficile",
            enonce: "Soit l'expression C = 5x^2 + 10x.",
            questions: [
              "Quel est le facteur commun aux deux termes ?",
              "Factorise l'expression C.",
              "Resous l'equation C = 0."
            ],
            correction: [
              "Le facteur commun est 5x (car 5x^2 = 5x x x et 10x = 5x x 2).",
              "C = 5x(x + 2).",
              "5x(x + 2) = 0 -> 5x = 0 ou x + 2 = 0 -> x = 0 ou x = -2."
            ],
            piege: "Un produit de facteurs est nul si (et seulement si) l'un des facteurs est nul."
          },
          {
            id: "m_lit_04",
            titre: "Developper et reduire",
            diff: "moyen",
            enonce: "Soit l'expression D = 2(3x - 1) + 5x.",
            questions: [
              "Developpe l'expression.",
              "Reduis-la.",
              "Calcule D pour x = 3."
            ],
            correction: [
              "D = 6x - 2 + 5x.",
              "D = 11x - 2 (on regroupe 6x et 5x).",
              "D = 11 x 3 - 2 = 33 - 2 = 31."
            ],
            piege: "On regroupe les termes en x ensemble, et les nombres ensemble."
          },
          {
            id: "m_lit_05",
            titre: "Developper un produit",
            diff: "difficile",
            enonce: "Soit l'expression E = (2x + 1)(x - 3).",
            questions: [
              "Developpe l'expression E.",
              "Reduis-la.",
              "Calcule E pour x = 0."
            ],
            correction: [
              "E = 2x x x + 2x x (-3) + 1 x x + 1 x (-3) = 2x^2 - 6x + x - 3.",
              "E = 2x^2 - 5x - 3.",
              "E = -3."
            ],
            piege: "Attention aux signes : 2x x (-3) = -6x."
          },
          {
            id: "m_lit_06",
            titre: "Un programme de calcul",
            diff: "moyen",
            enonce: "Programme de calcul : choisir un nombre, le multiplier par 4, puis ajouter 6. On note x le nombre choisi.",
            questions: [
              "Exprime le resultat du programme en fonction de x.",
              "Quel resultat obtient-on en choisissant x = 5 ?",
              "Quel nombre faut-il choisir pour obtenir 30 ?"
            ],
            correction: [
              "resultat = 4x + 6.",
              "4 x 5 + 6 = 20 + 6 = 26.",
              "4x + 6 = 30 -> 4x = 24 -> x = 6."
            ],
            piege: "Un programme de calcul se traduit par une expression litterale en fonction de x."
          },
          {
            id: "m_lit_07",
            titre: "Identite remarquable",
            diff: "difficile",
            enonce: "Soit l'expression F = (x + 4)^2. On rappelle l'identite : (a + b)^2 = a^2 + 2ab + b^2.",
            questions: [
              "Developpe F a l'aide de l'identite remarquable.",
              "Calcule F pour x = 1.",
              "Est-il vrai que (x + 4)^2 = x^2 + 16 ?"
            ],
            correction: [
              "F = x^2 + 2 x x x 4 + 4^2 = x^2 + 8x + 16.",
              "F = 1 + 8 + 16 = 25.",
              "Non : il manque le double produit 8x. (x + 4)^2 = x^2 + 8x + 16."
            ],
            piege: "(x + 4)^2 n'est PAS x^2 + 16 : il y a le double produit 2 x x x 4 = 8x."
          },
          {
            id: "m_lit_08",
            titre: "Reduire une expression",
            diff: "moyen",
            enonce: "Soit l'expression G = 4x + 3 - x + 7.",
            questions: [
              "Regroupe les termes en x.",
              "Regroupe les nombres.",
              "Donne l'expression reduite, puis calcule G pour x = 2."
            ],
            correction: [
              "4x - x = 3x.",
              "3 + 7 = 10.",
              "G = 3x + 10 ; pour x = 2 : G = 3 x 2 + 10 = 16."
            ],
            piege: "4x - x = 3x (et non 4) : on enleve un seul x."
          },
          {
            id: "m_lit_09",
            titre: "Factoriser",
            diff: "moyen",
            enonce: "On considere deux expressions : H = 7x + 7 et K = 3x^2 - 6x.",
            questions: [
              "Quel est le facteur commun dans H ? Factorise H.",
              "Quel est le facteur commun dans K ? Factorise K."
            ],
            correction: [
              "Facteur commun de H : 7. Donc H = 7(x + 1).",
              "Facteur commun de K : 3x. Donc K = 3x(x - 2)."
            ],
            piege: "On met en facteur le plus grand facteur commun (un nombre et/ou une lettre)."
          },
          {
            id: "m_lit_10",
            titre: "Programme de calcul",
            diff: "difficile",
            enonce: "Programme de calcul : choisir un nombre ; lui ajouter 5 ; multiplier la somme par 2 ; enlever le double du nombre de depart.",
            questions: [
              "Teste ce programme avec le nombre 4. Quel resultat obtient-on ?",
              "On note x le nombre choisi. Exprime le resultat en fonction de x, puis reduis-le.",
              "Que remarque-t-on ? Demontre-le."
            ],
            correction: [
              "4 -> 4 + 5 = 9 -> 9 x 2 = 18 -> 18 - 8 = 10. On obtient 10.",
              "Resultat = 2(x + 5) - 2x = 2x + 10 - 2x = 10.",
              "Le resultat est toujours 10, quel que soit le nombre choisi (l'expression se reduit a 10, sans x)."
            ],
            piege: "Developper et reduire prouve que le resultat ne depend pas du nombre choisi."
          },
          {
            id: "m_lit_11",
            titre: "Comparer deux programmes",
            diff: "moyen",
            enonce: "Programme A : choisir un nombre, le multiplier par 3, puis ajouter 4. Programme B : choisir un nombre, lui ajouter 1, puis multiplier par 3.",
            questions: [
              "Exprime le resultat du programme A en fonction de x.",
              "Exprime le resultat du programme B en fonction de x.",
              "Existe-t-il un nombre pour lequel les deux programmes donnent le meme resultat ?"
            ],
            correction: [
              "A = 3x + 4.",
              "B = 3(x + 1) = 3x + 3.",
              "3x + 4 = 3x + 3 donne 4 = 3, ce qui est impossible : les deux programmes ne donnent JAMAIS le meme resultat (A vaut toujours 1 de plus que B)."
            ],
            piege: "Si les x s'eliminent et qu'on obtient une egalite fausse, il n'y a aucune solution."
          },
          {
            id: "m_lit_12",
            titre: "Identite (a - b)^2",
            diff: "difficile",
            enonce: "Developpe l'expression (3x - 2)^2. On rappelle : (a - b)^2 = a^2 - 2ab + b^2.",
            questions: [
              "Identifie a et b dans cette expression.",
              "Developpe et reduis (3x - 2)^2."
            ],
            correction: [
              "a = 3x et b = 2.",
              "(3x)^2 - 2 x 3x x 2 + 2^2 = 9x^2 - 12x + 4."
            ],
            piege: "(3x)^2 = 9x^2 : on eleve aussi le 3 au carre, pas seulement le x."
          },
          {
            id: "m_lit_13",
            titre: "Factoriser puis resoudre",
            diff: "moyen",
            enonce: "On considere l'expression P = x^2 - 5x.",
            questions: [
              "Factorise P (facteur commun).",
              "Resous l'equation P = 0."
            ],
            correction: [
              "P = x(x - 5).",
              "x(x - 5) = 0 -> x = 0 ou x - 5 = 0 -> x = 0 ou x = 5."
            ],
            piege: "On factorise pour transformer en equation produit nul (deux solutions)."
          },
          {
            id: "m_lit_14",
            titre: "Vrai ou faux : calcul avec un negatif",
            diff: "moyen",
            enonce: "On considere l'expression A = x^2 + 3x. Affirmation : pour x = -2, A vaut -2.",
            questions: [
              "Cette affirmation est-elle vraie ou fausse ? Justifie par le calcul."
            ],
            correction: [
              "A = (-2)^2 + 3 x (-2) = 4 - 6 = -2. L'affirmation est VRAIE."
            ],
            piege: "(-2)^2 = +4 : le carre d'un nombre negatif est positif."
          }
        ]
      },

      /* ================= THEME 5 : EQUATIONS ================= */
      {
        id: "equations",
        titre: "Equations",
        exos: [
          {
            id: "m_eq_01",
            titre: "Une equation simple",
            diff: "facile",
            enonce: "Resous l'equation 2x + 3 = 11.",
            questions: [
              "Isole le terme contenant x.",
              "Trouve la valeur de x.",
              "Verifie ta solution."
            ],
            correction: [
              "2x = 11 - 3 = 8.",
              "x = 8 / 2 = 4.",
              "2 x 4 + 3 = 8 + 3 = 11 : la solution x = 4 convient."
            ],
            piege: "On effectue la meme operation des deux cotes du signe egal."
          },
          {
            id: "m_eq_02",
            titre: "Des x dans les deux membres",
            diff: "moyen",
            enonce: "Resous l'equation 5x - 7 = 2x + 8.",
            questions: [
              "Regroupe les termes en x d'un cote et les nombres de l'autre.",
              "Resous l'equation.",
              "Verifie ta solution."
            ],
            correction: [
              "5x - 2x = 8 + 7 -> 3x = 15.",
              "x = 15 / 3 = 5.",
              "5 x 5 - 7 = 18 et 2 x 5 + 8 = 18 : egalite verifiee."
            ],
            piege: "Quand un terme change de cote du signe egal, il change de signe."
          },
          {
            id: "m_eq_03",
            titre: "Mise en equation d'un probleme",
            diff: "difficile",
            enonce: "Un rectangle a une longueur de 3 cm de plus que sa largeur. Son perimetre est de 26 cm. On cherche ses dimensions.",
            questions: [
              "On note x la largeur. Exprime la longueur en fonction de x.",
              "Ecris l'equation qui traduit le perimetre.",
              "Resous l'equation et donne les dimensions du rectangle."
            ],
            correction: [
              "Longueur = x + 3.",
              "Perimetre = 2 x (longueur + largeur) = 2 x ((x + 3) + x) = 26.",
              "2(2x + 3) = 26 -> 4x + 6 = 26 -> 4x = 20 -> x = 5. Largeur 5 cm, longueur 8 cm."
            ],
            piege: "Perimetre d'un rectangle = 2 x (Longueur + largeur)."
          },
          {
            id: "m_eq_04",
            titre: "Le perimetre d'un triangle",
            diff: "moyen",
            enonce: "Un triangle a pour cotes x, x + 2 et x + 4 (en cm). Son perimetre vaut 18 cm (voir figure).",
            schema: `<svg width="100%" viewBox="0 0 260 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Triangle de cotes x, x+2 et x+4</title><desc>Triangle dont le perimetre vaut 18 cm.</desc><polygon points="130,40 45,165 215,165" fill="none" stroke="currentColor" stroke-width="2"/><text x="74" y="98" font-size="12" fill="currentColor" font-family="sans-serif">x</text><text x="158" y="98" font-size="12" fill="currentColor" font-family="sans-serif">x + 2</text><text x="112" y="182" font-size="12" fill="currentColor" font-family="sans-serif">x + 4</text></svg>`,
            questions: [
              "Ecris l'equation qui traduit le perimetre du triangle.",
              "Resous cette equation.",
              "Donne la longueur des trois cotes."
            ],
            correction: [
              "x + (x + 2) + (x + 4) = 18.",
              "3x + 6 = 18 -> 3x = 12 -> x = 4.",
              "Les cotes mesurent 4 cm, 6 cm et 8 cm."
            ],
            piege: "Le perimetre est la somme des cotes : on additionne toutes les expressions."
          },
          {
            id: "m_eq_05",
            titre: "Un probleme d'age",
            diff: "difficile",
            enonce: "Aujourd'hui, Marie a 12 ans et sa mere 38 ans. On cherche dans combien d'annees la mere aura le double de l'age de Marie.",
            questions: [
              "On note x le nombre d'annees a attendre. Exprime l'age de Marie et de sa mere dans x annees.",
              "Ecris l'equation : la mere a le double de l'age de Marie.",
              "Resous l'equation et reponds au probleme."
            ],
            correction: [
              "Dans x annees : Marie aura 12 + x ans, sa mere 38 + x ans.",
              "38 + x = 2 x (12 + x).",
              "38 + x = 24 + 2x -> 38 - 24 = 2x - x -> x = 14 : dans 14 ans (Marie 26 ans, mere 52 ans)."
            ],
            piege: "On traduit « le double » par une multiplication par 2 de TOUTE l'expression."
          },
          {
            id: "m_eq_06",
            titre: "Une equation produit",
            diff: "moyen",
            enonce: "Resous l'equation (x - 3)(x + 5) = 0.",
            questions: [
              "Quand un produit de deux facteurs est-il nul ?",
              "Ecris les deux equations simples a resoudre.",
              "Donne toutes les solutions."
            ],
            correction: [
              "Un produit est nul quand au moins un de ses facteurs est nul.",
              "x - 3 = 0 ou x + 5 = 0.",
              "x = 3 ou x = -5."
            ],
            piege: "Une equation produit nul donne en general DEUX solutions."
          },
          {
            id: "m_eq_07",
            titre: "Longueur double de la largeur",
            diff: "moyen",
            enonce: "Un rectangle a une longueur egale au double de sa largeur. Son perimetre vaut 30 cm (voir figure).",
            schema: `<svg width="100%" viewBox="0 0 250 150" role="img" xmlns="http://www.w3.org/2000/svg"><title>Rectangle de largeur x et longueur 2x</title><desc>Rectangle dont le perimetre vaut 30 cm.</desc><polygon points="45,40 205,40 205,110 45,110" fill="none" stroke="currentColor" stroke-width="2"/><text x="118" y="128" font-size="13" fill="currentColor" font-family="sans-serif">2x</text><text x="24" y="80" font-size="13" fill="currentColor" font-family="sans-serif">x</text></svg>`,
            questions: [
              "On note x la largeur. Exprime la longueur en fonction de x.",
              "Ecris l'equation traduisant le perimetre.",
              "Resous et donne les dimensions du rectangle."
            ],
            correction: [
              "Longueur = 2x.",
              "Perimetre = 2 x (longueur + largeur) = 2 x (2x + x) = 30.",
              "2 x 3x = 30 -> 6x = 30 -> x = 5. Largeur 5 cm, longueur 10 cm."
            ],
            piege: "Perimetre = 2 x (Longueur + largeur), avec ici Longueur = 2x."
          },
          {
            id: "m_eq_08",
            titre: "Le prix des places de cinema",
            diff: "difficile",
            enonce: "Au cinema, 3 places adultes et 2 places enfants coutent 38 euros. Une place enfant coute 4 euros. On cherche le prix d'une place adulte.",
            questions: [
              "On note x le prix d'une place adulte. Ecris l'equation traduisant la situation.",
              "Resous l'equation.",
              "Donne le prix d'une place adulte."
            ],
            correction: [
              "3x + 2 x 4 = 38, soit 3x + 8 = 38.",
              "3x = 38 - 8 = 30 -> x = 10.",
              "Une place adulte coute 10 euros."
            ],
            piege: "On traduit l'enonce mot a mot : 3 adultes (3x) + 2 enfants (2 x 4) = total."
          },
          {
            id: "m_eq_09",
            titre: "Equation avec parentheses",
            diff: "moyen",
            enonce: "Resous l'equation 4(x - 2) = 12.",
            questions: [
              "Developpe le membre de gauche.",
              "Resous l'equation.",
              "Verifie ta solution."
            ],
            correction: [
              "4(x - 2) = 4x - 8, donc 4x - 8 = 12.",
              "4x = 20 -> x = 5.",
              "4 x (5 - 2) = 4 x 3 = 12 : la solution convient."
            ],
            piege: "On developpe d'abord la parenthese (ou on divise les deux cotes par 4)."
          },
          {
            id: "m_eq_10",
            titre: "Probleme de billes",
            diff: "difficile",
            enonce: "Pierre a 3 fois plus de billes que Julie. Ensemble, ils possedent 48 billes. On cherche combien de billes a chacun.",
            questions: [
              "On note x le nombre de billes de Julie. Exprime le nombre de billes de Pierre.",
              "Ecris l'equation traduisant le total.",
              "Resous et donne le nombre de billes de chacun."
            ],
            correction: [
              "Pierre a 3x billes.",
              "x + 3x = 48.",
              "4x = 48 -> x = 12. Julie a 12 billes, Pierre en a 36."
            ],
            piege: "On choisit comme inconnue la plus petite quantite, c'est plus simple."
          },
          {
            id: "m_eq_11",
            titre: "Equation produit",
            diff: "moyen",
            enonce: "Resous l'equation (2x - 6)(x + 1) = 0.",
            questions: [
              "Ecris les deux equations simples a resoudre.",
              "Resous chacune et donne les solutions."
            ],
            correction: [
              "2x - 6 = 0 ou x + 1 = 0.",
              "2x = 6 -> x = 3 ; ou x = -1. Les solutions sont 3 et -1."
            ],
            piege: "2x - 6 = 0 donne x = 3 (on ajoute 6 puis on divise par 2)."
          },
          {
            id: "m_eq_12",
            titre: "Equation avec une fraction",
            diff: "moyen",
            enonce: "Resous l'equation x/3 + 2 = 5.",
            questions: [
              "Isole le terme x/3.",
              "Trouve la valeur de x."
            ],
            correction: [
              "x/3 = 5 - 2 = 3.",
              "x = 3 x 3 = 9."
            ],
            piege: "Pour supprimer le « divise par 3 », on multiplie les deux cotes par 3."
          },
          {
            id: "m_eq_13",
            titre: "Perimetre et aire",
            diff: "difficile",
            enonce: "Un rectangle a une longueur de (x + 4) cm et une largeur de x cm. Son perimetre vaut 28 cm.",
            questions: [
              "Ecris l'equation traduisant le perimetre.",
              "Resous l'equation.",
              "En deduire l'aire du rectangle."
            ],
            correction: [
              "2 x ((x + 4) + x) = 28.",
              "2(2x + 4) = 28 -> 4x + 8 = 28 -> 4x = 20 -> x = 5. Largeur 5 cm, longueur 9 cm.",
              "Aire = Longueur x largeur = 9 x 5 = 45 cm^2."
            ],
            piege: "Une fois x trouve, on n'oublie pas de calculer ce qui est demande (ici l'aire)."
          },
          {
            id: "m_eq_14",
            titre: "QCM equations",
            diff: "moyen",
            enonce: "QCM : une seule reponse correcte par question.",
            questions: [
              "La solution de 3x - 5 = 7 est : a) x = 4   b) x = 2   c) x = -4",
              "La solution de 5x = -20 est : a) x = 4   b) x = -4   c) x = -100"
            ],
            correction: [
              "3x = 12 -> x = 4. Reponse a).",
              "x = -20 / 5 = -4. Reponse b)."
            ],
            piege: "Attention aux signes : -20 / 5 = -4."
          }
        ]
      },

      /* ================= THEME 6 : FONCTIONS ================= */
      {
        id: "fonctions",
        titre: "Fonctions",
        exos: [
          {
            id: "m_fonc_01",
            titre: "Image et fonction affine",
            diff: "moyen",
            enonce: "Soit la fonction f definie par f(x) = 3x - 1.",
            questions: [
              "Calcule l'image de 2 par f, c'est-a-dire f(2).",
              "Calcule f(0). Que represente ce nombre sur le graphique ?",
              "Quel est le coefficient directeur de la droite representant f ?",
              "La fonction f est-elle lineaire ou affine ?"
            ],
            correction: [
              "f(2) = 3 x 2 - 1 = 5.",
              "f(0) = -1 ; c'est l'ordonnee a l'origine (la droite coupe l'axe des y en -1).",
              "Le coefficient directeur est 3.",
              "Affine : elle est de la forme ax + b avec b = -1 (different de 0)."
            ],
            piege: "Lineaire = ax (passe par l'origine) ; affine = ax + b."
          },
          {
            id: "m_fonc_02",
            titre: "Antecedent et sens de variation",
            diff: "difficile",
            enonce: "Soit la fonction g definie par g(x) = -2x + 6.",
            questions: [
              "Calcule g(4).",
              "Determine l'antecedent de 0 (resous g(x) = 0).",
              "La fonction g est-elle croissante ou decroissante ? Justifie."
            ],
            correction: [
              "g(4) = -2 x 4 + 6 = -8 + 6 = -2.",
              "g(x) = 0 -> -2x + 6 = 0 -> -2x = -6 -> x = 3.",
              "Decroissante : le coefficient directeur (-2) est negatif."
            ],
            piege: "Image : on donne x, on cherche g(x). Antecedent : on donne g(x), on cherche x."
          },
          {
            id: "m_fonc_03",
            titre: "Fonction lineaire et proportionnalite",
            diff: "moyen",
            enonce: "Une fonction lineaire h verifie h(4) = 10.",
            questions: [
              "Quelle est la forme generale d'une fonction lineaire ?",
              "Determine le coefficient a de la fonction h.",
              "Donne l'expression de h(x), puis calcule h(6)."
            ],
            correction: [
              "Une fonction lineaire s'ecrit h(x) = a x.",
              "h(4) = 4a = 10 -> a = 10 / 4 = 2,5.",
              "h(x) = 2,5x, donc h(6) = 2,5 x 6 = 15."
            ],
            piege: "Une fonction lineaire traduit une proportionnalite ; a est le coefficient."
          },
          {
            id: "m_fonc_04",
            titre: "Lire un graphique",
            diff: "moyen",
            enonce: "On a trace la droite representant une fonction affine f (voir graphique).",
            schema: `<svg width="100%" viewBox="0 0 260 205" role="img" xmlns="http://www.w3.org/2000/svg"><title>Droite d'une fonction affine</title><desc>Droite passant par les points (0 ; 1) et (5 ; 6).</desc><g stroke="currentColor" stroke-width="0.5" opacity="0.3"><line x1="76" y1="38" x2="76" y2="170"/><line x1="112" y1="38" x2="112" y2="170"/><line x1="148" y1="38" x2="148" y2="170"/><line x1="184" y1="38" x2="184" y2="170"/><line x1="220" y1="38" x2="220" y2="170"/><line x1="40" y1="148" x2="232" y2="148"/><line x1="40" y1="126" x2="232" y2="126"/><line x1="40" y1="104" x2="232" y2="104"/><line x1="40" y1="82" x2="232" y2="82"/><line x1="40" y1="60" x2="232" y2="60"/></g><line x1="40" y1="170" x2="240" y2="170" stroke="currentColor" stroke-width="1.5"/><line x1="40" y1="170" x2="40" y2="32" stroke="currentColor" stroke-width="1.5"/><line x1="40" y1="148" x2="220" y2="38" stroke="currentColor" stroke-width="2"/><circle cx="40" cy="148" r="3" fill="currentColor"/><circle cx="148" cy="82" r="3" fill="currentColor"/><text x="30" y="174" font-size="11" fill="currentColor" font-family="sans-serif">0</text><text x="73" y="184" font-size="11" fill="currentColor" font-family="sans-serif">1</text><text x="145" y="184" font-size="11" fill="currentColor" font-family="sans-serif">3</text><text x="217" y="184" font-size="11" fill="currentColor" font-family="sans-serif">5</text><text x="28" y="152" font-size="11" fill="currentColor" font-family="sans-serif">1</text><text x="28" y="86" font-size="11" fill="currentColor" font-family="sans-serif">4</text><text x="244" y="174" font-size="12" fill="currentColor" font-family="sans-serif">x</text><text x="32" y="30" font-size="12" fill="currentColor" font-family="sans-serif">y</text></svg>`,
            questions: [
              "Lis l'ordonnee a l'origine, c'est-a-dire f(0).",
              "Lis l'image de 3, c'est-a-dire f(3).",
              "Quel est l'antecedent de 4 ?",
              "Donne l'expression de f(x)."
            ],
            correction: [
              "f(0) = 1 (la droite coupe l'axe des y en 1).",
              "f(3) = 4.",
              "L'antecedent de 4 est 3 (car f(3) = 4).",
              "La droite a un coefficient directeur de 1 et une ordonnee a l'origine de 1 : f(x) = x + 1."
            ],
            piege: "Image : on part de l'axe des x. Antecedent : on part de l'axe des y."
          },
          {
            id: "m_fonc_05",
            titre: "Trouver une fonction affine",
            diff: "difficile",
            enonce: "Une fonction affine f verifie f(2) = 7 et f(5) = 16.",
            questions: [
              "Calcule le coefficient directeur a = (f(5) - f(2)) / (5 - 2).",
              "Determine l'ordonnee a l'origine b, sachant que f(x) = ax + b et f(2) = 7.",
              "Donne l'expression de f(x)."
            ],
            correction: [
              "a = (16 - 7) / (5 - 2) = 9 / 3 = 3.",
              "f(2) = 3 x 2 + b = 7 -> 6 + b = 7 -> b = 1.",
              "f(x) = 3x + 1."
            ],
            piege: "Coefficient directeur = (variation des images) / (variation des x)."
          },
          {
            id: "m_fonc_06",
            titre: "Le forfait telephone",
            diff: "moyen",
            enonce: "Un forfait fait payer 2 euros par gigaoctet (Go) consomme. On note x le nombre de Go consommes.",
            questions: [
              "Exprime le prix p(x) en fonction de x.",
              "Cette fonction est-elle lineaire ? Justifie.",
              "Combien coutent 8 Go ? Avec 30 euros, combien de Go peut-on consommer ?"
            ],
            correction: [
              "p(x) = 2x.",
              "Oui, elle est lineaire : de la forme ax (proportionnalite, passe par l'origine).",
              "8 Go : 2 x 8 = 16 euros. Avec 30 euros : 30 / 2 = 15 Go."
            ],
            piege: "Une situation de proportionnalite se modelise par une fonction lineaire (p(x) = ax)."
          },
          {
            id: "m_fonc_07",
            titre: "Lire une fonction lineaire",
            diff: "moyen",
            enonce: "La droite ci-dessous represente une fonction lineaire g (voir graphique).",
            schema: `<svg width="100%" viewBox="0 0 260 205" role="img" xmlns="http://www.w3.org/2000/svg"><title>Droite d'une fonction lineaire</title><desc>Droite passant par l'origine et par le point (2 ; 4).</desc><g stroke="currentColor" stroke-width="0.5" opacity="0.3"><line x1="76" y1="44" x2="76" y2="170"/><line x1="112" y1="44" x2="112" y2="170"/><line x1="148" y1="44" x2="148" y2="170"/><line x1="184" y1="44" x2="184" y2="170"/><line x1="220" y1="44" x2="220" y2="170"/><line x1="40" y1="152" x2="232" y2="152"/><line x1="40" y1="134" x2="232" y2="134"/><line x1="40" y1="116" x2="232" y2="116"/><line x1="40" y1="98" x2="232" y2="98"/><line x1="40" y1="80" x2="232" y2="80"/><line x1="40" y1="62" x2="232" y2="62"/></g><line x1="40" y1="170" x2="240" y2="170" stroke="currentColor" stroke-width="1.5"/><line x1="40" y1="170" x2="40" y2="38" stroke="currentColor" stroke-width="1.5"/><line x1="40" y1="170" x2="148" y2="62" stroke="currentColor" stroke-width="2"/><circle cx="40" cy="170" r="3" fill="currentColor"/><circle cx="112" cy="98" r="3" fill="currentColor"/><text x="30" y="182" font-size="11" fill="currentColor" font-family="sans-serif">0</text><text x="109" y="184" font-size="11" fill="currentColor" font-family="sans-serif">2</text><text x="28" y="102" font-size="11" fill="currentColor" font-family="sans-serif">4</text><text x="244" y="174" font-size="12" fill="currentColor" font-family="sans-serif">x</text><text x="32" y="36" font-size="12" fill="currentColor" font-family="sans-serif">y</text></svg>`,
            questions: [
              "La droite passe-t-elle par l'origine ? Que peut-on en deduire sur la fonction g ?",
              "Lis l'image de 2, c'est-a-dire g(2).",
              "Determine le coefficient a, puis l'expression de g(x)."
            ],
            correction: [
              "Oui, elle passe par l'origine : g est une fonction lineaire (g(x) = a x).",
              "g(2) = 4.",
              "a = g(2) / 2 = 4 / 2 = 2, donc g(x) = 2x."
            ],
            piege: "Une droite qui passe par l'origine represente une fonction lineaire (proportionnalite)."
          },
          {
            id: "m_fonc_08",
            titre: "Etude d'une fonction affine",
            diff: "difficile",
            enonce: "Soit la fonction f definie par f(x) = -3x + 12.",
            questions: [
              "Calcule f(0) et f(4).",
              "Resous l'equation f(x) = 0.",
              "La fonction est-elle croissante ou decroissante ? Justifie."
            ],
            correction: [
              "f(0) = 12 ; f(4) = -3 x 4 + 12 = -12 + 12 = 0.",
              "-3x + 12 = 0 -> -3x = -12 -> x = 4.",
              "Decroissante : le coefficient directeur (-3) est negatif."
            ],
            piege: "Le signe du coefficient directeur donne le sens de variation (negatif -> decroissante)."
          },
          {
            id: "m_fonc_09",
            titre: "Le prix d'une course en taxi",
            diff: "moyen",
            enonce: "Un taxi facture 5 euros de prise en charge, puis 2 euros par kilometre. On note x le nombre de kilometres parcourus.",
            questions: [
              "Exprime le prix p(x) en fonction de x.",
              "Cette fonction est-elle lineaire ou affine ?",
              "Combien coute une course de 8 km ? Avec 25 euros, combien de km peut-on parcourir ?"
            ],
            correction: [
              "p(x) = 2x + 5.",
              "Affine : de la forme ax + b avec b = 5 (different de 0).",
              "8 km : 2 x 8 + 5 = 21 euros. Avec 25 euros : 2x + 5 = 25 -> 2x = 20 -> x = 10 km."
            ],
            piege: "Un montant fixe + un prix par unite donne une fonction affine (ax + b)."
          },
          {
            id: "m_fonc_10",
            titre: "Image, antecedent, equation",
            diff: "difficile",
            enonce: "On considere la fonction f definie par f(x) = 2x - 3.",
            questions: [
              "Calcule l'image de -1.",
              "Determine l'antecedent de 7.",
              "Resous l'equation f(x) = 0."
            ],
            correction: [
              "f(-1) = 2 x (-1) - 3 = -5.",
              "f(x) = 7 -> 2x - 3 = 7 -> 2x = 10 -> x = 5.",
              "2x - 3 = 0 -> 2x = 3 -> x = 1,5."
            ],
            piege: "Chercher un antecedent revient a resoudre une equation."
          },
          {
            id: "m_fonc_11",
            titre: "QCM fonctions",
            diff: "moyen",
            enonce: "QCM. Soit la fonction g definie par g(x) = -2x + 5.",
            questions: [
              "g(3) vaut : a) 11   b) -1   c) 1",
              "La fonction g est : a) croissante   b) decroissante   c) constante"
            ],
            correction: [
              "g(3) = -2 x 3 + 5 = -6 + 5 = -1. Reponse b).",
              "Le coefficient directeur -2 est negatif : g est decroissante. Reponse b)."
            ],
            piege: "Le signe du coefficient directeur donne le sens de variation."
          },
          {
            id: "m_fonc_12",
            titre: "Determiner une fonction affine",
            diff: "difficile",
            enonce: "Une fonction affine f verifie f(0) = 4 et f(3) = 10.",
            questions: [
              "Determine l'ordonnee a l'origine b.",
              "Determine le coefficient directeur a.",
              "Donne l'expression de f(x)."
            ],
            correction: [
              "f(0) = b, donc b = 4.",
              "a = (f(3) - f(0)) / (3 - 0) = (10 - 4) / 3 = 6 / 3 = 2.",
              "f(x) = 2x + 4."
            ],
            piege: "f(0) donne directement l'ordonnee a l'origine b."
          },
          {
            id: "m_fonc_13",
            titre: "Comparer deux forfaits",
            diff: "moyen",
            enonce: "Forfait A : 10 euros par mois en appels illimites. Forfait B : 0,50 euro par appel. On note x le nombre d'appels dans le mois.",
            questions: [
              "Exprime le prix du forfait A et du forfait B en fonction de x.",
              "A partir de combien d'appels le forfait A devient-il plus avantageux ?"
            ],
            correction: [
              "A(x) = 10 (constant) ; B(x) = 0,5x.",
              "A devient avantageux quand 0,5x > 10, soit x > 20 : a partir de 21 appels (a 20 appels, les deux coutent 10 euros)."
            ],
            piege: "On compare les deux expressions a l'aide d'une inequation."
          },
          {
            id: "m_fonc_14",
            titre: "Vrai ou faux : fonction lineaire",
            diff: "moyen",
            enonce: "On considere la fonction f definie par f(x) = 5x. Affirmation : f est lineaire et f(0) = 0.",
            questions: [
              "Cette affirmation est-elle vraie ou fausse ? Justifie."
            ],
            correction: [
              "f(x) = 5x est de la forme ax : c'est une fonction lineaire. Et f(0) = 5 x 0 = 0. L'affirmation est VRAIE (une fonction lineaire passe toujours par l'origine)."
            ],
            piege: "Une fonction lineaire verifie toujours f(0) = 0."
          }
        ]
      },

      /* ============ THEME 7 : PROPORTIONNALITE ET POURCENTAGES ============ */
      {
        id: "proportionnalite",
        titre: "Proportionnalite et pourcentages",
        exos: [
          {
            id: "m_prop_01",
            titre: "Une augmentation de prix",
            diff: "facile",
            enonce: "Un article coute 40 euros. Il subit une augmentation de 15 %.",
            questions: [
              "Calcule le montant de l'augmentation en euros.",
              "Quel est le nouveau prix ?",
              "Par quel coefficient multiplicateur passe-t-on directement au nouveau prix ?"
            ],
            correction: [
              "40 x 15 / 100 = 6 euros.",
              "40 + 6 = 46 euros.",
              "x 1,15 (augmenter de 15 % revient a multiplier par 1 + 0,15)."
            ],
            piege: "Augmenter de 15 % revient a multiplier par 1,15."
          },
          {
            id: "m_prop_02",
            titre: "Un prix solde",
            diff: "moyen",
            enonce: "Un jean coute 60 euros. Il est solde avec une reduction de 30 %.",
            questions: [
              "Calcule le montant de la reduction en euros.",
              "Calcule le prix solde.",
              "Quel coefficient multiplicateur correspond a une baisse de 30 % ?"
            ],
            correction: [
              "60 x 30 / 100 = 18 euros.",
              "60 - 18 = 42 euros.",
              "x 0,70 (baisser de 30 % revient a multiplier par 1 - 0,30)."
            ],
            piege: "Baisser de 30 % revient a multiplier par 0,70."
          },
          {
            id: "m_prop_03",
            titre: "Consommation de carburant",
            diff: "difficile",
            enonce: "Une voiture consomme 6 L de carburant pour 100 km. On suppose la consommation proportionnelle a la distance.",
            questions: [
              "Combien consomme-t-elle pour 250 km ?",
              "Avec 30 L de carburant, quelle distance peut-elle parcourir ?",
              "Quel est le coefficient de proportionnalite (en L par km) ?"
            ],
            correction: [
              "6 x 250 / 100 = 15 L.",
              "30 / 6 x 100 = 500 km.",
              "6 / 100 = 0,06 L par km."
            ],
            piege: "Tableau de proportionnalite : on multiplie (ou divise) par le meme coefficient."
          },
          {
            id: "m_prop_04",
            titre: "Le prix des pommes",
            diff: "moyen",
            enonce: "Le tableau ci-dessous donne le prix a payer selon la masse de pommes achetees.",
            table: [
              ["Masse (kg)", "2", "3", "5"],
              ["Prix (euros)", "5", "7,5", "?"]
            ],
            questions: [
              "Verifie qu'il s'agit d'une situation de proportionnalite (calcule le prix au kg).",
              "Calcule le prix pour 5 kg.",
              "Quelle masse de pommes peut-on acheter avec 20 euros ?"
            ],
            correction: [
              "5 / 2 = 2,5 et 7,5 / 3 = 2,5 : meme coefficient -> proportionnalite (2,5 euros par kg).",
              "5 x 2,5 = 12,5 euros.",
              "20 / 2,5 = 8 kg."
            ],
            piege: "Proportionnalite : le rapport prix / masse est constant (c'est le prix au kg)."
          },
          {
            id: "m_prop_05",
            titre: "Hausse puis baisse",
            diff: "difficile",
            enonce: "Un article coute 50 euros. Son prix augmente d'abord de 20 %, puis le nouveau prix baisse de 20 %.",
            questions: [
              "Calcule le prix apres l'augmentation de 20 %.",
              "Calcule le prix apres la baisse de 20 %.",
              "Le prix final est-il egal au prix de depart ? Explique."
            ],
            correction: [
              "50 x 1,2 = 60 euros.",
              "60 x 0,8 = 48 euros.",
              "Non : 48 euros, ce n'est pas 50. Une hausse puis une baisse de 20 % ne se compensent pas (les pourcentages portent sur des valeurs differentes)."
            ],
            piege: "+20 % puis -20 % ne ramene PAS au depart (x 1,2 x 0,8 = 0,96, soit -4 %)."
          },
          {
            id: "m_prop_06",
            titre: "Le debit d'un robinet",
            diff: "moyen",
            enonce: "Un robinet remplit un recipient a debit constant : 12 litres en 4 minutes.",
            questions: [
              "Quel est le debit du robinet, en litres par minute ?",
              "Quelle quantite d'eau coule en 10 minutes ?",
              "Combien de temps faut-il pour remplir une cuve de 60 litres ?"
            ],
            correction: [
              "12 / 4 = 3 litres par minute.",
              "3 x 10 = 30 litres.",
              "60 / 3 = 20 minutes."
            ],
            piege: "A debit constant, le volume est proportionnel au temps."
          },
          {
            id: "m_prop_07",
            titre: "L'echelle d'une carte",
            diff: "difficile",
            enonce: "Sur une carte a l'echelle 1/200000, deux villes sont separees de 6 cm.",
            questions: [
              "Que signifie l'echelle 1/200000 ?",
              "Calcule la distance reelle entre les deux villes, en cm.",
              "Convertis cette distance en km (on rappelle : 1 km = 100000 cm)."
            ],
            correction: [
              "1 cm sur la carte represente 200000 cm dans la realite.",
              "6 x 200000 = 1 200 000 cm.",
              "1 200 000 / 100000 = 12 km."
            ],
            piege: "Echelle = distance sur la carte / distance reelle ; et 1 km = 100 000 cm."
          },
          {
            id: "m_prop_08",
            titre: "Retrouver le prix initial",
            diff: "difficile",
            enonce: "Apres une reduction de 25 %, un article coute 45 euros. On cherche son prix initial.",
            questions: [
              "Quel coefficient multiplicateur correspond a une baisse de 25 % ?",
              "Sachant que prix solde = prix initial x 0,75, retrouve le prix initial."
            ],
            correction: [
              "Une baisse de 25 % correspond a x 0,75 (1 - 0,25).",
              "prix initial = 45 / 0,75 = 60 euros."
            ],
            piege: "Pour retrouver le prix de depart, on DIVISE par le coefficient multiplicateur."
          },
          {
            id: "m_prop_09",
            titre: "Adapter une recette",
            diff: "moyen",
            enonce: "Une recette prevue pour 4 personnes demande 200 g de farine.",
            questions: [
              "La quantite de farine est-elle proportionnelle au nombre de personnes ?",
              "Quelle quantite de farine faut-il pour 6 personnes ?",
              "Et pour 10 personnes ?"
            ],
            correction: [
              "Oui, on la suppose proportionnelle au nombre de personnes.",
              "Pour 1 personne : 200 / 4 = 50 g. Pour 6 personnes : 50 x 6 = 300 g.",
              "Pour 10 personnes : 50 x 10 = 500 g."
            ],
            piege: "On calcule la quantite pour 1 personne (le coefficient), puis on multiplie."
          },
          {
            id: "m_prop_10",
            titre: "Vitesse moyenne",
            diff: "moyen",
            enonce: "Une voiture parcourt 150 km en 2 heures, a vitesse constante.",
            questions: [
              "Calcule sa vitesse moyenne.",
              "Quelle distance parcourt-elle en 3 h 30 ?",
              "Combien de temps lui faut-il pour parcourir 300 km ?"
            ],
            correction: [
              "v = distance / temps = 150 / 2 = 75 km/h.",
              "3 h 30 = 3,5 h ; distance = 75 x 3,5 = 262,5 km.",
              "temps = 300 / 75 = 4 h."
            ],
            piege: "vitesse = distance / temps ; distance = vitesse x temps ; temps = distance / vitesse."
          },
          {
            id: "m_prop_11",
            titre: "QCM pourcentage",
            diff: "moyen",
            enonce: "QCM. Un prix de 80 euros augmente de 5 %.",
            questions: [
              "Le nouveau prix est : a) 85 euros   b) 84 euros   c) 80,05 euros",
              "Le coefficient multiplicateur correspondant est : a) 1,5   b) 1,05   c) 0,05"
            ],
            correction: [
              "80 x 1,05 = 84 euros. Reponse b).",
              "Augmenter de 5 % revient a multiplier par 1,05. Reponse b)."
            ],
            piege: "Augmenter de 5 % donne x 1,05 (et surtout pas x 1,5)."
          },
          {
            id: "m_prop_12",
            titre: "Le prix des stylos",
            diff: "moyen",
            enonce: "Dans une situation de proportionnalite, 7 stylos identiques coutent 8,40 euros.",
            questions: [
              "Combien coute 1 stylo ?",
              "Combien coutent 12 stylos ?",
              "Combien de stylos peut-on acheter avec 18 euros ?"
            ],
            correction: [
              "8,40 / 7 = 1,20 euro.",
              "12 x 1,20 = 14,40 euros.",
              "18 / 1,20 = 15 stylos."
            ],
            piege: "On passe par le prix d'un seul stylo (le coefficient de proportionnalite)."
          },
          {
            id: "m_prop_13",
            titre: "Vrai ou faux : hausse et baisse",
            diff: "difficile",
            enonce: "Un article augmente de 10 %, puis son nouveau prix baisse de 10 %. Affirmation : on revient au prix de depart.",
            questions: [
              "Cette affirmation est-elle vraie ou fausse ? Justifie avec un prix de depart de 100 euros."
            ],
            correction: [
              "100 x 1,1 = 110 euros, puis 110 x 0,9 = 99 euros. 99 n'est pas 100 : l'affirmation est FAUSSE (au total x 1,1 x 0,9 = 0,99, soit une baisse de 1 %)."
            ],
            piege: "+10 % puis -10 % ne se compensent pas : on perd 1 % (x 0,99)."
          },
          {
            id: "m_prop_14",
            titre: "L'echelle d'une maquette",
            diff: "moyen",
            enonce: "Une maquette de voiture est a l'echelle 1/43. La maquette mesure 10 cm de long.",
            questions: [
              "Que signifie l'echelle 1/43 ?",
              "Calcule la longueur reelle de la voiture, en cm puis en m."
            ],
            correction: [
              "1 cm sur la maquette represente 43 cm en realite.",
              "10 x 43 = 430 cm = 4,30 m."
            ],
            piege: "Longueur reelle = longueur de la maquette x 43 (l'objet reel est plus grand)."
          }
        ]
      },

      /* ================= THEME 8 : STATISTIQUES ================= */
      {
        id: "statistiques",
        titre: "Statistiques",
        exos: [
          {
            id: "m_stat_01",
            titre: "Moyenne et mode",
            diff: "moyen",
            enonce: "On a releve les notes d'un groupe d'eleves dans le tableau ci-dessous.",
            table: [
              ["Note", "8", "10", "12", "14"],
              ["Effectif", "2", "5", "2", "1"]
            ],
            questions: [
              "Combien d'eleves y a-t-il dans le groupe ?",
              "Calcule la note moyenne du groupe.",
              "Quelle est la note la plus frequente (le mode) ?"
            ],
            correction: [
              "2 + 5 + 2 + 1 = 10 eleves.",
              "Moyenne = (8x2 + 10x5 + 12x2 + 14x1) / 10 = (16 + 50 + 24 + 14) / 10 = 104 / 10 = 10,4.",
              "La note 10, qui a le plus grand effectif (5)."
            ],
            piege: "Moyenne ponderee = somme(note x effectif) / effectif total."
          },
          {
            id: "m_stat_02",
            titre: "Mediane et etendue",
            diff: "moyen",
            enonce: "On a range 7 tailles d'eleves (en cm) dans l'ordre croissant : 150, 152, 155, 158, 160, 162, 170.",
            questions: [
              "Combien y a-t-il de valeurs dans cette serie ?",
              "Determine la mediane de la serie.",
              "Que signifie concretement cette mediane ?",
              "Calcule l'etendue de la serie."
            ],
            correction: [
              "7 valeurs.",
              "La mediane est la 4e valeur (le milieu) : 158 cm.",
              "La moitie des eleves mesurent moins de 158 cm, l'autre moitie plus.",
              "Etendue = 170 - 150 = 20 cm."
            ],
            piege: "Pour un nombre IMPAIR de valeurs rangees, la mediane est la valeur du milieu."
          },
          {
            id: "m_stat_03",
            titre: "Etude complete d'une serie",
            diff: "difficile",
            enonce: "Voici les temps (en minutes) mis par 8 eleves pour un exercice : 10, 12, 12, 15, 18, 20, 20, 13.",
            questions: [
              "Calcule le temps moyen.",
              "Range les valeurs dans l'ordre croissant, puis determine la mediane.",
              "Calcule l'etendue de la serie."
            ],
            correction: [
              "Somme = 10+12+12+15+18+20+20+13 = 120 ; moyenne = 120 / 8 = 15 min.",
              "Ordre : 10, 12, 12, 13, 15, 18, 20, 20. Mediane = (13 + 15) / 2 = 14 min.",
              "Etendue = 20 - 10 = 10 min."
            ],
            piege: "Pour un nombre PAIR de valeurs, la mediane est la moyenne des deux valeurs centrales."
          },
          {
            id: "m_stat_04",
            titre: "Lire un diagramme en batons",
            diff: "moyen",
            enonce: "Le diagramme en batons ci-dessous donne le nombre d'eleves selon leur moyen de transport pour venir au college.",
            schema: `<svg width="100%" viewBox="0 0 260 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Diagramme en batons des moyens de transport</title><desc>Bus 8, Velo 5, Voiture 4, A pied 3 eleves.</desc><line x1="40" y1="165" x2="245" y2="165" stroke="currentColor" stroke-width="1.5"/><line x1="40" y1="30" x2="40" y2="165" stroke="currentColor" stroke-width="1.5"/><g stroke="currentColor" stroke-width="0.5" opacity="0.4"><line x1="40" y1="133" x2="245" y2="133"/><line x1="40" y1="101" x2="245" y2="101"/><line x1="40" y1="69" x2="245" y2="69"/><line x1="40" y1="37" x2="245" y2="37"/></g><text x="30" y="169" font-size="10" fill="currentColor" font-family="sans-serif">0</text><text x="28" y="137" font-size="10" fill="currentColor" font-family="sans-serif">2</text><text x="28" y="105" font-size="10" fill="currentColor" font-family="sans-serif">4</text><text x="28" y="73" font-size="10" fill="currentColor" font-family="sans-serif">6</text><text x="28" y="41" font-size="10" fill="currentColor" font-family="sans-serif">8</text><rect x="55" y="37" width="30" height="128" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5"/><rect x="103" y="85" width="30" height="80" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5"/><rect x="151" y="101" width="30" height="64" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5"/><rect x="199" y="117" width="30" height="48" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5"/><text x="59" y="182" font-size="10" fill="currentColor" font-family="sans-serif">Bus</text><text x="106" y="182" font-size="10" fill="currentColor" font-family="sans-serif">Velo</text><text x="151" y="182" font-size="10" fill="currentColor" font-family="sans-serif">Voit.</text><text x="201" y="182" font-size="10" fill="currentColor" font-family="sans-serif">Pied</text></svg>`,
            questions: [
              "Combien d'eleves ont ete interroges au total ?",
              "Quel est le moyen de transport le plus utilise ?",
              "Quelle fraction des eleves vient a pied ?"
            ],
            correction: [
              "8 + 5 + 4 + 3 = 20 eleves.",
              "Le bus (8 eleves, le baton le plus haut).",
              "3 eleves sur 20, soit la fraction 3/20."
            ],
            piege: "On lit la hauteur de chaque baton sur l'axe vertical (les effectifs)."
          },
          {
            id: "m_stat_05",
            titre: "Moyenne et pourcentage",
            diff: "difficile",
            enonce: "Dans une classe de 25 eleves, 10 ont eu 12, 8 ont eu 14 et 7 ont eu 16 a un controle.",
            questions: [
              "Calcule la moyenne de la classe (arrondie au centieme).",
              "Quel pourcentage des eleves a obtenu 16 ?"
            ],
            correction: [
              "Moyenne = (10x12 + 8x14 + 7x16) / 25 = (120 + 112 + 112) / 25 = 344 / 25 = 13,76.",
              "7 / 25 = 0,28 = 28 %."
            ],
            piege: "Moyenne ponderee = somme(note x effectif) / total ; pourcentage = effectif / total x 100."
          },
          {
            id: "m_stat_06",
            titre: "Frequence d'un sondage",
            diff: "moyen",
            enonce: "Sur 200 personnes interrogees, 50 declarent preferer le the au cafe.",
            questions: [
              "Quelle est la frequence des personnes preferant le the (sous forme de fraction) ?",
              "Exprime cette frequence en pourcentage.",
              "Sur 1000 personnes, combien preferent le the (en supposant la meme proportion) ?"
            ],
            correction: [
              "50 / 200 = 1/4.",
              "1/4 = 25 %.",
              "25 % de 1000 = 250 personnes."
            ],
            piege: "Frequence = effectif / effectif total (un nombre entre 0 et 1, ou un pourcentage)."
          },
          {
            id: "m_stat_07",
            titre: "Lire un diagramme circulaire",
            diff: "moyen",
            enonce: "Le diagramme circulaire ci-dessous donne le sport prefere de 180 eleves. Le secteur du foot a un angle de 120 degres (voir figure).",
            schema: `<svg width="100%" viewBox="0 0 240 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Diagramme circulaire des sports preferes</title><desc>Secteur Foot de 120 degres sur un total de 360 degres.</desc><circle cx="115" cy="100" r="70" fill="none" stroke="currentColor" stroke-width="2"/><path d="M115,100 L185,100 A70,70 0 0,0 80,160.6 Z" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="2"/><text x="150" y="118" font-size="12" fill="currentColor" font-family="sans-serif">Foot</text><text x="143" y="134" font-size="11" fill="currentColor" font-family="sans-serif">120</text><text x="70" y="70" font-size="11" fill="currentColor" font-family="sans-serif">Autres</text></svg>`,
            questions: [
              "Quelle fraction du disque le secteur du foot represente-t-il ?",
              "Combien d'eleves preferent le foot ?",
              "Quel angle correspondrait a 45 eleves ?"
            ],
            correction: [
              "120 / 360 = 1/3 du disque.",
              "1/3 de 180 = 60 eleves preferent le foot.",
              "45 eleves sur 180 = 1/4 du total -> 1/4 de 360 = 90 degres."
            ],
            piege: "Dans un diagramme circulaire : angle / 360 = effectif / effectif total."
          },
          {
            id: "m_stat_08",
            titre: "Moyenne avec coefficients",
            diff: "difficile",
            enonce: "Un eleve a trois notes affectees de coefficients : 12 (coefficient 1), 8 (coefficient 2) et 15 (coefficient 3).",
            questions: [
              "Calcule la somme des coefficients.",
              "Calcule la moyenne ponderee (arrondie au dixieme)."
            ],
            correction: [
              "1 + 2 + 3 = 6.",
              "Moyenne = (12x1 + 8x2 + 15x3) / 6 = (12 + 16 + 45) / 6 = 73 / 6 = 12,2 environ."
            ],
            piege: "Moyenne avec coefficients = somme(note x coef) / somme des coefficients."
          },
          {
            id: "m_stat_09",
            titre: "Comparer deux series",
            diff: "moyen",
            enonce: "Voici deux series de notes. Serie A : 8, 10, 12. Serie B : 4, 10, 16.",
            questions: [
              "Verifie que les deux series ont la meme moyenne.",
              "Calcule l'etendue de chaque serie.",
              "Quelle serie est la plus reguliere (notes les plus groupees) ?"
            ],
            correction: [
              "Serie A : (8 + 10 + 12) / 3 = 30 / 3 = 10. Serie B : (4 + 10 + 16) / 3 = 30 / 3 = 10.",
              "Etendue A = 12 - 8 = 4 ; etendue B = 16 - 4 = 12.",
              "La serie A : son etendue est plus petite, donc ses notes sont plus groupees."
            ],
            piege: "Deux series peuvent avoir la meme moyenne mais des etendues (dispersions) tres differentes."
          },
          {
            id: "m_stat_10",
            titre: "Tableur",
            diff: "difficile",
            enonce: "On a saisi des notes et leurs effectifs dans un tableur (voir tableau). La ligne 2 contient les notes, la ligne 3 les effectifs.",
            table: [
              ["", "A", "B", "C", "D"],
              ["2", "Note", "8", "12", "16"],
              ["3", "Effectif", "5", "8", "3"]
            ],
            questions: [
              "Combien d'eleves ont ete notes au total ?",
              "Quelle formule, saisie dans une cellule, calcule l'effectif total a partir de B3, C3 et D3 ?",
              "Calcule la note moyenne de ces eleves."
            ],
            correction: [
              "5 + 8 + 3 = 16 eleves.",
              "=SOMME(B3:D3).",
              "Moyenne = (8x5 + 12x8 + 16x3) / 16 = (40 + 96 + 48) / 16 = 184 / 16 = 11,5."
            ],
            piege: "Dans un tableur, une formule commence par « = » ; SOMME(B3:D3) additionne les cellules de B3 a D3."
          },
          {
            id: "m_stat_11",
            titre: "Mediane et etendue",
            diff: "moyen",
            enonce: "Les notes de 9 eleves, rangees dans l'ordre croissant, sont : 6, 8, 8, 10, 11, 12, 14, 15, 18.",
            questions: [
              "Combien y a-t-il de valeurs ?",
              "Determine la mediane.",
              "Calcule l'etendue de la serie."
            ],
            correction: [
              "9 valeurs.",
              "La mediane est la 5e valeur (le milieu) : 11.",
              "Etendue = 18 - 6 = 12."
            ],
            piege: "9 valeurs (nombre impair) : la mediane est la 5e, soit la valeur du milieu."
          },
          {
            id: "m_stat_12",
            titre: "QCM statistiques",
            diff: "moyen",
            enonce: "QCM. On considere la serie de valeurs : 4, 6, 6, 8, 10.",
            questions: [
              "La moyenne de la serie vaut : a) 6,8   b) 6   c) 34",
              "Le mode de la serie est : a) 6   b) 8   c) 10"
            ],
            correction: [
              "Moyenne = (4 + 6 + 6 + 8 + 10) / 5 = 34 / 5 = 6,8. Reponse a).",
              "Le mode est 6 (il apparait deux fois). Reponse a)."
            ],
            piege: "Moyenne = somme / effectif ; mode = la valeur la plus frequente."
          },
          {
            id: "m_stat_13",
            titre: "Pourcentages d'un effectif",
            diff: "difficile",
            enonce: "Dans un college de 500 eleves, 60 % sont demi-pensionnaires.",
            questions: [
              "Combien d'eleves sont demi-pensionnaires ?",
              "Combien ne le sont pas ?",
              "Parmi les demi-pensionnaires, 25 % font de l'allemand. Combien d'eleves cela represente-t-il ?"
            ],
            correction: [
              "60 % de 500 = 0,60 x 500 = 300 eleves.",
              "500 - 300 = 200 eleves.",
              "25 % de 300 = 0,25 x 300 = 75 eleves."
            ],
            piege: "Un pourcentage d'un pourcentage : on applique les deux l'un apres l'autre."
          },
          {
            id: "m_stat_14",
            titre: "Frequence et probabilite",
            diff: "moyen",
            enonce: "On lance un de 50 fois. On a obtenu le 1 huit fois.",
            questions: [
              "Quelle est la frequence d'apparition du 1 ?",
              "Exprime-la en pourcentage.",
              "Est-elle proche de la probabilite theorique 1/6 ?"
            ],
            correction: [
              "8 / 50 = 0,16.",
              "0,16 = 16 %.",
              "1/6 = 0,167 environ (17 %) : 16 % en est tres proche, le de semble equilibre."
            ],
            piege: "La frequence observee se rapproche de la probabilite theorique quand il y a beaucoup de lancers."
          }
        ]
      },

      /* ================= THEME 9 : PROBABILITES ================= */
      {
        id: "probabilites",
        titre: "Probabilites",
        exos: [
          {
            id: "m_prob_01",
            titre: "Lancer d'un de",
            diff: "facile",
            enonce: "On lance un de equilibre a 6 faces, numerotees de 1 a 6.",
            questions: [
              "Combien d'issues possibles ce lancer a-t-il ?",
              "Quelle est la probabilite d'obtenir un 4 ?",
              "Quelle est la probabilite d'obtenir un nombre pair ?"
            ],
            correction: [
              "6 issues possibles (les faces 1 a 6).",
              "1 cas favorable sur 6 : P = 1/6.",
              "Les faces paires sont 2, 4, 6 -> 3 cas sur 6 : P = 3/6 = 1/2."
            ],
            piege: "Probabilite = nombre de cas favorables / nombre de cas possibles."
          },
          {
            id: "m_prob_02",
            titre: "Tirage dans une urne",
            diff: "moyen",
            enonce: "Une urne contient 5 boules rouges, 3 boules bleues et 2 boules vertes, indiscernables au toucher. On tire une boule au hasard.",
            questions: [
              "Combien de boules y a-t-il au total ?",
              "Quelle est la probabilite de tirer une boule rouge ?",
              "Quelle est la probabilite de tirer une boule qui n'est PAS verte ?"
            ],
            correction: [
              "5 + 3 + 2 = 10 boules.",
              "P(rouge) = 5/10 = 1/2.",
              "Non verte = rouge ou bleue = 8/10 = 4/5 (ou 1 - 2/10)."
            ],
            piege: "P(evenement contraire) = 1 - P(evenement)."
          },
          {
            id: "m_prob_03",
            titre: "La roue numerotee",
            diff: "difficile",
            enonce: "Une roue est partagee en 8 secteurs identiques, numerotes de 1 a 8. On la fait tourner.",
            questions: [
              "Quelle est la probabilite d'obtenir un multiple de 3 ?",
              "Quelle est la probabilite d'obtenir un nombre strictement superieur a 5 ?",
              "Quelle est la probabilite d'obtenir le nombre 9 ?"
            ],
            correction: [
              "Multiples de 3 entre 1 et 8 : 3 et 6 -> 2 cas sur 8 : P = 2/8 = 1/4.",
              "Nombres superieurs a 5 : 6, 7, 8 -> 3 cas sur 8 : P = 3/8.",
              "Le 9 n'existe pas sur la roue : evenement impossible, P = 0."
            ],
            piege: "Un evenement impossible a une probabilite de 0 ; un evenement certain, de 1."
          },
          {
            id: "m_prob_04",
            titre: "Tirer une carte",
            diff: "moyen",
            enonce: "On tire une carte au hasard dans un jeu de 32 cartes (4 couleurs : coeur, carreau, trefle, pique ; 8 cartes par couleur, dont 1 roi).",
            questions: [
              "Quelle est la probabilite de tirer un coeur ?",
              "Quelle est la probabilite de tirer un roi (il y a 4 rois) ?",
              "Quelle est la probabilite de tirer une carte rouge (coeur ou carreau) ?"
            ],
            correction: [
              "8 coeurs sur 32 : P = 8/32 = 1/4.",
              "4 rois sur 32 : P = 4/32 = 1/8.",
              "16 cartes rouges sur 32 : P = 16/32 = 1/2."
            ],
            piege: "Probabilite = nombre de cas favorables / 32 (le nombre total de cartes)."
          },
          {
            id: "m_prob_05",
            titre: "Lancer une piece deux fois",
            diff: "difficile",
            enonce: "On lance une piece de monnaie deux fois de suite. On note P pour pile et F pour face.",
            questions: [
              "Liste toutes les issues possibles.",
              "Combien y a-t-il d'issues au total ?",
              "Quelle est la probabilite d'obtenir deux fois pile (PP) ?",
              "Quelle est la probabilite d'obtenir exactement une fois pile ?"
            ],
            correction: [
              "Les issues sont : PP, PF, FP, FF.",
              "4 issues au total.",
              "1 cas favorable (PP) sur 4 : P = 1/4.",
              "Exactement un pile : PF et FP -> 2 cas sur 4 = 1/2."
            ],
            piege: "On liste toutes les issues (un arbre aide) : PF et FP sont deux issues differentes."
          },
          {
            id: "m_prob_06",
            titre: "Le de est-il truque ?",
            diff: "moyen",
            enonce: "On lance un de 200 fois. Le 6 est sorti 50 fois.",
            questions: [
              "Quelle est la frequence d'apparition du 6 ?",
              "Exprime-la en pourcentage.",
              "Pour un de equilibre, quelle serait la probabilite theorique du 6 ? Le de semble-t-il truque ?"
            ],
            correction: [
              "50 / 200 = 1/4 = 0,25.",
              "0,25 = 25 %.",
              "Pour un de equilibre : 1/6 = 0,167 environ (17 %). Or 25 % est nettement plus eleve : le de semble truque (le 6 sort trop souvent)."
            ],
            piege: "La frequence observee est proche de la probabilite theorique seulement si le de est equilibre."
          },
          {
            id: "m_prob_07",
            titre: "Tirer un jeton numerote",
            diff: "moyen",
            enonce: "Un sac contient 12 jetons numerotes de 1 a 12. On tire un jeton au hasard.",
            questions: [
              "Quelle est la probabilite de tirer un nombre pair ?",
              "Quelle est la probabilite de tirer un multiple de 4 ?",
              "Quelle est la probabilite de tirer un nombre strictement superieur a 10 ?"
            ],
            correction: [
              "Nombres pairs : 2, 4, 6, 8, 10, 12 -> 6 cas sur 12 = 1/2.",
              "Multiples de 4 : 4, 8, 12 -> 3 cas sur 12 = 1/4.",
              "Superieurs a 10 : 11 et 12 -> 2 cas sur 12 = 1/6."
            ],
            piege: "On compte les cas favorables parmi les 12 jetons possibles."
          },
          {
            id: "m_prob_08",
            titre: "Deux tirages (arbre)",
            diff: "difficile",
            enonce: "Un sac contient 1 boule rouge (R) et 1 boule bleue (B). On tire une boule, on la remet, puis on en tire une seconde. L'arbre ci-dessous represente les tirages.",
            schema: `<svg width="100%" viewBox="0 0 280 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Arbre des deux tirages</title><desc>Deux tirages avec remise, issues RR, RB, BR, BB.</desc><g stroke="currentColor" stroke-width="1.5" fill="none"><line x1="45" y1="100" x2="120" y2="55"/><line x1="45" y1="100" x2="120" y2="145"/><line x1="135" y1="55" x2="210" y2="35"/><line x1="135" y1="55" x2="210" y2="80"/><line x1="135" y1="145" x2="210" y2="120"/><line x1="135" y1="145" x2="210" y2="165"/></g><circle cx="40" cy="100" r="2.5" fill="currentColor"/><text x="124" y="59" font-size="13" fill="currentColor" font-family="sans-serif">R</text><text x="124" y="150" font-size="13" fill="currentColor" font-family="sans-serif">B</text><text x="216" y="39" font-size="12" fill="currentColor" font-family="sans-serif">R  (RR)</text><text x="216" y="84" font-size="12" fill="currentColor" font-family="sans-serif">B  (RB)</text><text x="216" y="124" font-size="12" fill="currentColor" font-family="sans-serif">R  (BR)</text><text x="216" y="169" font-size="12" fill="currentColor" font-family="sans-serif">B  (BB)</text></svg>`,
            questions: [
              "Liste toutes les issues possibles et donne leur nombre.",
              "Quelle est la probabilite d'obtenir deux boules de la meme couleur ?"
            ],
            correction: [
              "Les issues sont RR, RB, BR, BB : il y a 4 issues.",
              "Memes couleurs : RR et BB -> 2 cas sur 4 = 1/2."
            ],
            piege: "L'arbre liste toutes les issues : RB et BR sont deux issues differentes."
          },
          {
            id: "m_prob_09",
            titre: "Choisir un bonbon",
            diff: "moyen",
            enonce: "Une boite contient 4 bonbons a la fraise, 3 au citron et 5 a la menthe. On prend un bonbon au hasard.",
            questions: [
              "Combien de bonbons y a-t-il en tout ?",
              "Quelle est la probabilite de prendre un bonbon a la menthe ?",
              "Quelle est la probabilite de prendre un bonbon qui n'est PAS au citron ?"
            ],
            correction: [
              "4 + 3 + 5 = 12 bonbons.",
              "5 bonbons a la menthe sur 12 : P = 5/12.",
              "Non citron = 12 - 3 = 9 -> P = 9/12 = 3/4."
            ],
            piege: "P(evenement contraire) = 1 - P(evenement)."
          },
          {
            id: "m_prob_10",
            titre: "La somme de deux des",
            diff: "difficile",
            enonce: "On lance deux des equilibres et on additionne les deux resultats. La somme peut aller de 2 a 12. Il y a 36 issues equiprobables (6 x 6).",
            questions: [
              "De combien de facons peut-on obtenir une somme de 7 ? Liste-les.",
              "Quelle est la probabilite d'obtenir une somme de 7 ?",
              "Quelle est la probabilite d'obtenir une somme de 12 ?"
            ],
            correction: [
              "(1;6), (2;5), (3;4), (4;3), (5;2), (6;1) : 6 facons.",
              "P(7) = 6 / 36 = 1/6.",
              "Somme 12 : seulement (6;6), donc P(12) = 1/36."
            ],
            piege: "Avec deux des, il y a 36 issues possibles (6 x 6), et non 12."
          },
          {
            id: "m_prob_11",
            titre: "QCM probabilites",
            diff: "moyen",
            enonce: "QCM. Un sac contient 10 boules : 4 rouges et 6 noires. On tire une boule au hasard.",
            questions: [
              "La probabilite de tirer une boule rouge est : a) 4   b) 2/5   c) 6/10",
              "La probabilite de tirer une boule noire est : a) 3/5   b) 4/10   c) 6"
            ],
            correction: [
              "P(rouge) = 4/10 = 2/5. Reponse b).",
              "P(noire) = 6/10 = 3/5. Reponse a)."
            ],
            piege: "Une probabilite est toujours un nombre entre 0 et 1 (jamais 4 ni 6)."
          },
          {
            id: "m_prob_12",
            titre: "La somme des probabilites",
            diff: "moyen",
            enonce: "Une urne contient 3 jetons gagnants et 7 jetons perdants. On tire un jeton au hasard.",
            questions: [
              "Quelle est la probabilite de gagner ?",
              "Quelle est la probabilite de perdre ?",
              "Verifie que la somme des deux probabilites vaut 1."
            ],
            correction: [
              "P(gagner) = 3/10.",
              "P(perdre) = 7/10.",
              "3/10 + 7/10 = 10/10 = 1 : c'est normal, c'est un evenement certain."
            ],
            piege: "La somme des probabilites de toutes les issues possibles vaut toujours 1."
          },
          {
            id: "m_prob_13",
            titre: "Vrai ou faux : nombre premier",
            diff: "difficile",
            enonce: "On lance un de equilibre a 6 faces. Affirmation : la probabilite d'obtenir un nombre premier est egale a 1/2.",
            questions: [
              "Cette affirmation est-elle vraie ou fausse ? Justifie (les nombres premiers entre 1 et 6 sont 2, 3 et 5)."
            ],
            correction: [
              "Les nombres premiers entre 1 et 6 sont 2, 3 et 5 : 3 cas favorables sur 6, soit 3/6 = 1/2. L'affirmation est VRAIE."
            ],
            piege: "1 n'est pas un nombre premier : les premiers de 1 a 6 sont 2, 3 et 5."
          },
          {
            id: "m_prob_14",
            titre: "La roue a cinq secteurs",
            diff: "moyen",
            enonce: "Une roue equilibree comporte 5 secteurs identiques numerotes de 1 a 5. On la fait tourner.",
            questions: [
              "Quelle est la probabilite d'obtenir un 3 ?",
              "Quelle est la probabilite d'obtenir un nombre impair ?",
              "Quelle est la probabilite d'obtenir un nombre inferieur ou egal a 5 ?"
            ],
            correction: [
              "1 cas sur 5 : P = 1/5.",
              "Impairs : 1, 3, 5 -> 3 cas sur 5 : P = 3/5.",
              "Tous les nombres conviennent : P = 5/5 = 1 (evenement certain)."
            ],
            piege: "Un evenement certain a une probabilite egale a 1."
          }
        ]
      },

      /* ============ THEME 10 : GEOMETRIE DANS L'ESPACE ============ */
      {
        id: "espace",
        titre: "Geometrie dans l'espace",
        exos: [
          {
            id: "m_esp_01",
            titre: "Volume d'un pave droit",
            diff: "moyen",
            enonce: "Un pave droit (une boite) a pour dimensions : longueur 5 cm, largeur 3 cm et hauteur 4 cm (voir figure).",
            schema: `<svg width="100%" viewBox="0 0 230 205" role="img" xmlns="http://www.w3.org/2000/svg"><title>Pave droit</title><desc>Pave droit de dimensions 5 cm, 3 cm et 4 cm.</desc><polygon points="40,80 160,80 160,170 40,170" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="40,80 80,52 200,52 160,80" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="160,80 200,52 200,142 160,170" fill="none" stroke="currentColor" stroke-width="2"/><path d="M40,170 L80,142 L200,142 M80,142 L80,52" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4 3"/><text x="92" y="188" font-size="12" fill="currentColor" font-family="sans-serif">5 cm</text><text x="6" y="130" font-size="12" fill="currentColor" font-family="sans-serif">4 cm</text><text x="176" y="48" font-size="12" fill="currentColor" font-family="sans-serif">3 cm</text></svg>`,
            questions: [
              "Rappelle la formule du volume d'un pave droit.",
              "Calcule le volume de cette boite.",
              "Donne l'unite du resultat."
            ],
            correction: [
              "V = Longueur x largeur x hauteur.",
              "V = 5 x 3 x 4 = 60.",
              "Le volume s'exprime en cm^3 (centimetres cubes) : V = 60 cm^3."
            ],
            piege: "Un volume s'exprime en unites CUBES (cm^3, m^3...)."
          },
          {
            id: "m_esp_02",
            titre: "Volume d'un cylindre",
            diff: "difficile",
            enonce: "Un cylindre a un rayon de base de 2 cm et une hauteur de 10 cm (voir figure). On prend pi = 3,14.",
            schema: `<svg width="100%" viewBox="0 0 240 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Cylindre</title><desc>Cylindre de rayon 2 cm et hauteur 10 cm.</desc><ellipse cx="115" cy="45" rx="55" ry="16" fill="none" stroke="currentColor" stroke-width="2"/><line x1="60" y1="45" x2="60" y2="160" stroke="currentColor" stroke-width="2"/><line x1="170" y1="45" x2="170" y2="160" stroke="currentColor" stroke-width="2"/><path d="M60,160 A 55 16 0 0 0 170,160" fill="none" stroke="currentColor" stroke-width="2"/><path d="M60,160 A 55 16 0 0 1 170,160" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4 3"/><line x1="115" y1="45" x2="170" y2="45" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2"/><text x="120" y="40" font-size="12" fill="currentColor" font-family="sans-serif">r = 2 cm</text><text x="176" y="108" font-size="12" fill="currentColor" font-family="sans-serif">h = 10 cm</text></svg>`,
            questions: [
              "Quelle est la formule du volume d'un cylindre ?",
              "Calcule l'aire de la base (un disque de rayon 2 cm).",
              "Calcule le volume du cylindre (arrondi a l'unite)."
            ],
            correction: [
              "V = pi x r^2 x h (aire de la base x hauteur).",
              "Aire de base = pi x r^2 = 3,14 x 2^2 = 3,14 x 4 = 12,56 cm^2.",
              "V = 12,56 x 10 = 125,6, soit environ 126 cm^3."
            ],
            piege: "Aire d'un disque = pi x r^2 (avec le RAYON, pas le diametre)."
          },
          {
            id: "m_esp_03",
            titre: "Volume d'une boule",
            diff: "difficile",
            enonce: "Une boule a un rayon de 3 cm. On prend pi = 3,14. Formule du volume d'une boule : V = 4/3 x pi x r^3.",
            questions: [
              "Calcule r^3 (le rayon au cube).",
              "Calcule le volume de la boule (arrondi a l'unite).",
              "Donne l'unite du resultat."
            ],
            correction: [
              "r^3 = 3^3 = 3 x 3 x 3 = 27.",
              "V = 4/3 x 3,14 x 27 = 4/3 x 84,78 = 113,04, soit environ 113 cm^3.",
              "Le resultat est en cm^3."
            ],
            piege: "Le volume d'une boule utilise le rayon au CUBE (r^3), pas au carre."
          },
          {
            id: "m_esp_04",
            titre: "Volume d'un cone",
            diff: "moyen",
            enonce: "Un cone de revolution a un rayon de base de 3 cm et une hauteur de 8 cm (voir figure). On prend pi = 3,14. Formule : V = (1/3) x pi x r^2 x h.",
            schema: `<svg width="100%" viewBox="0 0 260 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Cone de revolution</title><desc>Cone de rayon 3 cm et hauteur 8 cm.</desc><line x1="130" y1="40" x2="75" y2="160" stroke="currentColor" stroke-width="2"/><line x1="130" y1="40" x2="185" y2="160" stroke="currentColor" stroke-width="2"/><path d="M75,160 A 55 15 0 0 0 185,160" fill="none" stroke="currentColor" stroke-width="2"/><path d="M75,160 A 55 15 0 0 1 185,160" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4 3"/><line x1="130" y1="40" x2="130" y2="160" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2"/><line x1="130" y1="160" x2="185" y2="160" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2"/><text x="135" y="105" font-size="12" fill="currentColor" font-family="sans-serif">h = 8</text><text x="148" y="176" font-size="12" fill="currentColor" font-family="sans-serif">r = 3</text></svg>`,
            questions: [
              "Calcule l'aire de la base (un disque de rayon 3 cm).",
              "Calcule le volume du cone (arrondi a l'unite)."
            ],
            correction: [
              "Aire de base = pi x r^2 = 3,14 x 3^2 = 3,14 x 9 = 28,26 cm^2.",
              "V = (1/3) x 28,26 x 8 = (1/3) x 226,08 = 75,36, soit environ 75 cm^3."
            ],
            piege: "Volume d'un cone (ou d'une pyramide) = 1/3 x aire de base x hauteur."
          },
          {
            id: "m_esp_05",
            titre: "Volume et surface d'un cube",
            diff: "moyen",
            enonce: "Un cube a une arete de 5 cm (voir figure).",
            schema: `<svg width="100%" viewBox="0 0 220 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Cube d'arete 5 cm</title><desc>Cube de cote 5 cm.</desc><polygon points="50,70 150,70 150,170 50,170" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="50,70 85,45 185,45 150,70" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="150,70 185,45 185,145 150,170" fill="none" stroke="currentColor" stroke-width="2"/><path d="M50,170 L85,145 L185,145 M85,145 L85,45" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4 3"/><text x="92" y="188" font-size="12" fill="currentColor" font-family="sans-serif">5 cm</text></svg>`,
            questions: [
              "Rappelle la formule du volume d'un cube.",
              "Calcule son volume.",
              "Calcule l'aire totale de ses 6 faces."
            ],
            correction: [
              "V = a^3 (l'arete au cube).",
              "V = 5^3 = 5 x 5 x 5 = 125 cm^3.",
              "Une face = 5 x 5 = 25 cm^2 ; 6 faces -> 6 x 25 = 150 cm^2."
            ],
            piege: "Volume = a^3 (en cm^3) ; aire d'une face = a^2 (en cm^2). Ne pas confondre."
          },
          {
            id: "m_esp_06",
            titre: "Reduction d'une pyramide",
            diff: "difficile",
            enonce: "Une pyramide a un volume de 240 cm^3. On la reduit a l'echelle 1/2 : toutes ses longueurs sont divisees par 2.",
            questions: [
              "Quand on divise les longueurs par 2, par combien le volume est-il divise ?",
              "Calcule le volume de la pyramide reduite."
            ],
            correction: [
              "Le volume est divise par 2^3 = 8.",
              "240 / 8 = 30 cm^3."
            ],
            piege: "Dans une reduction de rapport k, les longueurs sont x k, les aires x k^2 et les volumes x k^3."
          },
          {
            id: "m_esp_07",
            titre: "Volume d'un prisme droit",
            diff: "moyen",
            enonce: "Un prisme droit a pour base un triangle rectangle de cotes 3 cm et 4 cm (formant l'angle droit). La longueur du prisme est de 10 cm (voir figure).",
            schema: `<svg width="100%" viewBox="0 0 230 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Prisme droit a base triangulaire</title><desc>Base : triangle rectangle de cotes 3 et 4 cm ; longueur 10 cm.</desc><polygon points="55,150 55,80 105,150" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="120,128 120,58 170,128" fill="none" stroke="currentColor" stroke-width="2"/><line x1="55" y1="80" x2="120" y2="58" stroke="currentColor" stroke-width="2"/><line x1="105" y1="150" x2="170" y2="128" stroke="currentColor" stroke-width="2"/><line x1="55" y1="150" x2="120" y2="128" stroke="currentColor" stroke-width="1" stroke-dasharray="4 3"/><text x="38" y="120" font-size="11" fill="currentColor" font-family="sans-serif">3</text><text x="74" y="166" font-size="11" fill="currentColor" font-family="sans-serif">4</text><text x="128" y="98" font-size="11" fill="currentColor" font-family="sans-serif">10</text></svg>`,
            questions: [
              "Calcule l'aire de la base (le triangle rectangle).",
              "Calcule le volume du prisme."
            ],
            correction: [
              "Aire de la base = (3 x 4) / 2 = 6 cm^2.",
              "V = aire de base x longueur = 6 x 10 = 60 cm^3."
            ],
            piege: "Volume d'un prisme = aire de la base x longueur ; aire d'un triangle = (base x hauteur) / 2."
          },
          {
            id: "m_esp_08",
            titre: "Volume d'une pyramide",
            diff: "difficile",
            enonce: "Une pyramide a une base carree de cote 6 cm et une hauteur de 10 cm. Formule : V = (1/3) x aire de base x hauteur.",
            questions: [
              "Calcule l'aire de la base.",
              "Calcule le volume de la pyramide."
            ],
            correction: [
              "Aire de base = 6 x 6 = 36 cm^2.",
              "V = (1/3) x 36 x 10 = (1/3) x 360 = 120 cm^3."
            ],
            piege: "Volume d'une pyramide (ou d'un cone) = 1/3 x aire de base x hauteur."
          },
          {
            id: "m_esp_09",
            titre: "La contenance d'un aquarium",
            diff: "moyen",
            enonce: "Un aquarium en forme de pave droit mesure 50 cm de long, 30 cm de large et 40 cm de haut.",
            questions: [
              "Calcule son volume en cm^3.",
              "Sachant que 1 L = 1000 cm^3, combien de litres d'eau peut-il contenir ?"
            ],
            correction: [
              "V = 50 x 30 x 40 = 60 000 cm^3.",
              "60 000 / 1000 = 60 litres."
            ],
            piege: "Conversion utile : 1 L = 1000 cm^3 = 1 dm^3."
          },
          {
            id: "m_esp_10",
            titre: "Convertir un volume",
            diff: "moyen",
            enonce: "Un reservoir a un volume de 2 m^3.",
            questions: [
              "Convertis ce volume en dm^3 (on rappelle : 1 m^3 = 1000 dm^3).",
              "Combien de litres cela represente-t-il (1 dm^3 = 1 L) ?"
            ],
            correction: [
              "2 x 1000 = 2000 dm^3.",
              "2000 dm^3 = 2000 L."
            ],
            piege: "1 m^3 = 1000 dm^3 = 1000 L."
          },
          {
            id: "m_esp_11",
            titre: "La generatrice d'un cone",
            diff: "difficile",
            enonce: "Un cone a un rayon de base de 3 cm et une hauteur de 4 cm. On cherche la longueur d'une generatrice (segment du sommet jusqu'au bord de la base, voir figure).",
            schema: `<svg width="100%" viewBox="0 0 240 200" role="img" xmlns="http://www.w3.org/2000/svg"><title>Cone : rayon, hauteur et generatrice</title><desc>Rayon 3 cm, hauteur 4 cm, generatrice cherchee.</desc><line x1="120" y1="45" x2="70" y2="155" stroke="currentColor" stroke-width="2"/><line x1="120" y1="45" x2="170" y2="155" stroke="currentColor" stroke-width="2"/><path d="M70,155 A 50 14 0 0 0 170,155" fill="none" stroke="currentColor" stroke-width="2"/><path d="M70,155 A 50 14 0 0 1 170,155" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4 3"/><line x1="120" y1="45" x2="120" y2="155" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2"/><line x1="120" y1="155" x2="170" y2="155" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2"/><rect x="120" y="141" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="125" y="105" font-size="12" fill="currentColor" font-family="sans-serif">h = 4</text><text x="138" y="172" font-size="12" fill="currentColor" font-family="sans-serif">r = 3</text><text x="150" y="100" font-size="12" fill="currentColor" font-family="sans-serif">g = ?</text></svg>`,
            questions: [
              "Le triangle forme par la hauteur, le rayon et la generatrice est rectangle. Ecris l'egalite de Pythagore.",
              "Calcule la longueur de la generatrice."
            ],
            correction: [
              "generatrice^2 = hauteur^2 + rayon^2 = 4^2 + 3^2 = 16 + 9 = 25.",
              "generatrice = racine de 25 = 5 cm."
            ],
            piege: "La generatrice est l'hypotenuse du triangle rectangle (rayon ; hauteur)."
          },
          {
            id: "m_esp_12",
            titre: "Agrandir un cube",
            diff: "moyen",
            enonce: "Un cube a un volume de 8 cm^3. On multiplie toutes ses aretes par 3.",
            questions: [
              "Par combien le volume est-il multiplie ?",
              "Calcule le volume du nouveau cube."
            ],
            correction: [
              "Le volume est multiplie par 3^3 = 27.",
              "8 x 27 = 216 cm^3."
            ],
            piege: "Agrandissement de rapport k : les volumes sont multiplies par k^3."
          },
          {
            id: "m_esp_13",
            titre: "QCM volume d'une boule",
            diff: "difficile",
            enonce: "QCM. Une boule a un rayon de 6 cm. On prend pi = 3,14 et V = (4/3) x pi x r^3.",
            questions: [
              "r^3 vaut : a) 18   b) 216   c) 36",
              "Le volume vaut environ : a) 904 cm^3   b) 113 cm^3   c) 452 cm^3"
            ],
            correction: [
              "r^3 = 6^3 = 6 x 6 x 6 = 216. Reponse b).",
              "V = (4/3) x 3,14 x 216 = (4/3) x 678,24 = 904,32, soit environ 904 cm^3. Reponse a)."
            ],
            piege: "r^3 = 216 (et non 6 x 3) : c'est 6 x 6 x 6."
          },
          {
            id: "m_esp_14",
            titre: "La contenance d'une piscine",
            diff: "difficile",
            enonce: "Une piscine a la forme d'un pave droit : 10 m de long, 5 m de large et 2 m de profondeur.",
            questions: [
              "Calcule le volume de la piscine, en m^3.",
              "Combien de litres d'eau peut-elle contenir (1 m^3 = 1000 L) ?",
              "Si on la remplit a 80 %, combien de litres d'eau cela represente-t-il ?"
            ],
            correction: [
              "V = 10 x 5 x 2 = 100 m^3.",
              "100 x 1000 = 100 000 L.",
              "80 % de 100 000 = 0,80 x 100 000 = 80 000 L."
            ],
            piege: "1 m^3 = 1000 L ; on applique ensuite le pourcentage au volume total."
          }
        ]
      }

    ]
  }
};

if (typeof window !== "undefined") { window.ANNALES = ANNALES; }
if (typeof module !== "undefined" && module.exports) { module.exports = ANNALES; }
