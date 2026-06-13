// Edge Function "groq-proxy"
// Transmet les requetes de ScolarIA vers l'API Groq en gardant la cle
// GROQ_API_KEY cote serveur (jamais exposee dans le code public).
// Supporte le streaming (SSE) ET les reponses JSON classiques.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: { message: "Methode non autorisee" } }), {
      status: 405,
      headers: { ...CORS, "content-type": "application/json" },
    });
  }

  const key = Deno.env.get("GROQ_API_KEY");
  if (!key) {
    return new Response(
      JSON.stringify({ error: { message: "GROQ_API_KEY manquante cote serveur (secret Supabase)" } }),
      { status: 500, headers: { ...CORS, "content-type": "application/json" } },
    );
  }

  let body = "{}";
  try {
    body = await req.text();
  } catch (_e) {
    body = "{}";
  }

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + key,
    },
    body,
  });

  // On renvoie tel quel le corps de Groq (flux SSE ou JSON) + en-tetes CORS.
  const headers = new Headers(CORS);
  const ct = groqRes.headers.get("content-type");
  if (ct) headers.set("content-type", ct);

  return new Response(groqRes.body, { status: groqRes.status, headers });
});
