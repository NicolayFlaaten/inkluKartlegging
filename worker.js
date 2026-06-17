/**
 * AccessNorway — Cloudflare Worker
 *
 * Miljøvariabler (Cloudflare Dashboard → Workers → Settings → Variables):
 *   ANTHROPIC_API_KEY  — Anthropic API-nøkkel (Secret)
 *   ALLOWED_ORIGINS    — kommaseparert, f.eks: https://nicolayflaaten.github.io,null
 *   WORKER_TOKEN       — hemmelig token som klienten må sende i X-Worker-Token (Secret)
 */

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MISTRAL_URL   = 'https://api.mistral.ai/v1/chat/completions';

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

    // Blokkér ukjente origins
    if (!originOk) {
      return new Response(
        JSON.stringify({ error: 'Origin ikke tillatt: ' + origin }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── 2. Worker-token-validering ────────────────────────────────────────
    // Beskytter mot misbruk fra noen som finner Worker-URL-en
    if (env.WORKER_TOKEN) {
      const clientToken = request.headers.get('X-Worker-Token') || '';
      if (clientToken !== env.WORKER_TOKEN) {
        return new Response(
          JSON.stringify({ error: 'Ugyldig token' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // ── 3. Ruting ─────────────────────────────────────────────────────────
    const url  = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === '/' || path === '') {
        return await handleClaude(request, env, origin);
      }
      if (path === '/api/kartlegging' && request.method === 'POST') {
        return await handleKartlegging(request, env, origin);
      }
      if (path.match(/^\/api\/enhet\/[^/]+\/bekreft$/) && request.method === 'PUT') {
        return await handleBekreft(request, env, origin, path);
      }
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

// ── Ruter til riktig AI-leverandør ────────────────────────────────────────
async function handleClaude(request, env, origin) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Kun POST støttes' }, 405, origin);
  }

  const provider = request.headers.get('X-Provider') || 'anthropic';
  const body = await request.json();

  if (provider === 'mistral') {
    return await forwardMistral(body, env, origin);
  }
  return await forwardAnthropic(body, env, origin);
}

// ── Anthropic ──────────────────────────────────────────────────────────────
async function forwardAnthropic(body, env, origin) {
  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return jsonResponse(data, res.status, origin);
}

// ── Mistral ────────────────────────────────────────────────────────────────
// Konverterer Anthropic-format → Mistral-format og tilbake
async function forwardMistral(body, env, origin) {
  if (!env.MISTRAL_API_KEY) {
    return jsonResponse({ error: 'MISTRAL_API_KEY ikke satt i Cloudflare' }, 500, origin);
  }

  // Konverter Anthropic messages-format til Mistral
  // Mistral støtter ikke document-type direkte — konverter base64 PDF til image_url
  const mistralMessages = (body.messages || []).map(msg => {
    if (Array.isArray(msg.content)) {
      const parts = msg.content.map(part => {
        if (part.type === 'document' || part.type === 'image') {
          const mediaType = part.source?.media_type || 'image/jpeg';
          const data = part.source?.data || '';
          return {
            type: 'image_url',
            image_url: { url: `data:${mediaType};base64,${data}` }
          };
        }
        if (part.type === 'text') {
          return { type: 'text', text: part.text };
        }
        return part;
      });
      return { role: msg.role, content: parts };
    }
    return msg;
  });

  const mistralBody = {
    model:       body.model || 'mistral-small-latest',
    max_tokens:  body.max_tokens || 1024,
    messages:    mistralMessages,
  };

  const res = await fetch(MISTRAL_URL, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + env.MISTRAL_API_KEY,
    },
    body: JSON.stringify(mistralBody),
  });

  const mistralData = await res.json();

  // Konverter Mistral-respons tilbake til Anthropic-format så HTML-en slipper å endre seg
  if (mistralData.choices?.[0]?.message?.content) {
    const converted = {
      content: [{ type: 'text', text: mistralData.choices[0].message.content }],
      model: mistralData.model,
      usage: mistralData.usage,
    };
    return jsonResponse(converted, res.status, origin);
  }

  return jsonResponse(mistralData, res.status, origin);
}

// ── Kartlegging ───────────────────────────────────────────────────────────
async function handleKartlegging(request, env, origin) {
  const payload = await request.json();
  console.log('Kartlegging mottatt:', payload?.enhet?.navn, payload?.kartlegging?.dato);
  return jsonResponse({
    ok: true,
    kartlegging_id: 'stub-' + Date.now(),
    melding: 'Mottatt — database ikke koblet ennå'
  }, 201, origin);
}

// ── Bekreft enhet ─────────────────────────────────────────────────────────
async function handleBekreft(request, env, origin, path) {
  const enhetId = path.split('/')[3];
  console.log('Bekreft enhet:', enhetId);
  return jsonResponse({
    ok: true, enhet_id: enhetId,
    sist_bekreftet: new Date().toISOString(),
    melding: 'Bekreftet — database ikke koblet ennå'
  }, 200, origin);
}

// ── Brukererfaring ────────────────────────────────────────────────────────
async function handleErfaring(request, env, origin, path) {
  const enhetId = path.split('/')[3];
  const body = await request.json();
  console.log('Erfaring mottatt for enhet:', enhetId, '| stemmer:', body?.stemmer_med_info);
  return jsonResponse({
    ok: true, enhet_id: enhetId,
    melding: 'Erfaring mottatt — database ikke koblet ennå'
  }, 201, origin);
}

// ── Hjelpefunksjoner ──────────────────────────────────────────────────────
function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Worker-Token, X-Provider',
    'Access-Control-Max-Age':       '86400',
  };
}

function jsonResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}
