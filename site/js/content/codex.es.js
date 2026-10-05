// El códice, en español. Cada capítulo es HTML; los <figure data-diagram> y <div data-widget>
// los rellena app.js. Las reglas deben coincidir con engine.js.

import { WHITE, BLACK } from '../engine.js';
import { FLEURON, rootsTable, chain, goalsTable, ARMY_VALUE } from './shared.js';

const ROOTS_L = {
  white: 'Blancas · los pares', black: 'Negras · los impares', root: 'Raíz a', circles: 'Círculos',
  triangles: 'Triángulos', squares: 'Cuadrados', pyramid: 'sustituido por la pirámide',
};
const GOALS_L = {
  short: 'Corta', normal: 'Normal', long: 'Larga', length: 'Duración', corpore: 'De corpore (piezas)',
  share: 'De bonis (proporción)', bonisWhite: 'valor si juegas con blancas', bonisBlack: 'valor si juegas con negras',
};

export const chapters = [
  {
    slug: 'history',
    num: 'I',
    title: 'Historia',
    summary: 'De las escuelas catedralicias del siglo XI a los tratados impresos del Renacimiento, y su olvido.',
    body: `
<p class="illuminated">Hacia el año 1030, en las escuelas catedralicias del sur de Alemania, alguien tuvo la idea de
convertir un libro de texto en un campo de batalla. El libro era la <i>De institutione arithmetica</i> de Boecio, la
obra con la que Europa aprendió aritmética durante toda la Edad Media. El campo de batalla, un tablero de ocho por
dieciséis casillas donde los números se enfrentan y se capturan según las relaciones que Boecio enseñaba: igualdad,
suma, multiplicación, proporción.</p>

<h2>El nombre</h2>
<p><i>Rithmomachia</i> (también <i>rithmimachia</i>, <i>rhythmomachia</i> o <i>arithmomachia</i>) se forma con el
griego ἀριθμός, «número», y μάχη, «batalla»: la batalla de los números. En un mundo que escribía en latín, el nombre
griego era un guiño culto. Los textos lo llaman también <i class="latin">ludus philosophorum</i>, el juego de los
filósofos, y con ese título llegó al inglés en el siglo XVI.</p>

<h2>Una aritmética para jugar</h2>
<p>Para entender el juego hay que entender su libro. Hacia el año 500, Boecio adaptó al latín la <i>Introducción a la
aritmética</i> de Nicómaco de Gerasa, un tratado griego del siglo II de tradición pitagórica. No enseña a calcular
sino a <em>clasificar</em>: números pares e impares, perfectos, deficientes y abundantes y, sobre todo, las clases de
razones que pueden darse entre dos números. La aritmética era la primera de las cuatro artes del
<i class="latin">quadrivium</i> —aritmética, música, geometría y astronomía—, la mitad matemática de las siete artes
liberales que se enseñaban en las escuelas.</p>
<p>Era una materia árida. El juego la volvía estrategia: para capturar una pieza hay que ver que 16 más 9 dan 25, que
4 por 3 da 12 o que 6, 8 y 12 forman una proporción armónica. Quien jugaba bien, sabía aritmética.</p>

${FLEURON}

<h2>Los orígenes</h2>
<p>El historiador Arno Borst, que reunió y editó los textos medievales, situó el nacimiento del juego en el entorno
de la escuela catedralicia de Würzburg hacia 1030 y lo relacionó con un maestro llamado Asilo. Las escuelas de las
catedrales alemanas competían entre sí en saber, y un juego que exigía dominar a Boecio era también una forma de
lucirse.</p>
<p>De ese primer siglo se conservan varios tratados breves, algunos atribuidos —con más o menos fundamento— a
autores célebres como Hermann de Reichenau (Hermannus Contractus, 1013–1054), monje, astrónomo y compositor. Cada
tratado proponía sus propias variantes: la rithmomachia nunca tuvo un reglamento único, y por eso cualquier versión
moderna, también esta, es una reconstrucción.</p>

<h2>Por toda Europa</h2>
<p>En los siglos siguientes el juego pasó de Alemania a Francia e Inglaterra, siempre ligado a las escuelas, los
monasterios y más tarde las universidades. Nunca fue un pasatiempo popular: era el juego de quienes estudiaban el
<i class="latin">quadrivium</i>, un ejercicio de cálculo mental y una exhibición de cultura. Algunos autores lo
presentaban además como una lección moral, una batalla ordenada en la que vence la armonía.</p>

<h2>El Renacimiento impreso</h2>
<p>La imprenta le dio una segunda vida. A finales del siglo XV el humanista francés Jacques Lefèvre d'Étaples
incluyó una descripción del juego entre sus publicaciones de aritmética. En 1516, Tomás Moro hizo jugar a los
habitantes de su <i>Utopía</i> a dos juegos parecidos al ajedrez; uno de ellos era una batalla de números en la que
un número despoja a otro.</p>
<p>El tratado más influyente fue el de Claude de Boissière, <i>Le très excellent et ancien jeu pythagorique, dit
Rythmomachie</i> (París, 1554), que pronto tuvo versión latina. En 1563 William Fulke, con la ayuda de Ralph Lever,
lo llevó al inglés como <i>The Most Noble, Ancient, and Learned Playe, Called the Philosophers Game</i>. Y en 1616 el
duque Augusto de Brunswick-Luneburgo, con el seudónimo de Gustavus Selenus, le dedicó una parte de su gran libro sobre
el ajedrez.</p>

<blockquote>Juegan a dos juegos no muy distintos del ajedrez. Uno es una batalla de números, en la que un número despoja a otro.<cite>Tomás Moro, Utopía, libro II (1516)</cite></blockquote>

<h2>El olvido</h2>
<p>En el siglo XVII el juego se apagó. La aritmética de Boecio, con su clasificación de razones, dejó de ser la puerta
de entrada a las matemáticas: la notación decimal, el álgebra simbólica y la nueva ciencia hicieron anticuado aquel
saber, y con él el juego que lo ponía en práctica. El ajedrez, más sencillo de aprender y sin necesidad de calcular,
ocupó su lugar en las mesas.</p>

<h2>Redescubrimiento</h2>
<p>En el siglo XX los historiadores volvieron a él. Arno Borst publicó en 1986 su estudio y edición de los textos
medievales, <i>Das mittelalterliche Zahlenkampfspiel</i>, y Ann E. Moyer en 2001 una historia del juego en la Edad
Media y el Renacimiento, <i>The Philosophers' Game</i>. Hoy lo juegan aficionados a los juegos históricos y
profesores que buscan una forma distinta de enseñar aritmética.</p>

<h2>Cronología</h2>
<ol class="timeline">
  <li><span class="y">s. II</span>Nicómaco de Gerasa escribe la <i>Introducción a la aritmética</i>.</li>
  <li><span class="y">c. 500</span>Boecio la adapta al latín en la <i>De institutione arithmetica</i>.</li>
  <li><span class="y">c. 1030</span>Primeros testimonios del juego, en el entorno de la escuela catedralicia de Würzburg.</li>
  <li><span class="y">s. XI–XIII</span>Tratados breves con variantes; el juego se difunde por Francia e Inglaterra.</li>
  <li><span class="y">fin s. XV</span>Lefèvre d'Étaples lo incluye en sus publicaciones de aritmética.</li>
  <li><span class="y">1516</span>Tomás Moro lo menciona en <i>Utopía</i>.</li>
  <li><span class="y">1554</span>Claude de Boissière publica su tratado en París.</li>
  <li><span class="y">1563</span>William Fulke y Ralph Lever lo publican en inglés: <i>The Philosophers Game</i>.</li>
  <li><span class="y">1616</span>Gustavus Selenus lo incluye en su libro sobre el ajedrez.</li>
  <li><span class="y">s. XVII</span>Declive y olvido.</li>
  <li><span class="y">1986</span>Arno Borst edita los textos medievales.</li>
  <li><span class="y">2001</span>Ann E. Moyer publica <i>The Philosophers' Game</i>.</li>
</ol>
`,
  },
  {
    slug: 'rules',
    num: 'II',
    title: 'Reglas',
    summary: 'El tablero, cómo se mueve cada pieza, las cuatro formas de capturar y las victorias.',
    body: `
<p class="illuminated">Las reglas de la rithmomachia nunca se fijaron en un reglamento único: cada tratado medieval y
renacentista proponía las suyas. Esta web juega una reconstrucción moderna, fiel al espíritu de Boissière y Fulke y
simplificada allí donde las fuentes discrepan. La máquina sigue exactamente lo que se explica aquí.</p>

<h2>El tablero y los ejércitos</h2>
<p>Se juega en un tablero de 8 columnas por 16 filas, el doble de largo que el del ajedrez. Cada bando tiene 24
piezas: 8 círculos, 8 triángulos, 7 cuadrados y una pirámide. Las <b>blancas</b> son los números <b>pares</b> y
ocupan las filas 1 a 4; las <b>negras</b> son los <b>impares</b> y ocupan las filas 13 a 16. Entre ambos campos
quedan ocho filas vacías, y una línea roja marca la mitad del tablero. Empiezan las blancas y se mueve una pieza por
turno.</p>
<figure class="diagram wide" data-diagram="setup"><figcaption>La posición inicial, con las blancas a la izquierda.</figcaption></figure>

<h2>El movimiento</h2>
<p>Las piezas solo se mueven a casillas <b>vacías</b>: en la rithmomachia nadie captura ocupando la casilla del
contrario. Los movimientos en línea recta no pueden atravesar piezas; los saltos, sí.</p>
<ul>
  <li><b>Círculo</b>: una casilla en diagonal.</li>
  <li><b>Triángulo</b>: exactamente dos casillas en vertical u horizontal, o un salto como el del caballo del ajedrez (dos y una).</li>
  <li><b>Cuadrado</b>: exactamente tres casillas en vertical u horizontal, o un salto largo de tres y una.</li>
  <li><b>Pirámide</b>: como cualquiera de las anteriores.</li>
</ul>
<div class="diagram-row">
<figure class="diagram" data-diagram="move-circle"><figcaption>El círculo: una casilla en diagonal.</figcaption></figure>
<figure class="diagram" data-diagram="move-triangle"><figcaption>El triángulo: dos en línea recta o salto de caballo.</figcaption></figure>
<figure class="diagram" data-diagram="move-square"><figcaption>El cuadrado: tres en línea recta o salto de tres y una.</figcaption></figure>
</div>

<h2>Las capturas</h2>
<p>Después de cada jugada se examinan <b>todas</b> las piezas del rival, no solo las cercanas a la que se ha movido.
Las que cumplan alguna de las cuatro reglas siguientes caen a la vez y pasan al botín de quien acaba de mover. Las
capturas son automáticas: el juego las aplica y explica cada una en la crónica.</p>

<h3>1 · Encuentro (igualdad)</h3>
<p>Si una de tus piezas podría moverse a la casilla de una pieza enemiga del <b>mismo valor</b>, la captura. Tu pieza
no se mueve: basta con que la casilla esté a su alcance y el camino libre.</p>
<figure class="diagram" data-diagram="encounter"><figcaption>El círculo blanco 16 llega a d4; desde allí alcanza en diagonal al triángulo negro 16, que cae.</figcaption></figure>

<h3>2 · Emboscada (suma)</h3>
<p>Si <b>dos</b> de tus piezas podrían moverse a la casilla de una pieza enemiga y sus valores <b>suman</b> el de
esta, la captura.</p>
<figure class="diagram" data-diagram="ambush"><figcaption>El círculo 16 y el triángulo 9 alcanzan los dos la casilla del 25: 16 + 9 = 25.</figcaption></figure>

<h3>3 · Asalto (multiplicación)</h3>
<p>Si en una de tus líneas de movimiento hay una pieza enemiga, con solo casillas vacías entre medias, y el valor de
tu pieza <b>multiplicado por el número de casillas vacías</b> da el valor de la enemiga, la captura. Los círculos
asaltan en diagonal; los triángulos y los cuadrados, en vertical y horizontal; la pirámide, en las ocho direcciones.
La distancia no tiene límite: un 2 con seis casillas vacías delante amenaza a un 12.</p>
<figure class="diagram" data-diagram="assault"><figcaption>El triángulo 6 avanza a d4: entre él y el 30 quedan cinco casillas vacías, y 6 × 5 = 30.</figcaption></figure>

<h3>4 · Asedio</h3>
<p>Si una pieza enemiga queda rodeada por sus cuatro lados (arriba, abajo, izquierda y derecha) por piezas tuyas o
por el borde del tablero, cae, sea cual sea su valor.</p>
<figure class="diagram" data-diagram="siege"><figcaption>En la esquina bastan dos piezas: el 81 negro queda sitiado contra los bordes.</figcaption></figure>

<div class="note"><b>Ojo.</b> Si mueves una pieza a una posición en la que el rival podría capturarla, no cae en ese
momento: cae cuando el rival haga su siguiente jugada, si la amenaza sigue en pie. A la inversa, una amenaza tuya que
el rival deje sin resolver se cobra en cuanto muevas, muevas lo que muevas.</div>

<h2>La pirámide</h2>
<p>La pirámide es una pieza compuesta: la blanca vale 91 = 36 + 25 + 16 + 9 + 4 + 1 y la negra 190 = 64 + 49 + 36 +
25 + 16. Se mueve como cualquier otra pieza y <b>ataca</b> con su total o con el valor de cualquiera de sus capas.
<b>Cae</b> si la atacan por su total o por el de su base (36 la blanca, 64 la negra). Los tratados antiguos
permitían capturarla capa a capa; aquí se simplifica en esa regla de la base.</p>
<figure class="diagram" data-diagram="pyramid"><figcaption>El triángulo negro 36 se encuentra con la base de la pirámide blanca, que cae entera.</figcaption></figure>

<h2>La victoria</h2>
<p>Antes de empezar se elige una <b>victoria común</b>:</p>
<ul>
  <li><b class="latin">De corpore</b> (por los cuerpos): capturar un número de piezas.</li>
  <li><b class="latin">De bonis</b> (por los bienes): capturar piezas que sumen un valor, proporcional al del ejército enemigo (${ARMY_VALUE[BLACK]} las negras, ${ARMY_VALUE[WHITE]} las blancas).</li>
  <li><b class="latin">De honore</b> (por el honor): las dos cosas a la vez.</li>
</ul>
${goalsTable(GOALS_L)}
<p>Además se puede activar la <b>victoria propia</b> o <b>triunfo</b> (en latín, <i class="latin">victoria
magna</i>): una vez capturada la pirámide enemiga, si colocas <b>tres piezas tuyas seguidas</b> en una fila, columna
o diagonal <b>dentro de la mitad enemiga</b> del tablero y sus números forman una progresión <b>aritmética</b> (2, 4,
6), <b>geométrica</b> (4, 6, 9) o <b>armónica</b> (6, 8, 12), ganas al instante. La pieza central tiene que ser el
término medio.</p>
<figure class="diagram wide" data-diagram="triumph"><figcaption>Triunfo de las blancas: 2, 4 y 6 en progresión aritmética, ya en campo negro.</figcaption></figure>
<p>Los tratados renacentistas distinguían triunfos mayores: la <i class="latin">victoria major</i>, con cuatro piezas
y dos progresiones, y la <i class="latin">victoria excellentissima</i>, con cuatro piezas que contienen las tres. Aquí
basta la <i class="latin">magna</i>.</p>
<p>Por último, quien se queda sin ningún movimiento posible pierde, y si la partida llega a 400 jugadas (200 por
bando) gana quien esté más cerca de su objetivo.</p>

<h2>Las ayudas en pantalla</h2>
<p>Con el botón <b>Ayudas</b> activado, al elegir una pieza verás sus destinos posibles: un aro dorado indica que esa
jugada captura, y una cruz roja que la pieza quedaría a tiro de la máquina. Las piezas tuyas rodeadas por un trazo rojo
discontinuo están en peligro ahora mismo. Las ayudas vienen activadas en los niveles fácil y normal.</p>
`,
  },
  {
    slug: 'pieces',
    num: 'III',
    title: 'Las piezas',
    summary: 'Por qué esos 48 números y no otros: cuatro raíces, seis números cada una y dos pirámides.',
    body: `
<p class="illuminated">Los números de las piezas parecen arbitrarios: 289, 153, 72, 49, 6… No lo son. Cada ejército
nace de cuatro <b>raíces</b> —2, 4, 6 y 8 para los pares; 3, 5, 7 y 9 para los impares— y de cada raíz salen seis
números siguiendo las clases de razones de Boecio.</p>

<h2>Seis números por raíz</h2>
<p>Para una raíz <span class="math">a</span>, los círculos son <span class="math">a</span> y su cuadrado
<span class="math">a²</span>; los triángulos, <span class="math">a(a+1)</span> y <span class="math">(a+1)²</span>; los
cuadrados, <span class="math">(a+1)(2a+1)</span> y <span class="math">(2a+1)²</span>. En cada ejército, uno de los
cuadrados no aparece como tal: su lugar lo ocupa la pirámide.</p>
${rootsTable(WHITE, ROOTS_L)}
${rootsTable(BLACK, ROOTS_L)}

<h2>Una escalera de razones</h2>
<p>Puestos en fila, los seis números de cada raíz forman una escalera en la que cada peldaño es una de las tres clases
de razón «mayor» de Boecio. Del círculo a su cuadrado hay una razón <i class="latin">multiplex</i> (a : 1); de ahí a
los triángulos, dos razones <i class="latin">superparticulares</i> iguales, (a+1) : a; y de ahí a los cuadrados, dos
razones <i class="latin">superpartientes</i>, (2a+1) : (a+1).</p>
${chain(2)}
${chain(3)}
${chain(8)}
<p>Para la raíz 2, los peldaños son el doble, dos veces la <i class="latin">sesquialtera</i> (3 : 2) y dos veces la
<i class="latin">superbipartiens tertias</i> (5 : 3). El tablero es, literalmente, una tabla de razones.</p>

${FLEURON}

<h2>Las pirámides</h2>
<p>Cada pirámide es una suma de cuadrados consecutivos, apilados como capas:</p>
<ul>
  <li>Blanca: 1 + 4 + 9 + 16 + 25 + 36 = <b>91</b>, una pirámide completa de seis capas.</li>
  <li>Negra: 16 + 25 + 36 + 49 + 64 = <b>190</b>, una pirámide de cinco capas a la que le faltan las tres de arriba (1, 4 y 9): una pirámide truncada.</li>
</ul>
<p>Por eso la pirámide tiene varios números a la vez. En esta reconstrucción ataca con cualquiera de ellos y cae si la
atacan por el total o por la base.</p>

<h2>Las formas</h2>
<p>Las formas no tienen valor aritmético por sí mismas: sirven para distinguir de un vistazo las tres familias y
deciden cómo se mueve cada pieza. Cuanto más «alta» es la familia, más lejos llega: el círculo da un paso, el triángulo
dos y el cuadrado tres.</p>

<h2>Recuento</h2>
<table>
  <thead><tr><th></th><th class="num">Círculos</th><th class="num">Triángulos</th><th class="num">Cuadrados y pirámide</th><th class="num">Total</th></tr></thead>
  <tbody>
    <tr><th scope="row">Blancas</th><td class="num">140</td><td class="num">304</td><td class="num">868</td><td class="num">${ARMY_VALUE[WHITE]}</td></tr>
    <tr><th scope="row">Negras</th><td class="num">188</td><td class="num">404</td><td class="num">1160</td><td class="num">${ARMY_VALUE[BLACK]}</td></tr>
  </tbody>
</table>
<p>Las negras valen más, pero las blancas mueven primero y sus números pequeños (2, 4, 6) son atacantes temibles en
los asaltos. La victoria <i class="latin">de bonis</i> se mide en proporción al ejército enemigo para que ambos bandos
tengan la misma tarea.</p>
<p>Los primeros tratados escribían los números en cifras romanas. Aquí usamos cifras arábigas, pero al señalar una
pieza en la partida verás también su numeral romano.</p>
`,
  },
  {
    slug: 'mathematics',
    num: 'IV',
    title: 'Matemáticas',
    summary: 'Razones, medias y progresiones: la aritmética de Boecio y su parentesco con la música.',
    body: `
<p class="illuminated">La rithmomachia es una lección de aritmética disfrazada de batalla. Detrás de cada captura y de
cada triunfo hay una idea de la <i>De institutione arithmetica</i> de Boecio: las razones entre números y las tres
medias clásicas, la aritmética, la geométrica y la armónica.</p>

<h2>Las clases de razones</h2>
<p>Boecio, siguiendo a Nicómaco, clasifica las razones entre dos números. Si son iguales, hay
<i class="latin">aequalitas</i>. Si el mayor se compara con el menor, la desigualdad puede ser de cinco géneros; los
tres simples son los que construyen las piezas:</p>
<div class="table-wrap"><table>
  <thead><tr><th>Género</th><th>Forma</th><th>Ejemplos</th></tr></thead>
  <tbody>
    <tr><td><i class="latin">Multiplex</i></td><td class="math">n : 1</td><td>2 : 1 (<i>duplex</i>), 3 : 1 (<i>triplex</i>)</td></tr>
    <tr><td><i class="latin">Superparticularis</i></td><td class="math">(n+1) : n</td><td>3 : 2 (<i>sesquialtera</i>), 4 : 3 (<i>sesquitertia</i>), 9 : 8 (<i>sesquioctava</i>)</td></tr>
    <tr><td><i class="latin">Superpartiens</i></td><td class="math">(n+m) : n, m ≥ 2</td><td>5 : 3 (<i>superbipartiens tertias</i>), 7 : 4</td></tr>
  </tbody>
</table></div>
<p>Los otros dos géneros combinan los anteriores (<i class="latin">multiplex superparticularis</i>, como 5 : 2, y
<i class="latin">multiplex superpartiens</i>, como 8 : 3). Como se ve en el capítulo de las piezas, cada raíz genera
una escalera multiplex – superparticular – superpartiente.</p>

<h2>Tres medias, tres progresiones</h2>
<p>Dados dos números <span class="math">a</span> y <span class="math">c</span>, hay tres formas clásicas de
encontrar un término medio <span class="math">b</span>:</p>
<ul>
  <li><b>Aritmética</b>: la diferencia se conserva. <span class="math">b − a = c − b</span>, es decir <span class="math">b = (a + c) / 2</span>. Ejemplo: 2, 4, 6.</li>
  <li><b>Geométrica</b>: la razón se conserva. <span class="math">b / a = c / b</span>, es decir <span class="math">b² = a·c</span>. Ejemplo: 4, 6, 9.</li>
  <li><b>Armónica</b>: las diferencias guardan la razón de los extremos. <span class="math">(b − a) / (c − b) = a / c</span>, es decir <span class="math">b = 2ac / (a + c)</span>. Ejemplo: 6, 8, 12.</li>
</ul>
<p>Tres piezas en cualquiera de esas progresiones, seguidas y en campo enemigo, dan el triunfo. Prueba con dos
números:</p>
<div class="widget" data-widget="means"></div>

<h2>La proporción musical</h2>
<p>La media armónica se llama así por la música. Una cuerda de 12 unidades y otra de 6 suenan a distancia de octava
(12 : 6 = 2 : 1). Su media aritmética, 9, y su media armónica, 8, dividen esa octava en una cuarta (12 : 9 = 4 : 3) y
una quinta (12 : 8 = 3 : 2), y entre 9 y 8 queda el tono (9 : 8). La serie 6, 8, 9, 12, la proporción «musical» que la
tradición atribuía a Pitágoras, reúne las tres medias y las consonancias perfectas. No es casual que el triunfo
armónico se considerase el más noble.</p>

${FLEURON}

<h2>Las capturas como operaciones</h2>
<p>Las cuatro capturas recorren las operaciones básicas: el encuentro es la igualdad, la emboscada la suma, el asalto
la multiplicación (o, leído al revés, la división: el 30 «contiene» cinco veces al 6) y el asedio, la única captura
que no calcula, es pura geometría. Jugar bien es descomponer números en sumas y productos más rápido que el rival.</p>

<h2>Sumas de cuadrados</h2>
<p>La suma de los <span class="math">n</span> primeros cuadrados vale <span class="math">n(n+1)(2n+1)/6</span>. Para
<span class="math">n = 6</span> sale 6·7·13/6 = 91, la pirámide blanca. La negra es la suma hasta 8 (8·9·17/6 = 204)
menos la suma hasta 3 (14): 204 − 14 = 190.</p>

<h2>Progresiones en cada ejército</h2>
<p>¿Qué triunfos son posibles? Estos son todos los tríos de números distintos de cada ejército que forman progresión
(sin contar la pirámide):</p>
<div class="widget" data-widget="progressions"></div>
`,
  },
  {
    slug: 'strategy',
    num: 'V',
    title: 'Estrategia',
    summary: 'Consejos para no perder piezas tontamente y para ganarle a la máquina.',
    body: `
<p class="illuminated">La rithmomachia premia la vista larga. Las capturas no exigen contacto, así que el peligro puede
venir de muy lejos y de varias piezas a la vez. Estos consejos ayudan a sobrevivir a las primeras partidas.</p>

<h2>Antes de mover</h2>
<ul>
  <li><b>Mira las líneas abiertas.</b> El asalto no tiene límite de distancia: un triángulo 6 con cinco casillas vacías delante amenaza a un 30, y un círculo 4 con tres en diagonal, a un 12. Las columnas despejadas son autopistas.</li>
  <li><b>Cuenta las sumas.</b> Antes de dejar una pieza, comprueba qué parejas enemigas pueden alcanzar su casilla y si suman su valor.</li>
  <li><b>Mira todo el tablero.</b> Tras tu jugada caen todas las piezas enemigas capturables, no solo las que toca la pieza que mueves. Una sola jugada puede cobrar dos o tres capturas.</li>
  <li><b>Cuidado con los bordes.</b> Contra el borde hacen falta menos piezas para un asedio, y en una esquina bastan dos.</li>
</ul>

<h2>Durante la partida</h2>
<ul>
  <li><b>Los números pequeños son tus mejores atacantes.</b> Un 2 o un 3 multiplican bien en los asaltos; los grandes cuadrados son sobre todo botín.</li>
  <li><b>Trabaja por parejas.</b> Dos piezas que alcanzan las mismas casillas dominan una zona con sus sumas: cualquier pieza enemiga de ese valor que entre, cae en emboscada.</li>
  <li><b>Usa los saltos.</b> Triángulos y cuadrados pueden saltar por encima de las piezas: es la forma más rápida de cambiar de columna o de salir de un cerco.</li>
  <li><b>Adapta la caza a la victoria.</b> <i class="latin">De corpore</i>: todas las piezas valen lo mismo, así que caza las pequeñas y fáciles. <i class="latin">De bonis</i>: ve a por los cuadrados grandes aunque cueste.</li>
  <li><b>Protege la pirámide</b> si juegas con triunfo: perderla abre al rival la victoria propia. Su punto débil es la base (36 o 64), mucho más fácil de igualar que su total.</li>
  <li><b>Prepara el triunfo con tiempo.</b> Tras derribar la pirámide enemiga, acerca a campo contrario piezas que formen progresión: 2, 4, 6 o 4, 6, 8 con blancas; 3, 5, 7 o 5, 7, 9 con negras.</li>
</ul>

${FLEURON}

<h2>Conocer a la máquina</h2>
<ul>
  <li><b>Fácil</b> solo mira su jugada inmediata, con bastante azar, y a veces se distrae y mueve sin pensar.</li>
  <li><b>Normal</b> mira su jugada y tu respuesta, y tiene en cuenta las capturas que quedan preparadas.</li>
  <li><b>Difícil</b> busca con poda alfa-beta y profundización iterativa durante unos dos segundos y medio: suele ver tres o más medias jugadas. No perdona piezas sueltas.</li>
</ul>
<p>Las tres usan la misma evaluación: progreso hacia la victoria elegida, capturas preparadas y amenazas, seguridad de
la pirámide y avance de las piezas. Contra la difícil, lo mejor es no dejar nada a tiro y forzar intercambios en los
que salgas ganando.</p>
`,
  },
  {
    slug: 'glossary',
    num: 'VI',
    title: 'Glosario',
    summary: 'Términos latinos y técnicos del juego, de la aequalitas a la victoria excellentissima.',
    body: `
<dl class="glossary">
  <dt>Aequalitas</dt><dd>Igualdad entre dos números. Es la base de la captura por encuentro.</dd>
  <dt>Asalto</dt><dd>Captura por multiplicación: valor del atacante × casillas vacías intermedias = valor de la víctima.</dd>
  <dt>Asedio</dt><dd>Captura de una pieza rodeada por sus cuatro lados por piezas enemigas o por el borde.</dd>
  <dt>Boecio</dt><dd>Anicio Manlio Severino Boecio (c. 480–524), filósofo romano cuya <i>De institutione arithmetica</i> fue el manual de aritmética de la Edad Media.</dd>
  <dt>Círculo</dt><dd>La pieza más ligera. Sus números son las raíces y sus cuadrados. Mueve una casilla en diagonal.</dd>
  <dt>Cuadrado</dt><dd>La pieza de mayor valor. Sus números son <span class="math">(a+1)(2a+1)</span> y <span class="math">(2a+1)²</span>. Mueve tres casillas en línea recta o salta tres y una.</dd>
  <dt>Emboscada</dt><dd>Captura por suma: dos piezas que alcanzan la casilla de la víctima y suman su valor.</dd>
  <dt>Encuentro</dt><dd>Captura por igualdad: una pieza que alcanza la casilla de otra del mismo valor.</dd>
  <dt>Impares</dt><dd>El bando negro: sus raíces son 3, 5, 7 y 9.</dd>
  <dt>Ludus philosophorum</dt><dd>«El juego de los filósofos», otro nombre de la rithmomachia.</dd>
  <dt>Media armónica</dt><dd>El término <span class="math">b = 2ac/(a+c)</span> entre <span class="math">a</span> y <span class="math">c</span>. Entre 6 y 12, el 8.</dd>
  <dt>Multiplex</dt><dd>Razón en que el mayor contiene al menor un número exacto de veces: 2 : 1, 3 : 1…</dd>
  <dt>Pares</dt><dd>El bando blanco: sus raíces son 2, 4, 6 y 8.</dd>
  <dt>Pirámide</dt><dd>Pieza compuesta por capas que son cuadrados consecutivos: 91 la blanca, 190 la negra.</dd>
  <dt>Quadrivium</dt><dd>Las cuatro artes matemáticas de la educación medieval: aritmética, música, geometría y astronomía.</dd>
  <dt>Sesquialtera</dt><dd>La razón 3 : 2, «uno y medio». En música, la quinta.</dd>
  <dt>Superparticularis</dt><dd>Razón de la forma <span class="math">(n+1) : n</span>, como 3 : 2 o 4 : 3.</dd>
  <dt>Superpartiens</dt><dd>Razón de la forma <span class="math">(n+m) : n</span> con <span class="math">m ≥ 2</span>, como 5 : 3.</dd>
  <dt>Triángulo</dt><dd>La pieza intermedia. Sus números son <span class="math">a(a+1)</span> y <span class="math">(a+1)²</span>. Mueve dos casillas en línea recta o salta como el caballo.</dd>
  <dt>Triunfo</dt><dd>Victoria propia: tres piezas en progresión en campo enemigo. En latín, <i>victoria magna</i>.</dd>
  <dt>Victoria de bonis</dt><dd>«Por los bienes»: gana quien captura un valor determinado.</dd>
  <dt>Victoria de corpore</dt><dd>«Por los cuerpos»: gana quien captura un número determinado de piezas.</dd>
  <dt>Victoria de honore</dt><dd>«Por el honor»: piezas y valor a la vez.</dd>
  <dt>Victoria de lite</dt><dd>«Por el pleito»: en los tratados renacentistas, victoria que contaba también las cifras de los números capturados. No se usa en esta web.</dd>
  <dt>Victoria major, excellentissima</dt><dd>Triunfos superiores de los tratados: cuatro piezas con dos progresiones, o con las tres. No se usan en esta web.</dd>
</dl>
`,
  },
  {
    slug: 'sources',
    num: 'VII',
    title: 'Fuentes',
    summary: 'Los tratados antiguos, la bibliografía moderna y las decisiones de esta reconstrucción.',
    body: `
<p class="illuminated">Esta web es una divulgación, no una edición crítica. Para quien quiera ir a las fuentes, estas
son las obras principales.</p>

<h2>Textos antiguos</h2>
<ul>
  <li>Nicómaco de Gerasa, <i>Introducción a la aritmética</i> (s. II).</li>
  <li>Boecio, <i>De institutione arithmetica</i> (c. 500).</li>
  <li>Tomás Moro, <i>Utopía</i> (Lovaina, 1516), libro II.</li>
  <li>Claude de Boissière, <i>Le très excellent et ancien jeu pythagorique, dit Rythmomachie</i> (París, 1554).</li>
  <li>William Fulke y Ralph Lever, <i>The Most Noble, Ancient, and Learned Playe, Called the Philosophers Game</i> (Londres, 1563).</li>
  <li>Gustavus Selenus (Augusto de Brunswick-Luneburgo), <i>Das Schach- oder König-Spiel</i> (1616).</li>
</ul>

<h2>Estudios modernos</h2>
<ul>
  <li>Arno Borst, <i>Das mittelalterliche Zahlenkampfspiel</i> (Heidelberg, 1986).</li>
  <li>Ann E. Moyer, <i>The Philosophers' Game: Rithmomachia in Medieval and Renaissance Europe</i> (Ann Arbor, University of Michigan Press, 2001).</li>
  <li>Artículo «<a href="https://es.wikipedia.org/wiki/Rithmomachia">Rithmomachia</a>» de Wikipedia, con más bibliografía.</li>
</ul>

${FLEURON}

<h2>Sobre esta reconstrucción</h2>
<p>Las fuentes discrepan en casi todo: el tamaño del tablero, la colocación, los movimientos y el detalle de cada
captura. Estas son las decisiones de esta web, para que se pueda comparar con otras versiones:</p>
<ul>
  <li>Tablero de 8 × 16 y la colocación en cuña del capítulo de reglas, simétrica por giro de 180°.</li>
  <li>Triángulos y cuadrados se mueven en línea recta exacta (2 y 3 casillas) o con salto; los círculos, en diagonal.</li>
  <li>El asalto cuenta las casillas vacías entre las dos piezas y sigue las líneas de movimiento del atacante.</li>
  <li>La emboscada solo suma (algunas fuentes admiten también otras operaciones).</li>
  <li>La pirámide ataca con su total o cualquier capa y cae por su total o por su base, sin captura capa a capa.</li>
  <li>Las capturas se resuelven solas tras cada jugada, todas a la vez.</li>
  <li>El triunfo exige haber capturado la pirámide enemiga y tres piezas contiguas en línea en campo contrario.</li>
</ul>

<h2>Créditos</h2>
<p>Tipografías libres (SIL Open Font License): <b>EB Garamond</b>, del proyecto EB Garamond (Georg Duffner y Octavio
Pardo), y <b>UnifrakturMaguntia</b>, de j. «mach» wust a partir de un diseño de Peter Wiegel. El código de la web, el
motor de reglas y la máquina están escritos a mano, sin dependencias.</p>
`,
  },
];
