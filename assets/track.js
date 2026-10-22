/* GiftGrid analytics: Google Analytics 4 + Meta Pixel.
   Paste your two IDs below. Both are public IDs, safe to keep in this file.
   - GA4 Measurement ID:  https://analytics.google.com  -> Admin -> Data streams -> your web stream  (looks like G-XXXXXXXXXX)
   - Meta Pixel ID:       https://business.facebook.com/events_manager  -> your dataset/pixel  (a 15-16 digit number)
   Leave an ID empty to switch that tool off. */
window.GG_ANALYTICS = { ga4: 'G-0399B8N0YM', metaPixel: '' };

(function () {
  var c = window.GG_ANALYTICS || {};
  if (c.ga4) {
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(c.ga4);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', c.ga4);
  }
  if (c.metaPixel) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', c.metaPixel); fbq('track', 'PageView');
  }

  var cookie = function (n) { var m = document.cookie.match('(?:^|; )' + n + '=([^;]*)'); return m ? decodeURIComponent(m[1]) : ''; };
  var ga = function (name, p) { try { window.gtag && gtag('event', name, p); } catch (e) {} };
  var fb = function (name, p, id, custom) { try { window.fbq && fbq(custom ? 'trackCustom' : 'track', name, p, id ? { eventID: id } : undefined); } catch (e) {} };
  var item = function (b) { return { item_id: b.slug, item_name: b.name, item_category: b.cat, price: b.price, quantity: 1 }; };

  // One place for every conversion event, so GA4 and Meta always agree.
  window.ggTrack = {
    view: function (b) { ga('view_item', { currency: 'NGN', value: b.price, items: [item(b)] }); fb('ViewContent', { content_ids: [b.slug], content_name: b.name, content_type: 'product', value: b.price, currency: 'NGN' }); },
    checkout: function (b) { ga('begin_checkout', { currency: 'NGN', value: b.price, items: [item(b)] }); fb('InitiateCheckout', { content_ids: [b.slug], content_type: 'product', value: b.price, currency: 'NGN', num_items: 1 }); },
    pay: function (b, total) { ga('add_payment_info', { currency: 'NGN', value: total, items: [item(b)] }); fb('AddPaymentInfo', { content_ids: [b.slug], value: total, currency: 'NGN' }); },
    purchase: function (b, total, orderId) { ga('purchase', { transaction_id: orderId, currency: 'NGN', value: total, items: [item(b)] }); fb('Purchase', { content_ids: [b.slug], content_type: 'product', value: total, currency: 'NGN' }, orderId); },
    lead: function (kind) { ga('generate_lead', { lead_source: kind }); fb('Lead', { content_name: kind }); },
    contact: function (where) { ga('contact', { method: 'whatsapp', location: where }); fb('Contact', { content_name: where }); },
    ids: function () { return { fbp: cookie('_fbp'), fbc: cookie('_fbc') || (/[?&]fbclid=([^&]+)/.test(location.search) ? 'fb.1.' + Date.now() + '.' + RegExp.$1 : '') }; },
  };

  // WhatsApp clicks anywhere on the site count as a Contact.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (a) window.ggTrack.contact(location.pathname);
  }, true);

  // Remember how the visitor arrived (UTM tags), so the order email can say where the sale came from.
  try {
    var q = new URLSearchParams(location.search);
    if (q.get('utm_source')) sessionStorage.setItem('gg_utm', [q.get('utm_source'), q.get('utm_medium'), q.get('utm_campaign')].filter(Boolean).join(' / '));
  } catch (e) {}
})();
