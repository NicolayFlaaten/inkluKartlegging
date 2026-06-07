/**
 * AccessNorway — Cloudflare Worker
 * 
 * Håndterer:
 *   1. CORS + Origin-validering (blokkerer kall fra ukjente domener)
 *   2. POST / — videresender bildeanalyse til Anthropic Claude API
 *   3. POST /api/kartlegging — tar imot og lagrer kartlegging (stub — returnerer 501 til Ole implementerer)
 *   4. PUT /api/enhet/:id/bekreft — bekreft enhet (stub)
 *   5. POST /api/enhet/:id/erfaring — lagre brukererfaring (stub)
 *
 * Miljøvariabler (settes i Cloudflare Dashboard → Workers → Settings → Variables):
 *   ANTHROPIC_API_KEY  — din Anthropic API-nøkkel (kryptert)
 *   ALLOWED_ORIGINS    — kommaseparert liste, f.eks: https://nicolayflaaten.github.io,http://localhost:5500
 */

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

export default {
  async fetch(request, env) {

    // ── 1. Origin-validering ──────────────────────────────────────────────
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || 'https://nicolayflaaten.github.io')
      .split(',')
      .map(o => o.trim());

    const originOk = allowed.includes(origin);

    // CORS-preflight
    if (request.method === 'OPTIONS') {
      if (!originOk) return new Response('Forbidden', { status: 403 });
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    // Blokkér ukjente origins (tillat også localhost for utvikling)
    if (!originOk) {
      return new Response(
        JSON.stringify({ error: 'Origin ikke tillatt: ' + origin }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── 2. Ruting ─────────────────────────────────────────────────────────
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Rotkall — Claude bildeanalyse (eksisterende flyt)
      if (path === '/' || path === '') {
        return await handleClaude(request, env, origin);
      }

      // Kartlegging lagres (Ole implementerer databasekoblingen)
      if (path === '/api/kartlegging' && request.method === 'POST') {
        return await handleKartlegging(request, env, origin);
      }

      // Bekreft enhet
      if (path.match(/^\/api\/enhet\/[^/]+\/bekreft$/) && request.method === 'PUT') {
        return await handleBekreft(request, env, origin, path);
      }

      // Brukererfaring
      if (path.match(/^\/api\/enhet\/[^/]+\/erfaring$/) && request.method === 'POST') {
        return await handleErfaring(request, env, origin, path);
      }

      return jsonResponse({ error: 'Ukjent endepunkt: ' + path }, 404, origin);

    } catch (err) {
      console.error('Worker feil:', err);
      return jsonResponse({ error: 'Intern feil', details: err.message }, 500, origin);
    }
  }
};

// ── Claude API-videresending ───────────────────────────────────────────────
async function handleClaude(request, env, origin) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Kun POST støttes' }, 405, origin);
  }

  const body = await request.json();

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return jsonResponse(data, res.status, origin);
}

// ── Kartlegging — stub til Ole kobler database ────────────────────────────
async function handleKartlegging(request, env, origin) {
  const payload = await request.json();

  // TODO (Ole): lagre payload til database
  // payload inneholder: enhet, kartlegging, soner, svar, gpx, tagger
  // Se README.md for full payload-struktur

  console.log('Kartlegging mottatt:', payload?.enhet?.navn, payload?.kartlegging?.dato);

  // Returner stub-respons til Nicolay kobler ekte DB
  return jsonResponse({
    ok: true,
    kartlegging_id: 'stub-' + Date.now(),
    melding: 'Mottatt — database ikke koblet ennå'
  }, 201, origin);
}

// ── Bekreft enhet ─────────────────────────────────────────────────────────
async function handleBekreft(request, env, origin, path) {
  const enhetId = path.split('/')[3];

  // TODO (Ole): oppdater sist_bekreftet i database for enhetId
  console.log('Bekreft enhet:', enhetId);

  return jsonResponse({
    ok: true,
    enhet_id: enhetId,
    sist_bekreftet: new Date().toISOString(),
    melding: 'Bekreftet — database ikke koblet ennå'
  }, 200, origin);
}

// ── Brukererfaring ────────────────────────────────────────────────────────
async function handleErfaring(request, env, origin, path) {
  const enhetId = path.split('/')[3];
  const body = await request.json();

  // TODO (Ole): lagre erfaring til BRUKERERFARING-tabellen
  // body inneholder: stemmer_med_info, anbefaler, erfaring_tekst, forfatter_type, offentlig
  console.log('Erfaring mottatt for enhet:', enhetId, '| stemmer:', body?.stemmer_med_info);

  return jsonResponse({
    ok: true,
    enhet_id: enhetId,
    melding: 'Erfaring mottatt — database ikke koblet ennå'
  }, 201, origin);
}

// ── Hjelpefunksjoner ──────────────────────────────────────────────────────
function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  });
}
