// Landing pages for ads: one product, one page, one goal (the order form). Each landing is tied to a
// product by its slug, so the price, the old price, the stock and the order all come from the admin.
// The page lives at /<lang>/lp/<slug> (and /lp/<slug> as a short link).

import { layout, icon } from './render.js';
import { CITIES, esc, money, productImages } from './lib.js';

function h69Plus(ctx, p) {
  const lang = ctx.lang;
  const save = p.compare_price && p.compare_price > p.price ? p.compare_price - p.price : 0;
  const pct = save ? Math.round((save / p.compare_price) * 100) : 0;
  const soldOut = p.stock != null && p.stock <= 0;
  const fewLeft = p.stock != null && p.stock > 0 && p.stock <= 20;
  const price = esc(money(p.price, lang));
  const IMG = '/assets/lp/h69-plus';
  const box = productImages(p)[0] || `${IMG}/box.webp`;

  // The page reads like a set of posters: big photos, a few strong words, the order button always in reach.
  const pieces = [
    ['smart-watch', 'ساعة ذكية'],
    ['bijou-watch', 'ساعة بيجو'],
    ['necklace', 'عقد القلب'],
    ['bracelet', 'سوار'],
    ['ring-earrings', 'خاتم + حلق'],
    ['ornament', 'إكسسوار'],
    ['chain', 'سلسلة زايدة'],
    ['strap', 'حزام زايد'],
    ['tweezers', 'بانس'],
    ['charger', 'شارجور'],
  ];
  const faq = [
    ['إمتى غادي يوصلني؟', 'من 24 حتى 72 ساعة فالمدن الكبار، و2 حتى 5 أيام فالمدن لخرين.'],
    ['واش الساعة كتخدم مع التيليفون ديالي؟', 'كتخدم مع أغلب التيليفونات أندرويد وآيفون بالبلوتوث.'],
    ['واش الخاتم غادي يجي على قدي؟', 'إيه، الخاتم قابل للتعديل.'],
  ];
  const cta = (txt) => `<a class="lp-btn" href="#order">${esc(txt)}</a>`;
  const priceBand = `<div class="lp-band-price">
    <div class="lp-band-ship">${icon('truck', 34)}<span>التوصيل<br>فابور</span></div>
    <div class="lp-band-tag">${save ? `<s>${esc(money(p.compare_price, lang))}</s>` : ''}<strong>${esc(String(p.price))}</strong><span>درهم</span></div>
    ${save ? `<span class="lp-sticker">−${pct}%</span>` : ''}
  </div>`;

  const body = `<section class="lp-poster lp-p1">
  <div class="lp-wrap">
    <h1 class="lp-title"><span>هدية كتخليها</span><em>تحس براسها ملكة 👑</em></h1>
    <p class="lp-pill">🎁 10 قطع فعلبة وحدة</p>
    <img class="lp-hero-photo" src="${esc(box)}" alt="طقم H69 Plus: ساعة ذكية، ساعة بيجو، عقد، سوار، خاتم وحلق" width="896" height="1262" fetchpriority="high">
    ${priceBand}
    ${fewLeft ? `<p class="lp-hurry">⚡ باقي غير ${p.stock} فالستوك</p>` : ''}
    ${soldOut ? '<p class="lp-hurry">سالا الستوك دابا، رجعي قريب إن شاء الله</p>' : cta('بغيتها دابا 😍')}
  </div>
</section>

<section class="lp-poster lp-p2">
  <div class="lp-wrap">
    <h2 class="lp-title lp-title-sm"><span>شوفي شنو</span><em>كاين فالعلبة 😍</em></h2>
    <ul class="lp-pieces">${pieces.map(([f, label], i) => `<li><span class="lp-circle"><img src="${IMG}/${f}.webp" alt="${esc(label)}" width="360" height="360" loading="lazy"></span><b class="c${i % 3}">${esc(label)}</b></li>`).join('')}</ul>
  </div>
</section>

<section class="lp-poster lp-p3">
  <img src="${IMG}/box-sm.webp" alt="" width="480" height="676" loading="lazy">
  <div class="lp-p3-text">
    <h2 class="lp-title lp-title-light"><span>فرّحيها…</span><em>ولا دلّلي راسك 💝</em></h2>
    <p class="lp-chips"><span>لمراتك</span><span>ليماك</span><span>لختك</span><span>لراسك</span></p>
  </div>
</section>

<section class="lp-poster lp-p4">
  <div class="lp-wrap">
    <h2 class="lp-title lp-title-sm"><span>ساعة ذكية…</span><em>وأنيقة بحال البيجو ⌚</em></h2>
    <div class="lp-watch">
      <span class="lp-circle lp-circle-xl"><img src="${IMG}/smart-watch.webp" alt="الساعة الذكية H69 Plus" width="360" height="360" loading="lazy"></span>
      <ul class="lp-feats">
        <li><i>📞</i>كتجاوبي على المكالمات</li>
        <li><i>💬</i>كتوصلك الميساجات</li>
        <li><i>❤️</i>كتتبع صحتك</li>
        <li><i>✨</i>شاشة AMOLED كبيرة</li>
      </ul>
    </div>
  </div>
</section>

<section class="lp-poster lp-p5">
  <div class="lp-wrap">
    <ul class="lp-trust3">
      <li><i>🚚</i><b>التوصيل فابور</b><span>لجميع المدن</span></li>
      <li><i>💵</i><b>خلصي ملي توصلك</b><span>بلا كارط بنكية</span></li>
      <li><i>↩️</i><b>7 أيام</b><span>باش ترجعي</span></li>
    </ul>
    <h2 class="lp-title lp-title-sm"><span>الطلب ساهل</span><em>فـ3 خطوات</em></h2>
    <ol class="lp-steps3">
      <li><b>1</b>عمّري الخانات</li>
      <li><b>2</b>كنعيطو ليك نأكدو</li>
      <li><b>3</b>كيوصلك وكتخلصي</li>
    </ol>
  </div>
</section>

<section class="lp-poster lp-order">
  <div class="lp-wrap">
    <h2 class="lp-title lp-title-sm"><span>اطلبي الطقم ديالك</span><em>دابا 👇</em></h2>
    <p class="lp-order-price"><strong>${price}</strong>${save ? ` <s>${esc(money(p.compare_price, lang))}</s>` : ''}</p>
    ${fewLeft ? `<p class="lp-hurry">⚡ باقي غير ${p.stock} فالستوك</p>` : ''}
    ${soldOut ? '<p class="lp-hurry">سالا الستوك دابا، رجعي قريب إن شاء الله</p>' : `<form class="buy lp-form" id="order" novalidate data-product="${p.id}" data-name="${esc(p.name_ar || p.name_fr)}" data-price="${p.price}" data-image="${esc(box)}" data-slug="${esc(p.slug)}">
      <div class="quick">
        <div class="quick-fields">
          <label class="qf">${icon('user', 20)}<input name="name" autocomplete="name" required maxlength="80" placeholder="الإسم الكامل" aria-label="الإسم الكامل"></label>
          <label class="qf">${icon('pin', 20)}<select name="city" required aria-label="المدينة"><option value="">المدينة</option>${CITIES.map((c) => `<option>${esc(c)}</option>`).join('')}<option value="__other">مدينة أخرى</option></select></label>
          <label class="qf other-city" hidden>${icon('pin', 20)}<input name="city_other" maxlength="60" placeholder="كتبي المدينة ديالك" aria-label="مدينة أخرى"></label>
          <label class="qf">${icon('home', 20)}<input name="address" required maxlength="300" autocomplete="street-address" placeholder="العنوان" aria-label="العنوان"></label>
          <label class="qf">${icon('phone', 20)}<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="20" dir="ltr" placeholder="رقم الهاتف" aria-label="رقم الهاتف"></label>
          <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        </div>
        <ul class="quick-sum">
          <li><span>الطقم</span><span data-q-sub>${price}</span></li>
          <li><span>التوصيل</span><span data-q-ship class="free" data-free="فابور">فابور</span></li>
          <li class="total"><span>المجموع</span><span data-q-total>${price}</span></li>
        </ul>
        <div class="lp-go">
          <div class="qty"><button type="button" data-step="-1" aria-label="−">−</button><input id="qty" name="qty" type="number" inputmode="numeric" min="1" max="${p.stock != null ? Math.max(1, Math.min(20, p.stock)) : 20}" value="1" aria-label="الكمية"><button type="button" data-step="1" aria-label="+">+</button></div>
          <button class="btn quick-go" type="submit" name="go" value="order">${icon('cart', 22)}<span>اطلبي دابا</span></button>
        </div>
        <p class="form-error" role="alert" hidden></p>
      </div>
    </form>`}
  </div>
</section>

<section class="lp-wrap lp-faq">
  <div class="accordion">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div>${esc(a)}</div></details>`).join('')}</div>
</section>
${soldOut ? '' : '<div class="buy-bar" aria-hidden="true"><a class="lp-btn" href="#order" data-buy-now>🛍️ اطلبي دابا</a></div>'}`;

  return layout(ctx, {
    title: 'طقم H69 Plus الملكي',
    seoTitle: 'طقم H69 Plus: ساعة ذكية + مجوهرات، هدية فاخرة للنساء',
    description: 'طقم H69 Plus فيه 10 قطع: ساعة ذكية AMOLED، ساعة بيجو، عقد، سوار، خاتم وحلق بالحجر الأخضر. التوصيل فابور والخلاص عند الاستلام فجميع مدن المغرب.',
    path: `/lp/${p.slug}`,
    body,
    image: `${IMG}/box.webp`,
    page: 'landing',
    bare: true,
    strip: ['التوصيل فابور لجميع المدن', 'الخلاص عند الاستلام', 'كنعيطو ليك نأكدو قبل الإرسال', '7 أيام باش ترجعي'],
    product: { name: p.name_ar || p.name_fr, price: money(p.price, lang), slug: p.slug },
    track: { event: 'ViewContent', value: p.price, items: [{ id: p.id, name: p.name_ar || p.name_fr, price: p.price, qty: 1 }] },
  });
}

// slug → { lang, product (its slug in the admin), render }
export const LANDINGS = {
  'h69-plus': { lang: 'ar', product: 'h69-plus', render: h69Plus },
};

export function landingPage(ctx, landing, product) {
  return landing.render(ctx, product);
}
