import { siteOrigin } from "./config";

export const privateHeaders = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" };
export function sameOrigin(request: Request) {
  try {
    const url = new URL(request.url);
    // Next's dev adapter can normalize request.url to localhost even when Host is 127.0.0.1.
    const expected = process.env.COMMERCE_SITE_URL ? siteOrigin() : `${url.protocol}//${request.headers.get("host") || url.host}`;
    return request.headers.get("origin") === expected;
  } catch { return false; }
}
export function validSessionId(id: string) { return /^cs_(test_|live_)?[A-Za-z0-9]{16,}$/.test(id) && id.length < 256; }
