// Validates the order, recomputes the price on the server, and starts a Paystack transaction.
const catalog = require('./_catalog');
const { quote } = require('./_pricing');
const { json, clean, phoneOk, paystack } = require('./_util');

exports.handler = async event => {
  if (event.httpMethod !== 'POST') return json(405, { message: 'Use POST' });
  if (!require('./_config').PAYSTACK_SECRET_KEY) return json(500, { message: 'Payments are not configured yet. Please chat with us to order.' });
  let b;
  try { b = JSON.parse(event.body || '{}'); } catch { return json(400, { message: 'Bad request' }); }

  const box = catalog[b.box];
  if (!box) return json(400, { message: 'That box is not available online. Please chat with us.' });
  const email = clean(b.buyer_email, 120);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(400, { message: 'Please enter a valid email.' });
  if (!clean(b.buyer_name) || !phoneOk(b.buyer_phone) || !clean(b.recipient_name) || !phoneOk(b.recipient_phone))
    return json(400, { message: 'Please check the names and phone numbers.' });
  if (!clean(b.address)) return json(400, { message: 'Please add the delivery address.' });

  // date rule: order by 9:00 a.m. (Lagos) the day before
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
  const min = new Date(now); min.setDate(min.getDate() + (now.getHours() < 9 ? 1 : 2)); min.setHours(0, 0, 0, 0);
  const day = new Date(String(b.date) + 'T00:00');
  if (isNaN(day) || day < min) return json(400, { message: 'Please pick a later delivery date. Orders close at 9:00 a.m. the day before.' });

  const lat = typeof b.lat === 'number' ? b.lat : undefined, lng = typeof b.lng === 'number' ? b.lng : undefined;
  const q = await quote({ lat, lng, address: b.address, zone: b.zone });
  if (!q.ok) return json(400, { message: q.message || 'We cannot deliver to that address online. Please chat with us.' });

  const total = box.price + q.fee;
  const orderId = 'GG-' + Date.now().toString(36).toUpperCase().slice(-6);
  const order = {
    order_id: orderId, box_id: b.box, box_name: box.name, box_price: box.price, delivery_fee: q.fee, delivery_provider: q.provider, delivery_label: q.label || '', quote_ref: q.ref || null,
    buyer_name: clean(b.buyer_name), buyer_phone: clean(b.buyer_phone, 20), buyer_email: email,
    recipient_name: clean(b.recipient_name), recipient_phone: clean(b.recipient_phone, 20),
    address: clean(b.address), address_extra: clean(b.address_extra), lat: lat ?? null, lng: lng ?? null, zone: clean(b.zone, 60),
    date: clean(b.date, 10), slot: clean(b.slot, 40), backup_contact: clean(b.backup_contact, 20),
    card_message: clean(b.card_message, 280), instructions: clean(b.instructions, 280),
  };

  try {
    const data = await paystack('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email, amount: total * 100, currency: 'NGN', reference: orderId,
        callback_url: require('./_config').SITE_URL + '/?order=' + orderId,
        metadata: {
          order,
          custom_fields: [
            { display_name: 'Box', variable_name: 'box', value: box.name },
            { display_name: 'Recipient', variable_name: 'recipient', value: `${order.recipient_name} (${order.recipient_phone})` },
            { display_name: 'Delivery', variable_name: 'delivery', value: `${order.date} ${order.slot}` },
            { display_name: 'Address', variable_name: 'address', value: order.address },
          ],
        },
      }),
    });
    return json(200, { access_code: data.access_code, reference: data.reference, order_id: orderId, total });
  } catch (e) {
    console.error('paystack initialize failed:', e.message);
    return json(502, { message: `Paystack could not start the payment (${e.message}). Please try again or chat with us.` });
  }
};
