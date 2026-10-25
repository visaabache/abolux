import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeRich, richHtml, richText, isRich } from '../src/rich.js';

test('keeps formatting, lists, links and our media', () => {
  const html = '<h2 style="text-align: center">Titre</h2><p><strong>Gras</strong> <em>it</em> <u>s</u> <span style="color: #d43f21">rouge</span></p><ul><li>un</li></ul>'
    + '<figure class="w-50 al-center"><img src="/img/p/a.gif" alt="x"></figure><figure class="w-100"><video src="/img/v/b.mp4"></video></figure>'
    + '<p><a href="https://example.com">lien</a></p>';
  const out = sanitizeRich(html);
  assert.match(out, /<h2 style="text-align: center">Titre<\/h2>/);
  assert.match(out, /<span style="color: #d43f21">rouge<\/span>/);
  assert.match(out, /<figure class="w-50 al-center"><img src="\/img\/p\/a.gif" alt="x" loading="lazy"><\/figure>/);
  assert.match(out, /<video src="\/img\/v\/b.mp4" controls playsinline preload="metadata"><\/video>/);
  assert.match(out, /<a href="https:\/\/example.com" target="_blank" rel="noopener nofollow">lien<\/a>/);
});

test('removes scripts, event handlers and dangerous URLs', () => {
  const evil = [
    '<script>alert(1)</script>ok',
    '<img src="/img/a.png" onerror="alert(1)">',
    '<a href="javascript:alert(1)">x</a>',
    '<a href="jav&#x61;script:alert(1)">x</a>',
    '<a href=" javascript:alert(1)">x</a>',
    '<img src="data:image/svg+xml,<svg onload=alert(1)>">',
    '<iframe src="https://evil.example/embed/x"></iframe>',
    '<svg><script>alert(1)</script></svg>',
    '<p style="background:url(javascript:alert(1))">x</p>',
    '<div style="color: red; position: fixed">x</div>',
    '<style>body{display:none}</style>',
    '<object data="x"></object><embed src="x">',
    '<video src="/img/v.mp4" onplay="alert(1)"><source src="x"></video>',
    '<img src="x" <script>alert(1)</script>',
    '<a href="//evil.example">x</a>',
  ];
  for (const s of evil) {
    const out = sanitizeRich(s);
    assert.doesNotMatch(out, /<script|onerror|onload|onplay|javascript:|<svg|<object|<embed|<style|evil\.example|position|data:/i, `${s} → ${out}`);
  }
  assert.equal(sanitizeRich('<script>alert(1)</script>ok'), 'ok');
  assert.equal(sanitizeRich('<a href="javascript:alert(1)">x</a>'), '<a>x</a>');
});

test('balances tags so nothing leaks into the page', () => {
  assert.equal(sanitizeRich('<h2>open <strong>bold'), '<h2>open <strong>bold</strong></h2>');
  assert.equal(sanitizeRich('text</div></p>'), 'text');
  assert.equal(sanitizeRich('<p>a < b and c > d</p>'), '<p>a &lt; b and c &gt; d</p>');
  assert.equal(sanitizeRich('<p>x<ul><li>1</li></ul><figure class="w-50"><img src="/img/a.png"></figure></p><p>y</p>'),
    '<p>x</p><ul><li>1</li></ul><figure class="w-50"><img src="/img/a.png" loading="lazy"></figure><p>y</p>');
});

test('drops empty paragraphs and trailing blank lines', () => {
  assert.equal(sanitizeRich('<p>a</p><p></p><ul><li>b</li></ul><p><br></p><p>c</p><p><br></p><p><br></p>'), '<p>a</p><ul><li>b</li></ul><p><br></p><p>c</p>');
});

test('allows YouTube and Vimeo embeds only', () => {
  const yt = sanitizeRich('<figure class="w-100"><iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"></iframe></figure>');
  assert.match(yt, /<iframe src="https:\/\/www.youtube-nocookie.com\/embed\/dQw4w9WgXcQ" loading="lazy" allowfullscreen/);
  assert.match(sanitizeRich('<iframe src="https://player.vimeo.com/video/123"></iframe>'), /player.vimeo.com\/video\/123/);
  assert.equal(sanitizeRich('<iframe src="https://example.com/embed/x">fallback</iframe>'), '');
});

test('cleans Word paste junk', () => {
  const word = '<!--[if gte mso 9]><xml><o:OfficeDocumentSettings/></xml><![endif]--><p class="MsoNormal" style="mso-line-height:12pt;font-weight:bold"><o:p>Bonjour</o:p></p>';
  assert.equal(sanitizeRich(word), '<p style="font-weight: bold">Bonjour</p>');
});

test('plain-text descriptions from before the editor still display', () => {
  assert.equal(isRich('Ligne 1\nLigne 2'), false);
  assert.equal(richHtml('Ligne <1>\nLigne 2\n\nPara 2'), '<p>Ligne &lt;1&gt;<br>Ligne 2</p><p>Para 2</p>');
  assert.equal(richText('<h2>Titre</h2><p>Un&nbsp;<b>deux</b></p><figure><img src="/img/a.png"></figure>'), 'Titre Un deux'.replace(' ', ' '));
});
