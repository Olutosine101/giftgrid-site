// Meta Conversions API: sends a server-side Purchase for every paid order, so Meta ads can measure sales
// even when the browser pixel is blocked. Set META_PIXEL_ID and META_CAPI_TOKEN in Netlify to switch it on.
// Token: Events Manager -> your pixel -> Settings -> Conversions API -> Generate access token.
const crypto = require('crypto');
const C = require('./_config');
const sha = v => v ? crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex') : undefined;
const phone = p => { let d = String(p || '').replace(/\D/g, ''); if (d.startsWith('0')) d = '234' + d.slice(1); return d; };

async function purchase(o, paid) {
  const pixel = process.env.META_PIXEL_ID, token = process.env.META_CAPI_TOKEN;
  if (!pixel || !token) return null;
  const [first, ...rest] = String(o.buyer_name || '').trim().split(/\s+/);
  const user_data = {
    em: [sha(o.buyer_email)], ph: [sha(phone(o.buyer_phone))], fn: [sha(first)], ln: rest.length ? [sha(rest.join(' '))] : undefined,
    ct: [sha('lagos')], country: [sha('ng')],
    client_ip_address: o.ip || undefined, client_user_agent: o.ua || undefined, fbp: o.fbp || undefined, fbc: o.fbc || undefined,
  };
  const body = {
    data: [{
      event_name: 'Purchase', event_time: Math.floor(Date.now() / 1000), event_id: o.order_id,   // same id as the browser pixel, so Meta counts it once
      action_source: 'website', event_source_url: C.SITE_URL + '/', user_data,
      custom_data: { currency: 'NGN', value: paid, content_ids: Array.isArray(o.items) ? o.items.map(i => i.id) : [o.box_id], contents: Array.isArray(o.items) ? o.items.map(i => ({ id: i.id, quantity: i.qty, item_price: i.price })) : undefined, num_items: Array.isArray(o.items) ? o.items.reduce((t, i) => t + i.qty, 0) : 1, content_type: 'product', order_id: o.order_id },
    }],
    ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
  };
  const r = await fetch(`https://graph.facebook.com/v21.0/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error?.message || `Meta CAPI ${r.status}`);
  return j;
}
module.exports = { purchase };
