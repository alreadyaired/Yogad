// Bettr Academy-inspired continuous scroll, text entrances, and card choreography.
(() => {
  function initMotion() {
  const root = document.documentElement;
  if (root.dataset.motion === 'reduce') return;
  const scrollDriver = typeof Lenis === 'function' ? new Lenis({
    autoRaf: true, lerp: .1, wheelMultiplier: .7, smoothWheel: true, syncTouch: false,
    prevent: node => !!node.closest('dialog,#menu,[data-scroll-native]')
  }) : null;
  root.dataset.scrollEngine = scrollDriver ? 'smooth' : 'native';
  if (scrollDriver) {
    if(document.body.classList.contains('intro-playing'))scrollDriver.stop();
    new MutationObserver(() => {
      if (document.body.matches('.modal-open,.menu-open,.intro-playing')) scrollDriver.stop();
      else scrollDriver.start();
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }
  const select = (selector, scope = document) => [...scope.querySelectorAll(selector)].filter(element => !element.closest('section[hidden]'));
  const observed = new WeakSet();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('visible', 'is-in-view', 'words-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });

  function splitHeading(heading) {
    if (heading.dataset.motionSplit) return;
    heading.dataset.motionSplit = 'true';
    heading.setAttribute('aria-label', heading.innerText.replace(/\s+/g, ' ').trim());
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let index = 0, character = 0;
    for (const node of nodes) {
      const fragment = document.createDocumentFragment();
      for (const word of node.textContent.split(/(\s+)/)) {
        if (!word.trim()) { fragment.append(document.createTextNode(word)); continue; }
        const clip = document.createElement('span');
        clip.className = 'word-clip';
        clip.setAttribute('aria-hidden', 'true');
        const inner = document.createElement('span');
        inner.className = 'word-inner';
        if (heading.tagName === 'H1') {
          for (const letter of word) {
            const char = document.createElement('span');
            char.className = 'char-inner'; char.textContent = letter;
            char.style.setProperty('--char', character++);
            inner.append(char);
          }
        } else inner.textContent = word;
        inner.style.setProperty('--word', index++);
        clip.append(inner);
        fragment.append(clip);
      }
      node.replaceWith(fragment);
    }
  }

  function register(scope = document) {
    select('h1,h2,h3', scope).forEach(splitHeading);
    select('.blog-card,.practice-card,.topic-card', scope).forEach(card => {
      card.classList.add('motion-card');
      const index = [...card.parentElement.children].indexOf(card);
      card.style.setProperty('--reveal-delay', `${(index % 3) * 65}ms`);
    });
    select('.reveal,.motion-card,h1,h2,h3,.hero-intro,.hero-copy,.hero-actions,.hero-bottom', scope).forEach(element => {
      if (observed.has(element)) return;
      observed.add(element);
      observer.observe(element);
    });
  }
  register();
  new MutationObserver(() => register(document.querySelector('#practice-track')))
    .observe(document.querySelector('#practice-track'), { childList: true });

  // Low-amplitude photo depth with a settling frame loop, not a replacement scroller.
  const photos = select('.hero-image-wrap,.about-image,.community-image').map(element => {
    element.classList.add('motion-depth');
    return { element, current: 0, target: 0 };
  });
  const stackCards = select('.topic-card').map((element, index) => {
    element.style.setProperty('--stack-index', index);
    return { element, index, current: 0, target: 0, arrived: false };
  });
  let depthFrame = 0;
  const finePointer = matchMedia('(pointer:fine)');
  function measureDepth() {
    for (const photo of photos) {
      const box = photo.element.getBoundingClientRect();
      photo.target = finePointer.matches && box.bottom > 0 && box.top < innerHeight
        ? Math.max(-12, Math.min(12, ((innerHeight / 2 - box.top - box.height / 2) / innerHeight) * 24)) : 0;
    }
    for (const card of stackCards) {
      const enabled = innerWidth > 900 && innerHeight > 560;
      const next = stackCards[card.index + 1];
      const top = 96 + card.index * 12;
      card.target = enabled && next ? Math.max(0, Math.min(1,
        (innerHeight * .7 - next.element.getBoundingClientRect().top) / Math.max(1, innerHeight * .7 - top - 12))) : 0;
      const box = card.element.getBoundingClientRect();
      if (enabled && box.top <= top + 3 && !card.arrived) {
        card.arrived = true;
        card.element.animate([{translate:'0 0'},{translate:'0 -5px',offset:.35},{translate:'0 0'}],
          {duration:750,easing:'cubic-bezier(.34,1.45,.64,1)'});
      } else if (box.top > top + 70) card.arrived = false;
    }
    if (!depthFrame) depthFrame = requestAnimationFrame(settleDepth);
  }
  function settleDepth() {
    let moving = false;
    for (const photo of photos) {
      photo.current += (photo.target - photo.current) * 0.13;
      if (Math.abs(photo.target - photo.current) > 0.04) moving = true;
      photo.element.style.setProperty('--photo-y', `${photo.current.toFixed(2)}px`);
    }
    for (const card of stackCards) {
      card.current += (card.target - card.current) * .13;
      if (Math.abs(card.target - card.current) > .002) moving = true;
      card.element.style.setProperty('--stack-scale', (1 - .035 * card.current).toFixed(4));
      card.element.style.setProperty('--stack-turn', `${(card.index % 2 ? 1.5 : -1.5) * card.current}deg`);
    }
    depthFrame = moving ? requestAnimationFrame(settleDepth) : 0;
  }
  addEventListener('scroll', measureDepth, { passive: true });
  addEventListener('resize', measureDepth, { passive: true });
  measureDepth();

  // Deliberate navigation glides. Manual input cancels immediately and stays native.
  let scrollFrame = 0;
  const cancelGlide = () => { cancelAnimationFrame(scrollFrame); scrollFrame = 0; };
  addEventListener('wheel', cancelGlide, { passive: true });
  addEventListener('touchstart', cancelGlide, { passive: true });
  addEventListener('pointerdown', cancelGlide, { passive: true });
  addEventListener('keydown', event => {
    if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key)) cancelGlide();
  });
  const cubic = (a,b,t) => 3*a*(1-t)*(1-t)*t+3*b*(1-t)*t*t+t*t*t;
  function ease(t) {
    let low = 0, high = 1, position = t;
    for (let step = 0; step < 14; step++) {
      position = (low + high) / 2;
      if (cubic(.32,0,position) < t) low = position; else high = position;
    }
    return cubic(.72,1,position);
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    cancelGlide();
    const from = scrollY;
    const inset = ['gallery','about'].includes(target.id) ? 0 : parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    const to = Math.max(0, Math.min(document.documentElement.scrollHeight-innerHeight, target.getBoundingClientRect().top+from-inset));
    const distance = to-from;
    const duration = Math.min(1250, Math.max(700, Math.abs(distance)*.18));
    history.pushState(null, '', link.hash);
    if (scrollDriver) {
      scrollDriver.scrollTo(to, { duration: 1.1, lerp: 0, easing: ease,
        onComplete: () => { target.setAttribute('tabindex', '-1'); target.focus({preventScroll:true}); }
      });
      return;
    }
    const started = performance.now();
    function frame(now) {
      const progress = Math.min(1, (now-started)/duration);
      scrollTo({ top: from+distance*ease(progress), behavior: 'instant' });
      if (progress < 1) scrollFrame = requestAnimationFrame(frame);
      else {
        scrollFrame = 0;
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    }
    scrollFrame = requestAnimationFrame(frame);
  });
  }
  if (document.documentElement.classList.contains('intro-pending')) {
    document.addEventListener('yogadyah:intro-ready', initMotion, { once: true });
  } else initMotion();
})();
