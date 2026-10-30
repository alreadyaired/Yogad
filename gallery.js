// Fit the homepage photo rows into the selected viewport-height section.
(() => {
  const gallery = document.querySelector('.photo-gallery');
  if (!gallery) return;
  const gap = 5;

  function layout() {
    const photos = [...gallery.querySelectorAll('.gallery-photo')];
    const width = gallery.clientWidth;
    const section = gallery.closest('#gallery');
    const sectionStyle = getComputedStyle(section);
    let height = Math.max(160, section.getBoundingClientRect().height - (gallery.getBoundingClientRect().top - section.getBoundingClientRect().top) - parseFloat(sectionStyle.paddingBottom));
    if (!width || !photos.length) return;
    const ratios = photos.map(photo => {
      const image = photo.querySelector('img');
      return Number(image.getAttribute('width')) / Number(image.getAttribute('height'));
    });
    const sums = [0];
    ratios.forEach(ratio => sums.push(sums[sums.length - 1] + ratio));
    const requestedRows = Math.min(photos.length, Number(gallery.dataset?.rows) || 0);
    const rowHeight = (start, end) =>
      (width - gap * (end - start - 1)) / (sums[end] - sums[start]);
    const cost = Array.from({ length: photos.length + 1 }, () => Array(photos.length + 1).fill(Infinity));
    const previous = Array.from({ length: photos.length + 1 }, () => []);
    cost[0][0] = 0;
    let rowCount = 1;
    let usedHeight = rowHeight(0, photos.length);
    let bestScore = Infinity;

    // Choose rows closest to the available shape to minimise image cropping.
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
      const contentHeight = total - gap * (count - 1);
      const availableHeight = height - gap * (count - 1);
      const score = requestedRows ? 0 : contentHeight > 0 && availableHeight > 0 ? Math.abs(Math.log(contentHeight / availableHeight)) : Infinity;
      if ((!requestedRows || count === requestedRows) && score < bestScore) {
        bestScore = score;
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

    if (requestedRows) {
      const nextHeight = `${height}px`;
      if (gallery.style.height !== nextHeight) gallery.style.height = nextHeight;
    }
    const rowGaps = gap * (rows.length - 1);
    const scale = (height - rowGaps) / (usedHeight - rowGaps);
    let top = 0;
    for (const row of rows) {
      const photoHeight = row.height * scale;
      let left = 0;
      for (let i = row.start; i < row.end; i++) {
        const photoWidth = row.height * ratios[i];
        Object.assign(photos[i].style, {
          width: `${photoWidth}px`, height: `${photoHeight}px`,
          left: `${left}px`, top: `${top}px`
        });
        left += photoWidth + gap;
      }
      top += photoHeight + gap;
    }
  }

  layout();
  if (typeof ResizeObserver === 'function') new ResizeObserver(layout).observe(gallery);
  addEventListener('resize', layout, { passive: true });
})();
