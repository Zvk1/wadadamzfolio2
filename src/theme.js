import { finishThemeAnimation } from './theme-transition.js';

const trigger = document.getElementById('theme');
const menu = document.getElementById('theme-menu');
const picker = document.querySelector('.theme-picker');
const options = [...menu.querySelectorAll('[data-theme-option]')];
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const icons = {
  auto: '<rect x="3" y="4" width="14" height="10" rx="2"/><path d="M7 17h6M10 14v3"/>',
  light: '<circle cx="10" cy="10" r="3"/><path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.6 3.6 5 5M15 15l1.4 1.4M3.6 16.4 5 15M15 5l1.4-1.4"/>',
  dark: '<path d="M17 12.2A7.5 7.5 0 0 1 7.8 3a7.5 7.5 0 1 0 9.2 9.2Z"/>',
};
const icon = key => `<svg viewBox="0 0 20 20" aria-hidden="true">${icons[key]}</svg>`;
let preference = 'dark';
try { preference = localStorage.getItem('portfolio-v2-theme') || 'dark'; } catch {}
if (!Object.hasOwn(icons, preference)) preference = 'dark';
let transitionTimer;
let activeTransition;
let transitionRequest = 0;
function updateControls() {
  const label = preference[0].toUpperCase() + preference.slice(1);
  document.getElementById('theme-label').textContent = label;
  document.getElementById('theme-icon').innerHTML = icon(preference);
  trigger.setAttribute('aria-label', `Color theme: ${label}`);
  options.forEach(option => option.setAttribute('aria-checked', String(option.dataset.themeOption === preference)));
}
async function applyTheme(animate = false) {
  const request = ++transitionRequest;
  const root = document.documentElement;
  if (activeTransition) {
    activeTransition.skipTransition();
    await activeTransition.finished.catch(() => {});
    if (request !== transitionRequest) return;
  }
  root.classList.remove('theme-wiping');
  delete root.dataset.themeWipe;
  const resolved = preference === 'auto' ? (systemTheme.matches ? 'dark' : 'light') : preference;
  const shouldAnimate = animate && !reducedMotion.matches && root.dataset.theme !== resolved;
  updateControls();
  clearTimeout(transitionTimer);
  root.classList.remove('theme-changing');
  const commit = () => { root.dataset.theme = resolved; };
  if (!shouldAnimate) { commit(); return; }
  // Older browsers retain the color fade; reduced-motion users get an instant change.
  if (!document.startViewTransition || !root.animate) {
    root.classList.add('theme-changing');
    commit();
    transitionTimer = setTimeout(() => root.classList.remove('theme-changing'), 500);
    return;
  }
  const bounds = document.getElementById('theme-icon').getBoundingClientRect();
  const x = Math.max(0, Math.min(innerWidth, bounds.left + bounds.width / 2));
  const y = Math.max(0, Math.min(innerHeight, bounds.top + bounds.height / 2));
  const radius = Math.ceil(Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)));
  const clips = [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`];
  root.dataset.themeWipe = resolved;
  root.classList.add('theme-wiping');
  let transition;
  try {
    transition = document.startViewTransition(commit);
    activeTransition = transition;
    await transition.ready;
    // Sunlight spreads from the sun; the old light contracts into the moon.
    const animation = root.animate({ clipPath: resolved === 'light' ? clips : [...clips].reverse() }, {
      duration: 420,
      easing: 'cubic-bezier(.4,0,.2,1)',
      fill: 'both',
      pseudoElement: resolved === 'light' ? '::view-transition-new(root)' : '::view-transition-old(root)',
    });
    await finishThemeAnimation(animation, transition);
  } catch {
    transition?.skipTransition();
    commit();
  } finally {
    if (transition) await transition.finished.catch(() => {});
    if (activeTransition === transition) activeTransition = null;
    if (request === transitionRequest) {
      root.classList.remove('theme-wiping');
      delete root.dataset.themeWipe;
    }
  }
}
function closeMenu(restoreFocus = false) {
  menu.hidden = true;
  trigger.setAttribute('aria-expanded', 'false');
  if (restoreFocus) trigger.focus({ preventScroll: true });
}
function openMenu(index = options.findIndex(option => option.dataset.themeOption === preference)) {
  menu.hidden = false;
  trigger.setAttribute('aria-expanded', 'true');
  options[index].focus({ preventScroll: true });
}
options.forEach(option => {
  option.querySelector('.option-icon').innerHTML = icon(option.dataset.themeOption);
  option.addEventListener('click', () => {
    preference = option.dataset.themeOption;
    try { localStorage.setItem('portfolio-v2-theme', preference); } catch {}
    closeMenu(true);
    applyTheme(true);
  });
});
trigger.addEventListener('click', () => menu.hidden ? openMenu() : closeMenu());
trigger.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    openMenu(event.key === 'ArrowUp' ? options.length - 1 : 0);
  }
});
menu.addEventListener('keydown', event => {
  const current = options.indexOf(document.activeElement);
  let next;
  if (event.key === 'ArrowDown') next = (current + 1) % options.length;
  if (event.key === 'ArrowUp') next = (current - 1 + options.length) % options.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = options.length - 1;
  if (next !== undefined) { event.preventDefault(); options[next].focus({ preventScroll: true }); }
  if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); }
  if (event.key === 'Tab') { closeMenu(true); }
  const match = options.find(option => option.dataset.themeOption.startsWith(event.key.toLowerCase()));
  if (event.key.length === 1 && match) { event.preventDefault(); match.focus({ preventScroll: true }); }
});
document.addEventListener('pointerdown', event => {
  if (!picker.contains(event.target)) closeMenu();
});
picker.addEventListener('focusout', event => {
  if (!picker.contains(event.relatedTarget)) closeMenu();
});
systemTheme.addEventListener('change', () => applyTheme(true));
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) activeTransition?.skipTransition();
});
window.addEventListener('resize', () => activeTransition?.skipTransition(), { passive: true });
applyTheme();
