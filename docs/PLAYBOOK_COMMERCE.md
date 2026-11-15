# Northmark Press playbooks

Local review: `npm run dev -- --webpack --hostname 127.0.0.1 --port 3218`, then `/resources`, `/resources/master-interviews`, `/resources/sdr-bdr-job-mastery`, `/resources/break-up-your-tam`, `/resources/science-of-a-cold-call`, and `/resources/science-of-a-cold-email`.

## Current launch state

All five titles are in preparation. Each has a proposed $39 USD one-time price. `purchaseEnabled`, `finalPdfApproved`, and `price.approved` in `src/lib/playbooks.ts` are false independently for each product, so no checkout button is shown and `/api/commerce/checkout` returns 503.

## How selling works (Polar)

Polar (polar.sh) is the merchant of record. It hosts checkout, takes payment, handles sales tax/VAT, emails the receipt, stores the PDF and delivers it through a **File Downloads** benefit. Buyers re-download from Polar's customer portal by signing in with their purchase email.

The site does three things:

1. **Product pages** (`src/lib/playbooks.ts`, `src/components/playbooks/`) show the book and a "Get the Playbook" button only when every launch gate passes (`purchaseAvailable` in `src/lib/commerce/config.ts`).
2. **`POST /api/commerce/checkout`** looks up the book's Polar product, refuses to sell if the product is archived, recurring, has more than one active price, the price/currency differs from the page, or it has no File Downloads benefit. It then creates a Polar checkout session with fixed `success_url`/`return_url` and `metadata.app = northmark-playbooks`, and redirects only to an HTTPS `*.polar.sh` URL. The browser never sends a price or product ID.
3. **`/resources/purchase/success`** reads the checkout status from Polar for display only. **`/resources/access`** is the public support page (download again via the customer portal, receipts, contact). Use its full URL as the support URL in Polar.

There is no database, file bucket, email provider or webhook. Polar fulfils every order, so a success-page visit can't grant anything.

### Removed from the earlier Stripe build

Stripe Checkout + webhooks, the PostgreSQL order/purchase/event tables (`db/commerce.sql`), private S3 storage, Resend access emails, signed access tokens, the recovery and download routes, product-view telemetry, and the `stripe`, `@aws-sdk/client-s3` and `postgres` dependencies. Polar covers each of these (checkout, order records and analytics, file hosting, delivery email, customer portal, refunds).

## Configure a sandbox

1. In Polar, create a dedicated organization for Northmark Press (not Surge) in the **sandbox** (sandbox.polar.sh).
2. For each book create a product: one-time, fixed price $39 USD, with a **File Downloads** benefit holding the approved final PDF. The PDF is private to buyers; never upload it to `public/` or a public URL.
3. Create an organization access token (Settings → Developers) with scopes `products:read`, `checkouts:read`, `checkouts:write`.
4. Copy `.env.commerce.example` into `.env.local` (or the Vercel project env) and fill in `POLAR_ACCESS_TOKEN`, `POLAR_ORGANIZATION_SLUG`, the five `*_POLAR_PRODUCT_ID` values and `COMMERCE_SITE_URL`. Keep `COMMERCE_MODE=test` (sandbox API).
5. To test one book, set its `status: "published"`, `purchaseEnabled`, `finalPdfApproved` and `price.approved` to true **locally only**, plus `COMMERCE_VERIFIED=true`. Buy with Stripe test card `4242 4242 4242 4242`, any future expiry and CVC. Confirm the receipt email, the download link, the success page showing "Your playbook is ready.", and a re-download from the customer portal. Also try a declined card (`4000 0000 0000 0002`) and leaving checkout with the back button.

## Going live

Only after a passing sandbox purchase and an explicit go from Cristian: connect payouts on the production org, recreate the five products there with the same price and PDFs, create a production token, set `COMMERCE_MODE=live`, the production token and product IDs, `COMMERCE_VERIFIED=true`, and `COMMERCE_LIVE_VERIFIED=true`. Then commit the per-book flags (`status`, `purchaseEnabled`, `finalPdfApproved`, `price.approved`) and update each book's `delivery` and SEO copy for the finished edition. Sandbox and production use different API hosts and tokens; `COMMERCE_MODE` picks the host, so a sandbox token can't take live payments.

## Verification

`npm run test:commerce` checks launch gates, sandbox/live separation, Polar product matching, checkout redirect and checkout-ID validation offline. `TEST_ORIGIN=http://127.0.0.1:3218 npm run test:playbooks` checks all five products at 390/768/1440px in light/dark, disabled checkout, removed routes, the success and support pages, and the free downloads. Also run lint, TypeScript and the production build. Neither test calls Polar; the sandbox purchase above is the real acceptance test.

Provider reference: [Polar docs](https://docs.polar.sh) (checkouts API, File Downloads benefit, customer portal, sandbox).
