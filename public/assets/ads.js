// Google AdSense, on blog pages only. Nothing is downloaded while the article loads: the AdSense
// script is added once the page has finished loading and the reader scrolls or touches the page
// (or after 4 seconds), so ads never slow the first view. Ads are personalised only when the
// visitor accepted advertising cookies in the consent banner (pixels.js stores that choice).
(function () {
  const cfg = document.getElementById('adsense');
  if (!cfg) return;
  let client = '';
  try {
    client = JSON.parse(cfg.textContent).client || '';
  } catch {}
  if (!/^ca-pub-\d{10,20}$/.test(client)) return;

  let consent = null;
  try {
    consent = localStorage.getItem('consent.ads');
  } catch {}

  let done = false;
  const start = () => {
    if (done) return;
    done = true;
    ['scroll', 'pointerdown', 'keydown'].forEach((e) => removeEventListener(e, start));
    const q = (window.adsbygoogle = window.adsbygoogle || []);
    if (consent !== 'yes') q.requestNonPersonalizedAds = 1;
    const s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    document.head.appendChild(s);
  };
  const arm = () => {
    ['scroll', 'pointerdown', 'keydown'].forEach((e) => addEventListener(e, start, { once: true, passive: true }));
    setTimeout(start, 4000);
  };
  if (document.readyState === 'complete') arm();
  else addEventListener('load', arm, { once: true });
})();
