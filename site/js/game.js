// The play view: board, panels, the human's clicks and the machine's replies.

import {
  BLACK, PYRAMID, PYRAMID_LAYERS, replay, makeMove, undoMove, legalMoves, movesFrom,
  moveFrom, moveTo, sqName, roman,
} from './engine.js';
import { BoardView, pieceIcon, svgEl } from './board.js';
import { t } from './i18n.js';
import { saveGame, clearGame } from './store.js';

const MIN_THINK_MS = 650;

function h(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const c of children) if (c != null) e.append(c);
  return e;
}

export class Game {
  // config: { options, human, level, moves }
  constructor(root, config, { onNewGame, onRules }) {
    this.root = root;
    this.config = config;
    this.human = config.human;
    this.ai = config.human ^ 1;
    this.level = config.level;
    this.st = replay(config.options, config.moves || []);
    this.onNewGame = onNewGame;
    this.onRules = onRules;
    this.selected = -1;
    this.hover = -1;
    this.busy = false;
    this.requestId = 0;
    this.aids = readAids(config.level);
    this.threatened = new Set();
    this.previews = new Map();
    this.chronicle = rebuildChronicle(config.options, config.moves || []);
    this.computeThreats();
    this.worker = new Worker(new URL('./ai-worker.js', import.meta.url), { type: 'module' });
    this.worker.onmessage = (e) => this.onWorker(e.data);
    this.mount();
    this.refresh();
    if (this.st.result) this.showVerdict();
    else if (this.st.toMove === this.ai) this.machineTurn();
  }

  destroy() {
    this.worker.terminate();
    this.resizeObserver?.disconnect();
    this.dialog?.remove();
  }

  // ---------------------------------------------------------------- layout

  mount() {
    this.statusEl = h('div', { class: 'status', role: 'status', 'aria-live': 'polite' });
    this.aidsBtn = h('button', { class: 'btn small toggle', type: 'button', title: t('aidsTitle'), 'aria-pressed': String(this.aids), onclick: () => this.toggleAids() }, t('aids'));
    this.undoBtn = h('button', { class: 'btn small', type: 'button', onclick: () => this.undo() }, t('undo'));
    this.resignBtn = h('button', { class: 'btn small', type: 'button', onclick: () => this.resign() }, t('resign'));
    const newBtn = h('button', { class: 'btn small', type: 'button', onclick: () => this.onNewGame() }, t('newGame'));
    this.svg = svgEl('svg', { role: 'img', 'aria-label': t('title') });
    this.wrap = h('div', { class: 'board-wrap' });
    this.wrap.append(this.svg);

    this.talliesEl = h('div');
    this.inspectorEl = h('div', { class: 'inspector' });
    this.chronicleEl = h('ol', { class: 'chronicle' });
    const legend = h('div', { class: 'legend' },
      h('span', {}, h('i', { class: 'l-move' }), t('legendMove')),
      h('span', {}, h('i', { class: 'l-cap' }), t('legendCapture')),
      h('span', {}, h('i', { class: 'l-danger' }), t('legendDanger')));
    this.legendEl = legend;

    const section = h('section', { class: 'folio game', 'aria-label': t('navPlay') },
      h('div', { class: 'game-top' }, this.statusEl, h('div', { class: 'toolbar' }, this.aidsBtn, this.undoBtn, this.resignBtn, newBtn)),
      this.wrap,
      h('div', { class: 'game-panels' },
        h('div', { class: 'card' }, h('h3', {}, t('captures')), this.talliesEl),
        h('div', { class: 'card' }, h('h3', {}, t('inspector')), this.inspectorEl, legend),
        h('div', { class: 'card log' }, h('h3', {}, t('chronicle')), this.chronicleEl)));
    this.root.replaceChildren(section);
    this.toasts = document.querySelector('.toasts');

    this.orientation = null;
    this.resizeObserver = new ResizeObserver(() => this.layout());
    this.resizeObserver.observe(section);
    this.layout();
  }

  layout() {
    const width = this.root.firstElementChild.clientWidth;
    const orientation = width >= 700 ? 'horizontal' : 'vertical';
    if (orientation === this.orientation) return;
    this.orientation = orientation;
    this.view = new BoardView(this.svg, {
      orientation,
      viewer: this.human,
      onSquare: (sq) => this.click(sq),
      onHover: (sq) => { this.hover = sq; this.renderInspector(); },
    });
    this.refresh();
  }

  // ---------------------------------------------------------------- rendering

  refresh(falling = []) {
    if (!this.view) return;
    const { st } = this;
    this.view.setPieces(st, { mineSide: this.human, falling });
    this.view.clearMarks();
    const last = st.stack[st.stack.length - 1];
    if (last) {
      this.view.markSquare(moveFrom(last.move), 'last-move');
      this.view.markSquare(moveTo(last.move), 'last-move');
    }
    if (st.result?.triumph) {
      const [a, , c] = st.result.triumph.pieces;
      this.view.line(st.pos[a], st.pos[c], 'triumph-line');
    }
    if (this.aids && !st.result && st.toMove === this.human && !this.busy) {
      for (const id of this.threatened) this.view.ring(st.pos[id], 'ring-danger', 28);
    }
    if (this.selected >= 0) {
      this.view.ring(this.selected, 'sel-ring', 29);
      for (const [to, info] of this.previews) {
        if (this.aids && info.caps) this.view.ring(to, 'ring-capture', 15);
        this.view.dot(to);
        if (this.aids && info.danger) this.view.cross(to);
      }
    }
    this.renderStatus();
    this.renderTallies();
    this.renderChronicle();
    this.renderInspector();
    this.undoBtn.disabled = this.busy || !this.humanMoves();
    this.resignBtn.disabled = !!st.result;
  }

  renderStatus() {
    const { st } = this;
    const seal = h('span', { class: `seal ${st.toMove === BLACK ? 'black' : ''}` });
    let main, sub;
    if (st.result) {
      main = t('gameOver');
      const w = st.result.winner;
      sub = w === -1 ? t('draw') : w === this.human ? t('win') : t('loss');
    } else if (st.toMove === this.human) {
      main = t('yourTurn');
      sub = this.selected >= 0 ? t('pickTarget') : t('yourTurnHint');
    } else {
      main = h('span', { class: 'thinking' }, t('thinking'));
      sub = t('thinkingHint');
    }
    this.statusEl.replaceChildren(seal, h('div', {}, main, h('small', {}, `${t('sideName')[st.toMove]} · ${sub}`)));
  }

  renderTallies() {
    const { st } = this;
    const mode = st.options.victory;
    const block = (side) => {
      const tray = h('div', { class: 'tray' });
      for (const rec of st.stack) {
        for (const id of rec.caps) if (st.side[id] !== side) tray.append(pieceIcon(st.type[id], st.side[id], st.value[id]));
      }
      const rows = [];
      if (mode !== 'bonis') rows.push([t('piecesOf', { n: st.capCount[side], goal: st.goalCount }), st.capCount[side] / st.goalCount]);
      if (mode !== 'corpore') rows.push([t('valueOf', { n: st.capValue[side], goal: st.goalValue[side] }), st.capValue[side] / st.goalValue[side]]);
      const out = h('div', { class: 'tally' });
      rows.forEach(([label, frac], i) => {
        out.append(h('div', { class: 'tally-head' }, i === 0 ? h('b', {}, t('capturedBy')[side === this.human ? 0 : 1]) : h('b', {}, ''), h('span', {}, label)));
        const bar = h('div', { class: `bar ${side === this.ai ? 'rival' : ''}` });
        const fill = h('i');
        fill.style.width = `${Math.min(100, frac * 100).toFixed(1)}%`;
        bar.append(fill);
        out.append(bar);
      });
      out.append(tray);
      return out;
    };
    this.talliesEl.replaceChildren(block(this.human), block(this.ai));
  }

  renderChronicle() {
    const list = this.chronicle;
    if (!list.length) {
      this.chronicleEl.replaceChildren(h('li', {}, h('span'), h('span', { class: 'theirs' }, t('chronicleEmpty'))));
      return;
    }
    const items = list.map((e, i) => {
      const who = e.side === this.human ? 'mine' : 'theirs';
      const body = h('span', { class: who });
      const icon = pieceIcon(e.type, e.side, e.value, { label: false });
      icon.setAttribute('class', 'glyph');
      body.append(icon, `${e.value}  ${sqName(e.from)}–${sqName(e.to)}`);
      for (const c of e.caps) body.append(h('span', { class: 'cap' }, `× ${captureText(c)}`));
      return h('li', {}, h('span', { class: 'n' }, `${i + 1}.`), body);
    });
    this.chronicleEl.replaceChildren(...items.reverse());
  }

  renderInspector() {
    const { st } = this;
    let sq = this.hover >= 0 && st.board[this.hover] >= 0 ? this.hover : this.selected;
    const id = sq >= 0 ? st.board[sq] : -1;
    if (id < 0) {
      this.inspectorEl.replaceChildren(h('p', {}, t('inspectorEmpty')));
      return;
    }
    const type = st.type[id], side = st.side[id], value = st.value[id];
    const parts = [
      h('div', { class: 'big' }, pieceIcon(type, side, value),
        h('div', {}, h('b', {}, String(value)), h('span', {}, `${t('shape')[type]} ${t('sideOf')[side]} · ${roman(value)} · ${sqName(st.pos[id])}`))),
      h('p', {}, t('moveDesc')[type]),
    ];
    if (type === PYRAMID) {
      const layers = PYRAMID_LAYERS[side];
      parts.push(h('p', {}, t('pyramidLayers', { layers: layers.join(' + '), total: value, base: layers[0] })));
    }
    if (this.aids && this.threatened.has(id)) parts.push(h('p', { class: 'rubric' }, t('threatened')));
    this.inspectorEl.replaceChildren(...parts);
  }

  // ---------------------------------------------------------------- the human's turn

  click(sq) {
    const { st } = this;
    if (this.busy || st.result || st.toMove !== this.human) return;
    const id = st.board[sq];
    if (id >= 0 && st.side[id] === this.human) {
      if (this.selected === sq) this.select(-1);
      else this.select(sq);
      return;
    }
    if (this.selected >= 0 && this.previews.has(sq)) {
      const move = this.previews.get(sq).move;
      this.select(-1, false);
      this.play(move);
      return;
    }
    this.select(-1);
  }

  select(sq, redraw = true) {
    this.selected = sq;
    this.previews = new Map();
    if (sq >= 0) {
      for (const m of movesFrom(this.st, sq)) {
        const info = { move: m, caps: 0, danger: false };
        const caps = makeMove(this.st, m, { full: false });
        info.caps = caps.length;
        if (this.aids && !this.st.result) info.danger = this.capturableAfterReply(this.st.board[moveTo(m)]);
        undoMove(this.st);
        this.previews.set(moveTo(m), info);
      }
    }
    if (redraw) this.refresh();
  }

  // With the opponent to move: can any reply capture piece `id`?
  capturableAfterReply(id) {
    for (const reply of legalMoves(this.st)) {
      const caps = makeMove(this.st, reply, { full: false });
      undoMove(this.st);
      if (caps.includes(id)) return true;
    }
    return false;
  }

  // My pieces the machine could take with its next move (computed on my turn).
  computeThreats() {
    const { st } = this;
    const set = new Set();
    if (!this.aids || st.result || st.toMove !== this.human) {
      this.threatened = set;
      return;
    }
    st.toMove = this.ai;
    for (const reply of legalMoves(st)) {
      for (const id of makeMove(st, reply, { full: false })) set.add(id);
      undoMove(st);
    }
    st.toMove = this.human;
    this.threatened = set;
  }

  play(move) {
    const caps = this.apply(move);
    this.announce(caps, this.human);
    if (this.st.result) return this.finish();
    this.machineTurn();
  }

  // Plays a move for whoever is to move, records it and redraws.
  apply(move) {
    const { st } = this;
    const id = st.board[moveFrom(move)];
    const caps = makeMove(st, move, { explain: true });
    this.chronicle.push({ side: st.side[id], type: st.type[id], value: st.value[id], from: moveFrom(move), to: moveTo(move), caps: caps.map((c) => describe(st, c)) });
    this.save();
    this.computeThreats();
    this.refresh(caps.map((c) => c.id));
    return caps;
  }

  // ---------------------------------------------------------------- the machine's turn

  machineTurn() {
    this.busy = true;
    this.threatened = new Set();
    this.refresh();
    const id = ++this.requestId;
    this.thinkStart = performance.now();
    this.worker.postMessage({ id, options: this.st.options, moves: this.st.stack.map((r) => r.move), level: this.level });
  }

  onWorker({ id, move }) {
    if (id !== this.requestId) return;
    const wait = Math.max(0, MIN_THINK_MS - (performance.now() - this.thinkStart));
    setTimeout(() => {
      if (id !== this.requestId) return;
      this.busy = false;
      if (move == null) return;
      const caps = this.apply(move);
      this.announce(caps, this.ai);
      if (this.st.result) this.finish();
    }, wait);
  }

  // ---------------------------------------------------------------- tools

  humanMoves() {
    return this.st.stack.some((r) => this.st.side[r.id] === this.human);
  }

  undo() {
    const { st } = this;
    if (this.busy || !this.humanMoves()) return;
    this.dialog?.close();
    do {
      undoMove(st);
      this.chronicle.pop();
    } while (st.stack.length && st.toMove !== this.human);
    this.select(-1, false);
    this.save();
    this.computeThreats();
    this.refresh();
    if (st.toMove !== this.human) this.machineTurn();
  }

  resign() {
    if (this.st.result) return;
    if (!window.confirm(t('resignConfirm'))) return;
    this.requestId++;
    this.busy = false;
    this.st.result = { winner: this.ai, reason: 'resign' };
    this.finish();
  }

  toggleAids() {
    this.aids = !this.aids;
    try { localStorage.setItem('rithmo.aids', this.aids ? '1' : '0'); } catch { /* ignore */ }
    this.aidsBtn.setAttribute('aria-pressed', String(this.aids));
    this.computeThreats();
    this.select(this.selected);
  }

  save() {
    saveGame({ ...this.config, moves: this.st.stack.map((r) => r.move) });
  }

  announce(caps, mover) {
    if (!this.toasts) return;
    for (const c of caps) {
      const text = captureText(describe(this.st, c));
      const head = mover === this.human ? t('yourGain', { v: this.st.value[c.id] }) : t('yourLoss', { v: this.st.value[c.id] });
      const toast = h('div', { class: `toast ${mover === this.human ? '' : 'bad'}` }, `${head} — ${text}`);
      this.toasts.append(toast);
      setTimeout(() => toast.remove(), 4300);
    }
  }

  finish() {
    clearGame();
    this.refresh();
    setTimeout(() => this.showVerdict(), 900);
  }

  showVerdict() {
    const { st } = this;
    const r = st.result;
    const w = r.winner;
    const heading = w === -1 ? t('draw') : w === this.human ? t('win') : t('loss');
    let why;
    if (w === -1) why = t('reasonDraw');
    else {
      const vars = r.triumph ? { kind: t('kind')[r.triumph.kind], values: r.triumph.values.join(' · ') } : {};
      why = t(`${w === this.human ? 'reasonWin' : 'reasonLoss'}.${r.reason}`, vars);
    }
    this.dialog?.remove();
    const dialog = h('dialog', { class: 'folio' },
      h('div', { class: 'dialog-body verdict' },
        h('h2', {}, heading),
        h('p', { class: 'why' }, why),
        h('div', { class: 'stats' },
          h('div', {}, h('b', {}, String(Math.ceil(st.ply / 2))), t('statMoves')),
          h('div', {}, h('b', {}, `${st.capCount[this.human]} · ${st.capValue[this.human]}`), t('statYours')),
          h('div', {}, h('b', {}, `${st.capCount[this.ai]} · ${st.capValue[this.ai]}`), t('statTheirs'))),
        h('div', { class: 'dialog-actions' },
          h('button', { class: 'btn primary', type: 'button', onclick: () => { dialog.close(); this.onNewGame(); } }, t('again')),
          h('button', { class: 'btn', type: 'button', onclick: () => dialog.close() }, t('review')),
          h('button', { class: 'btn', type: 'button', onclick: () => { dialog.close(); this.onRules(); } }, t('readRules')))));
    document.body.append(dialog);
    this.dialog = dialog;
    dialog.showModal();
  }
}

function readAids(level) {
  try {
    const v = localStorage.getItem('rithmo.aids');
    if (v === '1' || v === '0') return v === '1';
  } catch { /* ignore */ }
  return level !== 'hard';
}

function describe(st, c) {
  return { rule: c.rule, value: st.value[c.id], values: c.values, distance: c.distance, target: c.target };
}

function captureText(c) {
  const v = c.target ?? c.value;
  switch (c.rule) {
    case 'ambush': return t('capExplain.ambush', { v, a: c.values[0], b: c.values[1] });
    case 'assault': return t('capExplain.assault', { v, a: c.values[0], k: c.distance });
    default: return t(`capExplain.${c.rule}`, { v });
  }
}

function rebuildChronicle(options, moves) {
  const st = replay(options, []);
  const out = [];
  for (const m of moves) {
    if (st.result) break;
    const id = st.board[moveFrom(m)];
    const caps = makeMove(st, m, { explain: true });
    out.push({ side: st.side[id], type: st.type[id], value: st.value[id], from: moveFrom(m), to: moveTo(m), caps: caps.map((c) => describe(st, c)) });
  }
  return out;
}

