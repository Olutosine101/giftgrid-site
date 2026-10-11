// Delivery pricing. A live Chowdeck Relay quote is used when CHOWDECK_API_KEY is set;
// otherwise a distance estimate from the hub (or the area fee) is used.
const num = (v, d) => (v === undefined || v === '' ? d : Number(v));

const C = require('./_config');
const geo = require('./_geo');
// Dispatch hub: exact pin from HUB_LAT/HUB_LNG if set, otherwise HUB_ADDRESS is looked up once and cached.
const FALLBACK_HUB = { lat: 6.6018, lng: 3.3515 }; // Ikeja, used only if the lookup fails
let HUB = C.HUB_LAT && C.HUB_LNG ? { lat: Number(C.HUB_LAT), lng: Number(C.HUB_LNG) } : null;
async function hub() {
  if (HUB) return HUB;
  try { HUB = await geo.geocode(C.HUB_ADDRESS); } catch (e) { console.error('hub lookup', e.message); }
  if (!HUB) return FALLBACK_HUB;   // don't cache a failure
  console.log('hub', C.HUB_ADDRESS, HUB);
  return HUB;
}
const P = {
  base: num(process.env.DELIVERY_BASE, 2000),     // covers the first baseKm
  baseKm: num(process.env.DELIVERY_BASE_KM, 5),
  perKm: num(process.env.DELIVERY_PER_KM, 250),
  max: num(process.env.DELIVERY_MAX, 12000),
  maxKm: num(process.env.DELIVERY_MAX_KM, 45),
};
const AREAS = require('./_areas.json');
const ZONES = {
  mainland: { name: 'Mainland', fee: 3000 },
  island: { name: 'Island', fee: 4500 },
  lekki: { name: 'Lekki to Ajah', fee: 6000 },
  outer: { name: 'Outer Lagos', fee: 8000 },
};
// rough Lagos State bounds
const inLagos = (lat, lng) => lat > 6.35 && lat < 6.75 && lng > 2.7 && lng < 4.1;

function estimate(lat, lng, HUB) {
  const R = 6371, t = x => (x * Math.PI) / 180;
  const a = Math.sin(t(lat - HUB.lat) / 2) ** 2 + Math.cos(t(HUB.lat)) * Math.cos(t(lat)) * Math.sin(t(lng - HUB.lng) / 2) ** 2;
  const km = 2 * R * Math.asin(Math.sqrt(a)) * 1.35; // straight line x road factor
  if (!inLagos(lat, lng) || km > P.maxKm) return { ok: false, km, message: 'That address is outside our Lagos delivery area. Chat with us and we will arrange it.' };
  const fee = Math.ceil(Math.min(P.max, P.base + Math.max(0, km - P.baseKm) * P.perKm) / 100) * 100;
  return { ok: true, km, fee, label: `${Math.round(km)} km`, provider: 'estimate' };
}

// Chowdeck Relay: fill in once you have API access (docs: chowdeck.readme.io/reference/getting-started-with-relay).
// Return { ok, fee, label, ref } or null to fall back to the estimate.
async function chowdeckQuote({ lat, lng, address }, HUB) {
  const key = process.env.CHOWDECK_API_KEY;
  const url = process.env.CHOWDECK_QUOTE_URL; // the fee/quote endpoint from your Relay docs
  if (!key || !url) return null;
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // TODO: rename fields to match the Relay quote endpoint
        pickup: { latitude: HUB.lat, longitude: HUB.lng, address: C.HUB_ADDRESS },
        dropoff: { latitude: lat, longitude: lng, address },
      }),
    });
    if (!r.ok) return null;
    const j = await r.json();
    // TODO: map the response fields (amount may be in kobo)
    const fee = Number(j?.data?.fee ?? j?.data?.amount ?? j?.fee);
    if (!fee) return null;
    return { ok: true, fee: Math.ceil(fee), label: 'Chowdeck', ref: j?.data?.id || j?.data?.reference || null, provider: 'chowdeck' };
  } catch (e) {
    return null;
  }
}

async function quote({ lat, lng, address, zone }) {
  if (typeof lat === 'number' && typeof lng === 'number') {
    const h = await hub();
    if (!inLagos(lat, lng)) return estimate(lat, lng, h);
    return (await chowdeckQuote({ lat, lng, address }, h)) || estimate(lat, lng, h);
  }
  const area = zone && AREAS.find(a => a.id === zone);
  if (area) return { ok: true, fee: area.fee, label: area.name, provider: 'area' };
  if (zone && ZONES[zone]) return { ok: true, fee: ZONES[zone].fee, label: ZONES[zone].name, provider: 'zone' };
  return { ok: false, message: 'Add the delivery address so we can work out the delivery fee.' };
}

module.exports = { quote, ZONES, AREAS, hub };
