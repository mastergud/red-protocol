// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - Complete Game Content (GDD Aligned)
// L'Affaire Silent Night - 24 Days of Noir Christmas Investigation
// Coupable: Jack Frost | Victime: Père Noël | Drogue: Blue Frost
// ═══════════════════════════════════════════════════════════════════════════════

export type GameDayType = 
  | "VISUAL_SEARCH"   // Chercher un élément dans une image
  | "SCRATCH"         // Gratter l'écran pour révéler
  | "UV_LIGHT"        // Utiliser la lampe UV
  | "RADIO"           // Tuner une fréquence
  | "SAFE"            // Ouvrir un coffre (code)
  | "PUZZLE"          // Drag & drop / assemblage
  | "STORY"           // Jour narratif
  | "VIDEO"           // Scrubbing vidéo
  | "MICROSCOPE"      // Zoom / mise au point
  | "AUDIO"           // Message inversé
  | "ARG"             // Élément méta-jeu (monde réel)
  | "SCANNER"         // Scanner rétinien
  | "MAZE"            // Labyrinthe
  | "FLASHLIGHT"      // Lampe torche (gyroscope)
  | "DECRYPT"         // Wordle/Mastermind
  | "COLOR_MIX"       // Mélange de couleurs
  | "SUSPECT_WALL"    // Élimination de suspects
  | "GPS_TRACK"       // Poursuite GPS
  | "SNIPER"          // Visée gyroscope
  | "INTERROGATION"   // Dialogue Good/Bad cop
  | "REPAIR"          // Réparation 3D
  | "FINAL"           // Porte finale (synthèse)
  | "ENDING";         // Fin du jeu

export interface GameDay {
  day: number;
  title: string;
  titleFr: string;
  type: GameDayType;
  act: 1 | 2 | 3;
  description: string;
  descriptionFr: string;
  hint: string;
  hintFr: string;
  solution?: string;
  assetUrl: string;
  aiContext: string;
  reward?: string;
  rewardFr?: string;
  mechanic?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTE 1: LA SCÈNE DE CRIME (Jours 1-8)
// Objectif: Comprendre le crash et identifier la menace
// ═══════════════════════════════════════════════════════════════════════════════
const ACT_1: GameDay[] = [
  {
    day: 1,
    title: "The Wreckage",
    titleFr: "L'Épave",
    type: "VISUAL_SEARCH",
    act: 1,
    description: `December 1st, 1998. 23:47.

The call crackled through: Flight TR-25 is down. The Royal Sleigh, 
smoking in Sector 9. No Santa. No bodies. Just wreckage and silence.

But something glows in the debris. Find it.`,
    descriptionFr: `1er Décembre 1998. 23h47.

L'appel a grésillé : Le Vol TR-25 est au sol. Le Traîneau Royal, 
fumant dans le Secteur 9. Pas de Père Noël. Pas de corps. Juste des débris et le silence.

Mais quelque chose brille dans les décombres. Trouve-le.`,
    hint: "Look near the overturned crates. Something glows blue.",
    hintFr: "Regarde près des caisses renversées. Quelque chose brille en bleu.",
    solution: "BLUE_VIAL",
    assetUrl: "/assets/day1/crash_aerial.jpg",
    aiContext: "Jour 1: Photo aérienne du crash. Chercher une fiole bleue (Blue Frost) près des caisses.",
    reward: "Blue Vial",
    rewardFr: "Fiole Bleue (Blue Frost)",
    mechanic: "Click on glowing object in debris",
  },
  {
    day: 2,
    title: "Frozen Door",
    titleFr: "La Portière Gelée",
    type: "SCRATCH",
    act: 1,
    description: `The sleigh door is covered in thick frost.

Someone touched it. Their warmth left a mark in the ice.
Scratch away the frost. Count the fingers.`,
    descriptionFr: `La portière du traîneau est couverte d'un givre épais.

Quelqu'un l'a touchée. Sa chaleur a laissé une trace dans la glace.
Gratte le givre. Compte les doigts.`,
    hint: "Scratch the center of the door with your cursor.",
    hintFr: "Gratte le centre de la porte avec ton curseur.",
    solution: "4",
    assetUrl: "/assets/day2/frozen_door.jpg",
    aiContext: "Jour 2: Gratter le givre pour révéler une empreinte à 4 doigts. Pas humain.",
    reward: "4-Finger Handprint",
    rewardFr: "Empreinte à 4 doigts",
    mechanic: "Canvas scratch reveal",
  },
  {
    day: 3,
    title: "Blank Card",
    titleFr: "La Carte Vierge",
    type: "UV_LIGHT",
    act: 1,
    description: `A white business card found on the pilot seat.

Completely blank. No name. No number.
But some messages aren't meant for daylight.`,
    descriptionFr: `Une carte de visite blanche trouvée sur le siège pilote.

Complètement vierge. Pas de nom. Pas de numéro.
Mais certains messages ne sont pas faits pour la lumière du jour.`,
    hint: "Use the UV Light. Type 'UV' in the Walkie-Talkie.",
    hintFr: "Utilise la lampe UV. Tape 'UV' dans le Talkie-Walkie.",
    solution: "8821",
    assetUrl: "/assets/day3/blank_card.jpg",
    aiContext: "Jour 3: Carte blanche. Lampe UV révèle le code '88-21'. Première partie du code du coffre.",
    reward: "Code: 88-21",
    rewardFr: "Code: 88-21",
    mechanic: "UV light toggle reveals hidden text",
  },
  {
    day: 4,
    title: "Torn Flight Plan",
    titleFr: "Le Plan Déchiré",
    type: "PUZZLE",
    act: 1,
    description: `A flight map, ripped to pieces.

Someone didn't want us to follow.
Put it back together. Where were they going?`,
    descriptionFr: `Une carte de vol, déchirée en morceaux.

Quelqu'un ne voulait pas qu'on suive.
Reconstitue-la. Où allaient-ils?`,
    hint: "Drag and drop the 4 pieces. Match the edges.",
    hintFr: "Glisse et dépose les 4 morceaux. Fais correspondre les bords.",
    solution: "SECTOR9",
    assetUrl: "/assets/day4/torn_map.png",
    aiContext: "Jour 4: Puzzle de carte. Assemblé = 'Secteur 9'. Destination du traîneau détourné.",
    reward: "Location: Sector 9",
    rewardFr: "Localisation: Secteur 9",
    mechanic: "4-piece drag-and-drop puzzle",
  },
  {
    day: 5,
    title: "Ghost Signal",
    titleFr: "Le Signal Fantôme",
    type: "RADIO",
    act: 1,
    description: `The sleigh's radio is damaged but powered.

Someone was listening. Or transmitting.
Find the frequency. 94.5 FM holds the answer.`,
    descriptionFr: `La radio du traîneau est endommagée mais alimentée.

Quelqu'un écoutait. Ou transmettait.
Trouve la fréquence. 94.5 FM contient la réponse.`,
    hint: "Turn the dial slowly. Listen for the voice around 94.5.",
    hintFr: "Tourne le bouton doucement. Écoute la voix autour de 94.5.",
    solution: "94.5",
    assetUrl: "/assets/day5/radio.jpg",
    aiContext: "Jour 5: Radio à tuner. 94.5 FM = voix d'elfe paniquée: 'Ils ont pris le Patron! C'est le gang de Jack!'",
    reward: "Audio: Distress Call",
    rewardFr: "Audio: Appel de détresse",
    mechanic: "Radio tuner slider",
  },
  {
    day: 6,
    title: "Black Box",
    titleFr: "Le Coffre-Fort",
    type: "SAFE",
    act: 1,
    description: `The flight recorder. Locked.

The combination is in your evidence.
Think: The UV code... plus the sector number.`,
    descriptionFr: `L'enregistreur de vol. Verrouillé.

La combinaison est dans tes preuves.
Réfléchis: Le code UV... plus le numéro du secteur.`,
    hint: "Combine 88-21 (Day 3) with 9 (Sector 9).",
    hintFr: "Combine 88-21 (Jour 3) avec 9 (Secteur 9).",
    solution: "88219",
    assetUrl: "/assets/day6/safe.jpg",
    aiContext: "Jour 6: Coffre-fort. Code = 88219 (UV + Secteur). Contient journal de bord confirmant sabotage.",
    reward: "Flight Log: Sabotage Confirmed",
    rewardFr: "Journal de bord: Sabotage confirmé",
    mechanic: "Combination dial with haptic feedback",
  },
  {
    day: 7,
    title: "Ticking Package",
    titleFr: "Le Colis Piégé",
    type: "VISUAL_SEARCH",
    act: 1,
    description: `A suspicious gift in the wreckage. Tick. Tick. Tick.

Don't shake it too hard. Listen carefully.
Metal? Liquid? Something else?`,
    descriptionFr: `Un cadeau suspect dans les débris. Tic. Tac. Tic.

Ne le secoue pas trop fort. Écoute attentivement.
Métal? Liquide? Autre chose?`,
    hint: "Gently shake/tilt your device. Listen to the sound.",
    hintFr: "Secoue/incline doucement ton appareil. Écoute le son.",
    solution: "BOMB",
    assetUrl: "/assets/day7/package.jpg",
    aiContext: "Jour 7: Colis suspect. Secouer = bruit métallique. C'est une bombe (désamorcée par l'IA).",
    reward: "Defused Bomb Evidence",
    rewardFr: "Bombe désamorcée (preuve)",
    mechanic: "Shake detection or click variations",
  },
  {
    day: 8,
    title: "Control Tablet",
    titleFr: "La Tablette (Hacking)",
    type: "DECRYPT",
    act: 1,
    description: `The sleigh's control screen. Password protected.

Everything you found this week... it forms a password.
Think. What connects it all?`,
    descriptionFr: `L'écran de contrôle du traîneau. Protégé par mot de passe.

Tout ce que tu as trouvé cette semaine... ça forme un mot de passe.
Réfléchis. Qu'est-ce qui relie tout ça?`,
    hint: "Combine your discoveries: BLUE + FROST = ?",
    hintFr: "Combine tes découvertes: BLUE + FROST = ?",
    solution: "BLUEFROST",
    assetUrl: "/assets/day8/tablet.jpg",
    aiContext: "Jour 8: Tablette. Mot de passe = BLUEFROST. Révèle le nom du gang et leur base.",
    reward: "Gang Files: Blue Frost Syndicate",
    rewardFr: "Dossiers du gang: Syndicat Blue Frost",
    mechanic: "Password input",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ACTE 2: L'ENQUÊTE (Jours 9-16)
// Objectif: Infiltrer le réseau et trouver le lieu de détention
// ═══════════════════════════════════════════════════════════════════════════════
const ACT_2: GameDay[] = [
  {
    day: 9,
    title: "Surveillance Tape",
    titleFr: "Vidéo-Surveillance",
    type: "VIDEO",
    act: 2,
    description: `A grainy VHS tape from Sector 9.

Scrub through frame by frame.
The kidnapper's reflection... a tattoo.`,
    descriptionFr: `Une cassette VHS granuleuse du Secteur 9.

Avance image par image.
Le reflet du kidnappeur... un tatouage.`,
    hint: "Scrub slowly. Look for a reflection in the window.",
    hintFr: "Avance lentement. Cherche un reflet dans la vitre.",
    solution: "BROKEN_REINDEER",
    assetUrl: "/assets/day9/vhs.jpg",
    aiContext: "Jour 9: VHS. Frame par frame révèle tatouage 'Le Renne Brisé'. Symbole du gang.",
    reward: "Tattoo ID: Broken Reindeer",
    rewardFr: "Tatouage: Le Renne Brisé",
    mechanic: "Video scrubbing timeline",
  },
  {
    day: 10,
    title: "Fabric Sample",
    titleFr: "Le Tissu (Microscope)",
    type: "MICROSCOPE",
    act: 2,
    description: `A piece of fabric caught on a fence.

Put it under the microscope. Adjust the focus.
These fibers... they're expensive.`,
    descriptionFr: `Un morceau de tissu accroché à un grillage.

Mets-le sous le microscope. Ajuste la mise au point.
Ces fibres... elles sont chères.`,
    hint: "Adjust the focus wheel. Look at the fiber quality.",
    hintFr: "Ajuste la molette de mise au point. Regarde la qualité des fibres.",
    solution: "ROYAL_GUARD",
    assetUrl: "/assets/day10/microscope.jpg",
    aiContext: "Jour 10: Microscope. Fibres = laine de la Garde Royale. Il y a un traître à l'intérieur.",
    reward: "Evidence: Royal Guard Traitor",
    rewardFr: "Preuve: Traître dans la Garde Royale",
    mechanic: "Focus slider reveals detail",
  },
  {
    day: 11,
    title: "Reversed Call",
    titleFr: "L'Appel (Audio Inversé)",
    type: "AUDIO",
    act: 2,
    description: `An intercepted voice message.

It sounds like gibberish. Backwards.
Use the rewind tool.`,
    descriptionFr: `Un message vocal intercepté.

Ça ressemble à du charabia. À l'envers.
Utilise l'outil Rewind.`,
    hint: "Play it backwards. What does it say?",
    hintFr: "Joue-le à l'envers. Qu'est-ce que ça dit?",
    solution: "HANGAR",
    assetUrl: "/assets/day11/audio.jpg",
    aiContext: "Jour 11: Audio inversé. À l'endroit = 'Rendez-vous au vieux Hangar.'",
    reward: "Location: The Old Hangar",
    rewardFr: "Lieu: Le Vieux Hangar",
    mechanic: "Audio reverse button",
  },
  {
    day: 12,
    title: "The Printer",
    titleFr: "L'Imprimante (Méta-Jeu)",
    type: "ARG",
    act: 2,
    description: `Agent K: "I sent the file to your real printer."

Or maybe it's hidden under your keyboard.
Find the physical clue.`,
    descriptionFr: `Agent K: "J'ai envoyé le dossier sur ton imprimante réelle."

Ou peut-être qu'il est caché sous ton clavier.
Trouve l'indice physique.`,
    hint: "Check your REAL printer or under your keyboard.",
    hintFr: "Vérifie ta VRAIE imprimante ou sous ton clavier.",
    solution: "FOUND",
    assetUrl: "/assets/day12/printer.jpg",
    aiContext: "Jour 12: MÉTA-JEU. L'indice est dans le monde réel (imprimante/clavier). ARG element.",
    reward: "Physical Clue Retrieved",
    rewardFr: "Indice physique récupéré",
    mechanic: "Real-world puzzle (ARG)",
  },
  {
    day: 13,
    title: "Retinal Scanner",
    titleFr: "Le Scanner Rétinien",
    type: "SCANNER",
    act: 2,
    description: `A security door. Retinal scan required.

But you have a photo of the suspect.
Place it in front of the scanner.`,
    descriptionFr: `Une porte sécurisée. Scan rétinien requis.

Mais tu as une photo du suspect.
Place-la devant le scanner.`,
    hint: "Use the suspect photo from Day 9.",
    hintFr: "Utilise la photo du suspect du Jour 9.",
    solution: "ACCESS_GRANTED",
    assetUrl: "/assets/day13/scanner.jpg",
    aiContext: "Jour 13: Scanner rétinien. Utiliser la photo du suspect (Jour 9) pour tromper le scanner.",
    reward: "Hangar Access Granted",
    rewardFr: "Accès au Hangar accordé",
    mechanic: "Drag photo to scanner",
  },
  {
    day: 14,
    title: "Blueprint Maze",
    titleFr: "Le Plan (Labyrinthe)",
    type: "MAZE",
    act: 2,
    description: `Factory blueprints. Security systems marked in red.

Draw your path. Don't touch the alarms.`,
    descriptionFr: `Plans de l'usine. Systèmes de sécurité marqués en rouge.

Trace ton chemin. Ne touche pas les alarmes.`,
    hint: "Draw a path from entry to Santa's location. Avoid red zones.",
    hintFr: "Trace un chemin de l'entrée à la position du Père Noël. Évite les zones rouges.",
    solution: "PATH_CLEAR",
    assetUrl: "/assets/day14/blueprints.jpg",
    aiContext: "Jour 14: Labyrinthe. Tracer un chemin sans toucher les zones d'alarme rouges.",
    reward: "Infiltration Route Mapped",
    rewardFr: "Route d'infiltration tracée",
    mechanic: "Line drawing maze",
  },
  {
    day: 15,
    title: "In The Dark",
    titleFr: "Dans le Noir",
    type: "FLASHLIGHT",
    act: 2,
    description: `Inside the hangar. Total darkness.

Your phone is your flashlight now.
Move it around. Find the clues.`,
    descriptionFr: `À l'intérieur du hangar. Noir total.

Ton téléphone est ta lampe torche maintenant.
Bouge-le. Trouve les indices.`,
    hint: "Move your device to move the flashlight beam.",
    hintFr: "Bouge ton appareil pour déplacer le faisceau de la lampe.",
    solution: "CELL_FOUND",
    assetUrl: "/assets/day15/dark.jpg",
    aiContext: "Jour 15: Lampe torche gyroscope. Éclairer la pièce sombre pour trouver une cellule.",
    reward: "Cell Location Found",
    rewardFr: "Cellule localisée",
    mechanic: "Gyroscope flashlight",
  },
  {
    day: 16,
    title: "Hard Drive",
    titleFr: "Le Disque Dur (Décryptage)",
    type: "DECRYPT",
    act: 2,
    description: `The gang's computer. Password locked.

Play the guessing game.
I'll tell you when you're close.`,
    descriptionFr: `L'ordinateur du gang. Protégé par mot de passe.

Joue au jeu des devinettes.
Je te dirai quand tu seras proche.`,
    hint: "Like Wordle. Guess the 5-letter password.",
    hintFr: "Comme Wordle. Devine le mot de passe à 5 lettres.",
    solution: "FROST",
    assetUrl: "/assets/day16/computer.jpg",
    aiContext: "Jour 16: Mini-jeu Wordle. Mot de passe = FROST. Révèle liste 'Enfants Pas Sages' modifiée.",
    reward: "Database: Naughty List Tampered",
    rewardFr: "Base de données: Liste des Pas Sages modifiée",
    mechanic: "Wordle-style guessing game",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ACTE 3: LA TRAQUE (Jours 17-24)
// Objectif: Arrêter le coupable et sauver Noël
// ═══════════════════════════════════════════════════════════════════════════════
const ACT_3: GameDay[] = [
  {
    day: 17,
    title: "Chemical Lab",
    titleFr: "Analyse Chimique",
    type: "COLOR_MIX",
    act: 3,
    description: `The Blue Frost production lab.

Mix the colors. Match the poison's exact shade.
R, G, B. Get it perfect.`,
    descriptionFr: `Le labo de production du Blue Frost.

Mélange les couleurs. Reproduis la teinte exacte du poison.
R, V, B. Sois précis.`,
    hint: "Adjust Red, Green, Blue sliders to match the sample.",
    hintFr: "Ajuste les curseurs Rouge, Vert, Bleu pour correspondre à l'échantillon.",
    solution: "COLOR_MATCHED",
    assetUrl: "/assets/day17/lab.jpg",
    aiContext: "Jour 17: Mélangeur de couleurs RGB. Reproduire la teinte exacte du Blue Frost.",
    reward: "Chemical Formula Decoded",
    rewardFr: "Formule chimique décodée",
    mechanic: "RGB color mixer",
  },
  {
    day: 18,
    title: "Suspect Wall",
    titleFr: "Le Mur des Suspects",
    type: "SUSPECT_WALL",
    act: 3,
    description: `Five suspects. One killer.

Rudolph. Mrs. Claus. Jack Frost. Elf Bernard. The Grinch.

Eliminate them one by one. Who fits ALL the evidence?`,
    descriptionFr: `Cinq suspects. Un coupable.

Rudolph. Mère Noël. Jack Frost. Elfe Bernard. Le Grinch.

Élimine-les un par un. Qui correspond à TOUTES les preuves?`,
    hint: "Cold skin. Snowflake tattoo. Blue Frost connection. Who is it?",
    hintFr: "Peau froide. Tatouage de flocon. Lié au Blue Frost. Qui est-ce?",
    solution: "JACK_FROST",
    assetUrl: "/assets/day18/suspect_wall.jpg",
    aiContext: "Jour 18: MUR DES SUSPECTS. Indices: peau froide, tatouage flocon. Coupable = JACK FROST.",
    reward: "Culprit Identified: JACK FROST",
    rewardFr: "Coupable identifié: JACK FROST",
    mechanic: "Swipe to eliminate suspects",
  },
  {
    day: 19,
    title: "GPS Pursuit",
    titleFr: "Le Traceur GPS",
    type: "GPS_TRACK",
    act: 3,
    description: `Jack Frost is running.

Track his GPS signal. Anticipate his route.
Set up the roadblock.`,
    descriptionFr: `Jack Frost s'enfuit.

Trace son signal GPS. Anticipe sa route.
Place le barrage routier.`,
    hint: "Watch the red dot. Click where he'll be, not where he is.",
    hintFr: "Regarde le point rouge. Clique où il sera, pas où il est.",
    solution: "BLOCKED",
    assetUrl: "/assets/day19/gps.jpg",
    aiContext: "Jour 19: Carte GPS. Anticiper le trajet de Jack Frost et placer un barrage.",
    reward: "Jack Frost Cornered",
    rewardFr: "Jack Frost acculé",
    mechanic: "Predictive clicking on map",
  },
  {
    day: 20,
    title: "The Shot",
    titleFr: "Le Sniper (Visée)",
    type: "SNIPER",
    act: 3,
    description: `Jack Frost is barricaded. Armed.

Aim for his WEAPON. Not him.
We need him alive.`,
    descriptionFr: `Jack Frost est barricadé. Armé.

Vise son ARME. Pas lui.
On le veut vivant.`,
    hint: "Use gyroscope to aim. Steady hands. Hit the gun.",
    hintFr: "Utilise le gyroscope pour viser. Mains stables. Touche l'arme.",
    solution: "DISARMED",
    assetUrl: "/assets/day20/sniper.jpg",
    aiContext: "Jour 20: Visée gyroscope. Tirer sur l'ARME de Jack Frost pour le désarmer.",
    reward: "Jack Frost Disarmed",
    rewardFr: "Jack Frost désarmé",
    mechanic: "Gyroscope aiming",
  },
  {
    day: 21,
    title: "Interrogation",
    titleFr: "L'Interrogatoire",
    type: "INTERROGATION",
    act: 3,
    description: `Jack Frost in custody.

Make him talk. Good cop? Bad cop?
Choose your words wisely.`,
    descriptionFr: `Jack Frost en garde à vue.

Fais-le parler. Gentil flic? Méchant flic?
Choisis bien tes mots.`,
    hint: "Find the right approach. He'll crack eventually.",
    hintFr: "Trouve la bonne approche. Il finira par craquer.",
    solution: "CONFESSION",
    assetUrl: "/assets/day21/interrogation.jpg",
    aiContext: "Jour 21: Dialogue branching. Good cop/Bad cop. Jack révèle où est le Père Noël.",
    reward: "Santa's Location Revealed",
    rewardFr: "Localisation du Père Noël révélée",
    mechanic: "Dialogue choice system",
  },
  {
    day: 22,
    title: "Broken Key",
    titleFr: "La Clé Cassée",
    type: "REPAIR",
    act: 3,
    description: `The cell key broke during the arrest.

Piece it back together.
Careful. Patience.`,
    descriptionFr: `La clé de la cellule s'est cassée pendant l'arrestation.

Reconstitue-la.
Attention. Patience.`,
    hint: "Drag and rotate the pieces to repair the key.",
    hintFr: "Glisse et tourne les morceaux pour réparer la clé.",
    solution: "KEY_FIXED",
    assetUrl: "/assets/day22/key.jpg",
    aiContext: "Jour 22: Puzzle 3D. Assembler les morceaux de la clé cassée.",
    reward: "Cell Key Repaired",
    rewardFr: "Clé de cellule réparée",
    mechanic: "3D assembly puzzle",
  },
  {
    day: 23,
    title: "Final Door",
    titleFr: "La Porte Finale",
    type: "FINAL",
    act: 3,
    description: `The last barrier.

Use everything you've collected.
The Key. The Code. The Handprint.`,
    descriptionFr: `La dernière barrière.

Utilise tout ce que tu as collecté.
La Clé. Le Code. L'Empreinte.`,
    hint: "Combine: Key (Day 22) + Code 88-21 (Day 3) + 4-finger print (Day 2).",
    hintFr: "Combine: Clé (Jour 22) + Code 88-21 (Jour 3) + Empreinte 4 doigts (Jour 2).",
    solution: "DOOR_OPEN",
    assetUrl: "/assets/day23/final_door.jpg",
    aiContext: "Jour 23: SYNTHÈSE. Utiliser Clé + Code + Empreinte pour ouvrir la porte finale.",
    reward: "Door Unlocked",
    rewardFr: "Porte déverrouillée",
    mechanic: "Multi-step unlock sequence",
  },
  {
    day: 24,
    title: "Christmas Morning",
    titleFr: "Matin de Noël",
    type: "ENDING",
    act: 3,
    description: `Santa is free.

Against all odds, the sleigh is repaired.
"The children can't know," he says. "Christmas must go on."

Watch him fly into the night sky.

Mission accomplished, Inspector.

🎄 MERRY CHRISTMAS 🎄
THE END`,
    descriptionFr: `Le Père Noël est libre.

Contre toute attente, le traîneau est réparé.
"Les enfants ne doivent pas savoir," dit-il. "Noël doit continuer."

Regarde-le s'envoler dans le ciel nocturne.

Mission accomplie, Inspecteur.

🎄 JOYEUX NOËL 🎄
FIN`,
    hint: "Enjoy the ending. You've earned it.",
    hintFr: "Profite de la fin. Tu l'as mérité.",
    solution: "CASE_CLOSED",
    assetUrl: "/assets/day24/christmas.jpg",
    aiContext: "Jour 24: FIN. Le Père Noël est sauvé. Message de remerciement. Cadeau physique révélé.",
    reward: "🏆 CASE CLOSED - RED PROTOCOL COMPLETE",
    rewardFr: "🏆 AFFAIRE CLASSÉE - RED PROTOCOL TERMINÉ",
    mechanic: "Ending cinematic + real gift reveal",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT: Complete 24 Days
// ═══════════════════════════════════════════════════════════════════════════════
export const GAME_DAYS: GameDay[] = [...ACT_1, ...ACT_2, ...ACT_3];

// ═══════════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════════
export function getDay(dayNumber: number): GameDay | undefined {
  return GAME_DAYS.find((d) => d.day === dayNumber);
}

export function getDaysByAct(act: 1 | 2 | 3): GameDay[] {
  return GAME_DAYS.filter((d) => d.act === act);
}

export function validateDaySolution(dayNumber: number, answer: string): boolean {
  const day = getDay(dayNumber);
  if (!day || !day.solution) return false;
  return day.solution.toUpperCase() === answer.toUpperCase().replace(/[\s-]/g, "");
}

export function getActTitle(act: 1 | 2 | 3): { en: string; fr: string } {
  const titles = {
    1: { en: "ACT 1: THE CRIME SCENE", fr: "ACTE 1: LA SCÈNE DE CRIME" },
    2: { en: "ACT 2: THE INVESTIGATION", fr: "ACTE 2: L'ENQUÊTE" },
    3: { en: "ACT 3: THE PURSUIT", fr: "ACTE 3: LA TRAQUE" },
  };
  return titles[act];
}
