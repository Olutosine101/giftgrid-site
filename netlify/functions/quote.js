const { quote } = require('./_pricing');
const { json } = require('./_util');

exports.handler = async event => {
  if (event.httpMethod !== 'POST') return json(405, { message: 'Use POST' });
  let b = {};
  try { b = JSON.parse(event.body || '{}'); } catch { return json(400, { message: 'Bad request' }); }
  const n = v => (typeof v === 'number' && isFinite(v) ? v : undefined);
  const q = await quote({ lat: n(b.lat), lng: n(b.lng), address: b.address, zone: b.zone });
  return json(200, q);
};
