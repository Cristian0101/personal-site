/** Remote acceptance is read-only and requires an explicit opt-in for this site. */
import assert from 'node:assert/strict';
const value = process.env.TEST_ORIGIN || 'http://127.0.0.1:3217';
const url = new URL(value);
const local = ['127.0.0.1', 'localhost'].includes(url.hostname);
const ownedSite = url.hostname === 'www.cristiansanchezaguilera.com' || /^personal-site(?:-[a-z0-9-]+)?\.vercel\.app$/.test(url.hostname);
assert.ok(local || (process.env.ALLOW_REMOTE_RESOURCE_TESTS === '1' && url.protocol === 'https:' && ownedSite), 'Remote resource tests require an explicit opt-in and a verified personal-site origin');
assert.ok(url.pathname === '/' && !url.search && !url.hash && !url.username && !url.password, 'Use an origin, not a path or authenticated URL');
export const base = url.origin;
