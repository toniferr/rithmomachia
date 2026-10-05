import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WHITE, BLACK, CIRCLE, TRIANGLE, createGame, createPosition, legalMoves, makeMove, sqOf, encodeMove } from '../site/js/engine.js';
import { chooseMove, LEVELS } from '../site/js/ai.js';

const at = (name) => sqOf('abcdefgh'.indexOf(name[0]), Number(name.slice(1)) - 1);

test('every level returns a legal move from the opening, for both colours', () => {
  for (const level of Object.keys(LEVELS)) {
    const st = createGame();
    const r = chooseMove(st, level, { time: 300 });
    assert.ok(legalMoves(st).includes(r.move), level);
    makeMove(st, r.move);
    const r2 = chooseMove(st, level, { time: 300 });
    assert.ok(legalMoves(st).includes(r2.move), level);
    assert.equal(st.stack.length, 1, 'the search leaves the game as it found it');
  }
});

test('normal and hard take a capture that wins the game', () => {
  for (const level of ['normal', 'hard']) {
    const st = createPosition({ length: 'short' }, [
      { side: WHITE, type: CIRCLE, value: 16, sq: at('c3') },
      { side: WHITE, type: CIRCLE, value: 2, sq: at('h1') },
      { side: BLACK, type: TRIANGLE, value: 16, sq: at('e5') },
      { side: BLACK, type: CIRCLE, value: 3, sq: at('a16') },
    ]);
    st.capCount[WHITE] = 5;
    const r = chooseMove(st, level, { time: 500, random: () => 0.5 });
    assert.equal(r.move, encodeMove(at('c3'), at('d4')), level);
  }
});
