(() => {
  const $ = s => document.querySelector(s);
  const header = $('#header'), menu = $('#menu'), toggle = $('.menu-toggle');
  function closeMenu(restoreFocus = false) {
    document.body.classList.remove('menu-open');
    menu.inert = true;
    toggle.setAttribute('aria-expanded', 'false');
    $('.menu-word').textContent = 'Menu';
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    menu.inert = !open;
    toggle.setAttribute('aria-expanded', String(open));
    $('.menu-word').textContent = open ? 'Close' : 'Menu';
    header.classList.remove('is-hidden');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu(true); });
  const dialog = $('#detail-dialog');
  let returnFocus;
  function closeDialog() {
    dialog.close();
    document.body.classList.remove('modal-open');
    returnFocus?.focus({ preventScroll: true });
  }
  document.querySelectorAll('[data-privacy]').forEach(button => button.addEventListener('click', () => {
    returnFocus = button;
    dialog.showModal();
    document.body.classList.add('modal-open');
    $('.dialog-close').focus();
  }));
  $('.dialog-close').addEventListener('click', closeDialog);
  dialog.addEventListener('cancel', e => { e.preventDefault(); closeDialog(); });
  dialog.addEventListener('click', e => { if (e.target === dialog) closeDialog(); });
  $('#clear-preview-data').addEventListener('click', () => {
    try {
      localStorage.removeItem('yogadyah-contact-draft');
      localStorage.removeItem('yogadyah-newsletter-draft');
      $('#privacy-status').textContent = 'Older preview drafts cleared from this browser.';
    } catch { $('#privacy-status').textContent = 'Browser storage is unavailable.'; }
  });
  const motion = $('.motion-toggle');
  const reduced = document.documentElement.dataset.motion === 'reduce';
  motion.querySelector('span').textContent = reduced ? 'off' : 'on';
  motion.setAttribute('aria-pressed', String(!reduced));
  motion.addEventListener('click', () => {
    try { localStorage.setItem('yogadyah-motion', reduced ? 'full' : 'reduce'); } catch {}
    location.reload();
  });
  let last = scrollY;
  function updateHeader() {
    const next = Math.max(0, scrollY);
    const pinned = document.body.classList.contains('menu-open') || header.contains(document.activeElement);
    if (next < 100 || pinned || next < last - 3) header.classList.remove('is-hidden');
    else if (next > last + 6) header.classList.add('is-hidden');
    last = next;
  }
  addEventListener('scroll', updateHeader, { passive: true });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  if ('IntersectionObserver' in window) {
    const contact = $('#contact');
    if (contact) new IntersectionObserver(entries => {
      document.body.classList.toggle('contact-in-view', entries[0].isIntersecting);
    }, { threshold: .1 }).observe(contact);
  }
})();
