import { createHmac, timingSafeEqual } from "node:crypto";

export function createAccessToken(sessionId: string, expiresAt: number, secret: string) {
  if (secret.length < 32) throw new Error("Access secret must have at least 32 characters");
  const payload = Buffer.from(JSON.stringify({ sessionId, expiresAt })).toString("base64url");
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
}

export function verifyAccessToken(token: string, secret: string, now = Date.now()): { sessionId: string; expiresAt: number } | null {
  if (secret.length < 32 || token.length > 2048) return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;
  const expected = createHmac("sha256", secret).update(payload).digest();
  const actual = Buffer.from(signature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof value.sessionId === "string" && /^cs_(test_|live_)?[A-Za-z0-9]+$/.test(value.sessionId) && Number.isSafeInteger(value.expiresAt) && value.expiresAt > now ? value : null;
  } catch { return null; }
}
