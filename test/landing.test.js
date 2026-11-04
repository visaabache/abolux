import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LANDINGS, landingPage } from '../src/landing.js';

const ctx = { lang: 'ar', settings: { store_name: 'Abolux', announcement_ar: 'توصيل مجاني ابتداءً من 500 درهم' }, categories: [{ id: 1, slug: 'mode', name_ar: 'الأزياء' }], origin: 'https://abolux.store', cur: 'MAD' };
const product = { id: 42, slug: 'h69-plus', name_ar: 'طقم H69 Plus', price: 399, compare_price: 699, stock: 8, images: '[]' };

test('H69 Plus landing: Darija copy, price and saving from the product, order form wired to it', () => {
  const html = landingPage(ctx, LANDINGS['h69-plus'], product);
  assert.match(html, /<html lang="ar" dir="rtl">/);
  assert.match(html, /طقم H69 Plus الملكي/);
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
