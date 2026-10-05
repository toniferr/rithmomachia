// The codex, in English. Each chapter is HTML; app.js fills in the <figure data-diagram> and
// <div data-widget> placeholders. The rules must match engine.js.

import { WHITE, BLACK } from '../engine.js';
import { FLEURON, rootsTable, chain, goalsTable, ARMY_VALUE } from './shared.js';

const ROOTS_L = {
  white: 'White · the evens', black: 'Black · the odds', root: 'Root a', circles: 'Circles',
  triangles: 'Triangles', squares: 'Squares', pyramid: 'replaced by the pyramid',
};
const GOALS_L = {
  short: 'Short', normal: 'Normal', long: 'Long', length: 'Length', corpore: 'De corpore (pieces)',
  share: 'De bonis (share)', bonisWhite: 'value playing White', bonisBlack: 'value playing Black',
};

export const chapters = [
  {
    slug: 'history',
    num: 'I',
    title: 'History',
    summary: 'From the cathedral schools of the eleventh century to the printed treatises of the Renaissance, and oblivion.',
    body: `
<p class="illuminated">Around the year 1030, in the cathedral schools of southern Germany, someone had the idea of
turning a textbook into a battlefield. The textbook was Boethius’ <i>De institutione arithmetica</i>, the book from
which Europe learned arithmetic throughout the Middle Ages. The battlefield was a board of eight by sixteen squares
where numbers face each other and capture one another through the relations Boethius taught: equality, addition,
multiplication, proportion.</p>

<h2>The name</h2>
<p><i>Rithmomachia</i> (also <i>rithmimachia</i>, <i>rhythmomachia</i> or <i>arithmomachia</i>) comes from the Greek
ἀριθμός, “number”, and μάχη, “battle”: the battle of numbers. In a world that wrote in Latin, a Greek name was a
learned flourish. The texts also call it <i class="latin">ludus philosophorum</i>, the philosophers’ game, and that
is the title under which it reached English in the sixteenth century.</p>

<h2>Arithmetic you can play</h2>
<p>To understand the game you have to understand its book. Around the year 500, Boethius adapted into Latin the
<i>Introduction to Arithmetic</i> of Nicomachus of Gerasa, a second-century Greek treatise in the Pythagorean
tradition. It does not teach how to calculate but how to <em>classify</em>: even and odd numbers, perfect, deficient
and abundant numbers and, above all, the kinds of ratio that can hold between two numbers. Arithmetic was the first
of the four arts of the <i class="latin">quadrivium</i> —arithmetic, music, geometry and astronomy—, the mathematical
half of the seven liberal arts taught in the schools.</p>
<p>It was a dry subject. The game turned it into strategy: to take a piece you must see that 16 plus 9 makes 25, that
4 times 3 makes 12, or that 6, 8 and 12 stand in harmonic proportion. Whoever played well knew arithmetic.</p>

${FLEURON}

<h2>Origins</h2>
<p>The historian Arno Borst, who gathered and edited the medieval texts, placed the birth of the game around the
cathedral school of Würzburg about 1030 and connected it with a master named Asilo. The German cathedral schools
competed with one another in learning, and a game that demanded mastery of Boethius was also a way to show off.</p>
<p>Several short treatises survive from that first century, some attributed —with more or less reason— to famous
authors such as Hermann of Reichenau (Hermannus Contractus, 1013–1054), monk, astronomer and composer. Each treatise
proposed its own variants: rithmomachia never had a single rulebook, which is why every modern version, this one
included, is a reconstruction.</p>

<h2>Across Europe</h2>
<p>Over the following centuries the game travelled from Germany to France and England, always tied to schools,
monasteries and later universities. It was never a popular pastime: it was the game of those who studied the
<i class="latin">quadrivium</i>, an exercise in mental arithmetic and a display of learning. Some authors also
presented it as a moral lesson, an orderly battle won by harmony.</p>

<h2>The printed Renaissance</h2>
<p>Printing gave it a second life. At the end of the fifteenth century the French humanist Jacques Lefèvre d’Étaples
included a description of the game among his arithmetic publications. In 1516 Thomas More had the inhabitants of his
<i>Utopia</i> play two games not unlike chess; one of them was a battle of numbers in which one number plunders
another.</p>
<p>The most influential treatise was Claude de Boissière’s <i>Le très excellent et ancien jeu pythagorique, dit
Rythmomachie</i> (Paris, 1554), soon translated into Latin. In 1563 William Fulke, with the help of Ralph Lever, brought
it into English as <i>The Most Noble, Ancient, and Learned Playe, Called the Philosophers Game</i>. And in 1616 Duke
Augustus of Brunswick-Lüneburg, writing as Gustavus Selenus, devoted part of his great book on chess to it.</p>

<blockquote>They play two games not unlike chess. One is a battle of numbers, in which one number plunders another.<cite>Thomas More, Utopia, book II (1516)</cite></blockquote>

<h2>Oblivion</h2>
<p>In the seventeenth century the game faded away. Boethius’ arithmetic, with its classification of ratios, stopped
being the gateway to mathematics: decimal notation, symbolic algebra and the new science made that learning
old-fashioned, and with it the game that put it into practice. Chess, easier to learn and with no arithmetic to do,
took its place on the tables.</p>

<h2>Rediscovery</h2>
<p>In the twentieth century historians came back to it. Arno Borst published his study and edition of the medieval
texts, <i>Das mittelalterliche Zahlenkampfspiel</i>, in 1986, and Ann E. Moyer a history of the game in the Middle
Ages and the Renaissance, <i>The Philosophers’ Game</i>, in 2001. Today it is played by lovers of historical games and
by teachers looking for a different way to teach arithmetic.</p>

<h2>Timeline</h2>
<ol class="timeline">
  <li><span class="y">2nd c.</span>Nicomachus of Gerasa writes the <i>Introduction to Arithmetic</i>.</li>
  <li><span class="y">c. 500</span>Boethius adapts it into Latin as <i>De institutione arithmetica</i>.</li>
  <li><span class="y">c. 1030</span>First evidence of the game, around the cathedral school of Würzburg.</li>
  <li><span class="y">11th–13th c.</span>Short treatises with variants; the game spreads to France and England.</li>
  <li><span class="y">late 15th c.</span>Lefèvre d’Étaples includes it in his arithmetic publications.</li>
  <li><span class="y">1516</span>Thomas More mentions it in <i>Utopia</i>.</li>
  <li><span class="y">1554</span>Claude de Boissière publishes his treatise in Paris.</li>
  <li><span class="y">1563</span>William Fulke and Ralph Lever publish it in English: <i>The Philosophers Game</i>.</li>
  <li><span class="y">1616</span>Gustavus Selenus includes it in his book on chess.</li>
  <li><span class="y">17th c.</span>Decline and oblivion.</li>
  <li><span class="y">1986</span>Arno Borst edits the medieval texts.</li>
  <li><span class="y">2001</span>Ann E. Moyer publishes <i>The Philosophers’ Game</i>.</li>
</ol>
`,
  },
  {
    slug: 'rules',
    num: 'II',
    title: 'Rules',
    summary: 'The board, how each piece moves, the four ways to capture, and the victories.',
    body: `
<p class="illuminated">The rules of rithmomachia were never fixed in a single rulebook: every medieval and Renaissance
treatise proposed its own. This site plays a modern reconstruction, faithful to the spirit of Boissière and Fulke and
simplified wherever the sources disagree. The machine follows exactly what is explained here.</p>

<h2>The board and the armies</h2>
<p>The game is played on a board of 8 files by 16 ranks, twice as long as a chessboard. Each side has 24 pieces: 8
circles, 8 triangles, 7 squares and one pyramid. <b>White</b> are the <b>even</b> numbers and stand on ranks 1 to 4;
<b>Black</b> are the <b>odd</b> numbers and stand on ranks 13 to 16. Eight empty ranks lie between the two camps, and
a red line marks the middle of the board. White moves first, one piece per turn.</p>
<figure class="diagram wide" data-diagram="setup"><figcaption>The starting position, with White on the left.</figcaption></figure>

<h2>Movement</h2>
<p>Pieces only move to <b>empty</b> squares: in rithmomachia nobody captures by taking the opponent’s square.
Straight moves cannot pass through pieces; leaps can.</p>
<ul>
  <li><b>Circle</b>: one square diagonally.</li>
  <li><b>Triangle</b>: exactly two squares along a rank or file, or a leap like a chess knight (two and one).</li>
  <li><b>Square</b>: exactly three squares along a rank or file, or a long leap of three and one.</li>
  <li><b>Pyramid</b>: like any of the above.</li>
</ul>
<div class="diagram-row">
<figure class="diagram" data-diagram="move-circle"><figcaption>The circle: one square diagonally.</figcaption></figure>
<figure class="diagram" data-diagram="move-triangle"><figcaption>The triangle: two in a straight line, or a knight’s leap.</figcaption></figure>
<figure class="diagram" data-diagram="move-square"><figcaption>The square: three in a straight line, or a three-and-one leap.</figcaption></figure>
</div>

<h2>Captures</h2>
<p>After every move, <b>all</b> of the opponent’s pieces are examined, not just those near the piece that moved.
Those caught by any of the following four rules fall together and go to the spoils of the player who just moved.
Captures are automatic: the game applies them and explains each one in the chronicle.</p>

<h3>1 · Encounter (equality)</h3>
<p>If one of your pieces could move onto the square of an enemy piece of the <b>same value</b>, it captures it. Your
piece does not move: it is enough that the square is within its reach and the way is clear.</p>
<figure class="diagram" data-diagram="encounter"><figcaption>White circle 16 reaches d4; from there it reaches Black triangle 16 diagonally, which falls.</figcaption></figure>

<h3>2 · Ambush (addition)</h3>
<p>If <b>two</b> of your pieces could both move onto the square of an enemy piece and their values <b>add up</b> to
its value, they capture it.</p>
<figure class="diagram" data-diagram="ambush"><figcaption>Circle 16 and triangle 9 can both reach the 25’s square: 16 + 9 = 25.</figcaption></figure>

<h3>3 · Assault (multiplication)</h3>
<p>If an enemy piece lies on one of your piece’s lines of movement, with only empty squares in between, and your
piece’s value <b>times the number of empty squares</b> equals the enemy’s value, it captures it. Circles assault
along diagonals; triangles and squares along ranks and files; the pyramid in all eight directions. Distance has no
limit: a 2 with six empty squares ahead threatens a 12.</p>
<figure class="diagram" data-diagram="assault"><figcaption>Triangle 6 advances to d4: five empty squares lie between it and the 30, and 6 × 5 = 30.</figcaption></figure>

<h3>4 · Siege</h3>
<p>If an enemy piece is surrounded on its four sides (above, below, left and right) by your pieces or by the edge of
the board, it falls, whatever its value.</p>
<figure class="diagram" data-diagram="siege"><figcaption>In the corner two pieces are enough: Black’s 81 is besieged against the edges.</figcaption></figure>

<div class="note"><b>Mind this.</b> If you move a piece to a spot where the opponent could capture it, it does not fall
right away: it falls when the opponent makes their next move, if the threat still stands. Conversely, a threat of
yours the opponent leaves unanswered is cashed in as soon as you move, whatever you move.</div>

<h2>The pyramid</h2>
<p>The pyramid is a compound piece: White’s is worth 91 = 36 + 25 + 16 + 9 + 4 + 1 and Black’s 190 = 64 + 49 + 36 +
25 + 16. It moves like any other piece and <b>attacks</b> with its total or with the value of any of its layers. It
<b>falls</b> if attacked on its total or on its base (36 for White, 64 for Black). The old treatises let it be taken
layer by layer; here that is simplified into the rule of the base.</p>
<figure class="diagram" data-diagram="pyramid"><figcaption>Black triangle 36 meets the base of the White pyramid, which falls whole.</figcaption></figure>

<h2>Victory</h2>
<p>Before starting, a <b>common victory</b> is chosen:</p>
<ul>
  <li><b class="latin">De corpore</b> (by bodies): capture a number of pieces.</li>
  <li><b class="latin">De bonis</b> (by goods): capture pieces adding up to a value, in proportion to the enemy army (Black’s is worth ${ARMY_VALUE[BLACK]}, White’s ${ARMY_VALUE[WHITE]}).</li>
  <li><b class="latin">De honore</b> (by honour): both at once.</li>
</ul>
${goalsTable(GOALS_L)}
<p>The <b>proper victory</b> or <b>triumph</b> (in Latin <i class="latin">victoria magna</i>) can also be enabled:
once the enemy pyramid has been captured, if you place <b>three of your pieces in a row</b> along a rank, file or
diagonal <b>inside the enemy half</b> of the board, and their numbers form an <b>arithmetic</b> (2, 4, 6),
<b>geometric</b> (4, 6, 9) or <b>harmonic</b> (6, 8, 12) progression, you win at once. The middle piece has to be the
middle term.</p>
<figure class="diagram wide" data-diagram="triumph"><figcaption>White triumphs: 2, 4 and 6 in arithmetic progression, inside Black’s camp.</figcaption></figure>
<p>The Renaissance treatises distinguished greater triumphs: the <i class="latin">victoria major</i>, with four pieces
and two progressions, and the <i class="latin">victoria excellentissima</i>, with four pieces containing all three.
Here the <i class="latin">magna</i> is enough.</p>
<p>Finally, a player left without any possible move loses, and if the game reaches 400 moves (200 per side) whoever is
closer to their goal wins.</p>

<h2>On-screen hints</h2>
<p>With the <b>Hints</b> button on, picking a piece shows where it can go: a gold ring means the move captures, and a
red cross that the piece would be within the machine’s reach. Your pieces circled by a dashed red line are in danger
right now. Hints are on by default at the easy and normal levels.</p>
`,
  },
  {
    slug: 'pieces',
    num: 'III',
    title: 'The pieces',
    summary: 'Why these 48 numbers and no others: four roots, six numbers each, and two pyramids.',
    body: `
<p class="illuminated">The numbers on the pieces look arbitrary: 289, 153, 72, 49, 6… They are not. Each army grows
from four <b>roots</b> —2, 4, 6 and 8 for the evens; 3, 5, 7 and 9 for the odds— and each root yields six numbers
following Boethius’ kinds of ratio.</p>

<h2>Six numbers per root</h2>
<p>For a root <span class="math">a</span>, the circles are <span class="math">a</span> and its square
<span class="math">a²</span>; the triangles <span class="math">a(a+1)</span> and <span class="math">(a+1)²</span>; the
squares <span class="math">(a+1)(2a+1)</span> and <span class="math">(2a+1)²</span>. In each army one of the squares
does not appear as such: the pyramid takes its place.</p>
${rootsTable(WHITE, ROOTS_L)}
${rootsTable(BLACK, ROOTS_L)}

<h2>A ladder of ratios</h2>
<p>Set in a row, the six numbers of each root form a ladder in which every rung is one of Boethius’ three kinds of
“greater” ratio. From the circle to its square there is a <i class="latin">multiplex</i> ratio (a : 1); from there to
the triangles, two equal <i class="latin">superparticular</i> ratios, (a+1) : a; and from there to the squares, two
<i class="latin">superpartient</i> ratios, (2a+1) : (a+1).</p>
${chain(2)}
${chain(3)}
${chain(8)}
<p>For root 2 the rungs are the double, twice the <i class="latin">sesquialtera</i> (3 : 2) and twice the
<i class="latin">superbipartiens tertias</i> (5 : 3). The board is, quite literally, a table of ratios.</p>

${FLEURON}

<h2>The pyramids</h2>
<p>Each pyramid is a sum of consecutive squares, stacked like layers:</p>
<ul>
  <li>White: 1 + 4 + 9 + 16 + 25 + 36 = <b>91</b>, a complete pyramid of six layers.</li>
  <li>Black: 16 + 25 + 36 + 49 + 64 = <b>190</b>, a pyramid of five layers missing the top three (1, 4 and 9): a truncated pyramid.</li>
</ul>
<p>That is why the pyramid carries several numbers at once. In this reconstruction it attacks with any of them and
falls if attacked on its total or its base.</p>

<h2>The shapes</h2>
<p>The shapes have no arithmetic value of their own: they tell the three families apart at a glance and decide how
each piece moves. The “higher” the family, the further it goes: the circle takes one step, the triangle two and the
square three.</p>

<h2>Tally</h2>
<table>
  <thead><tr><th></th><th class="num">Circles</th><th class="num">Triangles</th><th class="num">Squares and pyramid</th><th class="num">Total</th></tr></thead>
  <tbody>
    <tr><th scope="row">White</th><td class="num">140</td><td class="num">304</td><td class="num">868</td><td class="num">${ARMY_VALUE[WHITE]}</td></tr>
    <tr><th scope="row">Black</th><td class="num">188</td><td class="num">404</td><td class="num">1160</td><td class="num">${ARMY_VALUE[BLACK]}</td></tr>
  </tbody>
</table>
<p>Black is worth more, but White moves first and its small numbers (2, 4, 6) are fearsome attackers in assaults. The
<i class="latin">de bonis</i> victory is measured in proportion to the enemy army so that both sides have the same
task.</p>
<p>The early treatises wrote the numbers in Roman numerals. Here we use Arabic digits, but when you point at a piece
during a game you will also see its Roman numeral.</p>
`,
  },
  {
    slug: 'mathematics',
    num: 'IV',
    title: 'Mathematics',
    summary: 'Ratios, means and progressions: Boethius’ arithmetic and its kinship with music.',
    body: `
<p class="illuminated">Rithmomachia is an arithmetic lesson dressed up as a battle. Behind every capture and every
triumph lies an idea from Boethius’ <i>De institutione arithmetica</i>: the ratios between numbers and the three
classical means, arithmetic, geometric and harmonic.</p>

<h2>Kinds of ratio</h2>
<p>Boethius, following Nicomachus, classifies the ratios between two numbers. If they are equal, there is
<i class="latin">aequalitas</i>. If the greater is compared with the smaller, the inequality can be of five kinds; the
three simple ones are those that build the pieces:</p>
<div class="table-wrap"><table>
  <thead><tr><th>Kind</th><th>Form</th><th>Examples</th></tr></thead>
  <tbody>
    <tr><td><i class="latin">Multiplex</i></td><td class="math">n : 1</td><td>2 : 1 (<i>duplex</i>), 3 : 1 (<i>triplex</i>)</td></tr>
    <tr><td><i class="latin">Superparticularis</i></td><td class="math">(n+1) : n</td><td>3 : 2 (<i>sesquialtera</i>), 4 : 3 (<i>sesquitertia</i>), 9 : 8 (<i>sesquioctava</i>)</td></tr>
    <tr><td><i class="latin">Superpartiens</i></td><td class="math">(n+m) : n, m ≥ 2</td><td>5 : 3 (<i>superbipartiens tertias</i>), 7 : 4</td></tr>
  </tbody>
</table></div>
<p>The other two kinds combine the former (<i class="latin">multiplex superparticularis</i>, such as 5 : 2, and
<i class="latin">multiplex superpartiens</i>, such as 8 : 3). As the chapter on the pieces shows, every root generates
a multiplex – superparticular – superpartient ladder.</p>

<h2>Three means, three progressions</h2>
<p>Given two numbers <span class="math">a</span> and <span class="math">c</span>, there are three classical ways to find
a middle term <span class="math">b</span>:</p>
<ul>
  <li><b>Arithmetic</b>: the difference is kept. <span class="math">b − a = c − b</span>, that is <span class="math">b = (a + c) / 2</span>. Example: 2, 4, 6.</li>
  <li><b>Geometric</b>: the ratio is kept. <span class="math">b / a = c / b</span>, that is <span class="math">b² = a·c</span>. Example: 4, 6, 9.</li>
  <li><b>Harmonic</b>: the differences keep the ratio of the extremes. <span class="math">(b − a) / (c − b) = a / c</span>, that is <span class="math">b = 2ac / (a + c)</span>. Example: 6, 8, 12.</li>
</ul>
<p>Three pieces in any of these progressions, in a row and inside the enemy camp, bring the triumph. Try two
numbers:</p>
<div class="widget" data-widget="means"></div>

<h2>The musical proportion</h2>
<p>The harmonic mean is named after music. A string of 12 units and another of 6 sound an octave apart (12 : 6 = 2 :
1). Their arithmetic mean, 9, and their harmonic mean, 8, divide that octave into a fourth (12 : 9 = 4 : 3) and a
fifth (12 : 8 = 3 : 2), and between 9 and 8 lies the tone (9 : 8). The series 6, 8, 9, 12, the “musical” proportion
that tradition ascribed to Pythagoras, gathers the three means and the perfect consonances. No wonder the harmonic
triumph was held the noblest.</p>

${FLEURON}

<h2>Captures as operations</h2>
<p>The four captures run through the basic operations: the encounter is equality, the ambush addition, the assault
multiplication (or, read backwards, division: 30 “contains” 6 five times), and the siege, the only capture that does
no arithmetic, is pure geometry. Playing well means breaking numbers into sums and products faster than your
opponent.</p>

<h2>Sums of squares</h2>
<p>The sum of the first <span class="math">n</span> squares is <span class="math">n(n+1)(2n+1)/6</span>. For
<span class="math">n = 6</span> it gives 6·7·13/6 = 91, the White pyramid. The Black one is the sum up to 8 (8·9·17/6 =
204) minus the sum up to 3 (14): 204 − 14 = 190.</p>

<h2>Progressions in each army</h2>
<p>Which triumphs are possible? These are all the triples of distinct numbers in each army that form a progression
(leaving the pyramid aside):</p>
<div class="widget" data-widget="progressions"></div>
`,
  },
  {
    slug: 'strategy',
    num: 'V',
    title: 'Strategy',
    summary: 'Advice for not losing pieces carelessly, and for beating the machine.',
    body: `
<p class="illuminated">Rithmomachia rewards a long view. Captures need no contact, so danger can come from far away
and from several pieces at once. This advice will help you survive your first games.</p>

<h2>Before you move</h2>
<ul>
  <li><b>Watch the open lines.</b> Assault has no distance limit: a triangle 6 with five empty squares ahead threatens a 30, and a circle 4 with three along a diagonal, a 12. Clear files are highways.</li>
  <li><b>Count the sums.</b> Before leaving a piece somewhere, check which enemy pairs can reach its square and whether they add up to its value.</li>
  <li><b>Look at the whole board.</b> After your move every capturable enemy piece falls, not only those touched by the piece you moved. A single move can cash in two or three captures.</li>
  <li><b>Beware of the edges.</b> Against the edge a siege needs fewer pieces, and in a corner two are enough.</li>
</ul>

<h2>During the game</h2>
<ul>
  <li><b>Small numbers are your best attackers.</b> A 2 or a 3 multiplies well in assaults; the big squares are mostly spoils.</li>
  <li><b>Work in pairs.</b> Two pieces that reach the same squares control an area with their sums: any enemy piece of that value that walks in falls into an ambush.</li>
  <li><b>Use the leaps.</b> Triangles and squares can jump over pieces: it is the quickest way to change files or to break out of a siege.</li>
  <li><b>Hunt according to the victory.</b> <i class="latin">De corpore</i>: every piece is worth the same, so hunt the small, easy ones. <i class="latin">De bonis</i>: go for the big squares even if it costs you.</li>
  <li><b>Guard the pyramid</b> when playing with triumph: losing it opens the proper victory to your opponent. Its weak spot is the base (36 or 64), much easier to match than its total.</li>
  <li><b>Prepare the triumph early.</b> Once the enemy pyramid is down, bring pieces that form a progression into the enemy camp: 2, 4, 6 or 4, 6, 8 with White; 3, 5, 7 or 5, 7, 9 with Black.</li>
</ul>

${FLEURON}

<h2>Know the machine</h2>
<ul>
  <li><b>Easy</b> only looks at its immediate move, with plenty of chance, and now and then gets distracted and moves without thinking.</li>
  <li><b>Normal</b> looks at its move and your reply, and takes into account the captures left set up.</li>
  <li><b>Hard</b> searches with alpha-beta pruning and iterative deepening for about two and a half seconds: it usually sees three or more plies ahead. It does not forgive loose pieces.</li>
</ul>
<p>All three use the same evaluation: progress towards the chosen victory, captures set up and threats, the safety of
the pyramid and the advance of the pieces. Against the hard level, the best plan is to leave nothing within reach and
force exchanges that come out in your favour.</p>
`,
  },
  {
    slug: 'glossary',
    num: 'VI',
    title: 'Glossary',
    summary: 'Latin and technical terms of the game, from aequalitas to victoria excellentissima.',
    body: `
<dl class="glossary">
  <dt>Aequalitas</dt><dd>Equality between two numbers. The basis of capture by encounter.</dd>
  <dt>Ambush</dt><dd>Capture by addition: two pieces that can reach the victim’s square and add up to its value.</dd>
  <dt>Assault</dt><dd>Capture by multiplication: attacker’s value × empty squares in between = the victim’s value.</dd>
  <dt>Boethius</dt><dd>Anicius Manlius Severinus Boethius (c. 480–524), Roman philosopher whose <i>De institutione arithmetica</i> was the arithmetic textbook of the Middle Ages.</dd>
  <dt>Circle</dt><dd>The lightest piece. Its numbers are the roots and their squares. Moves one square diagonally.</dd>
  <dt>Encounter</dt><dd>Capture by equality: a piece that can reach the square of another of the same value.</dd>
  <dt>Evens</dt><dd>The White side: its roots are 2, 4, 6 and 8.</dd>
  <dt>Harmonic mean</dt><dd>The term <span class="math">b = 2ac/(a+c)</span> between <span class="math">a</span> and <span class="math">c</span>. Between 6 and 12, it is 8.</dd>
  <dt>Ludus philosophorum</dt><dd>“The philosophers’ game”, another name for rithmomachia.</dd>
  <dt>Multiplex</dt><dd>A ratio in which the greater contains the smaller an exact number of times: 2 : 1, 3 : 1…</dd>
  <dt>Odds</dt><dd>The Black side: its roots are 3, 5, 7 and 9.</dd>
  <dt>Pyramid</dt><dd>A compound piece whose layers are consecutive squares: 91 for White, 190 for Black.</dd>
  <dt>Quadrivium</dt><dd>The four mathematical arts of medieval education: arithmetic, music, geometry and astronomy.</dd>
  <dt>Sesquialtera</dt><dd>The ratio 3 : 2, “one and a half”. In music, the fifth.</dd>
  <dt>Siege</dt><dd>Capture of a piece surrounded on its four sides by enemy pieces or by the edge.</dd>
  <dt>Square</dt><dd>The most valuable piece. Its numbers are <span class="math">(a+1)(2a+1)</span> and <span class="math">(2a+1)²</span>. Moves three squares in a straight line or leaps three and one.</dd>
  <dt>Superparticularis</dt><dd>A ratio of the form <span class="math">(n+1) : n</span>, such as 3 : 2 or 4 : 3.</dd>
  <dt>Superpartiens</dt><dd>A ratio of the form <span class="math">(n+m) : n</span> with <span class="math">m ≥ 2</span>, such as 5 : 3.</dd>
  <dt>Triangle</dt><dd>The middle piece. Its numbers are <span class="math">a(a+1)</span> and <span class="math">(a+1)²</span>. Moves two squares in a straight line or leaps like a knight.</dd>
  <dt>Triumph</dt><dd>Proper victory: three pieces in progression inside the enemy camp. In Latin, <i>victoria magna</i>.</dd>
  <dt>Victoria de bonis</dt><dd>“By goods”: the winner captures a given value.</dd>
  <dt>Victoria de corpore</dt><dd>“By bodies”: the winner captures a given number of pieces.</dd>
  <dt>Victoria de honore</dt><dd>“By honour”: pieces and value at once.</dd>
  <dt>Victoria de lite</dt><dd>“By lawsuit”: in the Renaissance treatises, a victory that also counted the digits of the captured numbers. Not used on this site.</dd>
  <dt>Victoria major, excellentissima</dt><dd>Higher triumphs of the treatises: four pieces with two progressions, or with all three. Not used on this site.</dd>
</dl>
`,
  },
  {
    slug: 'sources',
    num: 'VII',
    title: 'Sources',
    summary: 'The old treatises, modern scholarship, and the choices made in this reconstruction.',
    body: `
<p class="illuminated">This site is an introduction, not a critical edition. For those who want to go to the sources,
these are the main works.</p>

<h2>Old texts</h2>
<ul>
  <li>Nicomachus of Gerasa, <i>Introduction to Arithmetic</i> (2nd century).</li>
  <li>Boethius, <i>De institutione arithmetica</i> (c. 500).</li>
  <li>Thomas More, <i>Utopia</i> (Leuven, 1516), book II.</li>
  <li>Claude de Boissière, <i>Le très excellent et ancien jeu pythagorique, dit Rythmomachie</i> (Paris, 1554).</li>
  <li>William Fulke and Ralph Lever, <i>The Most Noble, Ancient, and Learned Playe, Called the Philosophers Game</i> (London, 1563).</li>
  <li>Gustavus Selenus (Augustus of Brunswick-Lüneburg), <i>Das Schach- oder König-Spiel</i> (1616).</li>
</ul>

<h2>Modern scholarship</h2>
<ul>
  <li>Arno Borst, <i>Das mittelalterliche Zahlenkampfspiel</i> (Heidelberg, 1986).</li>
  <li>Ann E. Moyer, <i>The Philosophers’ Game: Rithmomachia in Medieval and Renaissance Europe</i> (Ann Arbor, University of Michigan Press, 2001).</li>
  <li>The Wikipedia article “<a href="https://en.wikipedia.org/wiki/Rithmomachy">Rithmomachy</a>”, with further references.</li>
</ul>

${FLEURON}

<h2>About this reconstruction</h2>
<p>The sources disagree on almost everything: the size of the board, the setup, the moves and the details of each
capture. These are the choices made on this site, so it can be compared with other versions:</p>
<ul>
  <li>An 8 × 16 board and the wedge setup shown in the rules chapter, symmetric under a 180° turn.</li>
  <li>Triangles and squares move exactly 2 and 3 squares in a straight line, or leap; circles move diagonally.</li>
  <li>Assault counts the empty squares between the two pieces and follows the attacker’s lines of movement.</li>
  <li>Ambush only adds (some sources also allow other operations).</li>
  <li>The pyramid attacks with its total or any layer and falls to its total or its base, with no layer-by-layer capture.</li>
  <li>Captures resolve by themselves after every move, all at once.</li>
  <li>The triumph requires the enemy pyramid to have been captured, and three adjacent pieces in line in the enemy camp.</li>
</ul>

<h2>Credits</h2>
<p>Free typefaces (SIL Open Font License): <b>EB Garamond</b>, by the EB Garamond project (Georg Duffner and Octavio
Pardo), and <b>UnifrakturMaguntia</b>, by j. “mach” wust after a design by Peter Wiegel. The site’s code, the rules
engine and the machine are written by hand, with no dependencies.</p>
`,
  },
];
