import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('the five section destinations remain, with skills inside About', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const ids = [...html.matchAll(/<section id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(ids, ['about', 'projects', 'ctfs', 'certifications', 'contact']);
  const about = html.match(/<section id="about"[\s\S]*?<\/section>/)[0];
  assert.ok(about.includes('id="skills"'));
});
