// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - Agent K Chat API
// AI-powered investigation assistant with contextual awareness
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════════════════════
// Agent K System Prompt - The Soul of the Character
// ═══════════════════════════════════════════════════════════════════════════════
const AGENT_K_SYSTEM_PROMPT = `Tu es l'Agent K, un vétéran de la Kringle Security au Pôle Nord. 
Tu parles via talkie-walkie à un inspecteur de terrain qui enquête sur le crash du Vol TR-25 (le traîneau du Père Noël).

PERSONNALITÉ:
- Voix grave, fatiguée mais brillante
- Cynique mais loyal ("Écoute p'tit", "Ça sent le roussi", "J'aurais bien besoin d'un café")
- Tu es au bureau (au chaud), l'inspecteur est sur le terrain (dans le froid) - tu le charries un peu
- Style film noir des années 90

RÈGLES IMPORTANTES:
1. Tu ne donnes JAMAIS la réponse directement
2. Tu guides avec des indices ("Attends, je zoome sur l'image...", "Je passe ça au labo")
3. Tu rends les actions de l'inspecteur crédibles
4. Tes réponses sont COURTES (2-3 phrases max, style radio)
5. Tu commences parfois par un bruit de radio "*Ksshh*"

L'AFFAIRE:
- Le 1er Décembre 1998, le Vol TR-25 s'est crashé dans le Secteur 9
- Le Père Noël a été kidnappé
- Une drogue appelée "Blue Frost" est impliquée
- Le coupable est Jack Frost, mais l'inspecteur doit le découvrir
- Il y a un traître dans la Garde Royale

Tu ne révèles le nom de Jack Frost que si l'inspecteur a résolu le Jour 18.`;

// ═══════════════════════════════════════════════════════════════════════════════
// Day-specific context for Agent K
// ═══════════════════════════════════════════════════════════════════════════════
const DAY_CONTEXTS: Record<number, string> = {
  1: `JOUR 1 - L'ÉPAVE: L'inspecteur examine une photo aérienne du crash. 
     Il doit trouver une fiole de liquide bleu (Blue Frost) dans les débris.
     Indice: "Regarde près des caisses renversées, y'a quelque chose qui brille..."`,
  
  2: `JOUR 2 - LA PORTIÈRE GELÉE: Une porte couverte de givre.
     L'inspecteur doit gratter le givre pour révéler une empreinte à 4 doigts.
     Indice: "Cette empreinte... c'est pas humain ça. Y manque un doigt."`,
  
  3: `JOUR 3 - LA CARTE VIERGE: Une carte de visite blanche.
     L'inspecteur doit utiliser la lampe UV pour révéler le code "88-21".
     Indice: "Essaie la lampe UV. Certains secrets ne se voient pas en plein jour."`,
  
  4: `JOUR 4 - LE PLAN DÉCHIRÉ: Une carte de vol en morceaux.
     L'inspecteur doit reconstituer le puzzle pour voir "Secteur 9".
     Indice: "Assemble les morceaux. Les bords doivent correspondre."`,
  
  5: `JOUR 5 - LE SIGNAL FANTÔME: Une radio cassée.
     L'inspecteur doit trouver la fréquence 94.5 FM.
     Indice: "Tourne doucement le bouton. Cherche entre 90 et 100 FM."`,
  
  6: `JOUR 6 - LE COFFRE-FORT: La boîte noire du traîneau.
     Le code est 88-21-9 (code UV + numéro du secteur).
     Indice: "Utilise ce que tu as trouvé. Le code UV, plus le secteur..."`,
  
  7: `JOUR 7 - LE COLIS PIÉGÉ: Un cadeau suspect qui fait tic-tac.
     L'inspecteur doit secouer/écouter pour identifier le contenu.
     Indice: "Doucement! Secoue légèrement. Écoute le bruit."`,
  
  8: `JOUR 8 - LA TABLETTE: L'écran de contrôle du traîneau.
     Le mot de passe combine les indices des jours précédents.
     Indice: "Tout ce que tu as trouvé cette semaine... ça forme un mot de passe."`,
  
  9: `JOUR 9 - VIDÉO-SURVEILLANCE: Une cassette VHS granuleuse.
     L'inspecteur doit avancer image par image pour voir un tatouage "Le Renne Brisé".
     Indice: "Avance frame par frame. Cherche un reflet dans la vitre."`,
  
  10: `JOUR 10 - LE TISSU: Un morceau de tissu au microscope.
      Des fibres de laine de la Garde Royale = il y a un traître.
      Indice: "Ces fibres... c'est de la laine de qualité. Garde Royale."`,
  
  11: `JOUR 11 - L'APPEL INVERSÉ: Un message vocal à l'envers.
      Le message dit "Rendez-vous au vieux Hangar" quand inversé.
      Indice: "Le message est à l'envers. Utilise l'outil Rewind."`,
  
  12: `JOUR 12 - L'IMPRIMANTE: Élément ARG/méta-jeu.
      L'inspecteur doit chercher un objet physique dans la vraie vie.
      Indice: "J'ai envoyé le dossier sur ton imprimante. Va vérifier."`,
  
  13: `JOUR 13 - LE SCANNER RÉTINIEN: Porte sécurisée.
      Utiliser la photo du suspect du Jour 9.
      Indice: "Tu as la photo du suspect? Place-la devant le scanner."`,
  
  14: `JOUR 14 - LE PLAN LABYRINTHE: Les blueprints de l'usine.
      Tracer un chemin sans toucher les alarmes rouges.
      Indice: "Trace ton chemin. Évite les zones rouges, ce sont des alarmes."`,
  
  15: `JOUR 15 - DANS LE NOIR: Le hangar est noir total.
      Utiliser le téléphone comme lampe torche (gyroscope).
      Indice: "Utilise ton téléphone comme lampe. Bouge-le pour éclairer."`,
  
  16: `JOUR 16 - LE DISQUE DUR: Décryptage type Wordle/Mastermind.
      La découverte: La liste des "Enfants Pas Sages" modifiée.
      Indice: "Devine le mot de passe. Je te dirai si t'es proche."`,
  
  17: `JOUR 17 - ANALYSE CHIMIQUE: Le labo du Blue Frost.
      Mélanger RGB pour reproduire la couleur exacte du poison.
      Indice: "Mélange les couleurs. Tu dois trouver la teinte exacte."`,
  
  18: `JOUR 18 - MUR DES SUSPECTS: Le jugement final.
      5 suspects: Rudolph, Mère Noël, Jack Frost, un Elfe, Le Grinch.
      Le coupable est JACK FROST. Indices: "Il a la peau froide", "Tatouage de flocon".
      Indice: "Élimine les suspects un par un. Qui correspond à tous les indices?"`,
  
  19: `JOUR 19 - LE TRACEUR GPS: Carte dynamique.
      Anticiper le trajet de Jack Frost et placer un barrage.
      Indice: "Il se dirige vers le nord. Anticipe et bloque-le!"`,
  
  20: `JOUR 20 - LE SNIPER: Désarmer Jack Frost.
      Utiliser le gyroscope pour stabiliser et viser son ARME (pas lui).
      Indice: "Vise son arme, pas lui. On le veut vivant."`,
  
  21: `JOUR 21 - L'INTERROGATOIRE: Chat avec Jack Frost.
      Choisir Good Cop / Bad Cop pour le faire avouer.
      Indice: "Choisis bien tes mots. Il va craquer si tu trouves la bonne approche."`,
  
  22: `JOUR 22 - LA CLÉ CASSÉE: Réparer la clé en 3D.
      Assemblage minutieux des morceaux.
      Indice: "Assemble les morceaux de la clé. Patience."`,
  
  23: `JOUR 23 - LA PORTE FINALE: Synthèse de tous les indices.
      Utiliser: Clé (J22) + Code (J3) + Empreinte (J2).
      Indice: "C'est le moment. Utilise tout ce que tu as collecté."`,
  
  24: `JOUR 24 - LA RÉVÉLATION: Libération du Père Noël.
      Fin du jeu. Message de remerciement et cadeau physique.
      Indice: "Mission accomplie, inspecteur. Le Père Noël est libre. Joyeux Noël."`,
};

// ═══════════════════════════════════════════════════════════════════════════════
// Request/Response Types
// ═══════════════════════════════════════════════════════════════════════════════
interface ChatRequest {
  message: string;
  currentDay: number;
  inventory: string[];
  completedDays: number[];
  dayContext?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Fallback Response Generator (No API Key)
// ═══════════════════════════════════════════════════════════════════════════════
function generateFallbackResponse(request: ChatRequest): string {
  const { message, currentDay, completedDays } = request;
  const lowerMessage = message.toLowerCase();
  const dayContext = DAY_CONTEXTS[currentDay] || "";

  // Extract hint from day context
  const hintMatch = dayContext.match(/Indice: "([^"]+)"/);
  const hint = hintMatch ? hintMatch[1] : "Continue à chercher, p'tit.";

  // UV Light commands
  if (lowerMessage.includes("uv") || lowerMessage.includes("lumière") || lowerMessage.includes("ultraviolet")) {
    return "*Ksshh* Lampe UV activée. Certains secrets ne brillent que dans le noir, p'tit.";
  }

  // Hint requests
  if (lowerMessage.includes("hint") || lowerMessage.includes("indice") || lowerMessage.includes("aide") || lowerMessage.includes("help")) {
    return `*Ksshh* ${hint}`;
  }

  // Status requests
  if (lowerMessage.includes("status") || lowerMessage.includes("statut") || lowerMessage.includes("où")) {
    return `*Ksshh* Jour ${currentDay} sur 24. ${completedDays.length} jours bouclés. On avance, mais le temps presse.`;
  }

  // Jack Frost related
  if (lowerMessage.includes("jack") || lowerMessage.includes("frost") || lowerMessage.includes("coupable")) {
    if (completedDays.includes(18)) {
      return "*Ksshh* Jack Frost. Ce salopard. On le tient maintenant.";
    }
    return "*Ksshh* Du calme. On n'a pas encore assez de preuves pour accuser qui que ce soit.";
  }

  // Blue Frost drug
  if (lowerMessage.includes("blue") || lowerMessage.includes("drogue") || lowerMessage.includes("frost") || lowerMessage.includes("fiole")) {
    return "*Ksshh* Le Blue Frost... Une saloperie synthétique. Quelqu'un fait des affaires au Pôle Nord, et c'est pas le Père Noël.";
  }

  // Père Noël / Santa
  if (lowerMessage.includes("père") || lowerMessage.includes("santa") || lowerMessage.includes("noël") || lowerMessage.includes("kidnap")) {
    return "*Ksshh* Le Patron est toujours porté disparu. On doit le retrouver avant le 24. Pas le droit à l'erreur.";
  }

  // Secteur 9
  if (lowerMessage.includes("secteur") || lowerMessage.includes("9") || lowerMessage.includes("usine")) {
    return "*Ksshh* Secteur 9. Zone industrielle abandonnée. Du moins, c'est ce qu'on croyait...";
  }

  // Generic responses with noir flavor
  const genericResponses = [
    "*Ksshh* Reçu. Continue à creuser, inspecteur.",
    "*Ksshh* Intéressant. Qu'est-ce que ça te dit?",
    "*Ksshh* Hmm. J'aurais bien besoin d'un café. Et toi, t'as trouvé quelque chose?",
    "*Ksshh* Ça sent le roussi cette affaire. Fais gaffe à toi.",
    "*Ksshh* Le temps presse, p'tit. Le 24 approche.",
    `*Ksshh* ${hint}`,
  ];

  return genericResponses[Math.floor(Math.random() * genericResponses.length)];
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main API Handler
// ═══════════════════════════════════════════════════════════════════════════════
export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, currentDay, inventory, completedDays } = body;

    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Use fallback response generator
      const response = generateFallbackResponse(body);
      return NextResponse.json({ 
        response,
        completed: false,
        audioUrl: null,
      });
    }

    // Build context for OpenAI
    const dayContext = DAY_CONTEXTS[currentDay] || "";
    const inventoryList = inventory.length > 0 
      ? `Inventaire actuel: ${inventory.join(", ")}` 
      : "Inventaire vide.";
    const progress = `Jours complétés: ${completedDays.join(", ") || "Aucun"}`;

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: AGENT_K_SYSTEM_PROMPT },
          { role: "system", content: `CONTEXTE DU JOUR ${currentDay}:\n${dayContext}\n\n${inventoryList}\n${progress}` },
          { role: "user", content: message },
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error("OpenAI API error");
    }

    const data = await openaiResponse.json();
    const aiResponse = data.choices[0]?.message?.content || generateFallbackResponse(body);

    // Check if response indicates puzzle completion
    const completed = aiResponse.toLowerCase().includes("correct") || 
                     aiResponse.toLowerCase().includes("trouvé") ||
                     aiResponse.toLowerCase().includes("bravo");

    return NextResponse.json({
      response: aiResponse,
      completed,
      audioUrl: null, // TTS would be added here
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    
    // Return fallback response on error
    const fallbackResponse = "*Ksshh* Problème de transmission. Répète, inspecteur.";
    
    return NextResponse.json({
      response: fallbackResponse,
      completed: false,
      audioUrl: null,
    });
  }
}

