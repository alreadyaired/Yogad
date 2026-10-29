// Justify each photo row across the available width within the one-screen gallery.
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
    const rowHeight = (start, end) =>
      (width - gap * (end - start - 1)) / (sums[end] - sums[start]);
    const cost = Array.from({ length: photos.length + 1 }, () => Array(photos.length + 1).fill(Infinity));
    const previous = Array.from({ length: photos.length + 1 }, () => []);
    cost[0][0] = 0;
    let rowCount = 1;
    let usedHeight = rowHeight(0, photos.length);

    // Find the most balanced full-width rows for each count, then use the
    // largest arrangement that fits the existing height. No scroll interception.
    for (let count = 1; count <= photos.length; count++) {
      for (let end = count; end <= photos.length; end++) {
        for (let start = count - 1; start < end; start++) {
          const photoHeight = rowHeight(start, end);
          if (photoHeight <= 0) continue;
          const score = cost[count - 1][start] + photoHeight;
          if (score < cost[count][end]) {
            cost[count][end] = score;
            previous[count][end] = start;
          }
        }
      }
      const total = cost[count][photos.length] + gap * (count - 1);
      if (total <= height && total >= usedHeight) {
        rowCount = count;
        usedHeight = total;
      }
    }
    const rows = [];
    let end = photos.length;
    for (let count = rowCount; count > 0; count--) {
      const start = previous[count][end];
      rows.unshift({ start, end, height: rowHeight(start, end) });
      end = start;
    }

    // If even one row is taller than the viewport (e.g. only two portraits),
    // preserve the full images and height limit rather than crop or stretch them.
    const scale = Math.min(1, height / usedHeight);
    let top = (height - usedHeight * scale) / 2;
    for (const row of rows) {
      const photoHeight = row.height * scale;
      let left = (width - width * scale) / 2;
      for (let i = row.start; i < row.end; i++) {
        const photoWidth = photoHeight * ratios[i];
        Object.assign(photos[i].style, {
          width: `${photoWidth}px`, height: `${photoHeight}px`,
          left: `${left}px`, top: `${top}px`
        });
        left += photoWidth + gap * scale;
      }
      top += photoHeight + gap * scale;
    }
  }

  layout();
  if (typeof ResizeObserver === 'function') new ResizeObserver(layout).observe(gallery);
  else addEventListener('resize', layout, { passive: true });
})();
