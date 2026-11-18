/* fun.js: small, light touches of motion on top of app.js. Turns itself off with reduced motion. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const $ = (s) => document.querySelector(s);
  const fine = matchMedia('(pointer: fine)').matches;

  // 1. hero parallax: the receipt and the glow drift a little as you scroll
  const art = $('.receipt-art'), glow = $('.glow');
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = Math.min(scrollY, 900);
      if (art) art.style.translate = `0 ${y * 0.1}px`;
      if (glow) glow.style.translate = `0 ${y * 0.18}px`;
      ticking = false;
    });
  }, { passive: true });

  // 2. magnetic main buttons (mouse only)
  if (fine) document.querySelectorAll('.btn.primary, .fab').forEach((b) => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      b.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.18}px ${(e.clientY - r.top - r.height / 2) * 0.25}px`;
    });
    b.addEventListener('pointerleave', () => (b.style.translate = ''));
  });

  // 3. the big total gets a soft shine every time it changes
  const res = $('#result');
  if (res) {
    let last = '';
    new MutationObserver(() => {
      const big = $('#big'); if (!big) return;
      const v = big.textContent;
      if (v === last) return; last = v;
      clearTimeout(big._t);
      big._t = setTimeout(() => { big.classList.remove('shine2'); void big.offsetWidth; big.classList.add('shine2'); }, 520);
    }).observe(res, { childList: true, subtree: true, characterData: true });
  }
})();
