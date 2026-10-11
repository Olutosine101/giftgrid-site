// Chowdeck Relay (https://chowdeck.readme.io/reference/getting-started-with-relay)
// Set CHOWDECK_API_KEY in Netlify (test or live key from https://dashboard.chowdeck.com/settings/developers).
// Amounts from Chowdeck are in kobo.
const C = require('./_config');
const BASE = 'https://api.chowdeck.com';
const enabled = () => !!process.env.CHOWDECK_API_KEY;

async function call(path, body, timeoutMs = 7000) {
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(BASE + path, {
      method: 'POST', signal: ctrl.signal,
      headers: { Authorization: `Bearer ${String(process.env.CHOWDECK_API_KEY).trim().replace(/^bearer\s+/i, '')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.status === 'failed') throw new Error(j.message || `Chowdeck error ${r.status}`);
    return j.data;
  } finally { clearTimeout(t); }
}

// Live delivery fee from the hub to a pin. Returns { fee (₦, rounded up to ₦100, plus markup), feeId, raw }.
async function fee({ from, to, toAddress }) {
  const d = await call('/relay/delivery/fee', {
    source_address: { latitude: from.lat, longitude: from.lng },
    destination_address: { latitude: to.lat, longitude: to.lng },
    source_address_string: C.HUB_ADDRESS,
    destination_address_string: toAddress || '',
  });
  const naira = Number(d.total_amount) / 100;
  if (!isFinite(naira) || naira <= 0) throw new Error('Chowdeck returned no fee');
  const markup = Number(process.env.DELIVERY_MARKUP || 0);
  return { fee: Math.ceil((naira + markup) / 100) * 100, feeId: d.id, chowdeckAmount: naira, hours: d.available_delivery_hours || null };
}

// 11-digit local format Chowdeck expects, e.g. 08031234567
const localPhone = p => { const d = String(p || '').replace(/\D/g, ''); return d.startsWith('234') ? '0' + d.slice(3) : d; };

// "9:00 a.m.–12:00 p.m." / "7:30–8:30 a.m." on 2026-10-14 -> ISO times in Lagos (+01:00)
function windowFor(date, slot) {
  const parts = String(slot || '').replace(/\./g, '').split(/[–-]/).map(s => s.trim());
  if (parts.length !== 2) return null;
  const endMer = /pm/i.test(parts[1]) ? 'pm' : /am/i.test(parts[1]) ? 'am' : null;
  const to24 = (s, fallbackMer) => {
    const m = s.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i); if (!m) return null;
    let h = +m[1]; const min = m[2] || '00'; const mer = (m[3] || fallbackMer || '').toLowerCase();
    if (mer === 'pm' && h < 12) h += 12; if (mer === 'am' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${min}:00+01:00`;
  };
  const a = to24(parts[0], endMer), b = to24(parts[1]);
  return a && b ? { earliest: `${date}T${a}`, latest: `${date}T${b}` } : null;
}

// Book a scheduled delivery for a paid order (used by the Paystack webhook when CHOWDECK_AUTO_BOOK=true).
async function book(o, from) {
  const q = await fee({ from, to: { lat: o.lat, lng: o.lng }, toAddress: o.address });   // fresh fee id
  const w = windowFor(o.date, o.slot);
  return call('/relay/delivery', {
    fee_id: q.feeId,
    item_type: 'Gift box',
    user_action: 'sending',
    reference: o.order_id,
    source_contact: { name: 'GiftGrid', phone: localPhone(C.WHATSAPP), country_code: 'NG', email: C.REPLY_TO },
    destination_contact: { name: o.recipient_name, phone: localPhone(o.recipient_phone), country_code: 'NG' },
    customer_delivery_note: [o.address, o.address_extra, o.backup_contact && 'Backup: ' + o.backup_contact, o.instructions].filter(Boolean).join(' · ').slice(0, 300),
    ...(w ? { delivery_date: o.date, earliest_delivery_time: w.earliest, latest_delivery_time: w.latest } : {}),
  });
}

module.exports = { enabled, fee, book, windowFor, localPhone };
