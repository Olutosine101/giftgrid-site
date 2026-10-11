// Called by the page after Paystack reports success, to show the confirmed amount.
const { json, paystack } = require('./_util');

exports.handler = async event => {
  const ref = (event.queryStringParameters || {}).reference;
  if (!ref) return json(400, { message: 'Missing reference' });
  try {
    const d = await paystack('/transaction/verify/' + encodeURIComponent(ref));
    return json(200, { status: d.status, amount: d.amount / 100, order_id: d.reference });
  } catch (e) {
    return json(502, { message: 'Could not verify yet' });
  }
};
