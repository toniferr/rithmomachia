// Page shell: routing (#/, #/play, #/codex/<chapter>), header, language, theme and the setup form.

import { t, getLang, setLang } from './i18n.js';
import { Game } from './game.js';
import { hydrate, heroBoard } from './diagrams.js';
import { loadGame, saveGame, loadSettings, saveSettings } from './store.js';
import { WHITE, BLACK, GOALS, ARMY_VALUE } from './engine.js';
import { chapters as chaptersEs } from './content/codex.es.js';
import { chapters as chaptersEn } from './content/codex.en.js';
import { PLATFORMS, TEXT as WHERE, REPO_URL, PRIVACY_UPDATED } from './content/platforms.js';

const CODEX = { es: chaptersEs, en: chaptersEn };
const main = document.getElementById('main');
let game = null;
let currentRoute = '';

// ------------------------------------------------------------------ helpers

function h(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children) if (c != null) e.append(c);
  return e;
}

const chapters = () => CODEX[getLang()];

// ------------------------------------------------------------------ chrome

function applyChrome(route) {
  document.documentElement.lang = getLang();
  document.getElementById('brand-sub').textContent = t('subtitle');
  for (const a of document.querySelectorAll('[data-nav]')) {
    a.textContent = t(`nav${a.dataset.nav[0].toUpperCase()}${a.dataset.nav.slice(1)}`);
    if (a.dataset.nav === route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  const lang = document.getElementById('lang');
  lang.textContent = t('langCode');
  lang.title = t('langToggle');
  lang.setAttribute('aria-label', t('langToggle'));
  const theme = document.getElementById('theme');
  theme.title = t('themeToggle');
  theme.setAttribute('aria-label', t('themeToggle'));
  document.getElementById('colophon').innerHTML = t('colophon');
}

function effectiveTheme() {
  const set = document.documentElement.dataset.theme;
  if (set) return set;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function initTheme() {
  try {
    const saved = localStorage.getItem('rithmo.theme');
    if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
  } catch { /* ignore */ }
  document.getElementById('theme').addEventListener('click', () => {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('rithmo.theme', next); } catch { /* ignore */ }
  });
}

// ------------------------------------------------------------------ setup form

function setupForm({ onStart, onCancel }) {
  const s = loadSettings();
  const radio = (name, value, label, sub) => h('label', { class: 'choice' },
    h('input', { type: 'radio', name, value, checked: (name === 'duration' ? s.length : s[name]) === value }),
    h('span', {}, h('b', {}, label), sub ? h('small', {}, sub) : null));
  const group = (legend, name, items) => h('fieldset', {}, h('legend', {}, legend),
    h('div', { class: 'choices' }, ...items.map(([v, l, sub]) => radio(name, v, l, sub))));

  const victorySubs = {};
  const victoryItem = (v, l) => {
    const el = radio('victory', v, l, ' ');
    victorySubs[v] = el.querySelector('small');
    return el;
  };
  const form = h('form', { class: 'setup' },
    group(t('setupColor'), 'color', [
      ['white', t('colorWhite'), t('colorWhiteSub')],
      ['black', t('colorBlack'), t('colorBlackSub')],
      ['random', t('colorRandom'), t('colorRandomSub')],
    ]),
    group(t('setupLevel'), 'level', [
      ['easy', t('levelEasy'), t('levelEasySub')],
      ['normal', t('levelNormal'), t('levelNormalSub')],
      ['hard', t('levelHard'), t('levelHardSub')],
    ]),
    h('fieldset', {}, h('legend', {}, t('setupVictory')), h('div', { class: 'choices' },
      victoryItem('corpore', t('victoryCorpore')), victoryItem('bonis', t('victoryBonis')), victoryItem('honore', t('victoryHonore')))),
    group(t('setupLength'), 'duration', [
      ['short', t('lengthShort')], ['normal', t('lengthNormal')], ['long', t('lengthLong')],
    ]),
    h('fieldset', {}, h('label', { class: 'check' },
      h('input', { type: 'checkbox', name: 'triumph', checked: !!s.triumph }),
      h('span', {}, h('b', {}, t('setupTriumph')), h('small', {}, t('setupTriumphSub'))))),
    h('div', { class: 'dialog-actions' },
      onCancel ? h('button', { class: 'btn', type: 'button', onclick: onCancel }, t('cancel')) : null,
      h('button', { class: 'btn primary', type: 'submit' }, t('start'))));

  const updateSubs = () => {
    // (not "length": form.elements.length is the number of controls)
    const g = GOALS[form.elements.duration.value] || GOALS.normal;
    victorySubs.corpore.textContent = t('victoryCorporeSub', { count: g.count });
    victorySubs.bonis.textContent = t('victoryBonisSub', {
      white: Math.ceil(g.share * ARMY_VALUE[BLACK]), black: Math.ceil(g.share * ARMY_VALUE[WHITE]),
    });
    victorySubs.honore.textContent = t('victoryHonoreSub');
  };
  form.addEventListener('change', updateSubs);
  updateSubs();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = form.elements;
    const settings = {
      color: f.color.value, level: f.level.value, victory: f.victory.value, length: f.duration.value, triumph: f.triumph.checked,
    };
    saveSettings(settings);
    const human = settings.color === 'random' ? (Math.random() < 0.5 ? WHITE : BLACK) : settings.color === 'black' ? BLACK : WHITE;
    onStart({
      options: { victory: settings.victory, length: settings.length, triumph: settings.triumph },
      human, level: settings.level, moves: [],
    });
  });
  return form;
}

function setupDialog({ onStart, onCancel }) {
  const dialog = h('dialog', { class: 'folio' });
  const close = () => { dialog.close(); dialog.remove(); };
  dialog.append(h('div', { class: 'dialog-body' }, h('h2', {}, t('newGame')),
    setupForm({ onStart: (cfg) => { close(); onStart(cfg); }, onCancel: () => { close(); onCancel?.(); } })));
  dialog.addEventListener('cancel', () => { dialog.remove(); onCancel?.(); });
  document.body.append(dialog);
  dialog.showModal();
}

function startGame(config) {
  saveGame(config);
  if (location.hash === '#/play') render(true);
  else location.hash = '#/play';
}

// ------------------------------------------------------------------ views

function homeView() {
  document.title = `${t('title')} · ${t('subtitle')}`;
  const boardBox = h('div', { class: 'hero-board' });
  const saved = loadGame();
  const setupPanel = h('section', { class: 'panel', id: 'setup' }, h('h2', {}, t('newGame')));
  if (saved) {
    setupPanel.append(h('div', { class: 'resume' }, h('span', {}, t('resumeText')),
      h('a', { class: 'btn small primary', href: '#/play' }, t('resume'))));
  }
  setupPanel.append(setupForm({ onStart: startGame }));

  const list = h('ol', { class: 'chapters' }, ...chapters().map((c) => h('li', {}, h('a', { href: `#/codex/${c.slug}` },
    h('span', { class: 'num' }, c.num), h('span', { class: 't' }, c.title), h('span', { class: 's' }, c.summary)))));

  const page = h('div', { class: 'folio home' },
    h('section', { class: 'hero' },
      h('div', {},
        h('h1', {}, t('title')),
        h('p', { class: 'tagline' }, t('heroTagline')),
        h('p', { class: 'lede' }, t('heroText')),
        h('p', {},
          h('a', { class: 'btn primary', href: '#setup', onclick: (e) => { e.preventDefault(); document.getElementById('setup').scrollIntoView({ behavior: 'smooth' }); } }, t('heroPlay')),
          ' ',
          h('a', { class: 'btn', href: '#/codex/rules' }, t('heroRead')))),
      boardBox),
    h('div', { class: 'home-grid' }, setupPanel,
      h('section', { class: 'panel' }, h('h2', {}, t('codexTitle')), h('p', {}, t('codexIntro')), list)));
  main.replaceChildren(page);
  heroBoard(boardBox);
}

function playView() {
  document.title = `${t('navPlay')} · ${t('title')}`;
  const config = loadGame();
  const host = h('div');
  main.replaceChildren(host);
  const openSetup = (cancelHome) => setupDialog({
    onStart: startGame,
    onCancel: cancelHome ? () => { location.hash = '#/'; } : null,
  });
  if (!config) {
    openSetup(true);
    return;
  }
  game = new Game(host, config, {
    onNewGame: () => openSetup(false),
    onRules: () => { location.hash = '#/codex/rules'; },
  });
}

// Chrome/Edge offer installation through this event; the "Install" button replays it.
let installPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installPrompt = e;
  document.querySelectorAll('[data-install]').forEach((b) => { b.hidden = false; });
});
window.addEventListener('appinstalled', () => { installPrompt = null; render(true); });

const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

function whereView() {
  const W = WHERE[getLang()];
  document.title = `${W.title} · ${t('title')}`;
  const cards = PLATFORMS.map((p) => {
    const txt = W.platforms[p.id];
    const live = p.status === 'available';
    const actions = h('div', { class: 'platform-actions' });
    if (p.url) actions.append(h('a', { class: 'btn small primary', href: p.id === 'web' ? '#/play' : p.url }, W.open));
    if (p.install) {
      if (isStandalone()) actions.append(h('small', {}, W.installed));
      else {
        const btn = h('button', {
          class: 'btn small primary', type: 'button', 'data-install': '', hidden: !installPrompt,
          onclick: async () => { if (!installPrompt) return; installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; btn.hidden = true; },
        }, W.install);
        actions.append(btn, h('a', { class: 'btn small', href: '#how' , onclick: (e) => { e.preventDefault(); document.getElementById('how').scrollIntoView({ behavior: 'smooth' }); } }, W.howTitle));
      }
    }
    const price = W.prices[p.price];
    return h('li', { class: `platform ${live ? 'live' : 'soon'}` },
      h('div', { class: 'platform-head' }, h('b', {}, txt.name), h('span', { class: 'badge' }, live ? W.available : W.soon)),
      h('p', {}, txt.desc),
      price ? h('p', { class: 'price' }, price) : null,
      live ? actions : null);
  });
  const page = h('div', { class: 'folio where' },
    h('h1', {}, W.title),
    h('p', { class: 'lede' }, W.lede),
    h('ul', { class: 'platforms' }, ...cards),
    h('h2', { id: 'price' }, W.priceTitle),
    ...W.price.map((x) => h('p', {}, x)),
    h('h2', { id: 'how' }, W.howTitle),
    h('dl', { class: 'glossary' }, ...W.how.flatMap(([k, v]) => [h('dt', {}, k), h('dd', {}, v)])),
    h('p', {}, h('i', {}, W.howNote)),
    h('h2', { id: 'privacy' }, W.privacyTitle),
    ...W.privacy.map((x) => h('p', {}, x)),
    h('p', {}, `${W.privacyContact} `, h('a', { href: `${REPO_URL}/issues` }, 'GitHub'), '.'),
    h('p', { class: 'latin' }, `${W.privacyUpdated}: ${PRIVACY_UPDATED}`));
  main.replaceChildren(page);
}

function codexView(slug) {
  const list = chapters();
  const index = Math.max(0, list.findIndex((c) => c.slug === slug));
  const ch = list[index];
  document.title = `${ch.title} · ${t('title')}`;
  const nav = h('nav', { class: 'codex-nav', 'aria-label': t('contents') }, h('h2', {}, t('navCodex')),
    h('ol', {}, ...list.map((c) => h('li', {}, h('a', { href: `#/codex/${c.slug}`, 'aria-current': c.slug === ch.slug ? 'page' : null },
      h('span', { class: 'n' }, c.num), c.title)))));
  const prev = list[index - 1], next = list[index + 1];
  const article = h('article', { class: 'chapter' },
    h('p', { class: 'kicker' }, `${t('chapter')} ${ch.num}`),
    h('h1', {}, ch.title),
    h('div', { html: ch.body }),
    h('div', { class: 'chapter-foot' },
      prev ? h('a', { href: `#/codex/${prev.slug}` }, `← ${prev.title}`) : h('span'),
      next ? h('a', { href: `#/codex/${next.slug}` }, `${next.title} →`) : h('span')));
  main.replaceChildren(h('div', { class: 'folio codex' }, nav, article));
  hydrate(article);
}

// ------------------------------------------------------------------ router

function render(force = false) {
  const hash = location.hash.startsWith('#/') ? location.hash.slice(2) : '';
  const [section, arg] = hash.split('/');
  const route = ['play', 'codex', 'where'].includes(section) ? section : 'home';
  const key = `${getLang()}|${hash}`;
  if (!force && key === currentRoute) return;
  const sameSection = currentRoute.split('|')[1]?.split('/')[0] === section;
  currentRoute = key;
  if (game) { game.destroy(); game = null; }
  applyChrome(route);
  if (route === 'play') playView();
  else if (route === 'codex') codexView(arg || 'history');
  else if (route === 'where') whereView();
  else homeView();
  if (!sameSection || route === 'codex') window.scrollTo(0, 0);
}

document.getElementById('lang').addEventListener('click', () => {
  setLang(getLang() === 'es' ? 'en' : 'es');
  render(true);
});

// "?lang=en" in a shared link picks the language.
const urlLang = new URLSearchParams(location.search).get('lang');
if (urlLang) setLang(urlLang);
else setLang(getLang());

initTheme();

// Offline support. Not on localhost, where a cache-first worker would hide every edit.
if ('serviceWorker' in navigator && !['localhost', '127.0.0.1'].includes(location.hostname)) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* the site works without it */ });
}
// In-page anchors (#main, #setup) are not routes.
window.addEventListener('hashchange', () => {
  if (!location.hash || location.hash.startsWith('#/')) render();
});
render(true);
