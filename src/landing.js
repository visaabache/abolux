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

  const contents = [
    ['⌚', 'الساعة الذكية (Smart Watch)', 'شاشة AMOLED كبيرة 2.02 بوصة، تصميم ذهبي أنيق وحزام مريح.'],
    ['💎', 'ساعة بيجو كلاسيكية', 'مرصعة بالأحجار اللامعة مع ميناء أخضر ملكي، مثالية للمناسبات.'],
    ['💚', 'عقد (سلسلة)', 'بقلادة على شكل قلب بلون أخضر زمردي كيجبد العين.'],
    ['✨', 'سوار (Gourmette)', 'مرصع بأحجار خضراء متناسقة مع العقد.'],
    ['💍', 'خاتم أنيق', 'قابل للتعديل، كيجي على قد صبعك، بنفس الحجرة الخضراء.'],
    ['🌟', 'حلق (Double Earrings)', 'كيكمّل الأناقة ديال وجهك.'],
    ['🎀', 'إكسسوار ديال الزينة', 'قطعة ذهبية مرصعة كتزيد اللمسة الملكية.'],
    ['🔗', 'سلسلة إضافية', 'باش تبدلي الطول ولا الستايل كيف بغيتي.'],
    ['🩷', 'حزام إضافي للساعة الذكية', 'بدلي اللون ديال الساعة حسب اللبسة ديالك.'],
    ['🔌', 'كابل الشحن + بانس صغيرة', 'كلشي اللي محتاجة باش تبداي من النهار الأول.'],
  ];
  const watch = [
    ['📞', 'كتجاوبي على المكالمات', 'من الساعة نيشان، بلا ما تخرجي التيليفون.'],
    ['💬', 'كتوصلك الإشعارات', 'الرسائل وواتساب والتطبيقات، كلشي قدامك.'],
    ['❤️', 'كتتبع صحتك', 'نبضات القلب، النعاس، والخطوات ديال كل نهار.'],
    ['🌈', 'شاشة AMOLED', 'واضحة بزاف وبألوان زاهية، حتى فالشمس.'],
  ];
  const why = [
    ['💎', 'تناسق كامل', 'كاع القطع ذهبيين بالحجر الأخضر (Emerald Green): لوك ملكي موحد من راسك حتى ليديك.'],
    ['🎁', 'هدية واجدة', 'علبة وردية فاخرة، ما محتاجاش تغلفيها. غير عطيها وشوفي الفرحة.'],
    ['💰', 'ثمن واحد لـ10 قطع', 'بلاصة ما تشري كل قطعة بوحدها وتخسري بزاف، كلشي فطقم واحد.'],
    ['👑', 'لكل مناسبة', 'العرس، الخطوبة، عيد الميلاد، عيد الأم… ولا غير باش تدللي راسك.'],
  ];
  const faq = [
    ['واش التوصيل فابور؟', 'إيه، التوصيل فابور لجميع المدن ديال المغرب. الثمن اللي كتشوفي هو اللي غادي تخلصي.'],
    ['إمتى غادي يوصلني الطقم؟', 'من 24 حتى 72 ساعة فالمدن الكبار، ومن 2 حتى 5 أيام فالمدن لخرين، من بعد ما نأكدو معاك.'],
    ['كيفاش غادي نخلص؟', 'كتخلصي كاش للموزع ملي يوصلك الطقم. ما كاين لا كارط بنكية لا خلاص فالأنترنيت.'],
    ['واش الساعة الذكية كتخدم مع التيليفون ديالي؟', 'كتخدم مع أغلب التيليفونات أندرويد وآيفون بالبلوتوث. إلا عندك شي شك، سولينا فالواتساب.'],
    ['واش الخاتم غادي يجي على قدي؟', 'إيه، الخاتم قابل للتعديل، كيتسع ولا كيضيق على حساب صبعك.'],
    ['وإلا ما عجبنيش؟', 'عندك 7 أيام من نهار التوصل باش ترجعيه. تواصلي معانا فالواتساب ونتفاهمو.'],
  ];
  const cards = (list, cls) => `<ul class="${cls}">${list.map(([e, h, t]) => `<li><span class="lp-emo" aria-hidden="true">${e}</span><div><strong>${esc(h)}</strong><p>${esc(t)}</p></div></li>`).join('')}</ul>`;
  const cta = (txt = 'اطلبي دابا') => `<a class="btn btn-lg lp-cta" href="#order">${esc(txt)} <span aria-hidden="true">👇</span></a>`;
  const priceBlock = `<div class="lp-price"><strong>${price}</strong>${save ? `<s>${esc(money(p.compare_price, lang))}</s><span class="lp-off">−${pct}%</span>` : ''}</div>
    ${save ? `<p class="lp-save">${esc('وفري')} ${esc(money(save, lang))} ${esc('اليوم')} 🔥</p>` : ''}`;

  const body = `<section class="lp-hero">
  <div class="wrap lp-hero-grid">
    <div class="lp-hero-img"><img src="${esc(box)}" alt="${esc('طقم H69 Plus: ساعة ذكية، ساعة بيجو، عقد، سوار، خاتم وحلق')}" width="896" height="1262" fetchpriority="high"></div>
    <div class="lp-hero-text">
      <p class="lp-kicker">🎁 ${esc('طقم هدايا فاخر · 10 قطع فعلبة وحدة')}</p>
      <h1>${esc('طقم H69 Plus الملكي')} 👑</h1>
      <p class="lp-sub">${esc('ساعة ذكية + ساعة بيجو + عقد + سوار + خاتم + حلق… كلشي ذهبي بالحجر الأخضر الزمردي، فعلبة وردية فاخرة.')}</p>
      ${priceBlock}
      ${fewLeft ? `<p class="lp-stock">⚡ ${esc('باقي غير')} ${p.stock} ${esc('فالستوك')}</p>` : ''}
      ${soldOut ? `<p class="lp-stock">${esc('سالا الستوك دابا، رجعي قريب إن شاء الله')}</p>` : cta()}
      <ul class="lp-trust">
        <li>🚚 ${esc('التوصيل فابور لجميع المدن')}</li>
        <li>💵 ${esc('الخلاص ملي توصلك')}</li>
        <li>📞 ${esc('كنعيطو ليك نأكدو قبل الإرسال')}</li>
        <li>↩️ ${esc('7 أيام باش ترجعي')}</li>
      </ul>
    </div>
  </div>
</section>

<section class="wrap lp-section">
  <h2 class="lp-h2">${esc('شنو كاين فالعلبة؟')} 🎁</h2>
  <p class="lp-lead">${esc('10 قطع متناسقين، كلهم فطقم واحد:')}</p>
  <img class="lp-wide" src="${IMG}/contents.webp" alt="${esc('محتويات طقم H69 Plus')}" width="1021" height="682" loading="lazy">
  ${cards(contents, 'lp-list')}
</section>

<section class="lp-band">
  <div class="wrap lp-section">
    <h2 class="lp-h2">${esc('ساعة ذكية كتعاونك فكل نهار')} 📱</h2>
    ${cards(watch, 'lp-grid')}
  </div>
</section>

<section class="wrap lp-section">
  <h2 class="lp-h2">${esc('علاش هاد الطقم غادي يعجبك؟')} 😍</h2>
  ${cards(why, 'lp-grid')}
  <div class="lp-center">${soldOut ? '' : cta('بغيت الطقم ديالي')}</div>
</section>

<section class="lp-gift">
  <div class="wrap lp-gift-grid">
    <img src="${IMG}/box-sm.webp" alt="" width="480" height="676" loading="lazy">
    <div>
      <h2 class="lp-h2">${esc('أحسن هدية ليها… ولا ليك')} 💝</h2>
      <p>${esc('لمراتك، لختك، ليماك، لصاحبتك… ولا غير لراسك. العلبة جاية مصاوبة وفاخرة، كتفرّح من أول نظرة.')}</p>
      <p class="lp-steps-title">${esc('الطلب ساهل فـ3 خطوات:')}</p>
      <ol class="lp-steps">
        <li>${esc('عمّري المعلومات ديالك تحت')}</li>
        <li>${esc('كنعيطو ليك باش نأكدو الطلب')}</li>
        <li>${esc('كيوصلك الطقم وكتخلصي ملي تشوفيه')}</li>
      </ol>
    </div>
  </div>
</section>

<section class="wrap lp-section lp-order-wrap">
  <h2 class="lp-h2 lp-center-text">${esc('اطلبي الطقم ديالك دابا')} 👇</h2>
  ${priceBlock.replace('class="lp-price"', 'class="lp-price lp-price-center"')}
  ${soldOut ? `<p class="lp-stock lp-center-text">${esc('سالا الستوك دابا، رجعي قريب إن شاء الله')}</p>` : `<form class="buy lp-form" id="order" novalidate data-product="${p.id}" data-name="${esc(p.name_ar || p.name_fr)}" data-price="${p.price}" data-image="${esc(box)}" data-slug="${esc(p.slug)}">
    <div class="qty-row">
      <label for="qty">${esc('الكمية')}</label>
      <div class="qty"><button type="button" data-step="-1" aria-label="−">−</button><input id="qty" name="qty" type="number" inputmode="numeric" min="1" max="${p.stock != null ? Math.max(1, Math.min(20, p.stock)) : 20}" value="1"><button type="button" data-step="1" aria-label="+">+</button></div>
    </div>
    <div class="quick">
      <p class="quick-lead">${esc('عمّري المعلومات ديالك فالخانات اللي تحت')}<span class="finger" aria-hidden="true">👇</span></p>
      <div class="quick-fields">
        <label class="qf">${icon('user', 20)}<input name="name" autocomplete="name" required maxlength="80" placeholder="${esc('الإسم الكامل')}" aria-label="${esc('الإسم الكامل')}"></label>
        <label class="qf">${icon('pin', 20)}<select name="city" required aria-label="${esc('المدينة')}"><option value="">${esc('اختاري المدينة ديالك')}</option>${CITIES.map((c) => `<option>${esc(c)}</option>`).join('')}<option value="__other">${esc('مدينة أخرى')}</option></select></label>
        <label class="qf other-city" hidden>${icon('pin', 20)}<input name="city_other" maxlength="60" placeholder="${esc('كتبي المدينة ديالك')}" aria-label="${esc('مدينة أخرى')}"></label>
        <label class="qf">${icon('home', 20)}<input name="address" required maxlength="300" autocomplete="street-address" placeholder="${esc('العنوان (الحي، الزنقة، الرقم)')}" aria-label="${esc('العنوان')}"></label>
        <label class="qf">${icon('phone', 20)}<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="20" dir="ltr" placeholder="${esc('رقم الهاتف · مثال: 06 12 34 56 78')}" aria-label="${esc('رقم الهاتف')}"></label>
        <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      </div>
      <ul class="quick-sum">
        <li><span>${esc('الطقم')}</span><span data-q-sub>${price}</span></li>
        <li><span>${esc('التوصيل')}</span><span data-q-ship class="free">${esc('فابور')}</span></li>
        <li class="total"><span>${esc('المجموع عند الاستلام')}</span><span data-q-total>${price}</span></li>
      </ul>
      <button class="btn btn-block btn-accent btn-lg quick-go" type="submit" name="go" value="order">${icon('check', 22)}<span>${esc('أكدي الطلب ديالي')}</span></button>
      <p class="form-error" role="alert" hidden></p>
    </div>
  </form>`}
</section>

<section class="wrap lp-section lp-faq">
  <h2 class="lp-h2">${esc('أسئلة كتطرحوها علينا')} 🤔</h2>
  <div class="accordion">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div>${esc(a)}</div></details>`).join('')}</div>
</section>
${soldOut ? '' : `<div class="buy-bar" aria-hidden="true"><div><strong>${price}</strong><small>${esc('التوصيل فابور · الخلاص عند الاستلام')}</small></div><a class="btn btn-accent" href="#order" data-buy-now>${esc('اطلبي دابا')}</a></div>`}`;

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
