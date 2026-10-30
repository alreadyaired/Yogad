// Animate only while visible, and keep the still for Motion off or reduced motion.
(() => {
  const video = document.querySelector('[data-hero-video]');
  if (!video) return;
  const frame = video.closest('.hero-motion');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let failed = false;
  video.muted = true;
  const allowed = () => document.documentElement.dataset.motion !== 'reduce' && !preference.matches;
  const shouldPlay = () => allowed() && visible && !document.hidden && !failed;
  function sync() {
    if (!shouldPlay()) {
      video.pause();
      frame.classList.remove('is-playing');
      return;
    }
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    video.play().catch(error => {
      if (error.name !== 'AbortError' && shouldPlay()) failed = true;
      frame.classList.remove('is-playing');
    });
  }
  video.addEventListener('playing', () => {
    if (shouldPlay()) frame.classList.add('is-playing');
    else sync();
  });
  video.addEventListener('error', () => { failed = true; sync(); });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }, {threshold:0.01}).observe(frame);
  document.addEventListener('visibilitychange', sync);
  preference.addEventListener('change', sync);
  new MutationObserver(sync).observe(document.documentElement, {attributes:true,attributeFilter:['data-motion']});
  addEventListener('pagehide', () => video.pause());
})();
