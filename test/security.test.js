// Anti-bot and anti-scanner protections.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
import { botCheck, turnstileKey } from '../src/lib.js';

const env = { SITE_URL: 'https://abolux.store', ASSETS: { fetch: () => new Response('asset') } };
const get = (path, headers = {}) => worker.fetch(new Request('https://abolux.store' + path, { headers: { 'user-agent': 'Mozilla/5.0', ...headers } }), env, {});

test('scanner probes get a 404 without touching the database', async () => {
  for (const p of ['/wp-admin/', '/wp-login.php', '/.env', '/.git/config', '/phpmyadmin/', '/xmlrpc.php', '/index.php', '/vendor/phpunit/x', '/backup.sql', '/cgi-bin/x']) {
    assert.equal((await get(p)).status, 404, p);
  }
});

test('known hacking tools are refused', async () => {
  for (const ua of ['sqlmap/1.7', 'Mozilla/5.00 (Nikto/2.5.0)', 'Nuclei - Open-source project', 'WPScan v3.8']) {
    assert.equal((await get('/fr/', { 'user-agent': ua })).status, 403, ua);
  }
});

test('API writes without a browser user agent are refused', async () => {
  const res = await worker.fetch(new Request('https://abolux.store/api/orders', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }), env, {});
  assert.equal(res.status, 400);
});

test('Turnstile: off unless both keys are set; a clear "no" blocks; Cloudflare down lets the order through', async () => {
  const settings = { turnstile_site_key: '0x4AAAAAAAtestkey' };
  assert.equal(turnstileKey(settings), '0x4AAAAAAAtestkey');
  const req = new Request('https://abolux.store/api/orders');
  assert.equal(await botCheck({}, settings, '', req), true);
  assert.equal(await botCheck({ TURNSTILE_SECRET: 's' }, {}, '', req), true);
  const real = globalThis.fetch;
  try {
    assert.equal(await botCheck({ TURNSTILE_SECRET: 's' }, settings, '', req), false);
    globalThis.fetch = async () => new Response(JSON.stringify({ success: false }), { status: 200 });
    assert.equal(await botCheck({ TURNSTILE_SECRET: 's' }, settings, 'tok', req), false);
    globalThis.fetch = async () => new Response(JSON.stringify({ success: true }), { status: 200 });
    assert.equal(await botCheck({ TURNSTILE_SECRET: 's' }, settings, 'tok', req), true);
    globalThis.fetch = async () => { throw new Error('down'); };
    assert.equal(await botCheck({ TURNSTILE_SECRET: 's' }, settings, 'tok', req), true);
  } finally {
    globalThis.fetch = real;
  }
});
