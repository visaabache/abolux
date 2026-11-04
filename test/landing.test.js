import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LANDINGS, landingPage } from '../src/landing.js';

const ctx = { lang: 'ar', settings: { store_name: 'Abolux', announcement_ar: 'توصيل مجاني ابتداءً من 500 درهم' }, categories: [{ id: 1, slug: 'mode', name_ar: 'الأزياء' }], origin: 'https://abolux.store', cur: 'MAD' };
const product = { id: 42, slug: 'h69-plus', name_ar: 'طقم H69 Plus', price: 399, compare_price: 699, stock: 8, images: '[]' };

test('H69 Plus landing: Darija copy, price and saving from the product, order form wired to it', () => {
  const html = landingPage(ctx, LANDINGS['h69-plus'], product);
  assert.match(html, /<html lang="ar" dir="rtl">/);
  assert.match(html, /هدية كتخليها/);
  assert.match(html, /<ul class="lp-pieces">/);
  assert.match(html, /399.درهم/);
  assert.match(html, /−43%/);
  assert.match(html, /باقي غير 8 فالستوك/);
  assert.match(html, /<form class="buy lp-form" id="order" novalidate data-product="42"/);
  assert.match(html, /name="go" value="order"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/abolux.store\/ar\/lp\/h69-plus">/);
});

test('landing pages hide the menus, tab bar and store announcement', () => {
  const html = landingPage(ctx, LANDINGS['h69-plus'], product);
  assert.match(html, /class="page-landing bare"/);
  assert.doesNotMatch(html, /class="main-nav"|class="tabbar"|class="chips"/);
  assert.doesNotMatch(html, /500 درهم/);
});

test('sold out: no order form, a message instead', () => {
  const html = landingPage(ctx, LANDINGS['h69-plus'], { ...product, stock: 0 });
  assert.doesNotMatch(html, /id="order"/);
  assert.match(html, /سالا الستوك/);
});

test('vegetable cutter landing: calls to action that carry a value, reviews only when real ones are added', () => {
  const cutter = { id: 7, slug: 'produit-mw2ix4i4', name_ar: 'قطاعة الخضراوات', price: 220, stock: null, images: '["/img/p/a.webp","/img/p/b.webp"]' };
  const html = landingPage(ctx, LANDINGS.qatta3a, cutter);
  assert.match(html, /وصباعك سالمين/);
  assert.match(html, /<a class="lpx-cta" href="#order"><b>إيه، بغيت نربح الوقت فالكوزينة 👈<\/b><span>220.درهم · التوصيل فابور<\/span><\/a>/);
  assert.ok((html.match(/class="lpx-cta"/g) || []).length >= 4);
  assert.doesNotMatch(html, /lpx-reviews/);
  assert.match(html, /src="\/img\/p\/a.webp"/);
  assert.match(html, /<span>المنتج<\/span><span data-q-sub>/);
  const withReviews = landingPage(ctx, { ...LANDINGS.qatta3a, reviews: [{ name: 'Fatima', city: 'Rabat', text: 'Top', stars: 5 }] }, cutter);
  assert.match(withReviews, /class="lpx-reviews"/);
});
