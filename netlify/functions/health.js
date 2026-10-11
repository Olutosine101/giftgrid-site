// GET /api/health -> quick setup check (shows which services are configured, never the keys themselves)
const C = require('./_config');
const { json } = require('./_util');
const geo = require('./_geo');
const chowdeck = require('./_chowdeck');
const { hub } = require('./_pricing');

exports.handler = async () => {
  let delivery = 'area list (no CHOWDECK_API_KEY)';
  if (chowdeck.enabled()) {
    try {   // live test: dispatch point -> Ikeja GRA
      const q = await chowdeck.fee({ from: await hub(), to: { lat: 6.583, lng: 3.357 }, toAddress: 'Ikeja GRA, Lagos' });
      delivery = `chowdeck OK (test quote to Ikeja GRA: ₦${q.fee})` + (process.env.CHOWDECK_AUTO_BOOK === 'true' ? ' + auto-booking' : '');
    } catch (e) { delivery = `chowdeck ERROR: ${e.message}`; }
  }
  const k = process.env.CHOWDECK_API_KEY || '';
  return json(200, {
    functions: 'running',
    paystack: C.PAYSTACK_SECRET_KEY ? (C.PAYSTACK_SECRET_KEY.startsWith('sk_live_') ? 'live key' : C.PAYSTACK_SECRET_KEY.startsWith('sk_test_') ? 'test key' : 'unrecognised key') : 'missing',
    emails: process.env.RESEND_API_KEY ? 'resend key set' : 'RESEND_API_KEY missing',
    delivery_fees: delivery,
    chowdeck_key_hint: k ? `${k.slice(0, 6)}… (${k.length} chars${/^bearer /i.test(k) ? ', remove the word Bearer' : ''}${/\s/.test(k.trim()) || k !== k.trim() ? ', has spaces' : ''})` : 'not set',
    hub: `${C.HUB_LAT}, ${C.HUB_LNG}`,
    address_search: geo.provider() || 'area list',
    site_url: C.SITE_URL,
  });
};
