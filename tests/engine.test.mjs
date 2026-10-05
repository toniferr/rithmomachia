import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  WHITE, BLACK, CIRCLE, TRIANGLE, SQUARE, PYRAMID, ARMY_VALUE, SETUP,
  createGame, createPosition, legalMoves, movesFrom, makeMove, undoMove, findCaptures, findTriumph,
  progressionKind, encodeMove, moveTo, sqOf, sqName, replay, moveList, roman,
} from '../site/js/engine.js';

const at = (name) => sqOf('abcdefgh'.indexOf(name[0]), Number(name.slice(1)) - 1);
const piece = (side, type, value, name) => ({ side, type, value, sq: at(name) });
const W = (type, value, name) => piece(WHITE, type, value, name);
const B = (type, value, name) => piece(BLACK, type, value, name);
const dests = (st, name) => movesFrom(st, at(name)).map((m) => sqName(moveTo(m))).sort();

test('initial army: 24 pieces a side, the classical numbers', () => {
  for (const side of [WHITE, BLACK]) {
    const army = SETUP[side];
    assert.equal(army.length, 24);
    const count = (t) => army.filter((p) => p[2] === t).length;
    assert.deepEqual([count(CIRCLE), count(TRIANGLE), count(SQUARE), count(PYRAMID)], [8, 8, 7, 1]);
  }
  const values = (side, t) => SETUP[side].filter((p) => p[2] === t).map((p) => p[3]).sort((a, b) => a - b);
  assert.deepEqual(values(WHITE, CIRCLE), [2, 4, 4, 6, 8, 16, 36, 64]);
  assert.deepEqual(values(WHITE, TRIANGLE), [6, 9, 20, 25, 42, 49, 72, 81]);
  assert.deepEqual(values(WHITE, SQUARE), [15, 25, 45, 81, 153, 169, 289]);
  assert.deepEqual(values(BLACK, CIRCLE), [3, 5, 7, 9, 9, 25, 49, 81]);
  assert.deepEqual(values(BLACK, TRIANGLE), [12, 16, 30, 36, 56, 64, 90, 100]);
  assert.deepEqual(values(BLACK, SQUARE), [28, 49, 66, 120, 121, 225, 361]);
  assert.deepEqual(ARMY_VALUE, [1312, 1752]);
});

test('the numbers follow the Boethian construction', () => {
  // For each root a: a, a², a(a+1), (a+1)², (a+1)(2a+1), (2a+1)²; the pyramids sum consecutive squares.
  for (const [side, roots] of [[WHITE, [2, 4, 6, 8]], [BLACK, [3, 5, 7, 9]]]) {
    const all = SETUP[side].map((p) => p[3]).sort((a, b) => a - b);
    const expected = roots.flatMap((a) => [a, a * a, a * (a + 1), (a + 1) ** 2, (a + 1) * (2 * a + 1), (2 * a + 1) ** 2])
      .sort((a, b) => a - b);
    assert.deepEqual(all, expected);
  }
  assert.equal([1, 2, 3, 4, 5, 6].reduce((s, n) => s + n * n, 0), 91);
  assert.equal([4, 5, 6, 7, 8].reduce((s, n) => s + n * n, 0), 190);
});

test('opening position: white moves first, nothing hangs', () => {
  const st = createGame();
  assert.equal(st.toMove, WHITE);
  assert.equal(findCaptures(st, WHITE).length, 0);
  assert.equal(findCaptures(st, BLACK).length, 0);
  assert.ok(legalMoves(st).length > 20);
});

test('movement: circles, triangles, squares and the pyramid', () => {
  const st = createPosition({}, [
    W(CIRCLE, 4, 'd5'), W(TRIANGLE, 20, 'd9'), W(SQUARE, 45, 'd13'), W(PYRAMID, 91, 'a1'), B(CIRCLE, 3, 'h16'),
  ]);
  assert.deepEqual(dests(st, 'd5'), ['c4', 'c6', 'e4', 'e6']);
  assert.deepEqual(dests(st, 'd9'), ['b10', 'b8', 'b9', 'c11', 'c7', 'd11', 'd7', 'e11', 'e7', 'f10', 'f8', 'f9']);
  assert.deepEqual(dests(st, 'd13'), ['a12', 'a13', 'a14', 'c10', 'c16', 'd10', 'd16', 'e10', 'e16', 'g12', 'g13', 'g14']);
  // Pyramid in the corner: circle step, triangle step and jump, square step and jump.
  assert.deepEqual(dests(st, 'a1'), ['a3', 'a4', 'b2', 'b3', 'b4', 'c1', 'c2', 'd1', 'd2']);
});

test('straight moves cannot pass through pieces, jumps can', () => {
  const st = createPosition({}, [W(TRIANGLE, 20, 'd4'), W(CIRCLE, 2, 'd5'), W(SQUARE, 45, 'a1'), W(CIRCLE, 4, 'a2'), B(CIRCLE, 3, 'h16')]);
  assert.ok(!dests(st, 'd4').includes('d6'));
  assert.ok(dests(st, 'd4').includes('c6')); // knight jump over d5
  assert.ok(!dests(st, 'a1').includes('a4'));
  assert.ok(dests(st, 'a1').includes('b4'));
});

test('encounter: equal value that could move onto it', () => {
  const st = createPosition({}, [W(CIRCLE, 16, 'c3'), B(TRIANGLE, 16, 'e6'), B(CIRCLE, 3, 'h16')]);
  const caps = makeMove(st, encodeMove(at('c3'), at('d4')), { explain: true });
  assert.equal(caps.length, 0); // d4 → e6 is not a circle move
  undoMove(st);
  const st2 = createPosition({}, [W(CIRCLE, 16, 'c3'), B(TRIANGLE, 16, 'e5'), B(CIRCLE, 3, 'h16')]);
  const caps2 = makeMove(st2, encodeMove(at('c3'), at('d4')), { explain: true });
  assert.equal(caps2.length, 1);
  assert.equal(caps2[0].rule, 'encounter');
  assert.equal(st2.capCount[WHITE], 1);
  assert.equal(st2.capValue[WHITE], 16);
});

test('ambush: two pieces that could both reach it, adding up to it', () => {
  const st = createPosition({}, [W(CIRCLE, 16, 'd3'), W(TRIANGLE, 9, 'f7'), B(CIRCLE, 25, 'f5'), B(CIRCLE, 3, 'h16')]);
  const [cap] = makeMove(st, encodeMove(at('d3'), at('e4')), { explain: true });
  assert.equal(cap.rule, 'ambush');
  assert.deepEqual([...cap.values].sort((a, b) => a - b), [9, 16]);
});

test('assault: value × empty squares between, along the attacker’s lines', () => {
  const st = createPosition({}, [W(TRIANGLE, 6, 'd2'), B(TRIANGLE, 30, 'd10'), B(CIRCLE, 3, 'h16')]);
  const [cap] = makeMove(st, encodeMove(at('d2'), at('d4')), { explain: true }); // d5..d9 empty: k = 5
  assert.equal(cap.rule, 'assault');
  assert.equal(cap.distance, 5);
  // A circle does not assault along a file.
  const st2 = createPosition({}, [W(CIRCLE, 6, 'c3'), B(TRIANGLE, 30, 'd10'), B(CIRCLE, 3, 'h16')]);
  assert.equal(makeMove(st2, encodeMove(at('c3'), at('d4'))).length, 0);
  // ...but it does along a diagonal: 4 × 3 = 12.
  const st3 = createPosition({}, [W(CIRCLE, 4, 'b2'), B(TRIANGLE, 12, 'g7'), B(CIRCLE, 3, 'h16')]);
  const [cap3] = makeMove(st3, encodeMove(at('b2'), at('c3')), { explain: true });
  assert.equal(cap3.rule, 'assault');
});

test('siege: surrounded on four sides (the edge counts)', () => {
  const st = createPosition({}, [
    W(SQUARE, 15, 'a2'), W(CIRCLE, 2, 'c2'), B(CIRCLE, 81, 'a1'), B(CIRCLE, 3, 'h16'),
  ]);
  const [cap] = makeMove(st, encodeMove(at('c2'), at('b1')), { explain: true });
  assert.equal(cap.rule, 'siege');
  assert.equal(st.alive[2], 0);
});

test('pyramid: falls to its total or its base, attacks with any layer', () => {
  // Black triangle 36 meets the white pyramid (base 36).
  const st = createPosition({}, [W(PYRAMID, 91, 'd5'), W(CIRCLE, 2, 'h1'), B(TRIANGLE, 36, 'd9')], BLACK);
  const [cap] = makeMove(st, encodeMove(at('d9'), at('d7')), { explain: true });
  assert.equal(cap.rule, 'encounter');
  assert.equal(cap.target, 36);
  // White pyramid attacks with its layer 1: 1 × 3 = 3 along a diagonal.
  const st2 = createPosition({}, [W(PYRAMID, 91, 'a1'), B(CIRCLE, 3, 'f6'), B(CIRCLE, 5, 'h16')]);
  const [cap2] = makeMove(st2, encodeMove(at('a1'), at('b2')), { explain: true });
  assert.equal(cap2.rule, 'assault');
  assert.equal(cap2.values[0], 1);
});

test('progressions', () => {
  assert.equal(progressionKind(2, 4, 6), 'arithmetic');
  assert.equal(progressionKind(4, 6, 9), 'geometric');
  assert.equal(progressionKind(6, 8, 12), 'harmonic');
  assert.equal(progressionKind(12, 8, 6), 'harmonic');
  assert.equal(progressionKind(4, 2, 6), null);
  assert.equal(progressionKind(4, 4, 4), null);
});

test('triumph needs the enemy pyramid gone and three in a row in the enemy half', () => {
  const pieces = [W(CIRCLE, 2, 'c10'), W(CIRCLE, 4, 'd10'), W(CIRCLE, 8, 'f11'), B(PYRAMID, 190, 'h16'), B(CIRCLE, 3, 'a16')];
  const st = createPosition({}, pieces);
  makeMove(st, encodeMove(at('f11'), at('e10'))); // wrong: 2, 4, 8 is not a progression in that order
  assert.equal(st.result, null);
  const st2 = createPosition({}, [W(CIRCLE, 2, 'c10'), W(CIRCLE, 4, 'd10'), W(CIRCLE, 6, 'f11'), B(PYRAMID, 190, 'h16'), B(CIRCLE, 3, 'a16')]);
  makeMove(st2, encodeMove(at('f11'), at('e10')));
  assert.equal(st2.result, null); // the black pyramid still stands
  assert.ok(findTriumph(st2, WHITE));
  const st3 = createPosition({}, [W(CIRCLE, 2, 'c10'), W(CIRCLE, 4, 'd10'), W(CIRCLE, 6, 'f11'), B(CIRCLE, 3, 'a16')]);
  makeMove(st3, encodeMove(at('f11'), at('e10')));
  assert.equal(st3.result?.reason, 'triumph');
  assert.equal(st3.result.triumph.kind, 'arithmetic');
});

test('common victory: de corpore', () => {
  const st = createPosition({ length: 'short' }, [W(CIRCLE, 16, 'c3'), B(TRIANGLE, 16, 'e5'), B(CIRCLE, 3, 'h16')]);
  st.capCount[WHITE] = 5;
  makeMove(st, encodeMove(at('c3'), at('d4')));
  assert.deepEqual(st.result, { winner: WHITE, reason: 'corpore' });
});

test('make/undo round-trips over random games', () => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 2 ** 32);
  for (let g = 0; g < 20; g++) {
    const st = createGame();
    const snapshot = () => JSON.stringify([Array.from(st.board), Array.from(st.alive), st.capCount, st.capValue, st.toMove, st.ply]);
    const states = [];
    for (let i = 0; i < 120 && !st.result; i++) {
      const moves = legalMoves(st);
      states.push(snapshot());
      makeMove(st, moves[Math.floor(rnd() * moves.length)]);
    }
    const again = replay({}, moveList(st));
    assert.deepEqual(Array.from(again.board), Array.from(st.board));
    while (states.length) {
      undoMove(st);
      assert.equal(snapshot(), states.pop());
    }
  }
});

test('roman numerals', () => {
  assert.equal(roman(289), 'CCLXXXIX');
  assert.equal(roman(190), 'CXC');
  assert.equal(roman(49), 'XLIX');
});
