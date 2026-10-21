// Edge Function "groq-proxy"
// Transmet les requetes de ScolarIA vers l'API Groq en gardant la cle
// GROQ_API_KEY cote serveur (jamais exposee dans le code public).
// Supporte le streaming (SSE) ET les reponses JSON classiques.
//
// PROTECTIONS (octobre 2026). Avant, n'importe qui pouvait appeler ce proxy depuis
// n'importe ou et vider le quota Groq gratuit de TOUTE l'app (200 000 jetons/jour) :
//  - seuls les eleves CONNECTES a ScolarIA peuvent l'appeler : l'app envoie le jeton de
//    session de l'eleve (Authorization: Bearer <jeton>), verifie aupres de Supabase ;
//  - taille de la demande et max_tokens plafonnes, un seul choix de reponse ;
//  - seuls les outils utilises par l'app sont acceptes (function, browser_search).
// Secours : le secret AUTH_OBLIGATOIRE = 0 desactive la verification de connexion.
// Deploiement : dashboard Supabase > Edge Functions > groq-proxy > Code > coller ce fichier > Deploy
// (garder "Verify JWT" sur OFF : la verification est faite ici).

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "https://vefnkztjmodchvmspukh.supabase.co";
// Cle PUBLIQUE (la meme que dans l'app) : sert seulement a demander a Supabase qui est l'eleve.
const PUBLISHABLE_KEY = "sb_publishable_OVVDWsvA2-0dJuTdQREYVw_kSiTu7Ge";
const AUTH_OBLIGATOIRE = Deno.env.get("AUTH_OBLIGATOIRE") !== "0";
const MAX_BODY = 4_500_000; // une photo reduite (2000 px) fait au plus ~1,5 Mo en base64 ; limite Groq = 4 Mo
const MAX_TOKENS = 8000;    // la limite gratuite Groq est de 8 000 jetons par minute
const OUTILS_OK = new Set(["function", "browser_search"]);

function erreur(status: number, message: string) {
  return new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: { ...CORS, "content-type": "application/json" },
  });
}

// Jetons deja verifies (5 min) : evite un appel a Supabase a chaque message
const valides = new Map<string, number>();
async function eleveConnecte(req: Request): Promise<boolean> {
  const jeton = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!jeton || jeton.startsWith("sb_")) return false; // cle publique seule = pas un eleve connecte
  const exp = valides.get(jeton);
  if (exp && exp > Date.now()) return true;
  try {
    const r = await fetch(SUPABASE_URL + "/auth/v1/user", {
      headers: { Authorization: "Bearer " + jeton, apikey: PUBLISHABLE_KEY },
    });
    if (!r.ok) return false;
  } catch (_e) {
    return false;
  }
  if (valides.size > 1000) valides.clear();
  valides.set(jeton, Date.now() + 5 * 60_000);
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }
  if (req.method !== "POST") return erreur(405, "Methode non autorisee");

  const key = Deno.env.get("GROQ_API_KEY");
  if (!key) return erreur(500, "GROQ_API_KEY manquante cote serveur (secret Supabase)");

  if (AUTH_OBLIGATOIRE && !(await eleveConnecte(req))) {
    return erreur(401, "Connexion a ScolarIA necessaire");
  }

  let body = "";
  try {
    body = await req.text();
  } catch (_e) {
    return erreur(400, "Requete illisible");
  }
  if (body.length > MAX_BODY) return erreur(413, "Requete trop grosse");

  // deno-lint-ignore no-explicit-any
  let payload: any;
  try {
    payload = JSON.parse(body);
  } catch (_e) {
    return erreur(400, "Requete invalide");
  }
  if (!payload || typeof payload !== "object" || !Array.isArray(payload.messages)) {
    return erreur(400, "Requete invalide");
  }
  for (const champ of ["max_tokens", "max_completion_tokens"]) {
    if (typeof payload[champ] === "number" && payload[champ] > MAX_TOKENS) payload[champ] = MAX_TOKENS;
  }
  payload.n = 1;
  if (Array.isArray(payload.tools) && payload.tools.some((t: { type?: string }) => !t || !OUTILS_OK.has(String(t.type)))) {
    return erreur(400, "Outil non autorise");
  }

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + key,
    },
    body: JSON.stringify(payload),
  });

  // On renvoie tel quel le corps de Groq (flux SSE ou JSON) + en-tetes CORS.
  const headers = new Headers(CORS);
  const ct = groqRes.headers.get("content-type");
  if (ct) headers.set("content-type", ct);

  return new Response(groqRes.body, { status: groqRes.status, headers });
});
