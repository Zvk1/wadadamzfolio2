import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

test('theme menu focus and selection preserve a lower-page scroll position', () => {
  let scrollY = 2400;
  const document = { activeElement: null, addEventListener() {} };
  const element = (dataset = {}) => ({
    dataset, hidden: true, innerHTML: '', textContent: '', listeners: {},
    setAttribute() {}, querySelector() { return { innerHTML: '' }; },
    addEventListener(type, callback) { this.listeners[type] = callback; },
    focus(options) {
      // Emulate the browser's scroll-into-view behavior for focus in a sticky menu.
      if (!options?.preventScroll) scrollY -= 80;
      document.activeElement = this;
    },
  });
  const options = ['auto', 'light', 'dark'].map(value => element({ themeOption: value }));
  const trigger = element();
  const menu = element();
  menu.querySelectorAll = () => options;
  const picker = { addEventListener() {}, contains() { return true; } };
  const root = { dataset: { theme: 'dark' }, classList: { add() {}, remove() {} } };
  document.documentElement = root;
  const elements = { theme: trigger, 'theme-menu': menu, 'theme-icon': element(), 'theme-label': element() };
  document.getElementById = id => elements[id];
  document.querySelector = () => picker;
  document.querySelectorAll = () => options;
  const media = { matches: false, addEventListener() {} };
  const source = readFileSync(new URL('../src/theme.js', import.meta.url), 'utf8')
    .replace(/^import .*;\r?\n/, '');
  runInNewContext(source, {
    document, window: { addEventListener() {} }, matchMedia: () => media,
    localStorage: { getItem: () => 'dark', setItem() {} },
    clearTimeout() {}, setTimeout() {},
  });
  const key = value => ({ key: value, preventDefault() {} });
  trigger.listeners.click();
  assert.equal(document.activeElement, options[2]);
  menu.listeners.keydown(key('ArrowUp'));
  assert.equal(document.activeElement, options[1]);
  options[1].listeners.click();
  assert.equal(root.dataset.theme, 'light');
  assert.equal(document.activeElement, trigger);
  assert.equal(scrollY, 2400, 'Opening, navigating and selecting must not scroll');
  trigger.listeners.click();
  menu.listeners.keydown(key('d'));
  assert.equal(document.activeElement, options[2]);
  menu.listeners.keydown(key('Escape'));
  assert.equal(document.activeElement, trigger);
  assert.equal(scrollY, 2400, 'Typeahead and Escape must not scroll');
});
