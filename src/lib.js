// Small helpers shared by the storefront, the public API and the admin API.

export const LANGS = ['ar', 'fr', 'en'];
export const DEFAULT_LANG = 'fr';

// Order statuses, in the order they usually happen. "cancelled" and "returned" put the stock back.
export const STATUSES = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];
export const RESTOCK_STATUSES = ['cancelled', 'returned'];

// Cities offered at checkout. Shipping can be set per city in the admin (Réglages).
export const CITIES = [
  'Casablanca', 'Rabat', 'Salé', 'Témara', 'Kénitra', 'Mohammedia', 'Marrakech', 'Fès', 'Meknès', 'Tanger',
  'Tétouan', 'Agadir', 'Oujda', 'El Jadida', 'Safi', 'Béni Mellal', 'Khouribga', 'Settat', 'Berrechid',
  'Nador', 'Al Hoceïma', 'Larache', 'Ksar El Kébir', 'Taza', 'Errachidia', 'Ouarzazate', 'Essaouira',
  'Laâyoune', 'Dakhla', 'Guelmim', 'Tiznit', 'Taroudant', 'Inezgane', 'Khémisset', 'Berkane',
];

// Every city the order form suggests as the customer types: [name used in orders, Arabic name, other spellings].
// The first ones are the CITIES above; the rest are smaller towns. Any other town can still be typed in full.
const CITY_DATA = [
  ['Casablanca', 'الدار البيضاء', 'casa kaza dar el beida كازا كازابلانكا'], ['Rabat', 'الرباط', ''], ['Salé', 'سلا', 'sale sla'],
  ['Témara', 'تمارة', 'temara'], ['Kénitra', 'القنيطرة', 'kenitra'], ['Mohammedia', 'المحمدية', 'fedala'],
  ['Marrakech', 'مراكش', 'marrakesh marrakch'], ['Fès', 'فاس', 'fes fez'], ['Meknès', 'مكناس', 'meknes'],
  ['Tanger', 'طنجة', 'tangier tanja'], ['Tétouan', 'تطوان', 'tetouan tetuan'], ['Agadir', 'أكادير', 'agadir'],
  ['Oujda', 'وجدة', 'wjda'], ['El Jadida', 'الجديدة', 'jadida'], ['Safi', 'آسفي', 'asfi'],
  ['Béni Mellal', 'بني ملال', 'beni mellal'], ['Khouribga', 'خريبكة', ''], ['Settat', 'سطات', ''],
  ['Berrechid', 'برشيد', ''], ['Nador', 'الناظور', ''], ['Al Hoceïma', 'الحسيمة', 'al hoceima hoceima'],
  ['Larache', 'العرائش', ''], ['Ksar El Kébir', 'القصر الكبير', 'ksar el kebir'], ['Taza', 'تازة', ''],
  ['Errachidia', 'الرشيدية', 'rachidia'], ['Ouarzazate', 'ورزازات', ''], ['Essaouira', 'الصويرة', 'souira'],
  ['Laâyoune', 'العيون', 'laayoune layoune'], ['Dakhla', 'الداخلة', ''], ['Guelmim', 'كلميم', 'goulmim'],
  ['Tiznit', 'تيزنيت', ''], ['Taroudant', 'تارودانت', ''], ['Inezgane', 'إنزكان', ''],
  ['Khémisset', 'الخميسات', 'khemisset'], ['Berkane', 'بركان', ''],
  ['Aït Melloul', 'أيت ملول', 'ait melloul'], ['Bouskoura', 'بوسكورة', ''], ['Dar Bouazza', 'دار بوعزة', ''],
  ['Aïn Harrouda', 'عين حرودة', 'ain harrouda'], ['Tit Mellil', 'تيط مليل', ''], ['Médiouna', 'مديونة', 'mediouna'],
  ['Had Soualem', 'حد السوالم', ''], ['Bouznika', 'بوزنيقة', ''], ['Benslimane', 'بنسليمان', 'ben slimane'],
  ['Skhirat', 'الصخيرات', ''], ['Tamesna', 'تامسنا', ''], ['Azemmour', 'أزمور', ''], ['Sidi Bennour', 'سيدي بنور', ''],
  ['Youssoufia', 'اليوسفية', ''], ['Ben Guerir', 'ابن جرير', 'benguerir'], ['Kelâat Sraghna', 'قلعة السراغنة', 'kelaa sraghna'],
  ['Fquih Ben Salah', 'الفقيه بن صالح', ''], ['Kasba Tadla', 'قصبة تادلة', ''], ['Oued Zem', 'وادي زم', ''],
  ['Khénifra', 'خنيفرة', 'khenifra'], ['Azrou', 'أزرو', ''], ['Ifrane', 'إفران', ''], ['Midelt', 'ميدلت', ''],
  ['El Hajeb', 'الحاجب', ''], ['Sefrou', 'صفرو', ''], ['Taounate', 'تاونات', ''], ['Sidi Kacem', 'سيدي قاسم', ''],
  ['Sidi Slimane', 'سيدي سليمان', ''], ['Souk El Arbaa', 'سوق الأربعاء', ''], ['Ouazzane', 'وزان', ''],
  ['Chefchaouen', 'شفشاون', 'chaouen'], ['Asilah', 'أصيلة', 'assilah'], ['Fnideq', 'الفنيدق', ''], ['Martil', 'مرتيل', ''],
  ['M’diq', 'المضيق', 'mdiq'], ['Guercif', 'جرسيف', ''], ['Taourirt', 'تاوريرت', ''], ['Jerada', 'جرادة', ''],
  ['Zaïo', 'زايو', 'zaio'], ['Al Aroui', 'العروي', ''], ['Driouch', 'الدريوش', ''], ['Imzouren', 'إمزورن', ''],
  ['Figuig', 'فكيك', ''], ['Zagora', 'زاكورة', ''], ['Tinghir', 'تنغير', ''], ['Biougra', 'بيوكرى', ''],
  ['Oulad Teima', 'أولاد تايمة', ''], ['Tan-Tan', 'طانطان', 'tantan'], ['Smara', 'السمارة', ''], ['Boujdour', 'بوجدور', ''],
];

// For matching what a customer typed: no accents, no case, no spaces or dashes, and one spelling of the Arabic letters
// that are often typed differently (أ إ آ → ا, ة → ه, ى → ي).
export function cityKey(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f\u064b-\u065f]/g, '')
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^a-z0-9\u0621-\u064a]/g, '');
}

// The list sent to the order form's suggestions: [name, Arabic name, other spellings].
export const CITY_SUGGEST = CITY_DATA;

// A typed city in its usual spelling ("casa", "الدار البيضاء", "FES" → "Casablanca", "Casablanca", "Fès"),
// or the text as typed when it is a town that isn't in the list.
export function matchCity(input) {
  const text = String(input ?? '').trim().replace(/\s+/g, ' ').slice(0, 60);
  const k = cityKey(text);
  if (!k) return text;
  for (const [name, ar, more] of CITY_DATA) {
    // "محمدية" is also "المحمدية".
    if (cityKey(name) === k || cityKey(ar) === k || cityKey(ar.replace(/^ال/, '')) === k || more.split(' ').some((m) => m && cityKey(m) === k)) return name;
  }
  return text;
}

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

// Prices are whole dirhams. Moroccan shops write Latin digits in all three languages.
export function money(amount, lang) {
  const n = Math.round(Number(amount) || 0);
  const digits = String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : ' ');
  const sign = n < 0 ? '-' : '';
  if (lang === 'ar') return `${sign}${digits} درهم`;
  if (lang === 'en') return `${sign}MAD ${digits}`;
  return `${sign}${digits} DH`;
}

// Accepts 06 12 34 56 78, 0612345678, +212 6 12 34 56 78, 00212612345678 (also 05 landlines and 07).
// Returns the international form 212XXXXXXXXX, or null when it is not a Moroccan number.
export function normalizePhone(input) {
  let d = String(input ?? '').replace(/[\s.\-()]/g, '');
  if (d.startsWith('+')) d = d.slice(1);
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('212')) d = d.slice(3);
  if (d.startsWith('0')) d = d.slice(1);
  return /^[5-7]\d{8}$/.test(d) ? `212${d}` : null;
}

export function displayPhone(intl) {
  const d = String(intl || '');
  return d.startsWith('212') && d.length === 12 ? `0${d.slice(3, 4)} ${d.slice(4).replace(/(\d{2})(?=\d)/g, '$1 ')}` : d;
}

export function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function parseJSON(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

export function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers },
  });
}

// A short, salted hash of the visitor's IP address: enough to count their attempts, not to identify them.
export async function visitorId(request, salt = '') {
  const ip = request.headers.get('cf-connecting-ip') || 'local';
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:${ip}`));
  return [...new Uint8Array(d).slice(0, 12)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Number of hits recorded for a bucket in the last `seconds`.
export async function recentHits(db, bucket, seconds) {
  const row = await db.prepare('SELECT COUNT(*) AS n FROM rate_hits WHERE bucket = ? AND at > ?').bind(bucket, Date.now() - seconds * 1000).first();
  return row?.n || 0;
}

export async function addHit(db, bucket) {
  await db.batch([
    db.prepare('INSERT INTO rate_hits (bucket, at) VALUES (?, ?)').bind(bucket, Date.now()),
    // Keep the table small: nothing older than two days is ever looked at.
    db.prepare('DELETE FROM rate_hits WHERE at < ?').bind(Date.now() - 2 * 864e5),
  ]);
}

// Browsers send Origin on cross-site writes; refuse any that does not come from this site.
export function sameOrigin(request, url) {
  const origin = request.headers.get('origin');
  return !origin || origin === url.origin;
}

// Checks the first bytes of an upload so a file can't pretend to be a photo.
export function looksLikeImage(bytes, type) {
  const b = new Uint8Array(bytes.slice ? bytes.slice(0, 16) : bytes);
  const ascii = (from, to) => String.fromCharCode(...b.slice(from, to));
  if (type === 'image/jpeg') return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  if (type === 'image/png') return b[0] === 0x89 && ascii(1, 4) === 'PNG';
  if (type === 'image/gif') return ascii(0, 4) === 'GIF8';
  if (type === 'image/webp') return ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP';
  if (type === 'image/avif') return ascii(4, 8) === 'ftyp' && /avi[fs]/.test(ascii(8, 12));
  return false;
}

// MP4 and QuickTime files start with a box whose type is "ftyp"; WebM starts with the EBML header.
export function looksLikeVideo(bytes, type) {
  const b = new Uint8Array(bytes.slice ? bytes.slice(0, 16) : bytes);
  const ascii = (from, to) => String.fromCharCode(...b.slice(from, to));
  if (type === 'video/mp4' || type === 'video/quicktime') return ascii(4, 8) === 'ftyp';
  if (type === 'video/webm') return b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3;
  return false;
}

export function randomToken(bytes = 16) {
  const a = crypto.getRandomValues(new Uint8Array(bytes));
  return [...a].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Order numbers like 241022-7KQ3: the date plus 4 random characters, easy to read out on the phone.
export function orderNumber(date = new Date()) {
  const ymd = date.toISOString().slice(2, 10).replace(/-/g, '');
  const alphabet = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  const r = crypto.getRandomValues(new Uint8Array(4));
  return `${ymd}-${[...r].map((b) => alphabet[b % alphabet.length]).join('')}`;
}

// Shipping for a city: a per-city rate if one is set, else the default; free above the threshold.
export function shippingFor(city, subtotal, settings) {
  const free = Number(settings.free_shipping_over) || 0;
  if (free > 0 && subtotal >= free) return 0;
  const rates = parseJSON(settings.shipping_rates || '{}', {});
  if (city && rates[city] != null) return Math.max(0, Math.round(Number(rates[city]) || 0));
  return Math.max(0, Math.round(Number(settings.shipping_fee) || 0));
}

export function productName(p, lang) {
  return p[`name_${lang}`] || p.name_fr || p.name_en || p.name_ar || '';
}

export function productDesc(p, lang) {
  return p[`desc_${lang}`] || p.desc_fr || p.desc_en || p.desc_ar || '';
}

export function productImages(p) {
  const list = parseJSON(p.images || '[]', []);
  return Array.isArray(list) ? list.filter((u) => typeof u === 'string' && u) : [];
}

// Product options (variants): groups such as Colour or Size, each with values the customer picks one of.
// Stored as JSON in products.options:
//   [{ name: {ar, fr, en}, type: 'text' | 'color', values: [{ label, color, price }] }]
// `price` is added to (or, when negative, taken from) the product price for that choice.
// Older products hold a plain comma list ("S, M, L"); it is read as one unnamed group.
const OPTION_SEP = ' / ';
const cleanLabel = (v) => String(v ?? '').replace(/\s*\/\s*/g, '/').replace(/[\u0000-\u001f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 40);

// With quantity offers the column holds an object instead: { groups: [...], bundles: [...] } (see cleanBundles).
function optionsData(raw) {
  if (typeof raw !== 'string') return raw;
  const text = raw.trim();
  if (!text) return [];
  if (text.startsWith('[') || text.startsWith('{')) return parseJSON(text, []);
  return [{ values: text.split(',').map((label) => ({ label })) }];
}

export function cleanOptions(raw) {
  let list = optionsData(raw);
  if (list && !Array.isArray(list) && typeof list === 'object') list = list.groups;
  if (!Array.isArray(list)) return [];
  const groups = [];
  for (const g of list.slice(0, 6)) {
    if (!g || typeof g !== 'object') continue;
    const n = g.name && typeof g.name === 'object' ? g.name : { fr: g.name };
    const name = Object.fromEntries(['ar', 'fr', 'en'].map((l) => [l, String(n[l] ?? '').trim().slice(0, 40)]));
    const type = g.type === 'color' ? 'color' : 'text';
    const seen = new Set();
    const values = [];
    for (const v of Array.isArray(g.values) ? g.values.slice(0, 40) : []) {
      const label = cleanLabel(typeof v === 'object' && v ? v.label : v);
      if (!label || seen.has(label)) continue;
      seen.add(label);
      const price = Math.max(-100000, Math.min(100000, Math.round(Number(v?.price) || 0)));
      const color = /^#[0-9a-f]{6}$/i.test(v?.color || '') ? v.color.toLowerCase() : '';
      values.push({ label, ...(type === 'color' ? { color: color || '#cccccc' } : {}), price });
    }
    if (values.length) groups.push({ name, type, values });
  }
  return groups;
}

export function productOptions(p) {
  return cleanOptions(p.options || '');
}

// Quantity offers ("2 for 340 DH, 3 for 480 DH"): each one is a number of pieces and the price for all of them
// at the product's base price, with an optional title per language and a "most popular" flag.
//   [{ qty, price, label: {ar, fr, en}, hot }]
// One piece at the normal price is always offered first, so only offers from 2 pieces up are stored.
export function cleanBundles(raw) {
  const data = optionsData(raw);
  const list = Array.isArray(data) ? null : data?.bundles;
  if (!Array.isArray(list)) return [];
  const byQty = new Map();
  for (const b of list.slice(0, 8)) {
    const qty = Math.floor(Number(b?.qty));
    const price = Math.round(Number(b?.price));
    if (!(qty >= 2 && qty <= 20) || !(price > 0) || price > 10000000 || byQty.has(qty)) continue;
    const l = b.label && typeof b.label === 'object' ? b.label : {};
    const label = Object.fromEntries(['ar', 'fr', 'en'].map((k) => [k, String(l[k] ?? '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 60)]));
    byQty.set(qty, { qty, price, label, hot: Boolean(b.hot) });
  }
  return [...byQty.values()].sort((a, b) => a.qty - b.qty).slice(0, 5);
}

export function productBundles(p) {
  return cleanBundles(p.options || '');
}

// "Only 7 pieces left in the offer": a number set per product in admin, counted down by each order.
// null when the product has none of its own (the store-wide number from the settings is then used).
export function cleanLeft(value) {
  if (value === '' || value == null) return null;
  const n = Math.floor(Number(value));
  return Number.isFinite(n) && n >= 0 ? Math.min(n, 9999) : null;
}

// The store-wide number from the settings: 7 until the owner saves another one (empty hides the line).
export const DEFAULT_OFFER_LEFT = 7;
export function storeLeft(settings) {
  return settings?.offer_left === undefined ? DEFAULT_OFFER_LEFT : cleanLeft(settings.offer_left);
}

export function productLeft(p) {
  const data = optionsData(p.options || '');
  return data && !Array.isArray(data) && typeof data === 'object' ? cleanLeft(data.left) : null;
}

// What goes in products.options: the plain list of groups, or an object when the product has offers
// or its own "pieces left" number.
export function packOptions(groups, bundles, left = null) {
  const g = cleanOptions(groups);
  const b = cleanBundles({ bundles });
  const l = cleanLeft(left);
  if (b.length || l != null) return JSON.stringify({ groups: g, bundles: b, ...(l != null ? { left: l } : {}) });
  return g.length ? JSON.stringify(g) : '';
}

// The offers that are real discounts for this product's current price (an offer typed before a price cut is dropped).
export function liveBundles(p) {
  return productBundles(p).filter((b) => b.price < p.price * b.qty);
}

// Price of `qty` pieces: the biggest offer that fits, then any extra pieces at the normal price.
// `extra` is the per-piece price change of the chosen colour/size, added to every piece.
export function bundleTotal(bundles, base, extra, qty) {
  const unit = Math.max(0, base + extra);
  const tier = [...bundles].reverse().find((b) => b.qty <= qty && b.price < base * b.qty) || null;
  if (!tier) return { total: unit * qty, tier: null, saved: 0 };
  const total = Math.max(0, tier.price + extra * tier.qty) + (qty - tier.qty) * unit;
  return { total, tier, saved: unit * qty - total };
}

export function bundleTitle(b, lang) {
  return b.label[lang] || '';
}

const OFFER_TEXT = {
  ar: (n) => `عرض ${n} ${n <= 10 ? 'قطع' : 'قطعة'}`,
  fr: (n) => `Offre ${n} pièces`,
  en: (n) => `${n}-piece offer`,
};

// What an order line shows next to the product name: the colour/size and, when it applied, the offer.
export function lineText(line, lang) {
  const parts = [choiceText(line.choice, lang)];
  if (line.bundle) parts.push(bundleTitle(line.bundle, lang) || (OFFER_TEXT[lang] || OFFER_TEXT.fr)(line.bundle.qty));
  return parts.filter(Boolean).join(' · ');
}

// Order lines are stored with a whole-dirham price per piece. When an offer doesn't divide evenly
// (3 for 500 DH), the line is split into two rows (1 × 166 + 2 × 167) so the rows still add up exactly.
export function splitLine(total, qty) {
  const low = Math.floor(total / qty);
  const high = total - low * qty;
  return [
    { price: low, qty: qty - high },
    { price: low + 1, qty: high },
  ].filter((r) => r.qty > 0);
}

export function optionGroupName(g, lang) {
  return g.name[lang] || g.name.fr || g.name.en || g.name.ar || '';
}

// The cart keeps a choice as the picked labels joined in group order ("Rouge / M").
// Returns the matching values and the price change, or null when it isn't a valid choice.
export function resolveChoice(groups, key) {
  if (!groups.length) return { key: '', picks: [], extra: 0 };
  const parts = String(key ?? '').split(OPTION_SEP);
  if (parts.length !== groups.length) return null;
  const picks = [];
  for (let i = 0; i < groups.length; i++) {
    const v = groups[i].values.find((x) => x.label === parts[i]);
    if (!v) return null;
    picks.push({ group: groups[i], value: v });
  }
  return { key: parts.join(OPTION_SEP), picks, extra: picks.reduce((s, x) => s + x.value.price, 0) };
}

// "Couleur : Rouge · Taille : M" for orders, emails and the cart.
export function choiceText(choice, lang) {
  if (!choice) return '';
  return choice.picks
    .map(({ group, value }) => {
      const n = optionGroupName(group, lang);
      return n ? `${n}: ${value.label}` : value.label;
    })
    .join(' · ');
}

export async function getSettings(db) {
  const { results } = await db.prepare('SELECT key, value FROM settings').all();
  return Object.fromEntries(results.map((r) => [r.key, r.value]));
}

// Prices a cart against the database. Unknown, inactive or out-of-stock products are dropped,
// quantities are capped by stock, and an option must be one the product offers.
export async function quote(db, rawItems, city, settings) {
  const items = (Array.isArray(rawItems) ? rawItems : []).slice(0, 50);
  const ids = [...new Set(items.map((i) => Number(i?.id)).filter((n) => Number.isInteger(n) && n > 0))];
  if (!ids.length) return { lines: [], subtotal: 0, shipping: 0, total: 0, issues: [] };
  const { results } = await db
    .prepare(`SELECT * FROM products WHERE active = 1 AND id IN (${ids.map(() => '?').join(',')})`)
    .bind(...ids)
    .all();
  const byId = new Map(results.map((p) => [p.id, p]));
  const lines = [];
  const issues = [];
  const used = new Map();
  for (const item of items) {
    const p = byId.get(Number(item?.id));
    if (!p) {
      issues.push({ id: item?.id, issue: 'unavailable' });
      continue;
    }
    const choice = resolveChoice(productOptions(p), item.option);
    if (!choice) {
      issues.push({ id: p.id, issue: 'option' });
      continue;
    }
    const option = choice.key;
    const unit = Math.max(0, p.price + choice.extra);
    let qty = Math.min(20, Math.max(1, Math.floor(Number(item.qty) || 1)));
    if (p.stock != null) {
      const left = p.stock - (used.get(p.id) || 0);
      if (left <= 0) {
        issues.push({ id: p.id, issue: 'stock' });
        continue;
      }
      if (qty > left) {
        qty = left;
        issues.push({ id: p.id, issue: 'qty' });
      }
    }
    used.set(p.id, (used.get(p.id) || 0) + qty);
    const deal = bundleTotal(productBundles(p), p.price, choice.extra, qty);
    lines.push({ product: p, id: p.id, option, choice, qty, price: unit, total: deal.total, bundle: deal.tier, saved: deal.saved });
  }
  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  // Delivery is included in the product prices (free delivery, cash on delivery), so nothing is added on top.
  const shipping = 0;
  return { lines, subtotal, shipping, total: subtotal + shipping, issues };
}
