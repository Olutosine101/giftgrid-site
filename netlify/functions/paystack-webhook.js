// Paystack calls this on every payment event. Set this URL in Paystack:
//   Settings > API Keys & Webhooks > Webhook URL = https://YOUR-SITE/api/paystack-webhook
const crypto = require('crypto');
const catalog = require('./_catalog');
const { customerReceipt, teamAlert } = require('./_email');

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

  // TODO (optional): book the Chowdeck Relay delivery here using o.quote_ref, and save the order to a sheet/DB.
  await Promise.all([customerReceipt(o, paid), teamAlert(o, paid)]);
  return { statusCode: 200, body: 'ok' };
};
