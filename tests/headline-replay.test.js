import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../src/motion.js', import.meta.url), 'utf8');
function harness() {
  const preference = { matches: false };
  const classes = new Set();
  let flushes = 0;
  let click;
  const button = {
    classList: { add: value => classes.add(value), remove: value => classes.delete(value) },
    addEventListener(type, handler) { if (type === 'click') click = handler; },
    get offsetWidth() {
      assert.ok(classes.has('headline-restarting'), 'Flush while the old animation is disabled');
      flushes++;
      return 400;
    },
  };
  runInNewContext(source, { matchMedia: () => preference, document: { querySelector: () => button }, window: {} });
  return { click: () => click(), preference, classes, get flushes() { return flushes; } };
}
test('headline activation can restart completed or in-progress handwriting repeatedly', () => {
  const page = harness();
  for (let i = 1; i <= 3; i++) {
    page.click();
    assert.equal(page.flushes, i);
    assert.equal(page.classes.size, 0, 'Leave the original CSS animation enabled');
  }
});
test('headline replay observes reduced motion, including preference changes', () => {
  const page = harness();
  page.preference.matches = true;
  page.click();
  assert.equal(page.flushes, 0);
  assert.equal(page.classes.size, 0);
  page.preference.matches = false;
  page.click();
  assert.equal(page.flushes, 1);
});
