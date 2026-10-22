// Paystack calls this on every payment event. Set this URL in Paystack:
//   Settings > API Keys & Webhooks > Webhook URL = https://YOUR-SITE/api/paystack-webhook
const crypto = require('crypto');
const catalog = require('./_catalog');
const { customerReceipt, teamAlert } = require('./_email');
const chowdeck = require('./_chowdeck');
const meta = require('./_meta');
const { hub } = require('./_pricing');

exports.handler = async event => {
  const sig = event.headers['x-paystack-signature'];
  const raw = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body || '';
  const expected = crypto.createHmac('sha512', require('./_config').PAYSTACK_SECRET_KEY || '').update(raw).digest('hex');
  if (!sig || sig !== expected) return { statusCode: 401, body: 'bad signature' };

  let evt;
  try { evt = JSON.parse(raw); } catch { return { statusCode: 400, body: 'bad json' }; }
  if (evt.event !== 'charge.success') return { statusCode: 200, body: 'ignored' };

  const d = evt.data || {};
  const o = d.metadata && d.metadata.order;
  if (!o) return { statusCode: 200, body: 'no order' };
  const paid = d.amount / 100;
  const box = catalog[o.box_id];
  if (!box || paid < box.price + Number(o.delivery_fee || 0)) { console.error('Amount mismatch', o.order_id, paid); return { statusCode: 200, body: 'flagged' }; }

  // Optional: book the Chowdeck rider automatically (set CHOWDECK_AUTO_BOOK=true in Netlify)
  if (process.env.CHOWDECK_AUTO_BOOK === 'true' && chowdeck.enabled() && o.lat != null) {
    try { const d = await chowdeck.book(o, await hub()); o.chowdeck = `Booked on Chowdeck (ref ${d.reference}, status ${d.status})`; }
    catch (e) { console.error('chowdeck booking failed:', e.message); o.chowdeck = `NOT booked on Chowdeck: ${e.message}. Please book it manually.`; }
  }
  await Promise.all([
    customerReceipt(o, paid), teamAlert(o, paid),
    meta.purchase(o, paid).catch(e => console.error('meta capi failed:', e.message)),
  ]);
  return { statusCode: 200, body: 'ok' };
};
