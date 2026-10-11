// Address suggestions for checkout. Keys stay on the server.
// GET /api/places?q=7b aderemi&s=<session>  -> { provider, suggestions: [{ id, main, sub, address?, lat?, lng? }] }
// GET /api/places?id=<placeId>&s=<session>  -> { address, lat, lng }   (Google only; Geoapify returns the pin with each suggestion)
const { json } = require('./_util');
const geo = require('./_geo');
const { hub } = require('./_pricing');

exports.handler = async event => {
  const prov = geo.provider();
  if (!prov) return json(503, { message: 'Address search is not set up yet.' });
  const p = event.queryStringParameters || {};
  const session = String(p.s || '').replace(/[^\w-]/g, '').slice(0, 64) || undefined;
  try {
    if (p.id) {
      if (prov !== 'google') return json(400, { message: 'Bad request' });
      return json(200, await geo.googleDetails(String(p.id).replace(/[^\w-]/g, ''), session));
    }
    const q = String(p.q || '').trim().slice(0, 120);
    if (q.length < 3) return json(200, { provider: prov, suggestions: [] });
    const suggestions = prov === 'geoapify' ? await geo.geoapifySearch(q, await hub()) : await geo.googleSearch(q, session);
    return json(200, { provider: prov, suggestions });
  } catch (e) {
    console.error('places', e.message);
    return json(502, { message: 'Address search is unavailable right now.' });
  }
};
