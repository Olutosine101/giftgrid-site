// Address search providers. Geoapify (free, no card) is used when GEOAPIFY_API_KEY is set;
// Google Places (New) takes over when GOOGLE_MAPS_API_KEY is set in Netlify.
const C = require('./_config');
const LAGOS = { w: 2.7, s: 6.35, e: 4.1, n: 6.75 };
const provider = () => (process.env.GOOGLE_MAPS_API_KEY ? 'google' : C.GEOAPIFY_API_KEY ? 'geoapify' : null);

async function geoapifySearch(text, near) {
  const u = new URL('https://api.geoapify.com/v1/geocode/autocomplete');
  u.searchParams.set('text', text);
  u.searchParams.set('filter', `rect:${LAGOS.w},${LAGOS.s},${LAGOS.e},${LAGOS.n}`);
  if (near) u.searchParams.set('bias', `proximity:${near.lng},${near.lat}`);
  u.searchParams.set('format', 'json'); u.searchParams.set('limit', '5'); u.searchParams.set('lang', 'en');
  u.searchParams.set('apiKey', C.GEOAPIFY_API_KEY);
  const r = await fetch(u); const j = await r.json();
  if (!r.ok) throw new Error(j.message || 'Address search failed');
  const list = j.results || (j.features || []).map(f => f.properties);
  return list.filter(x => x && x.lat != null).map(x => ({
    id: 'geo', main: x.address_line1 || x.formatted, sub: x.address_line2 || '', address: x.formatted, lat: x.lat, lng: x.lon,
  }));
}

const gHeaders = extra => ({ 'Content-Type': 'application/json', 'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY, ...extra });
async function googleSearch(text, session) {
  const r = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST', headers: gHeaders(),
    body: JSON.stringify({ input: text, includedRegionCodes: ['ng'], sessionToken: session, languageCode: 'en',
      locationRestriction: { rectangle: { low: { latitude: LAGOS.s, longitude: LAGOS.w }, high: { latitude: LAGOS.n, longitude: LAGOS.e } } } }),
  });
  const j = await r.json(); if (!r.ok) throw new Error(j.error?.message || 'Address search failed');
  return (j.suggestions || []).filter(s => s.placePrediction).slice(0, 5).map(({ placePrediction: s }) => ({
    id: s.placeId, main: s.structuredFormat?.mainText?.text || s.text?.text, sub: s.structuredFormat?.secondaryText?.text || '',
  }));
}
async function googleDetails(id, session) {
  const r = await fetch(`https://places.googleapis.com/v1/places/${id}${session ? '?sessionToken=' + session : ''}`, {
    headers: gHeaders({ 'X-Goog-FieldMask': 'formattedAddress,location' }),
  });
  const j = await r.json(); if (!r.ok) throw new Error(j.error?.message || 'Could not load that address');
  return { address: j.formattedAddress, lat: j.location.latitude, lng: j.location.longitude };
}

// one-off lookup of an address to a pin (used for the dispatch hub)
async function geocode(text) {
  const p = provider();
  if (p === 'geoapify') { const [x] = await geoapifySearch(text); return x ? { lat: x.lat, lng: x.lng } : null; }
  if (p === 'google') { const [x] = await googleSearch(text); return x ? googleDetails(x.id) : null; }
  return null;
}
module.exports = { provider, geoapifySearch, googleSearch, googleDetails, geocode };
