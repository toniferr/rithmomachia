# itch.io page

Everything needed to publish Rithmomachia on itch.io. Build the upload with:

```sh
python3 scripts/package_itch.py     # → dist/rithmomachia-itch.zip (index.html at the root)
```

## Project settings (Dashboard → Create new project)

| Field | Value |
|---|---|
| Title | Rithmomachia |
| Project URL | `https://toniferr.itch.io/rithmomachia` |
| Short description or tagline | The medieval battle of numbers: play the philosophers’ game against the machine. |
| Classification | Games |
| Kind of project | HTML |
| Release status | Released |
| Pricing | **$0 or donate**, suggested donation 3 (free + pay what you want) |
| Uploads | `dist/rithmomachia-itch.zip`, tick **This file will be played in the browser** |
| Embed options | Embed in page · viewport **1280 × 820** · ✔ Mobile friendly (orientation: default) · ✔ Fullscreen button · ✔ Enable scrollbars · ✘ Click to launch in fullscreen |
| Genre | Strategy |
| Tags | board-game, strategy, medieval, historical, math, educational, turn-based, singleplayer, abstract, offline |
| AI generation disclosure | The code, texts and images were made with the help of an AI assistant (Claude): answer **Yes** and tick the parts that apply (code, text, graphics). |
| Languages | English, Spanish |
| Inputs | Mouse, Touchscreen |
| Links | Website: `https://toniferr.github.io/rithmomachia/` · Source code: `https://github.com/toniferr/rithmomachia` |
| Cover image | `cover-630x500.png` |
| Screenshots | `screenshot-1-game.png`, `screenshot-2-rules.png`, `screenshot-3-pieces.png`, `screenshot-4-home.png` |
| Visibility | Draft first; check the embedded game; then Public |

To receive donations, choose a payment mode first (Settings → Payments):

- **Collected by itch.io, paid out periodically** (recommended): itch.io is the seller, handles VAT and sales tax,
  and pays out to PayPal or Payoneer after the tax interview (form W-8BEN for non-US residents).
- **Direct to you**: payments land straight in your PayPal or Stripe account, but taxes on sales (EU VAT…) are your
  job and itch.io invoices you later for its revenue share.

The revenue share for itch.io is open (10 % by default, adjustable from 0 to 100 %).

## Description (paste into the page editor)

**Rithmomachia** — *the battle of numbers* — was played across Europe for almost six hundred years, from the
cathedral schools of the eleventh century to the printed treatises of the Renaissance. Monks, schoolmasters and
humanists fought with numbers on a board twice as long as a chessboard, and victory went to whoever best understood
the arithmetic of Boethius.

**How it plays**

- Two armies of 24 numbered pieces: White, the evens, and Black, the odds. Circles, triangles, squares and a
  pyramid built from stacked square numbers.
- Pieces are never taken by landing on them. They fall by **encounter** (equal values), **ambush** (two of your
  pieces whose values add up to the enemy), **assault** (value × empty squares between = the enemy) or **siege**.
- Win by capturing pieces or value — or, once the enemy pyramid has fallen, by the *triumph*: three of your pieces in
  arithmetic, geometric or harmonic progression inside the enemy camp.

**Features**

- Play against the machine at three levels: easy, normal and hard (an alpha-beta search that thinks ahead).
- Choose your army and the kind of victory; hints mark captures and pieces in danger; every capture is explained.
- A built-in illustrated codex: history, rules with diagrams, the mathematics behind the numbers (ratios, means,
  the musical proportion), strategy, glossary and sources.
- Illuminated-manuscript look, with a candlelight night mode.
- English and Spanish. Works offline once loaded. No ads, no tracking, nothing to sign up for.

Free to play. If you enjoy it, you can pay what you want.

---

**Rithmomachia** — *la batalla de los números* — se jugó en toda Europa durante casi seiscientos años. Juega contra
la máquina en tres niveles, elige tu ejército y el tipo de victoria, y descubre en el códice integrado su historia,
sus reglas y las matemáticas que esconde. En inglés y en español. Gratis; si te gusta, paga lo que quieras.

## After publishing

In `site/js/content/platforms.js`, set the itch entry to
`{ id: 'itch', status: 'available', price: 'pwyw', url: 'https://toniferr.itch.io/rithmomachia' }`.
