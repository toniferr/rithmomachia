// Rithmomachia rules engine. Pure module (no DOM): shared by the UI, the AI worker and the tests.
//
// Board: 8 files (a–h) × 16 ranks (1–16). Square index = rank * 8 + file.
// White (the evens) starts on ranks 1–4 and moves first; Black (the odds) on ranks 13–16.
// The exact medieval rules vary between manuscripts; this is the modern reconstruction described
// in the wiki ("Rules" chapter). Keep the two in sync.

export const FILES = 8;
export const RANKS = 16;
export const NSQ = FILES * RANKS;

export const WHITE = 0;
export const BLACK = 1;

export const CIRCLE = 0;
export const TRIANGLE = 1;
export const SQUARE = 2;
export const PYRAMID = 3;

// Pyramid layers, from base to apex. White 91 = 1²+…+6², Black 190 = 4²+…+8².
export const PYRAMID_LAYERS = [
  [36, 25, 16, 9, 4, 1],
  [64, 49, 36, 25, 16],
];

export const sqOf = (file, rank) => rank * FILES + file;
export const fileOf = (s) => s % FILES;
export const rankOf = (s) => (s / FILES) | 0;
export const sqName = (s) => 'abcdefgh'[fileOf(s)] + (rankOf(s) + 1);

const C = CIRCLE, T = TRIANGLE, S = SQUARE, P = PYRAMID;

// [file, rank, type, value]. Black is White rotated 180°, with the odd numbers.
export const SETUP = [
  [
    [0, 0, S, 289], [1, 0, S, 169], [6, 0, S, 81], [7, 0, S, 25],
    [0, 1, S, 153], [1, 1, P, 91], [2, 1, T, 81], [3, 1, T, 49], [4, 1, T, 25], [5, 1, T, 9], [6, 1, S, 45], [7, 1, S, 15],
    [0, 2, T, 72], [1, 2, T, 42], [2, 2, C, 64], [3, 2, C, 36], [4, 2, C, 16], [5, 2, C, 4], [6, 2, T, 20], [7, 2, T, 6],
    [2, 3, C, 8], [3, 3, C, 6], [4, 3, C, 4], [5, 3, C, 2],
  ],
  [
    [0, 15, S, 49], [1, 15, S, 121], [6, 15, S, 225], [7, 15, S, 361],
    [0, 14, S, 28], [1, 14, S, 66], [2, 14, T, 16], [3, 14, T, 36], [4, 14, T, 64], [5, 14, T, 100], [6, 14, P, 190], [7, 14, S, 120],
    [0, 13, T, 12], [1, 13, T, 30], [2, 13, C, 9], [3, 13, C, 25], [4, 13, C, 49], [5, 13, C, 81], [6, 13, T, 56], [7, 13, T, 90],
    [2, 12, C, 3], [3, 12, C, 5], [4, 12, C, 7], [5, 12, C, 9],
  ],
];

export const ARMY_VALUE = SETUP.map((army) => army.reduce((sum, p) => sum + p[3], 0));

// Victory goals. "length" scales how much has to be captured.
export const GOALS = {
  short: { count: 6, share: 0.25 },
  normal: { count: 10, share: 0.4 },
  long: { count: 14, share: 0.55 },
};

export const DEFAULT_OPTIONS = { victory: 'corpore', length: 'normal', triumph: true, maxPlies: 400 };

// ---------------------------------------------------------------------------------------------
// Geometry tables, precomputed once.

function onBoard(f, r) {
  return f >= 0 && f < FILES && r >= 0 && r < RANKS;
}

const ORTHO = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const DIAG = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
export const DIRECTIONS = [...ORTHO, ...DIAG];
const KNIGHT_JUMPS = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];
const LONG_JUMPS = [[1, 3], [3, 1], [-1, 3], [-3, 1], [1, -3], [3, -1], [-1, -3], [-3, -1]];

function table(fn) {
  const out = [];
  for (let s = 0; s < NSQ; s++) out.push(fn(fileOf(s), rankOf(s)));
  return out;
}

// Each entry lists [destination, ...squares that must be empty on the way].
const STEP1 = table((f, r) => DIAG.filter(([df, dr]) => onBoard(f + df, r + dr)).map(([df, dr]) => [sqOf(f + df, r + dr)]));
const STEP2 = table((f, r) => ORTHO.filter(([df, dr]) => onBoard(f + 2 * df, r + 2 * dr))
  .map(([df, dr]) => [sqOf(f + 2 * df, r + 2 * dr), sqOf(f + df, r + dr)]));
const STEP3 = table((f, r) => ORTHO.filter(([df, dr]) => onBoard(f + 3 * df, r + 3 * dr))
  .map(([df, dr]) => [sqOf(f + 3 * df, r + 3 * dr), sqOf(f + df, r + dr), sqOf(f + 2 * df, r + 2 * dr)]));
const JUMP2 = table((f, r) => KNIGHT_JUMPS.filter(([df, dr]) => onBoard(f + df, r + dr)).map(([df, dr]) => [sqOf(f + df, r + dr)]));
const JUMP3 = table((f, r) => LONG_JUMPS.filter(([df, dr]) => onBoard(f + df, r + dr)).map(([df, dr]) => [sqOf(f + df, r + dr)]));
// Rays in the 8 directions, nearest square first; index < 4 = orthogonal.
const RAYS = table((f, r) => DIRECTIONS.map(([df, dr]) => {
  const ray = [];
  for (let k = 1; onBoard(f + k * df, r + k * dr); k++) ray.push(sqOf(f + k * df, r + k * dr));
  return ray;
}));
const NEIGHBOURS = table((f, r) => ORTHO.map(([df, dr]) => (onBoard(f + df, r + dr) ? sqOf(f + df, r + dr) : -1)));

// Movement patterns available to each type (a pyramid moves like any of its layers' shapes).
const PATTERNS = [
  [STEP1],
  [STEP2, JUMP2],
  [STEP3, JUMP3],
  [STEP1, STEP2, JUMP2, STEP3, JUMP3],
];
// Which piece types can use a pattern (bit mask by type).
const MASK_C = (1 << CIRCLE) | (1 << PYRAMID);
const MASK_T = (1 << TRIANGLE) | (1 << PYRAMID);
const MASK_S = (1 << SQUARE) | (1 << PYRAMID);
const REACH = [[STEP1, MASK_C], [STEP2, MASK_T], [JUMP2, MASK_T], [STEP3, MASK_S], [JUMP3, MASK_S]];

// ---------------------------------------------------------------------------------------------
// Game state

export function normalizeOptions(opts = {}) {
  const o = { ...DEFAULT_OPTIONS, ...opts };
  if (!['corpore', 'bonis', 'honore'].includes(o.victory)) o.victory = 'corpore';
  if (!GOALS[o.length]) o.length = 'normal';
  o.triumph = !!o.triumph;
  return o;
}

export function createGame(opts) {
  const pieces = [];
  for (const side of [WHITE, BLACK]) {
    for (const [f, r, type, value] of SETUP[side]) pieces.push({ side, type, value, sq: sqOf(f, r) });
  }
  return createPosition(opts, pieces);
}

// Any position: pieces = [{ side, type, value, sq }]. Used by the tests and the wiki diagrams.
export function createPosition(opts, pieces, toMove = WHITE) {
  const options = normalizeOptions(opts);
  const n = pieces.length;
  const st = {
    options,
    board: new Int8Array(NSQ).fill(-1),
    type: new Uint8Array(n),
    side: new Uint8Array(n),
    value: new Int16Array(n),
    pos: new Int16Array(n),
    alive: new Uint8Array(n),
    attackValues: [], // values a piece attacks with (a pyramid: total and every layer)
    targetValues: [], // values a piece can be captured by (a pyramid: total and base)
    pyramid: [-1, -1],
    toMove,
    ply: 0,
    capCount: [0, 0], // pieces captured BY each side
    capValue: [0, 0],
    goalCount: GOALS[options.length].count,
    goalValue: [
      Math.ceil(GOALS[options.length].share * ARMY_VALUE[BLACK]),
      Math.ceil(GOALS[options.length].share * ARMY_VALUE[WHITE]),
    ],
    stack: [],
    result: null,
  };
  pieces.forEach(({ side, type, value, sq }, id) => {
    st.type[id] = type;
    st.side[id] = side;
    st.value[id] = value;
    st.pos[id] = sq;
    st.alive[id] = 1;
    st.board[sq] = id;
    if (type === PYRAMID) {
      st.pyramid[side] = id;
      st.attackValues.push([value, ...PYRAMID_LAYERS[side]]);
      st.targetValues.push([value, PYRAMID_LAYERS[side][0]]);
    } else {
      st.attackValues.push([value]);
      st.targetValues.push([value]);
    }
  });
  return st;
}

// Moves are small integers: from | to << 7.
export const encodeMove = (from, to) => from | (to << 7);
export const moveFrom = (m) => m & 127;
export const moveTo = (m) => m >> 7;

function pushMoves(st, from, type, out) {
  const board = st.board;
  for (const pattern of PATTERNS[type]) {
    const entries = pattern[from];
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      if (board[e[0]] >= 0) continue;
      let clear = true;
      for (let j = 1; j < e.length; j++) if (board[e[j]] >= 0) { clear = false; break; }
      if (clear) out.push(encodeMove(from, e[0]));
    }
  }
}

export function legalMoves(st, side = st.toMove) {
  const out = [];
  if (st.result) return out;
  for (let id = 0; id < st.type.length; id++) {
    if (st.alive[id] && st.side[id] === side) pushMoves(st, st.pos[id], st.type[id], out);
  }
  return out;
}

export function movesFrom(st, square) {
  const id = st.board[square];
  const out = [];
  if (id < 0 || st.result || st.side[id] !== st.toMove) return out;
  pushMoves(st, square, st.type[id], out);
  return out;
}

export function hasAnyMove(st, side) {
  const tmp = [];
  for (let id = 0; id < st.type.length; id++) {
    if (st.alive[id] && st.side[id] === side) {
      pushMoves(st, st.pos[id], st.type[id], tmp);
      if (tmp.length) return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------------------------
// Captures. After a side moves, every enemy piece that is caught by one of the four rules is
// removed at once (they are computed on the same position, then removed together).

const reachBuf = new Int16Array(40);

// Pieces of `side` that could move onto square `target` (its occupant is ignored).
function reachers(st, target, side, buf) {
  const { board, type } = st;
  let n = 0;
  for (let k = 0; k < REACH.length; k++) {
    const [pattern, mask] = REACH[k];
    const entries = pattern[target];
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      const p = board[e[0]];
      if (p < 0 || st.side[p] !== side || !((1 << type[p]) & mask)) continue;
      let clear = true;
      for (let j = 1; j < e.length; j++) if (board[e[j]] >= 0) { clear = false; break; }
      if (clear) buf[n++] = p;
    }
  }
  return n;
}

// Returns null, or a description of why piece `id` falls to `side`.
export function captureReason(st, id, side) {
  const target = st.pos[id];
  const tv = st.targetValues[id];
  const av = st.attackValues;
  const n = reachers(st, target, side, reachBuf);

  // Encounter: an enemy piece of equal value could move onto it.
  for (let i = 0; i < n; i++) {
    const a = reachBuf[i];
    for (const x of av[a]) for (const t of tv) if (x === t) return { rule: 'encounter', by: [a], values: [x], target: t };
  }
  // Ambush: two pieces that could both move onto it, whose values add up to it.
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = reachBuf[i], b = reachBuf[j];
      for (const x of av[a]) for (const y of av[b]) for (const t of tv) {
        if (x + y === t) return { rule: 'ambush', by: [a, b], values: [x, y], target: t };
      }
    }
  }
  // Assault: a smaller piece on one of its lines of movement, with k empty squares between,
  // whose value times k equals it. Circles assault along diagonals, triangles and squares along
  // ranks and files, the pyramid along both.
  const rays = RAYS[target];
  for (let d = 0; d < 8; d++) {
    const ray = rays[d];
    let k = 0;
    while (k < ray.length && st.board[ray[k]] < 0) k++;
    if (k === 0 || k === ray.length) continue;
    const a = st.board[ray[k]];
    if (st.side[a] !== side) continue;
    const t = st.type[a];
    const fits = d < 4 ? t !== CIRCLE : (t === CIRCLE || t === PYRAMID);
    if (!fits) continue;
    for (const x of av[a]) for (const v of tv) {
      if (x < v && x * k === v) return { rule: 'assault', by: [a], values: [x], target: v, distance: k };
    }
  }
  // Siege: every orthogonal neighbour is an enemy piece or the edge of the board.
  const nb = NEIGHBOURS[target];
  const besiegers = [];
  for (let i = 0; i < 4; i++) {
    const s = nb[i];
    if (s < 0) continue;
    const p = st.board[s];
    if (p < 0 || st.side[p] !== side) return null;
    besiegers.push(p);
  }
  if (besiegers.length) return { rule: 'siege', by: besiegers, values: [], target: st.value[id] };
  return null;
}

// All enemy pieces that `side` captures in the current position.
export function findCaptures(st, side, explain = false) {
  const out = [];
  const enemy = side ^ 1;
  for (let id = 0; id < st.type.length; id++) {
    if (!st.alive[id] || st.side[id] !== enemy) continue;
    const why = captureReason(st, id, side);
    if (why) out.push(explain ? { id, ...why } : id);
  }
  return out;
}

// Sum of values / count of what `side` would capture right now (used by the AI evaluation).
export function pendingCaptures(st, side) {
  let count = 0, value = 0;
  const enemy = side ^ 1;
  for (let id = 0; id < st.type.length; id++) {
    if (!st.alive[id] || st.side[id] !== enemy) continue;
    if (captureReason(st, id, side)) { count++; value += st.value[id]; }
  }
  return { count, value };
}

// ---------------------------------------------------------------------------------------------
// Triumph (victoria magna): three of your pieces in a row inside the enemy half, in arithmetic,
// geometric or harmonic progression, once the enemy pyramid has fallen.

export function progressionKind(a, b, c) {
  if (a === c || a === b || b === c) return null;
  if ((b - a) * (c - b) <= 0) return null; // the middle piece must hold the middle term
  if (2 * b === a + c) return 'arithmetic';
  if (b * b === a * c) return 'geometric';
  if (b * (a + c) === 2 * a * c) return 'harmonic';
  return null;
}

const LINE_DIRS = [[1, 0], [0, 1], [1, 1], [1, -1]];

export function inEnemyHalf(side, square) {
  const r = rankOf(square);
  return side === WHITE ? r >= RANKS / 2 : r < RANKS / 2;
}

export function findTriumph(st, side) {
  for (let id = 0; id < st.type.length; id++) {
    if (!st.alive[id] || st.side[id] !== side) continue;
    const s0 = st.pos[id];
    if (!inEnemyHalf(side, s0)) continue;
    const f = fileOf(s0), r = rankOf(s0);
    for (const [df, dr] of LINE_DIRS) {
      if (!onBoard(f + 2 * df, r + 2 * dr)) continue;
      const s1 = sqOf(f + df, r + dr), s2 = sqOf(f + 2 * df, r + 2 * dr);
      if (!inEnemyHalf(side, s1) || !inEnemyHalf(side, s2)) continue;
      const b = st.board[s1], c = st.board[s2];
      if (b < 0 || c < 0 || st.side[b] !== side || st.side[c] !== side) continue;
      const kind = progressionKind(st.value[id], st.value[b], st.value[c]);
      if (kind) return { kind, pieces: [id, b, c], values: [st.value[id], st.value[b], st.value[c]] };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------------------------
// Progress towards the common victory, as a fraction (1 = goal reached).

export function progress(st, side) {
  const c = st.capCount[side] / st.goalCount;
  const v = st.capValue[side] / st.goalValue[side];
  switch (st.options.victory) {
    case 'bonis': return v;
    case 'honore': return (Math.min(c, 1) + Math.min(v, 1)) / 2;
    default: return c;
  }
}

function goalReached(st, side) {
  const c = st.capCount[side] >= st.goalCount;
  const v = st.capValue[side] >= st.goalValue[side];
  switch (st.options.victory) {
    case 'bonis': return v;
    case 'honore': return c && v;
    default: return c;
  }
}

// Result after `side` has just moved. `full` also checks blockade and the ply limit (the search
// handles "no moves" itself and ignores the limit).
function judge(st, side, full) {
  if (goalReached(st, side)) return { winner: side, reason: st.options.victory };
  if (st.options.triumph && !st.alive[st.pyramid[side ^ 1]]) {
    const t = findTriumph(st, side);
    if (t) return { winner: side, reason: 'triumph', triumph: t };
  }
  if (!full) return null;
  if (!hasAnyMove(st, side ^ 1)) return { winner: side, reason: 'blockade' };
  if (st.ply >= st.options.maxPlies) {
    const a = progress(st, WHITE), b = progress(st, BLACK);
    return { winner: a > b ? WHITE : b > a ? BLACK : -1, reason: 'limit' };
  }
  return null;
}

// Plays a move for the side to move. Returns the captured piece ids (with reasons if `explain`).
export function makeMove(st, move, { explain = false, full = true } = {}) {
  const from = moveFrom(move), to = moveTo(move);
  const id = st.board[from];
  const side = st.toMove;
  st.board[from] = -1;
  st.board[to] = id;
  st.pos[id] = to;
  const caps = findCaptures(st, side, explain);
  for (const c of caps) {
    const cid = explain ? c.id : c;
    st.board[st.pos[cid]] = -1;
    st.alive[cid] = 0;
    st.capCount[side]++;
    st.capValue[side] += st.value[cid];
  }
  st.stack.push({ move, id, caps: explain ? caps.map((c) => c.id) : caps, result: st.result });
  st.toMove = side ^ 1;
  st.ply++;
  st.result = judge(st, side, full);
  return caps;
}

export function undoMove(st) {
  const rec = st.stack.pop();
  if (!rec) return null;
  const side = st.toMove ^ 1;
  st.toMove = side;
  st.ply--;
  for (const cid of rec.caps) {
    st.alive[cid] = 1;
    st.board[st.pos[cid]] = cid;
    st.capCount[side]--;
    st.capValue[side] -= st.value[cid];
  }
  const from = moveFrom(rec.move), to = moveTo(rec.move);
  st.board[to] = -1;
  st.board[from] = rec.id;
  st.pos[rec.id] = from;
  st.result = rec.result;
  return rec;
}

// What would happen if the side to move played `move` (the state is left untouched).
export function previewMove(st, move) {
  const caps = makeMove(st, move, { explain: true, full: false });
  const result = st.result;
  undoMove(st);
  return { caps, result };
}

// Rebuilds a game from its options and move list (used by the worker and saved games). Stops at
// the first illegal move, so a corrupted save cannot produce an impossible position.
export function replay(opts, moves) {
  const st = createGame(opts);
  for (const m of moves) {
    if (st.result || !legalMoves(st).includes(m)) break;
    makeMove(st, m);
  }
  return st;
}

export function moveList(st) {
  return st.stack.map((r) => r.move);
}

// Roman numerals for the tooltips (the medieval boards used them).
export function roman(n) {
  const table = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  for (const [v, s] of table) while (n >= v) { out += s; n -= v; }
  return out;
}
