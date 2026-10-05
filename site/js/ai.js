// The machine opponent: negamax with alpha-beta pruning, iterative deepening and a time limit.
// Pure module, run inside a Web Worker by the page (and directly by the tests).

import {
  WHITE, CIRCLE, PYRAMID, RANKS, rankOf, inEnemyHalf,
  legalMoves, makeMove, undoMove, findCaptures, pendingCaptures, progress, moveFrom, moveTo,
} from './engine.js';

const WIN = 100000;

export const LEVELS = {
  easy: { depth: 1, time: 300, noise: 260, blunder: 0.2 },
  normal: { depth: 2, time: 1200, noise: 25, blunder: 0 },
  hard: { depth: 6, time: 2500, noise: 2, blunder: 0 },
};

class Timeout extends Error {}

// Static evaluation from the point of view of the side to move.
export function evaluate(st) {
  const me = st.toMove, opp = me ^ 1;
  const pMe = progress(st, me), pOpp = progress(st, opp);
  let score = 1000 * (pMe - pOpp);

  // Captures already set up: the side to move cashes them in with its next move (unless it has
  // to break the formation to do so); the opponent's are threats the side to move can still parry.
  const mine = pendingCaptures(st, me);
  const theirs = pendingCaptures(st, opp);
  score += 750 * gain(st, me, mine) - 350 * gain(st, opp, theirs);

  // Positional terms: keep the pyramid, come forward, and once the enemy pyramid has fallen,
  // crowd into the enemy half to look for a triumph.
  const triumphOpen = [st.options.triumph && !st.alive[st.pyramid[opp]], st.options.triumph && !st.alive[st.pyramid[me]]];
  for (let id = 0; id < st.type.length; id++) {
    if (!st.alive[id]) continue;
    const side = st.side[id];
    const sign = side === me ? 1 : -1;
    const r = rankOf(st.pos[id]);
    const advance = side === WHITE ? r : RANKS - 1 - r;
    let v = 0;
    if (st.type[id] === PYRAMID) v += st.options.triumph ? 90 : 40;
    else v += Math.min(advance, 9) * (st.type[id] === CIRCLE ? 2.5 : 1.5);
    if (triumphOpen[side === me ? 0 : 1] && inEnemyHalf(side, st.pos[id])) v += 25;
    score += sign * v;
  }
  return score;
}

// How much `extra` captures would add to `side`'s progress.
function gain(st, side, extra) {
  if (!extra.count) return 0;
  const g = st.goalCount, gv = st.goalValue[side];
  switch (st.options.victory) {
    case 'bonis': return extra.value / gv;
    case 'honore': return (extra.count / g + extra.value / gv) / 2;
    default: return extra.count / g;
  }
}

function terminalScore(st, plyFromRoot) {
  const r = st.result;
  if (r.winner === -1) return 0;
  return r.winner === st.toMove ? WIN - plyFromRoot : -WIN + plyFromRoot;
}

export function createSearch(st, { level = 'normal', random = Math.random, now = () => Date.now() } = {}) {
  const cfg = LEVELS[level] || LEVELS.normal;
  const history = new Int32Array(1 << 14);
  let deadline = Infinity;
  let nodes = 0;

  const rootPly = st.stack.length;
  const key = (m) => moveFrom(m) | (moveTo(m) << 7);

  // Orders moves: those that capture first (by how much they capture), then by history.
  function ordered(moves, withCaptures) {
    const scored = new Array(moves.length);
    for (let i = 0; i < moves.length; i++) {
      const m = moves[i];
      let s = history[key(m)];
      if (withCaptures) {
        const before = st.capCount[st.toMove];
        makeMove(st, m, { full: false });
        s += (st.capCount[st.toMove ^ 1] - before) * 1e6 + (st.result ? 1e8 : 0);
        undoMove(st);
      }
      scored[i] = [s, m];
    }
    scored.sort((a, b) => b[0] - a[0]);
    return scored.map((x) => x[1]);
  }

  function negamax(depth, alpha, beta, ply) {
    if ((++nodes & 1023) === 0 && now() > deadline) throw new Timeout();
    if (st.result) return terminalScore(st, ply);
    if (depth === 0) return evaluate(st);
    const moves = legalMoves(st);
    if (!moves.length) return -WIN + ply; // blockade: the side to move loses
    const list = ordered(moves, depth >= 2);
    let best = -Infinity;
    for (const m of list) {
      makeMove(st, m, { full: false });
      const score = -negamax(depth - 1, -beta, -alpha, ply + 1);
      undoMove(st);
      if (score > best) best = score;
      if (score > alpha) alpha = score;
      if (alpha >= beta) {
        history[key(m)] += depth * depth;
        break;
      }
    }
    return best;
  }

  // Returns { move, score, depth, nodes }.
  function run(timeMs = cfg.time) {
    const start = now();
    deadline = start + timeMs;
    nodes = 0;
    const rootMoves = legalMoves(st);
    if (!rootMoves.length) return { move: null, score: -WIN, depth: 0, nodes };
    if (cfg.blunder && random() < cfg.blunder) {
      return { move: rootMoves[Math.floor(random() * rootMoves.length)], score: 0, depth: 0, nodes, blunder: true };
    }
    // Noise is fixed per move for the whole search, so deeper iterations stay consistent.
    const noise = new Map(rootMoves.map((m) => [m, random() * cfg.noise]));
    let order = ordered(rootMoves, true);
    let bestMove = order[0], bestScore = -Infinity, reached = 0;

    for (let depth = 1; depth <= cfg.depth; depth++) {
      const scores = new Map();
      let alpha = -Infinity, iterBest = null, iterScore = -Infinity;
      try {
        for (const m of order) {
          makeMove(st, m, { full: false });
          // A move only matters if raw + noise beats the best so far: search it with that bound.
          const bound = alpha - noise.get(m);
          const raw = -negamax(depth - 1, -Infinity, -bound, 1);
          undoMove(st);
          const s = raw + noise.get(m);
          scores.set(m, s);
          if (s > iterScore) { iterScore = s; iterBest = m; }
          if (s > alpha) alpha = s;
        }
      } catch (e) {
        if (!(e instanceof Timeout)) throw e;
        // Unwind whatever the interrupted search left on the stack.
        while (st.stack.length > rootPly) undoMove(st);
        // A partial iteration is still usable: it searched the previous best move first, so
        // anything it prefers is better at the new depth.
        if (iterBest !== null) bestMove = iterBest;
        break;
      }
      bestMove = iterBest;
      bestScore = iterScore;
      reached = depth;
      order = [...order].sort((a, b) => (scores.get(b) ?? -Infinity) - (scores.get(a) ?? -Infinity));
      if (Math.abs(iterScore) > WIN / 2) break; // a forced result was found
    }
    return { move: bestMove, score: bestScore, depth: reached, nodes, time: now() - start };
  }

  return { run };
}

export function chooseMove(st, level = 'normal', opts = {}) {
  return createSearch(st, { level, ...opts }).run(opts.time);
}

// For the hint/threat overlay in the UI: enemy pieces the side to move would take right now.
export function immediateCaptures(st) {
  return findCaptures(st, st.toMove);
}
