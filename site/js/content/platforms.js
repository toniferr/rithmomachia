// Where the game can be played, what it costs, and the privacy policy (the stores ask for one).
// To add a platform: add an entry to PLATFORMS and its texts to TEXT in both languages.

export const SITE_URL = 'https://toniferr.github.io/rithmomachia/';
export const REPO_URL = 'https://github.com/toniferr/rithmomachia';
export const PRIVACY_UPDATED = '2026-10-05';

// status: 'available' | 'soon'. price: a key of TEXT.prices. Pricing (user's decision, 2026-10-05): free
// everywhere, no ads, no in-app purchases; on itch.io, pay what you want.
export const PLATFORMS = [
  { id: 'web', status: 'available', price: 'free', url: SITE_URL },
  { id: 'app', status: 'available', price: 'free', install: true },
  { id: 'itch', status: 'available', price: 'pwyw', url: 'https://toniferr.itch.io/rithmomachia' },
  { id: 'play', status: 'soon', price: 'free' },
  { id: 'msstore', status: 'soon', price: 'free' },
];

export const TEXT = {
  es: {
    title: 'Dónde jugar',
    lede: 'Rithmomachia se juega en el navegador, sin registrarse ni descargar nada, y también se puede instalar como una aplicación que funciona sin conexión. Poco a poco llegará a otras plataformas; esta página dice siempre dónde está disponible y cuánto cuesta.',
    available: 'Disponible',
    soon: 'Próximamente',
    prices: { free: 'Gratis', pwyw: 'Gratis · paga lo que quieras' },
    priceTitle: 'Precio',
    price: [
      'Rithmomachia es gratis en todas partes: sin anuncios, sin compras dentro del juego y sin versiones de pago con más contenido.',
      'Si te gusta y quieres apoyarlo, en itch.io puedes pagar lo que quieras, desde cero.',
    ],
    open: 'Abrir',
    install: 'Instalar',
    installed: 'Ya está instalada en este dispositivo.',
    platforms: {
      web: { name: 'Navegador', desc: 'La versión completa en cualquier navegador moderno, en ordenador, tableta o móvil.' },
      app: { name: 'App instalable', desc: 'La misma web instalada como aplicación: icono propio, ventana sin barras y juego sin conexión.' },
      itch: { name: 'itch.io', desc: 'La tienda de juegos independientes.' },
      play: { name: 'Google Play', desc: 'Para móviles y tabletas Android.' },
      msstore: { name: 'Microsoft Store', desc: 'Para Windows.' },
    },
    howTitle: 'Cómo instalarla',
    how: [
      ['Chrome o Edge (Windows, macOS, Linux, Android)', 'Pulsa «Instalar» en esta página o, en el menú del navegador, «Instalar Rithmomachia» / «Añadir a pantalla de inicio».'],
      ['Safari en iPhone o iPad', 'Botón Compartir → «Añadir a pantalla de inicio».'],
      ['Safari en Mac', 'Menú Archivo → «Añadir al Dock».'],
    ],
    howNote: 'Una vez instalada, la app se actualiza sola cuando hay una versión nueva (al cerrarla y volver a abrirla).',
    privacyTitle: 'Privacidad',
    privacy: [
      'Rithmomachia no recoge ningún dato personal. No hay cuentas, ni cookies, ni publicidad, ni analítica, ni seguimiento de ningún tipo.',
      'El juego guarda en tu propio dispositivo (en el almacenamiento local del navegador) la partida en curso, las opciones de la última partida, el idioma, el tema y si las ayudas están activadas. Esos datos nunca salen de tu dispositivo y puedes borrarlos cuando quieras borrando los datos del sitio en tu navegador. Para funcionar sin conexión, el navegador guarda además una copia de los propios ficheros del juego.',
      'La web no hace peticiones a ningún servidor de terceros: las tipografías y todo el código se sirven desde el propio sitio. Los únicos enlaces externos (GitHub, Wikipedia) solo se abren si los pulsas.',
      'Las tiendas donde se publique pueden recoger sus propios datos según sus políticas.',
    ],
    privacyContact: 'Para cualquier pregunta, abre una incidencia en',
    privacyUpdated: 'Última actualización',
  },
  en: {
    title: 'Where to play',
    lede: 'Rithmomachia is played in the browser, with no sign-up and nothing to download, and it can also be installed as an app that works offline. Little by little it will reach other platforms; this page always tells where it is available and what it costs.',
    available: 'Available',
    soon: 'Coming soon',
    prices: { free: 'Free', pwyw: 'Free · pay what you want' },
    priceTitle: 'Price',
    price: [
      'Rithmomachia is free everywhere: no ads, no in-game purchases and no paid versions with extra content.',
      'If you like it and want to support it, on itch.io you can pay what you want, starting from nothing.',
    ],
    open: 'Open',
    install: 'Install',
    installed: 'Already installed on this device.',
    platforms: {
      web: { name: 'Browser', desc: 'The full version in any modern browser, on a computer, tablet or phone.' },
      app: { name: 'Installable app', desc: 'The same site installed as an app: its own icon, a window without bars, and offline play.' },
      itch: { name: 'itch.io', desc: 'The independent games store.' },
      play: { name: 'Google Play', desc: 'For Android phones and tablets.' },
      msstore: { name: 'Microsoft Store', desc: 'For Windows.' },
    },
    howTitle: 'How to install it',
    how: [
      ['Chrome or Edge (Windows, macOS, Linux, Android)', 'Press “Install” on this page or, in the browser menu, “Install Rithmomachia” / “Add to home screen”.'],
      ['Safari on iPhone or iPad', 'Share button → “Add to Home Screen”.'],
      ['Safari on Mac', 'File menu → “Add to Dock”.'],
    ],
    howNote: 'Once installed, the app updates itself when a new version is out (after closing and reopening it).',
    privacyTitle: 'Privacy',
    privacy: [
      'Rithmomachia collects no personal data. There are no accounts, cookies, ads, analytics or tracking of any kind.',
      'The game stores on your own device (in the browser’s local storage) the game in progress, the options of the last game, the language, the theme and whether hints are on. That data never leaves your device, and you can delete it at any time by clearing the site’s data in your browser. To work offline, the browser also keeps a copy of the game’s own files.',
      'The site makes no requests to third-party servers: the typefaces and all the code are served from the site itself. The only external links (GitHub, Wikipedia) open only if you click them.',
      'The stores where it is published may collect their own data under their own policies.',
    ],
    privacyContact: 'For any question, open an issue at',
    privacyUpdated: 'Last updated',
  },
};
