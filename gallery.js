// Fit every photo inside one screen without cropping or capturing page scroll.
(() => {
  const gallery = document.querySelector('.photo-gallery');
  if (!gallery) return;
  const gap = 5;

  function layout() {
    const photos = [...gallery.querySelectorAll('.gallery-photo')];
    const width = gallery.clientWidth;
    const height = gallery.clientHeight;
    if (!width || !height || !photos.length) return;
    const ratios = photos.map(photo => {
      const image = photo.querySelector('img');
      return Number(image.getAttribute('width')) / Number(image.getAttribute('height'));
    });
    const sums = [0];
    ratios.forEach(ratio => sums.push(sums[sums.length - 1] + ratio));
    let best = null;

    // Balance original aspect ratios across candidate rows, choosing the largest
    // uncropped thumbnails that fit both the available width and height.
    for (let count = 1; count <= photos.length; count++) {
      const target = sums[photos.length] / count;
      const cost = Array.from({ length: count + 1 }, () => Array(photos.length + 1).fill(Infinity));
      const previous = Array.from({ length: count + 1 }, () => []);
      cost[0][0] = 0;
      for (let row = 1; row <= count; row++) {
        for (let end = row; end <= photos.length; end++) {
          for (let start = row - 1; start < end; start++) {
            const score = cost[row - 1][start] + (sums[end] - sums[start] - target) ** 2;
            if (score < cost[row][end]) {
              cost[row][end] = score;
              previous[row][end] = start;
            }
          }
        }
      }
      const rows = [];
      let end = photos.length;
      for (let row = count; row > 0; row--) {
        const start = previous[row][end];
        rows.unshift({ start, end, ratio: sums[end] - sums[start] });
        end = start;
      }
      const photoHeight = Math.min(
        (height - gap * (count - 1)) / count,
        ...rows.map(row => (width - gap * (row.end - row.start - 1)) / row.ratio)
      );
      if (photoHeight > 0 && (!best || photoHeight > best.photoHeight)) best = { rows, photoHeight };
    }
    if (!best) return;
    const usedHeight = best.rows.length * best.photoHeight + gap * (best.rows.length - 1);
    let top = (height - usedHeight) / 2;
    for (const row of best.rows) {
      const usedWidth = row.ratio * best.photoHeight + gap * (row.end - row.start - 1);
      let left = (width - usedWidth) / 2;
      for (let i = row.start; i < row.end; i++) {
        const photoWidth = best.photoHeight * ratios[i];
        Object.assign(photos[i].style, {
          width: `${photoWidth}px`, height: `${best.photoHeight}px`,
          left: `${left}px`, top: `${top}px`
        });
        left += photoWidth + gap;
      }
      top += best.photoHeight + gap;
    }
  }

  layout();
  if (typeof ResizeObserver === 'function') new ResizeObserver(layout).observe(gallery);
  else addEventListener('resize', layout, { passive: true });
})();
