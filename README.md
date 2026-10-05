# Rithmomachia

**The battle of numbers** — the medieval philosophers’ game, playable in the browser against the machine, with an
illustrated codex on its history, rules and mathematics. Spanish and English.

Play: <https://toniferr.github.io/rithmomachia/>

## What’s inside

- **The game**: choose your army (White, the evens, or Black, the odds), three difficulty levels (easy, normal, hard),
  the common victory (*de corpore*, *de bonis*, *de honore*), its length, and whether the proper victory (*triumph*)
  counts. On-screen hints mark captures and pieces in danger; every capture is explained in the chronicle. Undo,
  resign, and the game in progress is kept in the browser.
- **The machine**: negamax with alpha-beta pruning, iterative deepening and a time limit, running in a Web Worker.
  Easy looks one ply ahead with plenty of noise; normal two plies; hard searches for about 2.5 s.
- **The codex**: seven chapters — history, rules (with diagrams computed by the engine itself), the pieces, the
  mathematics (with a means calculator and the list of possible progressions), strategy, glossary and sources.

The rules are a modern reconstruction; the choices made where the historical sources disagree are listed in the
*Sources* chapter.

## Layout

```
site/                 the published site (no build step)
  index.html          shell with a strict Content-Security-Policy
  css/main.css        illuminated-manuscript theme, light and candlelight (dark)
  fonts/              EB Garamond and UnifrakturMaguntia, self-hosted (SIL OFL)
  js/engine.js        rules engine: pure module shared by the page, the worker and the tests
  js/ai.js            the machine’s search and evaluation
  js/ai-worker.js     runs the search off the main thread
  js/game.js          play view
  js/board.js         SVG board and pieces
  js/diagrams.js      codex diagrams and widgets
  js/app.js           routing, home page, setup form, language and theme
  js/i18n.js          interface strings (es, en)
  js/content/         codex chapters (es, en)
tests/                node:test suites for the engine and the AI
scripts/selfplay.mjs  machine-vs-machine games, to check balance and speed
```

## Run locally

No dependencies. Any static server will do:

```sh
python3 -m http.server 8000 --directory site    # then open http://localhost:8000
node --test "tests/*.test.mjs"                  # Node 20 or later
node scripts/selfplay.mjs 4 hard normal          # games, white level, black level
```

## Deploy

`.github/workflows/deploy.yml` runs the tests and publishes `site/` to GitHub Pages on every push to `main`
(Settings → Pages → Source: GitHub Actions).

## Credits

Typefaces: [EB Garamond](https://github.com/octaviopardo/EBGaramond12) and
[UnifrakturMaguntia](https://unifraktur.sourceforge.net/maguntia.html), both under the SIL Open Font License (see
`site/fonts/`).
