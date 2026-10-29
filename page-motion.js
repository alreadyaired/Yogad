// Gentle page entrances, including cards added by the Journal topic filters.
(() => {
  if (document.documentElement.dataset.motion === 'reduce') return;
  const seen = new WeakSet();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const index = Number(entry.target.dataset.entranceOrder || 0);
      entry.target.animate([
        { opacity: 0, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 620, delay: Math.min(index, 3) * 70, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
    }
  }, { threshold: .08 });
  function register() {
    document.querySelectorAll('.journal-page-hero .eyebrow,.journal-page-hero h1,.journal-page-intro,.journal-filters,.journal-listing .blog-card,.gallery-collection .gallery-photo').forEach((element, index) => {
      if (seen.has(element)) return;
      seen.add(element);
      element.dataset.entranceOrder = index % 4;
      observer.observe(element);
    });
  }
  if (document.documentElement.classList.contains('intro-pending')) {
    const opening = new MutationObserver(() => {
      if (!document.documentElement.classList.contains('intro-pending')) {
        opening.disconnect();
        register();
      }
    });
    opening.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  } else register();
  document.addEventListener('yogadyah:content-ready', () => {
    if (!document.documentElement.classList.contains('intro-pending')) register();
  });
})();
