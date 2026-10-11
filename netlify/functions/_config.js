// GiftGrid settings. Anything here can be overridden with a Netlify environment variable of the same name.
// Secret keys (Paystack, Resend, Google) are NEVER written here: set them in Netlify only.
const env = (k, d) => (process.env[k] === undefined || process.env[k] === '' ? d : process.env[k]);
module.exports = {
  SITE_URL: env('SITE_URL', 'https://giftgrid.com.ng'),
  FROM_EMAIL: env('FROM_EMAIL', 'GiftGrid <hello@giftgrid.com.ng>'),
  REPLY_TO: env('REPLY_TO', 'hello@giftgrid.com.ng'),
  ORDER_NOTIFY_EMAIL: env('ORDER_NOTIFY_EMAIL', 'order@giftgrid.com.ng'),
  WHATSAPP: env('WHATSAPP_NUMBER', '2348089440743'),
  HUB_ADDRESS: env('HUB_ADDRESS', '1b Saheed Owoyele Street, Lagos, Nigeria'),
  // Set PAYSTACK_SECRET_KEY in Netlify → Site configuration → Environment variables (never in this file).
  PAYSTACK_SECRET_KEY: env('PAYSTACK_SECRET_KEY', ''),
  GEOAPIFY_API_KEY: env('GEOAPIFY_API_KEY', ''),   // off by default: the Lagos area list is used instead
  HUB_LAT: env('HUB_LAT', ''),   // set these two once you have the exact pin; otherwise the address is looked up
  HUB_LNG: env('HUB_LNG', ''),
};
