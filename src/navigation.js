import { activeSectionIndex } from './active-section.js';
import { createSectionScroller } from './section-scroll.js';

const links = [...document.querySelectorAll('nav a')];
const sections = links.map(link => document.querySelector(`#${link.dataset.section || link.hash.slice(1)}`));
let pendingTarget = null;
let scheduled = false;
const scroller = createSectionScroller(window, matchMedia('(prefers-reduced-motion: reduce)'));

if (location.hash === '#about') {
  history.replaceState(null, '', `${location.pathname}${location.search}`);
}

function activate(index) {
  links.forEach((link, i) => {
    link.classList.toggle('active', i === index);
    if (i === index) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function update() {
  scheduled = false;
  const tops = sections.map(section => section.getBoundingClientRect().top);
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3;
  if (pendingTarget !== null) {
    activate(pendingTarget);
    return;
  }
  activate(activeSectionIndex(tops, Math.min(innerHeight * .28, 220), atBottom));
}
function schedule() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
}
function release() {
  pendingTarget = null;
  scroller.cancel();
  schedule();
}
// Highlight the destination immediately, without flickering through intervening
// sections during smooth scrolling. Manual scrolling releases that destination.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const index = links.findIndex(nav => nav.hash === link.hash);
    if (index < 0) return;
    event.preventDefault();
    pendingTarget = index;
    activate(index);
    const target = sections[index];
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const top = index === 0 ? 0 : Math.max(0, Math.min(maxScroll, window.scrollY + target.getBoundingClientRect().top - padding));
    if (index === 0) history.replaceState(null, '', `${location.pathname}${location.search}`);
    else if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    scroller.to(top, () => {
      if (event.detail === 0) {
        // Preserve anchor-like keyboard navigation without a second scroll jump.
        const temporary = !target.hasAttribute('tabindex');
        if (temporary) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        if (temporary) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
      release();
    });
  });
});
window.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', release);
window.addEventListener('scrollend', () => { if (!scroller.running) release(); });
window.addEventListener('wheel', release, { passive: true });
window.addEventListener('touchmove', release, { passive: true });
window.addEventListener('keydown', event => {
  if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) release();
});
window.addEventListener('hashchange', release);
window.addEventListener('popstate', release);
window.addEventListener('pointerdown', release, { passive: true });
update();
