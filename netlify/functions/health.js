// GET /api/health -> quick setup check (shows which services are configured, never the keys themselves)
const C = require('./_config');
const { json } = require('./_util');
const geo = require('./_geo');
exports.handler = async () => json(200, {
  functions: 'running',
  node: process.version,
  paystack: C.PAYSTACK_SECRET_KEY ? (C.PAYSTACK_SECRET_KEY.startsWith('sk_live_') ? 'live key' : C.PAYSTACK_SECRET_KEY.startsWith('sk_test_') ? 'test key' : 'unrecognised key') : 'missing',
  emails: process.env.RESEND_API_KEY ? 'resend key set' : 'RESEND_API_KEY missing',
  address_search: geo.provider() || 'area list',
  delivery_fees: process.env.CHOWDECK_API_KEY ? 'chowdeck live' + (process.env.CHOWDECK_AUTO_BOOK === 'true' ? ' + auto-booking' : '') : 'area list',
  hub: (C.HUB_LAT && C.HUB_LNG) ? 'pin set' : 'HUB_LAT/HUB_LNG not set (using Ikeja)',
  site_url: C.SITE_URL,
});
