// The AI description writer, against a local stand-in for the Claude API (no real call, no cost).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { writeDescription } from '../src/ai.js';

const PNG = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='), (c) => c.charCodeAt(0));

function fakeEnv(extra = {}) {
  return {
    ANTHROPIC_API_KEY: 'test-key',
    DB: { prepare: () => ({ bind: () => ({ first: async () => ({ type: 'image/png', data: PNG.buffer }) }) }) },
    ...extra,
  };
}

// Answers one streamed message whose text is `answer`, or the given stop reason.
function standIn(answer, stop = 'end_turn') {
  const seen = [];
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      seen.push({ url: req.url, headers: req.headers, body: JSON.parse(body) });
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      const send = (type, data) => res.write(`event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`);
      send('message_start', { message: { id: 'msg_1', type: 'message', role: 'assistant', model: 'claude-opus-5-5', content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 10, output_tokens: 0 } } });
      send('content_block_start', { index: 0, content_block: { type: 'text', text: '' } });
      send('content_block_delta', { index: 0, delta: { type: 'text_delta', text: answer } });
      send('content_block_stop', { index: 0 });
      send('message_delta', { delta: { stop_reason: stop, stop_sequence: null }, usage: { output_tokens: 20 } });
      send('message_stop', {});
      res.end();
    });
  });
  return new Promise((resolve) => server.listen(0, () => resolve({ server, seen, url: `http://127.0.0.1:${server.address().port}` })));
}

test('no key: a clear error, nothing sent', async () => {
  const r = await writeDescription({}, 'https://abolux.store', { notes: 'x' });
  assert.equal(r.body.error, 'no_ai_key');
});

test('nothing to write from', async () => {
  const r = await writeDescription(fakeEnv(), 'https://abolux.store', { names: {}, notes: '', images: [] });
  assert.equal(r.body.error, 'ai_needs_input');
});

test('writes the three languages, sends the photos, keeps only listed photos and safe HTML', async () => {
  const answer = JSON.stringify({
    name_ar: 'علبة غداء كهربائية', name_fr: 'Lunch box électrique', name_en: 'Electric lunch box',
    desc_ar: '<h2>ماكلة سخونة</h2><p onclick="x()">كتسخن</p><img src="/img/p/a.png" alt="a"><img src="https://evil.example/x.png"><script>alert(1)</script>',
    desc_fr: '<p>Chaud</p>', desc_en: '<p>Hot</p>',
  });
  const s = await standIn(answer);
  try {
    const r = await writeDescription(fakeEnv({ ANTHROPIC_BASE_URL: s.url }), 'https://abolux.store', {
      names: { ar: 'علبة غداء', fr: 'lunchbox 4in1 electric' }, notes: '4 bols inox, 2 L', style: 'darija', images: ['/img/p/a.png', 'javascript:alert(1)'],
    });
    assert.equal(r.status, 200);
    assert.equal(r.body.names.fr, 'Lunch box électrique');
    assert.match(r.body.desc.ar, /<h2>ماكلة سخونة<\/h2>/);
    assert.match(r.body.desc.ar, /src="\/img\/p\/a\.png"/);
    assert.doesNotMatch(r.body.desc.ar, /evil\.example|script|onclick/);
    const req = s.seen[0];
    assert.equal(req.body.model, 'claude-opus-5-5');
    assert.equal(req.body.fallbacks, 'default');
    assert.equal(req.body.output_config.format.type, 'json_schema');
    assert.match(String(req.headers['anthropic-beta']), /server-side-fallback-2026-07-01/);
    const images = req.body.messages[0].content.filter((b) => b.type === 'image');
    assert.equal(images.length, 1);
    assert.equal(images[0].source.media_type, 'image/png');
    assert.match(req.body.messages[0].content.at(-1).text, /Darija/);
  } finally {
    s.server.close();
  }
});

test('a refusal is reported, not shown as a description', async () => {
  const s = await standIn('', 'refusal');
  try {
    const r = await writeDescription(fakeEnv({ ANTHROPIC_BASE_URL: s.url }), 'https://abolux.store', { notes: 'x' });
    assert.equal(r.body.error, 'ai_refused');
  } finally {
    s.server.close();
  }
});
