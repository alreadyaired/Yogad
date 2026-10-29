// A full photo album in justified rows; scrolling stays with the page.
(() => {
  const gallery = document.querySelector('.gallery-collection');
  if (!gallery) return;
  const photos = [...gallery.querySelectorAll('.gallery-photo')];
  const gap = 10;
  let lastWidth = 0;
  function layout() {
    const width = gallery.clientWidth;
    if (!width || width === lastWidth) return;
    lastWidth = width;
    const target = width < 600 ? 160 : 250;
    const ratios = photos.map(photo => {
      const image = photo.querySelector('img');
      return Number(image.getAttribute('width')) / Number(image.getAttribute('height'));
    });
    const cost = Array(photos.length + 1).fill(Infinity);
    const next = [];
    cost[photos.length] = 0;
    for (let start = photos.length - 1; start >= 0; start--) {
      let sum = 0;
      for (let end = start + 1; end <= photos.length; end++) {
        sum += ratios[end - 1];
        const height = (width - gap * (end - start - 1)) / sum;
        if (height <= 0) break;
        const score = (height - target) ** 2 + cost[end];
        if (score < cost[start]) { cost[start] = score; next[start] = end; }
      }
    }
    let start = 0, top = 0;
    while (start < photos.length) {
      const end = next[start];
      const sum = ratios.slice(start, end).reduce((total, ratio) => total + ratio, 0);
      const height = (width - gap * (end - start - 1)) / sum;
      let left = 0;
      for (let i = start; i < end; i++) {
        const photoWidth = height * ratios[i];
        Object.assign(photos[i].style, { width: `${photoWidth}px`, height: `${height}px`, left: `${left}px`, top: `${top}px` });
        left += photoWidth + gap;
      }
      top += height + gap;
      start = end;
    }
    gallery.style.height = `${Math.max(0, top - gap)}px`;
  }
  layout();
  if (typeof ResizeObserver === 'function') new ResizeObserver(layout).observe(gallery);
  else addEventListener('resize', layout, { passive: true });
})();
