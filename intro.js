// The Yogadyah title curtain plays on every page load, respecting reduced motion.
(() => {
  const root = document.documentElement;
  const overlay = document.querySelector('#home-intro');
  if (!root.classList.contains('intro-pending') || !overlay) { overlay?.remove(); return; }
  let finished = false, revealed = false;
  const unlock = () => {
    document.querySelectorAll('[data-intro-inert]').forEach(element => {
      element.inert = false; element.removeAttribute('data-intro-inert');
    });
  };
  function reveal() {
    if (revealed) return;
    revealed = true;
    document.dispatchEvent(new Event('yogadyah:intro-ready'));
  }
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(window.yogadyahIntroFallback);
    root.classList.remove('intro-pending', 'intro-revealing');
    document.body.classList.remove('intro-playing');
    overlay.remove(); unlock(); reveal();
    document.removeEventListener('keydown', onKey);
  }
  function onKey(event) { if (event.key === 'Escape') finish(); }
  document.addEventListener('keydown', onKey);
  document.body.classList.add('intro-playing');
  [...document.body.children].forEach(element => {
    if (element === overlay || element.tagName === 'SCRIPT' || element.inert) return;
    element.setAttribute('data-intro-inert', ''); element.inert = true;
  });
  const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
  const fonts = document.fonts?.ready || Promise.resolve();
  Promise.all([Promise.race([fonts, wait(450)]), wait(625)]).then(async () => {
    if (finished) return;
    root.classList.add('intro-revealing'); reveal();
    overlay.querySelector('.intro-title').animate([
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' },
      { opacity: 0, transform: 'translateY(14px)', filter: 'blur(6px)' }
    ], { duration: 150, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
    const curtain = overlay.animate([
      { transform: 'translateY(0)' }, { transform: 'translateY(100%)' }
    ], { duration: 600, delay: 60, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' });
    try { await curtain.finished; } catch {}
    finish();
  });
})();
