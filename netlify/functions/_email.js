// Sends email through Resend (resend.com). Set RESEND_API_KEY and FROM_EMAIL.
const { naira } = require('./_util');
const C = require('./_config');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');

async function send({ to, subject, html, replyTo }) {
  if (!process.env.RESEND_API_KEY) { console.log('RESEND_API_KEY not set, skipping email to', to); return; }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: C.FROM_EMAIL, to, subject, html, reply_to: replyTo }),
  });
  if (!r.ok) console.error('Email failed', r.status, await r.text());
}

const row = (k, v) => v ? `<tr><td style="padding:6px 0;color:#6b7563;width:42%">${k}</td><td style="padding:6px 0;color:#16260F">${esc(v)}</td></tr>` : '';
const shell = (title, body) => `<!doctype html><html><body style="margin:0;background:#F4F1E8;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1E8;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0F1E0C;padding:22px 28px;color:#F7EA2C;font-size:20px;font-weight:bold">GiftGrid</td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 14px;font-family:Georgia,serif;font-weight:normal;font-size:26px;color:#16260F">${title}</h1>
${body}
</td></tr>
<tr><td style="padding:18px 28px;background:#F4F1E8;color:#6b7563;font-size:12px">GiftGrid · Lagos · giftgrid.com.ng · WhatsApp +234 808 944 0743 · Questions? Just reply to this email.</td></tr>
</table></td></tr></table></body></html>`;

function details(o, paid, team) {
  return `<table role="presentation" width="100%" style="border-collapse:collapse;font-size:14px;margin:8px 0 18px">
${row('Order', o.order_id)}${row('Box', o.box_name)}${row('Recipient', `${o.recipient_name} · ${o.recipient_phone}`)}
${row('Address', [o.address, o.address_extra].filter(Boolean).join(', '))}${row('Delivery', `${o.date}, ${o.slot}`)}
${row('Backup contact', o.backup_contact)}${team ? row('Rider', o.chowdeck) : ''}${row('Card message', o.card_message)}${row('Instructions', o.instructions)}${team ? row('Heard about us', [o.heard_from, o.utm].filter(Boolean).join(' · ')) : ''}
${row('Box price', naira(o.box_price))}${row('Delivery fee', naira(o.delivery_fee) + (o.delivery_label ? ` (${o.delivery_label})` : ''))}
<tr><td style="padding:10px 0 0;font-weight:bold;color:#16260F">Total paid</td><td style="padding:10px 0 0;font-weight:bold;color:#16260F">${naira(paid)}</td></tr></table>`;
}

async function customerReceipt(o, paid) {
  await send({
    to: o.buyer_email,
    subject: `Your GiftGrid order ${o.order_id} is confirmed`,
    replyTo: C.REPLY_TO,
    html: shell('Thank you, your gift is booked.', `<p style="color:#3d4736;font-size:15px;line-height:1.5;margin:0 0 6px">Hi ${esc(o.buyer_name.split(' ')[0])}, we have received your payment. We will pack your box by hand and you will get a message when it leaves.</p>${details(o, paid)}`),
  });
}
async function teamAlert(o, paid) {
  const map = o.lat ? `<p><a href="https://www.google.com/maps?q=${o.lat},${o.lng}">Open the drop-off in Google Maps</a></p>` : '';
  await send({
    to: C.ORDER_NOTIFY_EMAIL,
    subject: `New order ${o.order_id}: ${o.box_name} for ${o.date}`,
    replyTo: o.buyer_email,
    html: shell('New paid order', `<p style="color:#3d4736;font-size:15px;margin:0 0 6px">From ${esc(o.buyer_name)} · ${esc(o.buyer_phone)} · ${esc(o.buyer_email)}</p>${details(o, paid, true)}${map}`),
  });
}
module.exports = { customerReceipt, teamAlert };
