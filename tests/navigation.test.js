import test from 'node:test';
import assert from 'node:assert/strict';
import { activeSectionIndex } from '../src/active-section.js';

test('Contact activates even when its heading cannot reach the reading line', () => {
  assert.equal(activeSectionIndex([-2500, -1800, -1100, -400, 300], 220, true), 4);
});
test('normal scrolling selects the latest heading above the reading line', () => {
  assert.equal(activeSectionIndex([-1800, -1100, -400, 300, 1000], 220, false), 2);
  assert.equal(activeSectionIndex([-2400, -1700, -1000, -300, 400], 220, false), 3);
  assert.equal(activeSectionIndex([-2600, -1900, -1200, -500, 200], 220, false), 4);
});
test('returning to the top restores About', () => {
  assert.equal(activeSectionIndex([100, 900, 1700, 2500, 3300], 220, false), 0);
});
