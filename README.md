# GiftGrid website, giftgrid.com.ng

This folder holds everything the site needs:

- `index.html`, the website itself
- `img/`, the images
- `netlify/functions/`, the code that runs on the server for payments, address search, delivery fees and emails

These details are already set in the site:

- WhatsApp: +234 808 944 0743
- Emails are sent from hello@giftgrid.com.ng
- New-order alerts go to order@giftgrid.com.ng
- Deliveries go out from 1b Saheed Owoyele Street
- The site address is https://giftgrid.com.ng
- Customers pick their Lagos area from a list (instant, no lookups), which sets the delivery fee. Areas and fees are in `netlify/functions/_areas.json` (and the same list in `index.html`)

To change any of these later, edit `netlify/functions/_config.js`, or add a Netlify environment variable with the same name.

> **Important:** Don't drag and drop this folder onto Netlify. That way the server code doesn't run, so payments and emails won't work. Use GitHub, as in step 2.

---

## 1. Get your keys

| Service | What it does | What to do |
|---|---|---|
| **Paystack** | Takes payments | Copy the **secret** key from dashboard.paystack.com → Settings → API Keys & Webhooks. Start with `sk_test_…`. |
| **Resend** | Sends the confirmation emails | Sign up at resend.com, then go to Domains → Add `giftgrid.com.ng`. Add the DNS records it shows in your hosting's DNS settings and wait until it says *Verified*. Then go to API Keys → create one. |

## 2. Put the site on Netlify

1. Create a GitHub account and a new **private** repository. Upload everything in this folder to it.
2. On netlify.com, choose **Add new site → Import an existing project → GitHub**, then pick the repository.
3. Leave the build settings empty and click **Deploy**.

## 3. Add the secret keys in Netlify

Go to **Site configuration → Environment variables** and add these:

| Name | Value |
|---|---|
| `PAYSTACK_SECRET_KEY` | Your Paystack secret key: `sk_test_…` while testing, `sk_live_…` when you go live. Copy it fresh from Paystack → Settings → API Keys & Webhooks. |
| `RESEND_API_KEY` | your `re_…` key |

Then open **Deploys → Trigger deploy** so the site picks up the keys.

Check your setup at any time by opening `https://giftgrid.com.ng/api/health`.

Optional settings:

| Name | What it's for |
|---|---|
| `GOOGLE_MAPS_API_KEY` | Adds Google address suggestions as customers type (replaces the area list). |
| `HUB_LAT`, `HUB_LNG` | The exact map pin of the dispatch address, if the automatic lookup puts it in the wrong place. |
| `DELIVERY_BASE`, `DELIVERY_BASE_KM`, `DELIVERY_PER_KM`, `DELIVERY_MAX`, `DELIVERY_MAX_KM` | Your delivery pricing. The defaults are ₦2,000 for the first 5 km, then ₦250 per km, capped at ₦12,000, delivering up to 45 km. |
| `CHOWDECK_API_KEY` | Live Chowdeck Relay delivery prices (test or live key from https://dashboard.chowdeck.com/settings/developers). Without it, the fixed area prices are used. |
| `DELIVERY_MARKUP` | Naira added on top of every Chowdeck price (e.g. `500`). Default 0. |
| `CHOWDECK_AUTO_BOOK` | `true` = book the Chowdeck rider automatically for the chosen date and time window as soon as an order is paid. Needs a funded Chowdeck wallet and scheduled deliveries enabled on your Chowdeck account. |

## 4. Connect giftgrid.com.ng

1. In Netlify, go to **Domain management → Add a domain** and enter `giftgrid.com.ng`.
2. In your hosting's DNS settings, add these two records:
   - **A** record: name `@`, value `75.2.60.5`
   - **CNAME** record: name `www`, value `YOUR-SITE.netlify.app`
3. Don't touch the MX records, because those keep your email inboxes working. Netlify sets up HTTPS on its own, which can take a few hours.

## 5. Set the Paystack webhook

In Paystack, go to Settings → API Keys & Webhooks. Set the **Test** webhook URL (and later the Live one) to:

```
https://giftgrid.com.ng/api/paystack-webhook
```

## 6. Test

Place an order on the site and pay with Paystack's test card:

- Card number: 4084 0840 8408 4081
- Expiry: any future date
- CVV: 408
- OTP: 123456

Check that:

- address suggestions appear as you type
- a delivery fee is shown
- the payment goes through
- the customer gets a receipt and order@giftgrid.com.ng gets the order alert

When everything works, change `PAYSTACK_SECRET_KEY` in Netlify to your live key, set the Live webhook URL in Paystack, and redeploy.

## How an order works

1. The customer taps **Get this now** and fills in the checkout form.
2. Address suggestions come from `/api/places`, and the delivery fee from `/api/quote`. The fee is based on the distance from the dispatch address.
3. When the customer taps **Pay**, `/api/checkout` re-checks the price on the server and opens Paystack.
4. After payment, Paystack calls `/api/paystack-webhook`. It checks the payment, then sends the customer's receipt and your team's order alert. The alert includes a Google Maps link to the delivery address.

Box prices are in `netlify/functions/_catalog.js`. Customers are always charged these prices, so update this file whenever a price changes.
