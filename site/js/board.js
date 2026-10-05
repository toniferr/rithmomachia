// SVG drawing of the board and the pieces. Used by the game, the home page and the codex diagrams.

import { FILES, RANKS, WHITE, CIRCLE, TRIANGLE, SQUARE, PYRAMID, fileOf, rankOf, sqOf } from './engine.js';

const NS = 'http://www.w3.org/2000/svg';
export const CELL = 60;
const MARGIN = 22;

export function svgEl(tag, attrs = {}, parent = null) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}

// Draws one piece centred on (0, 0) in a CELL-sized box, inside group `g`.
export function drawPiece(g, type, side, value) {
  const tone = side === WHITE ? 'white' : 'black';
  const digits = String(value).length;
  let ty = 0, size = digits >= 3 ? 17 : 21;
  switch (type) {
    case CIRCLE:
      svgEl('circle', { class: `body ${tone}`, r: 23 }, g);
      break;
    case TRIANGLE:
      svgEl('polygon', { class: `body ${tone}`, points: '0,-25 25,19 -25,19' }, g);
      ty = 7;
      size = digits >= 3 ? 13 : 17;
      break;
    case SQUARE:
      svgEl('rect', { class: `body ${tone}`, x: -21, y: -21, width: 42, height: 42, rx: 1.5 }, g);
      break;
    case PYRAMID:
      svgEl('polygon', { class: `body ${tone}`, points: '0,-27 27,22 -27,22' }, g);
      // Layer bands across the triangle.
      for (const y of [-11, 3]) {
        const half = (27 * (y + 27)) / 49;
        svgEl('line', { class: `band ${tone}`, x1: -half + 1.5, x2: half - 1.5, y1: y, y2: y }, g);
      }
      svgEl('circle', { class: `band ${tone}`, cx: 0, cy: -19, r: 2.2 }, g);
      ty = 13;
      size = digits >= 3 ? 13 : 15;
      break;
  }
  const t = svgEl('text', { class: tone, x: 0, y: ty, 'font-size': size }, g);
  t.textContent = value;
  return g;
}

// A small standalone icon (trays, chronicle, inspector).
export function pieceIcon(type, side, value, { label = true } = {}) {
  const svg = svgEl('svg', { viewBox: '-30 -30 60 60', 'aria-hidden': 'true' });
  const g = svgEl('g', { class: 'piece' }, svg);
  drawPiece(g, type, side, label ? value : '');
  return svg;
}

// Board view. Options:
//   orientation: 'horizontal' (16 × 8, viewer's side on the left) or 'vertical' (8 × 16, viewer at the bottom)
//   viewer: WHITE | BLACK
//   area: { f0, f1, r0, r1 } to draw only part of the board (diagrams)
//   coords: draw file/rank labels
export class BoardView {
  constructor(svg, opts = {}) {
    this.svg = svg;
    this.opts = { orientation: 'vertical', viewer: WHITE, coords: true, area: null, ...opts };
    this.pieceNodes = new Map();
    this.build();
  }

  get area() {
    return this.opts.area || { f0: 0, f1: FILES - 1, r0: 0, r1: RANKS - 1 };
  }

  // Cell (col, row) of a square in screen terms.
  cellOf(sq) {
    const { f0, f1, r0, r1 } = this.area;
    const f = fileOf(sq), r = rankOf(sq);
    const white = this.opts.viewer === WHITE;
    if (this.opts.orientation === 'horizontal') {
      return white ? { col: r - r0, row: f - f0 } : { col: r1 - r, row: f1 - f };
    }
    return white ? { col: f - f0, row: r1 - r } : { col: f1 - f, row: r - r0 };
  }

  center(sq) {
    const { col, row } = this.cellOf(sq);
    return { x: this.ox + col * CELL + CELL / 2, y: this.oy + row * CELL + CELL / 2 };
  }

  squareAt(col, row) {
    for (const sq of this.squares) {
      const c = this.cellOf(sq);
      if (c.col === col && c.row === row) return sq;
    }
    return -1;
  }

  build() {
    const { svg } = this;
    svg.replaceChildren();
    const { f0, f1, r0, r1 } = this.area;
    const nf = f1 - f0 + 1, nr = r1 - r0 + 1;
    const horizontal = this.opts.orientation === 'horizontal';
    this.cols = horizontal ? nr : nf;
    this.rows = horizontal ? nf : nr;
    const m = this.opts.coords ? MARGIN : 8;
    this.ox = m;
    this.oy = 8;
    const w = this.cols * CELL, h = this.rows * CELL;
    svg.setAttribute('viewBox', `0 0 ${w + m + 8} ${h + m + 8}`);
    svg.classList.add('board');

    this.squares = [];
    for (let r = r0; r <= r1; r++) for (let f = f0; f <= f1; f++) this.squares.push(sqOf(f, r));

    this.layerSquares = svgEl('g', {}, svg);
    this.layerMarks = svgEl('g', {}, svg);
    this.layerPieces = svgEl('g', {}, svg);
    this.layerOver = svgEl('g', {}, svg);
    this.layerHits = svgEl('g', {}, svg);

    for (const sq of this.squares) {
      const { col, row } = this.cellOf(sq);
      const light = (fileOf(sq) + rankOf(sq)) % 2 === 0;
      svgEl('rect', {
        class: light ? 'sq-a' : 'sq-b',
        x: this.ox + col * CELL, y: this.oy + row * CELL, width: CELL, height: CELL,
      }, this.layerSquares);
    }
    // A faint tint on each half, and the dividing line between the two camps.
    if (r0 < RANKS / 2 && r1 >= RANKS / 2) {
      const mid = this.center(sqOf(f0, RANKS / 2));
      const before = this.center(sqOf(f0, RANKS / 2 - 1));
      if (horizontal) {
        const x = (mid.x + before.x) / 2;
        svgEl('line', { class: 'midline', x1: x, x2: x, y1: this.oy + 4, y2: this.oy + h - 4 }, this.layerSquares);
      } else {
        const y = (mid.y + before.y) / 2;
        svgEl('line', { class: 'midline', x1: this.ox + 4, x2: this.ox + w - 4, y1: y, y2: y }, this.layerSquares);
      }
    }
    for (let c = 1; c < this.cols; c++) {
      svgEl('line', { class: 'grid-line', x1: this.ox + c * CELL, x2: this.ox + c * CELL, y1: this.oy, y2: this.oy + h }, this.layerSquares);
    }
    for (let r = 1; r < this.rows; r++) {
      svgEl('line', { class: 'grid-line', x1: this.ox, x2: this.ox + w, y1: this.oy + r * CELL, y2: this.oy + r * CELL }, this.layerSquares);
    }
    svgEl('rect', { class: 'frame-outer', x: this.ox - 3.5, y: this.oy - 3.5, width: w + 7, height: h + 7 }, this.layerSquares);
    svgEl('rect', { class: 'frame-inner', x: this.ox + 1.5, y: this.oy + 1.5, width: w - 3, height: h - 3 }, this.layerSquares);

    if (this.opts.coords) {
      // Labels: along the bottom and the left edge.
      for (let c = 0; c < this.cols; c++) {
        const sq = this.squareAt(c, this.rows - 1);
        const label = horizontal ? String(rankOf(sq) + 1) : 'abcdefgh'[fileOf(sq)];
        const t = svgEl('text', { class: 'coord', x: this.ox + c * CELL + CELL / 2, y: this.oy + h + MARGIN / 2 + 3 }, this.layerSquares);
        t.textContent = label;
      }
      for (let r = 0; r < this.rows; r++) {
        const sq = this.squareAt(0, r);
        const label = horizontal ? 'abcdefgh'[fileOf(sq)] : String(rankOf(sq) + 1);
        const t = svgEl('text', { class: 'coord', x: this.ox - MARGIN / 2 - 1, y: this.oy + r * CELL + CELL / 2 }, this.layerSquares);
        t.textContent = label;
      }
    }

    if (this.opts.onSquare) {
      for (const sq of this.squares) {
        const { col, row } = this.cellOf(sq);
        const hit = svgEl('rect', {
          class: 'hit', x: this.ox + col * CELL, y: this.oy + row * CELL, width: CELL, height: CELL, 'data-sq': sq,
        }, this.layerHits);
        hit.addEventListener('click', () => this.opts.onSquare(sq));
        if (this.opts.onHover) {
          hit.addEventListener('mouseenter', () => this.opts.onHover(sq));
          hit.addEventListener('mouseleave', () => this.opts.onHover(-1));
        }
      }
    }
    this.pieceNodes.clear();
  }

  // Syncs piece groups with the state. `falling` = ids to animate out instead of removing at once.
  setPieces(st, { mineSide = null, falling = [] } = {}) {
    const fallingSet = new Set(falling);
    for (let id = 0; id < st.type.length; id++) {
      let node = this.pieceNodes.get(id);
      const inArea = this.squares.includes(st.pos[id]);
      if (!st.alive[id] || !inArea) {
        if (node && fallingSet.has(id)) {
          node.classList.add('falling');
          setTimeout(() => node.classList.add('hidden'), 900);
        } else if (node) {
          node.classList.add('hidden');
        }
        continue;
      }
      if (!node) {
        node = svgEl('g', { class: 'piece' }, this.layerPieces);
        drawPiece(node, st.type[id], st.side[id], st.value[id]);
        this.pieceNodes.set(id, node);
      }
      node.classList.remove('hidden', 'falling');
      node.classList.toggle('mine', mineSide !== null && st.side[id] === mineSide);
      const { x, y } = this.center(st.pos[id]);
      node.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  clearMarks() {
    this.layerMarks.replaceChildren();
    this.layerOver.replaceChildren();
  }

  markSquare(sq, cls) {
    const { col, row } = this.cellOf(sq);
    svgEl('rect', { class: cls, x: this.ox + col * CELL, y: this.oy + row * CELL, width: CELL, height: CELL }, this.layerMarks);
  }

  dot(sq, cls = 'dot-move', r = 8) {
    const { x, y } = this.center(sq);
    svgEl('circle', { class: cls, cx: x, cy: y, r }, this.layerOver);
  }

  ring(sq, cls, r = 27) {
    const { x, y } = this.center(sq);
    svgEl('circle', { class: cls, cx: x, cy: y, r }, this.layerOver);
  }

  cross(sq) {
    const { x, y } = this.center(sq);
    const d = 7;
    svgEl('path', { class: 'danger-x', d: `M${x + 14 - d},${y - 14 - d}l${2 * d},${2 * d}m0,${-2 * d}l${-2 * d},${2 * d}` }, this.layerOver);
  }

  strike(sq) {
    const { x, y } = this.center(sq);
    svgEl('path', { class: 'strike', d: `M${x - 20},${y - 20}L${x + 20},${y + 20}M${x + 20},${y - 20}L${x - 20},${y + 20}` }, this.layerOver);
  }

  arrow(from, to, cls = '') {
    const a = this.center(from), b = this.center(to);
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    const end = { x: b.x - ux * 22, y: b.y - uy * 22 };
    const start = { x: a.x + ux * 14, y: a.y + uy * 14 };
    svgEl('line', { class: `arrow ${cls}`, x1: start.x, y1: start.y, x2: end.x, y2: end.y }, this.layerOver);
    const hx = end.x + ux * 10, hy = end.y + uy * 10;
    const px = -uy * 6, py = ux * 6;
    svgEl('polygon', {
      class: `arrow-head ${cls}`,
      points: `${hx},${hy} ${end.x + px},${end.y + py} ${end.x - px},${end.y - py}`,
    }, this.layerOver);
  }

  line(a, b, cls) {
    const p = this.center(a), q = this.center(b);
    svgEl('line', { class: cls, x1: p.x, y1: p.y, x2: q.x, y2: q.y }, this.layerOver);
  }

  // A translucent copy of a piece (where a piece came from, in diagrams).
  ghost(sq, type, side, value) {
    const { x, y } = this.center(sq);
    const g = svgEl('g', { class: 'piece ghost', transform: `translate(${x} ${y})` }, this.layerMarks);
    drawPiece(g, type, side, value);
  }
}
