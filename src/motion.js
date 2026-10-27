// Content stays visible without JavaScript or animation support.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const headlineReplay = document.querySelector('.headline-replay');
headlineReplay?.addEventListener('click', () => {
  if (reducedMotion.matches) return;
  // Flush the animation-free state, then restart the original staggered strokes.
  // Keep the same button in place so keyboard focus survives every replay.
  headlineReplay.classList.add('headline-restarting');
  void headlineReplay.offsetWidth;
  headlineReplay.classList.remove('headline-restarting');
});
if ('requestAnimationFrame' in window) {
  const sections = [...document.querySelectorAll('main > section:not(.hero)')];
  const active = new Map();
  const header = document.querySelector('.site-header');
  let scheduled = false;
  let previousScrollY = window.scrollY;
  let scrollingUp = false;

  function release(element) {
    active.get(element)?.cancel();
    active.delete(element);
  }
  function targets(section) {
    const heading = section.querySelector('.section-heading');
    const headings = heading ? [heading] : [...section.querySelectorAll(':scope > .eyebrow, :scope > h2, :scope > .contact-orbit')];
    const cards = [...section.querySelectorAll('#project-list > .project, .activity-panel, #cert-list > .cert')];
    const content = cards.length ? cards : [...section.querySelectorAll(':scope > .contact-intro, :scope > .email-link, :scope > .social-links')];
    return [...headings, ...content];
  }
  function layoutTop(element) {
    // Layout offsets ignore our animated transforms, avoiding scroll feedback.
    let top = 0;
    for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
    return top;
  }
  const clamp = value => Math.min(1, Math.max(0, value));
  function update() {
    scheduled = false;
    if (window.scrollY !== previousScrollY) scrollingUp = window.scrollY < previousScrollY;
    previousScrollY = window.scrollY;
    if (reducedMotion.matches) return;
    const height = window.innerHeight;
    const headerBottom = header?.getBoundingClientRect().bottom || 0;
    const band = Math.min(300, Math.max(1, (height - headerBottom) * 0.36));
    const remaining = document.documentElement.scrollHeight - height - window.scrollY;
    // Read layout before writing effects. Generated cards are included after app.js renders.
    const positions = sections.flatMap(targets).map(element => ({
      element, top: layoutTop(element) - window.scrollY, height: element.offsetHeight,
    }));
    positions.forEach(({ element, top, height: elementHeight }) => {
      const bottom = top + elementHeight;
      if (typeof element.animate !== 'function' || element.contains(document.activeElement)
        || bottom <= headerBottom || top >= height) {
        release(element);
        return;
      }
      const fromBelow = clamp((top - (height - band)) / band) * clamp(remaining / band);
      // Keep the heading/card readable until almost all of it has passed behind
      // the header. The broad entrance band must not become an early exit fade.
      const exitBand = Math.max(1, Math.min(48, elementHeight * 0.2));
      // Returning content gets the same broad reveal as content entering below.
      // Downward scrolling keeps the narrow exit band for readable content.
      const upperBand = scrollingUp ? band : exitBand;
      const fromAbove = clamp((headerBottom + upperBand - bottom) / upperBand) * clamp(window.scrollY / band);
      const progress = 0.5 + (fromBelow - fromAbove) * 0.5;
      if (Math.abs(progress - 0.5) < 0.001) {
        release(element); // Full clarity in the reading area; hover styles are free.
        return;
      }
      let animation = active.get(element);
      if (!animation) {
        animation = element.animate([
          { opacity: 0.12, transform: 'translateY(-84px)', filter: 'blur(16px)' },
          { offset: 0.5, opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' },
          { opacity: 0.12, transform: 'translateY(84px)', filter: 'blur(16px)' },
        ], { duration: 1000, fill: 'both', easing: 'linear' });
        animation.pause();
        active.set(element, animation);
      }
      // A paused timeline is scrubbed only by position, never elapsed time.
      animation.currentTime = progress * 1000;
    });
  }
  function schedule() {
    if (!scheduled) { scheduled = true; window.requestAnimationFrame(update); }
  }

  reducedMotion.addEventListener('change', () => {
    active.forEach(animation => animation.cancel());
    active.clear();
    schedule();
  });
  document.addEventListener('focusin', event => {
    active.forEach((animation, element) => {
      if (element.contains(event.target)) release(element);
    });
  });
  document.addEventListener('focusout', schedule);
  document.addEventListener('load', schedule, true);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  schedule();
}
