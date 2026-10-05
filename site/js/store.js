// Per-browser memory: the game in progress and the last settings. Storage can be missing or
// blocked (private windows), so every access is guarded and the site works without it.

const GAME = 'rithmo.game';
const SETTINGS = 'rithmo.settings';

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

export function loadGame() {
  const g = read(GAME);
  if (!g || !Array.isArray(g.moves) || (g.human !== 0 && g.human !== 1)) return null;
  if (!g.moves.every((m) => Number.isInteger(m) && m >= 0 && m < 1 << 14)) return null;
  return g;
}

export const saveGame = (g) => write(GAME, g);
export const clearGame = () => write(GAME, null);

export const DEFAULT_SETTINGS = { color: 'white', level: 'normal', victory: 'corpore', length: 'normal', triumph: true };

export function loadSettings() {
  return { ...DEFAULT_SETTINGS, ...(read(SETTINGS) || {}) };
}

export const saveSettings = (s) => write(SETTINGS, s);
