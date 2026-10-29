// Seamless review scrolling with native horizontal dragging and keyboard input.
(() => {
  const carousel = document.querySelector('.testimonials-carousel');
  const track = document.querySelector('#testimonials-track');
  const group = track?.querySelector('.testimonials-group');
  if (!carousel || !group) return;

  const reduced = document.documentElement.dataset.motion === 'reduce';
  let period = 0;
  let gap = 20;
  // Keep subpixel progress even in browsers that round scrollLeft assignments.
  let position = 0;
  let hovered = false;
  let keyboardFocus = false;
  let visible = false;
  let drag = null;
  let suppressClick = false;
  let manualUntil = 0;
  let lastFrame = 0;

  function moveTo(value) {
    if (reduced) position = Math.max(0, Math.min(value, carousel.scrollWidth - carousel.clientWidth));
    else if (period > 0) position = ((value % period) + period) % period;
    carousel.scrollLeft = position;
  }

  function measure() {
    const progress = period > 0 ? position / period : 0;
    gap = Number.parseFloat(getComputedStyle(track).columnGap) || 20;
    period = group.getBoundingClientRect().width + gap;
    if (!drag) moveTo(reduced ? carousel.scrollLeft : progress * period);
  }

  function step(direction) {
    const card = group.querySelector('.testimonial-card');
    if (!card) return;
    manualUntil = performance.now() + 3000;
    moveTo(position + direction * (card.getBoundingClientRect().width + gap));
  }

  carousel.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') hovered = true;
  });
  carousel.addEventListener('pointerleave', () => { hovered = false; });
  carousel.addEventListener('focusin', () => { keyboardFocus = carousel.matches(':focus-visible'); });
  carousel.addEventListener('focusout', event => {
    if (!carousel.contains(event.relatedTarget)) keyboardFocus = false;
  });
  carousel.addEventListener('scroll', () => {
    if (reduced) position = carousel.scrollLeft;
  }, { passive: true });

  carousel.addEventListener('pointerdown', event => {
    if (event.isPrimary === false || (event.pointerType === 'mouse' && event.button !== 0)) return;
    suppressClick = false;
    keyboardFocus = false;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, start: position, active: false };
    carousel.setPointerCapture(event.pointerId);
  });

  function finishDrag() {
    if (!drag) return;
    const pointer = drag.id;
    if (drag.active) {
      suppressClick = true;
      manualUntil = performance.now() + 3000;
    }
    drag = null;
    carousel.classList.remove('is-grabbing');
    if (carousel.hasPointerCapture(pointer)) carousel.releasePointerCapture(pointer);
  }

  carousel.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const x = event.clientX - drag.x;
    const y = event.clientY - drag.y;
    if (!drag.active) {
      if (Math.abs(x) < 6 && Math.abs(y) < 6) return;
      if (Math.abs(y) > Math.abs(x)) { finishDrag(); return; }
      drag.active = true;
      carousel.classList.add('is-grabbing');
    }
    if (event.cancelable) event.preventDefault();
    moveTo(drag.start - x);
  });
  carousel.addEventListener('pointerup', finishDrag);
  carousel.addEventListener('pointercancel', finishDrag);
  carousel.addEventListener('lostpointercapture', finishDrag);
  carousel.addEventListener('click', event => {
    if (!suppressClick) return;
    suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  carousel.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    keyboardFocus = true;
    manualUntil = performance.now() + 3000;
    if (event.key === 'ArrowLeft') step(-1);
    else if (event.key === 'ArrowRight') step(1);
    else if (event.key === 'Home') moveTo(0);
    else {
      const card = group.querySelector('.testimonial-card');
      moveTo(reduced ? carousel.scrollWidth - carousel.clientWidth : period - card.getBoundingClientRect().width - gap);
    }
  });

  measure();
  addEventListener('resize', measure, { passive: true });
  if (typeof ResizeObserver === 'function') new ResizeObserver(measure).observe(group);
  if (typeof IntersectionObserver === 'function') {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { rootMargin: '80px 0px' }).observe(carousel);
  } else visible = true;

  if (!reduced) {
    const frame = now => {
      const elapsed = lastFrame ? Math.min(64, now - lastFrame) : 0;
      lastFrame = now;
      const opening = document.documentElement.classList.contains('intro-pending');
      if (visible && !document.hidden && !opening && !document.body.classList.contains('modal-open') && !hovered && !keyboardFocus && !drag && now > manualUntil) {
        moveTo(position + elapsed * 0.03);
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
})();
