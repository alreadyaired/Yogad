
// Shared motion: no input curtain, no nested wheel scrolling, native touch support.
(() => {
  const reduced = document.documentElement.dataset.motion === 'reduce';
  let smoother;
  if (!reduced && typeof window.Lenis === 'function') {
    smoother = new window.Lenis({ autoRaf: true, lerp: .1, wheelMultiplier: .7, smoothWheel: true, syncTouch: false });
    const updateLock = () => {
      if (document.body.classList.contains('menu-open') || document.body.classList.contains('modal-open')) smoother.stop();
      else smoother.start();
    };
    new MutationObserver(updateLock).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    updateLock();
  }
  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.animate?.([{ opacity: .5, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 550, easing: 'cubic-bezier(.2,.7,.3,1)' });
        observer.unobserve(entry.target);
      });
    }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
    let target;
    try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
    if (!target) return;
    event.preventDefault();
    const top = Math.max(0, target.getBoundingClientRect().top + scrollY - (target.id === 'top' ? 0 : 96));
    history.pushState(null, '', url.hash);
    if (smoother) { smoother.start(); smoother.scrollTo(top); }
    else window.scrollTo({ top, behavior: 'instant' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
})();
