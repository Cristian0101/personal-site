-- Run once on a private PostgreSQL database. Runtime credentials need access only to these tables.
BEGIN;
CREATE TABLE IF NOT EXISTS commerce_orders (
  session_id text PRIMARY KEY,
  slug text NOT NULL,
  price_id text NOT NULL,
  amount integer NOT NULL CHECK (amount > 0),
  currency text NOT NULL,
  file_key text NOT NULL,
  livemode boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS commerce_purchases (
  session_id text PRIMARY KEY REFERENCES commerce_orders(session_id),
  email text NOT NULL,
  payment_intent_id text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  access_expires_at timestamptz NOT NULL DEFAULT now() + interval '7 days',
  email_sent_at timestamptz,
  revoked boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS commerce_purchase_email ON commerce_purchases (email);
CREATE TABLE IF NOT EXISTS commerce_events (
  id text PRIMARY KEY,
  name text NOT NULL CHECK (name IN ('product_view', 'checkout_started', 'purchase_verified', 'payment_failed', 'checkout_expired')),
  slug text NOT NULL,
  livemode boolean NOT NULL,
  amount integer,
  currency text,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS commerce_rate_limits (
  key text PRIMARY KEY,
  started_at timestamptz NOT NULL,
  attempts integer NOT NULL
);
COMMIT;
