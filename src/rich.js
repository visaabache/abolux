// Rich product descriptions written in the admin editor (text, headings, lists, links, photos, GIFs,
// videos and YouTube/Vimeo embeds). The HTML is cleaned against an allowlist when it is saved and
// again when it is shown, so pasted content (Word, web pages) can never run scripts on the store.

import { esc } from './lib.js';

// Allowed tags and the attributes each may keep (style and class are filtered further below).
const TAGS = {
  p: ['style'], div: ['style'], span: ['style'], br: [], hr: [],
  strong: [], b: [], em: [], i: [], u: [], s: [], strike: [], sub: [], sup: [], mark: [],
  h2: ['style'], h3: ['style'], h4: ['style'], blockquote: ['style'],
  ul: [], ol: [], li: ['style'],
  table: [], thead: [], tbody: [], tr: [], th: ['colspan', 'rowspan', 'style'], td: ['colspan', 'rowspan', 'style'],
  a: ['href'], figure: ['class'], figcaption: ['style'],
  img: ['src', 'alt', 'class', 'width', 'height'],
  video: ['src', 'poster', 'class', 'autoplay', 'muted', 'loop'],
  iframe: ['src', 'class'],
};
const VOID = new Set(['br', 'hr', 'img']);
// Media is written as one complete element; anything inside it (fallback text, <source>) is dropped.
const SELF_CLOSED = new Set(['video', 'iframe']);
// Content inside these is removed entirely, not just the tags.
const DROP_WITH_CONTENT = new Set(['script', 'style', 'template', 'noscript', 'textarea', 'select', 'svg', 'math', 'head', 'title', 'object', 'embed', 'xml']);
// Blocks that can't sit inside a paragraph: opening one closes the paragraph first, like a browser would.
const BLOCKS = new Set(['p', 'div', 'h2', 'h3', 'h4', 'ul', 'ol', 'table', 'blockquote', 'figure', 'hr', 'video', 'iframe']);
const CLASSES = new Set(['w-25', 'w-50', 'w-75', 'w-100', 'al-left', 'al-center', 'al-right']);
const COLOR = /^(#[0-9a-f]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(,\s*[\d.]+\s*)?\))$/i;
const STYLES = {
  'text-align': (v) => /^(left|right|center|justify|start|end)$/i.test(v),
  color: (v) => COLOR.test(v),
  'background-color': (v) => COLOR.test(v),
  'font-weight': (v) => /^(bold|[4-9]00)$/i.test(v),
  'font-style': (v) => /^italic$/i.test(v),
  'text-decoration': (v) => /^(underline|line-through)$/i.test(v),
  'text-decoration-line': (v) => /^(underline|line-through)$/i.test(v),
};
const EMBED = /^https:\/\/(www\.youtube-nocookie\.com|www\.youtube\.com|player\.vimeo\.com)\/(embed|video)\/[\w-]+(\?[\w=&%.-]*)?$/;
const MAX_LENGTH = 200000;

function decode(s) {
  return s
    .replace(/&#x([0-9a-f]+);?/gi, (_, h) => String.fromCodePoint(parseInt(h, 16) || 0xfffd))
    .replace(/&#(\d+);?/g, (_, d) => String.fromCodePoint(Number(d) || 0xfffd))
    .replace(/&(quot|apos|lt|gt|nbsp|amp);/g, (_, n) => ({ quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', amp: '&' })[n]);
}

function safeUrl(value, kind) {
  const v = decode(value).trim();
  if (/[\u0000-\u001f\u007f]/.test(v)) return '';
  if (kind === 'href') return /^(https?:\/\/|mailto:|tel:|#|\/(?!\/))/i.test(v) ? v : '';
  if (kind === 'embed') return EMBED.test(v) ? v : '';
  return /^(https:\/\/|\/img\/|\/assets\/)/i.test(v) ? v : '';
}

function cleanStyle(value) {
  return decode(value)
    .split(';')
    .map((d) => {
      const i = d.indexOf(':');
      if (i < 0) return '';
      const prop = d.slice(0, i).trim().toLowerCase();
      const val = d.slice(i + 1).trim().replace(/\s*!important$/i, '');
      return STYLES[prop] && STYLES[prop](val) ? `${prop}: ${val}` : '';
    })
    .filter(Boolean)
    .join('; ');
}

function attrs(tag, raw) {
  const out = [];
  const seen = new Set();
  const re = /([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  while ((m = re.exec(raw))) {
    const name = m[1].toLowerCase();
    const value = m[2] ?? m[3] ?? m[4] ?? '';
    if (!TAGS[tag].includes(name) || seen.has(name)) continue;
    seen.add(name);
    let v = value;
    if (name === 'href') v = safeUrl(value, 'href');
    else if (name === 'src') v = safeUrl(value, tag === 'iframe' ? 'embed' : 'src');
    else if (name === 'poster') v = safeUrl(value, 'src');
    else if (name === 'style') v = cleanStyle(value);
    else if (name === 'class') v = decode(value).split(/\s+/).filter((c) => CLASSES.has(c)).join(' ');
    else if (name === 'width' || name === 'height' || name === 'colspan' || name === 'rowspan') v = /^\d{1,4}$/.test(value) ? value : '';
    else if (name === 'autoplay' || name === 'muted' || name === 'loop') {
      out.push(name);
      continue;
    } else v = decode(value).slice(0, 300);
    if (v) out.push(`${name}="${esc(v)}"`);
  }
  return out;
}

export function sanitizeRich(input) {
  const html = String(input || '').slice(0, MAX_LENGTH).replace(/<!--[\s\S]*?(-->|$)|<![^>]*>|<\?[^>]*>/g, '');
  const re = /<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  const out = [];
  const stack = [];
  let skip = null; // tag whose content is being dropped
  let last = 0;
  let m;
  const text = (s) => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  while ((m = re.exec(html))) {
    const [whole, closing, rawTag, rawAttrs] = m;
    const tag = rawTag.toLowerCase();
    if (!skip) out.push(text(html.slice(last, m.index)));
    last = m.index + whole.length;
    if (skip) {
      if (closing && tag === skip) skip = null;
      continue;
    }
    if (DROP_WITH_CONTENT.has(tag)) {
      if (!closing && !/\/\s*$/.test(rawAttrs)) skip = tag;
      continue;
    }
    if (!TAGS[tag]) continue; // unknown tag (font, o:p, section…): keep its text, drop the tag
    if (closing) {
      const at = stack.lastIndexOf(tag);
      if (at < 0) continue;
      while (stack.length > at) out.push(`</${stack.pop()}>`);
      continue;
    }
    if (BLOCKS.has(tag) && stack.includes('p')) {
      const at = stack.lastIndexOf('p');
      while (stack.length > at) out.push(`</${stack.pop()}>`);
    }
    const list = attrs(tag, rawAttrs);
    if ((tag === 'img' || SELF_CLOSED.has(tag)) && !list.some((a) => a.startsWith('src='))) {
      if (SELF_CLOSED.has(tag)) skip = tag;
      continue;
    }
    if (tag === 'a' && list.some((a) => /^href="https?:/i.test(a))) list.push('target="_blank"', 'rel="noopener nofollow"');
    if (tag === 'img') list.push('loading="lazy"');
    if (tag === 'video') list.push('controls', 'playsinline', 'preload="metadata"');
    if (tag === 'iframe') list.push('loading="lazy"', 'allowfullscreen', 'referrerpolicy="strict-origin-when-cross-origin"', 'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"');
    const open = `<${tag}${list.length ? ' ' + list.join(' ') : ''}>`;
    if (VOID.has(tag)) out.push(open);
    else if (SELF_CLOSED.has(tag)) {
      out.push(`${open}</${tag}>`);
      skip = tag;
    } else {
      out.push(open);
      stack.push(tag);
    }
  }
  if (!skip) out.push(text(html.slice(last)));
  while (stack.length) out.push(`</${stack.pop()}>`);
  // Drop the empty paragraphs browsers leave behind, and blank lines at the very end.
  return out.join('').replace(/<p><\/p>/g, '').replace(/(<p>(\s|&nbsp;|<br>)*<\/p>)+$/, '').trim();
}

// Descriptions saved before the editor existed are plain text.
export function isRich(s) {
  return /<\/?(p|br|div|h[2-4]|ul|ol|li|strong|em|b|i|u|s|img|video|figure|iframe|blockquote|span|a|table)\b/i.test(String(s || ''));
}

// HTML for the product page.
export function richHtml(s) {
  if (!s) return '';
  if (isRich(s)) return sanitizeRich(s);
  return String(s)
    .trim()
    .split(/\n\s*\n/)
    .map((para) => `<p>${esc(para).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

// Plain text for the meta description, structured data and search snippets.
export function richText(s) {
  if (!s || !isRich(s)) return String(s || '').trim();
  return decode(
    String(s)
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
      .replace(/<\/(p|div|h[2-4]|li|blockquote|tr|figure)>|<br\s*\/?>/gi, ' ')
      .replace(/<[^>]*>/g, ''),
  )
    .replace(/\s+/g, ' ')
    .trim();
}
