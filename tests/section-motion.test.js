import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../src/motion.js', import.meta.url), 'utf8');
function harness(reduce = false) {
  const runs = [], queue = [];
  const events = {}, documentEvents = {};
  let preferenceChange;
  const preference = { matches: reduce, addEventListener(type, handler) { preferenceChange = handler; } };
  const element = (name, top, height) => ({
    name, offsetTop: top, offsetHeight: height, offsetParent: null,
    contains(node) { return node === this; },
    animate(frames, options) {
      const run = { name, frames, options, cancelled: false, paused: false, currentTime: null,
        cancel() { this.cancelled = true; }, pause() { this.paused = true; } };
      runs.push(run);
      return run;
    },
  });
  const heading = element('heading', 900, 100), card = element('card', 1080, 200);
  const section = { querySelector: () => heading, querySelectorAll: () => [card] };
  const document = {
    activeElement: null, documentElement: { scrollHeight: 3000 },
    querySelector: selector => selector === '.site-header' ? { getBoundingClientRect: () => ({ bottom: 80 }) } : null,
    querySelectorAll: () => [section],
    addEventListener(type, handler) { documentEvents[type] = handler; },
  };
  const window = {
    scrollY: 0, innerHeight: 1000,
    requestAnimationFrame(handler) { queue.push(handler); },
    addEventListener(type, handler) { events[type] = handler; },
  };
  runInNewContext(source, { document, window, matchMedia: () => preference });
  const flush = () => { while (queue.length) queue.shift()(); };
  flush();
  return {
    runs, card, heading, document, window, queue, events, flush,
    active: name => runs.findLast(run => run.name === name && !run.cancelled),
    scroll(y) { window.scrollY = y; events.scroll(); flush(); },
    reduce(value) { preference.matches = value; preferenceChange(); flush(); },
    focus(target) { document.activeElement = target; documentEvents.focusin({ target }); },
  };
}

test('vertical motion follows scroll progress and reverses without a timed replay', () => {
  const page = harness();
  page.scroll(120);
  const run = page.active('card'), start = run.currentTime;
  assert.ok(run.paused);
  page.scroll(180);
  assert.ok(run.currentTime < start && run.currentTime > 500);
  page.scroll(120);
  assert.equal(run.currentTime, start);
  assert.equal(page.active('card'), run);
  assert.match(run.frames[0].transform, /translateY\(-/);
  assert.match(run.frames.at(-1).transform, /translateY\([\d.]+px\)/);
  assert.ok(run.frames.every(frame => !/rotate|scale|translateX/.test(frame.transform)));
  assert.ok(run.frames.every(frame => !('clipPath' in frame)));
});
test('content arriving from above uses the opposite vertical movement', () => {
  const page = harness();
  page.scroll(1180);
  const run = page.active('card'), start = run.currentTime;
  assert.ok(start < 500);
  page.scroll(1165);
  const returning = run.currentTime;
  assert.ok(returning < 500);
  page.scroll(1050);
  assert.ok(run.currentTime > returning && run.currentTime < 500);
  page.scroll(850);
  assert.equal(page.active('card'), undefined);
});
test('the reading area and offscreen content release animation effects', () => {
  const page = harness();
  page.scroll(120);
  const run = page.active('card');
  page.scroll(600);
  assert.ok(run.cancelled);
  assert.equal(page.active('card'), undefined);
  page.scroll(1180);
  const exit = page.active('card');
  page.scroll(1400);
  assert.ok(exit.cancelled);
});
test('a visible heading stays sharp while its section is still being read', () => {
  const page = harness();
  // Heading occupies 130–230px: inside the old 300px fade zone but fully visible.
  page.scroll(770);
  assert.equal(page.active('heading'), undefined);
  // Even with most of the heading behind the 80px header, remaining text is sharp.
  page.scroll(895);
  assert.equal(page.active('heading'), undefined);
  // Only the final 20px leaving the reading viewport receives an exit transition.
  page.scroll(910);
  assert.ok(page.active('heading').currentTime < 500);
  page.scroll(895);
  assert.ok(page.active('heading').currentTime < 500);
  page.scroll(600);
  assert.equal(page.active('heading'), undefined);
});
test('a tall card stays sharp while its remaining content is visible', () => {
  const page = harness();
  page.card.offsetHeight = 1200;
  page.scroll(1000);
  assert.equal(page.active('card'), undefined);
  page.scroll(1800);
  assert.equal(page.active('card'), undefined);
});
test('reduced motion suppresses effects and cancels an in-progress transition', () => {
  const page = harness(true);
  page.scroll(120);
  assert.equal(page.runs.length, 0);
  page.reduce(false);
  assert.ok(page.active('card'));
  page.reduce(true);
  assert.ok(page.runs.every(run => run.cancelled));
});
test('focused controls stay sharp across subsequent scroll updates', () => {
  const page = harness();
  page.scroll(120);
  const run = page.active('card');
  page.focus(page.card);
  assert.ok(run.cancelled);
  page.scroll(160);
  assert.equal(page.active('card'), undefined);
});
test('the final content is fully clear at the page bottom', () => {
  const page = harness();
  page.card.offsetTop = 2900;
  page.card.offsetHeight = 60;
  page.scroll(1950);
  assert.ok(page.active('card'));
  page.scroll(2000);
  assert.equal(page.active('card'), undefined);
});
test('scroll events are batched and resize recomputes progress', () => {
  const page = harness();
  page.events.scroll(); page.events.scroll();
  assert.equal(page.queue.length, 1);
  page.flush();
  page.scroll(120);
  const run = page.active('card');
  page.window.innerHeight = 1400;
  page.events.resize(); page.flush();
  assert.ok(run.cancelled);
});
test('missing animation support leaves content untouched', () => {
  const page = harness();
  delete page.card.animate;
  page.scroll(120);
  assert.equal(page.active('card'), undefined);
});
