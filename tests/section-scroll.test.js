import test from 'node:test';
import assert from 'node:assert/strict';
import { createSectionScroller } from '../src/section-scroll.js';

function harness(reduced = false) {
  let change, next = 0;
  const frames = new Map();
  const preference = { matches: reduced, addEventListener(type, handler) { change = handler; } };
  const view = {
    scrollY: 0,
    requestAnimationFrame(fn) { frames.set(++next, fn); return next; },
    cancelAnimationFrame(id) { frames.delete(id); },
    scrollTo({ top, behavior }) { assert.equal(behavior, 'instant'); this.scrollY = top; },
  };
  const scroller = createSectionScroller(view, preference);
  return { view, scroller,
    tick(time) { const work = [...frames.values()]; frames.clear(); work.forEach(fn => fn(time)); },
    reduce() { preference.matches = true; change(); },
  };
}
test('button scrolling remains visible at half a second and lands within 850ms', () => {
  const page = harness();
  let finished = 0;
  page.scroller.to(2000, () => finished++);
  page.tick(0); page.tick(20);
  const early = page.view.scrollY;
  assert.ok(early > 0 && early < 50);
  page.tick(200);
  assert.ok(page.view.scrollY > early && page.view.scrollY < 2000);
  page.tick(500);
  assert.ok(page.scroller.running);
  assert.ok(page.view.scrollY < 2000);
  page.tick(850); page.tick(900);
  assert.equal(page.view.scrollY, 2000);
  assert.equal(finished, 1);
  assert.equal(page.scroller.running, false);
});
test('interruption stops scrolling and a new destination starts from the current position', () => {
  const page = harness();
  page.scroller.to(2000, () => assert.fail('Cancelled destination must not finish'));
  page.tick(0); page.tick(200);
  const current = page.view.scrollY;
  page.scroller.cancel(); page.tick(2000);
  assert.equal(page.view.scrollY, current);
  page.scroller.to(0);
  page.tick(2100);
  assert.equal(page.view.scrollY, current);
  page.tick(4000);
  assert.equal(page.view.scrollY, 0);
});
test('reduced motion is immediate, including a preference change during scrolling', () => {
  const instant = harness(true);
  instant.scroller.to(800);
  assert.equal(instant.view.scrollY, 800);
  assert.equal(instant.scroller.running, false);
  const page = harness();
  let finished = 0;
  page.scroller.to(1800, () => finished++);
  page.tick(0); page.tick(100); page.reduce();
  assert.equal(page.view.scrollY, 1800);
  assert.equal(finished, 1);
  assert.equal(page.scroller.running, false);
});
