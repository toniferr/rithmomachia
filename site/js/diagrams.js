// Codex illustrations and widgets. The capture diagrams are computed with the real engine, so a
// figure can never contradict the rules the machine plays by.

import {
  WHITE, BLACK, CIRCLE, TRIANGLE, SQUARE, PYRAMID, SETUP, createGame, createPosition, movesFrom, moveTo,
  previewMove, encodeMove, sqOf, progressionKind,
} from './engine.js';
import { BoardView, svgEl } from './board.js';
import { t } from './i18n.js';

const at = (name) => sqOf('abcdefgh'.indexOf(name[0]), Number(name.slice(1)) - 1);
const P = (side, type, value, name) => ({ side, type, value, sq: at(name) });
const area = (a, b) => ({ f0: 'abcdefgh'.indexOf(a[0]), r0: Number(a.slice(1)) - 1, f1: 'abcdefgh'.indexOf(b[0]), r1: Number(b.slice(1)) - 1 });

function newView(figure, opts) {
  const svg = svgEl('svg', { role: 'img', 'aria-label': figure.querySelector('figcaption')?.textContent || '' });
  figure.prepend(svg);
  return new BoardView(svg, { orientation: 'vertical', viewer: WHITE, ...opts });
}

function movesDiagram(figure, type, value) {
  const view = newView(figure, { area: area('a1', 'g7') });
  const st = createPosition({}, [P(WHITE, type, value, 'd4')]);
  view.setPieces(st);
  for (const m of movesFrom(st, at('d4'))) view.dot(moveTo(m), 'dot-move', 9);
}

// Shows a move (ghost at the origin, arrow) and what it captures (dashed arrows, struck pieces).
function captureDiagram(figure, box, pieces, from, to, toMove = WHITE) {
  const view = newView(figure, { area: box });
  const st = createPosition({}, pieces, toMove);
  const mover = st.board[at(from)];
  const { caps } = previewMove(st, encodeMove(at(from), at(to)));
  if (!caps.length) console.warn('diagram without capture', from, to);
  view.ghost(at(from), st.type[mover], st.side[mover], st.value[mover]);
  st.board[at(from)] = -1;
  st.board[at(to)] = mover;
  st.pos[mover] = at(to);
  view.setPieces(st);
  view.arrow(at(from), at(to));
  for (const c of caps) {
    for (const b of c.by) view.arrow(st.pos[b], st.pos[c.id], 'attack');
    view.strike(st.pos[c.id]);
  }
}

const DIAGRAMS = {
  setup(figure) {
    const view = newView(figure, { orientation: 'horizontal' });
    view.setPieces(createGame());
  },
  'move-circle': (f) => movesDiagram(f, CIRCLE, 16),
  'move-triangle': (f) => movesDiagram(f, TRIANGLE, 20),
  'move-square': (f) => movesDiagram(f, SQUARE, 45),
  encounter: (f) => captureDiagram(f, area('b2', 'f6'),
    [P(WHITE, CIRCLE, 16, 'c3'), P(BLACK, TRIANGLE, 16, 'e5')], 'c3', 'd4'),
  ambush: (f) => captureDiagram(f, area('c2', 'g8'),
    [P(WHITE, CIRCLE, 16, 'd3'), P(WHITE, TRIANGLE, 9, 'f7'), P(BLACK, CIRCLE, 25, 'f5')], 'd3', 'e4'),
  assault: (f) => captureDiagram(f, area('b1', 'f10'),
    [P(WHITE, TRIANGLE, 6, 'd2'), P(BLACK, TRIANGLE, 30, 'd10')], 'd2', 'd4'),
  siege: (f) => captureDiagram(f, area('a1', 'd4'),
    [P(WHITE, SQUARE, 15, 'a2'), P(WHITE, CIRCLE, 2, 'c2'), P(BLACK, CIRCLE, 81, 'a1')], 'c2', 'b1'),
  pyramid: (f) => captureDiagram(f, area('b4', 'f10'),
    [P(WHITE, PYRAMID, 91, 'd5'), P(BLACK, TRIANGLE, 36, 'd9')], 'd9', 'd7', BLACK),
  triumph(figure) {
    const view = newView(figure, { orientation: 'horizontal', area: area('a7', 'h12') });
    const st = createPosition({}, [
      P(WHITE, CIRCLE, 2, 'c10'), P(WHITE, CIRCLE, 4, 'd10'), P(WHITE, CIRCLE, 6, 'e11'),
      P(WHITE, TRIANGLE, 20, 'g8'), P(BLACK, CIRCLE, 9, 'b12'), P(BLACK, TRIANGLE, 30, 'g12'), P(BLACK, CIRCLE, 7, 'h11'),
    ]);
    const six = st.board[at('e11')];
    view.ghost(at('e11'), CIRCLE, WHITE, 6);
    st.board[at('e11')] = -1;
    st.board[at('e10')] = six;
    st.pos[six] = at('e10');
    view.setPieces(st);
    view.arrow(at('e11'), at('e10'));
    view.line(at('c10'), at('e10'), 'triumph-line');
  },
};

function meansWidget(el) {
  el.innerHTML = '';
  const a = Object.assign(document.createElement('input'), { type: 'number', min: 1, max: 9999, value: 6 });
  const c = Object.assign(document.createElement('input'), { type: 'number', min: 1, max: 9999, value: 12 });
  const la = document.createElement('label');
  la.append(t('meansA'), a);
  const lc = document.createElement('label');
  lc.append(t('meansB'), c);
  const out = document.createElement('output');
  el.append(la, lc, out);
  const fmt = (x) => (Number.isInteger(x) ? `<b>${x}</b>` : `<b>${x.toFixed(3)}</b><small>${t('notInteger')}</small>`);
  const update = () => {
    const x = Math.abs(Number(a.value) || 0), y = Math.abs(Number(c.value) || 0);
    if (!x || !y) { out.innerHTML = ''; return; }
    const ar = (x + y) / 2, ge = Math.sqrt(x * y), ha = (2 * x * y) / (x + y);
    out.innerHTML = `<div class="means"><div>${t('meanArith')}${fmt(ar)}</div><div>${t('meanGeo')}${fmt(ge)}</div>` +
      `<div>${t('meanHarm')}${fmt(ha)}</div></div>` +
      `<p><small>${t('meanNote')}</small></p>`;
  };
  a.addEventListener('input', update);
  c.addEventListener('input', update);
  update();
}

function progressionsWidget(el) {
  const kinds = ['arithmetic', 'geometric', 'harmonic'];
  const parts = [];
  for (const side of [WHITE, BLACK]) {
    const values = [...new Set(SETUP[side].filter((p) => p[2] !== PYRAMID).map((p) => p[3]))].sort((x, y) => x - y);
    const found = { arithmetic: [], geometric: [], harmonic: [] };
    for (let i = 0; i < values.length; i++) {
      for (let j = i + 1; j < values.length; j++) {
        for (let k = j + 1; k < values.length; k++) {
          const kind = progressionKind(values[i], values[j], values[k]);
          if (kind) found[kind].push(`${values[i]}·${values[j]}·${values[k]}`);
        }
      }
    }
    parts.push(`<h3>${t('sideName')[side]}</h3>` + kinds.map((k) =>
      `<p><b>${capitalize(t('kind')[k])}</b> (${found[k].length}): ${found[k].join(', ') || '—'}</p>`).join(''));
  }
  el.innerHTML = parts.join('');
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const WIDGETS = { means: meansWidget, progressions: progressionsWidget };

export function hydrate(root) {
  for (const fig of root.querySelectorAll('figure[data-diagram]')) DIAGRAMS[fig.dataset.diagram]?.(fig);
  for (const w of root.querySelectorAll('[data-widget]')) WIDGETS[w.dataset.widget]?.(w);
}

// The small board on the home page.
export function heroBoard(container) {
  const svg = svgEl('svg', { role: 'img', 'aria-label': t('title') });
  container.append(svg);
  new BoardView(svg, { orientation: 'horizontal', coords: false }).setPieces(createGame());
}
