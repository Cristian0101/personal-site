// Offline commerce invariants for the Polar checkout; no credentials, payments, or network calls.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const directory = await mkdtemp(join(tmpdir(), 'northmark-commerce-'));
let checks = 0;
const ok = value => { assert.ok(value); checks++; };
const transpile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
try {
  for (const name of ['config', 'rules']) await writeFile(join(directory, `${name}.mjs`), transpile(await readFile(`src/lib/commerce/${name}.ts`, 'utf8')));
  await writeFile(join(directory, 'playbooks.mjs'), transpile(await readFile('src/lib/playbooks.ts', 'utf8')));
  const load = name => import(pathToFileURL(join(directory, `${name}.mjs`)).href);
  const { purchaseAvailable, requiredCommerceEnv, customerPortalUrl, polarApiBase } = await load('config');
  const { productMatches, checkoutUrlAllowed, validCheckoutId } = await load('rules');
  const { playbooks, formatPrice } = await load('playbooks');

  // Committed product data: five independent, still-disabled editions.
  ok(playbooks.length === 5);
  ok(new Set(playbooks.map(book => book.slug)).size === 5);
  ok(new Set(playbooks.map(book => book.polarProductEnv)).size === 5);
  for (const product of playbooks) {
    ok(!purchaseAvailable(product, process.env));
    ok(!product.purchaseEnabled && !product.finalPdfApproved && !product.price.approved && product.status === 'preparation');
    ok(product.modules.length === 6 && product.outcomes.length === 4 && product.previews.length === 0);
    ok(formatPrice(product) === '$39');
  }

  // Launch gates.
  const book = { purchaseEnabled: true, status: 'published', finalPdfApproved: true, price: { amount: 3900, currency: 'usd', approved: true }, polarProductEnv: 'PRODUCT' };
  const env = { ...Object.fromEntries(requiredCommerceEnv.map(key => [key, 'configured'])), COMMERCE_SITE_URL: 'http://127.0.0.1:3218', COMMERCE_VERIFIED: 'true', POLAR_ORGANIZATION_SLUG: 'northmark-press', PRODUCT: 'prod_fixture' };
  ok(purchaseAvailable(book, env));
  for (const origin of ['http://public.example', 'https://example.com/path', 'ftp://localhost', 'https://user:password@example.com', 'garbage']) ok(!purchaseAvailable(book, { ...env, COMMERCE_SITE_URL: origin }));
  ok(!purchaseAvailable(book, { ...env, COMMERCE_MODE: 'invalid' }));
  for (const field of ['purchaseEnabled', 'finalPdfApproved']) ok(!purchaseAvailable({ ...book, [field]: false }, env));
  ok(!purchaseAvailable({ ...book, price: { ...book.price, approved: false } }, env));
  ok(!purchaseAvailable({ ...book, status: 'preparation' }, env));
  for (const field of [...requiredCommerceEnv, 'PRODUCT', 'COMMERCE_VERIFIED']) ok(!purchaseAvailable(book, { ...env, [field]: '' }));
  ok(!purchaseAvailable(book, { ...env, POLAR_ORGANIZATION_SLUG: 'Bad Slug/../x' }));
  ok(!purchaseAvailable(book, { ...env, COMMERCE_MODE: 'live' }));
  ok(purchaseAvailable(book, { ...env, COMMERCE_MODE: 'live', COMMERCE_LIVE_VERIFIED: 'true' }));
  ok(!purchaseAvailable({ ...book, polarProductEnv: 'OTHER' }, env));

  // Sandbox vs production endpoints never mix.
  ok(polarApiBase({}) === 'https://sandbox-api.polar.sh' && polarApiBase({ COMMERCE_MODE: 'test' }) === 'https://sandbox-api.polar.sh');
  ok(polarApiBase({ COMMERCE_MODE: 'live' }) === 'https://api.polar.sh');
  ok(customerPortalUrl(env) === 'https://sandbox.polar.sh/northmark-press/portal');
  ok(customerPortalUrl({ ...env, COMMERCE_MODE: 'live' }) === 'https://polar.sh/northmark-press/portal');
  ok(customerPortalUrl({}) === null);

  // Polar product must match the page's price and deliver a file.
  const product = { id: 'prod_fixture', is_archived: false, is_recurring: false, prices: [{ amount_type: 'fixed', price_amount: 3900, price_currency: 'usd', is_archived: false }], benefits: [{ type: 'downloadables' }] };
  ok(productMatches(product, book, 'prod_fixture'));
  ok(productMatches({ ...product, prices: [...product.prices, { amount_type: 'fixed', price_amount: 100, price_currency: 'usd', is_archived: true }] }, book, 'prod_fixture'));
  ok(!productMatches(product, book, 'prod_other'));
  ok(!productMatches({ ...product, is_archived: true }, book, 'prod_fixture'));
  ok(!productMatches({ ...product, is_recurring: true }, book, 'prod_fixture'));
  ok(!productMatches({ ...product, prices: [{ ...product.prices[0], price_amount: 4900 }] }, book, 'prod_fixture'));
  ok(!productMatches({ ...product, prices: [{ ...product.prices[0], price_currency: 'eur' }] }, book, 'prod_fixture'));
  ok(!productMatches({ ...product, prices: [{ amount_type: 'custom', is_archived: false }] }, book, 'prod_fixture'));
  ok(!productMatches({ ...product, prices: [...product.prices, { ...product.prices[0], price_amount: 100 }] }, book, 'prod_fixture'));
  ok(!productMatches({ ...product, benefits: [{ type: 'license_keys' }] }, book, 'prod_fixture'));

  // Redirects only to Polar-hosted HTTPS pages.
  for (const url of ['https://buy.polar.sh/polar_c_abc', 'https://sandbox.polar.sh/checkout/polar_c_abc', 'https://polar.sh/checkout/x']) ok(checkoutUrlAllowed(url));
  for (const url of ['http://buy.polar.sh/x', 'https://polar.sh.evil.example/x', 'https://evilpolar.sh/x', 'https://user:pw@buy.polar.sh/x', 'javascript:alert(1)', '']) ok(!checkoutUrlAllowed(url));
  ok(validCheckoutId('3fa85f64-5717-4562-b3fc-2c963f66afa6'));
  for (const id of ['', 'forged', '{CHECKOUT_ID}', '3fa85f64-5717-4562-b3fc-2c963f66afa6/../x']) ok(!validCheckoutId(id));

  console.log(`PASS: ${checks} commerce checks: launch gates, sandbox/live separation, Polar product matching, checkout redirect and ID validation.`);
} finally { await rm(directory, { recursive: true, force: true }); }
