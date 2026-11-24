// Cloudflare Pages adapter: runs the existing handlers in netlify/functions unchanged.
// /api/<name> -> netlify/functions/<name>.js (same URLs the site already uses).
const HANDLERS = {
  checkout: () => import('../../netlify/functions/checkout.js'),
  health: () => import('../../netlify/functions/health.js'),
  'paystack-webhook': () => import('../../netlify/functions/paystack-webhook.js'),
  places: () => import('../../netlify/functions/places.js'),
  quote: () => import('../../netlify/functions/quote.js'),
  verify: () => import('../../netlify/functions/verify.js'),
};

export async function onRequest({ request, env, params }) {
  const name = [].concat(params.path || [])[0];
  const load = HANDLERS[name];
  if (!load) return new Response(JSON.stringify({ message: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

  // Settings/secrets from Cloudflare -> process.env, before any handler module is loaded.
  for (const [k, v] of Object.entries(env)) if (typeof v === 'string') process.env[k] = v;

  const url = new URL(request.url);
  const headers = Object.fromEntries([...request.headers].map(([k, v]) => [k.toLowerCase(), v]));
  const ip = headers['cf-connecting-ip'];
  if (ip) headers['x-nf-client-connection-ip'] = ip;
  const event = {
    httpMethod: request.method,
    path: url.pathname,
    rawUrl: request.url,
    headers,
    queryStringParameters: Object.fromEntries(url.searchParams),
    body: ['GET', 'HEAD'].includes(request.method) ? null : await request.text(),
    isBase64Encoded: false,
  };

  try {
    const mod = await load();
    const handler = mod.handler || (mod.default && mod.default.handler);
    const r = (await handler(event, {})) || {};
    return new Response(r.body ?? '', { status: r.statusCode || 200, headers: r.headers || {} });
  } catch (e) {
    console.error(name, 'crashed:', e && e.stack || e);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
