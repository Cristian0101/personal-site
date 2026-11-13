// Offline commerce invariants; no credentials, emails, payments, or network calls.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import Stripe from 'stripe';

const directory = await mkdtemp(join(tmpdir(), 'northmark-commerce-'));
let checks = 0;
const ok = value => { assert.ok(value); checks++; };
try {
  for (const name of ['config', 'tokens', 'rules', 'fulfillment']) {
    const source = await readFile(`src/lib/commerce/${name}.ts`, 'utf8');
    const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText.replace('from "./rules"', 'from "./rules.mjs"');
    await writeFile(join(directory, `${name}.mjs`), output);
  }
  const load = name => import(pathToFileURL(join(directory, `${name}.mjs`)).href);
  const { purchaseAvailable, requiredCommerceEnv } = await load('config');
  const { createAccessToken, verifyAccessToken } = await load('tokens');
  const { verifiedPayment, hasReversedPayment } = await load('rules');
  const { fulfillPayment } = await load('fulfillment');
  const productsSource = await readFile('src/lib/playbooks.ts', 'utf8');
  await writeFile(join(directory, 'playbooks.mjs'), ts.transpileModule(productsSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText);
  const { playbooks, formatPrice } = await load('playbooks');
  ok(playbooks.length === 5);
  ok(new Set(playbooks.map(book => book.slug)).size === 5);
  ok(new Set(playbooks.map(book => book.checkoutPriceEnv)).size === 5);
  ok(new Set(playbooks.map(book => book.fileKeyEnv)).size === 5);
  for (const product of playbooks) {
    ok(!purchaseAvailable(product, process.env));
    ok(!product.purchaseEnabled && !product.finalPdfApproved && !product.price.approved && product.status === 'preparation');
    ok(product.modules.length === 6 && product.outcomes.length === 4 && product.previews.length === 0);
    ok(formatPrice(product) === '$39');
  }
  const book = { purchaseEnabled: true, status: 'published', finalPdfApproved: true, price: { amount: 3900, currency: 'usd', approved: true }, checkoutPriceEnv: 'PRICE', fileKeyEnv: 'FILE' };
  const env = { ...Object.fromEntries(requiredCommerceEnv.map(key => [key, 'configured'])), COMMERCE_SITE_URL: 'http://127.0.0.1:3218', COMMERCE_VERIFIED: 'true', STRIPE_SECRET_KEY: 'sk_test_fixture', COMMERCE_ACCESS_SECRET: 'a'.repeat(40), PRICE: 'price_fixture', FILE: 'private/book.pdf' };
  ok(purchaseAvailable(book, env));
  for (const origin of ['http://public.example', 'https://example.com/path', 'ftp://localhost', 'https://user:password@example.com', 'garbage']) ok(!purchaseAvailable(book, { ...env, COMMERCE_SITE_URL: origin }));
  ok(!purchaseAvailable(book, { ...env, COMMERCE_MODE: 'invalid' }));
  for (const field of ['purchaseEnabled', 'finalPdfApproved']) ok(!purchaseAvailable({ ...book, [field]: false }, env));
  ok(!purchaseAvailable({ ...book, price: { ...book.price, approved: false } }, env));
  ok(!purchaseAvailable({ ...book, status: 'preparation' }, env));
  for (const field of [...requiredCommerceEnv, 'PRICE', 'FILE', 'COMMERCE_VERIFIED']) ok(!purchaseAvailable(book, { ...env, [field]: '' }));
  ok(!purchaseAvailable(book, { ...env, COMMERCE_MODE: 'live', STRIPE_SECRET_KEY: 'sk_live_fixture' }));
  ok(!purchaseAvailable(book, { ...env, COMMERCE_MODE: 'live', COMMERCE_LIVE_VERIFIED: 'true' }));
  ok(purchaseAvailable(book, { ...env, COMMERCE_MODE: 'live', COMMERCE_LIVE_VERIFIED: 'true', STRIPE_SECRET_KEY: 'sk_live_fixture' }));

  const secret = 'test-secret-'.repeat(4), id = 'cs_test_12345678901234567890', now = Date.now();
  const token = createAccessToken(id, now + 1000, secret);
  ok(verifyAccessToken(token, secret, now)?.sessionId === id);
  ok(verifyAccessToken(token, secret, now + 1001) === null);
  ok(verifyAccessToken(token.replace(/^./, 'X'), secret, now) === null);
  ok(verifyAccessToken(token, 'wrong'.repeat(10), now) === null);
  for (const bad of ['', 'bad', `${token}.extra`, 'a'.repeat(3000)]) ok(verifyAccessToken(bad, secret, now) === null);

  const order = { session_id: id, slug: 'master-interviews', price_id: 'price_fixture', amount: 3900, currency: 'usd', file_key: 'private/book.pdf', livemode: false };
  const session = { id, mode: 'payment', status: 'complete', payment_status: 'paid', livemode: false, amount_total: 3900, currency: 'usd', metadata: { app: 'northmark-playbooks', slug: 'master-interviews' }, line_items: { data: [{ price: { id: 'price_fixture' }, quantity: 1 }], has_more: false }, customer_details: { email: 'Reader@Example.com' }, payment_intent: 'pi_fixture' };
  ok(verifiedPayment(session, order)?.email === 'reader@example.com');
  const callOrder = { ...order, slug: 'science-of-a-cold-call', price_id: 'price_call', amount: 4900, file_key: 'private/call.pdf' };
  const callSession = { ...session, metadata: { app: 'northmark-playbooks', slug: callOrder.slug }, amount_total: 4900, line_items: { data: [{ price: { id: 'price_call' }, quantity: 1 }], has_more: false } };
  ok(verifiedPayment(callSession, callOrder)?.email === 'reader@example.com');
  ok(verifiedPayment(callSession, order) === null && verifiedPayment(session, callOrder) === null);
  for (const patch of [{ payment_status: 'unpaid' }, { payment_status: 'no_payment_required' }, { status: 'open' }, { mode: 'subscription' }, { amount_total: 1 }, { currency: 'eur' }, { livemode: true }, { id: 'cs_test_other' }, { metadata: { app: 'another-app' } }, { customer_details: { email: '' } }, { payment_intent: null }, { line_items: { data: [], has_more: false } }, { line_items: { data: [{ price: { id: 'price_wrong' }, quantity: 1 }], has_more: false } }, { line_items: { data: [{ price: { id: 'price_fixture' }, quantity: 2 }], has_more: false } }, { line_items: { ...session.line_items, has_more: true } }]) ok(verifiedPayment({ ...session, ...patch }, order) === null);
  ok(!hasReversedPayment({ status: 'succeeded', latest_charge: { refunded: false, amount_refunded: 0, disputed: false } }));
  for (const charge of [{ refunded: true }, { amount_refunded: 1 }, { disputed: true }]) ok(hasReversedPayment({ status: 'succeeded', latest_charge: { refunded: false, amount_refunded: 0, disputed: false, ...charge } }));
  ok(hasReversedPayment({ status: 'processing', latest_charge: null }));

  // Model the database's session primary key and the provider's email idempotency key.
  let purchase, emailFailure = false, markFailure = false;
  const emails = new Set(), conversions = new Set();
  const services = {
    findOrder: async () => order, getSession: async () => session,
    recordPurchase: async (_order, email, intent) => { conversions.add(id); return purchase ??= { ...order, email, payment_intent_id: intent, created_at: new Date(), access_expires_at: new Date(now + 100000), revoked: false, email_sent_at: null }; },
    emailAccess: async (_purchase, key) => { if (emailFailure) { emailFailure = false; throw new Error('email unavailable'); } emails.add(key); },
    markEmailed: async () => { if (markFailure) { markFailure = false; throw new Error('db unavailable'); } purchase.email_sent_at = new Date(); },
  };
  await Promise.all([fulfillPayment(id, services), fulfillPayment(id, services)]);
  ok(conversions.size === 1 && emails.size === 1);
  await fulfillPayment(id, services); ok(emails.size === 1);
  purchase = undefined; emails.clear(); conversions.clear(); emailFailure = true;
  await assert.rejects(fulfillPayment(id, services)); checks++;
  ok(purchase && !purchase.email_sent_at);
  await fulfillPayment(id, services); ok(purchase.email_sent_at && conversions.size === 1 && emails.size === 1);
  purchase = undefined; emails.clear(); conversions.clear(); markFailure = true;
  await assert.rejects(fulfillPayment(id, services)); checks++;
  await fulfillPayment(id, services); ok(conversions.size === 1 && emails.size === 1);
  const before = conversions.size;
  ok(await fulfillPayment(id, { ...services, getSession: async () => ({ ...session, payment_status: 'unpaid' }) }) === 'pending');
  ok(conversions.size === before);
  await assert.rejects(fulfillPayment(id, { ...services, findOrder: async () => undefined })); checks++;
  await assert.rejects(fulfillPayment(id, { ...services, getSession: async () => ({ ...session, amount_total: 1 }) })); checks++;
  purchase.revoked = true; ok(await fulfillPayment(id, services) === 'revoked');

  const stripe = new Stripe('sk_test_offline');
  const payload = JSON.stringify({ id: 'evt_offline', type: 'checkout.session.completed', livemode: false, data: { object: session } });
  const signingSecret = 'whsec_offline';
  const signature = stripe.webhooks.generateTestHeaderString({ payload, secret: signingSecret });
  ok(stripe.webhooks.constructEvent(payload, signature, signingSecret).id === 'evt_offline');
  assert.throws(() => stripe.webhooks.constructEvent(`${payload} `, signature, signingSecret)); checks++;
  assert.throws(() => stripe.webhooks.constructEvent(payload, signature, 'whsec_wrong')); checks++;
  const stale = stripe.webhooks.generateTestHeaderString({ payload, secret: signingSecret, timestamp: Math.floor(now / 1000) - 600 });
  assert.throws(() => stripe.webhooks.constructEvent(payload, stale, signingSecret)); checks++;
  console.log(`PASS: ${checks} commerce checks: launch gates, signed/expired access, paid-order matching, refunds, duplicate/concurrent events, delivery retries, and webhook signatures.`);
} finally { await rm(directory, { recursive: true, force: true }); }
