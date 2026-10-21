// Edge Function "supprimer-compte" (RGPD : droit a l'effacement, eleves mineurs)
// L'eleve connecte supprime SON compte : ses donnees (table user_data) puis son compte
// (Supabase Auth). Personne d'autre ne peut le faire : l'identite vient de SON jeton de
// session, verifie aupres de Supabase (l'app redemande aussi son mot de passe avant).
// La cle service est fournie automatiquement par Supabase aux Edge Functions : elle reste
// cote serveur, jamais dans l'app.
// Deploiement : dashboard Supabase > Edge Functions > Deploy a new function > Via Editor >
// nom « supprimer-compte » > coller ce fichier > Deploy. Puis dans ses reglages :
// "Verify JWT" sur OFF (comme groq-proxy : la verification est faite ici).

import { createClient } from "npm:@supabase/supabase-js@2.118.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "https://vefnkztjmodchvmspukh.supabase.co";

function reponse(status: number, corps: unknown) {
  return new Response(JSON.stringify(corps), { status, headers: { ...CORS, "content-type": "application/json" } });
}
const erreur = (status: number, message: string) => reponse(status, { error: { message } });

// Cle service : ancienne cle « service_role » ou nouvelle cle secrete (sb_secret_…)
function cleService(): string {
  const ancienne = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (ancienne) return ancienne;
  try {
    const cles = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    return cles.default || Object.values(cles)[0] as string || "";
  } catch (_e) {
    return "";
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return erreur(405, "Methode non autorisee");

  const service = cleService();
  if (!service) return erreur(500, "Cle service manquante cote serveur");
  const admin = createClient(SUPABASE_URL, service, { auth: { persistSession: false, autoRefreshToken: false } });

  // 1. Qui est l'eleve ? (son jeton de session, jamais un identifiant envoye par l'app)
  const jeton = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!jeton || jeton.startsWith("sb_")) return erreur(401, "Connexion a ScolarIA necessaire");
  const qui = await admin.auth.getUser(jeton);
  const id = qui.data && qui.data.user && qui.data.user.id;
  if (qui.error || !id) return erreur(401, "Ta session a expire : reconnecte-toi puis reessaie.");

  // 2. Ses donnees (devoirs, cours, flashcards, historique, profil…)
  const donnees = await admin.from("user_data").delete().eq("user_id", id);
  if (donnees.error) return erreur(500, "Impossible d'effacer tes donnees pour le moment. Reessaie dans quelques minutes.");

  // 3. Son compte (email + mot de passe)
  const compte = await admin.auth.admin.deleteUser(id);
  if (compte.error && !/not.?found/i.test(compte.error.message || "")) {
    return erreur(500, "Tes donnees sont effacees mais pas encore ton compte. Reessaie dans quelques minutes.");
  }
  return reponse(200, { ok: true });
});
