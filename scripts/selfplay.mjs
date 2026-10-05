// Machine vs machine games, to check balance, game length and search speed.
// Usage: node scripts/selfplay.mjs [games=4] [whiteLevel=normal] [blackLevel=normal] [victory=corpore] [length=normal]

import { createGame, makeMove, WHITE, BLACK } from '../site/js/engine.js';
import { chooseMove } from '../site/js/ai.js';

const [games = 4, wl = 'normal', bl = 'normal', victory = 'corpore', length = 'normal'] = process.argv.slice(2);

// Small seeded generator so runs are reproducible.
function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
}

const tally = { 0: 0, 1: 0, '-1': 0 };
const reasons = {};
for (let g = 0; g < Number(games); g++) {
  const st = createGame({ victory, length });
  const random = rng(1000 + g);
  const levels = [wl, bl];
  let maxTime = 0, depthSum = 0, n = 0;
  while (!st.result) {
    const r = chooseMove(st, levels[st.toMove], { random });
    maxTime = Math.max(maxTime, r.time ?? 0);
    depthSum += r.depth;
    n++;
    makeMove(st, r.move);
  }
  tally[st.result.winner]++;
  reasons[st.result.reason] = (reasons[st.result.reason] || 0) + 1;
  console.log(`game ${g + 1}: winner ${['white', 'black'][st.result.winner] ?? 'draw'} by ${st.result.reason} ` +
    `after ${st.ply} plies; captured W ${st.capCount[WHITE]}/${st.capValue[WHITE]} B ${st.capCount[BLACK]}/${st.capValue[BLACK]}; ` +
    `avg depth ${(depthSum / n).toFixed(1)}, slowest move ${maxTime} ms`);
}
console.log('white', tally[0], 'black', tally[1], 'draws', tally[-1], reasons);
