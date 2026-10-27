import test from 'node:test';
import assert from 'node:assert/strict';
import { finishThemeAnimation } from '../src/theme-transition.js';

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};

test('the old light snapshot stays clipped until the browser removes it', async () => {
  const animationDone = deferred();
  const snapshotsRemoved = deferred();
  let cancelled = false;
  const completion = finishThemeAnimation({
    finished: animationDone.promise,
    cancel: () => { cancelled = true; },
  }, { finished: snapshotsRemoved.promise });
  animationDone.resolve();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(cancelled, false, 'must not expose the full old light snapshot');
  snapshotsRemoved.resolve();
  await completion;
  assert.equal(cancelled, true);
});

test('interrupted transitions still clean up after snapshot removal', async () => {
  const snapshotsRemoved = deferred();
  let cancelled = false;
  const completion = finishThemeAnimation({
    finished: Promise.reject(new Error('Animation interrupted')),
    cancel: () => { cancelled = true; },
  }, { finished: snapshotsRemoved.promise });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(cancelled, false);
  snapshotsRemoved.resolve();
  await completion;
  assert.equal(cancelled, true);
});
