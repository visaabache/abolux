// Landing pages for ads: one product, one page, one goal (the order form). Each landing is tied to a
// product by its slug, so the price, the old price, the stock and the order all come from the admin.
// The page lives at /<lang>/lp/<slug> (and /lp/<slug> as a short link).

import { layout, icon, optionFieldset } from './render.js';
import { CITIES, esc, money, productImages, productOptions } from './lib.js';

const PLACEHOLDER = '/assets/placeholder.svg';

// The order form shared by every landing page: name, city, address, phone, live total, quantity and button.
// store.js wires it (quickOrder) and sends the order for this one product.
function orderForm(ctx, p, price, image, button, item = 'المنتج') {
  return `<form class="buy lp-form" id="order" novalidate data-product="${p.id}" data-name="${esc(p.name_ar || p.name_fr)}" data-price="${p.price}" data-image="${esc(image)}" data-slug="${esc(p.slug)}">
      ${productOptions(p).map((g, gi) => optionFieldset(ctx, g, gi)).join('')}
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
          <li><span>${esc(item)}</span><span data-q-sub>${price}</span></li>
          <li><span>التوصيل</span><span data-q-ship class="free" data-free="فابور">فابور</span></li>
          <li class="total"><span>المجموع</span><span data-q-total>${price}</span></li>
        </ul>
        <div class="lp-go">
          <div class="qty"><button type="button" data-step="-1" aria-label="−">−</button><input id="qty" name="qty" type="number" inputmode="numeric" min="1" max="${p.stock != null ? Math.max(1, Math.min(20, p.stock)) : 20}" value="1" aria-label="الكمية"><button type="button" data-step="1" aria-label="+">+</button></div>
          <button class="btn quick-go" type="submit" name="go" value="order">${icon('cart', 22)}<span>${esc(button)}</span></button>
        </div>
        <p class="form-error" role="alert" hidden></p>
      </div>
    </form>`;
}

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
    ${soldOut ? '<p class="lp-hurry">سالا الستوك دابا، رجعي قريب إن شاء الله</p>' : orderForm(ctx, p, price, box, 'اطلبي دابا', 'الطقم')}
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

// Rotary vegetable cutter. Simple layout in two colours (green, orange): a strong promise, the problem it
// solves, features turned into benefits, and after each convincing block a call to action that finishes
// its idea and carries a value. Photos are the product's own, in the order set in the admin.
function qatta3a(ctx, p, landing) {
  const lang = ctx.lang;
  const imgs = productImages(p);
  const pic = (i) => imgs[Math.min(i, imgs.length - 1)] || PLACEHOLDER;
  const price = esc(money(p.price, lang));
  const old = p.compare_price && p.compare_price > p.price ? esc(money(p.compare_price, lang)) : '';
  const soldOut = p.stock != null && p.stock <= 0;
  const fewLeft = p.stock != null && p.stock > 0 && p.stock <= 20;
  const reviews = landing.reviews || [];
  const cta = (text, value) => (soldOut ? '' : `<a class="lpx-cta" href="#order"><b>${esc(text)} 👈</b><span>${esc(value)}</span></a>`);
  const photo = (i, alt) => `<img class="lpx-photo" src="${esc(pic(i))}" alt="${esc(alt)}" width="1000" height="1000" loading="lazy">`;

  const body = `<div class="lpx">
<section class="lpx-sec lpx-hero">
  <div class="lp-wrap">
    <p class="lpx-kicker">🥗 قطاعة الخضرة 3 فـ1</p>
    <h1>السلاطة واجدة ف دقيقة… <mark>وصباعك سالمين</mark></h1>
    <p class="lpx-lead">عيّيتي بالمحكّة اللي كتجرح والجنوي اللي كيضيّع ليك الوقت؟ هاد القطاعة <b>كتقطع وكتحك الخضرة والفرماج بدورة يد</b>، بلا كهرباء، ويدك بعيدة على الشفرات.</p>
    <img class="lpx-photo lpx-hero-photo" src="${esc(pic(0))}" alt="قطاعة الخضرة اليدوية مع 3 أسطوانات" width="1000" height="1000" fetchpriority="high">
    ${reviews.length ? `<ul class="lpx-reviews">${reviews.slice(0, 2).map((r) => `<li><span class="lpx-stars" aria-label="${r.stars || 5}/5">${'★'.repeat(r.stars || 5)}</span><p>«${esc(r.text)}»</p><small>${esc(r.name)}${r.city ? ` · ${esc(r.city)}` : ''}</small></li>`).join('')}</ul>` : ''}
    <p class="lpx-price"><strong>${price}</strong>${old ? `<s>${old}</s>` : ''}<span>التوصيل فابور</span></p>
    ${fewLeft ? `<p class="lpx-hurry">⚡ باقي غير ${p.stock} فالستوك</p>` : ''}
    ${soldOut ? '<p class="lpx-hurry">سالا الستوك دابا، رجعي قريب إن شاء الله</p>' : cta('إيه، بغيت نربح الوقت فالكوزينة', `${money(p.price, lang)} · التوصيل فابور`)}
  </div>
</section>

<section class="lpx-sec lpx-soft">
  <div class="lp-wrap">
    <h2>من الخضرة الكاملة… <mark>للتحضير واجد</mark> 👌</h2>
    ${photo(1, 'القطاعة مع الأسطوانات الثلاثة')}
    <ul class="lpx-three">
      <li><i>🥒</i><b>شرائح</b><span>خيار، جزر، بطاطا</span></li>
      <li><i>🥕</i><b>حك خشن</b><span>جزر، فرماج</span></li>
      <li><i>🧀</i><b>حك رقيق</b><span>فرماج، بصل</span></li>
    </ul>
    <p class="lpx-note">3 أسطوانات فقطاعة وحدة: بلاصة 3 ديال الأدوات فالكوزينة.</p>
    ${cta('بغيت 3 فـ1 بثمن وحدة', `غير ${money(p.price, lang)}`)}
  </div>
</section>

<section class="lpx-sec">
  <div class="lp-wrap">
    <h2>علاش غادي <mark>تعجبك</mark>؟</h2>
    ${photo(2, 'القطاعة فالخدمة')}
    <ul class="lpx-benefits">
      <li><i>🖐️</i><div><b>صباعك فأمان</b><span>كتدفعي الخضرة بالدافع، يدك ما كتقربش للشفرات.</span></div></li>
      <li><i>⚡</i><div><b>بلا كهرباء</b><span>دوري المقبض وصافي، فأي بلاصة.</span></div></li>
      <li><i>🧲</i><div><b>ثابتة فالطبلة</b><span>القاعدة كتشد مزيان وما كتزلقش ملي كتخدمي.</span></div></li>
      <li><i>🧽</i><div><b>كتنقى ساهل</b><span>كتفكي الأسطوانة وكتغسليها ف دقيقة.</span></div></li>
    </ul>
    ${cta('إيه، بغيت نحمي صباعي', '+ 3 أسطوانات فالعلبة')}
  </div>
</section>

<section class="lpx-sec lpx-soft">
  <div class="lp-wrap">
    <h2>كيفاش <mark>كتخدم</mark>؟</h2>
    ${photo(3, 'طريقة الاستعمال')}
    <ol class="lpx-steps">
      <li><b>1</b>ركبي الأسطوانة اللي بغيتي</li>
      <li><b>2</b>حطي الخضرة ودفعيها بالدافع</li>
      <li><b>3</b>دوري المقبض… وجمعي التحضير</li>
    </ol>
    ${cta('ساهلة! بغيت ندوزها لكوزينتي', 'كتوصلك ف 24 حتى 72 ساعة')}
  </div>
</section>

<section class="lpx-sec">
  <div class="lp-wrap">
    <div class="lpx-offer">
      ${photo(imgs.length - 1, 'علبة القطاعة')}
      <h2>العرض ديال اليوم</h2>
      <p class="lpx-price lpx-price-big"><strong>${price}</strong>${old ? `<s>${old}</s>` : ''}</p>
      <ul class="lpx-checks">
        <li>القطاعة + 3 أسطوانات</li>
        <li>التوصيل فابور لجميع المدن</li>
        <li>الخلاص ملي توصلك</li>
        <li>7 أيام باش ترجعيها إلا ما عجباتكش</li>
      </ul>
    </div>
  </div>
</section>

<section class="lpx-sec lpx-order" id="commande">
  <div class="lp-wrap">
    <h2>عمّري المعلومات ديالك <mark>وتوصلك لدارك</mark> 👇</h2>
    ${fewLeft ? `<p class="lpx-hurry">⚡ باقي غير ${p.stock} فالستوك</p>` : ''}
    ${soldOut ? '<p class="lpx-hurry">سالا الستوك دابا، رجعي قريب إن شاء الله</p>' : orderForm(ctx, p, price, pic(0), 'أكدي الطلب')}
  </div>
</section>

<section class="lp-wrap lp-faq">
  <div class="accordion">
    <details><summary>واش كتحك الفرماج مزيان؟</summary><div>إيه، الأسطوانة الرقيقة والخشنة بجوج مزيانين للفرماج.</div></details>
    <details><summary>واش صعيبة فالتنقية؟</summary><div>لا، كتفكي الأسطوانة وكتغسليها بالما ف دقيقة.</div></details>
    <details><summary>إمتى غادي توصلني؟</summary><div>من 24 حتى 72 ساعة فالمدن الكبار، و2 حتى 5 أيام فالمدن لخرين.</div></details>
  </div>
</section>
${soldOut ? '' : `<div class="buy-bar" aria-hidden="true"><a class="lp-btn" href="#order" data-buy-now>🛒 اطلبي دابا · ${price}</a></div>`}
</div>`;

  return layout(ctx, {
    title: 'قطاعة الخضرة 3 فـ1',
    seoTitle: 'قطاعة الخضرة اليدوية 3 فـ1: شرائح وحك خشن ورقيق، بلا كهرباء',
    description: 'قطاعة الخضرة والفرماج 3 فـ1 بدورة يد، بلا كهرباء، وصباعك بعاد على الشفرات. التوصيل فابور والخلاص عند الاستلام فجميع مدن المغرب.',
    path: `/lp/qatta3a`,
    body,
    image: pic(0),
    page: 'landing',
    bare: true,
    strip: ['التوصيل فابور لجميع المدن', 'الخلاص عند الاستلام', 'كنعيطو ليك نأكدو قبل الإرسال', '7 أيام باش ترجعي'],
    product: { name: p.name_ar || p.name_fr, price: money(p.price, lang), slug: p.slug },
    track: { event: 'ViewContent', value: p.price, items: [{ id: p.id, name: p.name_ar || p.name_fr, price: p.price, qty: 1 }] },
  });
}

// Electric lunch box 4 in 1. Same simple two-colour structure as the cutter: a strong promise, the
// problem it solves, features turned into benefits, and after each convincing block a call to action
// that finishes its idea and carries a value. Photos are the seller's own, in /assets/lp/lunchbox/.
function lunchbox(ctx, p, landing) {
  const lang = ctx.lang;
  const A = '/assets/lp/lunchbox/';
  const price = esc(money(p.price, lang));
  const old = p.compare_price && p.compare_price > p.price ? esc(money(p.compare_price, lang)) : '';
  const soldOut = p.stock != null && p.stock <= 0;
  const fewLeft = p.stock != null && p.stock > 0 && p.stock <= 20;
  const reviews = landing.reviews || [];
  const cta = (text, value) => (soldOut ? '' : `<a class="lpx-cta" href="#order"><b>${esc(text)} 👈</b><span>${esc(value)}</span></a>`);
  const photo = (file, alt, w, h, extra = '') => `<img class="lpx-photo${extra}" src="${A}${file}" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy">`;

  const body = `<div class="lpx">
<section class="lpx-sec lpx-hero">
  <div class="lp-wrap">
    <p class="lpx-kicker">🍱 البواطة ديال الغدا الكهربائية 4 فـ1</p>
    <h1>ماكلة الدار سخونة فالخدمة… <mark>بلا ميكروند</mark></h1>
    <p class="lpx-lead">عييتي بالماكلة الباردة، ولا بالصف قدام الميكروند، ولا بالفلوس اللي كتمشي كل نهار فالسندويتشات؟ هاد البواطة <b>كتسخن ماكلتك بالبخار ف 10 حتى 15 دقيقة</b>: شوية ديال الما، بوطونة وحدة، وصافي.</p>
    <img class="lpx-photo lpx-hero-photo" src="${A}hero-desk.webp" alt="البواطة الكهربائية فوق المكتب والماكلة سخونة" width="1000" height="1000" fetchpriority="high">
    ${reviews.length ? `<ul class="lpx-reviews">${reviews.slice(0, 2).map((r) => `<li><span class="lpx-stars" aria-label="${r.stars || 5}/5">${'★'.repeat(r.stars || 5)}</span><p>«${esc(r.text)}»</p><small>${esc(r.name)}${r.city ? ` · ${esc(r.city)}` : ''}</small></li>`).join('')}</ul>` : ''}
    <p class="lpx-price"><strong>${price}</strong>${old ? `<s>${old}</s>` : ''}<span>التوصيل فابور</span></p>
    ${fewLeft ? `<p class="lpx-hurry">⚡ باقي غير ${p.stock} فالستوك</p>` : ''}
    ${soldOut ? '<p class="lpx-hurry">سالا الستوك دابا، رجع قريب إن شاء الله</p>' : cta('إيه، بغيت ناكل سخون فالخدمة', `${money(p.price, lang)} · التوصيل فابور`)}
  </div>
</section>

<section class="lpx-sec lpx-soft">
  <div class="lp-wrap">
    <h2>4 بواطات… <mark>4 ماكلات</mark> فبلاصة وحدة 🍲</h2>
    ${photo('box-4-bowls.webp', 'البواطة الكهربائية مع 4 بواطات ديال الإينوكس', 1000, 1000)}
    <ul class="lpx-three">
      <li><i>🥘</i><b>4 بواطات</b><span>إينوكس 304، نص لتر كل وحدة</span></li>
      <li><i>🫙</i><b>2 لتر</b><span>كتكفي غدا كامل وزيادة</span></li>
      <li><i>🧱</i><b>2 طبقات</b><span>كيسخنو بجوج فمرة وحدة</span></li>
    </ul>
    <p class="lpx-note">الطاجين، الروز، الخضرة والفاكية: كل ماكلة فبواطتها، ما كيتخلطوش.</p>
    ${cta('بغيت 4 ماكلات فبواطة وحدة', `غير ${money(p.price, lang)}`)}
  </div>
</section>

<section class="lpx-sec">
  <div class="lp-wrap">
    <h2>علاش غادي <mark>تعجبك</mark>؟</h2>
    ${photo('features.webp', 'مميزات البواطة الكهربائية', 1000, 1000)}
    <ul class="lpx-benefits">
      <li><i>♨️</i><div><b>كتسخن بالبخار من كل جيهة</b><span>الماكلة كتسخن مزيان وكتبقى طرية، ما كتنشفش بحال الميكروند.</span></div></li>
      <li><i>🍚</i><div><b>كتطيب حتى هي</b><span>الروز ف 25 حتى 35 دقيقة، والبيض مسلوق ف 15 حتى 20 دقيقة.</span></div></li>
      <li><i>💧</i><div><b>الغطا ما كيسيلش</b><span>المرقة والصلصة ما يتكبوش فالصاك.</span></div></li>
      <li><i>🛡️</i><div><b>محمية</b><span>فيها حماية إلا نشف الما، وثقوب كيخرجو السخانة الزايدة.</span></div></li>
      <li><i>🎒</i><div><b>ساهلة فالهزان</b><span>مقبض كيتخبى، وقفال من جوج جيهات (وقفال احتياطي معاها).</span></div></li>
      <li><i>🧽</i><div><b>كتغسل بالساهل</b><span>بواطات الإينوكس كيتحيدو، وكيدوزو حتى فماكينة الماعن.</span></div></li>
    </ul>
    ${cta('إيه، بغيت ماكلة صحية كل نهار', '+ 4 بواطات إينوكس فالكرطونة')}
  </div>
</section>

<section class="lpx-sec lpx-soft">
  <div class="lp-wrap">
    <h2>فالخدمة، فالقراية، فالسفر… <mark>وحتى فالدار</mark></h2>
    ${photo('places.webp', 'البواطة فالخدمة، فالدار، فالسفر وفالقراية', 970, 600)}
    <p class="lpx-lead">فين ما كاينة بريز، ماكلتك سخونة. <b>ووفر الفلوس</b> اللي كتخسر كل نهار على الماكلة ديال برا: ماكلة الدار، نقية وصحية.</p>
    ${photo('meal-table.webp', 'البواطة مع 4 بواطات فيهم الماكلة', 990, 1080)}
    ${cta('بغيت نوفر فلوس الماكلة ديال برا', 'ماكلة الدار كل نهار')}
  </div>
</section>

<section class="lpx-sec">
  <div class="lp-wrap">
    <h2>كيفاش <mark>كتخدم</mark>؟</h2>
    ${photo('steps.webp', 'طريقة الاستعمال ف 4 مراحل', 600, 520)}
    <ol class="lpx-steps">
      <li><b>1</b>زيد شوية ديال الما فالتحت</li>
      <li><b>2</b>حط البواطات وسد الغطا</li>
      <li><b>3</b>دخل الكابل وكليكي على البوطونة</li>
      <li><b>4</b>تسنى 10 حتى 15 دقيقة… وكول سخون 😋</li>
    </ol>
    ${cta('ساهلة! بغيتها', 'كتوصلك ف 24 حتى 72 ساعة')}
  </div>
</section>

<section class="lpx-sec lpx-soft">
  <div class="lp-wrap">
    <h2>التفاصيل</h2>
    ${photo('sizes.webp', 'المقاسات ديال البواطة الكهربائية', 1000, 1000)}
    <ul class="lpx-checks">
      <li>المقاس: 25 × 13 × 21 سم</li>
      <li>السعة: 2 لتر (4 بواطات × نص لتر)</li>
      <li>البواطات: إينوكس 304</li>
      <li>البلاستيك: PP صالح للماكلة</li>
      <li>كتخدم ب 220 و 110 فولط</li>
    </ul>
  </div>
</section>

<section class="lpx-sec">
  <div class="lp-wrap">
    <div class="lpx-offer">
      ${photo('in-the-box.webp', 'شنو كاين فالكرطونة', 990, 779, ' lpx-photo-wide')}
      <h2>العرض ديال اليوم</h2>
      <p class="lpx-price lpx-price-big"><strong>${price}</strong>${old ? `<s>${old}</s>` : ''}</p>
      <ul class="lpx-checks">
        <li>البواطة الكهربائية + 4 بواطات إينوكس</li>
        <li>الكابل + ورقة طريقة الاستعمال</li>
        <li>التوصيل فابور لجميع المدن</li>
        <li>الخلاص ملي توصلك</li>
        <li>7 أيام باش ترجعها إلا ما عجباتكش</li>
      </ul>
    </div>
  </div>
</section>

<section class="lpx-sec lpx-order" id="commande">
  <div class="lp-wrap">
    <h2>عمّر المعلومات ديالك <mark>وتوصلك لدارك</mark> 👇</h2>
    ${fewLeft ? `<p class="lpx-hurry">⚡ باقي غير ${p.stock} فالستوك</p>` : ''}
    ${soldOut ? '<p class="lpx-hurry">سالا الستوك دابا، رجع قريب إن شاء الله</p>' : orderForm(ctx, p, price, `${A}box-4-bowls.webp`, 'أكد الطلب', 'البواطة')}
  </div>
</section>

<section class="lp-wrap lp-faq">
  <div class="accordion">
    <details><summary>شحال كتاخد باش تسخن الماكلة؟</summary><div>من 10 حتى 15 دقيقة تقريبا، على حسب الماكلة.</div></details>
    <details><summary>واش خاصني نزيد الما؟</summary><div>إيه، شوية ديال الما فالتحت: هو اللي كيدير البخار اللي كيسخن الماكلة.</div></details>
    <details><summary>واش البواطات كيتغسلو فماكينة الماعن؟</summary><div>إيه، بواطات الإينوكس كيتحيدو وكيتغسلو بالساهل، باليد ولا فماكينة الماعن.</div></details>
    <details><summary>إمتى غادي توصلني؟</summary><div>من 24 حتى 72 ساعة فالمدن الكبار، و2 حتى 5 أيام فالمدن لخرين.</div></details>
  </div>
</section>
${soldOut ? '' : `<div class="buy-bar" aria-hidden="true"><a class="lp-btn" href="#order" data-buy-now>🛒 اطلب دابا · ${price}</a></div>`}
</div>`;

  return layout(ctx, {
    title: 'البواطة ديال الغدا الكهربائية 4 فـ1',
    seoTitle: 'علبة غداء كهربائية 4 في 1 لتسخين الأكل بالبخار، بلا ميكروند',
    description: 'علبة الغداء الكهربائية 4 في 1: كتسخن الماكلة بالبخار ف 10 حتى 15 دقيقة، 4 علب إينوكس، غطاء ما كيسيلش. التوصيل فابور والخلاص عند الاستلام فجميع مدن المغرب.',
    path: `/lp/lunchbox`,
    body,
    image: `${A}hero-desk.webp`,
    page: 'landing',
    bare: true,
    strip: ['التوصيل فابور لجميع المدن', 'الخلاص عند الاستلام', 'كنعيطو ليك نأكدو قبل الإرسال', '7 أيام باش ترجع'],
    product: { name: p.name_ar || p.name_fr, price: money(p.price, lang), slug: p.slug },
    track: { event: 'ViewContent', value: p.price, items: [{ id: p.id, name: p.name_ar || p.name_fr, price: p.price, qty: 1 }] },
  });
}

// slug → { lang, product (its slug in the admin), match (name patterns used when that slug is not found),
//          render, reviews (real customer reviews only) }
export const LANDINGS = {
  'h69-plus': { lang: 'ar', product: 'h69-plus', render: h69Plus },
  qatta3a: { lang: 'ar', product: 'produit-mw2ix4i4', render: qatta3a, reviews: [] },
  lunchbox: { lang: 'ar', product: 'lunchbox', match: ['%lunch%box%', '%lunchbox%', '%غداء%كهرب%', '%boite%repas%', '%boîte%repas%'], render: lunchbox, reviews: [] },
};

export function landingPage(ctx, landing, product) {
  return landing.render(ctx, product, landing);
}
