// GiftGrid settings. Anything here can be overridden with a Netlify environment variable of the same name.
// Secret keys (Paystack, Resend, Google) are NEVER written here: set them in Netlify only.
// The Geoapify key is server-side only (this file is never sent to browsers); a Netlify variable overrides it.
const env = (k, d) => (process.env[k] === undefined || process.env[k] === '' ? d : process.env[k]);
module.exports = {
  SITE_URL: env('SITE_URL', 'https://giftgrid.com.ng'),
  FROM_EMAIL: env('FROM_EMAIL', 'GiftGrid <hello@giftgrid.com.ng>'),
  REPLY_TO: env('REPLY_TO', 'hello@giftgrid.com.ng'),
  ORDER_NOTIFY_EMAIL: env('ORDER_NOTIFY_EMAIL', 'order@giftgrid.com.ng'),
  WHATSAPP: env('WHATSAPP_NUMBER', '2348089440743'),
  HUB_ADDRESS: env('HUB_ADDRESS', '1b Saheed Owoyele Street, Lagos, Nigeria'),
  // TEST key only, as a fallback so checkout works on first deploy. Put your LIVE key (sk_live_...) in Netlify,
  // never in this file: the Netlify variable always wins.
  PAYSTACK_SECRET_KEY: env('PAYSTACK_SECRET_KEY', 'sk_test_e3d0dd779fe41daeca3037569d15c2b30c14a668'),
  GEOAPIFY_API_KEY: env('GEOAPIFY_API_KEY', 'c3a39768ce544605bcff82ddaf87203e'),
  HUB_LAT: env('HUB_LAT', ''),   // set these two once you have the exact pin; otherwise the address is looked up
  HUB_LNG: env('HUB_LNG', ''),
};
