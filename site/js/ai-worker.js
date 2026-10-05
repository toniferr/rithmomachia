// Runs the search off the main thread. The page sends the options and the move list; the worker
// rebuilds the position and answers with its move.

import { replay } from './engine.js';
import { chooseMove } from './ai.js';

self.onmessage = (event) => {
  const { id, options, moves, level } = event.data;
  const st = replay(options, moves);
  const r = chooseMove(st, level, { now: () => performance.now() });
  self.postMessage({ id, move: r.move, depth: r.depth, nodes: r.nodes });
};
