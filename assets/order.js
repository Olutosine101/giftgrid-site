/* GiftGrid ordering: box pop-up, checkout (Paystack) and box picker.
   One file used by the homepage and every other page, so ordering works the same everywhere.
   Edit boxes, prices, delivery areas and rules here. */
(function () {
if (window.GGOrder) return;
const IMG = new URL('../img/', (document.currentScript && document.currentScript.src) || location.href).href;
/* Collection: boxes from the business plan, contents sourced in Nigeria */
const COLLECTION = [
  { cat: 'Breakfast', name: 'The Continental Royalty', price: '₦48,000', img: 'continental-royalty', cut: 'pkgc-continental-royalty', pack: 'Clear-lid gift box',
    items: 'Belgian waffles, mini pancakes with syrup, scrambled eggs, chicken franks, club sandwich, red apples, green grapes, fresh orange juice' },
  { cat: 'Breakfast', name: 'Pancake Tower', price: '₦42,000', img: 'pancake-tower', cut: 'pkgc-pancake-tower', pack: 'Clear-lid gift box',
    items: 'Six buttermilk pancakes, strawberries, Nutella, maple syrup and Lotus Biscoff spread cups, turkey bacon, chicken sausages, omelette, iced coffee' },
  { cat: 'Breakfast', name: 'Sweet & Savoury Naija Morning', price: '₦40,000', img: 'naija-morning', cut: 'pkgc-naija-morning', pack: 'Clear-lid gift box',
    items: 'Fried yam, egg sauce, dodo, peppered chicken wings, akara, a bowl of creamy pap (ogi)' },
  { cat: 'Fruit', name: 'Exotic Wellness Crate', price: '₦65,000', img: 'exotic-wellness', cut: 'pkgc-exotic-wellness', pack: 'Woven tray basket',
    items: 'Dragon fruit, kiwi, strawberries, red grapes, green grapes, pomegranate, apples, oranges, a jar of raw Nigerian honey' },
  { cat: 'Fruit', name: 'Harvest Abundance Basket', price: '₦35,000', img: 'harvest-abundance', cut: 'pkgc-harvest-abundance', pack: 'Woven tray basket',
    items: 'Pineapple, pawpaw, oranges, bananas, watermelon, red grapes, apples, a coconut, dates, Chivita juice 1L' },
  { cat: 'Care', name: 'Family Care & Support', price: '₦85,000', img: 'family-care', cut: 'pkgc-family-care', pack: 'Large black cloth bag',
    items: 'Mama Gold rice 5kg, Kings vegetable oil 3L, Golden Penny Semovita 2kg, crate of eggs, stockfish, dried catfish, crayfish, Knorr cubes, Gino tomato paste, a tuber of yam' },
  { cat: 'Corporate', name: 'Staff Appreciation Box', price: '₦38,000', img: 'staff-appreciation', cut: 'pkgc-staff-appreciation', pack: 'Large black cloth bag',
    items: 'Mama Gold rice 2.5kg, Kings vegetable oil 1L, Pringles, Chivita 1L, Knorr cubes, Gino tomato paste, a mini yam' },
  { cat: 'Lifestyle', name: 'Sweet Tooth & Craving', price: '₦40,000', img: 'sweet-tooth', cut: 'pkgc-sweet-tooth', pack: 'Kraft gift box',
    items: 'Ferrero Rocher, Kinder Bueno, peanut M&M’s, Pringles Original, McVitie’s Digestives, glazed doughnuts, chocolate-dipped strawberries, chin-chin, candied cashews' },
  { cat: 'Lifestyle', name: 'Coffee & Tea Connoisseur', price: '₦55,000', img: 'coffee-tea', cut: 'pkgc-coffee-tea', pack: 'Kraft gift box',
    items: 'Nescafé Gold, Nescafé Cappuccino, Coffee-mate, Lipton Yellow Label tea, McVitie’s Hobnobs chocolate chip, TUC crackers, Didian crackers, Hajor date powder' },
  { cat: 'Romance', name: 'Love Language Box', price: '₦75,000', img: 'love-language', cut: 'pkgc-love-language', pack: 'Black gift box',
    items: 'Four Cousins Natural Sweet Red in a jute bag, Ferrero Rocher, chocolate truffles, a scented candle, fresh red roses, a personal message card' },
  { cat: 'Corporate', name: 'Staff Starter Pack', price: '₦34,000', img: 'staff-starter', cut: 'pkgc-staff-starter', pack: 'Non-woven gift bag',
    items: 'Big Bull rice 5kg, Power oil 75cl, Golden Penny spaghetti ×2, Indomie noodles ×5, Gino Tomato Mix, Knorr cubes, Dangote salt, Tiger curry, Ground pepper' },
  { cat: 'Corporate', name: 'Staff Plus Pack', price: '₦69,500', img: 'staff-plus', cut: 'pkgc-staff-plus', pack: 'Black cloth tote',
    items: 'Royal Stallion rice 5kg, King\'s vegetable oil 2L, Golden Penny spaghetti ×3, Indomie noodles ×10, Peak milk 360g, Milo 400g, Golden Penny sugar 1kg, Lipton tea (25 bags), Gino tomato paste, Knorr cubes, Dangote salt, Tiger curry, Ducros thyme, Ground pepper' },
  { cat: 'Corporate', name: 'Staff Gold Hamper', price: '₦103,000', img: 'staff-gold', cut: 'pkgc-staff-gold', pack: 'Large black cloth bag',
    items: 'Royal Stallion rice 10kg, King\'s vegetable oil 3L, Golden Penny spaghetti ×4, Indomie noodles ×20, Peak milk, Milo, Lipton tea, Golden Penny sugar, Gino tomato paste, Knorr cubes ×50, Titus sardines ×2, Chivita 1L, Dangote salt, Tiger curry, Ducros thyme, Ground pepper' },
  { cat: 'Corporate', name: 'Executive Hamper', price: '₦158,500', img: 'executive-hamper', cut: 'pkgc-executive-hamper', pack: 'Wicker hamper basket',
    items: 'Four Cousins Natural Sweet Red (18+), Ferrero Rocher (16 pieces), Nescafé Gold, M&W honey roasted cashews, Pringles ×2, McVitie\'s chocolate digestives, Kadab honey, Royal Stallion rice 5kg, Chivita 1L, Kellogg\'s Corn Flakes 900g, Peak milk tin, Tiger curry, Ducros thyme' },
  { cat: 'Corporate', name: 'Office Snack Crate', price: '₦67,500', img: 'office-snack-crate', cut: 'pkgc-office-snack-crate', pack: 'Wooden crate',
    items: 'Pringles ×3, Coca-Cola cans ×6, Chivita Active ×12, Zifort biscuits ×4, Nadis cashew nuts, McVitie\'s digestives ×4' },
  { cat: 'Christmas', name: 'Christmas Store-Up Hamper', price: '₦207,500', img: 'christmas-store-up', cut: 'pkgc-christmas-store-up', pack: 'Carton and two cloth bags',
    items: 'Royal Stallion rice 25kg, King\'s vegetable oil 5L, Golden Penny Semovita 5kg, Golden Penny spaghetti ×10, Indomie carton (40 packs), Oloyin beans, Garri 5kg, Gino tomato paste ×2, Knorr cubes ×50, Peak milk 800g, Milo 800g, Dangote sugar, Crate of eggs (30), Dangote salt, Tiger curry, Ducros thyme, Ground pepper' },
  { cat: 'Christmas', name: 'Christmas Chicken & Jollof Box', price: '₦78,500', img: 'chicken-jollof', cut: 'pkgc-chicken-jollof', pack: 'Insulated cooler bag with ice packs', group: 'chicken-jollof', variant: 'Whole frozen chicken',
    items: 'Fiesta whole frozen chicken (about 1.8kg), Royal Stallion rice 5kg, King\'s vegetable oil 2L, Gino tomato paste ×2, Gino Party Jollof seasoning ×2, Fresh pepper and tomato pack with onions, Knorr cubes, Dangote salt, Tiger curry, Ducros thyme, Ground pepper, Chivita 1L' },
  { cat: 'Christmas', name: 'Christmas Chicken & Jollof Box', price: '₦78,500', img: 'chicken-jollof-smoked', cut: 'pkgc-chicken-jollof-smoked', pack: 'Insulated cooler bag with ice packs', group: 'chicken-jollof', variant: 'Smoked chicken', hide: true,
    items: 'Chi smoked chicken (about 1kg), Royal Stallion rice 5kg, King\'s vegetable oil 2L, Gino tomato paste ×2, Gino Party Jollof seasoning ×2, Fresh pepper and tomato pack with onions, Knorr cubes, Dangote salt, Tiger curry, Ducros thyme, Ground pepper, Chivita 1L' },
  { cat: 'Festive', name: 'Ramadan & Sallah Iftar Box', price: '₦71,500', img: 'ramadan-iftar', cut: 'pkgc-ramadan-iftar', pack: 'Kraft gift box',
    items: 'Dates, Lipton tea, Peak milk, Golden Penny sugar, Quaker oats, Checkers custard, Tiger nuts, Royal Stallion rice 5kg, King\'s vegetable oil 1L, Chivita 1L, Dangote salt, Tiger curry, Ducros thyme, Ground pepper' },
  { cat: 'Pantry', name: 'Breakfast Provisions Box', price: '₦51,000', img: 'breakfast-provisions', cut: 'pkgc-breakfast-provisions', pack: 'Kraft gift box',
    items: 'Kellogg\'s Corn Flakes 325g, Golden Morn 800g, Quaker oats, Peak milk tin, Milo 400g, Lipton tea, Golden Penny sugar, Chocoh chocolate spread, Chivita 1L' },
  { cat: 'Care', name: 'New Mum Care Box', price: '₦69,500', img: 'new-mum-care', cut: 'pkgc-new-mum-care', pack: 'Kraft gift box',
    items: 'Quaker oats, Golden Morn, Peak milk, Milo, Checkers custard, Kadab honey, Dates, Molfix diapers (size 2), Molfix baby wipes, Dettol, Chivita 1L' },
  { cat: 'Care', name: 'Get Well Recovery Box', price: '₦46,000', img: 'get-well-recovery', cut: 'pkgc-get-well-recovery', pack: 'Rattan tray',
    items: 'Lucozade 1L, Glucose-D, Quaker oats, Honey, Lipton tea, McVitie\'s digestives, Chivita 1L, Fresh fruit' },
  { cat: 'Custom', name: 'Curate a Custom Box', price: 'Your budget', custom: true, pack: 'Any box in the collection',
    items: 'You pick the occasion, budget and items, we source them in Nigeria, pack them beautifully and deliver' },
];
/* ---- ordering settings: fill these in later ---- */
const WHATSAPP_NUMBER = '2348089440743';          // e.g. '2348012345678' (country code, no +)
/* ---- checkout settings: fill these in when deploying ---- */
const CHECKOUT = {
  apiBase: '/api',                    // Netlify Functions (see netlify.toml)
  hub: { lat: 6.5612499, lng: 3.39850563 },  // dispatch point: 1b Saheed Owoyele Street
  // fallback pricing when no live quote is available (keep in sync with netlify/functions/_pricing.js)
  pricing: { base: 2000, baseKm: 5, perKm: 250, max: 12000, maxKm: 45 },
  // Lagos delivery areas and fees (same list as netlify/functions/_areas.json; edit both together)
  areas: [{"id":"ikeja-allen-opebi-toyin","name":"Ikeja (Allen, Opebi, Toyin)","group":"Ikeja & North","fee":3000},{"id":"ikeja-gra","name":"Ikeja GRA","group":"Ikeja & North","fee":2500},{"id":"alausa-agidingbi","name":"Alausa / Agidingbi","group":"Ikeja & North","fee":3500},{"id":"oregun","name":"Oregun","group":"Ikeja & North","fee":3000},{"id":"ogba-oke-ira","name":"Ogba / Oke-Ira","group":"Ikeja & North","fee":4500},{"id":"agege","name":"Agege","group":"Ikeja & North","fee":4500},{"id":"ojodu-berger","name":"Ojodu / Berger","group":"Ikeja & North","fee":4000},{"id":"omole-olowora","name":"Omole / Olowora","group":"Ikeja & North","fee":4000},{"id":"magodo","name":"Magodo","group":"Ikeja & North","fee":3000},{"id":"isheri-olowora","name":"Isheri / Olowora","group":"Ikeja & North","fee":4500},{"id":"ikosi-ketu","name":"Ikosi / Ketu","group":"Ikeja & North","fee":2500},{"id":"ojota-ogudu","name":"Ojota / Ogudu","group":"Ikeja & North","fee":2000},{"id":"maryland-anthony","name":"Maryland / Anthony","group":"Ikeja & North","fee":2000},{"id":"abule-egba-ijaiye","name":"Abule Egba / Ijaiye","group":"Ikeja & North","fee":6000},{"id":"alagbado-iyana-ipaja","name":"Alagbado / Iyana Ipaja","group":"Ikeja & North","fee":6500},{"id":"gbagada","name":"Gbagada","group":"Central Mainland","fee":2000},{"id":"ilupeju-palmgrove","name":"Ilupeju / Palmgrove","group":"Central Mainland","fee":2500},{"id":"shomolu-bariga","name":"Shomolu / Bariga","group":"Central Mainland","fee":2000},{"id":"oshodi","name":"Oshodi","group":"Central Mainland","fee":3000},{"id":"mushin","name":"Mushin","group":"Central Mainland","fee":3500},{"id":"yaba-akoka","name":"Yaba / Akoka","group":"Central Mainland","fee":3000},{"id":"surulere","name":"Surulere","group":"Central Mainland","fee":4000},{"id":"ebute-metta","name":"Ebute Metta","group":"Central Mainland","fee":4000},{"id":"isolo-ajao-estate","name":"Isolo / Ajao Estate","group":"Central Mainland","fee":4000},{"id":"okota","name":"Okota","group":"Central Mainland","fee":5000},{"id":"ikotun-igando","name":"Ikotun / Igando","group":"Central Mainland","fee":6000},{"id":"egbeda-idimu","name":"Egbeda / Idimu","group":"Central Mainland","fee":5500},{"id":"lagos-island-cms-marina","name":"Lagos Island (CMS, Marina)","group":"Island","fee":5000},{"id":"ikoyi","name":"Ikoyi","group":"Island","fee":5500},{"id":"banana-island","name":"Banana Island","group":"Island","fee":5000},{"id":"victoria-island","name":"Victoria Island","group":"Island","fee":6000},{"id":"oniru","name":"Oniru","group":"Island","fee":6000},{"id":"eko-atlantic","name":"Eko Atlantic","group":"Island","fee":6500},{"id":"apapa","name":"Apapa","group":"Island","fee":5500},{"id":"lekki-phase-1","name":"Lekki Phase 1","group":"Lekki & Ajah","fee":6000},{"id":"ikate-elegushi","name":"Ikate / Elegushi","group":"Lekki & Ajah","fee":7000},{"id":"agungi-idado","name":"Agungi / Idado","group":"Lekki & Ajah","fee":7000},{"id":"osapa-london-jakande","name":"Osapa London / Jakande","group":"Lekki & Ajah","fee":8000},{"id":"chevron-ikota","name":"Chevron / Ikota","group":"Lekki & Ajah","fee":8000},{"id":"vgc","name":"VGC","group":"Lekki & Ajah","fee":8500},{"id":"ajah","name":"Ajah","group":"Lekki & Ajah","fee":8500},{"id":"abraham-adesanya-thomas-estate","name":"Abraham Adesanya / Thomas Estate","group":"Lekki & Ajah","fee":9500},{"id":"sangotedo","name":"Sangotedo","group":"Lekki & Ajah","fee":10000},{"id":"awoyaya","name":"Awoyaya","group":"Lekki & Ajah","fee":12500},{"id":"festac-amuwo-odofin","name":"Festac / Amuwo Odofin","group":"Outer Lagos","fee":6500},{"id":"satellite-town","name":"Satellite Town","group":"Outer Lagos","fee":8000},{"id":"ojo","name":"Ojo","group":"Outer Lagos","fee":10500},{"id":"ikorodu","name":"Ikorodu","group":"Outer Lagos","fee":5500},{"id":"ibeju-lekki","name":"Ibeju-Lekki","group":"Outer Lagos","fee":15000},{"id":"epe","name":"Epe","group":"Outer Lagos","fee":15000},{"id":"badagry","name":"Badagry","group":"Outer Lagos","fee":15000}],
};
const DELIVERY = {
  fee: null,                          // e.g. 3500 for a flat fee; null = confirmed on WhatsApp
  rules: [
    'Delivering across Lagos',
    'Order by 12 noon the day before delivery',
    'Breakfast boxes arrive 7:30–11:00 a.m. on the day you choose',
    'Add a second contact or gate security number for the recipient',
  ],
};
document.body.insertAdjacentHTML('beforeend', `<div class="mdl" id="mdl" role="dialog" aria-modal="true" aria-labelledby="mdlTitle" aria-hidden="true">
  <div class="mdl-bg" data-close></div>
  <div class="mdl-card" data-lenis-prevent>
    <button class="mdl-x" type="button" data-close aria-label="Close">×</button>
    <div class="mdl-img" id="mdlImg"></div>
    <div class="mdl-body">
      <button class="co-back" type="button" id="coBackPick" hidden>All boxes</button>
      <span class="mdl-cat" id="mdlCat"></span>
      <h3 id="mdlTitle"></h3>
      <p class="mdl-pack" id="mdlPack"></p><a class="mdl-more" id="mdlMore" href="/boxes/">See full details</a>
      <div class="variant" id="mdlVar" role="radiogroup" aria-label="Choose an option" hidden></div>
      <ul class="mdl-list" id="mdlList"></ul>
      <div class="mdl-sum" id="mdlSum"></div>
      <ul class="mdl-rules" id="mdlRules"></ul>
      <div class="mdl-acts" id="mdlActs">
        <div class="gg-add gg-add-mdl" id="mdlAdd" data-add=""></div>
        <button class="mdl-go" id="mdlBuy" type="button">Buy now</button>
        <a class="mdl-alt" id="mdlChat" href="https://wa.me/2348089440743" target="_blank" rel="noopener">Chat with a human</a>
      </div>
    </div>
    <!-- checkout -->
    <form class="mdl-body co" id="coForm" hidden novalidate>
      <button class="co-back" type="button" id="coBack">Back to cart</button>
      <span class="mdl-cat">Checkout</span>
      <h3 id="coTitle">Send this box</h3>
      <fieldset><legend>Your details</legend>
        <div class="f2">
          <label>Full name<input id="co_name" name="buyer_name" autocomplete="name" required></label>
          <label>Phone<input id="co_phone" name="buyer_phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="0803 000 0000" required></label>
        </div>
        <label>Email <small>for your receipt</small><input id="co_email" name="buyer_email" type="email" autocomplete="email" required></label>
      </fieldset>
      <fieldset><legend>Who is it for?</legend>
        <label class="chk"><input type="checkbox" id="co_self"> It's for me</label>
        <div class="f2" id="coRecip">
          <label>Recipient's name<input id="co_rname" name="recipient_name" required></label>
          <label>Recipient's phone<input id="co_rphone" name="recipient_phone" type="tel" inputmode="tel" required></label>
        </div>
      </fieldset>
      <fieldset><legend>Delivery</legend>
        <label id="coZoneWrap">Area<select id="co_zone" name="zone" required></select></label>
        <div class="co-addr"><label for="co_addr">Street address</label><div class="ac-wrap" id="coAddrWrap"><input id="co_addr" name="address" autocomplete="street-address" placeholder="House number and street, e.g. 7b Aderemi Akeju Street" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="coAc" required><ul class="ac" id="coAc" role="listbox" hidden></ul></div><small class="co-hint" id="coAddrHint" hidden></small></div>
        <label>Apartment, gate, landmark <small>optional</small><input id="co_addr2" name="address_extra" placeholder="Flat 4B, blue gate opposite the pharmacy"></label>
        <div class="f2">
          <label>Delivery date<input id="co_date" name="date" type="date" required></label>
          <label>Time window<select id="co_slot" name="slot" required></select></label>
        </div>
        <label>Backup contact <small>gate security or a second number</small><input id="co_backup" name="backup_contact" type="tel" inputmode="tel"></label>
      </fieldset>
      <fieldset><legend>Make it personal</legend>
        <label>Gift card message <small>optional</small><textarea id="co_note" name="card_message" rows="3" maxlength="280" placeholder="Happy birthday, Mum. Love, Tosin"></textarea></label>
        <label>Anything else we should know? <small>optional</small><textarea id="co_extra" name="instructions" rows="2" maxlength="280" placeholder="Allergies, a surprise, call before arriving..."></textarea></label>
        <label>How did you hear about us? <small>optional</small><select id="co_heard" name="heard_from"><option value="">Choose one</option><option>Instagram</option><option>TikTok</option><option>WhatsApp</option><option>Google search</option><option>A friend or family member</option><option>My company or a colleague</option><option>An influencer</option><option>Facebook</option><option>Other</option></select></label>
      </fieldset>
      <div class="mdl-sum" id="coSum"></div>
      <p class="co-err" id="coErr" role="alert" hidden></p>
      <div class="mdl-acts co-acts">
        <button class="mdl-go" id="coPay" type="submit">Pay</button>
        <span class="co-secure">Secure payment by Paystack</span>
      </div>
    </form>
    <!-- cart -->
    <div class="mdl-body co-cart" id="coCart" hidden>
      <span class="mdl-cat">Your cart</span>
      <h3>Your gifts</h3>
      <div class="cart-list" id="cartList"></div>
      <div class="mdl-sum" id="cartSum"></div>
      <p class="cart-note" id="cartNote">Everything in one order goes to one address. Sending to different people? Place one order per address.</p>
      <div class="mdl-acts" id="cartActs">
        <button class="mdl-go" id="cartGo" type="button">Checkout</button>
        <button class="mdl-alt" type="button" id="cartMore">Keep shopping</button>
      </div>
    </div>
    <!-- pick a box (other pages) -->
    <div class="mdl-body co-pick" id="coPick" hidden>
      <span class="mdl-cat">The collection</span>
      <h3>Choose a gift box</h3>
      <button class="co-back" type="button" id="pickCart" hidden>View cart</button>
      <div class="pick-grid" id="pickGrid"></div>
    </div>
    <!-- done -->
    <div class="mdl-body co-done" id="coDone" hidden>
      <span class="mdl-cat">Order confirmed</span>
      <h3>Thank you! Your gift is booked.</h3>
      <p id="coDoneText"></p>
      <div class="mdl-sum" id="coDoneSum"></div>
      <div class="mdl-acts"><button class="mdl-go" type="button" data-close>Done</button><a class="mdl-alt" id="coDoneChat" href="https://wa.me/2348089440743" target="_blank" rel="noopener">Chat with a human</a></div>
    </div>
  </div>
</div>`);
  const m = document.getElementById('mdl'), $ = id => document.getElementById(id);
  const naira = n => '₦' + Math.round(n).toLocaleString('en-NG');
  const num = p => { const v = parseInt(String(p).replace(/[^0-9]/g, ''), 10); return isNaN(v) ? null : v; };
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const views = { info: document.querySelector('.mdl-body:not(.co):not(.co-done):not(.co-pick):not(.co-cart)'), co: $('coForm'), done: $('coDone'), pick: $('coPick'), cart: $('coCart') };
  const show = v => { const c = m.querySelector('.mdl-card'); Object.entries(views).forEach(([k, el]) => { el.hidden = k !== v; el.scrollTop = 0; }); c.scrollTop = 0; c.dataset.view = v; };
  const wa = msg => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  // analytics (GA4 + Meta Pixel via /assets/track.js); silent when not configured
  const tb = (b, qty) => ({ slug: b.img, name: b.name + (b.variant ? ' (' + b.variant + ')' : ''), cat: b.cat, price: num(b.price), qty: qty || 1 });
  const gg = (ev, value, id, lines) => { try {
    if (!window.ggTrack) return;
    if (ev === 'view' || ev === 'add') { if (!box || box.custom) return; return ev === 'view' ? ggTrack.view(tb(box)) : ggTrack.add && ggTrack.add(tb(box, value)); }
    const list = (lines || Cart.lines()).map(l => tb(l.box, l.qty)); if (!list.length) return;
    ev === 'checkout' ? ggTrack.checkout(list) : ev === 'pay' ? ggTrack.pay(list, value) : ggTrack.purchase(list, value, id);
  } catch (e) {} };
  const PREVIEW = !/^https?:$/.test(location.protocol) || /claude|anthropic|usercontent|localhost|127\.0\.0\.1/.test(location.hostname);
  // WhatsApp links always open outside the page: inside a frame or preview, wa.me can't load in place
  ['mdlChat', 'coDoneChat'].forEach(id => { $(id).target = '_blank'; $(id).rel = 'noopener'; });
  let last = null, box = null, quote = null, mapsReady = null, place = null;
  const bySlug = s => COLLECTION.findIndex(b => b.img === s);

  /* ---------------- cart (saved in this browser) ---------------- */
  const MAXQ = 50;
  const Cart = (() => {
    let lines = [];
    const load = () => { try { lines = (JSON.parse(localStorage.getItem('gg_cart') || '[]') || []).filter(l => l && bySlug(l.slug) > -1 && l.qty > 0).map(l => ({ slug: l.slug, qty: Math.min(MAXQ, l.qty | 0) })); } catch (e) { lines = []; } };
    load();
    const save = () => { try { localStorage.setItem('gg_cart', JSON.stringify(lines)); } catch (e) {} };
    const qty = slug => { const l = lines.find(l => l.slug === slug); return l ? l.qty : 0; };
    const set = (slug, n) => {
      if (bySlug(slug) < 0) return;
      n = Math.max(0, Math.min(MAXQ, n | 0));
      const l = lines.find(l => l.slug === slug);
      if (!n) lines = lines.filter(x => x.slug !== slug); else if (l) l.qty = n; else lines.push({ slug, qty: n });
      save(); render();
    };
    return {
      qty, set, add: (slug, n) => set(slug, qty(slug) + (n || 1)),
      groupQty: g => lines.reduce((t, l) => t + (COLLECTION[bySlug(l.slug)].group === g ? l.qty : 0), 0),
      lines: () => lines.map(l => ({ slug: l.slug, qty: l.qty, box: COLLECTION[bySlug(l.slug)] })),
      count: () => lines.reduce((t, l) => t + l.qty, 0),
      subtotal: () => lines.reduce((t, l) => t + l.qty * num(COLLECTION[bySlug(l.slug)].price), 0),
      clear: () => { lines = []; save(); render(); },
      reload: () => { load(); render(); },
    };
  })();
  const label = b => b.name + (b.variant ? ' · ' + b.variant : '');
  function stepper(el) {
    const slug = el.getAttribute('data-add'), i = bySlug(slug), b = COLLECTION[i];
    if (!b) { el.innerHTML = ''; return; }
    const card = el.classList.contains('gg-add-card');
    if (card && b.group) {   // a box with options: choose in the pop-up
      const n = Cart.groupQty(b.group);
      el.innerHTML = `<button type="button" class="ga-add${n ? ' ga-in' : ''}" data-act="pick">${n ? n + ' in cart · Change' : 'Choose &amp; add'}</button>`;
      return;
    }
    const q = Cart.qty(slug), nm = esc(label(b));
    el.innerHTML = q
      ? `<div class="ga-step" role="group" aria-label="${nm} in cart"><button type="button" data-act="dec" aria-label="Remove one ${nm}">${q === 1 ? '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '−'}</button><output aria-live="polite">${q}</output><button type="button" data-act="inc" aria-label="Add one more ${nm}"${q >= MAXQ ? ' disabled' : ''}>+</button></div>`
      : `<button type="button" class="ga-add" data-act="inc">Add to cart</button>`;
  }
  const BAG = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2L5 8Zm4 0V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
  document.body.insertAdjacentHTML('beforeend', `<button type="button" class="gg-fab" id="ggFab" hidden>${BAG}<span class="gg-fab-n" id="ggFabN">0</span><span class="gg-fab-t" id="ggFabT"></span></button>`);
  function render() {
    document.querySelectorAll('[data-add]').forEach(stepper);
    const n = Cart.count(), fab = $('ggFab');
    fab.hidden = !n; $('ggFabN').textContent = n; $('ggFabT').textContent = n ? naira(Cart.subtotal()) : '';
    fab.setAttribute('aria-label', `View cart: ${n} item${n === 1 ? '' : 's'}, ${naira(Cart.subtotal())}`);
    if (box && !box.custom && m.querySelector('.mdl-card').dataset.view === 'info') {
      const q = Cart.qty(box.img);
      $('mdlBuy').textContent = n ? `Checkout · ${naira(Cart.subtotal())}` : 'Buy now';
    }
    $('pickCart').hidden = !n; $('pickCart').textContent = `View cart (${n})`;
    if (m.querySelector('.mdl-card').dataset.view === 'cart') renderCart();
  }
  function renderCart() {
    const ls = Cart.lines();
    $('cartList').innerHTML = ls.length ? ls.map(l => `<div class="cl">`
      + `<span class="cl-img"><img src="${IMG}${l.box.cut}.webp" alt="" loading="lazy"></span>`
      + `<div class="cl-t"><b>${esc(l.box.name)}</b><small>${l.box.variant ? esc(l.box.variant) + ' · ' : ''}${naira(num(l.box.price))} each</small></div>`
      + `<div class="gg-add gg-add-sm" data-add="${l.slug}"></div><span class="cl-p">${naira(num(l.box.price) * l.qty)}</span></div>`).join('')
      : '<p class="cart-empty">Your cart is empty. Add a gift box to get started.</p>';
    $('cartList').querySelectorAll('[data-add]').forEach(stepper);
    $('cartSum').innerHTML = ls.length ? `<div class="r tot"><span>Subtotal · ${Cart.count()} item${Cart.count() === 1 ? '' : 's'}</span><span>${naira(Cart.subtotal())}</span></div><div class="r muted"><span>Delivery</span><span>Calculated at checkout</span></div>` : '';
    $('cartSum').hidden = !ls.length; $('cartNote').hidden = !ls.length;
    $('cartGo').hidden = !ls.length;
    $('cartMore').textContent = ls.length ? 'Keep shopping' : 'See the boxes';
  }
  function openCart() {
    if (!m.classList.contains('open')) last = document.activeElement;
    box = null; renderCart(); show('cart');
    m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); document.documentElement.style.overflow = 'hidden';
    setTimeout(() => m.querySelector('.mdl-x').focus(), 50);
  }

  /* ---------------- info view ---------------- */
  function open(i, opts) {
    opts = opts || {};
    if (!COLLECTION[i]) return;
    box = COLLECTION[i]; box.index = i; if (!m.classList.contains('open')) last = document.activeElement;
    $('mdlImg').innerHTML = box.custom ? '<span class="plus">+</span>' : box.cut ? `<img src="${IMG}${box.cut}.webp" alt="">` : `<span class="ph-mark">${box.cat}</span>`;
    $('mdlCat').textContent = box.cat; $('mdlTitle').textContent = box.name; $('mdlPack').textContent = 'Packaging: ' + box.pack;
    $('mdlMore').hidden = !!box.custom || location.pathname === '/boxes/' + box.img + '/'; if (!box.custom) $('mdlMore').href = '/boxes/' + box.img + '/';
    if (!box.custom) gg('view');
    const list = box.custom ? ['Tell us the occasion and who it is for', 'Set your budget', 'Choose items, or let us curate for you', 'Pick packaging and add a note'] : box.items.split(/,\s*/);
    $('mdlList').innerHTML = list.map(t => `<li>${esc(t.charAt(0).toUpperCase() + t.slice(1))}</li>`).join('');
    const price = num(box.price);
    $('mdlSum').innerHTML = box.custom
      ? `<div class="r"><span>Box</span><span>Priced to your budget</span></div><div class="r"><span>Delivery</span><span>Quoted on WhatsApp</span></div>`
      : `<div class="r"><span>Box</span><span>${naira(price)}</span></div><div class="r muted"><span>Delivery</span><span>Calculated at checkout</span></div>`;
    $('mdlRules').innerHTML = DELIVERY.rules.map(r => `<li>${esc(r)}</li>`).join('');
    const msg = box.custom ? 'Hi GiftGrid, I would like to curate a custom box.' : `Hi GiftGrid, I have a question about the ${box.name.replace(/^The /, '')} (${box.price}).`;
    $('mdlChat').href = wa(msg);
    $('mdlBuy').hidden = !!box.custom; $('mdlAdd').hidden = !!box.custom;
    $('mdlAdd').setAttribute('data-add', box.custom ? '' : box.img);
    const vs = box.group ? COLLECTION.map((b, j) => [b, j]).filter(([b]) => b.group === box.group) : [];
    $('mdlVar').hidden = !vs.length;
    $('mdlVar').innerHTML = vs.map(([b, j]) => `<button type="button" role="radio" aria-checked="${j === i}" data-vi="${j}">${esc(b.variant)}</button>`).join('');
    $('mdlChat').classList.toggle('solo', !!box.custom);   // custom box: WhatsApp is the only (primary) action
    $('mdlChat').textContent = box.custom ? 'Start on WhatsApp' : 'Chat with a human';
    $('coBackPick').hidden = !opts.fromPick;
    show('info'); render();
    if (opts.checkout && !box.custom) toCheckout();
    m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); document.documentElement.style.overflow = 'hidden';
    setTimeout(() => m.querySelector('.mdl-x').focus(), 50);
  }
  function close() {
    m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); document.documentElement.style.overflow = '';
    last && last.focus && last.focus();
  }

  /* ---------------- checkout view ---------------- */
  const lagosNow = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
  const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  function minDate() { const n = lagosNow(); const d = new Date(n); d.setDate(d.getDate() + (n.getHours() < 12 ? 1 : 2)); return d; }
  function slotsFor(ls) {
    return ls.some(l => l.box.cat === 'Breakfast')
      ? ['7:30–8:30 a.m.', '8:30–9:30 a.m.', '9:30–11:00 a.m.']
      : ['9:00 a.m.–12:00 p.m.', '12:00–3:00 p.m.', '3:00–6:00 p.m.'];
  }
  function toCheckout() {
    const ls = Cart.lines();
    if (!ls.length) return openCart();
    const n = Cart.count();
    $('coTitle').textContent = n === 1 ? 'Send the ' + ls[0].box.name.replace(/^The /, '') : `Send ${n} gifts`;
    const md = minDate(); $('co_date').min = ymd(md); if (!$('co_date').value || $('co_date').value < ymd(md)) $('co_date').value = ymd(md);
    const keep = $('co_slot').value, sl = slotsFor(ls);
    $('co_slot').innerHTML = sl.map(s => `<option${s === keep ? ' selected' : ''}>${s}</option>`).join('');
    if (!$('co_zone').options.length) {
      const groups = [...new Set(CHECKOUT.areas.map(a => a.group))];
      $('co_zone').innerHTML = '<option value="">Choose your area</option>' + groups.map(g => `<optgroup label="${esc(g)}">` + CHECKOUT.areas.filter(a => a.group === g).map(a => `<option value="${a.id}">${esc(a.name)} · ${naira(a.fee)}</option>`).join('') + '</optgroup>').join('');
    }
    $('coErr').hidden = true;
    setupAddress();
    renderSum();
    show('co');
    setTimeout(() => $('co_name').focus(), 60);
    gg('checkout');
  }
  function renderSum(pending) {
    const ls = Cart.lines(), price = Cart.subtotal();
    const fee = quote ? quote.fee : null;
    $('coSum').innerHTML = ls.map(l => `<div class="r"><span>${l.qty > 1 ? l.qty + ' × ' : ''}${esc(label(l.box))}</span><span>${naira(num(l.box.price) * l.qty)}</span></div>`).join('')
      + `<div class="r${fee == null ? ' muted' : ''}"><span>Delivery${quote && quote.label ? ' · ' + esc(quote.label) : ''}</span><span>${fee == null ? (pending || 'Choose your area') : naira(fee)}</span></div>`
      + `<div class="r tot"><span>Total</span><span>${fee == null ? naira(price) + ' + delivery' : naira(price + fee)}</span></div>`;
    $('coPay').textContent = fee == null ? 'Pay' : 'Pay ' + naira(price + fee);
  }

  // distance pricing used when there is no live quote (mirrors netlify/functions/_pricing.js)
  function estimate(lat, lng) {
    const R = 6371, t = x => x * Math.PI / 180, h = CHECKOUT.hub, P = CHECKOUT.pricing;
    const a = Math.sin(t(lat - h.lat) / 2) ** 2 + Math.cos(t(h.lat)) * Math.cos(t(lat)) * Math.sin(t(lng - h.lng) / 2) ** 2;
    const km = 2 * R * Math.asin(Math.sqrt(a)) * 1.35;   // road-distance factor
    if (km > P.maxKm) return { ok: false, km };
    const fee = Math.min(P.max, P.base + Math.max(0, km - P.baseKm) * P.perKm);
    return { ok: true, km, fee: Math.ceil(fee / 100) * 100 };
  }
  async function getQuote(payload) {
    try {
      const r = await fetch(CHECKOUT.apiBase + '/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (r.ok) return await r.json();
    } catch (e) {}
    return null;   // no backend (e.g. this preview): fall back to local estimate
  }
  async function quoteFromPlace(p) {
    place = p; quote = null; renderSum();
    const live = await getQuote({ lat: p.lat, lng: p.lng, address: p.address });
    if (live && live.ok) quote = { fee: live.fee, label: live.label || (live.km ? Math.round(live.km) + ' km' : ''), ref: live.ref, provider: live.provider };
    else if (live && live.ok === false) { quote = null; err(live.message || 'We can only deliver within Lagos online. Tap “Chat with a human” and we will sort it out.'); }
    else { const e = estimate(p.lat, p.lng); if (e.ok) quote = { fee: e.fee, label: Math.round(e.km) + ' km', provider: 'estimate' }; else err('That address is outside our Lagos delivery area. Chat with us and we will arrange it.'); }
    renderSum();
  }
  function useZones() {
    $('coZoneWrap').hidden = false;
    $('co_zone').onchange = async () => {
      const z = CHECKOUT.areas.find(z => z.id === $('co_zone').value);
      $('co_zone').setAttribute('aria-invalid', 'false'); err('');
      if (!z) { quote = null; return renderSum(); }
      // live price from the server (Chowdeck when connected); the area list is the instant fallback
      quote = null; renderSum('Calculating…');
      const want = z.id; let live = null;
      try { const r = await fetch(CHECKOUT.apiBase + '/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ zone: z.id }) }); if (r.ok) live = await r.json(); } catch (e) {}
      if ($('co_zone').value !== want) return;   // user changed area meanwhile
      quote = live && live.ok ? { fee: live.fee, label: z.name, provider: live.provider, zone: z.id, ref: live.ref } : { fee: z.fee, label: z.name, provider: 'area', zone: z.id };
      renderSum();
    };
  }
  /* address search: real Google suggestions via /api/places (key stays on the server) */
  let acProv = 'Google', addrBuilt = false, acMode = 'zones', acSession = '', acTimer = 0, acItems = [], acSel = -1, acSeq = 0;
  const acBox = () => $('coAc');
  function acClose() { acBox().hidden = true; acSel = -1; $('co_addr').setAttribute('aria-expanded', 'false'); }
  function acRender(list, msg) {
    const ul = acBox(); acItems = list; acSel = -1;
    if (!list.length && !msg) return acClose();
    ul.innerHTML = (msg ? `<li class="ac-msg">${esc(msg)}</li>` : list.map((x, i) => `<li role="option" id="ac${i}" data-i="${i}"><b>${esc(x.main)}</b><span>${esc(x.sub)}</span></li>`).join(''))
      + `<li class="ac-g" aria-hidden="true">Powered by ${acProv}</li>`;
    ul.hidden = false; $('co_addr').setAttribute('aria-expanded', 'true');
  }
  function acFallback() {
    acMode = 'zones'; acClose(); useZones();
  }
  async function acSearch(q) {
    const my = ++acSeq;
    try {
      const r = await fetch(`${CHECKOUT.apiBase}/places?q=${encodeURIComponent(q)}&s=${acSession}`);
      const j = await r.json();
      if (my !== acSeq) return;
      if (!r.ok) throw new Error(j.message);
      acProv = j.provider === 'geoapify' ? 'Geoapify · © OpenStreetMap' : 'Google';
      acRender(j.suggestions, j.suggestions.length ? '' : 'No match in Lagos yet. Try the street name and area.');
    } catch (e) { if (my === acSeq) acFallback(); }
  }
  async function acPick(i) {
    const s = acItems[i]; if (!s) return;
    acClose(); $('co_addr').value = s.main + (s.sub ? ', ' + s.sub : '');
    $('co_addr').setAttribute('aria-invalid', 'false');
    if (s.lat != null) { err(''); return quoteFromPlace({ address: s.address || $('co_addr').value, lat: s.lat, lng: s.lng }); }
    try {
      const r = await fetch(`${CHECKOUT.apiBase}/places?id=${encodeURIComponent(s.id)}&s=${acSession}`);
      const j = await r.json(); if (!r.ok) throw new Error(j.message);
      acSession = Math.random().toString(36).slice(2) + Date.now().toString(36);   // new billing session after a pick
      err(''); quoteFromPlace({ address: j.address, lat: j.lat, lng: j.lng });
    } catch (e) { err('We could not load that address. Please try again, or chat with us.'); }
  }
  function setupAddress() {
    if (addrBuilt) return; addrBuilt = true;
    acSession = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const inp = $('co_addr');
    inp.addEventListener('input', () => {
      if (acMode !== 'google') return;
      if (place) { place = null; quote = null; renderSum(); }
      clearTimeout(acTimer);
      const q = inp.value.trim();
      if (q.length < 3) return acClose();
      acTimer = setTimeout(() => acSearch(q), 220);
    });
    inp.addEventListener('keydown', e => {
      if (acBox().hidden) return;
      const n = acItems.length;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); if (!n) return;
        acSel = (acSel + (e.key === 'ArrowDown' ? 1 : -1) + n) % n;
        acBox().querySelectorAll('[data-i]').forEach((li, i) => li.classList.toggle('on', i === acSel));
        inp.setAttribute('aria-activedescendant', 'ac' + acSel);
      } else if (e.key === 'Enter' && acSel > -1) { e.preventDefault(); acPick(acSel); }
      else if (e.key === 'Escape') { e.stopPropagation(); acClose(); }
    });
    inp.addEventListener('blur', () => setTimeout(acClose, 150));
    acBox().addEventListener('mousedown', e => e.preventDefault());
    acBox().addEventListener('click', e => { const li = e.target.closest('[data-i]'); if (li) acPick(+li.dataset.i); });
    // default: type the address + pick the area (instant, no lookups).
    // If a Google key is set on the server, upgrade to live address suggestions.
    useZones();
    fetch(`${CHECKOUT.apiBase}/places?q=`).then(r => r.ok ? r.json() : null).then(j => {
      if (!j || j.provider !== 'google') return;
      acMode = 'google'; acProv = 'Google';
      $('coZoneWrap').hidden = true; inp.placeholder = 'Start typing the address';
    }).catch(() => {});
  }
  $('co_self').addEventListener('change', e => { $('coRecip').hidden = e.target.checked; });

  function err(msg) { const el = $('coErr'); el.textContent = msg; el.hidden = !msg; if (msg) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  const phoneOk = v => /^(\+?234|0)[789][01]\d{8}$/.test(v.replace(/[\s-]/g, ''));
  function collect() {
    const v = id => ($(id).value || '').trim();
    const self = $('co_self').checked;
    const d = {
      items: Cart.lines().map(l => ({ box: l.slug, qty: l.qty })), box: (Cart.lines()[0] || {}).slug, buyer_name: v('co_name'), buyer_phone: v('co_phone'), buyer_email: v('co_email'),
      recipient_name: self ? v('co_name') : v('co_rname'), recipient_phone: self ? v('co_phone') : v('co_rphone'),
      address: place ? place.address : v('co_addr'), lat: place ? place.lat : null, lng: place ? place.lng : null,
      zone: quote && quote.zone || null, address_extra: v('co_addr2'), date: v('co_date'), slot: v('co_slot'),
      backup_contact: v('co_backup'), card_message: v('co_note'), instructions: v('co_extra'),
      quote_ref: quote && quote.ref || null,
      heard_from: v('co_heard'), utm: (() => { try { return sessionStorage.getItem('gg_utm') || ''; } catch (e) { return ''; } })(),
      ...(window.ggTrack ? ggTrack.ids() : {}),
    };
    const bad = [];
    const mark = (id, ok) => { $(id).setAttribute('aria-invalid', ok ? 'false' : 'true'); if (!ok) bad.push(id); };
    mark('co_name', d.buyer_name.length > 1);
    mark('co_phone', phoneOk(d.buyer_phone));
    mark('co_email', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.buyer_email));
    if (!self) { mark('co_rname', d.recipient_name.length > 1); mark('co_rphone', phoneOk(d.recipient_phone)); }
    if (!place) mark('co_addr', acMode === 'zones' ? d.address.length > 5 : false);
    if (!$('coZoneWrap').hidden) mark('co_zone', !!d.zone);
    mark('co_date', !!d.date && d.date >= $('co_date').min);
    if (bad.length) { err(bad.length === 1 && bad[0] === 'co_addr' && acMode === 'google' ? 'Start typing the address and pick it from the suggestions so we can price delivery.' : 'Please check the highlighted fields. Phone numbers should look like 0803 000 0000.'); $(bad[0]) && $(bad[0]).focus(); return null; }
    if (!quote) { err('Add the delivery address so we can work out the delivery fee.'); return null; }
    err(''); return d;
  }
  async function pay(e) {
    e.preventDefault();
    const d = collect(); if (!d) return;
    const btn = $('coPay'); btn.disabled = true; btn.textContent = 'Starting payment…';
    if (!Cart.count()) return openCart();
    const bought = Cart.lines();
    gg('pay', Cart.subtotal() + (quote ? quote.fee : 0));
    try {
      const r = await fetch(CHECKOUT.apiBase + '/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok && !j.message) throw new Error(PREVIEW ? 'Failed to fetch' : 'SETUP ' + r.status);
      if (!r.ok) throw new Error(j.message || 'We could not start the payment. Please try again or chat with us.');
      if (!window.PaystackPop) await new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = 'https://js.paystack.co/v2/inline.js'; sc.onload = res; sc.onerror = () => rej(new Error('Paystack could not load. Check your connection and try again.')); document.head.appendChild(sc); });
      const pop = new PaystackPop();
      pop.resumeTransaction(j.access_code, {
        onSuccess: tx => confirm(tx.reference || j.reference, d, j, bought),
        onCancel: () => { btn.disabled = false; renderSum(); err('Payment was cancelled. Your details are still here when you are ready.'); },
        onError: x => { btn.disabled = false; renderSum(); err((x && x.message) || 'The payment did not go through. Please try again.'); },
      });
    } catch (x) {
      btn.disabled = false; renderSum();
      const m = String(x && x.message);
      if (/^SETUP/.test(m)) err(`Our payment service is not responding (${m.slice(6)}). Please chat with us to order while we fix it.`);
      else if (/Failed to fetch|NetworkError|JSON|Load failed/.test(m)) err(PREVIEW ? 'Online payment is not switched on in this preview. It works on the live site. You can still chat with us to order.' : 'We could not reach the payment service. Check your connection and try again, or chat with us.');
      else err(m);
    }
  }
  async function confirm(reference, d, j, bought) {
    let v = null;
    try { const r = await fetch(CHECKOUT.apiBase + '/verify?reference=' + encodeURIComponent(reference)); v = await r.json(); } catch (e) {}
    const total = v && v.amount ? v.amount : (j.total || 0);
    $('coDoneText').textContent = `We have emailed a receipt to ${d.buyer_email}. ${d.recipient_name} will receive ${bought.length === 1 && bought[0].qty === 1 ? 'the ' + bought[0].box.name.replace(/^The /, '') : 'their gifts'} on ${new Date(d.date + 'T12:00').toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}, ${d.slot}.`;
    $('coDoneSum').innerHTML = `<div class="r"><span>Order</span><span>${esc(j.order_id || reference)}</span></div><div class="r tot"><span>Paid</span><span>${naira(total)}</span></div>`;
    $('coDoneChat').href = wa(`Hi GiftGrid, about my order ${j.order_id || reference}.`);
    $('coPay').disabled = false;
    gg('purchase', total, j.order_id || reference, bought);
    Cart.clear();
    show('done');
  }

  $('mdlBuy').addEventListener('click', () => { if (box && !box.custom && !Cart.count()) { Cart.add(box.img); gg('add', 1); } toCheckout(); });
  $('coBack').addEventListener('click', openCart);
  $('cartGo').addEventListener('click', toCheckout);
  $('cartMore').addEventListener('click', () => Cart.count() ? close() : openPicker());
  $('pickCart').addEventListener('click', openCart);
  $('ggFab').addEventListener('click', openCart);
  $('mdlVar').addEventListener('click', e => { const b = e.target.closest('[data-vi]'); if (b) open(+b.dataset.vi, { fromPick: !$('coBackPick').hidden }); });
  // add-to-cart buttons anywhere on the page (capture, so cards and rails underneath don't also react)
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-add] [data-act]'); if (!btn) return;
    e.preventDefault(); e.stopPropagation();
    const el = btn.closest('[data-add]'), slug = el.getAttribute('data-add'), act = btn.dataset.act;
    if (act === 'pick') return open(bySlug(slug));
    const before = Cart.qty(slug);
    Cart.set(slug, before + (act === 'inc' ? 1 : -1));
    if (act === 'inc') { const keep = box; box = COLLECTION[bySlug(slug)]; gg('add', 1); box = keep; const f = $('ggFab'); f.classList.remove('bump'); void f.offsetWidth; f.classList.add('bump'); }
    const nb = el.querySelector(`[data-act="${act}"]:not([disabled])`) || el.querySelector('button'); nb && nb.focus({ preventScroll: true });
  }, true);
  document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('[data-add]')) e.stopPropagation(); }, true);
  $('coForm').addEventListener('submit', pay);
  $('coForm').addEventListener('input', e => { if (e.target.getAttribute('aria-invalid') === 'true') e.target.setAttribute('aria-invalid', 'false'); });
  $('co_addr').addEventListener('input', () => { if (!$('coZoneWrap').hidden) return; place = null; });

  $('coBackPick').addEventListener('click', openPicker);

  /* ---------------- pick a box (pages without the collection) ---------------- */
  function openPicker() {
    if (!m.classList.contains('open')) last = document.activeElement;
    box = null;
    $('pickGrid').innerHTML = COLLECTION.map((b, i) => b.hide ? '' : `<button type="button" class="pk${b.custom ? ' pk-custom' : ''}" data-pi="${i}">`
      + (b.custom ? '<span class="pk-img"><span class="plus">+</span></span>' : `<span class="pk-img"><img src="${IMG}${b.cut}.webp" alt="" loading="lazy"></span>`)
      + `<span class="pk-cat">${esc(b.cat)}</span><b>${esc(b.name)}</b><span class="pk-p">${esc(b.price)}</span></button>`).join('');
    show('pick'); render();
    m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); document.documentElement.style.overflow = 'hidden';
    setTimeout(() => m.querySelector('.mdl-x').focus(), 50);
  }
  $('pickGrid').addEventListener('click', e => { const b = e.target.closest('[data-pi]'); if (b) open(+b.dataset.pi, { fromPick: true }); });

  m.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('open')) close(); });

  // order buttons on any page open the pop-up here instead of sending people to the homepage
  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const a = e.target.closest('[data-box], [data-order], a[href="/#boxes"]');
    if (!a) return;
    const slug = a.getAttribute('data-box');
    if (slug != null) { const i = bySlug(slug); if (i < 0) return; e.preventDefault(); if (!Cart.qty(slug)) { Cart.add(slug); box = COLLECTION[i]; gg('add', 1); } open(i, { checkout: true }); }
    else { e.preventDefault(); openPicker(); }
  });
  // deep link: any page with ?box=<slug> opens that box
  try {
    const want = new URLSearchParams(location.search).get('box'), at = want ? bySlug(want) : -1;
    if (at > -1) {
      history.replaceState(null, '', location.pathname + location.hash);
      const go = () => setTimeout(() => open(at), 400);
      document.readyState === 'complete' ? go() : addEventListener('load', go, { once: true });
    }
  } catch (e) {}

  document.querySelectorAll('a.card[href^="/boxes/"]').forEach(a => {
    const slug = a.getAttribute('href').split('/')[2]; if (bySlug(slug) < 0) return;
    const w = document.createElement('div'); w.className = a.className + ' has-add';
    a.className = 'card-hit'; a.replaceWith(w); w.appendChild(a);
    w.insertAdjacentHTML('beforeend', `<div class="gg-add gg-add-card" data-add="${slug}"></div>`);
  });
  render();
  addEventListener('storage', e => { if (e.key === 'gg_cart') Cart.reload(); });

  window.GGOrder = { COLLECTION, open, openPicker, openCart, close, bySlug };
  window.GGCart = { add: Cart.add, set: Cart.set, qty: Cart.qty, count: Cart.count, render };
  window.__openBox = open;
})();
