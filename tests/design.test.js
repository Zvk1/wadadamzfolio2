import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { linkHref } from '../src/links.js';

const css = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
const motion = readFileSync(new URL('../src/refinements.css', import.meta.url), 'utf8');
const palette = selector => {
  const start = css.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `Missing palette ${selector}`);
  const rule = css.slice(start, css.indexOf('}', start));
  return Object.fromEntries([...rule.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(([, property, value]) => [property, value]));
};
const dark = palette(':root');
const light = { ...dark, ...palette(':root[data-theme=light]') };
function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(value => {
    const channel = parseInt(value, 16) / 255;
    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
  });
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x,y) => y-x);
  return (values[0] + .05) / (values[1] + .05);
}
test('body, secondary text and interactive labels meet AA contrast in both themes', () => {
  for (const tokens of [dark, light]) {
    for (const surface of ['--bg', '--surface', '--overlay', '--accent-soft']) {
      for (const text of ['--text', '--muted', '--accent']) {
        assert.ok(contrast(tokens[text], tokens[surface]) >= 4.5, `${text} on ${surface}`);
      }
    }
    assert.ok(contrast(tokens['--on-accent'], tokens['--accent']) >= 4.5);
    assert.ok(contrast(tokens['--on-accent'], tokens['--accent-hover']) >= 4.5);
    assert.ok(contrast(tokens['--on-accent'], tokens['--button']) >= 4.5, 'Primary button label');
    assert.ok(contrast(tokens['--on-accent'], tokens['--button-hover']) >= 4.5, 'Primary button hover label');
    for (const surface of ['--panel-top', '--panel-bottom']) {
      assert.ok(contrast(tokens['--muted'], tokens[surface]) >= 4.5, `Secondary text on ${surface}`);
    }
  }
});
test('CSS variables resolve to a declared token or an explicit runtime fallback', () => {
  const declared = new Set();
  for (const sheet of [css, motion]) {
    for (const [, property] of sheet.matchAll(/(--[\w-]+)\s*:/g)) declared.add(property);
  }
  for (const sheet of [css, motion]) {
    for (const match of sheet.matchAll(/var\((--[\w-]+)\s*([,)])/g)) {
      assert.ok(declared.has(match[1]) || match[2] === ',', `Unresolved ${match[1]}`);
    }
  }
});
test('profile links accept real destinations and omit missing or unsafe ones', () => {
  assert.equal(linkHref('https://github.com/Zvk1'), 'https://github.com/Zvk1');
  assert.equal(linkHref('zaki.bnglng@gmail.com', 'email'), 'mailto:zaki.bnglng@gmail.com');
  assert.equal(linkHref('/profile.png', 'web', 'https://example.com/about'), 'https://example.com/profile.png');
  for (const invalid of ['', '  ', undefined, 'javascript:alert(1)', 'data:text/html,hello']) assert.equal(linkHref(invalid), null);
  assert.equal(linkHref('name@example.com\nBcc:someone@example.com', 'email'), null);
});
test('navigation targets, labels and portrait assets remain available', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, 'Duplicate document IDs');
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id), `Missing target ${id}`);
  for (const [, id] of html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g)) {
    // detail-title is created when its dialog opens.
    assert.ok(id === 'detail-title' || ids.includes(id), `Missing ARIA target ${id}`);
  }
  const content = readFileSync(new URL('../src/content.js', import.meta.url), 'utf8');
  for (const [, asset] of content.matchAll(/(?:photo(?:Light)?|image|certificate(?:Image)?|url): '\/([^']+)'/g)) {
    assert.ok(existsSync(new URL(`../public/${asset}`, import.meta.url)), `Missing asset ${asset}`);
  }
  assert.ok(!html.includes('\u2014'), 'UI copy contains em dash');
});
