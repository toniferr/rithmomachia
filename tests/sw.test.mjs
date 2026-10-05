import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SITE = new URL('../site/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const source = readFileSync(join(SITE, 'sw.js'), 'utf8');

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [relative(SITE, path).split(sep).join('/')];
  });
}

test('the service worker precaches every file the site serves', () => {
  const listed = [...source.matchAll(/^\s+'([^']+)',$/gm)].map((m) => m[1]).filter((f) => f !== './');
  // Not needed offline: the worker itself and the font licence texts.
  const expected = files(SITE).filter((f) => f !== 'sw.js' && !f.endsWith('.txt'));
  assert.deepEqual([...listed].sort(), [...expected].sort());
});

test('the cache name carries the placeholder the deploy workflow stamps', () => {
  assert.match(source, /const CACHE = 'rithmo-__VERSION__';/);
  const workflow = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  assert.match(workflow, /__VERSION__/);
});
