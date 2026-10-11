const json = (status, body) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});
const naira = n => '₦' + Math.round(n).toLocaleString('en-NG');
const clean = (v, max = 300) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max);
const phoneOk = v => /^(\+?234|0)[789][01]\d{8}$/.test(String(v || '').replace(/[\s-]/g, ''));
const paystack = async (path, opts = {}) => {
  const r = await fetch('https://api.paystack.co' + path, {
    ...opts,
    headers: { Authorization: `Bearer ${require('./_config').PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.status === false) throw new Error(j.message || 'Paystack request failed');
  return j.data;
};
module.exports = { json, naira, clean, phoneOk, paystack };
